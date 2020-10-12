import { schemaDictionary } from "./schema-dictionary";
import { mapVSCodeParsedHTMLToDataDictionary } from "@microsoft/fast-tooling/dist/data-utilities/mapping.vscode-html-languageservice";

export function mapHTMLToDataDictionary(scenario) {
    return mapVSCodeParsedHTMLToDataDictionary({
        value: scenario.html.split("\n").map(line => {
            return line.trim();
        }),
        schemaDictionary,
    });
}

export function mapScenarios(scenarios) {
    return scenarios.map(scenario => {
        return {
            displayName: scenario.displayName,
            dataDictionary: mapHTMLToDataDictionary(scenario),
        };
    });
}
