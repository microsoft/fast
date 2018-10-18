import * as React from "react";
import { ComponentFactoryExample } from "@microsoft/fast-development-site-react";
import { ManagedClasses } from "@microsoft/fast-components-class-name-contracts-base";
import ContextMenuItem, {
    ContextMenuItemHandledProps,
    ContextMenuItemManagedClasses,
} from "./context-menu-item";
import { uniqueId } from "lodash-es";
import schema from "./context-menu-item.schema.json";
import Documentation from "./.tmp/documentation";

const managedClasses: ContextMenuItemManagedClasses = {
    managedClasses: {
        contextMenuItem: "context-menu-item",
    },
};

const examples: ComponentFactoryExample<ContextMenuItemHandledProps> = {
    name: "context-menu-item",
    component: ContextMenuItem,
    schema: schema as any,
    documentation: <Documentation />,
    detailData: {
        ...managedClasses,
        children: "child",
    },
    data: [
        {
            ...managedClasses,
            children: "child",
        },
    ],
};

export default examples;
