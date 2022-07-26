/* eslint-disable no-undef */
import {
    destroy,
    getTestStartName,
    measureMemory,
    updateComplete,
} from "../utils/index.js";
(async () => {
    const container = document.getElementById("container");
    const create = () => {
        const el = document.createElement("x-app");
        return container.appendChild(el);
    };
    const render = async () => {
        const start = getTestStartName(test);
        performance.mark(start);
        create();
        await updateComplete();
        performance.measure(test, start);
        destroy(container);
    };
    await render();
    measureMemory();
})();
