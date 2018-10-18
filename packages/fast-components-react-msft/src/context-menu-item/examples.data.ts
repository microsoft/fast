import ContextMenuItem from "./index";
import { ContextMenuItemHandledProps } from "@microsoft/fast-components-react-base";
import { ComponentFactoryExample } from "@microsoft/fast-development-site-react";

export default {
    name: "context-menu-item",
    component: ContextMenuItem,
    data: [
        {
            children: "context-menu-item",
        },
    ],
} as ComponentFactoryExample<ContextMenuItemHandledProps>;
