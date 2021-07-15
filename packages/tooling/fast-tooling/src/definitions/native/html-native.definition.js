var _a;
import * as vscodeHTMLData from "vscode-web-custom-data/data/browsers.html-data.json";
import { DataType } from "../../data-utilities";
import { voidElements } from "../../data-utilities/html-element";
const valueSets = vscodeHTMLData.valueSets;
const defaultSlotValue = [
    {
        name: "",
        title: "Default slot",
        description: "The default slot",
    },
];
function getDataTypeForAttribute(attribute) {
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
function findValueSetValues(valueSetName) {
    const valueSet =
        valueSets !== undefined
            ? valueSets.find(item => {
                  return item.name === valueSetName;
              })
            : undefined;
    return valueSet && valueSet.values ? valueSet.values : undefined;
}
function convertAttributeData(tag) {
    var _a;
    if (!tag.attributes) {
        return [];
    }
    /**
     * default and required are not extractable from vscode html definitions files
     * so hard coding them to what was in the previously used definition files, "" and false
     */
    return (_a = tag.attributes) === null || _a === void 0
        ? void 0
        : _a.map(attribute => {
              return {
                  name: attribute.name,
                  title: attribute.name,
                  type: getDataTypeForAttribute(attribute),
                  default: "",
                  required: false,
                  values: findValueSetValues(attribute.valueSet),
                  description: attribute.description
                      ? attribute.description.toString()
                      : "",
              };
          });
}
const convertedTags =
    (_a = vscodeHTMLData.tags) === null || _a === void 0
        ? void 0
        : _a.map(tag => {
              var _a;
              const newWebComponentDefinitionTag = {
                  name: tag.name,
                  title: tag.name,
                  description:
                      typeof tag.description === "string"
                          ? tag.description
                          : (_a = tag.description.value) !== null && _a !== void 0
                          ? _a
                          : "",
                  attributes: convertAttributeData(tag),
                  slots: [],
              };
              if (!voidElements.includes(tag.name)) {
                  Object.assign(newWebComponentDefinitionTag, {
                      slots: defaultSlotValue,
                  });
              }
              return newWebComponentDefinitionTag;
          });
/**
 * WebComponentDefinition has version typed as 1
 * vcodeHTMLData.version could be anything so this will need to check for different versions to determine how to approach the conversion
 */
export const htmlNativeDefinitions = {
    version: 1,
    tags: convertedTags,
};
