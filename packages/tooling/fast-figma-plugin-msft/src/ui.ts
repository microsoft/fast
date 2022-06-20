import { DesignSystem } from "@microsoft/fast-foundation";
import {
    fluentButton,
    fluentDesignSystemProvider,
    fluentDivider,
    fluentTab,
    fluentTabPanel,
    fluentTabs,
} from "@fluentui/web-components";
import { App } from "./core/ui";
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
        fluentTab(),
        fluentTabs(),
        fluentTabPanel()
    );

App;

/* eslint-disable */
const styles = require("./global.css");
/* eslint-enable */

window.onload = (e: Event): void => {
    const app: App = document.querySelector("td-app") as App;

    app.addEventListener("dispatch", (e: CustomEvent) => {
        parent.postMessage({ pluginMessage: serializeUINodes(e.detail) }, "*");
    });

    // Update UI from Controller's message
    window.onmessage = (e: any): void => {
        const nodes = e.data.pluginMessage.selectedNodes as Array<
            PluginUISerializableNodeData
        >;
        const deserializedNodes = deserializeUINodes(nodes);
        app.selectedNodes = deserializedNodes;
    };
};
