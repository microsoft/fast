import { FASTElement } from "@microsoft/fast-element";
import { attributeMap, TemplateElement } from "@microsoft/fast-element/declarative.js";

class NamingStrategyTestElement extends FASTElement {}

NamingStrategyTestElement.define(
    {
        name: "naming-strategy-test",
    },
    [
        attributeMap({
            "attribute-name-strategy": "camelCase",
        }),
    ],
);

class NamingStrategyNoDashTestElement extends FASTElement {}

NamingStrategyNoDashTestElement.define(
    {
        name: "naming-strategy-no-dash-test",
    },
    [
        attributeMap({
            "attribute-name-strategy": "camelCase",
        }),
    ],
);

TemplateElement.define({ name: "f-template" });
