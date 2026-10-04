import { FASTElement, observable } from "@microsoft/fast-element";
import { declarativeTemplate } from "@microsoft/fast-element/declarative.js";
import { enableHydration } from "@microsoft/fast-element/hydration.js";

export class TestEventOptions extends FASTElement {
    @observable items = ["first"];
    captureCalls = 0;
    capturePhase = 0;
    onceCalls = 0;
    passiveCalls = 0;
    combinedCalls = 0;
    combinedPhase = 0;
    phases: number[] = [];
    ordinaryCalls = 0;

    handleCapture(event: Event) {
        this.captureCalls++;
        this.capturePhase = event.eventPhase;
        return true;
    }

    handleOnce() {
        this.onceCalls++;
        return true;
    }

    handlePassive(event: Event) {
        this.passiveCalls++;
        event.preventDefault();
        return false;
    }

    handleCombined(event: Event) {
        this.combinedCalls++;
        this.combinedPhase = event.eventPhase;
        return true;
    }

    handlePhase(event: Event) {
        this.phases.push(event.eventPhase);
        return true;
    }

    handleOrdinary() {
        this.ordinaryCalls++;
        return false;
    }
}

TestEventOptions.define({
    name: "test-event-options",
    template: declarativeTemplate(),
});

const hydration = enableHydration();
void hydration.whenHydrated().then(() => {
    const clientElement = new TestEventOptions();
    clientElement.id = "csr";
    document.body.appendChild(clientElement);
    (window as any).hydrationCompleted = true;
});
