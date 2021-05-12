import { customElement } from "@microsoft/fast-element";
import { fixture } from "@microsoft/fast-foundation/dist/esm/fixture";
import { expect } from "chai";
import { ColorPickerTemplate as template } from "./color-picker.template";
import { FASTColorPicker as ColorPicker } from "./";

@customElement({
    name: "fast-color-picker",
    template,
})
class FASTColorPicker extends ColorPicker {}
FASTColorPicker;

async function setup() {
    const { element, connect, disconnect } = await fixture<FASTColorPicker>(
        "fast-color-picker"
    );

    return { element, connect, disconnect };
}

describe("FASTColorPicker", () => {
    it("should open the color picker when the component is focused", async () => {
        const { element, connect, disconnect } = await setup();

        await connect();

        // Setting the tabindex to 0 to allow focus()
        // due to mismatch between user focus and programmatically calling focus
        // during testing when using delegateFocus
        element.setAttribute("tabindex", "0");

        expect(element.open).to.equal(false);

        element.focus();

        expect(element.open).to.equal(true);

        await disconnect();
    });

    it("should close the color picker when the component is blurred", async () => {
        const { element, connect, disconnect } = await setup();

        await connect();
        // await DOM.nextUpdate();

        // Setting the tabindex to 0 to allow focus()
        // due to mismatch between user focus and programmatically calling focus
        // during testing when using delegateFocus
        element.setAttribute("tabindex", "0");
        element.focus();

        expect(element.open).to.equal(true);

        element.blur();

        expect(element.open).to.equal(false);

        await disconnect();
    });

    it("should fire a change event if the text field value is changed", async () => {
        const { element, connect, disconnect } = await setup();
        const event = new Event("change", {
            key: "a",
        } as KeyboardEventInit);
        let wasChanged: boolean = false;

        await connect();

        element.addEventListener("change", (e: Event) => {
            wasChanged = true;
        });

        const mainTextField = element.shadowRoot?.querySelectorAll(
            ".root > fast-text-field"
        );

        expect(mainTextField.length).to.equal(1);

        mainTextField[0].dispatchEvent(event);

        expect(wasChanged).to.equal(true);

        await disconnect();
    });

    it("should fire a change event if the r (red) text field input value is changed", async () => {
        const { element, connect, disconnect } = await setup();
        const event = new Event("input", {} as KeyboardEventInit);
        let wasChanged: boolean = false;
        event.composedPath = () => {
            return [
                {
                    ...new EventTarget(),
                    value: "5",
                },
            ];
        };

        await connect();

        element.addEventListener("change", (e: Event) => {
            wasChanged = true;
        });

        const textField = element.shadowRoot?.querySelectorAll(
            ".input-region fast-text-field"
        )[0];

        textField.dispatchEvent(event);

        expect(wasChanged).to.equal(true);

        await disconnect();
    });
    it("should fire a change event if the g (green) text field input value is changed", async () => {
        const { element, connect, disconnect } = await setup();
        const event = new Event("input", {} as KeyboardEventInit);
        let wasChanged: boolean = false;
        event.composedPath = () => {
            return [
                {
                    ...new EventTarget(),
                    value: "5",
                },
            ];
        };

        await connect();

        element.addEventListener("change", (e: Event) => {
            wasChanged = true;
        });

        const textField = element.shadowRoot?.querySelectorAll(
            ".input-region fast-text-field"
        )[1];

        textField.dispatchEvent(event);

        expect(wasChanged).to.equal(true);

        await disconnect();
    });
    it("should fire a change event if the b (blue) text field input value is changed", async () => {
        const { element, connect, disconnect } = await setup();
        const event = new Event("input", {} as KeyboardEventInit);
        let wasChanged: boolean = false;
        event.composedPath = () => {
            return [
                {
                    ...new EventTarget(),
                    value: "5",
                },
            ];
        };

        await connect();

        element.addEventListener("change", (e: Event) => {
            wasChanged = true;
        });

        const textField = element.shadowRoot?.querySelectorAll(
            ".input-region fast-text-field"
        )[2];

        textField.dispatchEvent(event);

        expect(wasChanged).to.equal(true);

        await disconnect();
    });
    it("should fire a change event if the h (hue) text field input value is changed", async () => {
        const { element, connect, disconnect } = await setup();
        const event = new Event("input", {} as KeyboardEventInit);
        let wasChanged: boolean = false;
        event.composedPath = () => {
            return [
                {
                    ...new EventTarget(),
                    value: "5",
                },
            ];
        };

        await connect();

        element.addEventListener("change", (e: Event) => {
            wasChanged = true;
        });

        const textField = element.shadowRoot?.querySelectorAll(
            ".input-region fast-text-field"
        )[3];

        textField.dispatchEvent(event);

        expect(wasChanged).to.equal(true);

        await disconnect();
    });
    it("should fire a change event if the s (saturation) text field input value is changed", async () => {
        const { element, connect, disconnect } = await setup();
        const event = new Event("input", {} as KeyboardEventInit);
        let wasChanged: boolean = false;
        event.composedPath = () => {
            return [
                {
                    ...new EventTarget(),
                    value: "5",
                },
            ];
        };

        await connect();

        element.addEventListener("change", (e: Event) => {
            wasChanged = true;
        });

        const textField = element.shadowRoot?.querySelectorAll(
            ".input-region fast-text-field"
        )[4];

        textField.dispatchEvent(event);

        expect(wasChanged).to.equal(true);

        await disconnect();
    });
    it("should fire a change event if the v (value) text field input value is changed", async () => {
        const { element, connect, disconnect } = await setup();
        const event = new Event("input", {} as KeyboardEventInit);
        let wasChanged: boolean = false;
        event.composedPath = () => {
            return [
                {
                    ...new EventTarget(),
                    value: "5",
                },
            ];
        };

        await connect();

        element.addEventListener("change", (e: Event) => {
            wasChanged = true;
        });

        const textField = element.shadowRoot?.querySelectorAll(
            ".input-region fast-text-field"
        )[5];

        textField.dispatchEvent(event);

        expect(wasChanged).to.equal(true);

        await disconnect();
    });
    it("should fire a change event if the a (alpha) text field input value is changed", async () => {
        const { element, connect, disconnect } = await setup();
        const event = new Event("input", {} as KeyboardEventInit);
        let wasChanged: boolean = false;
        event.composedPath = () => {
            return [
                {
                    ...new EventTarget(),
                    value: "5",
                },
            ];
        };

        await connect();

        element.addEventListener("change", (e: Event) => {
            wasChanged = true;
        });

        const textField = element.shadowRoot?.querySelectorAll(
            ".input-region fast-text-field"
        )[6];

        textField.dispatchEvent(event);

        expect(wasChanged).to.equal(true);

        await disconnect();
    });
    it("should fire a change event if the saturation & light picker is clicked", async () => {
        const { element, connect, disconnect } = await setup();
        const event = new Event("mousedown", {});
        event.composedPath = () => {
            return [document.createElement("div")];
        };
        let wasChanged: boolean = false;

        await connect();

        element.addEventListener("change", (e: Event) => {
            wasChanged = true;
        });

        const satLightPicker = element.shadowRoot?.querySelector(".sat-light-picker");

        satLightPicker.dispatchEvent(event);

        expect(wasChanged).to.equal(true);

        await disconnect();
    });
    it("should fire a change event if the hue picker is clicked", async () => {
        const { element, connect, disconnect } = await setup();
        const event = new Event("mousedown", {});
        event.composedPath = () => {
            return [document.createElement("div")];
        };
        let wasChanged: boolean = false;

        await connect();

        element.addEventListener("change", (e: Event) => {
            wasChanged = true;
        });

        const huePicker = element.shadowRoot?.querySelector(".hue-picker");

        huePicker.dispatchEvent(event);

        expect(wasChanged).to.equal(true);

        await disconnect();
    });
    it("should fire a change event if the alpha picker is clicked", async () => {
        const { element, connect, disconnect } = await setup();
        const event = new Event("mousedown", {});
        event.composedPath = () => {
            return [document.createElement("div")];
        };
        let wasChanged: boolean = false;

        await connect();

        element.addEventListener("change", (e: Event) => {
            wasChanged = true;
        });

        const alphaPicker = element.shadowRoot?.querySelector(".alpha-picker");

        alphaPicker.dispatchEvent(event);

        expect(wasChanged).to.equal(true);

        await disconnect();
    });
});
