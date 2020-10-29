import { DataType } from "@microsoft/fast-tooling";
import {
    WebComponentAttribute,
    WebComponentAttributeValues,
    WebComponentDefinition,
    WebComponentDefinitionTag,
    WebComponentSlot,
} from "@microsoft/fast-tooling/dist/data-utilities/web-component";
import { voidElements } from "@microsoft/fast-tooling/dist/data-utilities/html-element";
/**
 * These definitions are dependent on a devDependency on "vscode-web-custom-data"
 * specifically the browsers.html-data.json which defines native html elements and their attributes
 * as used by vscode
 */
import * as vscodeHTMLData from "vscode-web-custom-data/data/browsers.html-data.json";
import {
    VSCodeNativeHTMLAttribute,
    VSCodeNativeHTMLDefinition,
    VSCodeNativeHTMLTag,
    VSCodeNativeHTMLValueSet,
} from "./html-native.vs-code-v1.1-types";

const valueSets: VSCodeNativeHTMLValueSet[] = vscodeHTMLData.valueSets;
const defaultSlotValue: WebComponentSlot[] = [
    {
        name: "",
        description: "The default slot",
    },
];

function getDataTypeForAttribute(attribute: VSCodeNativeHTMLAttribute): DataType {
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

function findValueSetValues(
    valueSetName: string
): WebComponentAttributeValues[] | undefined {
    const valueSet: VSCodeNativeHTMLValueSet | undefined = valueSets.find(
        (item: VSCodeNativeHTMLValueSet) => {
            return item.name === valueSetName;
        }
    );
    return valueSet && valueSet.values ? valueSet.values : undefined;
}

function convertAttributeData(tag: VSCodeNativeHTMLTag): WebComponentAttribute[] {
    if (!tag.attributes) {
        return [];
    }

    /**
     * default and required are not extractable from vscode html definitions files
     * so hard coding them to what was in the previously used definition files, "" and false
     */
    return tag.attributes?.map((attribute: VSCodeNativeHTMLAttribute) => {
        return {
            name: attribute.name,
            description: attribute.name,
            type: getDataTypeForAttribute(attribute),
            default: "",
            required: false,
            values: findValueSetValues(attribute.valueSet),
        };
    });
}

const convertedTags: WebComponentDefinitionTag[] = (vscodeHTMLData as VSCodeNativeHTMLDefinition).tags?.map(
    (tag: VSCodeNativeHTMLTag): WebComponentDefinitionTag => {
        const newWebComponentDefinitionTag: WebComponentDefinitionTag = {
            name: tag.name,
            description: tag.description.value ?? "", // TODO: this ?? might not work if typescript is not 4.0+
            attributes: convertAttributeData(tag),
            slots: [],
        };
        if (!voidElements.includes(tag.name)) {
            Object.assign(newWebComponentDefinitionTag, {
                slots: defaultSlotValue,
            });
        }
        return newWebComponentDefinitionTag;
    }
);

/**
 * WebComponentDefinition has version typed as 1
 * vcodeHTMLData.version could be anything so this will need to check for different versions to determine how to approach the conversion
 */
export const htmlNativeDefinitions: WebComponentDefinition = {
    version: 1,
    tags: convertedTags,
};
