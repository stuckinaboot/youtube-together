import React, { useEffect } from "react";
import { useParams } from "react-router-dom";
import { useHistory } from "react-router-dom";
import Video from "../video/Video";
import getConfig from "../../configs/getConfig";

const config = getConfig();

const Session = (props) => {
  const history = useHistory();
  const url = `ws://${config.sockets.host}:${config.sockets.port}/`;
  const socket = new WebSocket(url);
  let sessID = props.sessionID;

  let { sessionID } = useParams();
  if (!sessID) {
    sessID = sessionID;
  }

  useEffect(() => {
    socket.onopen = () => {
      socket.send(
        JSON.stringify({
          event: "session",
          action: props.action,
          sessionID: sessID,
          videoID: props.videoID,
        })
      );
    };
  });
  if (sessionID === "leader" && !props.leader) {
    history.push("/");
  }
  return (
    <Video
      videoID={props.videoID}
      leader={props.leader}
      sessionID={sessID}
      socket={socket}
    />
  );
};

export default Session;
