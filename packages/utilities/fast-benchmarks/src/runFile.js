/* eslint-disable no-undef */
import { getTestStartName, measureMemory, updateComplete } from "../utils/index.js";
(async () => {
    // const container = document.getElementById("container");
    // const create = () => {
    //     const el = document.createElement("x-app");
    //     return container.appendChild(el);
    // };
    const run = async () => {
        const start = getTestStartName(test);
        performance.mark(start);
        for (let i = 0; i < 100; i++) {
            window.runFunction();
        }
        await updateComplete();
        performance.measure(test, start);
        // destroy(container);
    };
    await run();
    measureMemory();
})();
