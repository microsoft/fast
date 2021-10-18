import { expect } from "chai";
import { children, ChildrenDirective } from "./children";
import { defaultExecutionContext, observable } from "../observation/observable";
import { elements } from "./node-observation";
import { DOM } from "../dom";

describe("The children", () => {
    context("template function", () => {
        it("returns an ChildrenDirective", () => {
            const directive = children("test");
            expect(directive).to.be.instanceOf(ChildrenDirective);
        });
    });

    context("directive", () => {
        it("creates a behavior by returning itself", () => {
            const targetId = 'r';
            const directive = children("test") as ChildrenDirective;
            const target = document.createElement("div");
            const targets = { [targetId]: target };
            const behavior = directive.createBehavior(targets);
            expect(behavior).to.equal(behavior);
        });
    });

    context("behavior", () => {
        class Model {
            @observable nodes;
        }

        function createAndAppendChildren(host: HTMLElement, elementName = "div") {
            const children = new Array(10);

            for (let i = 0, ii = children.length; i < ii; ++i) {
                const child = document.createElement(i % 1 === 0 ? elementName : "div");
                children[i] = child;
                host.appendChild(child);
            }

            return children;
        }

        function createDOM(elementName: string = "div") {
            const host = document.createElement("div");
            const children = createAndAppendChildren(host, elementName);
            const targetId = 'r';
            const targets = { [targetId]: host };

            return { host, children, targets, targetId };
        }

        it("gathers child nodes", () => {
            const { host, children, targets, targetId } = createDOM();
            const behavior = new ChildrenDirective({
                property: "nodes",
            });
            behavior.targetId = targetId;
            const model = new Model();

            behavior.bind(model, defaultExecutionContext, targets);

            expect(model.nodes).members(children);
        });

        it("gathers child nodes with a filter", () => {
            const { host, children, targets, targetId } = createDOM("foo-bar");
            const behavior = new ChildrenDirective({
                property: "nodes",
                filter: elements("foo-bar"),
            });
            behavior.targetId = targetId;
            const model = new Model();

            behavior.bind(model, defaultExecutionContext, targets);

            expect(model.nodes).members(children.filter(elements("foo-bar")));
        });

        it("updates child nodes when they change", async () => {
            const { host, children, targets, targetId } = createDOM("foo-bar");
            const behavior = new ChildrenDirective({
                property: "nodes",
            });
            behavior.targetId = targetId;
            const model = new Model();

            behavior.bind(model, defaultExecutionContext, targets);

            expect(model.nodes).members(children);

            const updatedChildren = children.concat(createAndAppendChildren(host));

            await DOM.nextUpdate();

            expect(model.nodes).members(updatedChildren);
        });

        it("updates child nodes when they change with a filter", async () => {
            const { host, children, targets, targetId } = createDOM("foo-bar");
            const behavior = new ChildrenDirective({
                property: "nodes",
                filter: elements("foo-bar"),
            });
            behavior.targetId = targetId;
            const model = new Model();

            behavior.bind(model, defaultExecutionContext, targets);

            expect(model.nodes).members(children);

            const updatedChildren = children.concat(createAndAppendChildren(host));

            await DOM.nextUpdate();

            expect(model.nodes).members(updatedChildren.filter(elements("foo-bar")));
        });

        it("updates subtree nodes when they change with a selector", async () => {
            const { host, children, targets, targetId } = createDOM("foo-bar");
            const subtreeElement = "foo-bar-baz";
            const subtreeChildren: HTMLElement[] = [];

            for (let child of children) {
                for (let i = 0; i < 3; ++i) {
                    const subChild = document.createElement("foo-bar-baz");
                    subtreeChildren.push(subChild);
                    child.appendChild(subChild);
                }
            }

            const behavior = new ChildrenDirective({
                property: "nodes",
                subtree: true,
                selector: subtreeElement,
            });
            behavior.targetId = targetId;

            const model = new Model();

            behavior.bind(model, defaultExecutionContext, targets);

            expect(model.nodes).members(subtreeChildren);

            const newChildren = createAndAppendChildren(host);

            for (let child of newChildren) {
                for (let i = 0; i < 3; ++i) {
                    const subChild = document.createElement("foo-bar-baz");
                    subtreeChildren.push(subChild);
                    child.appendChild(subChild);
                }
            }

            await DOM.nextUpdate();

            expect(model.nodes).members(subtreeChildren);
        });

        it("clears and unwatches when unbound", async () => {
            const { host, children, targets, targetId } = createDOM("foo-bar");
            const behavior = new ChildrenDirective({
                property: "nodes",
            });
            behavior.targetId = targetId;
            const model = new Model();

            behavior.bind(model, defaultExecutionContext, targets);

            expect(model.nodes).members(children);

            behavior.unbind(model, defaultExecutionContext, targets);

            expect(model.nodes).members([]);

            host.appendChild(document.createElement("div"));

            await DOM.nextUpdate();

            expect(model.nodes).members([]);
        });
    });
});
