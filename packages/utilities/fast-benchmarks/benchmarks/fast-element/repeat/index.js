var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { customElement, FASTElement, html, observable, repeat, } from "@microsoft/fast-element";
import { generateData, generateNestedData, } from "../../../utils/index.js";
import { queryParams } from "../../../utils/query-params.js";
const { template, method, itemCount: count = 10, loopCount: count2 = 1, deleteCount: count3 = 1, addCount: count4 = 1, startIndex: count5 = 0, } = queryParams;
const itemCount = parseInt(count);
const loopCount = parseInt(count2);
const deleteCount = parseInt(count3);
const addCount = parseInt(count4);
const startIndex = parseInt(count5);
const templates = {
    basic: html `
        ${repeat(x => x.items, html `
                <li>${x => x.label}</li>
            `)}
    `,
    basicNoRecycle: html `
        ${repeat(x => x.items, html `
                <li>${x => x.label}</li>
            `, { positioning: true, recycle: false })}
    `,
    nested: html `
        ${repeat(x => x.items, html `
                <li>
                    ${x => html `
                            <b>ID: ${x.id}</b>
                            <li>one: ${x.randomItem1.label}</li>
                            <li>two: ${x.randomItem2.label}</li>
                            <li>three: ${x.randomItem3.label}</li>
                            <ul>
                                ${repeat(x => x.randomItemGroup1, html `
                                        <li>${x => x.label}</li>
                                    `)}
                            </ul>
                            <ul>
                                ${repeat(x => x.randomItemGroup2, html `
                                        <li>${x => x.label}</li>
                                    `)}
                            </ul>
                            <ol>
                                ${repeat(x => x.nestedGroup.randomItemGroup1, html `
                                        <li>${x => x.label}</li>
                                    `)}
                            </ol>
                        `}
                </li>
            `)}
    `,
    nestedNoRecycle: html `
        ${repeat(x => x.items, html `
                <li>
                    ${x => html `
                            <b>ID: ${x.id}</b>
                            <li>one: ${x.randomItem1.label}</li>
                            <li>two: ${x.randomItem2.label}</li>
                            <li>three: ${x.randomItem3.label}</li>
                            <ul>
                                ${repeat(x => x.randomItemGroup1, html `
                                        <li>${x => x.label}</li>
                                    `)}
                            </ul>
                            <ul>
                                ${repeat(x => x.randomItemGroup2, html `
                                        <li>${x => x.label}</li>
                                    `)}
                            </ul>
                            <ol>
                                ${repeat(x => x.nestedGroup.randomItemGroup1, html `
                                        <li>${x => x.label}</li>
                                    `)}
                            </ol>
                        `}
                </li>
            `, { positioning: true, recycle: false })}
    `,
};
let XApp = class XApp extends FASTElement {
    constructor() {
        super();
        this.items = [];
        this.template = template;
        this.isNested = false;
        this.isNested = this.template.toLowerCase().includes("nested");
        this.items = this.isNested
            ? generateNestedData(itemCount)
            : generateData(itemCount);
    }
    getTemplateType() {
        return templates[this.template];
    }
    getClickEvent() {
        switch (method) {
            case "splice":
                this.splice();
                break;
            case "reverse":
                this.reverse();
                break;
            case "push":
                this.push();
                break;
            case "unshift":
                this.unshift();
                break;
            case "shift":
                this.shift();
                break;
            case "sort":
                this.sort();
                break;
            case "filter":
                this.filter();
                break;
            case "combo":
                this.combo();
                break;
            default:
                this.push();
                break;
        }
    }
    splice() {
        const otherData = generateData(addCount);
        for (let i = startIndex; i < loopCount; i++) {
            this.items.splice(i, deleteCount, ...otherData);
        }
    }
    reverse() {
        for (let i = startIndex; i <= loopCount; i++) {
            this.items.reverse();
        }
    }
    push() {
        const otherData = generateData(addCount);
        for (let i = startIndex; i < loopCount; i++) {
            this.items.push(...otherData);
        }
    }
    unshift() {
        const otherData = generateData(addCount);
        for (let i = startIndex; i < loopCount; i++) {
            this.items.unshift(...otherData);
        }
    }
    shift() {
        for (let i = startIndex; i <= loopCount; i++) {
            this.items.shift();
        }
    }
    sort() {
        for (let i = startIndex; i < loopCount; i++) {
            this.items.sort();
        }
    }
    filter() {
        for (let i = startIndex; i < loopCount - 1; i++) {
            this.items = this.items.filter(item => item !== this.items[0]);
        }
    }
    combo() {
        for (let i = startIndex; i < loopCount; i++) {
            this.push();
            this.reverse();
            this.splice();
            this.items = [];
        }
    }
};
__decorate([
    observable
], XApp.prototype, "items", void 0);
__decorate([
    observable
], XApp.prototype, "template", void 0);
XApp = __decorate([
    customElement({
        name: "x-app",
        template: html `
        <div>
            <button @click="${x => x.getClickEvent()}">Click Me</button>
            ${x => x.getTemplateType()}
        </div>
    `,
    })
], XApp);
