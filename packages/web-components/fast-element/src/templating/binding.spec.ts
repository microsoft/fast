import { expect } from "chai";
import { bind, BindingConfig, BindingMode, HTMLBindingDirective, onChange, oneTime, signal, SignalBinding } from "./binding";
import { ExecutionContext, observable } from "../observation/observable";
import { html, ViewTemplate } from "./template";
import { toHTML } from "../__test__/helpers";
import { SyntheticView, HTMLView } from "./view";
import { Updates } from "../observation/update-queue";
import { Aspect, AspectType } from "./html-directive";

describe.only("The HTML binding directive", () => {
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
        const directive = bind(x => x[propertyName]) as HTMLBindingDirective;
        directive.nodeId = 'r';

        const node = document.createTextNode(" ");
        const targets = { r: node };

        const behavior = directive.createBehavior(targets);
        const parentNode = document.createElement("div");

        parentNode.appendChild(node);

        return { directive, behavior, node, parentNode, targets };
    }

    function bindingWithConfig(config: BindingConfig, sourceAspect?: string) {
        const directive = bind<Model>(x => x.value, config) as HTMLBindingDirective;
        directive.nodeId = 'r';

        if (sourceAspect) {
            Aspect.assign(directive, sourceAspect);
        }

        const node = document.createElement("div");
        const targets = { r: node };

        const behavior = directive.createBehavior(targets);
        const parentNode = document.createElement("div");

        parentNode.appendChild(node);

        return { directive, behavior, node, parentNode, targets };
    }

    context("when binding text content", () => {
        it("initially sets the text of a node", () => {
            const { behavior, node, targets } = contentBinding();
            const model = new Model("This is a test");

            behavior.bind(model, ExecutionContext.default, targets);

            expect(node.textContent).to.equal(model.value);
        });

        it("updates the text of a node when the expression changes", async () => {
            const { behavior, node, targets } = contentBinding();
            const model = new Model("This is a test");

            behavior.bind(model, ExecutionContext.default, targets);

            expect(node.textContent).to.equal(model.value);

            model.value = "This is another test, different from the first.";

            await Updates.next();

            expect(node.textContent).to.equal(model.value);
        });
    });

    context("when binding template content", () => {
        it("initially inserts a view based on the template", () => {
            const { behavior, parentNode, targets } = contentBinding();
            const template = html<Model>`This is a template. ${x => x.knownValue}`;
            const model = new Model(template);

            behavior.bind(model, ExecutionContext.default, targets);

            expect(toHTML(parentNode)).to.equal(`This is a template. value`);
        });

        it("removes an inserted view when the value changes to plain text", async () => {
            const { behavior, parentNode, targets } = contentBinding();
            const template = html`This is a template. ${x => x.knownValue}`;
            const model = new Model(template);

            behavior.bind(model, ExecutionContext.default, targets);

            expect(toHTML(parentNode)).to.equal(`This is a template. value`);

            model.value = "This is a test.";

            await Updates.next();

            expect(toHTML(parentNode)).to.equal(model.value);
        });

        it("removes an inserted view when the value changes to null", async () => {
            const { behavior, parentNode, targets } = contentBinding();
            const template = html`This is a template. ${x => x.knownValue}`;
            const model = new Model(template);

            behavior.bind(model, ExecutionContext.default, targets);

            expect(toHTML(parentNode)).to.equal(`This is a template. value`);

            model.value = null;

            await Updates.next();

            expect(toHTML(parentNode)).to.equal("");
        });

        it("removes an inserted view when the value changes to undefined", async () => {
            const { behavior, parentNode, targets } = contentBinding();
            const template = html`This is a template. ${x => x.knownValue}`;
            const model = new Model(template);

            behavior.bind(model, ExecutionContext.default, targets);

            expect(toHTML(parentNode)).to.equal(`This is a template. value`);

            model.value = void 0;

            await Updates.next();

            expect(toHTML(parentNode)).to.equal("");
        });

        it("updates an inserted view when the value changes to a new template", async () => {
            const { behavior, parentNode, targets } = contentBinding();
            const template = html`This is a template. ${x => x.knownValue}`;
            const model = new Model(template);

            behavior.bind(model, ExecutionContext.default, targets);

            expect(toHTML(parentNode)).to.equal(`This is a template. value`);

            const newTemplate = html<Model>`This is a new template ${x => x.knownValue}`;
            model.value = newTemplate;

            await Updates.next();

            expect(toHTML(parentNode)).to.equal(`This is a new template value`);
        });

        it("reuses a previous view when the value changes back from a string", async () => {
            const { behavior, parentNode, node, targets } = contentBinding();
            const template = html`This is a template. ${x => x.knownValue}`;
            const model = new Model(template);

            behavior.bind(model, ExecutionContext.default, targets);

            const view = (node as any).$fastView as SyntheticView;
            const capturedTemplate = (node as any).$fastTemplate as ViewTemplate;

            expect(view).to.be.instanceOf(HTMLView);
            expect(capturedTemplate).to.equal(template);
            expect(toHTML(parentNode)).to.equal(`This is a template. value`);

            model.value = "This is a test string.";

            await Updates.next();

            expect(toHTML(parentNode)).to.equal(model.value);

            model.value = template;

            await Updates.next();

            const newView = (node as any).$fastView as SyntheticView;
            const newCapturedTemplate = (node as any).$fastTemplate as ViewTemplate;

            expect(newView).to.equal(view);
            expect(newCapturedTemplate).to.equal(capturedTemplate);
            expect(toHTML(parentNode)).to.equal(`This is a template. value`);
        });

        it("doesn't compose an already composed view", async () => {
            const { behavior, parentNode, targets } = contentBinding("computedValue");
            const template = html`This is a template. ${x => x.knownValue}`;
            const model = new Model(template);

            behavior.bind(model, ExecutionContext.default, targets);

            expect(toHTML(parentNode)).to.equal(`This is a template. value`);

            model.value = template;
            model.forceComputedUpdate();

            await Updates.next();

            expect(toHTML(parentNode)).to.equal(`This is a template. value`);
        });

        it("allows interpolated HTML tags in templates", async () => {
            const { behavior, parentNode, targets } = contentBinding();
            const template = html`${x => html`<${x.knownValue}>Hi there!</${x.knownValue}>`}`;
            const model = new Model(template);
            model.knownValue = "button"

            behavior.bind(model, ExecutionContext.default, targets);

            expect(toHTML(parentNode)).to.equal(`<button>Hi there!</button>`);

            model.knownValue = "a"

            await Updates.next()

            expect(toHTML(parentNode)).to.equal(`<a>Hi there!</a>`);
        })
    })

    context("when unbinding template content", () => {
        it("unbinds a composed view", () => {
            const { behavior, node, parentNode, targets } = contentBinding();
            const template = html`This is a template. ${x => x.knownValue}`;
            const model = new Model(template);

            behavior.bind(model, ExecutionContext.default, targets);

            const newView = (node as any).$fastView as SyntheticView;
            expect(newView.source).to.equal(model);
            expect(toHTML(parentNode)).to.equal(`This is a template. value`);

            behavior.unbind(model, ExecutionContext.default, targets);

            expect(newView.source).to.equal(null);
        });

        it("rebinds a previously unbound composed view", () => {
            const { behavior, node, parentNode, targets } = contentBinding();
            const template = html`This is a template. ${x => x.knownValue}`;
            const model = new Model(template);

            behavior.bind(model, ExecutionContext.default, targets);

            const view = (node as any).$fastView as SyntheticView;
            expect(view.source).to.equal(model);
            expect(toHTML(parentNode)).to.equal(`This is a template. value`);

            behavior.unbind(model, ExecutionContext.default, targets);

            expect(view.source).to.equal(null);

            behavior.bind(model, ExecutionContext.default, targets);

            const newView = (node as any).$fastView as SyntheticView;
            expect(newView.source).to.equal(model);
            expect(toHTML(parentNode)).to.equal(`This is a template. value`);
        });
    });

    const aspectScenarios = [
        {
            name: "content",
            sourceAspect: "",
            originalValue: "This is a test",
            newValue: "This is another test",
            getValue(node: HTMLElement) {
                return node.textContent;
            }
        },
        {
            name: "attribute",
            sourceAspect: "test-attribute",
            originalValue: "This is a test",
            newValue: "This is another test",
            getValue(node: HTMLElement) {
                return node.getAttribute("test-attribute");
            }
        },
        {
            name: "boolean attribute",
            sourceAspect: "?test-boolean-attribute",
            originalValue: true,
            newValue: false,
            getValue(node: HTMLElement) {
                return node.hasAttribute("test-boolean-attribute");
            }
        },
        {
            name: "property",
            sourceAspect: ":testProperty",
            originalValue: "This is a test",
            newValue: "This is another test",
            getValue(node: HTMLElement) {
                return (node as any).testProperty;
            }
        },
    ];

    context("when binding on-change", () => {
        for (const aspectScenario of aspectScenarios) {
            it(`sets the initial value of a ${aspectScenario.name} binding`, () => {
                const { behavior, node, targets } = bindingWithConfig(onChange, aspectScenario.sourceAspect);
                const model = new Model(aspectScenario.originalValue);

                behavior.bind(model, ExecutionContext.default, targets);

                expect(aspectScenario.getValue(node)).to.equal(model.value);
            });

            it(`updates the ${aspectScenario.name} when the model changes`, async () => {
                const { behavior, node, targets } = bindingWithConfig(onChange, aspectScenario.sourceAspect);
                const model = new Model(aspectScenario.originalValue);

                behavior.bind(model, ExecutionContext.default, targets);

                expect(aspectScenario.getValue(node)).to.equal(model.value);

                model.value = aspectScenario.newValue;

                await Updates.next();

                expect(aspectScenario.getValue(node)).to.equal(model.value);
            });

            it(`doesn't update the ${aspectScenario.name} after unbind`, async () => {
                const { behavior, node, targets } = bindingWithConfig(onChange, aspectScenario.sourceAspect);
                const model = new Model(aspectScenario.originalValue);

                behavior.bind(model, ExecutionContext.default, targets);

                expect(aspectScenario.getValue(node)).to.equal(model.value);

                behavior.unbind(model, ExecutionContext.default, targets) ;
                model.value = aspectScenario.newValue;

                await Updates.next();

                expect(aspectScenario.getValue(node)).to.equal(aspectScenario.originalValue);
            });
        }
    });

    context("when binding one-time", () => {
        for (const aspectScenario of aspectScenarios) {
            it(`sets the initial value of a ${aspectScenario.name} binding`, () => {
                const { behavior, node, targets } = bindingWithConfig(oneTime, aspectScenario.sourceAspect);
                const model = new Model(aspectScenario.originalValue);

                behavior.bind(model, ExecutionContext.default, targets);

                expect(aspectScenario.getValue(node)).to.equal(model.value);
            });

            it(`does not update the ${aspectScenario.name} after the initial set`, async () => {
                const { behavior, node, targets } = bindingWithConfig(oneTime, aspectScenario.sourceAspect);
                const model = new Model(aspectScenario.originalValue);

                behavior.bind(model, ExecutionContext.default, targets);

                expect(aspectScenario.getValue(node)).to.equal(aspectScenario.originalValue);

                model.value = aspectScenario.newValue;

                await Updates.next();

                expect(aspectScenario.getValue(node)).to.equal(aspectScenario.originalValue);
            });

            it(`doesn't update the ${aspectScenario.name} after unbind`, async () => {
                const { behavior, node, targets } = bindingWithConfig(oneTime, aspectScenario.sourceAspect);
                const model = new Model(aspectScenario.originalValue);

                behavior.bind(model, ExecutionContext.default, targets);

                expect(aspectScenario.getValue(node)).to.equal(aspectScenario.originalValue);

                behavior.unbind(model, ExecutionContext.default, targets);
                model.value = aspectScenario.newValue;
                await Updates.next();

                expect(aspectScenario.getValue(node)).to.equal(aspectScenario.originalValue);
            });
        }
    });

    context("when binding with a signal", () => {
        for (const aspectScenario of aspectScenarios) {
            it(`sets the initial value of the ${aspectScenario.name} binding`, () => {
                const { behavior, node, targets } = bindingWithConfig(signal("test-signal"), aspectScenario.sourceAspect);
                const model = new Model(aspectScenario.originalValue);

                behavior.bind(model, ExecutionContext.default, targets);

                expect(aspectScenario.getValue(node)).to.equal(model.value);
            });

            it(`updates the ${aspectScenario.name} only when the signal is sent`, async () => {
                const signalName = "test-signal";
                const { behavior, node, targets } = bindingWithConfig(signal(signalName), aspectScenario.sourceAspect);
                const model = new Model(aspectScenario.originalValue);

                behavior.bind(model, ExecutionContext.default, targets);

                expect(aspectScenario.getValue(node)).to.equal(aspectScenario.originalValue);

                model.value = aspectScenario.newValue;

                await Updates.next();

                expect(aspectScenario.getValue(node)).to.equal(aspectScenario.originalValue);

                SignalBinding.send(signalName);

                await Updates.next();

                expect(aspectScenario.getValue(node)).to.equal(model.value);
            });

            it(`doesn't respond to signals for a ${aspectScenario.name} binding after unbind`, async () => {
                const signalName = "test-signal";
                const { behavior, node, targets } = bindingWithConfig(signal(signalName), aspectScenario.sourceAspect);
                const model = new Model(aspectScenario.originalValue);

                behavior.bind(model, ExecutionContext.default, targets);

                expect(aspectScenario.getValue(node)).to.equal(model.value);

                behavior.unbind(model, ExecutionContext.default, targets);
                model.value = aspectScenario.newValue;
                SignalBinding.send(signalName);

                await Updates.next();

                expect(aspectScenario.getValue(node)).to.equal(aspectScenario.originalValue);
            });
        }
    });
});
