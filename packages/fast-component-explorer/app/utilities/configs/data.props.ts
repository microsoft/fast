export interface Scenario<D> {
    /**
     * The name to display for this scenario
     */
    displayName: string;

    /**
     * The data for this scenario
     */
    data: D;
}

export interface ComponentViewConfig<D> {
    /**
     * The JSON schema associated with the component
     */
    schema: any;

    /**
     * The React component class
     */
    component: React.ComponentClass;

    /**
     * The scenarios associated with the component
     */
    scenarios: Scenario<D>[];
}
