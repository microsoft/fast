import { declarativeTemplate } from "@microsoft/fast-element/declarative.js";
import { observerMap } from "@microsoft/fast-element/extensions/observer-map.js";
import { enableHydration } from "@microsoft/fast-element/hydration.js";
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

enableHydration({
    hydrationComplete() {
        performance.mark("bench-end");
        signalDone();
    },
});
