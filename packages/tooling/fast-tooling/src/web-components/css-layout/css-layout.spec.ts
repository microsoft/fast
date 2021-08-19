import { fastSwitch, fastTooltip } from "@microsoft/fast-components";
import { DOM } from "@microsoft/fast-element";
import { expect } from "chai";
import { fixture } from "../../__test__/fixture";
import { fastToolingCSSLayout } from ".";

async function setup() {
    const { element, connect, disconnect } = await fixture([
        fastToolingCSSLayout(),
        fastSwitch(),
        fastTooltip(),
    ]);

    return { element, connect, disconnect };
}

describe("CSSLayout", () => {
    it("should only show the flexbox toggle when it has not been pressed", async () => {
        const { element, connect, disconnect } = await setup();

        await connect();

        const controlRegion = element.shadowRoot?.querySelector(".flexbox-controls");

        expect(controlRegion.classList.contains("active")).to.equal(false);

        await disconnect();
    });
    it("should show the entire suite of flexbox controls with the flexbox toggle has been pressed", async () => {
        const { element, connect, disconnect } = await setup();

        await connect();

        const toggle = element.shadowRoot?.querySelector("fast-switch");
        const toggleEvent = new Event("click", {} as MouseEventInit);

        toggle.dispatchEvent(toggleEvent);

        const controlRegion = element.shadowRoot?.querySelector(".flexbox-controls");

        await DOM.nextUpdate();

        expect(controlRegion.classList.contains("active")).to.equal(true);

        await disconnect();
    });
    it("should add display:flex when the flexbox toggle is triggered", async () => {
        const { element, connect, disconnect } = await setup();
        let css = "";

        await connect();

        const toggle = element.shadowRoot?.querySelector("fast-switch");
        const toggleEvent = new Event("click", {} as MouseEventInit);

        element.addEventListener("change", (e: any) => {
            css = e.target.value;
        });

        toggle.dispatchEvent(toggleEvent);

        await DOM.nextUpdate();

        expect(css).to.equal("display: flex;");

        await disconnect();
    });
    it("should contain a tooltip for a flex-direction value that matches it's id attribute", async () => {
        const { element, connect, disconnect } = await setup();

        await connect();

        const toggle = element.shadowRoot?.querySelector("fast-switch");
        const toggleEvent = new Event("click", {} as MouseEventInit);

        toggle.dispatchEvent(toggleEvent);

        await DOM.nextUpdate();

        const input = element.shadowRoot?.querySelector(
            "input[name='flex-direction']"
        ) as HTMLInputElement;
        const tooltip = element.shadowRoot?.querySelector(
            "input[name='flex-direction'] + fast-tooltip"
        );

        expect(input.getAttribute("id")).to.equal(tooltip.getAttribute("anchor"));
        expect(tooltip.textContent.trim()).to.equal("row");

        await disconnect();
    });
    it("should emit an updated flex-direction value when the flex-direction value is updated", async () => {
        const { element, connect, disconnect } = await setup();
        let css = "";

        await connect();

        const toggle = element.shadowRoot?.querySelector("fast-switch");
        const toggleEvent = new Event("click", {} as MouseEventInit);

        element.addEventListener("change", (e: any) => {
            css = e.target.value;
        });

        toggle.dispatchEvent(toggleEvent);

        await DOM.nextUpdate();

        const flexDirectionInput = element.shadowRoot?.querySelector(
            "input[name='flex-direction']"
        ) as HTMLInputElement;

        flexDirectionInput.click();

        await DOM.nextUpdate();

        expect(css).to.equal("display: flex; flex-direction: row;");

        await disconnect();
    });
    it("should contain a tooltip for a justify-content value that matches it's id attribute", async () => {
        const { element, connect, disconnect } = await setup();

        await connect();

        const toggle = element.shadowRoot?.querySelector("fast-switch");
        const toggleEvent = new Event("click", {} as MouseEventInit);

        toggle.dispatchEvent(toggleEvent);

        await DOM.nextUpdate();

        const input = element.shadowRoot?.querySelector(
            "input[name='justify-content']"
        ) as HTMLInputElement;
        const tooltip = element.shadowRoot?.querySelector(
            "input[name='justify-content'] + fast-tooltip"
        );

        expect(input.getAttribute("id")).to.equal(tooltip.getAttribute("anchor"));
        expect(tooltip.textContent.trim()).to.equal("flex-start");

        await disconnect();
    });
    it("should emit an updated justify-content value when the justify-content value is updated", async () => {
        const { element, connect, disconnect } = await setup();
        let css = "";

        await connect();

        const toggle = element.shadowRoot?.querySelector("fast-switch");
        const toggleEvent = new Event("click", {} as MouseEventInit);

        element.addEventListener("change", (e: any) => {
            css = e.target.value;
        });

        toggle.dispatchEvent(toggleEvent);

        await DOM.nextUpdate();

        const justifyContentInput = element.shadowRoot?.querySelector(
            "input[name='justify-content']"
        ) as HTMLInputElement;

        justifyContentInput.click();

        await DOM.nextUpdate();

        expect(css).to.equal("display: flex; justify-content: flex-start;");

        await disconnect();
    });
    it("should contain a tooltip for a align-content value that matches it's id attribute", async () => {
        const { element, connect, disconnect } = await setup();

        await connect();

        const toggle = element.shadowRoot?.querySelector("fast-switch");
        const toggleEvent = new Event("click", {} as MouseEventInit);

        toggle.dispatchEvent(toggleEvent);

        await DOM.nextUpdate();

        const input = element.shadowRoot?.querySelector(
            "input[name='align-content']"
        ) as HTMLInputElement;
        const tooltip = element.shadowRoot?.querySelector(
            "input[name='align-content'] + fast-tooltip"
        );

        expect(input.getAttribute("id")).to.equal(tooltip.getAttribute("anchor"));
        expect(tooltip.textContent.trim()).to.equal("flex-start");

        await disconnect();
    });
    it("should emit an updated align-content value when the align-content value is updated", async () => {
        const { element, connect, disconnect } = await setup();
        let css = "";

        await connect();

        const toggle = element.shadowRoot?.querySelector("fast-switch");
        const toggleEvent = new Event("click", {} as MouseEventInit);

        element.addEventListener("change", (e: any) => {
            css = e.target.value;
        });

        toggle.dispatchEvent(toggleEvent);

        await DOM.nextUpdate();

        const alignContentInput = element.shadowRoot?.querySelector(
            "input[name='align-content']"
        ) as HTMLInputElement;

        alignContentInput.click();

        await DOM.nextUpdate();

        expect(css).to.equal("display: flex; align-content: flex-start;");

        await disconnect();
    });
    it("should contain a tooltip for a align-items value that matches it's id attribute", async () => {
        const { element, connect, disconnect } = await setup();

        await connect();

        const toggle = element.shadowRoot?.querySelector("fast-switch");
        const toggleEvent = new Event("click", {} as MouseEventInit);

        toggle.dispatchEvent(toggleEvent);

        await DOM.nextUpdate();

        const input = element.shadowRoot?.querySelector(
            "input[name='align-items']"
        ) as HTMLInputElement;
        const tooltip = element.shadowRoot?.querySelector(
            "input[name='align-items'] + fast-tooltip"
        );

        expect(input.getAttribute("id")).to.equal(tooltip.getAttribute("anchor"));
        expect(tooltip.textContent.trim()).to.equal("flex-start");

        await disconnect();
    });
    it("should emit an updated align-items value when the align-items value is updated", async () => {
        const { element, connect, disconnect } = await setup();
        let css = "";

        await connect();

        const toggle = element.shadowRoot?.querySelector("fast-switch");
        const toggleEvent = new Event("click", {} as MouseEventInit);

        element.addEventListener("change", (e: any) => {
            css = e.target.value;
        });

        toggle.dispatchEvent(toggleEvent);

        await DOM.nextUpdate();

        const alignItemsInput = element.shadowRoot?.querySelector(
            "input[name='align-items']"
        ) as HTMLInputElement;

        alignItemsInput.click();

        await DOM.nextUpdate();

        expect(css).to.equal("display: flex; align-items: flex-start;");

        await disconnect();
    });
    it("should emit an updated row gap value when the row gap value has been updated", async () => {
        const { element, connect, disconnect } = await setup();
        let css = "";

        await connect();

        const toggle = element.shadowRoot?.querySelector("fast-switch");
        const toggleEvent = new Event("click", {} as MouseEventInit);

        element.addEventListener("change", (e: any) => {
            css = e.target.value;
        });

        toggle.dispatchEvent(toggleEvent);

        await DOM.nextUpdate();

        const rowGapInput = element.shadowRoot?.querySelector(
            "input.css-row-gap"
        ) as HTMLInputElement;
        rowGapInput.value = "5";

        await DOM.nextUpdate();

        const rowGapInputEvent = new KeyboardEvent("input", {} as KeyboardEventInit);

        rowGapInput.dispatchEvent(rowGapInputEvent);

        await DOM.nextUpdate();

        expect(css).to.equal("display: flex; row-gap: 5px;");

        await disconnect();
    });
    it("should emit an updated column gap value when the column gap value has been updated", async () => {
        const { element, connect, disconnect } = await setup();
        let css = "";

        await connect();

        const toggle = element.shadowRoot?.querySelector("fast-switch");
        const toggleEvent = new Event("click", {} as MouseEventInit);

        element.addEventListener("change", (e: any) => {
            css = e.target.value;
        });

        toggle.dispatchEvent(toggleEvent);

        await DOM.nextUpdate();

        const columnGapInput = element.shadowRoot?.querySelector(
            "input.css-column-gap"
        ) as HTMLInputElement;
        columnGapInput.value = "5";

        await DOM.nextUpdate();

        const columnGapInputEvent = new KeyboardEvent("input", {} as KeyboardEventInit);

        columnGapInput.dispatchEvent(columnGapInputEvent);

        await DOM.nextUpdate();

        expect(css).to.equal("display: flex; column-gap: 5px;");

        await disconnect();
    });
    it("should contain a tooltip for a flex-wrap value that matches it's id attribute", async () => {
        const { element, connect, disconnect } = await setup();

        await connect();

        const toggle = element.shadowRoot?.querySelector("fast-switch");
        const toggleEvent = new Event("click", {} as MouseEventInit);

        toggle.dispatchEvent(toggleEvent);

        await DOM.nextUpdate();

        const input = element.shadowRoot?.querySelector(
            "input[name='flex-wrap']"
        ) as HTMLInputElement;
        const tooltip = element.shadowRoot?.querySelector(
            "input[name='flex-wrap'] + fast-tooltip"
        );

        expect(input.getAttribute("id")).to.equal(tooltip.getAttribute("anchor"));
        expect(tooltip.textContent.trim()).to.equal("wrap");

        await disconnect();
    });
    it("should emit an updated flex-wrap value when the flex-wrap value has been updated", async () => {
        const { element, connect, disconnect } = await setup();
        let css = "";

        await connect();

        const toggle = element.shadowRoot?.querySelector("fast-switch");
        const toggleEvent = new Event("click", {} as MouseEventInit);

        element.addEventListener("change", (e: any) => {
            css = e.target.value;
        });

        toggle.dispatchEvent(toggleEvent);

        await DOM.nextUpdate();

        const flexWrapInput = element.shadowRoot?.querySelector(
            "input[name='flex-wrap']"
        ) as HTMLInputElement;

        flexWrapInput.click();

        await DOM.nextUpdate();

        expect(css).to.equal("display: flex; flex-wrap: wrap;");

        await disconnect();
    });
    it("should trigger a custom set onChange if an onChange has been provided", async () => {
        const { element, connect, disconnect } = await setup();
        let changedConfig;

        await connect();

        element.onChange = config => {
            changedConfig = config;
        };

        const toggle = element.shadowRoot?.querySelector("fast-switch");
        const toggleEvent = new Event("click", {} as MouseEventInit);

        toggle.dispatchEvent(toggleEvent);

        await DOM.nextUpdate();

        expect(changedConfig.toString()).to.equal({ display: "flex" }.toString());

        await disconnect();
    });
    it("should update the stored CSS display value when the value is updated", async () => {
        const { element, connect, disconnect } = await setup();

        await connect();

        element.setAttribute("value", "display: flex;");

        await DOM.nextUpdate();

        const toggle: HTMLInputElement = element.shadowRoot?.querySelector("fast-switch");

        expect(toggle.checked).to.equal(true);

        await disconnect();
    });
    it("should update the stored CSS flex-direction value when the value is updated", async () => {
        const { element, connect, disconnect } = await setup();

        await connect();

        element.setAttribute("value", "display: flex; flex-direction: row;");

        await DOM.nextUpdate();

        const input = element.shadowRoot?.querySelector(
            "input[name='flex-direction']"
        ) as HTMLInputElement;

        expect(input.checked).to.equal(true);

        await disconnect();
    });
    it("should update the stored CSS justify-content value when the value is updated", async () => {
        const { element, connect, disconnect } = await setup();

        await connect();

        element.setAttribute("value", "display: flex; justify-content: center;");

        await DOM.nextUpdate();

        const input = element.shadowRoot?.querySelectorAll(
            "input[name='justify-content']"
        )[2] as HTMLInputElement;

        expect(input.checked).to.equal(true);

        await disconnect();
    });
    it("should update the stored CSS align-content value when the value is updated", async () => {
        const { element, connect, disconnect } = await setup();

        await connect();

        element.setAttribute("value", "display: flex; align-content: center;");

        await DOM.nextUpdate();

        const input = element.shadowRoot?.querySelectorAll(
            "input[name='align-content']"
        )[2] as HTMLInputElement;

        expect(input.checked).to.equal(true);

        await disconnect();
    });
    it("should update the stored CSS align-items value when the value is updated", async () => {
        const { element, connect, disconnect } = await setup();

        await connect();

        element.setAttribute("value", "display: flex; align-items: stretch;");

        await DOM.nextUpdate();

        const input = element.shadowRoot?.querySelectorAll(
            "input[name='align-items']"
        )[3] as HTMLInputElement;

        expect(input.checked).to.equal(true);

        await disconnect();
    });
    it("should update the stored CSS column-gap value when the value is updated", async () => {
        const { element, connect, disconnect } = await setup();

        await connect();

        element.setAttribute("value", "display: flex; column-gap: 12px;");

        await DOM.nextUpdate();

        const input = element.shadowRoot?.querySelector(
            "input[name='column-gap']"
        ) as HTMLInputElement;

        expect(input.value).to.equal("12");

        await disconnect();
    });
    it("should not update the stored CSS column-gap value when the value is updated with a non-px appended value", async () => {
        const { element, connect, disconnect } = await setup();

        await connect();

        element.setAttribute("value", "display: flex; column-gap: 12em;");

        await DOM.nextUpdate();

        const input = element.shadowRoot?.querySelector(
            "input[name='column-gap']"
        ) as HTMLInputElement;

        expect(input.value).to.equal("");

        await disconnect();
    });
    it("should update the stored CSS row-gap value when the value is updated", async () => {
        const { element, connect, disconnect } = await setup();

        await connect();

        element.setAttribute("value", "display: flex; row-gap: 24px;");

        await DOM.nextUpdate();

        const input = element.shadowRoot?.querySelector(
            "input[name='row-gap']"
        ) as HTMLInputElement;

        expect(input.value).to.equal("24");

        await disconnect();
    });
    it("should not update the stored CSS row-gap value when the value is updated with a non-px appended value", async () => {
        const { element, connect, disconnect } = await setup();

        await connect();

        element.setAttribute("value", "display: flex; row-gap: 24em;");

        await DOM.nextUpdate();

        const input = element.shadowRoot?.querySelector(
            "input[name='row-gap']"
        ) as HTMLInputElement;

        expect(input.value).to.equal("");

        await disconnect();
    });
    it("should update the stored CSS flex-wrap value when the value is updated", async () => {
        const { element, connect, disconnect } = await setup();

        await connect();

        element.setAttribute("value", "display: flex; flex-wrap: wrap;");

        await DOM.nextUpdate();

        const input = element.shadowRoot?.querySelector(
            "input[name='flex-wrap']"
        ) as HTMLInputElement;

        expect(input.checked).to.equal(true);

        await disconnect();
    });
});
