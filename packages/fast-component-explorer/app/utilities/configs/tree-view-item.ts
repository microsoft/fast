import React from "react";
import { ComponentViewConfig } from "./data.props";
import {
    TreeViewItem,
    TreeViewItemProps,
    treeViewItemSchema,
} from "@microsoft/fast-components-react-msft";
import Guidance from "../../.tmp/tree-view-item/guidance";
import API from "../api";
import { glyphSchema, Icon } from "../../../app/components/glyph";

const treeViewItemConfig: ComponentViewConfig<TreeViewItemProps> = {
    api: API(React.lazy(() => import("../../.tmp/tree-view-item/api"))),
    schema: treeViewItemSchema,
    component: TreeViewItem,
    guidance: Guidance,
    scenarios: [
        {
            displayName: "Basic (selected)",
            data: {
                titleContent: "Favorites",
                beforeContent: {
                    id: glyphSchema.id,
                    props: {
                        path: Icon.folder,
                    },
                } as any,
                selected: true,
            },
        },
    ],
};

export default treeViewItemConfig;
