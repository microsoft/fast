import React from "react";
import { ComponentFactoryExample } from "@microsoft/fast-development-site-react";
import schema from "./auto-suggest.schema.json";
import listboxItemSchema from "../listbox-item/listbox-item.schema.json";
import AutoSuggest, { AutoSuggestManagedClasses, AutoSuggestProps } from "./auto-suggest";
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

const managedClasses: AutoSuggestManagedClasses = {
    managedClasses: {
        autoSuggest: "autoSuggest",
        autoSuggest__disabled: "autoSuggest__disabled",
        autoSuggest_menu: "autoSuggest_menu",
        autoSuggest__menuOpen: "autoSuggest__menuOpen",
    },
};

const examples: ComponentFactoryExample<AutoSuggestProps> = {
    name: "Auto Suggest",
    component: AutoSuggest,
    schema: schema as any,
    documentation: <Documentation />,
    detailData: {
        ...managedClasses,
        placeholder: "Type something....",
        listboxId: "listboxId",
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
            listboxId: "listboxId",
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
