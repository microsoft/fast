import { DataType } from "@microsoft/fast-tooling";
import {
    WebComponentAttribute,
    WebComponentDefinition,
} from "@microsoft/fast-tooling/dist/data-utilities/web-component";
import { voidElements } from "@microsoft/fast-tooling/dist/data-utilities/html-element";

export * from "./path.definition";
export * from "./svg.definition";

/**
 * These definitions are dependent on a devDependency on "vscode-web-custom-data"
 * speficially the browsers.html-data.json which defines native html elements and their attributes
 * as used by vscode
 */
const vcodeHTMLData = require("vscode-web-custom-data/data/browsers.html-data.json");
const valueSets: any[] = vcodeHTMLData["valueSets"];

export const htmlNativeDefinitions: WebComponentDefinition = {
    version: vcodeHTMLData["version"],
    tags: vcodeHTMLData["tags"],
};

function getDataTypeForAttribute(attribute: any): DataType {
    /**
     * For some reason valueSets references "v" in many boolean like attributes but does not define "v",
     * It does define "b" and both are utilized as booleans for all attributes
     */
    switch (attribute.valueSet) {
        case "b":
        case "v":
            return DataType.boolean;
        default:
            return DataType.string;
    }
}

function findValueSetValues(valueSetName: string): any | undefined {
    const valueSet: any | undefined = valueSets.find((item: any) => {
        return item.name === valueSetName;
    });
    return valueSet && valueSet.values ? valueSet.values : undefined;
}

function convertAttributeData(tag: any): WebComponentAttribute[] {
    if (!tag.attributes) {
        return [];
    }

    return tag.attributes?.map((attribute: any) => {
        return {
            name: attribute.name,
            description: attribute.name,
            type: getDataTypeForAttribute(attribute),
            default: undefined,
            required: false,
            values: findValueSetValues(attribute.valueSet),
        };
    });
}

htmlNativeDefinitions.tags = htmlNativeDefinitions.tags?.map((tag: any) => {
    if (!voidElements.includes(tag.name)) {
        Object.assign(tag, {
            slots: [
                {
                    name: "",
                    description: "The default slot",
                },
            ],
        });
    } else {
        Object.assign(tag, {
            slots: [],
        });
    }
    // TODO: this ?? might not work if typescript is not 4.0+
    tag.description = tag.description.value ?? "";
    tag.attributes = convertAttributeData(tag);
    return tag;
});
