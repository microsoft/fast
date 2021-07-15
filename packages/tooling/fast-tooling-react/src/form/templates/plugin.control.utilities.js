export default class ControlPluginUtilities {
    constructor(config) {
        this.updateConfig(config);
    }
    /**
     * Determines if there is a match for the IDs set for the plugin
     * and a provided ID
     */
    matchesId(id) {
        return this.config.id.indexOf(id) !== -1;
    }
    /**
     * Determines if there is a match for the type set for the plugin
     */
    matchesType(type) {
        return this.config.type === type;
    }
    /**
     * Determines if there is a match to any control
     */
    matchesAllTypes() {
        return this.config.type === undefined && this.config.id.length === 0;
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
