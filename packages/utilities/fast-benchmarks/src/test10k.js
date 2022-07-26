/* eslint-disable no-undef */
import { destroy, getTestStartName, measureMemory } from "../utils/index.js";

(async () => {
    const start = getTestStartName(test);
    performance.mark(start);
    window.test();
    performance.measure(test, start);
    destroy(container);
    measureMemory();
})();
