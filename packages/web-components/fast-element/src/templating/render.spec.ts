import { expect } from "chai";
import { ExecutionContext, html } from "../index.js";
import { NodeTemplate, render, RenderDirective, RenderInstruction } from "./render.js";

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
});
