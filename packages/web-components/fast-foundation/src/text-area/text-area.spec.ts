import { expect, assert } from "chai";
import { TextArea, textAreaTemplate as template } from "./index";
import { fixture } from "../test-utilities/fixture";

const FASTTextArea = TextArea.compose({
    baseName: "text-area",
    template,
})

async function setup() {
    const { element, connect, disconnect, parent } = await fixture(FASTTextArea());

    return { element, connect, disconnect, parent };
}

describe("TextArea", () => {
    it("should set the `autofocus` attribute on the internal control equal to the value provided", async () => {
        const { element, connect, disconnect } = await setup();
        const autofocus = true;

        element.autofocus = autofocus;

        await connect();
        expect(
            element.shadowRoot?.querySelector(".control")?.hasAttribute("autofocus")
        ).to.equal(true);

        await disconnect();
    });

    it("should set the `disabled` attribute on the internal control equal to the value provided", async () => {
        const { element, connect, disconnect } = await setup();
        const disabled = true;

        element.disabled = disabled;

        await connect();
        expect(
            element.shadowRoot?.querySelector(".control")?.hasAttribute("disabled")
        ).to.equal(true);

        await disconnect();
    });

    it("should set the `cols` attribute on the internal control equal to the value provided", async () => {
        const { element, connect, disconnect } = await setup();
        const cols = 4;

        element.cols = cols;

        await connect();
        expect(
            element.shadowRoot?.querySelector(".control")?.getAttribute("cols")
        ).to.equal(cols.toString());

        await disconnect();
    });

    it("should set the `list` attribute on the internal control equal to the value provided", async () => {
        const { element, connect, disconnect } = await setup();
        const list = "listId";

        element.list = list;

        await connect();
        expect(
            element.shadowRoot?.querySelector(".control")?.getAttribute("list")
        ).to.equal(list);

        await disconnect();
    });

    it("should set the `maxlength` attribute on the internal control equal to the value provided", async () => {
        const { element, connect, disconnect } = await setup();
        const maxlength = 14;

        element.maxlength = maxlength;

        await connect();
        expect(
            element.shadowRoot?.querySelector(".control")?.getAttribute("maxlength")
        ).to.equal(maxlength.toString());

        await disconnect();
    });

    it("should set the `minlength` attribute on the internal control equal to the value provided", async () => {
        const { element, connect, disconnect } = await setup();
        const minlength = 8;

        element.minlength = minlength;

        await connect();
        expect(
            element.shadowRoot?.querySelector(".control")?.getAttribute("minlength")
        ).to.equal(minlength.toString());

        await disconnect();
    });

    it("should set the `name` attribute on the internal control equal to the value provided", async () => {
        const { element, connect, disconnect } = await setup();
        const name = "testName";

        element.name = name;

        await connect();
        expect(
            element.shadowRoot?.querySelector(".control")?.getAttribute("name")
        ).to.equal(name);

        await disconnect();
    });

    it("should set the `placeholder` attribute on the internal control equal to the value provided", async () => {
        const { element, connect, disconnect } = await setup();
        const placeholder = "placeholder";

        element.placeholder = placeholder;

        await connect();
        expect(
            element.shadowRoot?.querySelector(".control")?.getAttribute("placeholder")
        ).to.equal(placeholder);

        await disconnect();
    });

    it("should set the `readonly` attribute on the internal control equal to the value provided", async () => {
        const { element, connect, disconnect } = await setup();
        const readonly = true;

        element.readOnly = readonly;

        await connect();
        expect(
            element.shadowRoot?.querySelector(".control")?.hasAttribute("readonly")
        ).to.equal(true);

        await disconnect();
    });

    it("should set the `required` attribute on the internal control equal to the value provided", async () => {
        const { element, connect, disconnect } = await setup();
        const required = true;

        element.required = required;

        await connect();
        expect(
            element.shadowRoot?.querySelector(".control")?.hasAttribute("required")
        ).to.equal(true);

        await disconnect();
    });

    it("should set the `rows` attribute on the internal control equal to the value provided", async () => {
        const { element, connect, disconnect } = await setup();
        const rows = 4;

        element.rows = rows;

        await connect();
        expect(
            element.shadowRoot?.querySelector(".control")?.getAttribute("rows")
        ).to.equal(rows.toString());

        await disconnect();
    });

    it("should set the `spellcheck` attribute on the internal control equal to the value provided", async () => {
        const { element, connect, disconnect } = await setup();
        const spellcheck = true;

        element.spellcheck = spellcheck;

        await connect();
        expect(
            element.shadowRoot?.querySelector(".control")?.hasAttribute("spellcheck")
        ).to.equal(true);

        await disconnect();
    });

    it("should initialize to the initial value if no value property is set", async () => {
        const { element, connect, disconnect } = await setup();

        await connect();
        expect(element.value).to.equal(element["initialValue"]);

        await disconnect();
    });

    it("should initialize to the provided value attribute if set pre-connection", async () => {
        const { element, connect, disconnect } = await setup();

        element.setAttribute("value", "foobar");
        await connect();

        expect(element.value).to.equal("foobar");

        await disconnect();
    });

    it("should initialize to the provided value attribute if set post-connection", async () => {
        const { element, connect, disconnect } = await setup();

        await connect();
        element.setAttribute("value", "foobar");

        expect(element.value).to.equal("foobar");

        await disconnect();
    });

    it("should initialize to the provided value property if set pre-connection", async () => {
        const { element, connect, disconnect } = await setup();
        element.value = "foobar";
        await connect();

        expect(element.value).to.equal("foobar");

        await disconnect();
    });

    describe("Delegates ARIA textbox", () => {
        it("should set the `aria-atomic` attribute on the internal control when provided", async () => {
            const { element, connect, disconnect } = await setup();
            const ariaAtomic = "true";

            element.ariaAtomic = ariaAtomic;

            await connect();

            expect(
                element.shadowRoot?.querySelector(".control")?.getAttribute("aria-atomic")
            ).to.equal(ariaAtomic);

            await disconnect();
        });

        it("should set the `aria-busy` attribute on the internal control when provided", async () => {
            const { element, connect, disconnect } = await setup();
            const ariaBusy = "false";

            element.ariaBusy = ariaBusy;

            await connect();

            expect(
                element.shadowRoot?.querySelector(".control")?.getAttribute("aria-busy")
            ).to.equal(ariaBusy);

            await disconnect();
        });

        it("should set the `aria-controls` attribute on the internal control when provided", async () => {
            const { element, connect, disconnect } = await setup();
            const ariaControls = "testId";

            element.ariaControls = ariaControls;

            await connect();

            expect(
                element.shadowRoot
                    ?.querySelector(".control")
                    ?.getAttribute("aria-controls")
            ).to.equal(ariaControls);

            await disconnect();
        });

        it("should set the `aria-current` attribute on the internal control when provided", async () => {
            const { element, connect, disconnect } = await setup();
            const ariaCurrent = "page";

            element.ariaCurrent = ariaCurrent;

            await connect();

            expect(
                element.shadowRoot
                    ?.querySelector(".control")
                    ?.getAttribute("aria-current")
            ).to.equal(ariaCurrent);

            await disconnect();
        });

        it("should set the `aria-describedBy` attribute on the internal control when provided", async () => {
            const { element, connect, disconnect } = await setup();
            const ariaDescribedby = "testId";

            element.ariaDescribedby = ariaDescribedby;

            await connect();

            expect(
                element.shadowRoot
                    ?.querySelector(".control")
                    ?.getAttribute("aria-describedBy")
            ).to.equal(ariaDescribedby);

            await disconnect();
        });

        it("should set the `aria-details` attribute on the internal control when provided", async () => {
            const { element, connect, disconnect } = await setup();
            const ariaDetails = "testId";

            element.ariaDetails = ariaDetails;

            await connect();

            expect(
                element.shadowRoot
                    ?.querySelector(".control")
                    ?.getAttribute("aria-details")
            ).to.equal(ariaDetails);

            await disconnect();
        });

        it("should set the `aria-disabled` attribute on the internal control when provided", async () => {
            const { element, connect, disconnect } = await setup();
            const ariaDisabled = "true";

            element.ariaDisabled = ariaDisabled;

            await connect();

            expect(
                element.shadowRoot
                    ?.querySelector(".control")
                    ?.getAttribute("aria-disabled")
            ).to.equal(ariaDisabled);

            await disconnect();
        });

        it("should set the `aria-errormessage` attribute on the internal control when provided", async () => {
            const { element, connect, disconnect } = await setup();
            const ariaErrormessage = "test";

            element.ariaErrormessage = ariaErrormessage;

            await connect();

            expect(
                element.shadowRoot
                    ?.querySelector(".control")
                    ?.getAttribute("aria-errormessage")
            ).to.equal(ariaErrormessage);

            await disconnect();
        });

        it("should set the `aria-flowto` attribute on the internal control when provided", async () => {
            const { element, connect, disconnect } = await setup();
            const ariaFlowto = "testId";

            element.ariaFlowto = ariaFlowto;

            await connect();

            expect(
                element.shadowRoot?.querySelector(".control")?.getAttribute("aria-flowto")
            ).to.equal(ariaFlowto);

            await disconnect();
        });

        it("should set the `aria-haspopup` attribute on the internal control when provided", async () => {
            const { element, connect, disconnect } = await setup();
            const ariaHaspopup = "true";

            element.ariaHaspopup = ariaHaspopup;

            await connect();

            expect(
                element.shadowRoot
                    ?.querySelector(".control")
                    ?.getAttribute("aria-haspopup")
            ).to.equal(ariaHaspopup);

            await disconnect();
        });

        it("should set the `aria-hidden` attribute on the internal control when provided", async () => {
            const { element, connect, disconnect } = await setup();
            const ariaHidden = "true";

            element.ariaHidden = ariaHidden;

            await connect();

            expect(
                element.shadowRoot?.querySelector(".control")?.getAttribute("aria-hidden")
            ).to.equal(ariaHidden);

            await disconnect();
        });

        it("should set the `aria-invalid` attribute on the internal control when provided", async () => {
            const { element, connect, disconnect } = await setup();
            const ariaInvalid = "spelling";

            element.ariaInvalid = ariaInvalid;

            await connect();

            expect(
                element.shadowRoot
                    ?.querySelector(".control")
                    ?.getAttribute("aria-invalid")
            ).to.equal(ariaInvalid);

            await disconnect();
        });

        it("should set the `aria-keyshortcuts` attribute on the internal control when provided", async () => {
            const { element, connect, disconnect } = await setup();
            const ariaKeyshortcuts = "F4";

            element.ariaKeyshortcuts = ariaKeyshortcuts;

            await connect();

            expect(
                element.shadowRoot
                    ?.querySelector(".control")
                    ?.getAttribute("aria-keyshortcuts")
            ).to.equal(ariaKeyshortcuts);

            await disconnect();
        });

        it("should set the `aria-label` attribute on the internal control when provided", async () => {
            const { element, connect, disconnect } = await setup();
            const ariaLabel = "Foo label";

            element.ariaLabel = ariaLabel;

            await connect();

            expect(
                element.shadowRoot?.querySelector(".control")?.getAttribute("aria-label")
            ).to.equal(ariaLabel);

            await disconnect();
        });

        it("should set the `aria-labelledby` attribute on the internal control when provided", async () => {
            const { element, connect, disconnect } = await setup();
            const ariaLabelledby = "testId";

            element.ariaLabelledby = ariaLabelledby;

            await connect();

            expect(
                element.shadowRoot
                    ?.querySelector(".control")
                    ?.getAttribute("aria-labelledby")
            ).to.equal(ariaLabelledby);

            await disconnect();
        });

        it("should set the `aria-live` attribute on the internal control when provided", async () => {
            const { element, connect, disconnect } = await setup();
            const ariaLive = "polite";

            element.ariaLive = ariaLive;

            await connect();

            expect(
                element.shadowRoot?.querySelector(".control")?.getAttribute("aria-live")
            ).to.equal(ariaLive);

            await disconnect();
        });

        it("should set the `aria-owns` attribute on the internal control when provided", async () => {
            const { element, connect, disconnect } = await setup();
            const ariaOwns = "testId";

            element.ariaOwns = ariaOwns;

            await connect();

            expect(
                element.shadowRoot?.querySelector(".control")?.getAttribute("aria-owns")
            ).to.equal(ariaOwns);

            await disconnect();
        });

        it("should set the `aria-relevant` attribute on the internal control when provided", async () => {
            const { element, connect, disconnect } = await setup();
            const ariaRelevant = "removals";

            element.ariaRelevant = ariaRelevant;

            await connect();

            expect(
                element.shadowRoot
                    ?.querySelector(".control")
                    ?.getAttribute("aria-relevant")
            ).to.equal(ariaRelevant);

            await disconnect();
        });

        it("should set the `aria-roledescription` attribute on the internal control when provided", async () => {
            const { element, connect, disconnect } = await setup();
            const ariaRoledescription = "slide";

            element.ariaRoledescription = ariaRoledescription;

            await connect();

            expect(
                element.shadowRoot
                    ?.querySelector(".control")
                    ?.getAttribute("aria-roledescription")
            ).to.equal(ariaRoledescription);

            await disconnect();
        });
    });

    describe("events", () => {
        it("should fire a change event the internal control emits a change event", async () => {
            const { element, connect, disconnect } = await setup();
            const event = new Event("change", {
                key: "a",
            } as KeyboardEventInit);
            let wasChanged: boolean = false;

            await connect();

            element.addEventListener("change", e => {
                e.preventDefault();

                wasChanged = true;
            });

            let textarea = element.shadowRoot?.querySelector("textarea");
            textarea?.dispatchEvent(event);

            expect(wasChanged).to.equal(true);

            await disconnect();
        });
    });

    describe("when the owning form's reset() method is invoked", () => {
        it("should reset it's value property to an empty string if no value attribute is set", async () => {
            const { element, connect, disconnect, parent } = await setup();

            await connect();

            const form = document.createElement("form");
            form.appendChild(element);
            parent.appendChild(form);

            element.value = "test-value";

            assert(element.getAttribute("value") === null);
            assert(element.value === "test-value");

            form.reset();

            assert(element.value === "");

            await disconnect();
        });

        it("should reset it's value property to the value of the value attribute if it is set", async () => {
            const { element, connect, disconnect, parent } = await setup();

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
            const { element, connect, disconnect, parent } = await setup();

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
