import { DataType } from "@microsoft/fast-tooling";
import { WebComponentAttribute } from "@microsoft/fast-tooling/dist/data-utilities/web-component";
import { voidElements } from "@microsoft/fast-tooling/dist/data-utilities/html-element";

/**
 * These definitions are dependent on a devDependency on "vscode-web-custom-data"
 * speficially the browsers.html-data.json which defines native html elements and their attributes
 * as used by vscode
 */
import * as vcodeHTMLData from "vscode-web-custom-data/data/browsers.html-data.json";

const valueSets: any[] = vcodeHTMLData.valueSets;

export const htmlNativeDefinitions: any = {
    version: 1, // WebComponentDefinition has this typed as 1, vcodeHTMLData.version could be anything
    tags: vcodeHTMLData.tags,
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

    /**
     * default and required are not extractable from vscode html definitions files
     * so hard coding them to what was in the previously used definition files, "" and false
     */
    return tag.attributes?.map((attribute: any) => {
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
