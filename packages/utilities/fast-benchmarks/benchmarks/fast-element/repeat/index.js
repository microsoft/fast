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
const templates = {
    repeat: html `
        ${repeat(x => x.items, html `
                <li>${x => x.label}</li>
            `)}
    `,
    repeatNoRecycle: html `
        ${(repeat(x => x.items, html `
                <li>${x => x.label}</li>
            `),
        { recycle: false })}
    `,
};
let XApp = class XApp extends FASTElement {
    constructor() {
        super(...arguments);
        this.items = data;
        this.method = method;
    }
    getTemplateByMethod() {
        return templates[this.method];
    }
};
__decorate([
    observable
], XApp.prototype, "items", void 0);
__decorate([
    observable
], XApp.prototype, "method", void 0);
XApp = __decorate([
    customElement({
        name: "x-app",
        template: html `
        <div>
            ${x => x.getTemplateByMethod()}
        </div>
    `,
    })
], XApp);
