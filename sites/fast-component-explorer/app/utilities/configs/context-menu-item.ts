import {
    ContextMenuItem,
    contextMenuItemSchema2,
} from "@microsoft/fast-components-react-msft";
import Guidance from "../../.tmp/context-menu-item/guidance";
import textSchema from "../../msft-component-helpers/text.schema";
import { ComponentViewConfig } from "./data.props";

const contextMenuItemConfig: ComponentViewConfig = {
    schema: contextMenuItemSchema2,
    component: ContextMenuItem,
    guidance: Guidance,
    scenarios: [
        {
            displayName: "Basic",
            dataDictionary: [
                {
                    root: {
                        schemaId: contextMenuItemSchema2.id,
                        data: {
                            children: [
                                {
                                    id: "children",
                                },
                            ],
                        },
                    },
                    children: {
                        parent: {
                            id: "root",
                            dataLocation: "children",
                        },
                        schemaId: textSchema.id,
                        data: "Context menu item",
                    },
                },
                "root",
            ],
        },
    ],
};

export default contextMenuItemConfig;
