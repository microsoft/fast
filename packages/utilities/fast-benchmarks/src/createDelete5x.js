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
    const createDelete = async () => {
        const start = getTestStartName(test);
        performance.mark(start);
        for (let i = 0; i < 5; i++) {
            create();
            destroy(container);
        }
        await updateComplete();
        performance.measure(test, start);
    };
    await createDelete();
    measureMemory();
})();
