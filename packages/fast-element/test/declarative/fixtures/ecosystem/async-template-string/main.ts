import { attr } from "@microsoft/fast-element/attr.js";
import { declarativeTemplate } from "@microsoft/fast-element/declarative.js";
import { FASTElement } from "@microsoft/fast-element/fast-element.js";
import { observable } from "@microsoft/fast-element/observable.js";

type LifecycleEvent = { callback: string; name?: string };

const lifecycleEvents: LifecycleEvent[] = [];
const templateCallbackEvents: string[] = [];

class AsyncTemplateCard extends FASTElement {
    @attr
    message: string = "Async string template";

    @attr
    description: string = "Loaded from an async template string.";

    @observable
    count: number = 0;

    increment(): void {
        this.count++;
    }
}

AsyncTemplateCard.define({
    name: "async-template-card",
    template: declarativeTemplate({
        async callback({ definition, templateStringResolver }) {
            templateCallbackEvents.push("callback-start");

            const asyncTemplateString = import("./template-string.js").then(
                module => module.asyncTemplateString,
            );

            if (definition.name !== "async-template-card") {
                throw new Error(`Unexpected template definition: ${definition.name}`);
            }

            await templateStringResolver(asyncTemplateString);
            templateCallbackEvents.push("callback-resolved");
        },
        elementDidRegister(name: string): void {
            lifecycleEvents.push({ callback: "elementDidRegister", name });
        },
        templateWillUpdate(name: string): void {
            lifecycleEvents.push({ callback: "templateWillUpdate", name });
        },
        templateDidUpdate(name: string): void {
            lifecycleEvents.push({ callback: "templateDidUpdate", name });
        },
        elementDidDefine(name: string): void {
            lifecycleEvents.push({ callback: "elementDidDefine", name });
            (window as any).allDefined = true;
        },
    }),
});

(window as any).lifecycleEvents = lifecycleEvents;
(window as any).templateCallbackEvents = templateCallbackEvents;
