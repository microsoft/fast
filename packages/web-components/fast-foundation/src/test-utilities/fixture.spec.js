var __decorate =
    (this && this.__decorate) ||
    function (decorators, target, key, desc) {
        var c = arguments.length,
            r =
                c < 3
                    ? target
                    : desc === null
                    ? (desc = Object.getOwnPropertyDescriptor(target, key))
                    : desc,
            d;
        if (typeof Reflect === "object" && typeof Reflect.decorate === "function")
            r = Reflect.decorate(decorators, target, key, desc);
        else
            for (var i = decorators.length - 1; i >= 0; i--)
                if ((d = decorators[i]))
                    r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
        return c > 3 && r && Object.defineProperty(target, key, r), r;
    };
var __awaiter =
    (this && this.__awaiter) ||
    function (thisArg, _arguments, P, generator) {
        function adopt(value) {
            return value instanceof P
                ? value
                : new P(function (resolve) {
                      resolve(value);
                  });
        }
        return new (P || (P = Promise))(function (resolve, reject) {
            function fulfilled(value) {
                try {
                    step(generator.next(value));
                } catch (e) {
                    reject(e);
                }
            }
            function rejected(value) {
                try {
                    step(generator["throw"](value));
                } catch (e) {
                    reject(e);
                }
            }
            function step(result) {
                result.done
                    ? resolve(result.value)
                    : adopt(result.value).then(fulfilled, rejected);
            }
            step((generator = generator.apply(thisArg, _arguments || [])).next());
        });
    };
import { expect } from "chai";
import {
    attr,
    customElement,
    FASTElement,
    html,
    DOM,
    observable,
} from "@microsoft/fast-element";
import { uniqueElementName, fixture } from "./fixture";
describe("The fixture helper", () => {
    const name = uniqueElementName();
    const template = html`
        ${x => x.value}
        <slot></slot>
    `;
    let MyElement = class MyElement extends FASTElement {
        constructor() {
            super(...arguments);
            this.value = "value";
        }
    };
    __decorate([attr], MyElement.prototype, "value", void 0);
    MyElement = __decorate(
        [
            customElement({
                name,
                template,
            }),
        ],
        MyElement
    );
    class MyModel {
        constructor() {
            this.value = "different value";
        }
    }
    __decorate([observable], MyModel.prototype, "value", void 0);
    it("can create a fixture for an element by name", () =>
        __awaiter(void 0, void 0, void 0, function* () {
            const { element } = yield fixture(name);
            expect(element).to.be.instanceOf(MyElement);
        }));
    it("can create a fixture for an element by template", () =>
        __awaiter(void 0, void 0, void 0, function* () {
            const { element } = yield fixture(html`
      <${name}>
        Some content here.
      </${name}>
    `);
            expect(element).to.be.instanceOf(MyElement);
            expect(element.innerText.trim()).to.equal("Some content here.");
        }));
    it("can connect an element", () =>
        __awaiter(void 0, void 0, void 0, function* () {
            const { element, connect } = yield fixture(name);
            expect(element.isConnected).to.equal(false);
            yield connect();
            expect(element.isConnected).to.equal(true);
            document.body.removeChild(element.parentElement);
        }));
    it("can disconnect an element", () =>
        __awaiter(void 0, void 0, void 0, function* () {
            const { element, connect, disconnect } = yield fixture(name);
            expect(element.isConnected).to.equal(false);
            yield connect();
            expect(element.isConnected).to.equal(true);
            yield disconnect();
            expect(element.isConnected).to.equal(false);
        }));
    it("can bind an element to data", () =>
        __awaiter(void 0, void 0, void 0, function* () {
            const source = new MyModel();
            const { element, disconnect } = yield fixture(
                html`
      <${name} value=${x => x.value}></${name}>
    `,
                { source }
            );
            expect(element.value).to.equal(source.value);
            source.value = "something else";
            yield DOM.nextUpdate();
            expect(element.value).to.equal(source.value);
            yield disconnect();
        }));
});
