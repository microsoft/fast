import { declarativeTemplate } from "@microsoft/fast-element/declarative.js";
import { enableHydration } from "@microsoft/fast-element/hydration.js";
import { signalDone } from "../../harness.js";
import { BenchElement } from "../element.js";

BenchElement.define({
    name: "repeat-bench-element",
    template: declarativeTemplate(),
});

performance.mark("bench-start");

const hydration = enableHydration();
void hydration.whenHydrated().then(() => {
    performance.mark("bench-end");
    signalDone();
});
