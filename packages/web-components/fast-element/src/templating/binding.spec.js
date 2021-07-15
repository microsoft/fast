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
import { HTMLBindingDirective } from "./binding";
import { observable, defaultExecutionContext } from "../observation/observable";
import { DOM } from "../dom";
import { html } from "./template";
import { toHTML } from "../__test__/helpers";
import { HTMLView } from "./view";
describe("The HTML binding directive", () => {
    class Model {
        constructor(value) {
            this.value = null;
            this.trigger = 0;
            this.knownValue = "value";
            this.value = value;
        }
        forceComputedUpdate() {
            this.trigger++;
        }
        get computedValue() {
            const trigger = this.trigger;
            return this.value;
        }
    }
    __decorate([observable], Model.prototype, "value", void 0);
    __decorate([observable], Model.prototype, "trigger", void 0);
    __decorate([observable], Model.prototype, "knownValue", void 0);
    function contentBinding(propertyName = "value") {
        const directive = new HTMLBindingDirective(x => x[propertyName]);
        directive.targetAtContent();
        const node = document.createTextNode(" ");
        const behavior = directive.createBehavior(node);
        const parentNode = document.createElement("div");
        parentNode.appendChild(node);
        return { directive, behavior, node, parentNode };
    }
    context("when binding text content", () => {
        it("initially sets the text of a node", () => {
            const { behavior, node } = contentBinding();
            const model = new Model("This is a test");
            behavior.bind(model, defaultExecutionContext);
            expect(node.textContent).to.equal(model.value);
        });
        it("updates the text of a node when the expression changes", () =>
            __awaiter(void 0, void 0, void 0, function* () {
                const { behavior, node } = contentBinding();
                const model = new Model("This is a test");
                behavior.bind(model, defaultExecutionContext);
                expect(node.textContent).to.equal(model.value);
                model.value = "This is another test, different from the first.";
                yield DOM.nextUpdate();
                expect(node.textContent).to.equal(model.value);
            }));
    });
    context("when binding template content", () => {
        it("initially inserts a view based on the template", () => {
            const { behavior, parentNode } = contentBinding();
            const template = html`
                This is a template. ${x => x.knownValue}
            `;
            const model = new Model(template);
            behavior.bind(model, defaultExecutionContext);
            expect(toHTML(parentNode)).to.equal(`This is a template. value`);
        });
        it("removes an inserted view when the value changes to plain text", () =>
            __awaiter(void 0, void 0, void 0, function* () {
                const { behavior, parentNode } = contentBinding();
                const template = html`
                    This is a template. ${x => x.knownValue}
                `;
                const model = new Model(template);
                behavior.bind(model, defaultExecutionContext);
                expect(toHTML(parentNode)).to.equal(`This is a template. value`);
                model.value = "This is a test.";
                yield DOM.nextUpdate();
                expect(toHTML(parentNode)).to.equal(model.value);
            }));
        it("removes an inserted view when the value changes to null", () =>
            __awaiter(void 0, void 0, void 0, function* () {
                const { behavior, parentNode } = contentBinding();
                const template = html`
                    This is a template. ${x => x.knownValue}
                `;
                const model = new Model(template);
                behavior.bind(model, defaultExecutionContext);
                expect(toHTML(parentNode)).to.equal(`This is a template. value`);
                model.value = null;
                yield DOM.nextUpdate();
                expect(toHTML(parentNode)).to.equal("");
            }));
        it("removes an inserted view when the value changes to undefined", () =>
            __awaiter(void 0, void 0, void 0, function* () {
                const { behavior, parentNode } = contentBinding();
                const template = html`
                    This is a template. ${x => x.knownValue}
                `;
                const model = new Model(template);
                behavior.bind(model, defaultExecutionContext);
                expect(toHTML(parentNode)).to.equal(`This is a template. value`);
                model.value = void 0;
                yield DOM.nextUpdate();
                expect(toHTML(parentNode)).to.equal("");
            }));
        it("updates an inserted view when the value changes to a new template", () =>
            __awaiter(void 0, void 0, void 0, function* () {
                const { behavior, parentNode } = contentBinding();
                const template = html`
                    This is a template. ${x => x.knownValue}
                `;
                const model = new Model(template);
                behavior.bind(model, defaultExecutionContext);
                expect(toHTML(parentNode)).to.equal(`This is a template. value`);
                const newTemplate = html`
                    This is a new template ${x => x.knownValue}
                `;
                model.value = newTemplate;
                yield DOM.nextUpdate();
                expect(toHTML(parentNode)).to.equal(`This is a new template value`);
            }));
        it("reuses a previous view when the value changes back from a string", () =>
            __awaiter(void 0, void 0, void 0, function* () {
                const { behavior, parentNode, node } = contentBinding();
                const template = html`
                    This is a template. ${x => x.knownValue}
                `;
                const model = new Model(template);
                behavior.bind(model, defaultExecutionContext);
                const view = node.$fastView;
                const capturedTemplate = node.$fastTemplate;
                expect(view).to.be.instanceOf(HTMLView);
                expect(capturedTemplate).to.equal(template);
                expect(toHTML(parentNode)).to.equal(`This is a template. value`);
                model.value = "This is a test string.";
                yield DOM.nextUpdate();
                expect(toHTML(parentNode)).to.equal(model.value);
                model.value = template;
                yield DOM.nextUpdate();
                const newView = node.$fastView;
                const newCapturedTemplate = node.$fastTemplate;
                expect(newView).to.equal(view);
                expect(newCapturedTemplate).to.equal(capturedTemplate);
                expect(toHTML(parentNode)).to.equal(`This is a template. value`);
            }));
        it("doesn't compose an already composed view", () =>
            __awaiter(void 0, void 0, void 0, function* () {
                const { behavior, parentNode } = contentBinding("computedValue");
                const template = html`
                    This is a template. ${x => x.knownValue}
                `;
                const model = new Model(template);
                behavior.bind(model, defaultExecutionContext);
                expect(toHTML(parentNode)).to.equal(`This is a template. value`);
                model.value = template;
                model.forceComputedUpdate();
                yield DOM.nextUpdate();
                expect(toHTML(parentNode)).to.equal(`This is a template. value`);
            }));
    });
    context("when unbinding template content", () => {
        it("unbinds a composed view", () => {
            const { behavior, node, parentNode } = contentBinding();
            const template = html`
                This is a template. ${x => x.knownValue}
            `;
            const model = new Model(template);
            behavior.bind(model, defaultExecutionContext);
            const newView = node.$fastView;
            expect(newView.source).to.equal(model);
            expect(toHTML(parentNode)).to.equal(`This is a template. value`);
            behavior.unbind();
            expect(newView.source).to.equal(null);
        });
        it("rebinds a previously unbound composed view", () => {
            const { behavior, node, parentNode } = contentBinding();
            const template = html`
                This is a template. ${x => x.knownValue}
            `;
            const model = new Model(template);
            behavior.bind(model, defaultExecutionContext);
            const view = node.$fastView;
            expect(view.source).to.equal(model);
            expect(toHTML(parentNode)).to.equal(`This is a template. value`);
            behavior.unbind();
            expect(view.source).to.equal(null);
            behavior.bind(model, defaultExecutionContext);
            const newView = node.$fastView;
            expect(newView.source).to.equal(model);
            expect(toHTML(parentNode)).to.equal(`This is a template. value`);
        });
    });
});
