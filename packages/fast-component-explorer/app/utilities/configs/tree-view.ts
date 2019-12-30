import React from "react";
import {
    TreeView,
    treeViewItemSchema,
    TreeViewProps,
    treeViewSchema,
} from "@microsoft/fast-components-react-msft";
import { ComponentViewConfig } from "./data.props";
import Guidance from "../../.tmp/tree-view/guidance";
import API from "../api";
import { glyphSchema, Icon } from "../../../app/components/glyph";
import { uniqueId } from "lodash-es";

const treeViewConfig: ComponentViewConfig<TreeViewProps> = {
    api: API(React.lazy(() => import("../../.tmp/tree-view/api"))),
    schema: treeViewSchema,
    component: TreeView,
    guidance: Guidance,
    scenarios: [
        {
            displayName: "Basic",
            data: {
                children: [
                    {
                        id: treeViewItemSchema.id,
                        props: {
                            key: uniqueId(),
                            titleContent: "Favorites",
                            beforeContent: {
                                id: glyphSchema.id,
                                props: {
                                    path: Icon.folder,
                                },
                            } as any,
                            children: [
                                {
                                    id: treeViewItemSchema.id,
                                    props: {
                                        key: uniqueId(),
                                        titleContent: "Work",
                                        beforeContent: {
                                            id: glyphSchema.id,
                                            props: {
                                                path: Icon.favorite,
                                            },
                                        } as any,
                                    },
                                },
                                {
                                    id: treeViewItemSchema.id,
                                    props: {
                                        key: uniqueId(),
                                        titleContent: "Shopping",
                                        selected: true,
                                        beforeContent: {
                                            id: glyphSchema.id,
                                            props: {
                                                path: Icon.folder,
                                            },
                                        } as any,
                                        children: [
                                            {
                                                id: treeViewItemSchema.id,
                                                props: {
                                                    key: uniqueId(),
                                                    titleContent: "Dinner Meals",
                                                    beforeContent: {
                                                        id: glyphSchema.id,
                                                        props: {
                                                            path: Icon.favorite,
                                                        },
                                                    },
                                                },
                                            },
                                        ],
                                    },
                                },
                                {
                                    id: treeViewItemSchema.id,
                                    props: {
                                        key: uniqueId(),
                                        titleContent: "Inspiration",
                                        beforeContent: {
                                            id: glyphSchema.id,
                                            props: {
                                                path: Icon.favorite,
                                            },
                                        } as any,
                                    },
                                },
                            ],
                        },
                    },
                ],
            },
        },
    ],
};

export default treeViewConfig;
