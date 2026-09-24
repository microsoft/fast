import { attr } from "@microsoft/fast-element/attr.js";
import { declarativeTemplate } from "@microsoft/fast-element/declarative.js";
import { FASTElement } from "@microsoft/fast-element/fast-element.js";
import { enableHydration, markers_v2 } from "@microsoft/fast-element/hydration.js";
import { observable } from "@microsoft/fast-element/observable.js";

const hydration = enableHydration({ markers: markers_v2 });

export class HydrationMarkersV2Element extends FASTElement {
    @observable
    items: string[] = ["one", "two"];

    @attr({ mode: "boolean" })
    disabled: boolean = false;

    input!: HTMLInputElement;
    count: number = 0;

    increment(): void {
        this.count++;
    }
}

HydrationMarkersV2Element.define({
    name: "hydration-markers-v2-element",
    template: declarativeTemplate(),
});

void hydration.whenHydrated().then(() => {
    (window as any).hydrationCompleted = true;
});
