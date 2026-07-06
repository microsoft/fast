import { expect } from "chai";
import { children, ChildrenDirective } from "./children.js";
import { observable } from "../observation/observable.js";
import { elements } from "./node-observation.js";
import { Updates } from "../observation/update-queue.js";
import { Fake } from "../testing/fakes.js";
import { html } from "./template.js";
import { ref } from "./ref.js";
import { computedState } from "../state/state.js";

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
            reference: HTMLElement;
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

        it("gathers child nodes", () => {
            const { host, children, targets, nodeId } = createDOM();
            const behavior = new ChildrenDirective({
                property: "nodes",
            });
            behavior.targetNodeId = nodeId;
            const model = new Model();
            const controller = Fake.viewController(targets, behavior);

            controller.bind(model);

            expect(model.nodes).members(children);
        });

        it("gathers child nodes with a filter", () => {
            const { host, children, targets, nodeId } = createDOM("foo-bar");
            const behavior = new ChildrenDirective({
                property: "nodes",
                filter: elements("foo-bar"),
            });
            behavior.targetNodeId = nodeId;
            const model = new Model();
            const controller = Fake.viewController(targets, behavior);

            controller.bind(model);

            expect(model.nodes).members(children.filter(elements("foo-bar")));
        });

        it("updates child nodes when they change", async () => {
            const { host, children, targets, nodeId } = createDOM("foo-bar");
            const behavior = new ChildrenDirective({
                property: "nodes",
            });
            behavior.targetNodeId = nodeId;
            const model = new Model();
            const controller = Fake.viewController(targets, behavior);

            controller.bind(model);

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
            behavior.targetNodeId = nodeId;
            const model = new Model();
            const controller = Fake.viewController(targets, behavior);

            controller.bind(model);

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
            behavior.targetNodeId = nodeId;

            const model = new Model();
            const controller = Fake.viewController(targets, behavior);

            controller.bind(model);

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
            behavior.targetNodeId = nodeId;
            const model = new Model();
            const controller = Fake.viewController(targets, behavior);

            controller.bind(model);

            expect(model.nodes).members(children);

            behavior.unbind(controller);

            expect(model.nodes).members([]);

            host.appendChild(document.createElement("div"));

            await Updates.next();

            expect(model.nodes).members([]);
        });
        it("re-watches when re-bound", async () => {
            const { host, children, targets, nodeId } = createDOM("foo-bar");
            const behavior = new ChildrenDirective({
                property: "nodes",
            });
            behavior.targetNodeId = nodeId;
            const model = new Model();
            const controller = Fake.viewController(targets, behavior);

            controller.bind(model);

            behavior.unbind(controller);
            behavior.bind(controller);

            const element = document.createElement("div");
            host.appendChild(element);

            await Updates.next();

            expect(model.nodes.includes(element)).to.equal(true)
        });

        it("should not throw if DOM stringified", () => {
            const template = html<Model>`
                <div id="test"
                     ${children("nodes")}
                     ${ref("reference")}>
                </div>
            `;

            const view = template.create();
            const model = new Model();

            view.bind(model);

            expect(() => {
                JSON.stringify(model.reference);
            }).to.not.throw();

            view.unbind();
        });


        it("supports multiple directives for the same element", async () => {
            const { host, targets, nodeId } = createDOM("foo-bar");
            class MultipleDirectivesModel {
                @observable
                elements: Element[] = [];
                @observable
                text: Text[] = [];
            }
            const elementsDirective = new ChildrenDirective({
                property: "elements",
                filter: elements(),
            });

            const textDirective = new ChildrenDirective({
                property: "text",
                filter: (value) => value.nodeType === Node.TEXT_NODE,
            });
            elementsDirective.targetNodeId = nodeId;
            textDirective.targetNodeId = nodeId;
            const model = new MultipleDirectivesModel();
            const controller = Fake.viewController(targets, elementsDirective, textDirective);

            controller.bind(model);

            elementsDirective.bind(controller);
            textDirective.bind(controller);
            const element = document.createElement("div");
            const text = document.createTextNode("text");

            host.appendChild(element);
            host.appendChild(text)

            await Updates.next();

            expect(model.elements.includes(element)).to.equal(true);
            expect(model.elements.includes(text as any)).to.equal(false);
            expect(model.text.includes(text)).to.equal(true);
            expect(model.text.includes(element as any)).to.equal(false);
        });
    });
});
