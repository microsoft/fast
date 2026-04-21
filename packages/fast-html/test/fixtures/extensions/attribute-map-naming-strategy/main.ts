import { FASTElement } from "@microsoft/fast-element";
import { TemplateElement } from "@microsoft/fast-html";

class NamingStrategyTestElement extends FASTElement {}

NamingStrategyTestElement.defineAsync({
    name: "naming-strategy-test",
});

class NamingStrategyNoDashTestElement extends FASTElement {}

NamingStrategyNoDashTestElement.defineAsync({
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
