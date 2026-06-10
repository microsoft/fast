import { attr } from "@microsoft/fast-element/attr.js";
import { declarativeTemplate } from "@microsoft/fast-element/declarative.js";
import { FASTElement } from "@microsoft/fast-element/fast-element.js";
import { enableHydration } from "@microsoft/fast-element/hydration.js";

export const hydrationEvents: string[] = [];

enableHydration({
    noopAfterHydrationComplete: false,
    hydrationComplete(): void {
        hydrationEvents.push("complete");
        (window as any).hydrationCompletionCount = hydrationEvents.length;
    },
});

export class HydrationOptionsElement extends FASTElement {
    @attr
    label: string = "Initial";
}

HydrationOptionsElement.define({
    name: "hydration-config-element",
    template: declarativeTemplate(),
});

(window as any).hydrationEvents = hydrationEvents;
