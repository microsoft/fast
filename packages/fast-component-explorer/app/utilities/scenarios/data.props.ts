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
