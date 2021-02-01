import { DataDictionary } from "@microsoft/fast-tooling";
import { WebComponentDefinition } from "@microsoft/fast-tooling/dist/esm/data-utilities/web-component";

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
     * The component definition
     */
    definition: WebComponentDefinition;

    /**
     * The guidance extrapolated from the components README file
     */
    guidance: React.ComponentClass;

    /**
     * The scenarios associated with the component
     */
    scenarios: Array<Scenario>;
}
