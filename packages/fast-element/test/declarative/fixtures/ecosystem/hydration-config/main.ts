import { attr } from "@microsoft/fast-element/attr.js";
import { declarativeTemplate } from "@microsoft/fast-element/declarative.js";
import { FASTElement } from "@microsoft/fast-element/fast-element.js";
import {
    enableHydration,
    StopHydration,
    whenHydrated,
} from "@microsoft/fast-element/hydration.js";

export const hydrationEvents: string[] = [];

enableHydration({
    stopHydration: StopHydration.never,
});
void whenHydrated.then(() => {
    hydrationEvents.push("complete");
    (window as any).hydrationCompleted = true;
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
