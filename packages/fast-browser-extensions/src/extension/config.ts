/**
 * Define configuration values
 */
const validDomains = [ '*://*.fluentweb.com/*' ];
const extensionId = 'jhhigejkemaekdcempcigaapebobmimg';

/**
 * Define event names
 */
export const menuItemClickEvent = 'FW_EXTENSION::MENU_ITEM_CLICK';

/**
 * Non-production environments
 */
if (process.env.NODE_ENV !== 'production') {
    validDomains.push('<all_urls>');
}

/**
 * Assign exports
 */
export { validDomains, extensionId };
