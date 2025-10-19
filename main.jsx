import { jsxDEV } from "react/jsx-dev-runtime";
import React, { useRef } from "react";
import { createRoot } from "react-dom/client";
import { Player } from "@websim/remotion/player";
import { ReplayComposition } from "./composition.jsx";
import { CustomPlayerControls } from "./CustomPlayerControls.jsx";
import { usePlayerState } from "remotion/client";
const rootElement = document.getElementById("player-root");
const root = createRoot(rootElement);
let replayData = null;
const ReplayPlayer = ({ data }) => {
  const playerRef = useRef(null);
  if (!data || !data.frames || data.frames.length === 0) {
    return /* @__PURE__ */ jsxDEV("div", { children: "Error: No replay data available." }, void 0, false, {
      fileName: "<stdin>",
      lineNumber: 16,
      columnNumber: 16
    });
  }
  const durationInSeconds = (data.frames[data.frames.length - 1].timestamp - data.frames[0].timestamp) / 1e3;
  const durationInFrames = Math.ceil(durationInSeconds * 30) + 90;
  const playerState = usePlayerState(playerRef);
  const renderShareButton = ({ renderMedia, isRendering, renderProgress, status }) => {
    const styles = {
      shareButton: {
        background: "none",
        border: "none",
        color: "white",
        fontSize: "20px",
        cursor: isRendering ? "default" : "pointer",
        padding: "0",
        marginLeft: "auto",
        width: "24px",
        position: "relative",
        display: "flex",
        alignItems: "center",
        justifyContent: "center"
      },
      renderProgressCircle: {
        width: "24px",
        height: "24px"
      }
    };
    const renderIcon = () => {
      if (status === "rendering") {
        return /* @__PURE__ */ jsxDEV("div", { style: styles.renderProgressCircle, children: /* @__PURE__ */ jsxDEV("svg", { viewBox: "0 0 36 36", style: { position: "absolute", top: 0, left: 0, transform: "rotate(-90deg)" }, children: [
          /* @__PURE__ */ jsxDEV("path", { d: "M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831", fill: "none", stroke: "rgba(255,255,255,0.3)", strokeWidth: "4" }, void 0, false, {
            fileName: "<stdin>",
            lineNumber: 51,
            columnNumber: 29
          }),
          /* @__PURE__ */ jsxDEV("path", { d: "M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831", fill: "none", stroke: "#e94560", strokeWidth: "4", strokeDasharray: `${renderProgress * 100}, 100` }, void 0, false, {
            fileName: "<stdin>",
            lineNumber: 52,
            columnNumber: 29
          })
        ] }, void 0, true, {
          fileName: "<stdin>",
          lineNumber: 50,
          columnNumber: 25
        }) }, void 0, false, {
          fileName: "<stdin>",
          lineNumber: 49,
          columnNumber: 21
        });
      }
      if (status === "done") return /* @__PURE__ */ jsxDEV("i", { className: "fas fa-check-circle", style: { color: "#4CAF50" } }, void 0, false, {
        fileName: "<stdin>",
        lineNumber: 57,
        columnNumber: 43
      });
      if (status === "error") return /* @__PURE__ */ jsxDEV("i", { className: "fas fa-times-circle", style: { color: "#e94560" } }, void 0, false, {
        fileName: "<stdin>",
        lineNumber: 58,
        columnNumber: 44
      });
      return /* @__PURE__ */ jsxDEV("i", { className: "fas fa-share-nodes" }, void 0, false, {
        fileName: "<stdin>",
        lineNumber: 59,
        columnNumber: 20
      });
    };
    return /* @__PURE__ */ jsxDEV(
      "button",
      {
        "aria-label": "Share or Render Video",
        style: styles.shareButton,
        onClick: renderMedia,
        disabled: isRendering,
        children: renderIcon()
      },
      void 0,
      false,
      {
        fileName: "<stdin>",
        lineNumber: 63,
        columnNumber: 13
      }
    );
  };
  return /* @__PURE__ */ jsxDEV("div", { style: { position: "relative", width: "100%", height: "100%" }, children: [
    /* @__PURE__ */ jsxDEV(
      Player,
      {
        ref: playerRef,
        component: ReplayComposition,
        durationInFrames,
        fps: 30,
        compositionWidth: 540,
        compositionHeight: 960,
        loop: true,
        controls: false,
        autoplay: true,
        inputProps: { replayData: data },
        style: { width: "100%", height: "100%" },
        numberOfSharedAudioTags: 100,
        className: "replay-player",
        render: renderShareButton
      },
      void 0,
      false,
      {
        fileName: "<stdin>",
        lineNumber: 76,
        columnNumber: 13
      }
    ),
    /* @__PURE__ */ jsxDEV(
      CustomPlayerControls,
      {
        playerRef,
        playerState
      },
      void 0,
      false,
      {
        fileName: "<stdin>",
        lineNumber: 92,
        columnNumber: 13
      }
    )
  ] }, void 0, true, {
    fileName: "<stdin>",
    lineNumber: 75,
    columnNumber: 9
  });
};
const renderPlayer = (data) => {
  root.render(/* @__PURE__ */ jsxDEV(ReplayPlayer, { data }, void 0, false, {
    fileName: "<stdin>",
    lineNumber: 101,
    columnNumber: 17
  }));
};
window.addEventListener("showReplay", (e) => {
  replayData = e.detail;
  renderPlayer(replayData);
});
window.addEventListener("hideReplay", () => {
  root.render(null);
});
