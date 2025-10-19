import React, { useState, useCallback, useEffect } from "react";
import { jsx } from "react/jsx-runtime";
const formatTime = (frame, fps) => {
  if (typeof frame !== "number" || typeof fps !== "number" || fps === 0) {
    return "00:00";
  }
  const totalSeconds = Math.floor(frame / fps);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
};
const CustomPlayerControls = ({ playerRef, playerState }) => {
  const { frame, playing, durationInFrames, fps } = playerState;
  const handlePlayPause = useCallback(() => {
    if (playing) {
      playerRef.current?.pause();
    } else {
      playerRef.current?.play();
    }
  }, [playing, playerRef]);
  const handleSeek = useCallback((e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const progress = x / rect.width;
    const targetFrame = Math.round(progress * durationInFrames);
    playerRef.current?.seekTo(targetFrame);
  }, [durationInFrames, playerRef]);
  const progressPercent = durationInFrames > 0 ? frame / durationInFrames * 100 : 0;
  const styles = {
    controlsContainer: {
      position: "absolute",
      bottom: "10px",
      left: "10px",
      right: "10px",
      backgroundColor: "rgba(0, 0, 0, 0.6)",
      borderRadius: "10px",
      padding: "8px 12px",
      display: "flex",
      flexDirection: "column",
      gap: "8px",
      color: "white",
      fontFamily: "Arial, sans-serif",
      zIndex: 1,
      pointerEvents: "none"
      // Let clicks for share button etc pass through
    },
    topControls: {
      display: "flex",
      alignItems: "center",
      gap: "12px",
      pointerEvents: "auto"
    },
    playPauseBtn: {
      background: "none",
      border: "none",
      color: "white",
      fontSize: "24px",
      cursor: "pointer",
      padding: "0",
      width: "24px",
      textAlign: "center"
    },
    timeDisplay: {
      fontSize: "14px",
      minWidth: "90px"
    },
    timelineContainer: {
      width: "100%",
      height: "10px",
      backgroundColor: "rgba(255, 255, 255, 0.3)",
      borderRadius: "5px",
      cursor: "pointer",
      position: "relative",
      pointerEvents: "auto"
    },
    timelineProgress: {
      height: "100%",
      backgroundColor: "#e94560",
      borderRadius: "5px"
    }
  };
  return jsx("div", {
    style: styles.controlsContainer,
    children: [
      jsx("div", {
        style: styles.timelineContainer,
        onClick: handleSeek,
        children: jsx("div", {
          style: { ...styles.timelineProgress, width: `${progressPercent}%` }
        })
      }),
      jsx("div", {
        style: styles.topControls,
        children: [
          jsx("button", {
            "aria-label": playing ? "Pause" : "Play",
            style: styles.playPauseBtn,
            onClick: handlePlayPause,
            children: jsx("i", { className: `fas ${playing ? "fa-pause" : "fa-play"}` })
          }),
          jsx("div", {
            style: styles.timeDisplay,
            children: `${formatTime(frame, fps)} / ${formatTime(durationInFrames, fps)}`
          })
          // The Share button is now rendered by the Player's render prop
        ]
      })
    ]
  });
};
export {
  CustomPlayerControls
};
