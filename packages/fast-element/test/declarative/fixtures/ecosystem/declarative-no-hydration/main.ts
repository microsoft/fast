import { attr } from "@microsoft/fast-element/attr.js";
import { declarativeTemplate } from "@microsoft/fast-element/declarative.js";
import { FASTElement } from "@microsoft/fast-element/fast-element.js";
import { observable } from "@microsoft/fast-element/observable.js";
import { whenRegistered } from "@microsoft/fast-element/registry.js";

const promiseEvents: Array<{ promise: string; name?: string }> = [];
const elementNames = ["basic-element", "counter-element"];

void Promise.all(
    elementNames.map(name =>
        whenRegistered(name).then(() => {
            promiseEvents.push({ promise: "whenRegistered", name });
        }),
    ),
).then(() => {
    (window as any).allDefined = true;
});

class BasicElement extends FASTElement {
    @attr
    greeting: string = "Hello";
}

BasicElement.define({
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

CounterElement.define({
    name: "counter-element",
    template: declarativeTemplate(),
});

(window as any).promiseEvents = promiseEvents;
