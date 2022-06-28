/* eslint-disable no-undef */
import {
    destroy,
    getTestStartName,
    measureMemory,
    updateComplete,
} from "../utils/index.js";
(async () => {
    const test = "clickTrigger10x";
    const container = document.getElementById("container");
    const el = document.createElement("x-app");
    const create = async () => {
        return container.appendChild(el);
    };
    const clickEvent = async () => {
        await create();
        const start = getTestStartName(test);
        const shadowRoot = el.shadowRoot;
        const button = shadowRoot.querySelector("button");
        performance.mark(start);
        // click on button to trigger event
        for (let i = 0; i < 1; i++) {
            button.click();
        }
        await updateComplete();
        performance.measure(test, start);
        destroy(container);
    };
    await clickEvent();
    measureMemory();
})();
