import {
    ContextMenu,
    contextMenuItemSchema2,
    contextMenuSchema2,
} from "@microsoft/fast-components-react-msft";
import Guidance from "../../.tmp/context-menu/guidance";
import textSchema from "../../msft-component-helpers/text.schema";
import { ComponentViewConfig } from "./data.props";

const contextMenuConfig: ComponentViewConfig = {
    schema: contextMenuSchema2,
    component: ContextMenu,
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
                                    id: "children0",
                                },
                                {
                                    id: "children1",
                                },
                                {
                                    id: "children2",
                                },
                            ],
                        },
                    },
                    children0: {
                        parent: {
                            id: "root",
                            dataLocation: "children",
                        },
                        schemaId: contextMenuItemSchema2.id,
                        data: {
                            children: [
                                {
                                    id: "children00",
                                },
                            ],
                        },
                    },
                    children00: {
                        parent: {
                            id: "children0",
                            dataLocation: "children",
                        },
                        schemaId: textSchema.id,
                        data: "Context menu item 1",
                    },
                    children1: {
                        parent: {
                            id: "root",
                            dataLocation: "children",
                        },
                        schemaId: contextMenuItemSchema2.id,
                        data: {
                            children: [
                                {
                                    id: "children10",
                                },
                            ],
                        },
                    },
                    children10: {
                        parent: {
                            id: "children1",
                            dataLocation: "children",
                        },
                        schemaId: textSchema.id,
                        data: "Context menu item 2",
                    },
                    children2: {
                        parent: {
                            id: "root",
                            dataLocation: "children",
                        },
                        schemaId: contextMenuItemSchema2.id,
                        data: {
                            children: [
                                {
                                    id: "children20",
                                },
                            ],
                        },
                    },
                    children20: {
                        parent: {
                            id: "children2",
                            dataLocation: "children",
                        },
                        schemaId: textSchema.id,
                        data: "Context menu item 3",
                    },
                },
                "root",
            ],
        },
    ],
};

export default contextMenuConfig;
