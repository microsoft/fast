import * as React from "react";
import { ComponentFactoryExample } from "@microsoft/fast-development-site-react";
import schema from "./auto-suggest.schema.json";
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
        autoSuggest_menu: "sautoSuggest_menu",
        autoSuggest_menu__open: "autoSuggest_menu__open",
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
                id: "listbox-item",
                props: {
                    ...ListboxItemPropFactory("a"),
                },
            },
            {
                id: "listbox-item",
                props: {
                    ...ListboxItemPropFactory("b"),
                },
            },
            {
                id: "listbox-item",
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
                    id: "listbox-item",
                    props: {
                        ...ListboxItemPropFactory("value 1"),
                        children: "select option 1",
                        selected: true,
                    },
                },
                {
                    id: "listbox-item",
                    props: {
                        ...ListboxItemPropFactory("value 2"),
                        children: "select option 2",
                    },
                },
                {
                    id: "listbox-item",
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
