/**
 * Define configuration values
 */
const validDomains: string[] = ["*://*.fluentweb.com/*"];
const extensionId: string = "jhhigejkemaekdcempcigaapebobmimg";

/**
 * Define event names
 */
export const menuItemClickEvent: string = "FW_EXTENSION::MENU_ITEM_CLICK";

/**
 * Non-production environments
 */
if (process.env.NODE_ENV !== "production") {
    validDomains.push("<all_urls>");
}

/**
 * Assign exports
 */
export { validDomains, extensionId };
