import { DataDictionary } from "@microsoft/fast-tooling";

export interface Scenario {
    /**
     * The name to display for this scenario
     */
    displayName: string;

    /**
     * The data for this scenario
     */
    dataDictionary: DataDictionary<unknown>;
}

export interface ComponentViewConfig {
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
    scenarios: Array<Scenario>;
}
