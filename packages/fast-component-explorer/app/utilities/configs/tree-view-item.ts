import {
    TreeViewItem,
    TreeViewItemProps,
    treeViewItemSchema,
} from "@microsoft/fast-components-react-msft";
import Guidance from "../../.tmp/tree-view-item/guidance";
import { glyphSchema, Icon } from "../../../app/components/glyph";
import { ComponentViewConfig } from "./data.props";

const treeViewItemConfig: ComponentViewConfig<TreeViewItemProps> = {
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
