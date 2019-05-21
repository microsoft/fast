import {
    NavigationDataType,
    TreeNavigation,
} from "../../../src/navigation/navigation.props";
import { ChildOptionItem } from "../../../src";
import { get } from "lodash-es";

import noChildrenSchema from "./no-children.schema.json";
import childrenSchema from "./children.schema.json";

const noChildren: any = {
    text: "Hello world",
};

const children: any = {
    children: [
        "Foo",
        {
            id: get(noChildrenSchema, "id"),
            props: noChildren,
        },
        {
            id: get(childrenSchema, "id"),
            props: {
                children: [
                    {
                        id: get(childrenSchema, "id"),
                        props: {
                            children: [
                                {
                                    id: get(childrenSchema, "id"),
                                    props: {
                                        children: [
                                            {
                                                id: get(childrenSchema, "id"),
                                                props: {
                                                    children: {
                                                        id: get(noChildrenSchema, "id"),
                                                        props: noChildren,
                                                    },
                                                },
                                            },
                                        ],
                                    },
                                },
                                {
                                    id: get(childrenSchema, "id"),
                                    props: {
                                        children: {
                                            id: get(noChildrenSchema, "id"),
                                            props: noChildren,
                                        },
                                    },
                                },
                            ],
                        },
                    },
                ],
            },
        },
        {
            id: get(childrenSchema, "id"),
            props: {
                children: {
                    id: get(noChildrenSchema, "id"),
                    props: noChildren,
                },
            },
        },
        {
            id: get(childrenSchema, "id"),
            props: {
                children: [
                    {
                        id: get(childrenSchema, "id"),
                        props: {
                            children: {
                                id: get(noChildrenSchema, "id"),
                                props: noChildren,
                            },
                        },
                    },
                    {
                        id: get(childrenSchema, "id"),
                        props: {
                            children: {
                                id: get(noChildrenSchema, "id"),
                                props: noChildren,
                            },
                        },
                    },
                ],
            },
        },
    ],
    object: {
        children: [
            {
                id: get(noChildrenSchema, "id"),
                props: noChildren,
            },
            "Foo",
        ],
    },
    array: [
        {
            children: [
                {
                    id: get(noChildrenSchema, "id"),
                    props: noChildren,
                },
                "Bar",
            ],
        },
    ],
};

const navigationData: TreeNavigation[] = [
    {
        text: "Child A",
        type: NavigationDataType.children,
        dataLocation: "children[0]",
        items: [
            {
                text: "Child B",
                type: NavigationDataType.children,
                dataLocation: "children[0].props.children[0]",
            },
            {
                text: "Child C",
                type: NavigationDataType.children,
                dataLocation: "children[0].props.children[1]",
                items: [
                    {
                        text: "Child D",
                        type: NavigationDataType.children,
                        dataLocation: "children[0].props.children[1].props.children",
                    },
                ],
            },
        ],
    },
    {
        text: "Child E",
        type: NavigationDataType.children,
        dataLocation: "children[1]",
    },
];

const childOptions: ChildOptionItem[] = [
    {
        component: null,
        schema: noChildrenSchema,
    },
    {
        component: null,
        schema: childrenSchema,
    },
];

export { children, childOptions, navigationData, noChildren };
