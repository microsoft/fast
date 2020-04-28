import {
    TreeView,
    treeViewItemSchema2,
    treeViewSchema2,
} from "@microsoft/fast-components-react-msft";
import { uniqueId } from "lodash-es";
import Guidance from "../../.tmp/tree-view/guidance";
import { glyphSchema, Icon } from "../../components/glyph";
import { ComponentViewConfig } from "./data.props";

const treeViewConfig: ComponentViewConfig = {
    schema: treeViewSchema2,
    component: TreeView,
    guidance: Guidance,
    scenarios: [
        {
            displayName: "Basic",
            dataDictionary: [
                {
                    root: {
                        schemaId: treeViewSchema2.id,
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
                        schemaId: treeViewItemSchema2.id,
                        data: {
                            key: uniqueId(),
                            titleContent: "Favorites",
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
                            beforeContent: [
                                {
                                    id: "beforeContent",
                                },
                            ],
                        },
                    },
                    beforeContent: {
                        parent: {
                            id: "children",
                            dataLocation: "beforeContent",
                        },
                        schemaId: glyphSchema.id,
                        data: {
                            path: Icon.folder,
                        },
                    },
                    children0: {
                        parent: {
                            id: "children",
                            dataLocation: "children",
                        },
                        schemaId: treeViewItemSchema2.id,
                        data: {
                            key: uniqueId(),
                            titleContent: "Work",
                            beforeContent: [
                                {
                                    id: "children0beforeContent0",
                                },
                            ],
                        },
                    },
                    children0beforeContent0: {
                        parent: {
                            id: "children0",
                            dataLocation: "beforeContent",
                        },
                        schemaId: glyphSchema.id,
                        data: {
                            path: Icon.favorite,
                        },
                    },
                    children1: {
                        parent: {
                            id: "children",
                            dataLocation: "children",
                        },
                        schemaId: treeViewItemSchema2.id,
                        data: {
                            key: uniqueId(),
                            titleContent: "Shopping",
                            selected: true,
                            children: [
                                {
                                    id: "children1children0",
                                },
                            ],
                            beforeContent: [
                                {
                                    id: "children1beforeContent0",
                                },
                            ],
                        },
                    },
                    children1children0: {
                        parent: {
                            id: "children1",
                            dataLocation: "children",
                        },
                        schemaId: treeViewItemSchema2.id,
                        data: {
                            key: uniqueId(),
                            titleContent: "Dinner Meals",
                            beforeContent: [
                                {
                                    id: "children1children0beforeContent0",
                                },
                            ],
                        },
                    },
                    children1children0beforeContent0: {
                        parent: {
                            id: "children1children0",
                            dataLocation: "beforeContent",
                        },
                        schemaId: glyphSchema.id,
                        data: {
                            path: Icon.favorite,
                        },
                    },
                    children1beforeContent0: {
                        parent: {
                            id: "children1",
                            dataLocation: "beforeContent",
                        },
                        schemaId: glyphSchema.id,
                        data: {
                            path: Icon.folder,
                        },
                    },
                    children2: {
                        parent: {
                            id: "children",
                            dataLocation: "children",
                        },
                        schemaId: treeViewItemSchema2.id,
                        data: {
                            key: uniqueId(),
                            titleContent: "Inspiration",
                            beforeContent: [
                                {
                                    id: "children2beforeContent0",
                                },
                            ],
                        },
                    },
                    children2beforeContent0: {
                        parent: {
                            id: "children2",
                            dataLocation: "beforeContent",
                        },
                        schemaId: glyphSchema.id,
                        data: {
                            path: Icon.favorite,
                        },
                    },
                },
                "root",
            ],
        },
    ],
};

export default treeViewConfig;
