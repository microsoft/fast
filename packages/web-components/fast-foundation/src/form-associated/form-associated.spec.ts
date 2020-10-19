import { FormAssociated } from "./form-associated";
import { expect } from "chai";
import { customElement, html, DOM } from "@microsoft/fast-element";
import { classNames } from "@microsoft/fast-web-utilities";

@customElement({
    name: "test-element",
    template: html`
        <slot></slot>
    `,
})
class TestElement extends FormAssociated<HTMLInputElement> {
    protected proxy = document.createElement("input");

    constructor() {
        super();

        this.proxy.setAttribute("type", "text");
    }
}

@customElement({
    name: "custom-initial-value",
    template: html`
        <slot></slot>
    `,
})
class CustomInitialValue extends FormAssociated<HTMLInputElement> {
    protected proxy = document.createElement("input");

    constructor() {
        super();

        this.proxy.setAttribute("type", "text");
    }

    protected initialValue: string = "foobar";
}

describe("The value property:", () => {
    describe("construction and connection:", () => {
        it("should have an undefined value prior to connectedCallback", () => {
            const el: TestElement = document.createElement("test-element") as TestElement;
            expect(el.value).to.equal(undefined);
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
});
