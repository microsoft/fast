import { FASTElement } from "@microsoft/fast-element";
import { attributeMap, TemplateElement } from "@microsoft/fast-html";

class NamingStrategyTestElement extends FASTElement {}

NamingStrategyTestElement.define({
    name: "naming-strategy-test",
    templateOptions: "defer-and-hydrate",
});

class NamingStrategyNoDashTestElement extends FASTElement {}

NamingStrategyNoDashTestElement.define({
    name: "naming-strategy-no-dash-test",
    templateOptions: "defer-and-hydrate",
});

attributeMap({ config: { "attribute-name-strategy": "camelCase" } })(
    "naming-strategy-test",
);
attributeMap({ config: { "attribute-name-strategy": "camelCase" } })(
    "naming-strategy-no-dash-test",
);

TemplateElement.define({ name: "f-template" });
