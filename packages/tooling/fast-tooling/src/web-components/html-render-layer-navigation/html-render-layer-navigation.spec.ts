import { DOM } from "@microsoft/fast-element";
import { fixture } from "@microsoft/fast-foundation/dist/esm/fixture";
import { expect } from "chai";
import { MessageSystem } from "../../message-system";
import dataDictionaryConfig from "../../__test__/html-render/data-dictionary-config";
import schemaDictionary from "../../__test__/html-render/schema-dictionary";
import { ActivityType } from "../html-render-layer/html-render-layer";
import { HTMLRenderLayerNavgation } from "./html-render-layer-navigation";

HTMLRenderLayerNavgation;

/* eslint-disable-next-line @typescript-eslint/no-var-requires */
const FASTMessageSystemWorker = require("../../../message-system.min.js");

const fastMessageSystemWorker = new FASTMessageSystemWorker();

async function setup() {
    const { element, connect, disconnect, parent } = await fixture<
        HTMLRenderLayerNavgation
    >("fast-tooling-html-render-layer-navigation");
    const message = new MessageSystem({
        webWorker: fastMessageSystemWorker,
        dataDictionary: dataDictionaryConfig as any,
        schemaDictionary,
    });
    element.messageSystem = message;
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

        const select = element.shadowRoot?.querySelector(".click-layer");
        expect(select.classList.contains("active")).to.equal(true);

        let pill = element.shadowRoot?.querySelector(".click-layer .pill");
        expect(pill.innerHTML).to.equal("Untitled");

        element.dataDictionary = null;
        element.elementActivity(ActivityType.click, "Foo", div);
        await DOM.nextUpdate();

        pill = element.shadowRoot?.querySelector(".click-layer .pill");
        expect(pill.innerHTML).to.equal("Untitled");

        element.elementActivity(ActivityType.clear, "", div);
        await DOM.nextUpdate();

        const selectClear = element.shadowRoot?.querySelector(".click-layer");
        expect(selectClear.classList.contains("active")).to.equal(false);

        const pillClear = element.shadowRoot?.querySelector(".click-layer .pill");
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

        const hover = element.shadowRoot?.querySelector(".hover-layer");
        expect(hover.classList.contains("active")).to.equal(true);

        let pill = element.shadowRoot?.querySelector(".hover-layer .pill");
        expect(pill.innerHTML).to.equal("Untitled");

        element.dataDictionary = null;
        element.elementActivity(ActivityType.hover, "Foo", div);
        await DOM.nextUpdate();

        pill = element.shadowRoot?.querySelector(".hover-layer .pill");
        expect(pill.innerHTML).to.equal("Untitled");

        element.elementActivity(ActivityType.blur, "", div);
        await DOM.nextUpdate();

        const hoverBlur = element.shadowRoot?.querySelector(".hover-layer");
        expect(hoverBlur.classList.contains("active")).to.equal(false);

        const pillBlur = element.shadowRoot?.querySelector(".hover-layer .pill");
        expect(pillBlur.innerHTML).to.equal("");

        await disconnect();
    });
});
