import { attributeMap, FASTElement } from "@microsoft/fast-element";
import { TemplateElement } from "@microsoft/fast-html";

class NamingStrategyTestElement extends FASTElement {}

NamingStrategyTestElement.define({
    name: "naming-strategy-test",
    templateOptions: "defer-and-hydrate",
}, [attributeMap({ attributeNameStrategy: "camelCase" })]);

class NamingStrategyNoDashTestElement extends FASTElement {}

NamingStrategyNoDashTestElement.define({
    name: "naming-strategy-no-dash-test",
    templateOptions: "defer-and-hydrate",
}, [attributeMap({ attributeNameStrategy: "camelCase" })]);

TemplateElement.define({ name: "f-template" });
