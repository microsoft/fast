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
     * React component with API data
     */
    api: React.ComponentClass | null;

    /**
     * The JSON schema associated with the component
     */
    schema: any;

    /**
     * The guidance extrapolated from the components README file
     */
    guidance: React.ComponentClass;

    /**
     * The React component class
     */
    component: React.ComponentClass;

    /**
     * The scenarios associated with the component
     */
    scenarios: Array<Scenario<D>>;
}
