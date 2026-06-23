import { attr } from "@microsoft/fast-element/attr.js";
import { declarativeTemplate } from "@microsoft/fast-element/declarative.js";
import { FASTElement } from "@microsoft/fast-element/fast-element.js";
import { enableHydration, StopHydration } from "@microsoft/fast-element/hydration.js";

export const hydrationEvents: string[] = [];

enableHydration({
    stopHydration: StopHydration.never,
});

export class HydrationOptionsElement extends FASTElement {
    @attr
    label: string = "Initial";
}

void HydrationOptionsElement.whenHydrated.then(() => {
    hydrationEvents.push("component-complete");
    (window as any).hydrationCompleted = true;
});

HydrationOptionsElement.define({
    name: "hydration-config-element",
    template: declarativeTemplate(),
});
