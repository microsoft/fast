import { attr } from "@microsoft/fast-element/attr.js";
import { declarativeTemplate } from "@microsoft/fast-element/declarative.js";
import { FASTElement } from "@microsoft/fast-element/fast-element.js";
import { enableHydration } from "@microsoft/fast-element/hydration.js";

const hydration = enableHydration();

class TestSlotFallback extends FASTElement {}
TestSlotFallback.define({
    name: "test-slot-fallback",
    template: declarativeTemplate(),
});

class TestConditionalSlot extends FASTElement {
    @attr({ mode: "boolean" })
    show: boolean = false;
}
TestConditionalSlot.define({
    name: "test-conditional-slot",
    template: declarativeTemplate(),
});

void hydration.whenHydrated().then(() => {
    (window as any).hydrationCompleted = true;
});
