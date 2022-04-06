import {
    attr,
    css,
    customElement,
    FASTElement,
    html,
    observable,
    repeat,
} from "@microsoft/fast-element";

// import { _random, adjectives, colours, nouns } from "./utils";

const itemCount = 250;
const updateCount = 6;
let id = 0;

declare global {
    interface Window {
        usedJSHeapSize: any;
        gc: any;
    }
    interface Performance {
        memory: any;
    }
}

export const measureMemory = () => {
    if ("gc" in window && "memory" in performance) {
        // Report results in MBs\
        window.gc();
        window.usedJSHeapSize = performance.memory.usedJSHeapSize / 1e6;
    } else {
        window.usedJSHeapSize = 0;
    }
};

export const _random = (max: number) => {
    return Math.round(Math.random() * 1000) % max;
};

export const adjectives = [
    "pretty",
    "large",
    "big",
    "small",
    "tall",
    "short",
    "long",
    "handsome",
    "plain",
    "quaint",
    "clean",
    "elegant",
    "easy",
    "angry",
    "crazy",
    "helpful",
    "mushy",
    "odd",
    "unsightly",
    "adorable",
    "important",
    "inexpensive",
    "cheap",
    "expensive",
    "fancy",
];
export const colours = [
    "red",
    "yellow",
    "blue",
    "green",
    "pink",
    "brown",
    "purple",
    "brown",
    "white",
    "black",
    "orange",
];
export const nouns = [
    "table",
    "chair",
    "house",
    "bbq",
    "desk",
    "car",
    "pony",
    "cookie",
    "sandwich",
    "burger",
    "pizza",
    "mouse",
    "keyboard",
];

export class RandomItem {
    @observable label: string;

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
const otherData = generateData(itemCount * 2).slice(itemCount);

const xItemTemplate = html<XItem>`
    <div @click="${x => x.onClick}" class="item">
        ${x => x.value}
    </div>
`;

const styles = css`
    .item {
        display: flex;
    }
`;
@customElement({
    name: "x-item",
    template: xItemTemplate,
    styles,
})
class XItem extends FASTElement {
    @attr value: string | undefined;

    onClick(e: MouseEvent) {
        console.log(e.type);
    }
}

const xAppTemplate = html`
    <div id="container">
        ${repeat(
            x => x.items,
            html`
                <x-item :value="${x => x.label}"></x-item>
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

//support older browsesrs or if we're not using modules
(async () => {
    const container = document.createElement("div");
    document.body.appendChild(container);
    let el: XApp;

    const create = () => {
        const el = document.createElement("x-app") as XApp;
        return container.appendChild(el) as XApp;
    };
    const destroy = () => {
        container.innerHTML = "";
    };
    const getTestStartName = (name: string) => `${name}-start`;
    const updateComplete = () => new Promise(r => requestAnimationFrame(r));

    create();
    const render = async () => {
        const test = "render";
        const start = getTestStartName(test);
        performance.mark(start);
        create();
        await updateComplete();
        performance.measure(test, start);
        destroy();
    };
    await render();
    // measureMemory();

    const update = async () => {
        const test = "update";
        el = create();
        const start = getTestStartName(test);
        performance.mark(start);
        for (let i = 0; i < updateCount; i++) {
            el.items = i % 2 ? otherData : data;
            await updateComplete();
        }
        performance.measure(test, start);
        destroy();
    };
    await update();
    // measureMemory();

    // Log
    performance
        .getEntriesByType("measure")
        .forEach(m => console.log(`${m.name}: ${m.duration.toFixed(3)}ms`));
})();
