import { FormAssociated } from "./form-associated";
import { assert, expect } from "chai";
import { customElement, FASTElement, html } from "@microsoft/fast-element";

@customElement({
    name: "test-element",
    template: html`
        <slot></slot>
    `,
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
    template: html`
        <slot></slot>
    `,
})
class CustomInitialValue extends FormAssociated(
    class extends FASTElement {
        proxy = document.createElement("input");

        constructor() {
            super();

            this.proxy.setAttribute("type", "text");
        }

        protected initialValue: string = "foobar";
    }
) {}

interface CustomInitialValue extends FormAssociated {}

describe("FormAssociated:", () => {
    describe("construction and connection:", () => {
        it("should have an empty string value prior to connectedCallback", () => {
            const el: TestElement = document.createElement("test-element") as TestElement;
            expect(el.value).to.equal("");
        });

        it("should initialize to the initial value if no value property is set", () => {
            const el: TestElement = document.createElement("test-element") as TestElement;
            document.body.appendChild(el);

            expect(el.value).to.equal(el["initialValue"]);

            document.body.removeChild(el);
        });

        it("should initialize to the provided value attribute if set pre-connection", () => {
            const el: TestElement = document.createElement("test-element") as TestElement;
            el.setAttribute("value", "foobar");
            document.body.appendChild(el);

            expect(el.value).to.equal("foobar");

            document.body.removeChild(el);
        });

        it("should initialize to the provided value attribute if set post-connection", () => {
            const el: TestElement = document.createElement("test-element") as TestElement;
            document.body.appendChild(el);
            el.setAttribute("value", "foobar");

            expect(el.value).to.equal("foobar");

            document.body.removeChild(el);
        });

        it("should initialize to the provided value property if set pre-connection", () => {
            const el: TestElement = document.createElement("test-element") as TestElement;
            el.value = "foobar";
            document.body.appendChild(el);

            expect(el.value).to.equal("foobar");

            document.body.removeChild(el);
        });

        it("should initialize to the provided value property if set post-connection", () => {
            const el: TestElement = document.createElement("test-element") as TestElement;
            document.body.appendChild(el);
            el.value = "foobar";

            expect(el.value).to.equal("foobar");

            document.body.removeChild(el);
        });

        it("should initialize to the initial value when initial value is assigned by extending class", () => {
            const el: CustomInitialValue = document.createElement(
                "custom-initial-value"
            ) as CustomInitialValue;
            document.body.appendChild(el);

            expect(el.value).to.equal("foobar");

            document.body.removeChild(el);
        });

        it("should communicate initial value to the parent form", () => {
            const el: CustomInitialValue = document.createElement(
                "custom-initial-value"
            ) as CustomInitialValue;
            el.setAttribute("name", "test");
            const form: HTMLFormElement = document.createElement("form");
            form.appendChild(el);
            document.body.appendChild(form);
            const formData = new FormData(form);

            expect(formData.get("test")).to.equal("foobar");

            document.body.removeChild(form);
        });
    });

    describe("changes:", () => {
        it("setting value attribute should set value if value property has not been explicitly set", () => {
            const el: TestElement = document.createElement("test-element") as TestElement;
            document.body.appendChild(el);

            el.setAttribute("value", "foobar");
            expect(el.value).to.equal("foobar");

            el.setAttribute("value", "barbat");
            expect(el.value).to.equal("barbat");

            document.body.removeChild(el);
        });

        it("setting value attribute should not set value if value property has been explicitly set", () => {
            const el: TestElement = document.createElement("test-element") as TestElement;
            document.body.appendChild(el);

            el.value = "foobar";
            expect(el.value).to.equal("foobar");

            el.setAttribute("value", "barbat");
            expect(el.value).to.equal("foobar");

            document.body.removeChild(el);
        });

        it("setting value attribute should set parent form value if value property has not been explicitly set", () => {
            const el: TestElement = document.createElement("test-element") as TestElement;
            el.setAttribute("name", "test");

            const form: HTMLFormElement = document.createElement("form");
            form.appendChild(el);
            document.body.appendChild(form);

            let formData = new FormData(form);
            expect(formData.get("test")).to.equal("");

            el.setAttribute("value", "foobar");
            formData = new FormData(form);
            expect(formData.get("test")).to.equal("foobar");

            document.body.removeChild(form);
        });

        it("setting value property should set parent form value", () => {
            const el: TestElement = document.createElement("test-element") as TestElement;
            el.setAttribute("name", "test");

            const form: HTMLFormElement = document.createElement("form");
            form.appendChild(el);
            document.body.appendChild(form);

            let formData = new FormData(form);
            expect(formData.get("test")).to.equal("");

            el.value = "foobar";
            formData = new FormData(form);
            expect(formData.get("test")).to.equal("foobar");

            document.body.removeChild(form);
        });
    });

    describe("when the owning form's reset() method is invoked", () => {
        it("should reset it's value property to an empty string if no value attribute is set", () => {
            const element = document.createElement("test-element") as TestElement;
            const form = document.createElement("form");
            form.appendChild(element);
            document.body.appendChild(form);
            element.value = "test-value";

            assert(element.getAttribute("value") === null);
            assert(element.value === "test-value");

            form.reset();

            assert(element.value === "");
        });

        it("should reset it's value property to the value of the value attribute if it is set", () => {
            const element = document.createElement("test-element") as TestElement;
            const form = document.createElement("form");
            form.appendChild(element);
            document.body.appendChild(form);
            element.setAttribute("value", "attr-value");
            element.value = "test-value";

            assert(element.getAttribute("value") === "attr-value");
            assert(element.value === "test-value");

            form.reset();

            assert(element.value === "attr-value");
        });

        it("should put the control into a clean state, where value attribute changes change the property value prior to user or programmatic interaction", () => {
            const element = document.createElement("test-element") as TestElement;
            const form = document.createElement("form");
            form.appendChild(element);
            document.body.appendChild(form);
            element.value = "test-value";
            element.setAttribute("value", "attr-value");

            assert(element.value === "test-value");

            form.reset();

            assert(element.value === "attr-value");

            element.setAttribute("value", "new-attr-value");

            assert(element.value === "new-attr-value");
        });
    });
});
