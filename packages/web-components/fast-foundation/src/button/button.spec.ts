import { expect } from "chai";
import { Updates } from "@microsoft/fast-element";
import { fixture, uniqueElementName } from "@microsoft/fast-element/testing";
import { FASTButton, buttonTemplate } from "./index.js";
import { eventClick } from "@microsoft/fast-web-utilities";

const buttonName = uniqueElementName();
FASTButton.define({
    name: buttonName,
    template: buttonTemplate()
});

async function setup() {
    const { connect, disconnect, element, parent } = await fixture<FASTButton>(buttonName);

    return { connect, disconnect, element, parent };
}

describe("Button", () => {
    it("should set the `autofocus` attribute on the internal button when provided", async () => {
        const { element, connect, disconnect } = await setup();

        element.autofocus = true;

        await connect();

        expect(
            element.shadowRoot?.querySelector("button")?.hasAttribute("autofocus")
        ).to.equal(true);

        await disconnect();
    });

    it("should set the `disabled` attribute on the internal button when provided", async () => {
        const { element, connect, disconnect } = await setup();

        element.disabled = true;

        await connect();

        expect(
            element.shadowRoot?.querySelector("button")?.hasAttribute("disabled")
        ).to.equal(true);

        await disconnect();
    });

    it("should set the `form` attribute on the internal button when `formId` is provided", async () => {
        const { element, connect, disconnect } = await setup();
        const formId: string = "testId";

        element.formId = "testId";

        await connect();

        expect(
            element.shadowRoot?.querySelector("button")?.getAttribute("form")
        ).to.equal(formId);

        await disconnect();
    });

    it("should set the `formaction` attribute on the internal button when provided", async () => {
        const { element, connect, disconnect } = await setup();
        const formaction: string = "test_action.asp";

        element.formaction = formaction;

        await connect();

        expect(
            element.shadowRoot?.querySelector("button")?.getAttribute("formaction")
        ).to.equal(formaction);

        await disconnect();
    });

    it("should set the `formenctype` attribute on the internal button when provided", async () => {
        const { element, connect, disconnect } = await setup();
        const formenctype: string = "text/plain";

        element.formenctype = formenctype;

        await connect();

        expect(
            element.shadowRoot?.querySelector("button")?.getAttribute("formenctype")
        ).to.equal(formenctype);

        await disconnect();
    });

    it("should set the `formmethod` attribute on the internal button when provided", async () => {
        const { element, connect, disconnect } = await setup();
        const formmethod: string = "post";

        element.formmethod = formmethod;

        await connect();

        expect(
            element.shadowRoot?.querySelector("button")?.getAttribute("formmethod")
        ).to.equal(formmethod);

        await disconnect();
    });

    it("should set the `formnovalidate` attribute on the internal button when provided", async () => {
        const { element, connect, disconnect } = await setup();
        const formnovalidate: boolean = true;

        element.formnovalidate = formnovalidate;

        await connect();

        expect(
            element.shadowRoot?.querySelector("button")?.getAttribute("formnovalidate")
        ).to.equal(formnovalidate.toString());

        await disconnect();
    });

    it("should set the `formtarget` attribute on the internal button when provided", async () => {
        const { element, connect, disconnect } = await setup();
        const formtarget = "_blank";

        element.formtarget = formtarget;

        await connect();

        expect(
            element.shadowRoot?.querySelector("button")?.getAttribute("formtarget")
        ).to.equal(formtarget);

        await disconnect();
    });

    it("should set the `name` attribute on the internal button when provided", async () => {
        const { element, connect, disconnect } = await setup();
        const name = "testName";

        element.name = name;

        await connect();

        expect(
            element.shadowRoot?.querySelector("button")?.getAttribute("name")
        ).to.equal(name);

        await disconnect();
    });

    it("should set the `type` attribute on the internal button when provided", async () => {
        const { element, connect, disconnect } = await setup();
        const type = "submit";

        element.type = type;

        await connect();

        expect(
            element.shadowRoot?.querySelector("button")?.getAttribute("type")
        ).to.equal(type);

        await disconnect();
    });

    it("should set the `value` attribute on the internal button when provided", async () => {
        const { element, connect, disconnect } = await setup();
        const value = "Reset";

        element.value = value;

        await connect();

        expect(
            element.shadowRoot?.querySelector("button")?.getAttribute("value")
        ).to.equal(value);

        await disconnect();
    });

    describe("Delegates ARIA button", () => {
        it("should set the `aria-atomic` attribute on the internal button when provided", async () => {
            const { element, connect, disconnect } = await setup();
            const ariaAtomic = "true";

            element.ariaAtomic = ariaAtomic;

            await connect();

            expect(
                element.shadowRoot?.querySelector("button")?.getAttribute("aria-atomic")
            ).to.equal(ariaAtomic);

            await disconnect();
        });

        it("should set the `aria-busy` attribute on the internal button when provided", async () => {
            const { element, connect, disconnect } = await setup();
            const ariaBusy = "false";

            element.ariaBusy = ariaBusy;

            await connect();

            expect(
                element.shadowRoot?.querySelector("button")?.getAttribute("aria-busy")
            ).to.equal(ariaBusy);

            await disconnect();
        });

        it("should set the `aria-controls` attribute on the internal button when provided", async () => {
            const { element, connect, disconnect } = await setup();
            const ariaControls = "testId";

            element.ariaControls = ariaControls;

            await connect();

            expect(
                element.shadowRoot?.querySelector("button")?.getAttribute("aria-controls")
            ).to.equal(ariaControls);

            await disconnect();
        });

        it("should set the `aria-current` attribute on the internal button when provided", async () => {
            const { element, connect, disconnect } = await setup();
            const ariaCurrent = "page";

            element.ariaCurrent = ariaCurrent;

            await connect();

            expect(
                element.shadowRoot?.querySelector("button")?.getAttribute("aria-current")
            ).to.equal(ariaCurrent);

            await disconnect();
        });

        it("should set the `aria-describedby` attribute on the internal button when provided", async () => {
            const { element, connect, disconnect } = await setup();
            const ariaDescribedby = "testId";

            element.ariaDescribedby = ariaDescribedby;

            await connect();

            expect(
                element.shadowRoot
                    ?.querySelector("button")
                    ?.getAttribute("aria-describedby")
            ).to.equal(ariaDescribedby);

            await disconnect();
        });

        it("should set the `aria-details` attribute on the internal button when provided", async () => {
            const { element, connect, disconnect } = await setup();
            const ariaDetails = "testId";

            element.ariaDetails = ariaDetails;

            await connect();

            expect(
                element.shadowRoot?.querySelector("button")?.getAttribute("aria-details")
            ).to.equal(ariaDetails);

            await disconnect();
        });

        it("should set the `aria-disabled` attribute on the internal button when provided", async () => {
            const { element, connect, disconnect } = await setup();
            const ariaDisabled = "true";

            element.ariaDisabled = ariaDisabled;

            await connect();

            expect(
                element.shadowRoot?.querySelector("button")?.getAttribute("aria-disabled")
            ).to.equal(ariaDisabled);

            await disconnect();
        });

        it("should set the `aria-errormessage` attribute on the internal button when provided", async () => {
            const { element, connect, disconnect } = await setup();
            const ariaErrormessage = "test";

            element.ariaErrormessage = ariaErrormessage;

            await connect();

            expect(
                element.shadowRoot
                    ?.querySelector("button")
                    ?.getAttribute("aria-errormessage")
            ).to.equal(ariaErrormessage);

            await disconnect();
        });

        it("should set the `aria-expanded` attribute on the internal button when provided", async () => {
            const { element, connect, disconnect } = await setup();
            const ariaExpanded = "true";

            element.ariaExpanded = ariaExpanded;

            await connect();

            expect(
                element.shadowRoot?.querySelector("button")?.getAttribute("aria-expanded")
            ).to.equal(ariaExpanded);

            await disconnect();
        });

        it("should set the `aria-flowto` attribute on the internal button when provided", async () => {
            const { element, connect, disconnect } = await setup();
            const ariaFlowto = "testId";

            element.ariaFlowto = ariaFlowto;

            await connect();

            expect(
                element.shadowRoot?.querySelector("button")?.getAttribute("aria-flowto")
            ).to.equal(ariaFlowto);

            await disconnect();
        });

        it("should set the `aria-haspopup` attribute on the internal button when provided", async () => {
            const { element, connect, disconnect } = await setup();
            const ariaHaspopup = "true";

            element.ariaHaspopup = ariaHaspopup;

            await connect();

            expect(
                element.shadowRoot?.querySelector("button")?.getAttribute("aria-haspopup")
            ).to.equal(ariaHaspopup);

            await disconnect();
        });

        it("should set the `aria-hidden` attribute on the internal button when provided", async () => {
            const { element, connect, disconnect } = await setup();
            const ariaHidden = "true";

            element.ariaHidden = ariaHidden;

            await connect();

            expect(
                element.shadowRoot?.querySelector("button")?.getAttribute("aria-hidden")
            ).to.equal(ariaHidden);

            await disconnect();
        });

        it("should set the `aria-invalid` attribute on the internal button when provided", async () => {
            const { element, connect, disconnect } = await setup();
            const ariaInvalid = "spelling";

            element.ariaInvalid = ariaInvalid;

            await connect();

            expect(
                element.shadowRoot?.querySelector("button")?.getAttribute("aria-invalid")
            ).to.equal(ariaInvalid);

            await disconnect();
        });

        it("should set the `aria-keyshortcuts` attribute on the internal button when provided", async () => {
            const { element, connect, disconnect } = await setup();
            const ariaKeyshortcuts = "F4";

            element.ariaKeyshortcuts = ariaKeyshortcuts;

            await connect();

            expect(
                element.shadowRoot
                    ?.querySelector("button")
                    ?.getAttribute("aria-keyshortcuts")
            ).to.equal(ariaKeyshortcuts);

            await disconnect();
        });

        it("should set the `aria-label` attribute on the internal button when provided", async () => {
            const { element, connect, disconnect } = await setup();
            const ariaLabel = "Foo label";

            element.ariaLabel = ariaLabel;

            await connect();

            expect(
                element.shadowRoot?.querySelector("button")?.getAttribute("aria-label")
            ).to.equal(ariaLabel);

            await disconnect();
        });

        it("should set the `aria-labelledby` attribute on the internal button when provided", async () => {
            const { element, connect, disconnect } = await setup();
            const ariaLabelledby = "testId";

            element.ariaLabelledby = ariaLabelledby;

            await connect();

            expect(
                element.shadowRoot
                    ?.querySelector("button")
                    ?.getAttribute("aria-labelledby")
            ).to.equal(ariaLabelledby);

            await disconnect();
        });

        it("should set the `aria-live` attribute on the internal button when provided", async () => {
            const { element, connect, disconnect } = await setup();
            const ariaLive = "polite";

            element.ariaLive = ariaLive;

            await connect();

            expect(
                element.shadowRoot?.querySelector("button")?.getAttribute("aria-live")
            ).to.equal(ariaLive);

            await disconnect();
        });

        it("should set the `aria-owns` attribute on the internal button when provided", async () => {
            const { element, connect, disconnect } = await setup();
            const ariaOwns = "testId";

            element.ariaOwns = ariaOwns;

            await connect();

            expect(
                element.shadowRoot?.querySelector("button")?.getAttribute("aria-owns")
            ).to.equal(ariaOwns);

            await disconnect();
        });

        it("should set the `aria-pressed` attribute on the internal button when provided", async () => {
            const { element, connect, disconnect } = await setup();
            const ariaPressed = "true";

            element.ariaPressed = ariaPressed;

            await connect();

            expect(
                element.shadowRoot?.querySelector("button")?.getAttribute("aria-pressed")
            ).to.equal(ariaPressed);

            await disconnect();
        });

        it("should set the `aria-relevant` attribute on the internal button when provided", async () => {
            const { element, connect, disconnect } = await setup();
            const ariaRelevant = "removals";

            element.ariaRelevant = ariaRelevant;

            await connect();

            expect(
                element.shadowRoot?.querySelector("button")?.getAttribute("aria-relevant")
            ).to.equal(ariaRelevant);

            await disconnect();
        });

        it("should set the `aria-roledescription` attribute on the internal button when provided", async () => {
            const { element, connect, disconnect } = await setup();
            const ariaRoledescription = "slide";

            element.ariaRoledescription = ariaRoledescription;

            await connect();

            expect(
                element.shadowRoot
                    ?.querySelector("button")
                    ?.getAttribute("aria-roledescription")
            ).to.equal(ariaRoledescription);

            await disconnect();
        });
    });

    describe("of type 'submit'", () => {
        it("should submit the parent form when clicked", async () => {
            const { connect, disconnect, element, parent } = await setup();
            const form = document.createElement("form");
            element.setAttribute("type", "submit");
            form.appendChild(element);
            parent.appendChild(form);

            await connect();

            const wasSumbitted = await new Promise(resolve => {
                // Resolve as true when the event listener is handled
                form.addEventListener(
                    "submit",
                    (event: Event & { submitter: HTMLElement }) => {
                        event.preventDefault();
                        expect(event.submitter).to.equal(element.proxy);
                        resolve(true);
                    }
                );

                element.click();

                // Resolve false on the next update in case reset hasn't happened
                Updates.enqueue(() => resolve(false));
            });

            expect(wasSumbitted).to.equal(true);

            await disconnect();
        });
    });

    describe("of type 'reset'", () => {
        it("should reset the parent form when clicked", async () => {
            const { connect, disconnect, element, parent } = await setup();
            const form = document.createElement("form");
            element.setAttribute("type", "reset");
            form.appendChild(element);
            parent.appendChild(form);

            await connect();

            const wasReset = await new Promise(resolve => {
                // Resolve true when the event listener is handled
                form.addEventListener("reset", () => resolve(true));

                element.click();

                // Resolve false on the next update in case reset hasn't happened
                Updates.enqueue(() => resolve(false));
            });

            expect(wasReset).to.equal(true);

            await disconnect();
        });
    });

    describe("of 'disabled'", () => {
        it("should not propagate when clicked", async () => {
            const { connect, disconnect, element, parent } = await setup();

            element.disabled = true;
            parent.appendChild(element);

            let wasClicked: boolean = false;
            await connect();

            parent.addEventListener(eventClick, () => {
                wasClicked = true;
            })

            await Updates.next();
            element.click()

            expect(wasClicked).to.equal(false);

            await disconnect();
        });

        it("should not propagate when spans within shadowRoot are clicked", async () => {
            const { connect, disconnect, element, parent } = await setup();

            element.disabled = true;
            parent.appendChild(element);

            let wasClicked: boolean = false;

            await connect();

            parent.addEventListener(eventClick, () => {
                wasClicked = true;
            })

            await Updates.next();

            const elements = element.shadowRoot?.querySelectorAll("span");
            if (elements) {
               const spans : HTMLSpanElement[] = Array.from(elements)
               spans.forEach((span: HTMLSpanElement) => {
                   span.click()
                   expect(wasClicked).to.equal(false);
               })
            }

            await disconnect();
        });
    });
});
