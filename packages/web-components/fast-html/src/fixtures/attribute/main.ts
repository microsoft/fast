import { TemplateElement } from "@microsoft/fast-html";
import { attr, FASTElement } from "@microsoft/fast-element";

class TestElement extends FASTElement {
    @attr
    type: string = "radio";
}
TestElement.define({
    name: "test-element",
    shadowOptions: null,
});

TemplateElement.options({
    "test-element": {
        shadowOptions: {
            mode: "closed",
        },
    },
}).define({
    name: "f-template",
});
