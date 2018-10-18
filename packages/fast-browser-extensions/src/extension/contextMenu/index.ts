import { validDomains } from "../config";
import ExtensionApi from "../ExtensionApi";
import { CREATE_MENUS_MESSAGE, CreateMessage } from "../messaging";

/**
 * Describes all types of context menu item
 */
export enum ContextMenuType {
    radio = "radio",
    checkbox = "checkbox",
    normal = "normal",
    separator = "separator"
}

/**
 * The interface describing a single menu item
 */
export interface ContextMenuItemConfig {
    title?: string;
    type?: ContextMenuType;
}

// Store menu ids for later reference
let menuIdStore: { [key: string]: ContextMenuItemConfig } = {};
const rootId: string = createContextMenu();

/**
 * Creates the FW context menu
 * @return {string} the menu id
 */
function createContextMenu(): string {
    return ExtensionApi.contextMenus.create({
        title: "FAST DNA",
        contexts: ["all"],
        documentUrlPatterns: validDomains
    });
}

/**
 * Create submenu items for a root menu
 */
function createSubmenuItems(
    config: { [key: string]: ContextMenuItemConfig[] },
    id: string
): void {
    Object.keys(config).map((key: string, index: number) => {
        const menuConfigs: ContextMenuItemConfig[] = config[key].slice(0);

        if (index !== 0) {
            // Add a separator before all groups
            const separator: ContextMenuItemConfig = {
                type: ContextMenuType.separator
            };
            menuConfigs.unshift(separator);
        }

        menuConfigs
            .map((menuConfig: any) => {
                return Object.assign({}, menuConfig, {
                    parentId: id,
                    onclick: handleContextMenuItemClick
                });
            })
            .forEach((menuConfig: any) => {
                const menuId: string = ExtensionApi.contextMenus.create(menuConfig);
                menuIdStore[menuId] = menuConfig;
            });
    });
}

/**
 * Handles menu item click events
 */
function handleContextMenuItemClick(info: any): void {
    ExtensionApi.tabs.query({ active: true, currentWindow: true }, (tabs: any[]) => {
        if (!Array.isArray(tabs) || !tabs.length) {
            return;
        }

        const clickedMenuConfig: ContextMenuItemConfig = menuIdStore[info.menuItemId];

        if (clickedMenuConfig !== undefined) {
            ExtensionApi.tabs.sendMessage(tabs[0].id, clickedMenuConfig);
        }
    });
}

/**
 * Remove all context menu items
 */
function removeAllContextMenuItems(): void {
    Object.keys(menuIdStore).forEach((menuId: string) => {
        ExtensionApi.contextMenus.remove(menuId);
    });

    menuIdStore = {};
}

function handleExternalMessages(
    message: CreateMessage,
    sender: any,
    sendResponse: any
): void {
    switch (message.type) {
        case CREATE_MENUS_MESSAGE:
            removeAllContextMenuItems();
            createSubmenuItems(message.data, rootId);
    }
}

// Listen for messages coming from the client pages
ExtensionApi.runtime.onMessageExternal.addListener(handleExternalMessages);
