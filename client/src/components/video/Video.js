import React, { useState, useEffect } from "react";
import "./video.scss";

var player;
const Video = (props) => {
  const [videoID, setVideoID] = useState(props.videoID);
  const [initialVideoState, setInitialVideoState] = useState({
    currentTime: 0,
    shouldPause: false,
    timestamp: 0,
  });

  const loadVideo = () => {
    player = new window.YT.Player("player", {
      videoId: videoID,
      playerVars: {
        mute: 1,
      },
      events: {
        onReady: onPlayerReady,
        onStateChange: onStateChange,
      },
    });
  };

  const join = (data) => {
    setVideoID(data.videoID);
  };

  useEffect(() => {
    props.socket.addEventListener("message", (event) => {
      let data = JSON.parse(event.data);

      if (data.event === "sync") updateVideo(data);
      if (data.event === "join") {
        join(data);

        // On join, ensure that we go to the correct time
        // in the video
        // TODO this logic may be wrong
        if (data.latestEvent != null) {
          setInitialVideoState({
            currentTime: data.latestEvent.currentTime,
            shouldPause: data.latestEvent.action === "pause",
            timestamp: data.latestEvent.timestamp,
          });
        }
      }
    });
    if (videoID !== null) {
      if (!window.YT) {
        const tag = document.createElement("script");
        tag.src = "https://www.youtube.com/iframe_api";

        window.onYouTubeIframeAPIReady = loadVideo;

        const firstScriptTag = document.getElementsByTagName("script")[0];
        firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
      } else loadVideo();
    }
  });

  const updateVideo = (data) => {
    let videoStatus = player.getPlayerState();

    if (
      data.action === "currenttime" &&
      (videoStatus === 2 || videoStatus === -1)
    ) {
      playVideo();
      seekTo(data.currentTime);
    } else if (data.action === "pause" && videoStatus !== 2) pauseVideo();
  };

  const onPlayerReady = (event) => {
    event.target.playVideo();

    if (initialVideoState.timestamp === 0) {
      // Implies we are first user to join
      return;
    }

    // The time we want to be at is the time in video
    // when currentTime occurred plus the duration after currentTime,
    // in seconds
    const updatedCurrentTime =
      initialVideoState.currentTime +
      (Date.now() - initialVideoState.timestamp) / 1000;

    event.target.seekTo(updatedCurrentTime, true);
    if (initialVideoState.shouldPause) {
      event.target.pauseVideo();
    }
  };

  const onStateChange = (event) => {
    changeState(event.data);
  };
  const sync = () => props.socket.send(currentStatus());
  const seekTo = (second) => player.seekTo(second, true);
  const pauseVideo = () => player.pauseVideo();

  const playVideo = () => player.playVideo();
  const syncPause = () => {
    props.socket.send(
      JSON.stringify({
        event: "sync",
        action: "pause",
        currentTime: player.getCurrentTime(),
        timestamp: Date.now(),
      })
    );
  };
  const currentStatus = () => {
    return JSON.stringify({
      event: "sync",
      action: "currenttime",
      videoID: videoID,
      currentTime: player.getCurrentTime(),
      timestamp: Date.now(),
    });
  };

  const changeState = (triggered) => {
    if (triggered === 1) sync();
    else if (triggered === 2) syncPause();
  };

  return (
    <div className="video">
      <div id="player">
        <h3>Loading...</h3>
      </div>
    </div>
  );
};

export default Video;
