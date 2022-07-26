import { expect } from "chai";
import { children, ChildrenDirective } from "./children.js";
import { observable } from "../observation/observable.js";
import { elements } from "./node-observation.js";
import { Updates } from "../observation/update-queue.js";
import type { ViewBehaviorTargets, ViewController } from "./html-directive.js";
import { Fake } from "../testing/fakes.js";

describe("The children", () => {
    context("template function", () => {
        it("returns an ChildrenDirective", () => {
            const directive = children("test");
            expect(directive).to.be.instanceOf(ChildrenDirective);
        });
    });

    context("directive", () => {
        it("creates a behavior by returning itself", () => {
            const directive = children("test") as ChildrenDirective;
            const behavior = directive.createBehavior();
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
            const nodeId = 'r';
            const targets = { [nodeId]: host };

            return { host, children, targets, nodeId };
        }

        function createController(source: any, targets: ViewBehaviorTargets): ViewController {
            return {
                source,
                targets,
                context: Fake.executionContext(),
                onUnbind() {

                }
            };
        }

        it("gathers child nodes", () => {
            const { host, children, targets, nodeId } = createDOM();
            const behavior = new ChildrenDirective({
                property: "nodes",
            });
            behavior.nodeId = nodeId;
            const model = new Model();
            const controller = createController(model, targets);

            behavior.bind(controller);

            expect(model.nodes).members(children);
        });

        it("gathers child nodes with a filter", () => {
            const { host, children, targets, nodeId } = createDOM("foo-bar");
            const behavior = new ChildrenDirective({
                property: "nodes",
                filter: elements("foo-bar"),
            });
            behavior.nodeId = nodeId;
            const model = new Model();
            const controller = createController(model, targets);

            behavior.bind(controller);

            expect(model.nodes).members(children.filter(elements("foo-bar")));
        });

        it("updates child nodes when they change", async () => {
            const { host, children, targets, nodeId } = createDOM("foo-bar");
            const behavior = new ChildrenDirective({
                property: "nodes",
            });
            behavior.nodeId = nodeId;
            const model = new Model();
            const controller = createController(model, targets);

            behavior.bind(controller);

            expect(model.nodes).members(children);

            const updatedChildren = children.concat(createAndAppendChildren(host));

            await Updates.next();

            expect(model.nodes).members(updatedChildren);
        });

        it("updates child nodes when they change with a filter", async () => {
            const { host, children, targets, nodeId } = createDOM("foo-bar");
            const behavior = new ChildrenDirective({
                property: "nodes",
                filter: elements("foo-bar"),
            });
            behavior.nodeId = nodeId;
            const model = new Model();
            const controller = createController(model, targets);

            behavior.bind(controller);

            expect(model.nodes).members(children);

            const updatedChildren = children.concat(createAndAppendChildren(host));

            await Updates.next();

            expect(model.nodes).members(updatedChildren.filter(elements("foo-bar")));
        });

        it("updates subtree nodes when they change with a selector", async () => {
            const { host, children, targets, nodeId } = createDOM("foo-bar");
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
            behavior.nodeId = nodeId;

            const model = new Model();
            const controller = createController(model, targets);

            behavior.bind(controller);

            expect(model.nodes).members(subtreeChildren);

            const newChildren = createAndAppendChildren(host);

            for (let child of newChildren) {
                for (let i = 0; i < 3; ++i) {
                    const subChild = document.createElement("foo-bar-baz");
                    subtreeChildren.push(subChild);
                    child.appendChild(subChild);
                }
            }

            await Updates.next();

            expect(model.nodes).members(subtreeChildren);
        });

        it("clears and unwatches when unbound", async () => {
            const { host, children, targets, nodeId } = createDOM("foo-bar");
            const behavior = new ChildrenDirective({
                property: "nodes",
            });
            behavior.nodeId = nodeId;
            const model = new Model();
            const controller = createController(model, targets);

            behavior.bind(controller);

            expect(model.nodes).members(children);

            behavior.unbind(controller);

            expect(model.nodes).members([]);

            host.appendChild(document.createElement("div"));

            await Updates.next();

            expect(model.nodes).members([]);
        });
    });
});
