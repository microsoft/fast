import { fastAnchor } from "@microsoft/fast-components";
import { DesignSystem } from "@microsoft/fast-foundation";
import React from "react";
import { DndProvider } from "react-dnd";
import HTML5Backend from "react-dnd-html5-backend";
import ReactDOM from "react-dom";
import App from "./app";
/* eslint-disable-next-line */
const styles = require("@microsoft/site-utilities/src/components/editor/editor.style.css");

/**
 * Create the a style override
 */
const style: HTMLStyleElement = document.createElement("style");
style.innerText =
    "@font-face { font-family: SegoeUIVF; src: url(https://static.fast.design/assets/fonts/SegoeUI-Roman-VF_web.ttf) format(\"truetype\"); font-weight: \"1 1000\"; } @font-face { font-family: 'Segoe UI'; src: url('//c.s-microsoft.com/static/fonts/segoe-ui/west-european/Normal/latest.woff2') format('woff2'); } body, html { font-family: SegoeUIVF, Segoe UI, SegoeUI, Helvetica Neue, Helvetica, Arial, sans-serif; font-size: 12px; padding: 0; margin: 0; }";
document.head.appendChild(style);

DesignSystem.getOrCreate().register(fastAnchor());

/**
 * Primary render function for app. Called on store updates
 */
ReactDOM.render(
    <DndProvider backend={HTML5Backend}>
        <App />
    </DndProvider>,
    document.getElementById("root")
);
