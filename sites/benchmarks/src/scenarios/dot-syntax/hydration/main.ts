import { declarativeTemplate } from "@microsoft/fast-element/declarative.js";
import { enableHydration, whenHydrated } from "@microsoft/fast-element/hydration.js";
import { observerMap } from "@microsoft/fast-element/observer-map.js";
import { signalDone } from "../../harness.js";
import { BenchElement } from "../element.js";

BenchElement.define(
    {
        name: "dot-syntax-bench-element",
        template: declarativeTemplate(),
    },
    [observerMap()],
);

performance.mark("bench-start");

enableHydration();
void whenHydrated.then(() => {
    performance.mark("bench-end");
    signalDone();
});
