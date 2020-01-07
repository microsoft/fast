/**
 * This file is responsible for rendering the plugin dialog / UI. This script is executed
 * within an iframe so it has limited access to the Figma document, and must rely on mostMessage APIs
 * to communicate with the parent script.
 */
import React from "react";
import ReactDOM from "react-dom";

const root: HTMLDivElement = document.createElement("div");
document.body.appendChild(root);

function UserInterface(): JSX.Element {
    return (
        <div>
            <h1>Hello world</h1>
        </div>
    );
}

// Render UI
ReactDOM.render(<UserInterface />, root);
