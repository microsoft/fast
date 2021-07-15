import { DataDictionary } from "@microsoft/fast-tooling";
import { Scenario } from "../configs/data.props";
export interface HTMLScenario {
    displayName: string;
    html: string;
}
export declare function mapHTMLToDataDictionary(
    scenario: HTMLScenario
): DataDictionary<unknown>;
export declare function mapScenarios(scenarios: HTMLScenario[]): Scenario[];
