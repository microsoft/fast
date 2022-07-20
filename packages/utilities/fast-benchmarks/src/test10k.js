/* eslint-disable no-undef */
import {
    destroy,
    getTestStartName,
    measureMemory,
    updateComplete,
} from "../utils/index.js";
(async () => {
    const container = document.getElementById("container");
    const render = async () => {
        const start = getTestStartName(test);
        performance.mark(start);
        for (let i = 0; i < 10000; i++) {
            window.test();
        }
        await updateComplete();
        performance.measure(test, start);
        destroy(container);
    };
    await render();
    measureMemory();
})();
