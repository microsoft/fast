import { expect } from "chai";
import { customElement, FASTElement } from "../components/fast-element.js";
import { ExecutionContext } from "../observation/observable.js";
import { uniqueElementName } from "../__test__/helpers.js";
import type { AddViewBehaviorFactory, ViewBehaviorFactory } from "./html-directive.js";
import { Markup } from "./markup.js";
import { NodeTemplate, render, RenderBehavior, RenderDirective, RenderInstruction } from "./render.js";
import { html, ViewTemplate } from "./template.js";

describe.only("The render", () => {
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
});
