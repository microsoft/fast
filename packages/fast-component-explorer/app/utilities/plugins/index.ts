import { Plugin, PluginProps } from "@microsoft/fast-tooling-react";
import RenderPropPlugin from "./render-prop";

const initializedPlugins: Array<Plugin<PluginProps>> = [
    new RenderPropPlugin({
        id: [
            "@microsoft/fast-components-react-msft/action-toggle/selectedGlyph",
            "@microsoft/fast-components-react-msft/action-toggle/unselectedGlyph",
            "@microsoft/fast-components-react-msft/action-trigger/glyph",
            "@microsoft/fast-components-react-msft/breadcrumb/separator",
            "@microsoft/fast-components-react-msft/select-option/glyph",
        ],
    }),
];

export default initializedPlugins;
