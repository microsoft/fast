import { FASTElement } from "@microsoft/fast-element";
import { TemplateElement } from "@microsoft/fast-element/declarative.js";

class NamingStrategyTestElement extends FASTElement {}

NamingStrategyTestElement.define({
    name: "naming-strategy-test",
});

class NamingStrategyNoDashTestElement extends FASTElement {}

NamingStrategyNoDashTestElement.define({
    name: "naming-strategy-no-dash-test",
});

TemplateElement.options({
    "naming-strategy-test": {
        attributeMap: {
            "attribute-name-strategy": "camelCase",
        },
    },
    "naming-strategy-no-dash-test": {
        attributeMap: {
            "attribute-name-strategy": "camelCase",
        },
    },
}).define({ name: "f-template" });
