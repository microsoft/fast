import { mapVSCodeParsedHTMLToDataDictionary } from "@microsoft/fast-tooling/dist/esm/data-utilities/mapping.vscode-html-languageservice";
import { schemaDictionary } from "./schema-dictionary";
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
