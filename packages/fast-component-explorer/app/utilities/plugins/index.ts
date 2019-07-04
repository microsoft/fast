import { Plugin, PluginProps } from "@microsoft/fast-tooling-react";
import RenderPropPlugin from "./render-prop";

const initializedPlugins: Array<Plugin<PluginProps>> = [
    new RenderPropPlugin({
        id: [
            "@microsoft/fast-components-react-msft/action-toggle/selectedGlyph",
            "@microsoft/fast-components-react-msft/action-toggle/unselectedGlyph",
        ],
    }),
];

export default initializedPlugins;
