var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { customElement, FASTElement, html, observable, repeat, } from "@microsoft/fast-element";
import { data } from "../../../utils/index.js";
import { queryParams } from "../../../utils/query-params.js";
const { method } = queryParams;
console.log("method", method);
let XApp = class XApp extends FASTElement {
    constructor() {
        super(...arguments);
        this.items = data;
    }
    appendData() {
        // clear 10k data
        this.items = [];
    }
};
__decorate([
    observable
], XApp.prototype, "items", void 0);
XApp = __decorate([
    customElement({
        name: "x-app",
        template: html `
        <div>
            <button @click="${x => x.appendData()}">Append</button>
            <span>Total Items: ${x => x.items.length}</span>
            ${repeat(x => x.items, html `
                    <li>${x => x.label}</li>
                `)}
        </div>
    `,
    })
], XApp);
