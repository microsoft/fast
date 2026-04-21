import { FASTElement } from "@microsoft/fast-element";
import { attributeMap, TemplateElement } from "@microsoft/fast-html";

class NamingStrategyTestElement extends FASTElement {}

NamingStrategyTestElement.defineAsync({
    name: "naming-strategy-test",
});

class NamingStrategyNoDashTestElement extends FASTElement {}

NamingStrategyNoDashTestElement.defineAsync({
    name: "naming-strategy-no-dash-test",
});

attributeMap({ config: { "attribute-name-strategy": "camelCase" } })(
    "naming-strategy-test",
);
attributeMap({ config: { "attribute-name-strategy": "camelCase" } })(
    "naming-strategy-no-dash-test",
);

TemplateElement.define({ name: "f-template" });
