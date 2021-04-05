import { customElement, FASTElement } from "@microsoft/fast-element";
import { assert, expect } from "chai";
import { fixture } from "../fixture";
import type { CSSCustomPropertyDefinition } from "./behavior";
import {
    ConstructableStylesCustomPropertyManager,
    CustomPropertyManagerClient,
    StyleElementCustomPropertyManager,
} from "./manager";

@customElement("fast-client")
class Client extends FASTElement implements CustomPropertyManagerClient {
    public evaluate(definition: CSSCustomPropertyDefinition) {
        return typeof definition.value === "function"
            ? definition.value()
            : definition.value;
    }

    public cssCustomPropertyDefinitions = new Map();
}

async function setup() {
    const { connect, disconnect, element, parent } = await fixture<Client>("fast-client");

    return {
        element,
        connect,
        disconnect,
        parent,
    };
}

describe("ConstructableStylesCustomPropertyManager", () => {
    it("should construct with a constructable stylesheet", () => {
        assert(new ConstructableStylesCustomPropertyManager(new CSSStyleSheet()));
    });

    describe("on subscription", () => {
        it("should set the subscriber to the owner if it is the first subscriber", async () => {
            const { element, connect, disconnect } = await setup();
            const manager = new ConstructableStylesCustomPropertyManager(
                new CSSStyleSheet()
            );

            await connect();
            manager.subscribe(element);

            expect(manager.owner).to.equal(element);
            await disconnect();
        });
        it("should keep the first subscriber as the owner after multiple subscribers", async () => {
            const { connect, disconnect, element, parent } = await setup();

            const clone = element.cloneNode() as Client;

            parent.appendChild(clone);

            const manager = new ConstructableStylesCustomPropertyManager(
                new CSSStyleSheet()
            );

            await connect();

            manager.subscribe(element);
            manager.subscribe(clone);

            expect(manager.owner).to.equal(element);

            await disconnect();
        });
        it("should evaluate and write the value of all CSSCustomPropertyDefinitions in the client", async () => {
            const { element, connect, disconnect } = await setup();
            const manager = new ConstructableStylesCustomPropertyManager(
                new CSSStyleSheet()
            );

            await connect();

            element.cssCustomPropertyDefinitions.set("my-property", {
                name: "my-property",
                value: "value",
            });

            manager.subscribe(element);

            expect(
                window.getComputedStyle(element).getPropertyValue("--my-property")
            ).to.equal("value");

            await disconnect();
        });
    });
    describe("on un-subscription", () => {
        it("should set the owner to null if it is the only subscriber", async () => {
            const { element, connect, disconnect } = await setup();
            const manager = new ConstructableStylesCustomPropertyManager(
                new CSSStyleSheet()
            );

            await connect();

            manager.subscribe(element);
            manager.unsubscribe(element);

            expect(manager.owner).to.equal(null);

            await disconnect();
        });
        it("of the owner should set the owner to the subsequent subscriber", async () => {
            const { connect, disconnect, element, parent } = await setup();
            const b = element.cloneNode() as Client;
            const c = element.cloneNode() as Client;

            parent.appendChild(b);
            parent.appendChild(c);

            const manager = new ConstructableStylesCustomPropertyManager(
                new CSSStyleSheet()
            );

            await connect();

            manager.subscribe(element);
            manager.subscribe(b);
            manager.subscribe(c);

            manager.unsubscribe(element);

            expect(manager.owner).to.equal(b);

            await disconnect();
        });
        it("should remove all CSSCustomPropertyDefinition custom properties in the client", async () => {
            const { element, connect, disconnect } = await setup();
            const manager = new ConstructableStylesCustomPropertyManager(
                new CSSStyleSheet()
            );

            await connect();
            element.cssCustomPropertyDefinitions.set("my-property", {
                name: "my-property",
                value: "value",
            });

            manager.subscribe(element);
            manager.unsubscribe(element);

            expect(
                window.getComputedStyle(element).getPropertyValue("--my-property")
            ).to.equal("");

            await disconnect();
        });
    });
});

describe("StyleElementCustomPropertyManager", () => {
    it("should construct with a style element and client instance", async () => {
        const { element, connect, disconnect } = await setup();

        await connect();

        assert(
            new StyleElementCustomPropertyManager(
                document.createElement("style"),
                element
            )
        );

        await disconnect();
    });

    it("should not throw when constructed with a disconnected element", () => {
        const element = document.createElement("fast-client") as Client;

        expect(() => {
            new StyleElementCustomPropertyManager(
                document.createElement("style"),
                element
            );
        }).not.to.throw();
    });

    it("should queue and apply properties set prior to connection once connected", () => {
        const element = document.createElement("fast-client") as Client;

        element.cssCustomPropertyDefinitions.set("my-property", {
            name: "my-property",
            value: "value",
        });

        const client = new StyleElementCustomPropertyManager(
            document.createElement("style"),
            element
        );

        assert.equal(
            window.getComputedStyle(element).getPropertyValue("--my-property"),
            ""
        );

        document.body.appendChild(element);

        assert.equal(
            window.getComputedStyle(element).getPropertyValue("--my-property"),
            "value"
        );

        element.remove();
    });

    it("should connect the style element to the DOM during construction", async () => {
        const { element, connect, disconnect } = await setup();

        await connect();
        const style = document.createElement("style");

        const manager = new StyleElementCustomPropertyManager(style, element);

        assert(style.isConnected);
        assert(element.shadowRoot?.contains(style));

        await disconnect();
    });

    it("should evaluate and write the value of all CSSCustomPropertyDefinitions in the client  on construction", async () => {
        const { element, connect, disconnect } = await setup();

        element.cssCustomPropertyDefinitions.set("my-property", {
            name: "my-property",
            value: "value",
        });

        await connect();
        const style = document.createElement("style");
        const manager = new StyleElementCustomPropertyManager(style, element);

        assert.equal(
            window.getComputedStyle(element).getPropertyValue("--my-property"),
            "value"
        );

        await disconnect();
    });
});
