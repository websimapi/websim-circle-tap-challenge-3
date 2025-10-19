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
        className: "replay-player"
      },
      void 0,
      false,
      {
        fileName: "<stdin>",
        lineNumber: 26,
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
        lineNumber: 41,
        columnNumber: 13
      }
    )
  ] }, void 0, true, {
    fileName: "<stdin>",
    lineNumber: 25,
    columnNumber: 9
  });
};
const renderPlayer = (data) => {
  root.render(/* @__PURE__ */ jsxDEV(ReplayPlayer, { data }, void 0, false, {
    fileName: "<stdin>",
    lineNumber: 50,
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
