import { FASTElement } from "@microsoft/fast-element";
import { attr } from "@microsoft/fast-element/attr.js";
import { declarativeTemplate } from "@microsoft/fast-element/declarative.js";
import { observable } from "@microsoft/fast-element/observable.js";

// No enableHydration() — test declarative template without hydration

const lifecycleEvents: Array<{ callback: string; name?: string }> = [];

class BasicElement extends FASTElement {
    @attr
    greeting: string = "Hello";
}

BasicElement.define({
    name: "basic-element",
    template: declarativeTemplate({
        elementDidRegister(name: string) {
            lifecycleEvents.push({ callback: "elementDidRegister", name });
        },
        templateWillUpdate(name: string) {
            lifecycleEvents.push({ callback: "templateWillUpdate", name });
        },
        templateDidUpdate(name: string) {
            lifecycleEvents.push({ callback: "templateDidUpdate", name });
        },
        elementDidDefine(name: string) {
            lifecycleEvents.push({ callback: "elementDidDefine", name });
            (window as any).elementsDefined = ((window as any).elementsDefined ?? 0) + 1;
            if ((window as any).elementsDefined >= 2) {
                (window as any).allDefined = true;
            }
        },
    }),
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
    template: declarativeTemplate({
        elementDidRegister(name: string) {
            lifecycleEvents.push({ callback: "elementDidRegister", name });
        },
        templateWillUpdate(name: string) {
            lifecycleEvents.push({ callback: "templateWillUpdate", name });
        },
        templateDidUpdate(name: string) {
            lifecycleEvents.push({ callback: "templateDidUpdate", name });
        },
        elementDidDefine(name: string) {
            lifecycleEvents.push({ callback: "elementDidDefine", name });
            (window as any).elementsDefined = ((window as any).elementsDefined ?? 0) + 1;
            if ((window as any).elementsDefined >= 2) {
                (window as any).allDefined = true;
            }
        },
    }),
});

(window as any).lifecycleEvents = lifecycleEvents;
