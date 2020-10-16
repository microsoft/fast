import { expect } from "chai";
import { DOM } from "../dom";
import { observable } from "../observation/observable";
import { AttachedBehaviorDirective } from "./directive";
import { elements } from "./node-observation";
import { slotted, SlottedBehavior } from "./slotted";

describe("The slotted", () => {
    context("template function", () => {
        it("returns an AttachedBehaviorDirective", () => {
            const directive = slotted("test");
            expect(directive).to.be.instanceOf(AttachedBehaviorDirective);
        });
    });

    context("directive", () => {
        it("creates a SlottedBehavior", () => {
            const directive = slotted("test") as AttachedBehaviorDirective;
            const target = document.createElement("slot");
            const behavior = directive.createBehavior(target);

            expect(behavior).to.be.instanceOf(SlottedBehavior);
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

            shadowRoot.appendChild(slot);

            return { host, slot, children };
        }

        it("gathers nodes from a slot", () => {
            const { host, slot, children } = createDOM();
            const behavior = new SlottedBehavior(slot, { property: "nodes" });
            const model = new Model();

            behavior.bind(model);

            expect(model.nodes).members(children);
        });

        it("gathers nodes from a slot with a filter", () => {
            const { host, slot, children } = createDOM("foo-bar");
            const behavior = new SlottedBehavior(slot, {
                property: "nodes",
                filter: elements("foo-bar"),
            });
            const model = new Model();

            behavior.bind(model);

            expect(model.nodes).members(children.filter(elements("foo-bar")));
        });

        it("updates when slotted nodes change", async () => {
            const { host, slot, children } = createDOM("foo-bar");
            const behavior = new SlottedBehavior(slot, { property: "nodes" });
            const model = new Model();

            behavior.bind(model);

            expect(model.nodes).members(children);

            const updatedChildren = children.concat(createAndAppendChildren(host));

            await DOM.nextUpdate();

            expect(model.nodes).members(updatedChildren);
        });

        it("updates when slotted nodes change with a filter", async () => {
            const { host, slot, children } = createDOM("foo-bar");
            const behavior = new SlottedBehavior(slot, {
                property: "nodes",
                filter: elements("foo-bar"),
            });
            const model = new Model();

            behavior.bind(model);

            expect(model.nodes).members(children);

            const updatedChildren = children.concat(createAndAppendChildren(host));

            await DOM.nextUpdate();

            expect(model.nodes).members(updatedChildren.filter(elements("foo-bar")));
        });

        it("clears and unwatches when unbound", async () => {
            const { host, slot, children } = createDOM("foo-bar");
            const behavior = new SlottedBehavior(slot, { property: "nodes" });
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
