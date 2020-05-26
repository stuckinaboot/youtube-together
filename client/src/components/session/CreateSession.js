import React from "react";
import { useHistory, useParams } from "react-router-dom";

const CreateSession = (props) => {
  const history = useHistory();

  const { sessionID, videoUrl } = useParams();

  const handleSubmit = () => {
    const decodedVideoUrl = decodeURIComponent(videoUrl);
    var videoID = youtubeParser(decodedVideoUrl);
    if (!videoID) {
      return;
    }
    props.session(videoID, sessionID, true);
    history.push("/watch/leader");
  };

  const youtubeParser = (url) => {
    var regExp = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#&?]*).*/;
    var match = url.match(regExp);
    return match && match[7].length === 11 ? match[7] : false;
  };

  return <div>{handleSubmit()}</div>;
};

export default CreateSession;
