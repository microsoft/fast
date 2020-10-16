import { expect } from "chai";
import { DOM } from "../dom";
import { defaultExecutionContext, observable } from "../observation/observable";
import { html, ViewTemplate } from "../template";
import { HTMLView, SyntheticView } from "../view";
import { toHTML } from "../__test__/helpers";
import { BindingDirective } from "./binding";

describe("The binding directive", () => {
    class Model {
        constructor(value: any) {
            this.value = value;
        }

        @observable value: any = null;
        @observable private trigger = 0;
        @observable knownValue = "value";

        forceComputedUpdate() {
            this.trigger++;
        }

        get computedValue() {
            const trigger = this.trigger;
            return this.value;
        }
    }

    function contentBinding(propertyName: keyof Model = "value") {
        const directive = new BindingDirective(x => x[propertyName]);
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

        it("updates the text of a node when the expression changes", async () => {
            const { behavior, node } = contentBinding();
            const model = new Model("This is a test");

            behavior.bind(model, defaultExecutionContext);

            expect(node.textContent).to.equal(model.value);

            model.value = "This is another test, different from the first.";

            await DOM.nextUpdate();

            expect(node.textContent).to.equal(model.value);
        });
    });

    context("when binding template content", () => {
        it("initially inserts a view based on the template", () => {
            const { behavior, parentNode } = contentBinding();
            const template = html<Model>`
                This is a template. ${x => x.knownValue}
            `;
            const model = new Model(template);

            behavior.bind(model, defaultExecutionContext);

            expect(toHTML(parentNode)).to.equal(`This is a template. value`);
        });

        it("removes an inserted view when the value changes to plain text", async () => {
            const { behavior, parentNode } = contentBinding();
            const template = html`
                This is a template. ${x => x.knownValue}
            `;
            const model = new Model(template);

            behavior.bind(model, defaultExecutionContext);

            expect(toHTML(parentNode)).to.equal(`This is a template. value`);

            model.value = "This is a test.";

            await DOM.nextUpdate();

            expect(toHTML(parentNode)).to.equal(model.value);
        });

        it("removes an inserted view when the value changes to null", async () => {
            const { behavior, parentNode } = contentBinding();
            const template = html`
                This is a template. ${x => x.knownValue}
            `;
            const model = new Model(template);

            behavior.bind(model, defaultExecutionContext);

            expect(toHTML(parentNode)).to.equal(`This is a template. value`);

            model.value = null;

            await DOM.nextUpdate();

            expect(toHTML(parentNode)).to.equal("");
        });

        it("removes an inserted view when the value changes to undefined", async () => {
            const { behavior, parentNode } = contentBinding();
            const template = html`
                This is a template. ${x => x.knownValue}
            `;
            const model = new Model(template);

            behavior.bind(model, defaultExecutionContext);

            expect(toHTML(parentNode)).to.equal(`This is a template. value`);

            model.value = void 0;

            await DOM.nextUpdate();

            expect(toHTML(parentNode)).to.equal("");
        });

        it("updates an inserted view when the value changes to a new template", async () => {
            const { behavior, parentNode } = contentBinding();
            const template = html`
                This is a template. ${x => x.knownValue}
            `;
            const model = new Model(template);

            behavior.bind(model, defaultExecutionContext);

            expect(toHTML(parentNode)).to.equal(`This is a template. value`);

            const newTemplate = html<Model>`
                This is a new template ${x => x.knownValue}
            `;
            model.value = newTemplate;

            await DOM.nextUpdate();

            expect(toHTML(parentNode)).to.equal(`This is a new template value`);
        });

        it("reuses a previous view when the value changes back from a string", async () => {
            const { behavior, parentNode, node } = contentBinding();
            const template = html`
                This is a template. ${x => x.knownValue}
            `;
            const model = new Model(template);

            behavior.bind(model, defaultExecutionContext);

            const view = (node as any).$fastView as SyntheticView;
            const capturedTemplate = (node as any).$fastTemplate as ViewTemplate;

            expect(view).to.be.instanceOf(HTMLView);
            expect(capturedTemplate).to.equal(template);
            expect(toHTML(parentNode)).to.equal(`This is a template. value`);

            model.value = "This is a test string.";

            await DOM.nextUpdate();

            expect(toHTML(parentNode)).to.equal(model.value);

            model.value = template;

            await DOM.nextUpdate();

            const newView = (node as any).$fastView as SyntheticView;
            const newCapturedTemplate = (node as any).$fastTemplate as ViewTemplate;

            expect(newView).to.equal(view);
            expect(newCapturedTemplate).to.equal(capturedTemplate);
            expect(toHTML(parentNode)).to.equal(`This is a template. value`);
        });

        it("doesn't compose an already composed view", async () => {
            const { behavior, parentNode } = contentBinding("computedValue");
            const template = html`
                This is a template. ${x => x.knownValue}
            `;
            const model = new Model(template);

            behavior.bind(model, defaultExecutionContext);

            expect(toHTML(parentNode)).to.equal(`This is a template. value`);

            model.value = template;
            model.forceComputedUpdate();

            await DOM.nextUpdate();

            expect(toHTML(parentNode)).to.equal(`This is a template. value`);
        });
    });

    context("when unbinding template content", () => {
        it("unbinds a composed view", () => {
            const { behavior, node, parentNode } = contentBinding();
            const template = html`
                This is a template. ${x => x.knownValue}
            `;
            const model = new Model(template);

            behavior.bind(model, defaultExecutionContext);

            const newView = (node as any).$fastView as SyntheticView;
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

            const view = (node as any).$fastView as SyntheticView;
            expect(view.source).to.equal(model);
            expect(toHTML(parentNode)).to.equal(`This is a template. value`);

            behavior.unbind();

            expect(view.source).to.equal(null);

            behavior.bind(model, defaultExecutionContext);

            const newView = (node as any).$fastView as SyntheticView;
            expect(newView.source).to.equal(model);
            expect(toHTML(parentNode)).to.equal(`This is a template. value`);
        });
    });
});
