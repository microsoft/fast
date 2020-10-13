import { DataDictionary } from "@microsoft/fast-tooling";
import { mapVSCodeParsedHTMLToDataDictionary } from "@microsoft/fast-tooling/dist/data-utilities/mapping.vscode-html-languageservice";
import { Scenario } from "../configs/data.props";
import { schemaDictionary } from "./schema-dictionary";

export interface HTMLScenario {
    displayName: string;
    html: string;
}

export function mapHTMLToDataDictionary(scenario: HTMLScenario): DataDictionary<unknown> {
    return mapVSCodeParsedHTMLToDataDictionary({
        value: scenario.html.split("\n").map((line: string) => {
            return line.trim();
        }),
        schemaDictionary,
    });
}

export function mapScenarios(scenarios: HTMLScenario[]): Scenario[] {
    return scenarios.map(
        (scenario: HTMLScenario): Scenario => {
            return {
                displayName: scenario.displayName,
                dataDictionary: mapHTMLToDataDictionary(scenario),
            };
        }
    );
}
