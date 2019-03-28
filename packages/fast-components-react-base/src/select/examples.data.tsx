import React from "react";
import { ComponentFactoryExample } from "@microsoft/fast-development-site-react";
import schema from "./select.schema.json";
import listboxItemSchema from "../listbox-item/listbox-item.schema.json";
import Select, { SelectManagedClasses, SelectProps } from "./select";
import { ListboxItemProps } from "../listbox-item";
import Documentation from "./.tmp/documentation";

function ListboxItemPropFactory(id: string): ListboxItemProps {
    return {
        managedClasses: {
            listboxItem: "listboxItem",
            listboxItem__disabled: "listboxItem__disabled",
            listboxItem__selected: "listboxItem__selected",
        },
        id,
        value: id,
        role: "option",
        displayString: "Option-" + id,
        children: "Child-" + id,
    };
}

const managedClasses: SelectManagedClasses = {
    managedClasses: {
        select: "select",
        select__disabled: "select__disabled",
        select_menu: "select_menu",
        select_menu__open: "select_menu__open",
        select__multiSelectable: "select__multiSelectable",
    },
};

const examples: ComponentFactoryExample<SelectProps> = {
    name: "Select",
    component: Select,
    schema: schema as any,
    documentation: <Documentation />,
    detailData: {
        ...managedClasses,
        placeholder: "Select an option",
        children: [
            {
                id: listboxItemSchema.id,
                props: {
                    ...ListboxItemPropFactory("a"),
                },
            },
            {
                id: listboxItemSchema.id,
                props: {
                    ...ListboxItemPropFactory("b"),
                },
            },
            {
                id: listboxItemSchema.id,
                props: {
                    ...ListboxItemPropFactory("c"),
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
                    id: listboxItemSchema.id,
                    props: {
                        ...ListboxItemPropFactory("value 1"),
                        children: "select option 1",
                        selected: true,
                    },
                },
                {
                    id: listboxItemSchema.id,
                    props: {
                        ...ListboxItemPropFactory("value 2"),
                        children: "select option 2",
                    },
                },
                {
                    id: listboxItemSchema.id,
                    props: {
                        ...ListboxItemPropFactory("value 3"),
                        children: "select option 3",
                    },
                },
            ],
        },
    ],
};

export default examples;
