import { expect } from "chai";
import { children, ChildrenBehavior } from "./children";
import { AttachedBehaviorHTMLDirective } from "./html-directive";
import { observable } from "../observation/observable";
import { elements } from "./node-observation";
import { DOM } from "../dom";

describe("The children", () => {
    context("template function", () => {
        it("returns an AttachedBehaviorDirective", () => {
            const directive = children("test");
            expect(directive).to.be.instanceOf(AttachedBehaviorHTMLDirective);
        });
    });

    context("directive", () => {
        it("creates a ChildrenBehavior", () => {
            const directive = children("test") as AttachedBehaviorHTMLDirective;
            const target = document.createElement("div");
            const behavior = directive.createBehavior(target);

            expect(behavior).to.be.instanceOf(ChildrenBehavior);
        });
    });

    context("behavior", () => {
        class Model {
            @observable nodes: HTMLElement[];
        }

        function createAndAppendChildren(host: HTMLElement, elementName = "div") {
            return [...Array(10)].map((_item: number, i: number) => {
                const child = document.createElement(i % 1 === 0 ? elementName : "div");
                host.appendChild(child);
                return child;
            })
        }

        function createDOM(elementName: string = "div") {
            const host = document.createElement("div");
            const children = createAndAppendChildren(host, elementName);

            return { host, children };
        }

        it("gathers child nodes", () => {
            const { host, children } = createDOM();
            const behavior = new ChildrenBehavior(host, {
                property: "nodes",
            });
            const model = new Model();

            behavior.bind(model);

            expect(model.nodes).members(children);
        });

        it("gathers child nodes with a filter", () => {
            const { host, children } = createDOM("foo-bar");
            const behavior = new ChildrenBehavior(host, {
                property: "nodes",
                filter: elements("foo-bar"),
            });
            const model = new Model();

            behavior.bind(model);

            expect(model.nodes).members(children.filter(elements("foo-bar")));
        });

        it("updates child nodes when they change", async () => {
            const { host, children } = createDOM("foo-bar");
            const behavior = new ChildrenBehavior(host, {
                property: "nodes",
            });
            const model = new Model();

            behavior.bind(model);

            expect(model.nodes).members(children);

            const updatedChildren = children.concat(createAndAppendChildren(host));

            await DOM.nextUpdate();

            expect(model.nodes).members(updatedChildren);
        });

        it("updates child nodes when they change with a filter", async () => {
            const { host, children } = createDOM("foo-bar");
            const behavior = new ChildrenBehavior(host, {
                property: "nodes",
                filter: elements("foo-bar"),
            });
            const model = new Model();

            behavior.bind(model);

            expect(model.nodes).members(children);

            const updatedChildren = children.concat(createAndAppendChildren(host));
            console.warn({updatedChildren})

            await DOM.nextUpdate();

            expect(model.nodes).members(updatedChildren.filter(elements("foo-bar")));
        });

        it("updates subtree nodes when they change with a selector", async () => {
            const { host, children } = createDOM("foo-bar");
            const subtreeElement = "foo-bar-baz";
            const subtreeChildren: HTMLElement[] = [];

            for (let child of children) {
                for (let i = 0; i < 3; ++i) {
                    const subChild = document.createElement("foo-bar-baz");
                    subtreeChildren.push(subChild);
                    child.appendChild(subChild);
                }
            }

            const behavior = new ChildrenBehavior(host, {
                property: "nodes",
                subtree: true,
                selector: subtreeElement,
            });

            const model = new Model();

            behavior.bind(model);

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
            const { host, children } = createDOM("foo-bar");
            const behavior = new ChildrenBehavior(host, {
                property: "nodes",
            });
            const model = new Model();

            behavior.bind(model);

            expect(model.nodes).members(children);

            behavior.unbind();

            expect(model.nodes).members([]);

            host.appendChild(document.createElement("div"));

            await DOM.nextUpdate();

            expect(model.nodes).members([]);
        });
    });
});
