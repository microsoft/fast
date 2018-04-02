import {validDomains} from "./config";

/**
 * Programmatically generate the browser extension manifest.json
 */
const manifest: any = {
    manifest_version: 2,
    name: "Fluent Web",
    version: "1.0",
    description: "Configure Fluent Web content and domains",
    externally_connectable: {
        // '<all_urls>' is not valid in this property
        matches: validDomains.filter((domain: string) => domain !== "<all_urls>")
    },
    permissions: [
        "activeTab",
        "tabs",
        "contextMenus"
    ].concat(validDomains),
    icons: {
        48: "icons/48x48.png",
        96: "icons/96x96.png"
    },
    content_scripts: [{
        matches: validDomains,
        js: ["content.js"]
    }],
    background: {
        scripts: ["contextMenu.js"]
    }
};

module.exports = manifest;
