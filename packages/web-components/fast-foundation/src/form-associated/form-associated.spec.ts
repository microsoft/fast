import { FormAssociated } from "./form-associated";
import { assert, expect } from "chai";
import { fixture } from "../fixture";
import { customElement, FASTElement, html } from "@microsoft/fast-element";

const template = html`
    <slot></slot>
`;

@customElement({
    name: "test-element",
    template,
})
class TestElement extends FormAssociated(
    class extends FASTElement {
        proxy = document.createElement("input");

        constructor() {
            super();

            this.proxy.setAttribute("type", "text");
        }
    }
) {}

interface TestElement extends FormAssociated {}

@customElement({
    name: "custom-initial-value",
    template,
})
class CustomInitialValue extends FormAssociated(
    class extends FASTElement {
        proxy = document.createElement("input");

        constructor() {
            super();

            this.proxy.setAttribute("type", "text");
        }

        public initialValue: string = "foobar";
    }
) {}

interface CustomInitialValue extends FormAssociated {}

async function setup(el: string = "test-element") {
    const { connect, disconnect, element, parent } = await fixture<TestElement>(el);

    return { connect, disconnect, element, parent };
}

describe("FormAssociated:", () => {
    describe("construction and connection:", () => {
        it("should have an empty string value prior to connectedCallback", async () => {
            const { element } = await setup();

            expect(element.value).to.equal("");
        });

        it("should initialize to the initial value if no value property is set", async () => {
            const { connect, disconnect, element } = await setup();

            await connect();

            expect(element.value).to.equal(element.initialValue);

            await disconnect();
        });

        it("should initialize to the provided value ATTRIBUTE if set pre-connection", async () => {
            const { connect, disconnect, element } = await setup();

            element.setAttribute("value", "foobar");

            await connect();

            expect(element.value).to.equal("foobar");

            await disconnect();
        });

        it("should initialize to the provided value ATTRIBUTE if set post-connection", async () => {
            const { connect, disconnect, element } = await setup();

            await connect();

            element.setAttribute("value", "foobar");

            expect(element.value).to.equal("foobar");

            await disconnect();
        });

        it("should initialize to the provided value PROPERTY if set pre-connection", async () => {
            const { connect, disconnect, element } = await setup();

            element.value = "foobar";

            await connect();

            expect(element.value).to.equal("foobar");

            await disconnect();
        });

        it("should initialize to the provided value PROPERTY if set post-connection", async () => {
            const { connect, disconnect, element } = await setup();

            await connect();

            element.value = "foobar";

            expect(element.value).to.equal("foobar");

            await disconnect();
        });

        it("should initialize to the initial value when initial value is assigned by extending class", async () => {
            const { connect, disconnect, element } = await setup("custom-initial-value");

            await connect();

            expect(element.value).to.equal("foobar");

            await disconnect();
        });

        it("should communicate initial value to the parent form", async () => {
            const { connect, disconnect, element, parent } = await setup(
                "custom-initial-value"
            );

            element.setAttribute("name", "test");

            const form = document.createElement("form");
            form.appendChild(element);
            parent.appendChild(form);

            await connect();

            const formData = new FormData(form);

            expect(formData.get("test")).to.equal("foobar");

            await disconnect();
        });
    });

    describe("changes:", () => {
        it("setting value ATTRIBUTE should set value if value PROPERTY has not been explicitly set", async () => {
            const { connect, disconnect, element } = await setup();

            await connect();

            element.setAttribute("value", "foobar");

            expect(element.value).to.equal("foobar");

            element.setAttribute("value", "barbat");

            expect(element.value).to.equal("barbat");

            await disconnect();
        });

        it("setting value ATTRIBUTE should not set value if value PROPERTY has been explicitly set", async () => {
            const { connect, disconnect, element } = await setup();

            await connect();

            element.value = "foobar";

            expect(element.value).to.equal("foobar");

            element.setAttribute("value", "barbat");

            expect(element.value).to.equal("foobar");

            await disconnect();
        });

        it("setting value ATTRIBUTE should set parent form value if value PROPERTY has not been explicitly set", async () => {
            const { connect, disconnect, element, parent } = await setup();

            element.setAttribute("name", "test");

            const form = document.createElement("form");
            form.appendChild(element);
            parent.appendChild(form);

            await connect();

            let formData = new FormData(form);

            expect(formData.get("test")).to.equal("");

            element.setAttribute("value", "foobar");

            formData = new FormData(form);

            expect(formData.get("test")).to.equal("foobar");

            await disconnect();
        });

        it("setting value PROPERTY should set parent form value", async () => {
            const { connect, disconnect, element, parent } = await setup();
            element.setAttribute("name", "test");

            const form = document.createElement("form");
            form.appendChild(element);
            parent.appendChild(form);

            await connect();

            let formData = new FormData(form);

            expect(formData.get("test")).to.equal("");

            element.value = "foobar";

            formData = new FormData(form);

            expect(formData.get("test")).to.equal("foobar");

            await disconnect();
        });
    });

    describe("when the owning form's reset() method is invoked", () => {
        it("should reset it's value property to an empty string if no value attribute is set", async () => {
            const { connect, disconnect, element, parent } = await setup();

            const form = document.createElement("form");
            form.appendChild(element);
            parent.appendChild(form);

            await connect();

            element.value = "test-value";

            assert(element.getAttribute("value") === null);

            assert(element.value === "test-value");

            form.reset();

            assert(element.value === "");

            await disconnect();
        });

        it("should reset it's value property to the value of the value attribute if it is set", async () => {
            const { connect, disconnect, element, parent } = await setup();

            const form = document.createElement("form");
            form.appendChild(element);
            parent.appendChild(form);

            await connect();

            element.setAttribute("value", "attr-value");

            element.value = "test-value";

            assert(element.getAttribute("value") === "attr-value");

            assert(element.value === "test-value");

            form.reset();

            assert(element.value === "attr-value");

            await disconnect();
        });

        it("should put the control into a clean state, where value attribute changes change the property value prior to user or programmatic interaction", async () => {
            const { connect, disconnect, element, parent } = await setup();

            const form = document.createElement("form");
            form.appendChild(element);
            parent.appendChild(form);

            await connect();

            element.value = "test-value";

            element.setAttribute("value", "attr-value");

            assert(element.value === "test-value");

            form.reset();

            assert(element.value === "attr-value");

            element.setAttribute("value", "new-attr-value");

            assert(element.value === "new-attr-value");

            await disconnect();
        });
    });
});
