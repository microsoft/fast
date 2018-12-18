import React from "react";
import { ComponentFactoryExample } from "@microsoft/fast-development-site-react";
import schema from "./listbox.schema.json";
import Listbox, { ListboxManagedClasses, ListboxProps } from "./listbox";
import { ListboxItemProps } from "../listbox-item";
import Documentation from "./.tmp/documentation";

function listboxItemPropFactory(id: string): ListboxItemProps {
    return {
        managedClasses: {
            listboxItem: "listbox-item",
        },
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
        typeAheadPropertyKey: "displayString",
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
