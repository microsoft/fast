import { Plugin, PluginProps } from "@microsoft/fast-tooling-react";
import RenderPropPlugin from "./render-prop";

const initializedPlugins: Array<Plugin<PluginProps>> = [
    new RenderPropPlugin({
        id: [
            "@microsoft/fast-components-react-msft/action-toggle/selectedGlyph",
            "@microsoft/fast-components-react-msft/action-toggle/unselectedGlyph",
            "@microsoft/fast-components-react-msft/action-trigger/glyph",
            "@microsoft/fast-components-react-msft/breadcrumb/separator",
            "@microsoft/fast-components-react-msft/carousel/items/content",
            "@microsoft/fast-components-react-msft/pivot/items/content",
            "@microsoft/fast-components-react-msft/pivot/items/tab",
            "@microsoft/fast-components-react-msft/select-option/glyph",
            "@microsoft/fast-components-react-msft/text-action/button",
            "@microsoft/fast-components-react-msft/text-action/beforeGlyph",
            "@microsoft/fast-components-react-msft/tree-view-item/afterContent",
            "@microsoft/fast-components-react-msft/tree-view-item/beforeContent",
        ],
    }),
];

export default initializedPlugins;
