import { FASTElement } from "@microsoft/fast-element";
import { attributeMap } from "@microsoft/fast-element/attribute-map.js";
import { declarativeTemplate } from "@microsoft/fast-element/declarative.js";

class NamingStrategyTestElement extends FASTElement {}

NamingStrategyTestElement.define(
    {
        name: "naming-strategy-test",
        template: declarativeTemplate(),
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
        template: declarativeTemplate(),
    },
    [
        attributeMap({
            "attribute-name-strategy": "camelCase",
        }),
    ],
);
