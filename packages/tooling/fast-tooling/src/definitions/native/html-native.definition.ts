import * as vscodeHTMLData from "vscode-web-custom-data/data/browsers.html-data.json";
import { DataType } from "../../data-utilities";
import {
    WebComponentAttribute,
    WebComponentAttributeValues,
    WebComponentDefinition,
    WebComponentDefinitionTag,
    WebComponentSlot,
} from "../../data-utilities/web-component";
import { voidElements } from "../../data-utilities/html-element";
/**
 * These native html tag definitions are dependent on a devDependency on "vscode-web-custom-data"
 * specifically the browsers.html-data.json file which defines native html elements and their attributes
 * as used by vscode
 */
import {
    VSCodeNativeHTMLAttribute,
    VSCodeNativeHTMLDefinition,
    VSCodeNativeHTMLTag,
    VSCodeNativeHTMLTagDescription,
    VSCodeNativeHTMLValueSet,
} from "./html-native.vs-code-v1.1-types";

const valueSets: VSCodeNativeHTMLValueSet[] = vscodeHTMLData.valueSets;
const defaultSlotValue: WebComponentSlot[] = [
    {
        name: "",
        title: "Default slot",
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
    valueSetName?: string
): WebComponentAttributeValues[] | undefined {
    const valueSet: VSCodeNativeHTMLValueSet | undefined =
        valueSets !== undefined
            ? valueSets.find((item: VSCodeNativeHTMLValueSet) => {
                  return item.name === valueSetName;
              })
            : undefined;
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
            title: attribute.name,
            type: getDataTypeForAttribute(attribute),
            default: "",
            required: false,
            values: findValueSetValues(attribute.valueSet),
            description: attribute.description ? attribute.description.toString() : "",
        };
    });
}

const convertedTags: WebComponentDefinitionTag[] = (vscodeHTMLData as VSCodeNativeHTMLDefinition).tags?.map(
    (tag: VSCodeNativeHTMLTag): WebComponentDefinitionTag => {
        const newWebComponentDefinitionTag: WebComponentDefinitionTag = {
            name: tag.name,
            title: tag.name,
            description:
                typeof tag.description === "string"
                    ? tag.description
                    : (tag.description as VSCodeNativeHTMLTagDescription).value ?? "", // TODO: this ?? might not work if typescript is not 4.0+
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
