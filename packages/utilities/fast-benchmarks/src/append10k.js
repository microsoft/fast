/* eslint-disable no-undef */
import {
    destroy,
    getTestStartName,
    measureMemory,
    updateComplete,
} from "../utils/index.js";
(async () => {
    const test = "append";
    const container = document.getElementById("container");
    const el = document.createElement("x-app");
    console.log("el", el, container);
    const create = async () => {
        return container.appendChild(el);
    };
    const append = async () => {
        await create();
        const start = getTestStartName(test);
        const shadowRoot = el.shadowRoot;
        const button = shadowRoot.querySelector("button");
        performance.mark(start);
        // click on button to append Data
        for (let i = 0; i < 10; i++) {
            button.click();
        }
        await updateComplete();
        performance.measure(test, start);
        destroy(container);
    };
    await append();
    measureMemory();
})();
