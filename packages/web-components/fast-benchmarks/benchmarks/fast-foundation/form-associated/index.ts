import { customElement, FASTElement, html, repeat } from "@microsoft/fast-element";
import { FormAssociated, FoundationElement } from "@microsoft/fast-foundation";

const itemCount = 250;

const template = html<_XItem>`
    <slot></slot>
`;

@customElement({
    name: "x-item",
    template,
})
class _XItem extends FoundationElement {}
// eslint-disable-next-line @typescript-eslint/naming-convention
interface _XItem extends FormAssociated {}

/**
 * A form-associated base class for the {@link @microsoft/fast-foundation#(Button:class)} component.
 *
 * @internal
 */
export class FormAssociatedButton extends FormAssociated(_XItem) {
    proxy = document.createElement("input");
}

const xAppTemplate = html<XApp>`
    <div id="container">
        ${repeat(
            x => x.items,
            html`
                <x-item></x-item>
            `
        )}
    </div>
`;
@customElement({
    name: "x-app",
    template: xAppTemplate,
})
class XApp extends FASTElement {
    items: number[] = Array(itemCount).fill(0);
}

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
export default async () => {
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
        // can change to main dir file name
        const test = "form-associated";
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
};
