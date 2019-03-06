export interface FormPluginProps {
    /**
     * The string(s) used to identify the plugin instance,
     *
     * Typically used in conjunction with the `formPluginId` property
     * in a JSON schema and identified in the `mapPluginToSchema` function.
     */
    id: string | string[];
}

export abstract class FormPlugin<C extends FormPluginProps> {
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

    /**
     * Resolves the schema partial given
     */
    /* tslint:disable-next-line */
    public resolver(schema: any, data?: any): any {}
}
