import * as React from "react";
import { ComponentFactoryExample } from "@microsoft/fast-development-site-react";
import schema from "./listbox.schema.json";
import Listbox, { ListboxManagedClasses, ListboxProps } from "./listbox";
import { ContextMenuItemProps } from "../context-menu-item";
import { noop } from "lodash-es";
import Documentation from "./.tmp/documentation";

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
                id: "react-html-element",
                props: {
                    id: "option-a",
                    role: "option",
                    displayString: "Option A",
                    children: "Option A",
                },
            },
            {
                id: "react-html-element",
                props: {
                    id: "option-b",
                    role: "option",
                    displayString: "Option B",
                    children: "Option B",
                },
            },
            {
                id: "react-html-element",
                props: {
                    id: "option-c",
                    role: "option",
                    displayString: "Option C",
                    children: "Option C",
                },
            },
        ],
    },
    data: [
        {
            ...managedClasses,
            children: [
                {
                    id: "react-html-element",
                    props: {
                        id: "option-a",
                        role: "option",
                        displayString: "Option A",
                        children: "Option A",
                    },
                },
                {
                    id: "react-html-element",
                    props: {
                        id: "option-b",
                        role: "option",
                        displayString: "Option B",
                        children: "Option B",
                    },
                },
                {
                    id: "react-html-element",
                    props: {
                        id: "option-c",
                        role: "option",
                        displayString: "Option C",
                        children: "Option C",
                    },
                },
            ],
        },
    ],
};

export default examples;
