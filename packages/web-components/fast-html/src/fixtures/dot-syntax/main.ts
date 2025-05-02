import { TemplateElement } from "@microsoft/fast-html";
import { FASTElement } from "@microsoft/fast-element";

class TestElement extends FASTElement {
    public object: any = {
        foo: "bar",
    };
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
