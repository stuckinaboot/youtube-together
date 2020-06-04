import React, { useState, useEffect, useRef } from "react";
import "./video.scss";
import Modal from "react-modal";
import Tooltip from "@material-ui/core/Tooltip";
import Button from "@material-ui/core/Button";
import Box from "@material-ui/core/Box";
import HelpOutlineIcon from "@material-ui/icons/HelpOutline";

var player;
const Video = (props) => {
  const [videoID, setVideoID] = useState(props.videoID);
  const [initialVideoState, setInitialVideoState] = useState({
    currentTime: 0,
    shouldPause: false,
    timestamp: 0,
  });
  const updateTimeRef = useRef();

  const [isSpeakerState, setIsSpeakerState] = useState(props.leader);

  // Show modal only if not leader
  const [modalIsOpen, setIsOpen] = React.useState(!props.leader);

  const loadVideo = () => {
    if (player != null) {
      // Ensure we only load player once
      return;
    }

    player = new window.YT.Player("player", {
      videoId: videoID,
      playerVars: {
        // Mute non-leader users on the assumption that the leader
        // will be play able to autoplay + have sound (and if not it
        // should still be ok as sync will still work after leader starts
        // playing)
        // https://stackoverflow.com/questions/50495493/youtube-iframe-api-doesnt-autoplay
        // https://stackoverflow.com/questions/40685142/youtube-autoplay-not-working
        mute: props.leader ? 0 : 1,
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
    props.socket.on("message", (event) => {
      let data = event;
      if (data.event === "speaker") {
        setIsSpeakerState(false);
        player.mute();
      }
      if (data.event === "sync") updateVideo(data);
      if (data.event === "join") {
        join(data);

        // On join, ensure that we go to the correct time
        // in the video
        if (data.latestEvent != null) {
          setInitialVideoState({
            currentTime: data.latestEvent.currentTime,
            shouldPause: data.latestEvent.action === "pause",
            timestamp: data.latestEvent.timestamp,
          });
          if (modalIsOpen) {
            setIsOpen(false);
          }
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
    if (modalIsOpen) {
      setIsOpen(false);
    }
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
    // Update player mute (for some reason setting mute in
    // playerVars doesn't always work so we force it here)
    isSpeakerState ? player.unMute() : player.mute();
    if (initialVideoState.timestamp === 0) {
      // Implies we are first user to join
      player.playVideo();
      player.pauseVideo();
      return;
    }

    // Update time ref so that on play video state change
    // seekTo will get triggered
    updateTimeRef.current = {
      timestamp: initialVideoState.timestamp,
      currentTime: initialVideoState.currentTime,
    };
    player.playVideo();
    if (initialVideoState.shouldPause) {
      player.pauseVideo();
    }
  };

  const onStateChange = (event) => changeState(event.data);
  const sync = () => props.socket.emit("message", currentStatus());
  const seekTo = (second) => player.seekTo(second, true);
  const pauseVideo = () => player.pauseVideo();

  const playVideo = () => player.playVideo();
  const syncPause = () => {
    const timestamp = Date.now();
    let currTime = player.getCurrentTime();
    updateTimeRef.current = null;

    props.socket.emit("message", {
      event: "sync",
      action: "pause",
      currentTime: currTime,
      timestamp: timestamp,
    });
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

    return {
      event: "sync",
      action: "currenttime",
      videoID: videoID,
      currentTime: currTime,
      timestamp: Date.now(),
    };
  };

  const changeState = (triggered) => {
    if (triggered === 1) sync();
    else if (triggered === 2) syncPause();
  };

  function toggleIsSpeaker() {
    if (!isSpeakerState) {
      setIsSpeakerState(true);
      player.unMute();
      props.socket.emit("message", {
        event: "speaker",
        action: "update",
      });
    }
  }

  return (
    <>
      <div className="video">
        <div id="player">
          <h3>Loading...</h3>
        </div>
        <Modal isOpen={modalIsOpen} contentLabel="Example Modal">
          <div
            style={{
              textAlign: "center",
              marginTop: "auto",
              marginBottom: "auto",
              height: "100%",
              overflow: "hidden",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <h3 style={{ fontFamily: "Lato, sans-serif" }}>
              Waiting for {props.leaderName} to start video
            </h3>
          </div>
        </Modal>
      </div>
      <div style={{ width: "100%", textAlign: "center" }}>
        <br />
        <Box display="flex" alignItems="center" justifyContent="center">
          <Button variant="outlined" onClick={toggleIsSpeaker}>
            {isSpeakerState
              ? "Playing out of your speakers"
              : "Can't hear audio? Press to play out of your speakers"}
          </Button>
          <Tooltip title="Audio sync only works when you have sound playing from one person's laptop speaker. Pass the speaker around as your friends join and leave">
            <HelpOutlineIcon />
          </Tooltip>
        </Box>
      </div>
    </>
  );
};

export default Video;
