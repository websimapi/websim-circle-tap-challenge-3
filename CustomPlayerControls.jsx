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
  const [isRendering, setIsRendering] = useState(false);
  const [renderProgress, setRenderProgress] = useState(0);
  const [renderStatus, setRenderStatus] = useState(null);
  useEffect(() => {
    const player = playerRef.current;
    if (!player) return;
    const onRenderStart = () => {
      setIsRendering(true);
      setRenderStatus("rendering");
      setRenderProgress(0);
    };
    const onRenderProgress = (e) => setRenderProgress(e.progress);
    const onRenderSuccess = () => {
      setIsRendering(false);
      setRenderStatus("done");
      setTimeout(() => setRenderStatus(null), 3e3);
    };
    const onRenderError = () => {
      setIsRendering(false);
      setRenderStatus("error");
      setTimeout(() => setRenderStatus(null), 3e3);
    };
    player.addEventListener("render-start", onRenderStart);
    player.addEventListener("render-progress", onRenderProgress);
    player.addEventListener("render-success", onRenderSuccess);
    player.addEventListener("render-error", onRenderError);
    return () => {
      player.removeEventListener("render-start", onRenderStart);
      player.removeEventListener("render-progress", onRenderProgress);
      player.removeEventListener("render-success", onRenderSuccess);
      player.removeEventListener("render-error", onRenderError);
    };
  }, [playerRef]);
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
  const handleRender = useCallback(async () => {
    if (isRendering) return;
    try {
      await playerRef.current?.render();
    } catch (err) {
      console.error("Render failed:", err);
    }
  }, [playerRef, isRendering]);
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
      zIndex: 1
    },
    topControls: {
      display: "flex",
      alignItems: "center",
      gap: "12px"
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
    shareButton: {
      background: "none",
      border: "none",
      color: "white",
      fontSize: "20px",
      cursor: "pointer",
      padding: "0",
      marginLeft: "auto",
      width: "24px",
      position: "relative"
    },
    timelineContainer: {
      width: "100%",
      height: "10px",
      backgroundColor: "rgba(255, 255, 255, 0.3)",
      borderRadius: "5px",
      cursor: "pointer",
      position: "relative"
    },
    timelineProgress: {
      height: "100%",
      backgroundColor: "#e94560",
      borderRadius: "5px"
    },
    spinner: {
      animation: "spin 1s linear infinite"
    },
    renderProgressCircle: {
      position: "absolute",
      top: "50%",
      left: "50%",
      transform: "translate(-50%, -50%)",
      width: "24px",
      height: "24px"
    }
  };
  const renderIcon = () => {
    if (renderStatus === "rendering") {
      return jsx("div", {
        style: styles.renderProgressCircle,
        children: [
          jsx("svg", {
            viewBox: "0 0 36 36",
            style: { position: "absolute", top: 0, left: 0, transform: "rotate(-90deg)" },
            children: jsx("path", {
              d: "M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831",
              fill: "none",
              stroke: "rgba(255,255,255,0.3)",
              strokeWidth: "4"
            })
          }),
          jsx("svg", {
            viewBox: "0 0 36 36",
            style: { position: "absolute", top: 0, left: 0, transform: "rotate(-90deg)" },
            children: jsx("path", {
              d: "M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831",
              fill: "none",
              stroke: "#e94560",
              strokeWidth: "4",
              strokeDasharray: `${renderProgress * 100}, 100`
            })
          })
        ]
      });
    }
    if (renderStatus === "done") return jsx("i", { className: "fas fa-check-circle", style: { color: "#4CAF50" } });
    if (renderStatus === "error") return jsx("i", { className: "fas fa-times-circle", style: { color: "#e94560" } });
    return jsx("i", { className: "fas fa-share-nodes" });
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
          }),
          jsx("button", {
            "aria-label": "Share or Render Video",
            style: styles.shareButton,
            onClick: handleRender,
            disabled: isRendering,
            children: renderIcon()
          })
        ]
      }),
      jsx("style", { children: `@keyframes spin { 100% { transform: rotate(360deg); } }` })
    ]
  });
};
export {
  CustomPlayerControls
};
