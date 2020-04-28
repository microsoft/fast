import { TreeViewItem, treeViewItemSchema2 } from "@microsoft/fast-components-react-msft";
import Guidance from "../../.tmp/tree-view-item/guidance";
import { glyphSchema, Icon } from "../../components/glyph";
import { ComponentViewConfig } from "./data.props";

const treeViewItemConfig: ComponentViewConfig = {
    schema: treeViewItemSchema2,
    component: TreeViewItem,
    guidance: Guidance,
    scenarios: [
        {
            displayName: "Basic (selected)",
            dataDictionary: [
                {
                    root: {
                        schemaId: treeViewItemSchema2.id,
                        data: {
                            titleContent: "Favorites",
                            selected: true,
                            beforeContent: [
                                {
                                    id: "beforeContent",
                                },
                            ],
                        },
                    },
                    beforeContent: {
                        parent: {
                            id: "root",
                            dataLocation: "beforeContent",
                        },
                        schemaId: glyphSchema.id,
                        data: {
                            path: Icon.folder,
                        },
                    },
                },
                "root",
            ],
        },
    ],
};

export default treeViewItemConfig;
