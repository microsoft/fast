import { WebComponentDefinition } from "@microsoft/fast-tooling/dist/data-utilities/web-component";

// export * from "./div.definition";
// export * from "./heading.definition";
// export * from "./image.definition";
// export * from "./label.definition";
// export * from "./paragraph.definition";
// export * from "./path.definition";
// export * from "./span.definition";
// export * from "./style.definition";
// export * from "./svg.definition";
const vcodeHTMLData = require("vscode-web-custom-data/data/browsers.html-data.json");
export const nativeHTMLDefinitions: any = {
    version: vcodeHTMLData["version"],
    tags: vcodeHTMLData["tags"],
};

nativeHTMLDefinitions["tags"] = nativeHTMLDefinitions["tags"].map((tag: any) => {
    console.log(tag);
    if (tag.name in ["h1", "h2", "h3", "p", "pre"]) {
        tag["slots"] = [
            {
                name: "",
                description: "The default slot",
            },
        ];
    }
    return tag;
});
