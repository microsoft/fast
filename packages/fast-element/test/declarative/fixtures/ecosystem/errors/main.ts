import { enableDebug } from "@microsoft/fast-element/debug.js";
import { declarativeTemplate } from "@microsoft/fast-element/declarative.js";
import { FASTElement } from "@microsoft/fast-element/fast-element.js";

enableDebug();

class TestElementNoTemplate extends FASTElement {}
FASTElement.define(TestElementNoTemplate, {
    name: "test-element-no-template",
    template: declarativeTemplate(),
});

class TestElementMultipleTemplates extends FASTElement {}
FASTElement.define(TestElementMultipleTemplates, {
    name: "test-element-multiple-templates",
    template: declarativeTemplate(),
});
