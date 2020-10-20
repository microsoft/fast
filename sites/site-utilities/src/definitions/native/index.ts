import { DataType } from "@microsoft/fast-tooling";
import { WebComponentDefinition } from "@microsoft/fast-tooling/dist/data-utilities/web-component";
import { table } from "console";
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

export const nativeHTMLDefinitions: WebComponentDefinition = {
    version: vcodeHTMLData["version"],
    tags: vcodeHTMLData["tags"],
};

nativeHTMLDefinitions.tags = nativeHTMLDefinitions.tags?.map((tag: any) => {
    console.log(tag);
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
    tag.description = tag.description.value ?? "";
    if (tag.attributes) {
        tag.attributes = tag.attributes.map((attr: any) => {
            return {
                name: attr.name,
                description: attr.name,
                default: undefined,
                type: DataType.string,
            };
        });
    }
    return tag;
});

console.log("nativeHTMLDefinitions:", nativeHTMLDefinitions);
