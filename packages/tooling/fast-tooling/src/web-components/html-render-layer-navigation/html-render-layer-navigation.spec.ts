import { DOM } from "@microsoft/fast-element";
import { fixture } from "@microsoft/fast-foundation/dist/esm/fixture";
import { expect } from "chai";
import { ActivityType } from "../html-render-layer/html-render-layer";
import { HTMLRenderLayerNavgation } from "./html-render-layer-navigation";

HTMLRenderLayerNavgation;

async function setup() {
    const { element, connect, disconnect, parent } = await fixture<
        HTMLRenderLayerNavgation
    >("fast-tooling-html-render-layer-navigation");

    return { element, connect, disconnect, parent };
}

describe("HTMLRenderLayerNavgation", () => {
    it("should handle click / clear", async () => {
        const { element, connect, disconnect, parent } = await setup();

        await connect();

        const div = document.createElement("div");
        parent.appendChild(div);

        element.elementActivity(ActivityType.click, "Foo", div);
        await DOM.nextUpdate();

        const select = element.shadowRoot?.querySelector("#clickDisplay");
        expect(select.classList.contains("active")).to.equal(true);

        const pill = element.shadowRoot?.querySelector("#clickDisplay .pill");
        expect(pill.innerHTML).to.equal("Foo");

        element.elementActivity(ActivityType.clear, "Foo", div);
        await DOM.nextUpdate();

        const selectClear = element.shadowRoot?.querySelector("#clickDisplay");
        expect(selectClear.classList.contains("active")).to.equal(false);

        const pillClear = element.shadowRoot?.querySelector("#clickDisplay .pill");
        expect(pillClear.innerHTML).to.equal("");

        await disconnect();
    });

    it("should handle hover / blur", async () => {
        const { element, connect, disconnect, parent } = await setup();

        await connect();

        const div = document.createElement("div");
        parent.appendChild(div);

        element.elementActivity(ActivityType.hover, "Foo", div);
        await DOM.nextUpdate();

        const hover = element.shadowRoot?.querySelector("#hoverDisplay");
        expect(hover.classList.contains("active")).to.equal(true);

        const pill = element.shadowRoot?.querySelector("#hoverDisplay .pill");
        expect(pill.innerHTML).to.equal("Foo");

        element.elementActivity(ActivityType.blur, "Foo", div);
        await DOM.nextUpdate();

        const hoverBlur = element.shadowRoot?.querySelector("#hoverDisplay");
        expect(hoverBlur.classList.contains("active")).to.equal(false);

        const pillBlur = element.shadowRoot?.querySelector("#hoverDisplay .pill");
        expect(pillBlur.innerHTML).to.equal("");

        await disconnect();
    });
});
