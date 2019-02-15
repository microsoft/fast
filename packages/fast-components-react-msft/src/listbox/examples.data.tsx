import * as React from "react";
import { Listbox, ListboxManagedClasses, ListboxProps } from "./index";
import { ListboxItemProps } from "../listbox-item";
import { ComponentFactoryExample } from "@microsoft/fast-development-site-react";
import schema from "@microsoft/fast-components-react-base/dist/listbox/listbox.schema.json";
import Documentation from "./.tmp/documentation";

function listboxItemPropFactory(id: string): ListboxItemProps {
    return {
        id,
        value: id,
        role: "option",
        displayString: "Option-" + id,
    };
}

const managedClasses: ListboxManagedClasses = {
    managedClasses: {
        listbox: "listbox",
    },
};

const examples: ComponentFactoryExample<ListboxProps> = {
    name: "Listbox",
    component: Listbox,
    schema: schema as any,
    documentation: <Documentation />,
    detailData: {
        ...managedClasses,
        children: [
            {
                id: "listbox-item",
                props: {
                    ...listboxItemPropFactory("a"),
                },
            },
            {
                id: "listbox-item",
                props: {
                    ...listboxItemPropFactory("b"),
                },
            },
            {
                id: "listbox-item",
                props: {
                    ...listboxItemPropFactory("c"),
                },
            },
        ],
    },
    data: [
        {
            ...managedClasses,
            children: [
                {
                    id: "listbox-item",
                    props: {
                        ...listboxItemPropFactory("a"),
                    },
                },
                {
                    id: "listbox-item",
                    props: {
                        ...listboxItemPropFactory("b"),
                    },
                },
                {
                    id: "listbox-item",
                    props: {
                        ...listboxItemPropFactory("c"),
                    },
                },
            ],
        },
    ],
};

export default examples;
