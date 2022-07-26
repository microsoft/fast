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
    const update = async () => {
        let el = create();

        const start = getTestStartName(test);
        performance.mark(start);
        for (let i = 0; i < el.items.length; i += 10) {
            el.items[i].label += "!!!";
        }
        await updateComplete();
        performance.measure(test, start);
        destroy(container);
    };
    await update();
    measureMemory();
})();
