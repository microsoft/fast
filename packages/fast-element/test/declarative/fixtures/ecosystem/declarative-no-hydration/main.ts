import { attr } from "@microsoft/fast-element/attr.js";
import { declarativeTemplate } from "@microsoft/fast-element/declarative.js";
import { FASTElement } from "@microsoft/fast-element/fast-element.js";
import { observable } from "@microsoft/fast-element/observable.js";

class BasicElement extends FASTElement {
    @attr
    greeting: string = "Hello";
}

const basicDefinition = BasicElement.define({
    name: "basic-element",
    template: declarativeTemplate(),
});

class CounterElement extends FASTElement {
    @observable
    count: number = 0;

    increment() {
        this.count++;
    }
}

const counterDefinition = CounterElement.define({
    name: "counter-element",
    template: declarativeTemplate(),
});

void Promise.all([basicDefinition, counterDefinition]).then(() => {
    (window as any).allDefined = true;
});
