import React from "react";
import ReactDOM from "react-dom";
import { DesignSystem } from "@microsoft/fast-foundation";
import {
    fluentButton,
    fluentDesignSystemProvider,
    fluentDivider,
    fluentRadio,
    fluentRadioGroup,
} from "@fluentui/web-components";
import { PluginUI, PluginUIProps } from "./core/ui";
import { PluginUINodeData } from "./core/ui/ui-controller";
import {
    deserializeUINodes,
    PluginUISerializableNodeData,
    serializeUINodes,
} from "./figma/controller";

DesignSystem.getOrCreate()
    .withPrefix("plugin")
    .register(
        fluentButton(),
        fluentDesignSystemProvider(),
        fluentDivider(),
        fluentRadio(),
        fluentRadioGroup()
    );

/* eslint-disable */
const styles = require("./global.css");
/* eslint-enable */

/**
 * Dispatches UI updates to the host Controller
 * @param nodes The return node data
 */
function dispatchMessage(nodes: PluginUINodeData[]): void {
    parent.postMessage({ pluginMessage: serializeUINodes(nodes) }, "*");
}

const root = document.querySelector("plugin-design-system-provider");

function render(props?: Omit<PluginUIProps, "dispatch">): void {
    ReactDOM.render(<PluginUI {...props} dispatch={dispatchMessage} />, root);
}

/**
 * Update UI from Controller's message
 */
window.onmessage = (e: any): void => {
    const nodes = e.data.pluginMessage.selectedNodes as Array<
        PluginUISerializableNodeData
    >;
    const deserializedNodes = deserializeUINodes(nodes);
    render({ selectedNodes: deserializedNodes });
};

// Render UI
render();
