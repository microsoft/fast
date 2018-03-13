import { validDomains } from '../config';
import ExtensionApi from '../ExtensionApi';
import { CreateMessage, CREATE_MENUS_MESSAGE } from '../messaging';

/**
 * Describes all types of context menu item
 */
export enum ContextMenuType {
    radio = 'radio',
    checkbox = 'checkbox',
    normal = 'normal',
    separator = 'separator'
}

/**
 * The interface describing a single menu item
 */
export interface IContextMenuItem {
    title?: string;
    type?: ContextMenuType;
}

/**
 * Describes a collection of menus related to eachother
 */
export interface IContextMenus {
    [key: string]: IContextMenuItem[];
}

// Store menu ids for later reference
let menuIdStore: {[key: string]: IContextMenuItem} = {};
const rootId = createContextMenu();

/**
 * Creates the FW context menu
 * @return {string} the menu id
 */
function createContextMenu(): string {
    return ExtensionApi.contextMenus.create({
        title: 'Fluent Web',
        contexts:['all'],
        documentUrlPatterns: validDomains
    });
}

/**
 * Create submenu items for a root menu
 */
function createSubmenuItems(config: IContextMenus, rootId: string) {
    Object.keys(config).map((key, index) => {
        let menuConfigs = config[key].slice(0);

        if (index !== 0) {
            // Add a separator before all groups
            const separator: IContextMenuItem = { type: ContextMenuType.separator };
            menuConfigs.unshift(separator);
        }

        menuConfigs
            .map(config => {
                return Object.assign({}, config, {
                    parentId: rootId,
                    onclick: handleContextMenuItemClick
                });
            })
            .forEach(config => {
                const menuId = ExtensionApi.contextMenus.create(config);
                menuIdStore[menuId] = config;
            });
    });
}

/**
 * Handles menu item click events
 */
function handleContextMenuItemClick(info) {
    ExtensionApi.tabs.query({active: true, currentWindow: true}, (tabs) => {
        if (!Array.isArray(tabs) || !tabs.length) {
            return;
        }

        const clickedMenuConfig = menuIdStore[info.menuItemId];

        if (clickedMenuConfig !== undefined) {
            ExtensionApi.tabs.sendMessage(tabs[0].id, clickedMenuConfig);
        }
    });
}

/**
 * Remove all context menu items
 */
function removeAllContextMenuItems() {
    Object.keys(menuIdStore).forEach(menuId => {
        ExtensionApi.contextMenus.remove(menuId);
    });

    menuIdStore = {};
}

function handleExternalMessages(message: CreateMessage, sender, sendResponse) {
    switch (message.type) {
        case CREATE_MENUS_MESSAGE:
            removeAllContextMenuItems();
            createSubmenuItems(message.data, rootId);
    }
}

// Listen for messages coming from the client pages
ExtensionApi.runtime.onMessageExternal.addListener(handleExternalMessages);
