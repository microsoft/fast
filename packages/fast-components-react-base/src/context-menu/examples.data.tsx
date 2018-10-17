import * as React from "react";
import { ComponentFactoryExample } from "@microsoft/fast-development-site-react";
import { ManagedClasses } from "@microsoft/fast-components-class-name-contracts-base";
import schema from "./context-menu.schema.json";
import ContextMenu, { ContextMenuHandledProps, ContextMenuManagedClasses } from "./context-menu";
import ContextMenuItem, { ContextMenuItemProps } from "../context-menu-item";
import ContextMenuItemRadio, {
    ContextMenuItemRadioHandledProps,
    ContextMenuItemRadioManagedClasses,
    ContextMenuItemRadioProps
} from "../context-menu-item-radio";
import ContextMenuItemCheckbox, { ContextMenuItemCheckboxProps } from "../context-menu-item-checkbox";
import { noop, uniqueId } from "lodash-es";
import Documentation from "./.tmp/documentation";

function contextMenuItemPropFactory(): ContextMenuItemProps {
    return {
        managedClasses: {
            contextMenuItem: "context-menu-item",
        },
        id: uniqueId(),
        onClick: noop
    };
}

function contextMenuItemRadioPropFactory(checked: boolean = false): ContextMenuItemRadioProps {
    return {
        managedClasses: {
            contextMenuItemRadio: "context-menu-item-radio",
        },
        checked,
        id: uniqueId(),
        onChange: noop
    };
}

function contextMenuItemCheckboxPropFactory(checked: boolean = false): ContextMenuItemCheckboxProps {
    return {
        managedClasses: {
            contextMenuItemCheckbox: "context-menu-item-checkbox",
        },
        checked,
        id: uniqueId(),
        onChange: noop
    };
}

const managedClasses: ContextMenuManagedClasses = {
    managedClasses: {
        contextMenu: "context-menu",
        contextMenu_open: "open"
    }
};

const examples: ComponentFactoryExample<ContextMenuHandledProps> = {
    name: "context-menu",
    component: ContextMenu,
    schema: schema as any,
    documentation: <Documentation />,
    detailData: {
        ...managedClasses,
        open: true,
        children: [
            {
                id: "context-menu-item",
                props: {
                    ...contextMenuItemPropFactory(),
                    children: "context menu item 1"
                }
            }
        ]
    },
    data: [
        {
            ...managedClasses,
            open: true,
            children: [
                {
                    id: "context-menu-item",
                    props: {
                        ...contextMenuItemPropFactory(),
                        children: "context menu item 1"
                    }
                }
            ]
        }
    ]
};

export default examples;
