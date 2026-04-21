import { FASTElement } from "@microsoft/fast-element";
import { TemplateElement } from "@microsoft/fast-html";

class TestElementNoTemplate extends FASTElement {}
FASTElement.define(TestElementNoTemplate, { name: "test-element-no-template" });

class TestElementMultipleTemplates extends FASTElement {}
FASTElement.define(TestElementMultipleTemplates, {
    name: "test-element-multiple-templates",
});

TemplateElement.define({
    name: "f-template",
});
