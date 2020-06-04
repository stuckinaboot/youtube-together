const path = require("path");
const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const fs = require("fs");
const app = express();
const socketio = require("socket.io");
dotenv.config({ path: "./config/config.env" });

/**
 * Start the youtube together server.
 * If httpsConfig has key and cert defined, attempt to
 * start server using https
 * @param {{keyFilePath: string, certFilePath: string, caFilePath}} httpsConfig
 * @param port port number to run server on
 */
module.exports = function startYoutubeTogetherServer(httpsConfig, port) {
  //Body parser
  app.use(express.json());
  app.use(cors());

  const BUILD_PATH = path.join(__dirname, "../client", "build");
  const INDEX_HTML_PATH = path.join(BUILD_PATH, "index.html");

  app.use(express.static(path.join(__dirname, "../client", "build")));

  const PORT = port || process.env.PORT || 8000;

  const server =
    httpsConfig != null &&
    httpsConfig.keyFilePath != null &&
    httpsConfig.certFilePath != null
      ? // Use https
        require("https").createServer({
          key: fs.readFileSync(httpsConfig.keyFilePath),
          cert: fs.readFileSync(httpsConfig.certFilePath),
          ca:
            httpsConfig.caFilePath != null
              ? fs.readFileSync(httpsConfig.caFilePath)
              : undefined,
        })
      : // Use http
        require("http").createServer();

  app.get("/*", (_, res) => res.sendFile(INDEX_HTML_PATH));
  server.on("request", app);

  const serverListener = server.listen(PORT, () => {
    console.log(`Listening on ${PORT}!`);
  });
  const io = socketio(serverListener);

  let sessions = [];

  io.on("connection", (ws) => {
    ws.on("message", (message) => {
      console.log(message);
      handleMessage(message, ws);
    });
  });

  const brodcastMessage = (data, users, ws) => {
    users.forEach((user) => {
      if (user.ws != ws) user.ws.emit("message", data);
    });
  };

  const handleMessage = (data, ws) => {
    let event = data.event;
    if (event === "session") handleSessionEvent(data, ws);
    else if (event === "sync") handleSyncEvent(data, ws);
    else if (event === "speaker") handleSpeakerEvent(data, ws);
  };

  const sessionById = (id) => {
    let sessionFound;

    sessions.forEach((session) => {
      if (session.sessionID === id) {
        sessionFound = session;
      }
    });

    return sessionFound;
  };

  const handleSyncEvent = (data, ws) => {
    sessions.forEach((session) => {
      session.users.forEach((user) => {
        // TODO this whole double loop is inefficient
        if (user.ws == ws) {
          brodcastMessage(data, session.users, ws);
          session.latestEvent = {
            action: data.action,
            timestamp: data.timestamp,
            currentTime: data.currentTime,
          };
        }
      });
    });
  };

  const handleSpeakerEvent = (data, ws) => {
    sessions.forEach((session) => {
      session.users.forEach((user) => {
        // TODO this whole double loop is inefficient
        // and is same as sync event loop (but does
        // not update latestEvent, which is CORRECT as
        // we do not care about recording the speaker event)
        if (user.ws == ws) {
          brodcastMessage(data, session.users, ws);
        }
      });
    });
  };

  const joinSession = (data, ws) => {
    let session = sessionById(data.sessionID);

    if (session) {
      session.users.push({ ws: ws });
      var totalusers = session.users.length;
      ws.emit("message", {
        event: "join",
        videoID: session.videoID,
        users: totalusers,
        latestEvent: session.latestEvent,
      });
      brodcastMessage(
        {
          event: "users",
          users: totalusers,
        },
        session.users,
        ws
      );
    } else createSession(data, ws);
  };

  const handleSessionEvent = (data, ws) => {
    let action = data.action;
    if (action === "create") createSession(data, ws);
    else if (action === "join") joinSession(data, ws);
  };

  const createSession = (data, ws) => {
    sessions.push({
      sessionID: data.sessionID,
      users: [{ ws: ws }],
      videoID: data.videoID,
      latestEvent: null,
    });
  };

  return serverListener;
};
