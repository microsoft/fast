import { expect } from "chai";
import { TextArea, TextAreaTemplate as template } from "./index";
import { fixture } from "../fixture";
import { customElement } from "@microsoft/fast-element";

@customElement({
    name: "fast-text-area",
    template,
})
class FASTTextArea extends TextArea {}

describe("TextArea", () => {
    it("should set the `autofocus` attribute on the internal control equal to the value provided", async () => {
        const { element, connect, disconnect } = await fixture<FASTTextArea>(
            "fast-text-area"
        );
        const autofocus = true;

        element.autofocus = autofocus;

        await connect();
        expect(
            element.shadowRoot?.querySelector(".control")?.hasAttribute("autofocus")
        ).to.equal(true);

        await disconnect();
    });

    it("should set the `disabled` attribute on the internal control equal to the value provided", async () => {
        const { element, connect, disconnect } = await fixture<FASTTextArea>(
            "fast-text-area"
        );
        const disabled = true;

        element.disabled = disabled;

        await connect();
        expect(
            element.shadowRoot?.querySelector(".control")?.hasAttribute("disabled")
        ).to.equal(true);

        await disconnect();
    });

    it("should set the `cols` attribute on the internal control equal to the value provided", async () => {
        const { element, connect, disconnect } = await fixture<FASTTextArea>(
            "fast-text-area"
        );
        const cols = 4;

        element.cols = cols;

        await connect();
        expect(
            element.shadowRoot?.querySelector(".control")?.getAttribute("cols")
        ).to.equal(cols.toString());

        await disconnect();
    });

    it("should set the `list` attribute on the internal control equal to the value provided", async () => {
        const { element, connect, disconnect } = await fixture<FASTTextArea>(
            "fast-text-area"
        );
        const list = "listId";

        element.list = list;

        await connect();
        expect(
            element.shadowRoot?.querySelector(".control")?.getAttribute("list")
        ).to.equal(list);

        await disconnect();
    });

    it("should set the `maxlength` attribute on the internal control equal to the value provided", async () => {
        const { element, connect, disconnect } = await fixture<FASTTextArea>(
            "fast-text-area"
        );
        const maxlength = 14;

        element.maxlength = maxlength;

        await connect();
        expect(
            element.shadowRoot?.querySelector(".control")?.getAttribute("maxlength")
        ).to.equal(maxlength.toString());

        await disconnect();
    });

    it("should set the `minlength` attribute on the internal control equal to the value provided", async () => {
        const { element, connect, disconnect } = await fixture<FASTTextArea>(
            "fast-text-area"
        );
        const minlength = 8;

        element.minlength = minlength;

        await connect();
        expect(
            element.shadowRoot?.querySelector(".control")?.getAttribute("minlength")
        ).to.equal(minlength.toString());

        await disconnect();
    });

    it("should set the `name` attribute on the internal control equal to the value provided", async () => {
        const { element, connect, disconnect } = await fixture<FASTTextArea>(
            "fast-text-area"
        );
        const name = "testName";

        element.name = name;

        await connect();
        expect(
            element.shadowRoot?.querySelector(".control")?.getAttribute("name")
        ).to.equal(name);

        await disconnect();
    });

    it("should set the `placeholder` attribute on the internal control equal to the value provided", async () => {
        const { element, connect, disconnect } = await fixture<FASTTextArea>(
            "fast-text-area"
        );
        const placeholder = "placeholder";

        element.placeholder = placeholder;

        await connect();
        expect(
            element.shadowRoot?.querySelector(".control")?.getAttribute("placeholder")
        ).to.equal(placeholder);

        await disconnect();
    });

    it("should set the `readonly` attribute on the internal control equal to the value provided", async () => {
        const { element, connect, disconnect } = await fixture<FASTTextArea>(
            "fast-text-area"
        );
        const readonly = true;

        element.readOnly = readonly;

        await connect();
        expect(
            element.shadowRoot?.querySelector(".control")?.hasAttribute("readonly")
        ).to.equal(true);

        await disconnect();
    });

    it("should set the `required` attribute on the internal control equal to the value provided", async () => {
        const { element, connect, disconnect } = await fixture<FASTTextArea>(
            "fast-text-area"
        );
        const required = true;

        element.required = required;

        await connect();
        expect(
            element.shadowRoot?.querySelector(".control")?.hasAttribute("required")
        ).to.equal(true);

        await disconnect();
    });

    it("should set the `rows` attribute on the internal control equal to the value provided", async () => {
        const { element, connect, disconnect } = await fixture<FASTTextArea>(
            "fast-text-area"
        );
        const rows = 4;

        element.rows = rows;

        await connect();
        expect(
            element.shadowRoot?.querySelector(".control")?.getAttribute("rows")
        ).to.equal(rows.toString());

        await disconnect();
    });

    it("should set the `spellcheck` attribute on the internal control equal to the value provided", async () => {
        const { element, connect, disconnect } = await fixture<FASTTextArea>(
            "fast-text-area"
        );
        const spellcheck = true;

        element.spellcheck = spellcheck;

        await connect();
        expect(
            element.shadowRoot?.querySelector(".control")?.hasAttribute("spellcheck")
        ).to.equal(true);

        await disconnect();
    });

    describe("Delegates ARIA textbox", () => {
        it("should set the `aria-atomic` attribute on the internal control when provided", async () => {
            const { element, connect, disconnect } = await fixture<FASTTextArea>(
                "fast-text-area"
            );
            const ariaAtomic = "true";

            element.ariaAtomic = ariaAtomic;

            await connect();

            expect(
                element.shadowRoot?.querySelector(".control")?.getAttribute("aria-atomic")
            ).to.equal(ariaAtomic);

            await disconnect();
        });

        it("should set the `aria-busy` attribute on the internal control when provided", async () => {
            const { element, connect, disconnect } = await fixture<FASTTextArea>(
                "fast-text-area"
            );
            const ariaBusy = "false";

            element.ariaBusy = ariaBusy;

            await connect();

            expect(
                element.shadowRoot?.querySelector(".control")?.getAttribute("aria-busy")
            ).to.equal(ariaBusy);

            await disconnect();
        });

        it("should set the `aria-controls` attribute on the internal control when provided", async () => {
            const { element, connect, disconnect } = await fixture<FASTTextArea>(
                "fast-text-area"
            );
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
            const { element, connect, disconnect } = await fixture<FASTTextArea>(
                "fast-text-area"
            );
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
            const { element, connect, disconnect } = await fixture<FASTTextArea>(
                "fast-text-area"
            );
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
            const { element, connect, disconnect } = await fixture<FASTTextArea>(
                "fast-text-area"
            );
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
            const { element, connect, disconnect } = await fixture<FASTTextArea>(
                "fast-text-area"
            );
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
            const { element, connect, disconnect } = await fixture<FASTTextArea>(
                "fast-text-area"
            );
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
            const { element, connect, disconnect } = await fixture<FASTTextArea>(
                "fast-text-area"
            );
            const ariaFlowto = "testId";

            element.ariaFlowto = ariaFlowto;

            await connect();

            expect(
                element.shadowRoot?.querySelector(".control")?.getAttribute("aria-flowto")
            ).to.equal(ariaFlowto);

            await disconnect();
        });

        it("should set the `aria-haspopup` attribute on the internal control when provided", async () => {
            const { element, connect, disconnect } = await fixture<FASTTextArea>(
                "fast-text-area"
            );
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
            const { element, connect, disconnect } = await fixture<FASTTextArea>(
                "fast-text-area"
            );
            const ariaHidden = "true";

            element.ariaHidden = ariaHidden;

            await connect();

            expect(
                element.shadowRoot?.querySelector(".control")?.getAttribute("aria-hidden")
            ).to.equal(ariaHidden);

            await disconnect();
        });

        it("should set the `aria-invalid` attribute on the internal control when provided", async () => {
            const { element, connect, disconnect } = await fixture<FASTTextArea>(
                "fast-text-area"
            );
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
            const { element, connect, disconnect } = await fixture<FASTTextArea>(
                "fast-text-area"
            );
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
            const { element, connect, disconnect } = await fixture<FASTTextArea>(
                "fast-text-area"
            );
            const ariaLabel = "Foo label";

            element.ariaLabel = ariaLabel;

            await connect();

            expect(
                element.shadowRoot?.querySelector(".control")?.getAttribute("aria-label")
            ).to.equal(ariaLabel);

            await disconnect();
        });

        it("should set the `aria-labelledby` attribute on the internal control when provided", async () => {
            const { element, connect, disconnect } = await fixture<FASTTextArea>(
                "fast-text-area"
            );
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
            const { element, connect, disconnect } = await fixture<FASTTextArea>(
                "fast-text-area"
            );
            const ariaLive = "polite";

            element.ariaLive = ariaLive;

            await connect();

            expect(
                element.shadowRoot?.querySelector(".control")?.getAttribute("aria-live")
            ).to.equal(ariaLive);

            await disconnect();
        });

        it("should set the `aria-owns` attribute on the internal control when provided", async () => {
            const { element, connect, disconnect } = await fixture<FASTTextArea>(
                "fast-text-area"
            );
            const ariaOwns = "testId";

            element.ariaOwns = ariaOwns;

            await connect();

            expect(
                element.shadowRoot?.querySelector(".control")?.getAttribute("aria-owns")
            ).to.equal(ariaOwns);

            await disconnect();
        });

        it("should set the `aria-relevant` attribute on the internal control when provided", async () => {
            const { element, connect, disconnect } = await fixture<FASTTextArea>(
                "fast-text-area"
            );
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
            const { element, connect, disconnect } = await fixture<FASTTextArea>(
                "fast-text-area"
            );
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
            const { element, connect, disconnect } = await fixture<FASTTextArea>(
                "fast-text-area"
            );
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
});
