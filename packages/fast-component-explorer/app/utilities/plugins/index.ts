import { Plugin, PluginProps } from "@microsoft/fast-tooling-react";
import RenderPropPlugin from "./render-prop";

const initializedPlugins: Array<Plugin<PluginProps>> = [
    new RenderPropPlugin({
        id: [""],
    }),
];

export default initializedPlugins;
