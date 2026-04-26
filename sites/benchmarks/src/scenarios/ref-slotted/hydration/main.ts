import { declarativeTemplate } from "@microsoft/fast-element/declarative.js";
import { enableHydration } from "@microsoft/fast-element/hydration.js";
import { signalDone } from "../../harness.js";
import { BenchElement } from "../element.js";

BenchElement.define({
    name: "ref-slotted-bench-element",
    template: declarativeTemplate(),
});

performance.mark("bench-start");

enableHydration({
    hydrationComplete() {
        performance.mark("bench-end");
        signalDone();
    },
});
