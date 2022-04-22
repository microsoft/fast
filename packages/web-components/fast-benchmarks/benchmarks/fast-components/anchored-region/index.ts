import { customElement, FASTElement, html } from "@microsoft/fast-element";
import { fastAnchoredRegion, provideFASTDesignSystem } from "@microsoft/fast-components";

provideFASTDesignSystem().register(fastAnchoredRegion());

const anchorTemplate = html`
    <button id="anchor">
        Button
    </button>
    <fast-anchored-region
        anchor="anchor"
        vertical-positioning-mode="locktodefault"
        vertical-default-position="top"
    >
        This shows up right the button
    </fast-anchored-region>
`;

@customElement({
    name: "x-anchored-region",
    template: anchorTemplate,
    styles: "",
    shadowOptions: {
        delegatesFocus: true,
    },
})
class XAnchoredRegion extends FASTElement {}

const xAppTemplate = html<XApp>`
    <div id="container">
        <x-anchored-region></x-anchored-region>
    </div>
`;

@customElement({
    name: "x-app",
    template: xAppTemplate,
})
class XApp extends FASTElement {}

declare global {
    interface Window {
        usedJSHeapSize: any;
        gc: any;
    }
    interface Performance {
        memory: any;
    }
}

function measureMemory() {
    if (window && performance && performance.memory) {
        // Report results in MBs\
        window.usedJSHeapSize = performance.memory.usedJSHeapSize / 1e6;
    } else {
        window.usedJSHeapSize = 0;
    }
}

//support older browsesrs or if we're not using modules
(async () => {
    const container = document.createElement("div");
    document.body.appendChild(container);

    const create = () => {
        const el = document.createElement("x-app");
        return container.appendChild(el);
    };
    const destroy = () => {
        container.innerHTML = "";
    };
    const getTestStartName = (name: string) => `${name}-start`;
    const updateComplete = () => new Promise(r => requestAnimationFrame(r));

    const render = async () => {
        // can change to defaultt to (check file name) main dir file name
        const test = "anchored";
        const start = getTestStartName(test);
        performance.mark(start);
        create();
        await updateComplete();
        performance.measure(test, start);
        destroy();
    };
    await render();
    measureMemory();

    // Log
    performance
        .getEntriesByType("measure")
        .forEach(m => console.log(`${m.name}: ${m.duration.toFixed(3)}ms`));
})();
