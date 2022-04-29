import {
    attr,
    customElement,
    FASTElement,
    html,
    observable,
    repeat,
} from "@microsoft/fast-element";
import { FormAssociated, FoundationElement } from "@microsoft/fast-foundation";
import { _random, adjectives, colours, nouns } from "../../../utils/index.js";

const itemCount = 250;
let id = 0;

export class RandomItem {
    label: string;

    constructor(public readonly id: number) {
        this.label =
            adjectives[_random(adjectives.length)] +
            " " +
            colours[_random(colours.length)] +
            " " +
            nouns[_random(nouns.length)];
    }
}
function generateData(count: number) {
    const data = [];

    for (let i = 0; i < count; i++) {
        data.push(new RandomItem(++id));
    }

    return data;
}
const data: RandomItem[] = generateData(itemCount);

/* eslint-disable @typescript-eslint/naming-convention */
class _Button extends FASTElement {}
interface _Button extends FormAssociated {}
/* eslint-enable @typescript-eslint/naming-convention */

class FormAssociatedButton extends FormAssociated(_Button as any) {
    proxy = document.createElement("input");
}

class Button extends FormAssociatedButton {}
@customElement({
    name: "x-button",
    template: html`
        <button>${x => x.value}</button>
    `,
    styles: "",
    shadowOptions: {
        delegatesFocus: true,
    },
})
export class FluentButton extends Button {
    @attr value: string = "";
}

const xAppTemplate = html<XApp>`
    <div id="container">
        ${repeat(
            x => x.items,
            html`
                <x-button :value=${x => x.label}>${x => x.label}</x-button>
            `
        )}
    </div>
`;
@customElement({
    name: "x-app",
    template: xAppTemplate,
})
class XApp extends FASTElement {
    @observable items: RandomItem[] = data;
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
})();
