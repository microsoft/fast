/* eslint-disable no-undef */
import { getTestStartName, measureMemory, updateComplete } from "../utils/index.js";
(async () => {
    const run = async () => {
        const start = getTestStartName(test);
        performance.mark(start);
        for (let i = 0; i < 1000; i++) {
            window.runFunction();
        }
        await updateComplete();
        performance.measure(test, start);
    };
    await run();
    measureMemory();
})();
