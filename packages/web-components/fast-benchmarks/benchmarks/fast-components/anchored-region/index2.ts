import { css, customElement, FASTElement, html } from "@microsoft/fast-element";
import { computePosition } from "@floating-ui/dom";

const computeTemplate = html`
    <button id="button">button</button>
    <div id="tooltip">My tooltip</div>
`;

const computeCss = css`
    #tooltip {
        position: absolute;
        background: #222;
        color: white;
        font-weight: bold;
        padding: 5px;
        border-radius: 4px;
        font-size: 90%;
        pointer-events: none;
    }
`;
@customElement({
    name: "compute-anchored-region",
    template: computeTemplate,
    styles: computeCss,
    shadowOptions: {
        delegatesFocus: true,
    },
})
class ComputeAnchor extends FASTElement {
    public ComputeButton: HTMLButtonElement | undefined;
    public ComputeAnchor: HTMLElement | undefined;

    connectedCallback(): void {
        super.connectedCallback();
        this.ComputeButton = this.shadowRoot?.children[0] as HTMLButtonElement;
        this.ComputeAnchor = this.shadowRoot?.children[1] as HTMLElement;
        computePosition(this.ComputeButton, this.ComputeAnchor, {
            placement: "right",
        }).then(({ x, y }) => {
            Object.assign(this.ComputeAnchor?.style, {
                left: `${x}px`,
                top: `${y}px`,
            });
        });
    }
}

const xAppTemplate = html<XApp>`
    <div id="container">
        <compute-anchored-region></compute-anchored-region>
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
