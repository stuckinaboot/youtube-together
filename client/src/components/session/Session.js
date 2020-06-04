import React, { useEffect } from "react";
import { useParams } from "react-router-dom";
import { useHistory } from "react-router-dom";
import Video from "../video/Video";
import socketIOClient from "socket.io-client";

const Session = (props) => {
  const history = useHistory();

  const url = `${window.location.protocol}//${
    window.location.hostname
  }:${8000}/`;
  const socket = socketIOClient(url);
  console.log("hit this shit", socket, url);
  let sessID = props.sessionID;

  let { sessionID, leaderName } = useParams();

  if (!sessID) {
    sessID = sessionID;
  }

  useEffect(() => {
    socket.on("connect", () =>
      socket.emit(
        "message",
        JSON.stringify({
          event: "session",
          action: props.action,
          sessionID: sessID,
          videoID: props.videoID,
        })
      )
    );
  });
  if (sessionID === "leader" && !props.leader) {
    history.push("/");
  }
  return (
    <Video
      videoID={props.videoID}
      leader={props.leader}
      leaderName={leaderName || "leader"}
      sessionID={sessID}
      socket={socket}
    />
  );
};

export default Session;
