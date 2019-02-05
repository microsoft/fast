import * as React from "react";
import { ComponentFactoryExample } from "@microsoft/fast-development-site-react";
import schema from "./select.schema.json";
import Select, { SelectManagedClasses, SelectProps } from "./select";
import ListboxItem, { ListboxItemProps } from "../listbox-item";
import { noop } from "lodash-es";
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

const managedClasses: SelectManagedClasses = {
    managedClasses: {
        select: "select",
    },
};

const examples: ComponentFactoryExample<SelectProps> = {
    name: "Select",
    component: Select,
    schema: schema as any,
    documentation: <Documentation />,
    detailData: {
        ...managedClasses,
        placeholder: "placeholder",
        children: [
            {
                id: "select-option",
                props: {
                    ...listboxItemPropFactory("a"),
                },
            },
            {
                id: "select-option",
                props: {
                    ...listboxItemPropFactory("b"),
                },
            },
            {
                id: "select-option",
                props: {
                    ...listboxItemPropFactory("c"),
                },
            },
        ],
    },
    data: [
        {
            ...managedClasses,
            placeholder: "placeholder",
            children: [
                {
                    id: "select-option",
                    props: {
                        ...listboxItemPropFactory("value 1"),
                        children: "select option 1",
                        selected: true,
                    },
                },
                {
                    id: "select-option",
                    props: {
                        ...listboxItemPropFactory("value 2"),
                        children: "select option 2",
                    },
                },
                {
                    id: "select-option",
                    props: {
                        ...listboxItemPropFactory("value 3"),
                        children: "select option 3",
                    },
                },
            ],
        },
    ],
};

export default examples;
