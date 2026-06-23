import { declarativeTemplate } from "@microsoft/fast-element/declarative.js";
import { enableHydration, whenHydrated } from "@microsoft/fast-element/hydration.js";
import { signalDone } from "../../harness.js";
import { BenchElement } from "../element.js";

BenchElement.define({
    name: "attr-reflect-bench-element",
    template: declarativeTemplate(),
});

performance.mark("bench-start");

enableHydration();
void whenHydrated.then(() => {
    performance.mark("bench-end");
    signalDone();
});
