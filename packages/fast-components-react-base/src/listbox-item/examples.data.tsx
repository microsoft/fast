import * as React from "react";
import { ComponentFactoryExample } from "@microsoft/fast-development-site-react";
import schema from "./listbox-item.schema.json";
import ListboxItem, {
    ListboxItemHandledProps,
    ListboxItemManagedClasses,
} from "./listbox-item";
import Documentation from "./.tmp/documentation";

const managedClasses: ListboxItemManagedClasses = {
    managedClasses: {
        listboxItem: "listbox-item",
    },
};

const examples: ComponentFactoryExample<ListboxItemHandledProps> = {
    name: "Listbox item",
    component: ListboxItem,
    schema: schema as any,
    documentation: <Documentation />,
    detailData: {
        ...managedClasses,
        value: "Test value",
        displayString: "Test Display",
        id: "TestID",
        children: "Child",
    },
    data: [
        {
            ...managedClasses,
            value: "Test value",
            id: "TestID",
            displayString: "Test Display",
            children: "child",
        },
    ],
};

export default examples;
