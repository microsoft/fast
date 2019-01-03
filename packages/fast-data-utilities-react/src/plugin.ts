import { ChildOptionItem } from "./";

export interface PluginProps {
    /**
     * The string(s) associated by the plugin
     */
    pluginResolverId: string | string[];
}

export default abstract class Plugin<C extends PluginProps> {
    private config: C;

    constructor(config: C) {
        this.config = config;

        this.config.pluginResolverId = Array.isArray(this.config.pluginResolverId)
            ? this.config.pluginResolverId
            : [this.config.pluginResolverId];
    }

    /**
     * Determines if there is a match for the IDs set for the plugin
     * and a provided ID
     */
    public resolvesForId(pluginResolverId: string): boolean {
        return this.config.pluginResolverId.indexOf(pluginResolverId) !== -1;
    }

    /**
     * Resolves the data given
     */
    /* tslint:disable-next-line */
    public resolver(data: any, childOption?: ChildOptionItem): any {}
}
