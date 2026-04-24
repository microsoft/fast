import { attr, FASTElement } from "@microsoft/fast-element";
import { TemplateElement } from "@microsoft/fast-element/declarative.js";

class TestCamelCase extends FASTElement {
    @attr({ attribute: "foo-bar" })
    fooBar: string = "";
}
TestCamelCase.define({
    name: "test-camel-case",
});

class TestCamelCaseMulti extends FASTElement {
    @attr({ attribute: "my-custom-prop" })
    myCustomProp: string = "";
}
TestCamelCaseMulti.define({
    name: "test-camel-case-multi",
});

class TestCamelCaseNoDash extends FASTElement {
    @attr
    label: string = "";
}
TestCamelCaseNoDash.define({
    name: "test-camel-case-no-dash",
});

TemplateElement.config({
    hydrationComplete() {
        (window as any).hydrationCompleted = true;
    },
}).define({
    name: "f-template",
});
