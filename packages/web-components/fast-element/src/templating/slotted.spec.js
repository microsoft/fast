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
import { slotted, SlottedBehavior } from "./slotted";
import { AttachedBehaviorHTMLDirective } from "./html-directive";
import { observable } from "../observation/observable";
import { elements } from "./node-observation";
import { DOM } from "../dom";
describe("The slotted", () => {
    context("template function", () => {
        it("returns an AttachedBehaviorDirective", () => {
            const directive = slotted("test");
            expect(directive).to.be.instanceOf(AttachedBehaviorHTMLDirective);
        });
    });
    context("directive", () => {
        it("creates a SlottedBehavior", () => {
            const directive = slotted("test");
            const target = document.createElement("slot");
            const behavior = directive.createBehavior(target);
            expect(behavior).to.be.instanceOf(SlottedBehavior);
        });
    });
    context("behavior", () => {
        class Model {}
        __decorate([observable], Model.prototype, "nodes", void 0);
        function createAndAppendChildren(host, elementName = "div") {
            const children = new Array(10);
            for (let i = 0, ii = children.length; i < ii; ++i) {
                const child = document.createElement(i % 1 === 0 ? elementName : "div");
                children[i] = child;
                host.appendChild(child);
            }
            return children;
        }
        function createDOM(elementName = "div") {
            const host = document.createElement("div");
            const slot = document.createElement("slot");
            const shadowRoot = host.attachShadow({ mode: "open" });
            const children = createAndAppendChildren(host, elementName);
            shadowRoot.appendChild(slot);
            return { host, slot, children };
        }
        it("gathers nodes from a slot", () => {
            const { host, slot, children } = createDOM();
            const behavior = new SlottedBehavior(slot, { property: "nodes" });
            const model = new Model();
            behavior.bind(model);
            expect(model.nodes).members(children);
        });
        it("gathers nodes from a slot with a filter", () => {
            const { host, slot, children } = createDOM("foo-bar");
            const behavior = new SlottedBehavior(slot, {
                property: "nodes",
                filter: elements("foo-bar"),
            });
            const model = new Model();
            behavior.bind(model);
            expect(model.nodes).members(children.filter(elements("foo-bar")));
        });
        it("updates when slotted nodes change", () =>
            __awaiter(void 0, void 0, void 0, function* () {
                const { host, slot, children } = createDOM("foo-bar");
                const behavior = new SlottedBehavior(slot, { property: "nodes" });
                const model = new Model();
                behavior.bind(model);
                expect(model.nodes).members(children);
                const updatedChildren = children.concat(createAndAppendChildren(host));
                yield DOM.nextUpdate();
                expect(model.nodes).members(updatedChildren);
            }));
        it("updates when slotted nodes change with a filter", () =>
            __awaiter(void 0, void 0, void 0, function* () {
                const { host, slot, children } = createDOM("foo-bar");
                const behavior = new SlottedBehavior(slot, {
                    property: "nodes",
                    filter: elements("foo-bar"),
                });
                const model = new Model();
                behavior.bind(model);
                expect(model.nodes).members(children);
                const updatedChildren = children.concat(createAndAppendChildren(host));
                yield DOM.nextUpdate();
                expect(model.nodes).members(updatedChildren.filter(elements("foo-bar")));
            }));
        it("clears and unwatches when unbound", () =>
            __awaiter(void 0, void 0, void 0, function* () {
                const { host, slot, children } = createDOM("foo-bar");
                const behavior = new SlottedBehavior(slot, { property: "nodes" });
                const model = new Model();
                behavior.bind(model);
                expect(model.nodes).members(children);
                behavior.unbind();
                expect(model.nodes).members([]);
                host.appendChild(document.createElement("div"));
                yield DOM.nextUpdate();
                expect(model.nodes).members([]);
            }));
    });
});
