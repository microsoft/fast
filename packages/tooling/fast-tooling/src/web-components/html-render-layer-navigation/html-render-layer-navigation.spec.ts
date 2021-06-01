import { DOM } from "@microsoft/fast-element";
import { expect } from "chai";
import { fixture } from "../fixture";
import { MessageSystem, MessageSystemType } from "../../message-system";
import dataDictionaryConfig from "../../__test__/html-render/data-dictionary-config";
import schemaDictionary from "../../__test__/html-render/schema-dictionary";
import { ActivityType } from "../html-render-layer/html-render-layer";
import { HTMLRenderLayerNavgation } from "./html-render-layer-navigation";

HTMLRenderLayerNavgation;

/* eslint-disable-next-line @typescript-eslint/no-var-requires */
const FASTMessageSystemWorker = require("../../../message-system.min.js");

const fastMessageSystemWorker = new FASTMessageSystemWorker();

const wait = () => new Promise(done => setTimeout(done, 20));

async function setup() {
    const { element, connect, disconnect, parent } = await fixture<
        HTMLRenderLayerNavgation
    >("fast-tooling-html-render-layer-navigation");
    const message = new MessageSystem({
        webWorker: fastMessageSystemWorker,
    });

    let hasBeenCalled = false;
    let intervalInstance;

    async function messageSystemHasBeenCalled() {
        return new Promise(resolve => {
            // Continue checking to see if a message has been set
            intervalInstance = window.setInterval(() => {
                if (hasBeenCalled) {
                    resolve(true);
                    hasBeenCalled = false;
                    window.clearInterval(intervalInstance);
                }
            }, 5);
        });
    }

    const messageSystemCallback = {
        onMessage: e => {
            // This function is used for monitoring to ensure
            // the initialization (or other message) is called
            // and provided in the return to await any further messages
            hasBeenCalled = true;
        },
    };

    message.add(messageSystemCallback);

    /**
     * Give this a set timeout so initialize can always happen after
     * component connect has been checked
     */
    window.setTimeout(() => {
        message.postMessage({
            type: MessageSystemType.initialize,
            dataDictionary: dataDictionaryConfig as any,
            schemaDictionary,
        });
    }, 20);

    element.messageSystem = message;
    return { element, connect, disconnect, messageSystemHasBeenCalled, parent };
}

xdescribe("HTMLRenderLayerNavgation", () => {
    it("should handle click / clear", async () => {
        const {
            element,
            connect,
            messageSystemHasBeenCalled,
            disconnect,
            parent,
        } = await setup();

        await connect();
        await messageSystemHasBeenCalled();
        await DOM.nextUpdate();

        const div = document.createElement("div");
        parent.appendChild(div);

        element.elementActivity("test", ActivityType.click, "root", div);
        await DOM.nextUpdate();

        const select = element.shadowRoot?.querySelector(".click-layer");
        expect(select.classList.contains("active")).to.equal(true);

        let pill = element.shadowRoot?.querySelector(".click-layer .pill");
        expect(pill.innerHTML).to.equal(schemaDictionary["div"].title);

        element.dataDictionary = null;
        element.elementActivity("test", ActivityType.click, "root", div);
        await DOM.nextUpdate();

        pill = element.shadowRoot?.querySelector(".click-layer .pill");
        expect(pill.innerHTML).to.equal("Untitled");

        element.elementActivity("test", ActivityType.clear, "", div);
        await DOM.nextUpdate();

        const selectClear = element.shadowRoot?.querySelector(".click-layer");
        expect(selectClear.classList.contains("active")).to.equal(false);

        const pillClear = element.shadowRoot?.querySelector(".click-layer .pill");
        expect(pillClear.innerHTML).to.equal("");

        await disconnect();
    });

    it("should handle hover / blur", async () => {
        const {
            element,
            connect,
            messageSystemHasBeenCalled,
            disconnect,
            parent,
        } = await setup();

        await connect();
        await messageSystemHasBeenCalled();
        await DOM.nextUpdate();

        const div = document.createElement("div");
        parent.appendChild(div);

        element.elementActivity("test", ActivityType.hover, "root", div);
        await DOM.nextUpdate();

        const hover = element.shadowRoot?.querySelector(".hover-layer");
        expect(hover.classList.contains("active")).to.equal(true);

        let pill = element.shadowRoot?.querySelector(".hover-layer .pill");
        expect(pill.innerHTML).to.equal(schemaDictionary["div"].title);

        element.dataDictionary = null;
        element.elementActivity("test", ActivityType.hover, "root", div);
        await DOM.nextUpdate();

        pill = element.shadowRoot?.querySelector(".hover-layer .pill");
        expect(pill.innerHTML).to.equal("Untitled");

        element.elementActivity("test", ActivityType.blur, "", div);
        await DOM.nextUpdate();

        const hoverBlur = element.shadowRoot?.querySelector(".hover-layer");
        expect(hoverBlur.classList.contains("active")).to.equal(false);

        const pillBlur = element.shadowRoot?.querySelector(".hover-layer .pill");
        expect(pillBlur.innerHTML).to.equal("");

        await disconnect();
    });
    it("should handle scroll", async () => {
        const {
            element,
            connect,
            messageSystemHasBeenCalled,
            disconnect,
            parent,
        } = await setup();

        await connect();
        await messageSystemHasBeenCalled();
        await DOM.nextUpdate();

        const div = document.createElement("div");
        parent.appendChild(div);

        element.elementActivity("test", ActivityType.hover, "root", div);
        await DOM.nextUpdate();

        const hover = element.shadowRoot?.querySelector(".hover-layer");
        expect(hover.classList.contains("active")).to.equal(true);

        const scrollEvent = document.createEvent("CustomEvent"); // MUST be 'CustomEvent'
        scrollEvent.initCustomEvent("scroll", false, false, null);

        window.dispatchEvent(scrollEvent);
        await wait();
        await DOM.nextUpdate();

        const hoverBlur = element.shadowRoot?.querySelector(".hover-layer");
        expect(hoverBlur.classList.contains("active")).to.equal(false);

        element.elementActivity("test", ActivityType.click, "root", div);
        await DOM.nextUpdate();

        const select = element.shadowRoot?.querySelector(".click-layer");
        expect(select.classList.contains("active")).to.equal(true);

        window.dispatchEvent(scrollEvent);
        await wait();
        await DOM.nextUpdate();

        const selectScroll = element.shadowRoot?.querySelector(".click-layer");
        expect(selectScroll.classList.contains("active")).to.equal(false);

        await disconnect();
    });
});
