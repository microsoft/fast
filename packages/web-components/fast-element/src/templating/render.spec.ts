import { expect } from "chai";
import { customElement, FASTElement } from "../components/fast-element.js";
import { ExecutionContext, observable } from "../observation/observable.js";
import { Updates } from "../observation/update-queue.js";
import { uniqueElementName } from "../testing/fixture.js";
import { toHTML } from "../__test__/helpers.js";
import type { AddViewBehaviorFactory, ViewBehaviorFactory } from "./html-directive.js";
import { Markup } from "./markup.js";
import { NodeTemplate, render, RenderBehavior, RenderDirective, RenderInstruction, renderWith } from "./render.js";
import { html, ViewTemplate } from "./template.js";
import type { SyntheticView } from "./view.js";

describe("The render", () => {
    const childTemplate = html`Child Template`;
    const childEditTemplate = html`Child Edit Template`;
    const parentTemplate = html`Parent Template`;

    context("template function", () => {
        class TestChild {
            name = "FAST";
        }

        class TestParent {
            child = new TestChild();
        }

        RenderInstruction.register({
            type: TestChild,
            template: childTemplate
        });

        RenderInstruction.register({
            type: TestChild,
            template: childEditTemplate,
            name: "edit"
        });

        RenderInstruction.register({
            type: TestParent,
            template: parentTemplate
        });

        it("returns a RenderDirective", () => {
            const directive = render();
            expect(directive).to.be.instanceOf(RenderDirective);
        });

        it("creates a data binding that points to the source when no data binding is provided", () => {
            const source = new TestParent();
            const directive = render() as RenderDirective;

            const data = directive.dataBinding(source, ExecutionContext.default);

            expect(data).to.equal(source);
        });

        it("creates a data binding that evaluates the provided binding", () => {
            const source = new TestParent();
            const directive = render<TestParent>(x => x.child) as RenderDirective;

            const data = directive.dataBinding(source, ExecutionContext.default);

            expect(data).to.equal(source.child);
        });

        it("creates a data binding that evaluates to a provided node", () => {
            const source = new TestParent();
            const node = document.createElement("div");
            const directive = render(node) as RenderDirective;

            const data = directive.dataBinding(source, ExecutionContext.default);

            expect(data).to.equal(node);
        });

        it("creates a data binding that evaluates to a provided object", () => {
            const source = new TestParent();
            const obj = {};
            const directive = render(obj) as RenderDirective;

            const data = directive.dataBinding(source, ExecutionContext.default);

            expect(data).to.equal(obj);
        });

        it("creates a template binding when a template is provided", () => {
            const source = new TestParent();
            const directive = render<TestParent>(x => x.child, childEditTemplate) as RenderDirective;
            const template = directive.templateBinding(source, ExecutionContext.default);
            expect(template).to.equal(childEditTemplate);
        });

        context("creates a template binding based on the data binding when no template binding is provided", () => {
            it("for no binding", () => {
                const source = new TestParent();
                const directive = render() as RenderDirective;
                const template = directive.templateBinding(source, ExecutionContext.default);
                expect(template).to.equal(parentTemplate);
            });

            it("for normal binding", () => {
                const source = new TestParent();
                const directive = render<TestParent>(x => x.child) as RenderDirective;
                const template = directive.templateBinding(source, ExecutionContext.default);
                expect(template).to.equal(childTemplate);
            });

            it("for node binding", () => {
                const source = new TestParent();
                const node = document.createElement("div");
                const directive = render<TestParent>(() => node) as RenderDirective;
                const template = directive.templateBinding(source, ExecutionContext.default) as NodeTemplate;
                expect(template).to.be.instanceOf(NodeTemplate);
                expect(template.node).equals(node);
            });
        });

        context("creates a template using the template binding that was provided", () => {
            it("when the template binding returns a string", () => {
                const source = new TestParent();
                const directive = render<TestParent>(x => x.child, () => "edit") as RenderDirective;
                const template = directive.templateBinding(source, ExecutionContext.default);
                expect(template).to.equal(childEditTemplate);
            });

            it("when the template binding returns a node", () => {
                const source = new TestParent();
                const node = document.createElement("div");
                const directive = render<TestParent>(x => x.child, () => node) as RenderDirective;
                const template = directive.templateBinding(source, ExecutionContext.default) as NodeTemplate;
                expect(template).to.be.instanceOf(NodeTemplate);
                expect(template.node).equals(node);
            });

            it("when the template binding returns a template", () => {
                const source = new TestParent();
                const directive = render<TestParent>(x => x.child, () => childEditTemplate) as RenderDirective;
                const template = directive.templateBinding(source, ExecutionContext.default);
                expect(template).equal(childEditTemplate);
            });
        });

        context("creates a template when a view name was specified", () => {
            it("when the data binding returns a node", () => {
                const source = new TestParent();
                const node = document.createElement("div");
                const directive = render<TestParent>(() => node, "edit") as RenderDirective;
                const template = directive.templateBinding(source, ExecutionContext.default) as NodeTemplate;
                expect(template).to.be.instanceOf(NodeTemplate);
                expect(template.node).equals(node);
            });

            it("when the data binding returns a value", () => {
                const source = new TestParent();
                const directive = render<TestParent>(x => x.child, "edit") as RenderDirective;
                const template = directive.templateBinding(source, ExecutionContext.default);
                expect(template).equal(childEditTemplate);
            });
        });
    });

    context("instruction gateway", () => {
        const operations = ["create", "register"];

        for (const operation of operations) {
            it(`can ${operation} an instruction from type and template`, () => {
                class TestClass {};

                const instruction = RenderInstruction[operation]({
                    type: TestClass,
                    template: parentTemplate
                });

                expect(RenderInstruction.instanceOf(instruction)).to.be.true;
                expect(instruction.type).equal(TestClass);
                expect(instruction.template).equal(parentTemplate);
            });

            it(`can ${operation} an instruction from type, template, and name`, () => {
                class TestClass {};

                const instruction = RenderInstruction[operation]({
                    type: TestClass,
                    template: parentTemplate,
                    name: "test"
                });

                expect(RenderInstruction.instanceOf(instruction)).to.be.true;
                expect(instruction.type).equal(TestClass);
                expect(instruction.template).equal(parentTemplate);
                expect(instruction.name).equal("test");
            });

            it(`can ${operation} an instruction from type and element`, () => {
                class TestClass {};
                const tagName = uniqueElementName();

                @customElement(tagName)
                class TestElement extends FASTElement {}

                const instruction = RenderInstruction[operation]({
                    element: TestElement,
                    type: TestClass
                });

                const template = instruction.template as ViewTemplate;

                expect(RenderInstruction.instanceOf(instruction)).to.be.true;
                expect(instruction.type).equal(TestClass);
                expect(template).instanceOf(ViewTemplate);
                expect(template.html).to.include(`</${tagName}>`);
            });

            it(`can ${operation} an instruction from type, element, and name`, () => {
                class TestClass {};
                const tagName = uniqueElementName();

                @customElement(tagName)
                class TestElement extends FASTElement {}

                const instruction = RenderInstruction[operation]({
                    element: TestElement,
                    type: TestClass,
                    name: "test"
                });

                const template = instruction.template as ViewTemplate;

                expect(RenderInstruction.instanceOf(instruction)).to.be.true;
                expect(instruction.type).equal(TestClass);
                expect(template).instanceOf(ViewTemplate);
                expect(template.html).to.include(`</${tagName}>`);
                expect(instruction.name).equal("test");
            });

            it(`can ${operation} an instruction from type, element, and content`, () => {
                class TestClass {};
                const tagName = uniqueElementName();
                const content = "Hello World!";

                @customElement(tagName)
                class TestElement extends FASTElement {}

                const instruction = RenderInstruction[operation]({
                    element: TestElement,
                    type: TestClass,
                    content
                });

                const template = instruction.template as ViewTemplate;

                expect(RenderInstruction.instanceOf(instruction)).to.be.true;
                expect(instruction.type).equal(TestClass);
                expect(template).instanceOf(ViewTemplate);
                expect(template.html).to.include(`${content}</${tagName}>`);
            });

            it(`can ${operation} an instruction from type, element, content, and attributes`, () => {
                class TestClass {};
                const tagName = uniqueElementName();
                const content = "Hello World!";

                @customElement(tagName)
                class TestElement extends FASTElement {}

                const instruction = RenderInstruction[operation]({
                    element: TestElement,
                    type: TestClass,
                    content,
                    attributes: {
                        "foo": "bar",
                        "baz": "qux"
                    }
                });

                const template = instruction.template as ViewTemplate;

                expect(RenderInstruction.instanceOf(instruction)).to.be.true;
                expect(instruction.type).equal(TestClass);
                expect(template).instanceOf(ViewTemplate);
                expect(template.html).to.include(`${content}</${tagName}>`);
                expect(template.html).to.include(`foo="`);
                expect(template.html).to.include(`baz="`);
            });

            it(`can ${operation} an instruction from type and tagName`, () => {
                class TestClass {};
                const tagName = uniqueElementName();

                const instruction = RenderInstruction[operation]({
                    tagName,
                    type: TestClass
                });

                const template = instruction.template as ViewTemplate;

                expect(RenderInstruction.instanceOf(instruction)).to.be.true;
                expect(instruction.type).equal(TestClass);
                expect(template).instanceOf(ViewTemplate);
                expect(template.html).to.include(`</${tagName}>`);
            });

            it(`can ${operation} an instruction from type, tagName, and name`, () => {
                class TestClass {};
                const tagName = uniqueElementName();

                const instruction = RenderInstruction[operation]({
                    tagName,
                    type: TestClass,
                    name: "test"
                });

                const template = instruction.template as ViewTemplate;

                expect(RenderInstruction.instanceOf(instruction)).to.be.true;
                expect(instruction.type).equal(TestClass);
                expect(template).instanceOf(ViewTemplate);
                expect(template.html).to.include(`</${tagName}>`);
                expect(instruction.name).equal("test");
            });

            it(`can ${operation} an instruction from type, tagName, and content`, () => {
                class TestClass {};
                const tagName = uniqueElementName();
                const content = "Hello World!";

                const instruction = RenderInstruction[operation]({
                    tagName,
                    type: TestClass,
                    content
                });

                const template = instruction.template as ViewTemplate;

                expect(RenderInstruction.instanceOf(instruction)).to.be.true;
                expect(instruction.type).equal(TestClass);
                expect(template).instanceOf(ViewTemplate);
                expect(template.html).to.include(`${content}</${tagName}>`);
            });

            it(`can ${operation} an instruction from type, tagName, content, and attributes`, () => {
                class TestClass {};
                const tagName = uniqueElementName();
                const content = "Hello World!";

                const instruction = RenderInstruction[operation]({
                    tagName,
                    type: TestClass,
                    content,
                    attributes: {
                        "foo": "bar",
                        "baz": "qux"
                    }
                });

                const template = instruction.template as ViewTemplate;

                expect(RenderInstruction.instanceOf(instruction)).to.be.true;
                expect(instruction.type).equal(TestClass);
                expect(template).instanceOf(ViewTemplate);
                expect(template.html).to.include(`${content}</${tagName}>`);
                expect(template.html).to.include(`foo="`);
                expect(template.html).to.include(`baz="`);
            });
        }

        it(`can register an existing instruction`, () => {
            class TestClass {};

            const instruction = RenderInstruction.create({
                type: TestClass,
                template: parentTemplate
            });

            const result = RenderInstruction.register(instruction);

            expect(result).equal(instruction);
        });

        it(`can get an instruction for an instance`, () => {
            class TestClass {};

            const instruction = RenderInstruction.register({
                type: TestClass,
                template: parentTemplate
            });

            const result = RenderInstruction.getForInstance(new TestClass());

            expect(result).equal(instruction);
        });

        it(`can get an instruction for a type`, () => {
            class TestClass {};

            const instruction = RenderInstruction.register({
                type: TestClass,
                template: parentTemplate
            });

            const result = RenderInstruction.getByType(TestClass);

            expect(result).equal(instruction);
        });
    });

    context("node template", () => {
        it("can add a node", () => {
            const parent = document.createElement("div");
            const location = document.createComment("");
            parent.appendChild(location);

            const child = document.createElement("div");
            const template = new NodeTemplate(child);

            const view = template.create();
            view.insertBefore(location);

            expect(child.parentElement).equal(parent);
            expect(child.nextSibling).equal(location);
        });

        it("can remove a node", () => {
            const parent = document.createElement("div");
            const child = document.createElement("div");
            parent.appendChild(child);

            const template = new NodeTemplate(child);

            const view = template.create();
            view.remove();

            expect(child.parentElement).equal(null);
            expect(child.nextSibling).equal(null);
        });
    });

    context("directive", () => {
        it("adds itself to a template with a comment placeholder", () => {
            const directive = render() as RenderDirective;
            const id = "12345";
            let captured;
            const addViewBehaviorFactory: AddViewBehaviorFactory = (factory: ViewBehaviorFactory) => {
                captured = factory;
                return id;
            };

            const html = directive.createHTML(addViewBehaviorFactory);

            expect(html).equals(Markup.comment(id));
            expect(captured).equals(directive);
        });

        it("creates a behavior", () => {
            const directive = render() as RenderDirective;
            directive.nodeId = "12345";
            const comment = document.createComment("");

            const targets = {
                "12345": comment
            };

            const behavior = directive.createBehavior(targets);

            expect(behavior).instanceOf(RenderBehavior);
        });

        it("can be interpolated in html", () => {
            const template = html`hello${render()}world`;
            const keys = Object.keys(template.factories);
            const directive = template.factories[keys[0]];

            expect(directive).instanceOf(RenderDirective);
        });
    });

    context("decorator", () => {
        it("registers with tagName options", () => {
            const tagName = uniqueElementName();

            @renderWith({ tagName })
            class Model {

            }

            const instruction = RenderInstruction.getByType(Model)!;
            expect(instruction.type).equals(Model);
            expect((instruction.template as ViewTemplate).html).contains(`</${tagName}>`);
        });

        it("registers with element options", () => {
            const tagName = uniqueElementName();

            @customElement(tagName)
            class TestElement extends FASTElement {}

            @renderWith({ element: TestElement })
            class Model {

            }

            const instruction = RenderInstruction.getByType(Model)!;
            expect(instruction.type).equals(Model);
            expect((instruction.template as ViewTemplate).html).contains(`</${tagName}>`);
        });

        it("registers with template options", () => {
            const template = html`hello world`;

            @renderWith({ template })
            class Model {

            }

            const instruction = RenderInstruction.getByType(Model)!;
            expect(instruction.type).equals(Model);
            expect((instruction.template as ViewTemplate).html).contains(`hello world`);
        });

        it("registers with element", () => {
            const tagName = uniqueElementName();

            @customElement(tagName)
            class TestElement extends FASTElement {}

            @renderWith(TestElement)
            class Model {

            }

            const instruction = RenderInstruction.getByType(Model)!;
            expect(instruction.type).equals(Model);
            expect((instruction.template as ViewTemplate).html).contains(`</${tagName}>`);
        });

        it("registers with element and name", () => {
            const tagName = uniqueElementName();

            @customElement(tagName)
            class TestElement extends FASTElement {}

            @renderWith(TestElement, "test")
            class Model {

            }

            const instruction = RenderInstruction.getByType(Model, "test")!;
            expect(instruction.type).equals(Model);
            expect((instruction.template as ViewTemplate).html).contains(`</${tagName}>`);
            expect(instruction.name).equals("test");
        });

        it("registers with template", () => {
            const template = html`hello world`;

            @renderWith(template)
            class Model {

            }

            const instruction = RenderInstruction.getByType(Model)!;
            expect(instruction.type).equals(Model);
            expect((instruction.template as ViewTemplate).html).contains(`hello world`);
        });

        it("registers with template and name", () => {
            const template = html`hello world`;

            @renderWith(template, "test")
            class Model {

            }

            const instruction = RenderInstruction.getByType(Model, "test")!;
            expect(instruction.type).equals(Model);
            expect((instruction.template as ViewTemplate).html).contains(`hello world`);
            expect(instruction.name).equals("test");
        });
    });

    context("behavior", () => {
        const childTemplate = html<Child>`This is a template. ${x => x.knownValue}`;

        class Child {
            @observable knownValue = "value";
        }

        class Parent {
            @observable child = new Child();
            @observable trigger = 0;
            @observable innerTemplate = childTemplate;

            get template() {
                const value = this.trigger;
                return this.innerTemplate;
            }

            forceComputedUpdate() {
                this.trigger++;
            }
        }

        function renderBehavior() {
            const directive = render<Parent>(x => x.child, x => x.template) as RenderDirective;
            directive.nodeId = 'r';

            const node = document.createComment("");
            const targets = { r: node };

            const behavior = directive.createBehavior(targets);
            const parentNode = document.createElement("div");

            parentNode.appendChild(node);

            return { directive, behavior, node, parentNode, targets };
        }

        it("initially inserts a view based on the template", () => {
            const { behavior, parentNode } = renderBehavior();
            const model = new Parent();

            behavior.bind(model, ExecutionContext.default);

            expect(toHTML(parentNode)).to.equal(`This is a template. value`);
        });

        it("updates an inserted view when the value changes to a new template", async () => {
            const { behavior, parentNode } = renderBehavior();
            const model = new Parent();

            behavior.bind(model, ExecutionContext.default);

            expect(toHTML(parentNode)).to.equal(`This is a template. value`);

            model.innerTemplate = html<Child>`This is a new template. ${x => x.knownValue}`;

            await Updates.next();

            expect(toHTML(parentNode)).to.equal(`This is a new template. value`);
        });

        it("doesn't compose an already composed view", async () => {
            const { behavior, parentNode, node } = renderBehavior();
            const model = new Parent();

            behavior.bind(model, ExecutionContext.default);
            const inserted = node.previousSibling;

            expect(toHTML(parentNode)).to.equal(`This is a template. value`);

            model.forceComputedUpdate();

            await Updates.next();

            expect(toHTML(parentNode)).to.equal(`This is a template. value`);
            expect(node.previousSibling).equal(inserted);
        });

        it("unbinds a composed view", () => {
            const { behavior, parentNode } = renderBehavior();
            const model = new Parent();

            behavior.bind(model, ExecutionContext.default);
            const view = (behavior as any).view as SyntheticView;

            expect(view.source).equal(model.child);
            expect(toHTML(parentNode)).to.equal(`This is a template. value`);

            behavior.unbind(model, ExecutionContext.default);

            expect(view.source).equal(null);
        });

        it("rebinds a previously unbound composed view", () => {
            const { behavior, parentNode } = renderBehavior();
            const model = new Parent();

            behavior.bind(model, ExecutionContext.default);
            const view = (behavior as any).view as SyntheticView;

            expect(view.source).to.equal(model.child);
            expect(toHTML(parentNode)).to.equal(`This is a template. value`);

            behavior.unbind(model, ExecutionContext.default);

            expect(view.source).to.equal(null);

            behavior.bind(model, ExecutionContext.default);

            const newView = (behavior as any).view as SyntheticView;
            expect(newView.source).to.equal(model.child);
            expect(newView).equal(view);
            expect(toHTML(parentNode)).to.equal(`This is a template. value`);
        });
    });

    context("createElementTemplate function", () => {
        const childTemplate = html<Child>`This is a template. ${x => x.knownValue}`;
        class Child {
            id = 'child-1';
            @observable knownValue: string = "value";
        }

        it(`creates a template from a tag name`, () => {
            const template = RenderInstruction.createElementTemplate("button");

            expect(template.html).to.equal(`<button></button>`);
        });

        it(`creates a template with attributes`, () => {
            const template = RenderInstruction.createElementTemplate(
                "button",
                { id: x => x.id }
            );

            const targetNode = document.createElement("div");
            const source = new Child();
            const view = template.create();

            view.bind(source, ExecutionContext.default);
            view.appendTo(targetNode);

            expect(view.source).to.equal(source);
            expect(toHTML(targetNode)).to.equal(`<button id="child-1"></button>`);
        });

        it(`creates a template with static content`, () => {
            const template = RenderInstruction.createElementTemplate("button", undefined, "foo");
            const targetNode = document.createElement("div");
            const view = template.create();

            view.appendTo(targetNode);

            expect(view.source).to.equal(null);
            expect(toHTML(targetNode.firstElementChild!)).to.equal("foo");
        });

        it(`creates a template with attributes and content ViewTemplate`, () => {
            const template = RenderInstruction.createElementTemplate(
                "button",
                {
                    id: x => x.id
                },
                childTemplate
            );

            const targetNode = document.createElement("div");
            const source = new Child();
            const view = template.create();

            view.bind(source, ExecutionContext.default);
            view.appendTo(targetNode);

            expect(view.source).to.equal(source);
            expect(toHTML(targetNode.firstElementChild!)).to.equal("This is a template. value")
        });

        it(`creates a template with content binding that can change when the source value changes`, async () => {
            const template = RenderInstruction.createElementTemplate(
                "button",
                {
                    id: x => x.id
                },
                childTemplate
            );

            const targetNode = document.createElement("div");
            const source = new Child();
            const view = template.create();

            view.bind(source, ExecutionContext.default);
            view.appendTo(targetNode);

            expect(view.source).to.equal(source);
            expect(toHTML(targetNode.firstElementChild!)).to.equal("This is a template. value");

            source.knownValue = "new-value";

            await Updates.next();

            expect(toHTML(targetNode.firstElementChild!)).to.equal("This is a template. new-value");
        });
    });
});
