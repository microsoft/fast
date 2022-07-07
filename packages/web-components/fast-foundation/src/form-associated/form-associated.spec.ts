import { FormAssociated, CheckableFormAssociated } from "./form-associated.js";
import { assert, expect } from "chai";
import { fixture } from "@microsoft/fast-element/testing";
import { customElement, FASTElement, html, Updates } from "@microsoft/fast-element";

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

async function setup<T = TestElement>(el: string = "test-element") {
    const { connect, disconnect, element, parent } = await fixture<T>(el);

    return { connect, disconnect, element, parent };
}

@customElement({
    name: "checkable-form-associated",
    template,
})
class Checkable extends CheckableFormAssociated(
    class extends FASTElement {
        proxy = document.createElement("input");

        constructor() {
            super();

            this.proxy.setAttribute("type", "checkbox");
        }
    }
) {}

interface Checkable extends CheckableFormAssociated {}
describe("FormAssociated:", () => {
    describe("construction and connection:", () => {
        it("should have an empty string value prior to connectedCallback", async () => {
            const { element } = await setup();

            expect(element.value).to.equal("");
            expect(element.currentValue).to.equal(element.value);
        });

        it("should initialize to the initial value if no value property is set", async () => {
            const { connect, disconnect, element } = await setup();

            await connect();

            expect(element.value).to.equal(element.initialValue);
            expect(element.currentValue).to.equal(element.value);

            await disconnect();
        });

        it("should initialize to the provided value ATTRIBUTE if set pre-connection", async () => {
            const { connect, disconnect, element } = await setup();

            element.setAttribute("value", "foobar");

            await connect();

            expect(element.value).to.equal("foobar");
            expect(element.currentValue).to.equal(element.value);

            await disconnect();
        });

        it("should initialize to the provided value ATTRIBUTE if set post-connection", async () => {
            const { connect, disconnect, element } = await setup();

            await connect();

            element.setAttribute("value", "foobar");

            expect(element.value).to.equal("foobar");
            expect(element.currentValue).to.equal(element.value);

            await disconnect();
        });

        it("should initialize to the provided value PROPERTY if set pre-connection", async () => {
            const { connect, disconnect, element } = await setup();

            element.value = "foobar";

            await connect();

            expect(element.value).to.equal("foobar");
            expect(element.currentValue).to.equal(element.value);

            await disconnect();
        });

        it("should initialize to the provided value PROPERTY if set post-connection", async () => {
            const { connect, disconnect, element } = await setup();

            await connect();

            element.value = "foobar";

            expect(element.value).to.equal("foobar");
            expect(element.currentValue).to.equal(element.value);

            await disconnect();
        });

        it("should initialize to the initial value when initial value is assigned by extending class", async () => {
            const { connect, disconnect, element } = await setup("custom-initial-value");

            await connect();

            expect(element.value).to.equal("foobar");
            expect(element.currentValue).to.equal(element.value);

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
            expect(element.currentValue).to.equal(element.value);

            element.setAttribute("value", "barbat");

            expect(element.value).to.equal("barbat");
            expect(element.currentValue).to.equal(element.value);

            await disconnect();
        });

        it("setting value ATTRIBUTE should not set value if value PROPERTY has been explicitly set", async () => {
            const { connect, disconnect, element } = await setup();

            await connect();

            element.value = "foobar";

            expect(element.value).to.equal("foobar");
            expect(element.currentValue).to.equal(element.value);

            element.setAttribute("value", "barbat");

            expect(element.value).to.equal("foobar");
            expect(element.currentValue).to.equal(element.value);

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

        it("assigning the currentValue property should set the controls value property to the same value", async () => {
            const { connect, disconnect, element } = await setup();

            await connect();

            expect(element.value).to.equal("");
            expect(element.currentValue).to.equal(element.value);

            element.currentValue = "foobar";

            expect(element.value).to.equal("foobar");
            expect(element.currentValue).to.equal(element.value);

            await disconnect();
        });

        it("setting the current-value property should set the controls value property to the same value", async () => {
            const { connect, disconnect, element } = await setup();

            await connect();

            expect(element.value).to.equal("");
            expect(element.currentValue).to.equal(element.value);

            element.setAttribute('current-value', "foobar")

            expect(element.value).to.equal("foobar");
            expect(element.currentValue).to.equal(element.value);

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
            expect(element.currentValue).to.equal(element.value);

            form.reset();

            assert((element as TestElement).value === "");
            expect(element.currentValue).to.equal(element.value);

            await disconnect();
        });

        it("should reset it's value property to the value of the value attribute if it is set", async () => {
            const { connect, disconnect, element, parent } = await setup();

            const form = document.createElement("form");
            form.appendChild(element);
            parent.appendChild(form);

            await connect();

            element.setAttribute("value", "attr-value");
            expect(element.currentValue).to.equal(element.value);

            element.value = "test-value";

            assert(element.getAttribute("value") === "attr-value");
            assert(element.value === "test-value");
            expect(element.currentValue).to.equal(element.value);

            form.reset();

            assert((element as TestElement).value === "attr-value");
            expect(element.currentValue).to.equal(element.value);

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
            expect(element.currentValue).to.equal(element.value);

            form.reset();

            assert((element as TestElement).value === "attr-value");
            expect(element.currentValue).to.equal(element.value);

            element.setAttribute("value", "new-attr-value");

            assert((element as TestElement).value === "new-attr-value");
            expect(element.currentValue).to.equal(element.value);

            await disconnect();
        });
    });
});

describe("CheckableFormAssociated:", () => {
    function assertChecked(element: Checkable) {
        return (value: boolean) => {
            expect(element.checked, `checked property is ${value}`).to.equal(value);
            expect(element.currentChecked, `currentChecked property is ${value}`).to.equal(value);
            expect(element.getAttribute("current-checked"), `current-checked attribute is ${value}`).to.equal(`${value}`);
        }
    }
    it("should have a 'checked' property that is initialized to false", async () => {
        const { connect, element } = await setup<Checkable>("checkable-form-associated");

        await connect();
        await Updates.next();

        assertChecked(element)(false);
    });
    it("should align the `currentChecked` property and `current-checked` attribute with `checked` property changes", async () => {
        const { connect, element } = await setup<Checkable>("checkable-form-associated");

        await connect();
        await Updates.next();
        const test = assertChecked(element);

        test(false);

        element.checked = true;

        await Updates.next();
        test(true);

        element.checked = false;
        await Updates.next();
        test(false)
    });
    it("should align the `checked` property and `current-checked` attribute with `currentChecked` property changes", async () => {
        const { connect, element } = await setup<Checkable>("checkable-form-associated");

        await connect();
        await Updates.next();
        const test = assertChecked(element);

        test(false);

        element.setAttribute("current-checked", "true");

        await Updates.next();
        test(true);

        element.setAttribute("current-checked", "false");
        await Updates.next();
        test(false)
    });
});
