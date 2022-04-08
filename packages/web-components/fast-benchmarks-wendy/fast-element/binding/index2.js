var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { attr, css, customElement, FASTElement, html, observable, repeat, } from "@microsoft/fast-element";
import { _random, adjectives, colours, nouns } from "../../utils/constants.js";
const itemCount = 250;
const updateCount = 6;
let id = 0;
export const measureMemory = () => {
    if ("gc" in window && "memory" in performance) {
        // Report results in MBs\
        window.gc();
        window.usedJSHeapSize = performance.memory.usedJSHeapSize / 1e6;
    }
    else {
        window.usedJSHeapSize = 0;
    }
};
export class RandomItem {
    constructor(id) {
        this.id = id;
        this.label =
            adjectives[_random(adjectives.length)] +
                " " +
                colours[_random(colours.length)] +
                " " +
                nouns[_random(nouns.length)];
    }
}
__decorate([
    observable
], RandomItem.prototype, "label", void 0);
function generateData(count) {
    const data = [];
    for (let i = 0; i < count; i++) {
        data.push(new RandomItem(++id));
    }
    return data;
}
const data = generateData(itemCount);
const otherData = generateData(itemCount * 2).slice(itemCount);
const xItemTemplate = html `
    <div @click="${x => x.onClick}" class="item">
        ${x => x.value}
    </div>
`;
const styles = css `
    .item {
        display: flex;
    }
`;
let XItem = class XItem extends FASTElement {
    onClick(e) {
        console.log(e.type);
    }
};
__decorate([
    attr
], XItem.prototype, "value", void 0);
XItem = __decorate([
    customElement({
        name: "x-item",
        template: xItemTemplate,
        styles,
    })
], XItem);
const xAppTemplate = html `
    <div id="test-container">
        ${repeat(x => x.items, html `
                <x-item :value="${x => x.label}"></x-item>
            `)}
    </div>
`;
let XApp = class XApp extends FASTElement {
    constructor() {
        super(...arguments);
        this.items = data;
    }
};
__decorate([
    observable
], XApp.prototype, "items", void 0);
XApp = __decorate([
    customElement({
        name: "x-app",
        template: xAppTemplate,
    })
], XApp);
//support older browsesrs or if we're not using modules
(async () => {
    const container = document.createElement("div");
    document.body.appendChild(container);
    let el;
    const create = () => {
        const el = document.createElement("x-app");
        return container.appendChild(el);
    };
    const destroy = () => {
        container.innerHTML = "";
    };
    const getTestStartName = (name) => `${name}-start`;
    const updateComplete = () => new Promise(r => requestAnimationFrame(r));
    create();
    const render = async () => {
        const test = "binding";
        const start = getTestStartName(test);
        performance.mark(start);
        create();
        await updateComplete();
        performance.measure(test, start);
        destroy();
    };
    await render();
    // measureMemory();
    // const update = async () => {
    //     const test = "update";
    //     el = create();
    //     const start = getTestStartName(test);
    //     performance.mark(start);
    //     for (let i = 0; i < updateCount; i++) {
    //         el.items = i % 2 ? otherData : data;
    //         await updateComplete();
    //     }
    //     performance.measure(test, start);
    //     destroy();
    // };
    // await update();
    // measureMemory();
    // Log
    performance
        .getEntriesByType("measure")
        .forEach(m => console.log(`${m.name}: ${m.duration.toFixed(3)}ms`));
})();
