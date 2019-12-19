export interface PluginProps {
    /**
     * The string(s) used to identify the plugin instance,
     * Identified in the JSON schema with the `messageSystemPluginId` property
     */
    id: string | string[];
}

export default abstract class Plugin<C extends PluginProps> {
    private config: C;

    constructor(config: C) {
        this.config = config;

        this.config.id = Array.isArray(this.config.id)
            ? this.config.id
            : [this.config.id];
    }

    /**
     * Determines if there is a match for the IDs set for the plugin
     * and a provided ID
     */
    public matches(id: string): boolean {
        return this.config.id.indexOf(id) !== -1;
    }
}
