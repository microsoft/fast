import { attr } from "@microsoft/fast-element/attr.js";
import { declarativeTemplate } from "@microsoft/fast-element/declarative.js";
import { FASTElement } from "@microsoft/fast-element/fast-element.js";
import { observable } from "@microsoft/fast-element/observable.js";

const promiseEvents: Array<{ promise: string; name?: string }> = [];

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

const elementTypes = [
    [BasicElement, "basic-element"],
    [CounterElement, "counter-element"],
] as const;

void Promise.all(
    elementTypes.map(([type, name]) =>
        type.whenRegistered.then(() => {
            promiseEvents.push({ promise: "whenRegistered", name });
        }),
    ),
).then(() => {
    (window as any).allDefined = true;
});

(window as any).promiseEvents = promiseEvents;
