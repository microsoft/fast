import { attr, FASTElement } from "@microsoft/fast-element";
import { declarativeTemplate } from "@microsoft/fast-element/declarative.js";
import { enableHydration } from "@microsoft/fast-element/hydration.js";

class TestElement extends FASTElement {
    @attr
    text: string = "Hello";
}
TestElement.define({
    name: "test-element",
    template: declarativeTemplate(),
});

class TestElementUnescaped extends FASTElement {
    public html = `<p>Hello world</p>`;
}
TestElementUnescaped.define({
    name: "test-element-unescaped",
    template: declarativeTemplate(),
});

enableHydration({
    hydrationComplete() {
        (window as any).hydrationCompleted = true;
    },
});
