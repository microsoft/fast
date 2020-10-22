import { DataType } from "@microsoft/fast-tooling";
import {
    WebComponentAttribute,
    WebComponentAttributeValues,
    WebComponentDefinition,
} from "@microsoft/fast-tooling/dist/data-utilities/web-component";
// export * from "./div.definition";
// export * from "./heading.definition";
// export * from "./image.definition";
// export * from "./label.definition";
// export * from "./paragraph.definition";
export * from "./path.definition";
// export * from "./span.definition";
// export * from "./style.definition";
export * from "./svg.definition";

const voidElements: string[] = [
    "area",
    "base",
    "br",
    "col",
    "embed",
    "hr",
    "img",
    "input",
    "keygen",
    "link",
    "menuitem",
    "meta",
    "param",
    "source",
    "track",
    "wbr",
];

const vcodeHTMLData = require("vscode-web-custom-data/data/browsers.html-data.json");
const valueSets: any[] = vcodeHTMLData["valueSets"];

export const nativeHTMLDefinitions: WebComponentDefinition = {
    version: vcodeHTMLData["version"],
    tags: vcodeHTMLData["tags"],
};

function getDataTypeForAttribute(attribute: any): DataType {
    switch (attribute.valueSet) {
        case "b":
        case "v":
            return DataType.boolean;
        default:
            return DataType.string;
    }
}

function findValueSet(valueSetName: string): any | undefined {
    return valueSets.find((item: any) => {
        return item.name === valueSetName;
    });
}

function getValuesFromValueSet(valueName: string | undefined): any[] | undefined {
    let valueSet: any | undefined;
    if (valueName !== undefined) {
        valueSet = findValueSet(valueName);
    }
    return valueSet && valueSet.values ? valueSet.values : undefined;
}

function convertAttributeData(tag: any): WebComponentAttribute[] {
    if (!tag.attributes) {
        return [];
    }

    return tag.attributes?.map((attribute: any) => {
        let valueSet: any[] | undefined = getValuesFromValueSet(attribute.valueSet);

        return {
            name: attribute.name,
            description: attribute.name,
            type: getDataTypeForAttribute(attribute),
            default: undefined,
            required: false,
            values: valueSet,
        };
    });
}

nativeHTMLDefinitions.tags = nativeHTMLDefinitions.tags?.map((tag: any) => {
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

console.log("nativeHTMLDefinitions:", nativeHTMLDefinitions);
