import React, { useState, useEffect, useRef } from "react";
import "./video.scss";

var player;
const Video = (props) => {
  const [videoID, setVideoID] = useState(props.videoID);
  const [initialVideoState, setInitialVideoState] = useState({
    currentTime: 0,
    shouldPause: false,
    timestamp: 0,
  });
  const updateTimeRef = useRef();

  const loadVideo = () => {
    player = new window.YT.Player("player", {
      videoId: videoID,
      playerVars: {
        // Mute the user because if the user is unmuted,
        // we can't autoplay the video for that user
        // https://stackoverflow.com/questions/40685142/youtube-autoplay-not-working
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
    if (player == null || player.getPlayerState == null) {
      // the above should not be null by this point but if it is return
      // as the code will crash below
      return;
    }
    let videoStatus = player.getPlayerState();

    if (
      data.action === "currenttime" &&
      (videoStatus === 2 || videoStatus === -1)
    ) {
      updateTimeRef.current = {
        currentTime: data.currentTime,
        timestamp: data.timestamp,
      };

      playVideo();
    } else if (data.action === "pause" && videoStatus !== 2) pauseVideo();
  };

  const onPlayerReady = (event) => {
    if (initialVideoState.timestamp === 0) {
      // Implies we are first user to join
      event.target.playVideo();
      updateTimeRef.current = {
        timestamp: Date.now(),
        currentTime:
          event.target.getCurrentTime != null
            ? event.target.getCurrentTime()
            : 0,
      };
      return;
    }

    // Update time ref so that on play video state change
    // seekTo will get triggered
    updateTimeRef.current = {
      timestamp: initialVideoState.timestamp,
      currentTime: initialVideoState.currentTime,
    };
    event.target.playVideo();
    if (initialVideoState.shouldPause) {
      event.target.pauseVideo();
    }
  };

  const onStateChange = (event) => changeState(event.data);
  const sync = () => props.socket.send(currentStatus());
  const seekTo = (second) => player.seekTo(second, true);
  const pauseVideo = () => player.pauseVideo();

  const playVideo = () => player.playVideo();
  const syncPause = () => {
    const timestamp = Date.now();
    let currTime = player.getCurrentTime();
    updateTimeRef.current = null;

    props.socket.send(
      JSON.stringify({
        event: "sync",
        action: "pause",
        currentTime: currTime,
        timestamp: timestamp,
      })
    );
  };

  const currentStatus = () => {
    let currTime = player.getCurrentTime();
    if (updateTimeRef.current != null) {
      const timeDiff = (Date.now() - updateTimeRef.current.timestamp) / 1000;
      const expectedCurrTime = updateTimeRef.current.currentTime + timeDiff;

      if (Math.abs(expectedCurrTime - currTime) > 0.1) {
        currTime = updateTimeRef.current.currentTime + timeDiff;
        seekTo(currTime, true);
      }
    }

    return JSON.stringify({
      event: "sync",
      action: "currenttime",
      videoID: videoID,
      currentTime: currTime,
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
