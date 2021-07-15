/**
 * These are the plugin utilities for a CSS custom control.
 */
export default class CSSControlPluginUtilities {
    constructor(config) {
        this.updateConfig(config);
    }
    updateConfig(config) {
        this.config = Object.assign({}, config, {
            id: Array.isArray(config.id)
                ? config.id
                : config.id !== undefined
                ? [config.id]
                : [],
        });
    }
    updateProps(props) {
        this.props = Object.assign({}, props);
    }
}
