import { expect } from "chai";
import { slotted, SlottedDirective } from "./slotted.js";
import { ExecutionContext, observable } from "../observation/observable.js";
import { elements } from "./node-observation.js";
import { Updates } from "../observation/update-queue.js";

describe("The slotted", () => {
    context("template function", () => {
        it("returns an ChildrenDirective", () => {
            const directive = slotted("test");
            expect(directive).to.be.instanceOf(SlottedDirective);
        });
    });

    context("directive", () => {
        it("creates a behavior by returning itself", () => {
            const nodeId = 'r';
            const directive = slotted("test") as SlottedDirective;
            directive.nodeId = nodeId;
            const target = document.createElement("slot");
            const targets = { [nodeId]: target }
            const behavior = directive.createBehavior(targets);

            expect(behavior).to.equal(directive);
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
            const slot = document.createElement("slot");
            const shadowRoot = host.attachShadow({ mode: "open" });
            const children = createAndAppendChildren(host, elementName);
            const nodeId = 'r';
            const targets = { [nodeId]: slot };

            shadowRoot.appendChild(slot);

            return { host, slot, children, targets, nodeId };
        }

        it("gathers nodes from a slot", () => {
            const { children, targets, nodeId } = createDOM();
            const behavior = new SlottedDirective({ property: "nodes" });
            behavior.nodeId = nodeId;
            const model = new Model();

            behavior.bind(model, ExecutionContext.default, targets);

            expect(model.nodes).members(children);
        });

        it("gathers nodes from a slot with a filter", () => {
            const { targets, nodeId, children } = createDOM("foo-bar");
            const behavior = new SlottedDirective({
                property: "nodes",
                filter: elements("foo-bar"),
            });
            behavior.nodeId = nodeId;
            const model = new Model();

            behavior.bind(model, ExecutionContext.default, targets);

            expect(model.nodes).members(children.filter(elements("foo-bar")));
        });

        it("updates when slotted nodes change", async () => {
            const { host, slot, children, targets, nodeId } = createDOM("foo-bar");
            const behavior = new SlottedDirective({ property: "nodes" });
            behavior.nodeId = nodeId;
            const model = new Model();

            behavior.bind(model, ExecutionContext.default, targets);

            expect(model.nodes).members(children);

            const updatedChildren = children.concat(createAndAppendChildren(host));

            await Updates.next();

            expect(model.nodes).members(updatedChildren);
        });

        it("updates when slotted nodes change with a filter", async () => {
            const { host, slot, children, targets, nodeId } = createDOM("foo-bar");
            const behavior = new SlottedDirective({
                property: "nodes",
                filter: elements("foo-bar"),
            });
            behavior.nodeId = nodeId;
            const model = new Model();

            behavior.bind(model, ExecutionContext.default, targets);

            expect(model.nodes).members(children);

            const updatedChildren = children.concat(createAndAppendChildren(host));

            await Updates.next();

            expect(model.nodes).members(updatedChildren.filter(elements("foo-bar")));
        });

        it("clears and unwatches when unbound", async () => {
            const { host, slot, children, targets, nodeId } = createDOM("foo-bar");
            const behavior = new SlottedDirective({ property: "nodes" });
            behavior.nodeId = nodeId;
            const model = new Model();

            behavior.bind(model, ExecutionContext.default, targets);

            expect(model.nodes).members(children);

            behavior.unbind(model, ExecutionContext.default, targets);

            expect(model.nodes).members([]);

            host.appendChild(document.createElement("div"));

            await Updates.next();

            expect(model.nodes).members([]);
        });
    });
});
