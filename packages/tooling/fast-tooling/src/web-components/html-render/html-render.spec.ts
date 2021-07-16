import { DOM, html, ViewTemplate } from "@microsoft/fast-element";
import { expect } from "chai";
import { DesignSystem, ElementDefinitionContext } from "@microsoft/fast-foundation";
import { fixture } from "../../__test__/fixture";
import {
    MessageSystem,
    MessageSystemNavigationTypeAction,
    MessageSystemType,
} from "../../message-system";
import dataDictionaryConfig from "../../__test__/html-render/data-dictionary-config";
import schemaDictionary from "../../__test__/html-render/schema-dictionary";
import { nativeElementDefinitions } from "../../definitions";
import { ActivityType, HTMLRenderLayer } from "../html-render-layer/html-render-layer";
import { HTMLRender, htmlRenderOriginatorId } from "./html-render";
import { fastToolingHTMLRender } from "./";
HTMLRender;
HTMLRenderLayer;

/* eslint-disable-next-line @typescript-eslint/no-var-requires */
const FASTMessageSystemWorker = require("../../../message-system.min.js");

const fastMessageSystemWorker = new FASTMessageSystemWorker();

class ActivityResult {
    public activityType: ActivityType;
    public datadictionaryId: string;
    constructor(activity: ActivityType, dataid: string) {
        this.activityType = activity;
        this.datadictionaryId = dataid;
    }
}

export class HTMLRenderLayerTest extends HTMLRenderLayer {
    public layerActivityId: string = "testLayer";
    public lastActivity: ActivityResult = null;

    public elementActivity(
        layerActivityId: string,
        activityType: ActivityType,
        datadictionaryId: string,
        elementRef: HTMLElement
    ) {
        this.lastActivity = new ActivityResult(activityType, datadictionaryId);
    }
}

export const HTMLRenderLayerNavigationTemplate: (
    context: ElementDefinitionContext
) => ViewTemplate<HTMLRenderLayerTest> = context => html<HTMLRenderLayerTest>`
    <div id="testContainer"></div>
`;

const fastToolingHTMLRenderLayerTest = HTMLRenderLayerTest.compose({
    baseName: "html-render-layer-test",
    template: HTMLRenderLayerNavigationTemplate,
});

async function setup() {
    const { element, connect, disconnect } = await fixture<HTMLRender>(
        html`
            <fast-tooling-html-render>
                <fast-tooling-html-render-layer-test
                    role="htmlrenderlayer"
                ></fast-tooling-html-render-layer-test>
            </fast-tooling-html-render>
        `,
        {
            designSystem: DesignSystem.getOrCreate()
                .withPrefix("fast-tooling")
                .register(fastToolingHTMLRender(), fastToolingHTMLRenderLayerTest()),
        }
    );
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

    element.markupDefinitions = Object.values(nativeElementDefinitions);
    element.messageSystem = message;

    return { element, messageSystemHasBeenCalled, connect, disconnect, message };
}

xdescribe("HTMLRender", () => {
    it("should initialize and render", async () => {
        const {
            element,
            connect,
            messageSystemHasBeenCalled,
            disconnect,
        } = await setup();
        await connect();
        await messageSystemHasBeenCalled();
        await DOM.nextUpdate();

        expect(element.layers).to.not.be.null;
        expect(element.querySelector("[role=htmlrenderlayer]")).to.not.be.null;
        const el = element.shadowRoot?.querySelector("[data-datadictionaryid=root]");
        expect(el).to.not.be.null;

        await disconnect();
    });
    it("should send navigation on click", async () => {
        const {
            element,
            connect,
            messageSystemHasBeenCalled,
            disconnect,
            message,
        } = await setup();
        let messageSent: boolean = false;

        message.add({
            onMessage: (e: MessageEvent): void => {
                if (
                    e.data.type === MessageSystemType.navigation &&
                    e.data.action === MessageSystemNavigationTypeAction.update &&
                    e.data.options &&
                    e.data.options.originatorId === htmlRenderOriginatorId &&
                    e.data.activeDictionaryId === "root"
                ) {
                    messageSent = true;
                }
            },
        });

        await connect();
        await messageSystemHasBeenCalled();
        await DOM.nextUpdate();

        const el: HTMLElement = element.shadowRoot?.querySelector(
            "[data-datadictionaryid=root]"
        );
        expect(el).to.not.be.null;
        el.click();
        await DOM.nextUpdate();

        expect(messageSent).to.equal(true);

        await disconnect();
    });
    it("should send navigation on tab", async () => {
        const {
            element,
            connect,
            messageSystemHasBeenCalled,
            disconnect,
            message,
        } = await setup();
        let messageSent: string = "";

        message.add({
            onMessage: (e: MessageEvent): void => {
                if (
                    e.data.type === MessageSystemType.navigation &&
                    e.data.action === MessageSystemNavigationTypeAction.update &&
                    e.data.options &&
                    e.data.options.originatorId === htmlRenderOriginatorId
                ) {
                    messageSent = e.data.activeDictionaryId;
                }
            },
        });

        await connect();
        await messageSystemHasBeenCalled();
        await DOM.nextUpdate();

        const container: HTMLElement = element.shadowRoot?.querySelector(".html-render");
        expect(container).to.not.be.null;
        container.focus();
        container.dispatchEvent(new KeyboardEvent("keyup", { key: "Tab" }));
        await DOM.nextUpdate();

        expect(messageSent).to.equal("root");
        messageSent = "";

        container.dispatchEvent(new KeyboardEvent("keyup", { key: "Tab" }));
        await DOM.nextUpdate();

        expect(messageSent).to.equal("span");

        container.dispatchEvent(
            new KeyboardEvent("keyup", { key: "Tab", shiftKey: true })
        );
        await DOM.nextUpdate();

        expect(messageSent).to.equal("root");

        container.dispatchEvent(new KeyboardEvent("keydown", { key: "Tab" }));
        await DOM.nextUpdate();

        expect(messageSent).to.equal("root");

        container.dispatchEvent(new KeyboardEvent("keyup", { key: "Tab" }));
        await DOM.nextUpdate();
        messageSent = "";
        container.dispatchEvent(new KeyboardEvent("keyup", { key: "Tab" }));
        await DOM.nextUpdate();
        expect(messageSent).to.equal("");

        container.dispatchEvent(
            new KeyboardEvent("keyup", { key: "Tab", shiftKey: true })
        );
        await DOM.nextUpdate();

        expect(messageSent).to.equal("span");

        container.dispatchEvent(new KeyboardEvent("keyup", { key: "a" }));
        await DOM.nextUpdate();

        expect(messageSent).to.equal("span");

        await disconnect();
    });
    it("should send clear navigation on container click", async () => {
        const {
            element,
            connect,
            messageSystemHasBeenCalled,
            disconnect,
            message,
        } = await setup();
        let messageSent: boolean = false;

        message.add({
            onMessage: (e: MessageEvent): void => {
                if (
                    e.data.type === MessageSystemType.navigation &&
                    e.data.action === MessageSystemNavigationTypeAction.update &&
                    e.data.options &&
                    e.data.options.originatorId === htmlRenderOriginatorId &&
                    e.data.activeDictionaryId === ""
                ) {
                    messageSent = true;
                }
            },
        });

        await connect();
        await messageSystemHasBeenCalled();
        await DOM.nextUpdate();

        const container: HTMLElement = element.shadowRoot?.querySelector(".html-render");
        expect(container).to.not.be.null;
        container.focus();
        container.click();
        await DOM.nextUpdate();

        expect(messageSent).to.equal(true);

        await disconnect();
    });
    it("should send click / clear activity to layers", async () => {
        const {
            element,
            connect,
            messageSystemHasBeenCalled,
            disconnect,
        } = await setup();
        await connect();
        await messageSystemHasBeenCalled();
        await DOM.nextUpdate();

        const el: HTMLElement = element.shadowRoot?.querySelector(
            "[data-datadictionaryid=root]"
        );
        expect(el).to.not.be.null;
        el.click();
        await DOM.nextUpdate();

        let activity: ActivityResult = (element.querySelector(
            "[role=htmlrenderlayer]"
        ) as HTMLRenderLayerTest).lastActivity;
        expect(activity).to.not.be.null;
        expect(activity.activityType === ActivityType.click).to.equal(true);
        expect(activity.datadictionaryId).to.equal("root");
        (element.querySelector(
            "[role=htmlrenderlayer]"
        ) as HTMLRenderLayerTest).lastActivity = null;

        const container: HTMLElement = element.shadowRoot?.querySelector(".html-render");
        expect(container).to.not.be.null;
        container.click();
        await DOM.nextUpdate();

        activity = (element.querySelector(
            "[role=htmlrenderlayer]"
        ) as HTMLRenderLayerTest).lastActivity;
        expect(activity).to.not.be.null;
        expect(activity.activityType === ActivityType.clear).to.equal(true);
        expect(activity.datadictionaryId).to.equal("");
        (element.querySelector(
            "[role=htmlrenderlayer]"
        ) as HTMLRenderLayerTest).lastActivity = null;

        await disconnect();
    });
    it("should send hover / blur activity to layers", async () => {
        const {
            element,
            connect,
            messageSystemHasBeenCalled,
            disconnect,
        } = await setup();
        await connect();
        await messageSystemHasBeenCalled();
        await DOM.nextUpdate();

        const el = element.shadowRoot?.querySelector("[data-datadictionaryid=root]");
        expect(el).to.not.be.null;
        element.hoverHandler({
            composedPath: () => {
                return [el];
            },
        } as any);
        await DOM.nextUpdate();

        let activity: ActivityResult = (element.querySelector(
            "[role=htmlrenderlayer]"
        ) as HTMLRenderLayerTest).lastActivity;
        expect(activity).to.not.be.null;
        expect(activity.activityType === ActivityType.hover).to.equal(true);
        expect(activity.datadictionaryId).to.equal("root");
        (element.querySelector(
            "[role=htmlrenderlayer]"
        ) as HTMLRenderLayerTest).lastActivity = null;

        element.blurHandler({} as any);
        await DOM.nextUpdate();

        activity = (element.querySelector(
            "[role=htmlrenderlayer]"
        ) as HTMLRenderLayerTest).lastActivity;
        expect(activity).to.not.be.null;
        expect(activity.activityType === ActivityType.blur).to.equal(true);
        expect(activity.datadictionaryId).to.equal("");
        (element.querySelector(
            "[role=htmlrenderlayer]"
        ) as HTMLRenderLayerTest).lastActivity = null;

        await disconnect();
    });
    it("should not send hover activity on clicked elements to layers", async () => {
        const {
            element,
            connect,
            messageSystemHasBeenCalled,
            disconnect,
        } = await setup();
        await connect();
        await messageSystemHasBeenCalled();
        await DOM.nextUpdate();

        const el: HTMLElement = element.shadowRoot?.querySelector(
            "[data-datadictionaryid=root]"
        );
        expect(el).to.not.be.null;
        el.click();
        await DOM.nextUpdate();

        element.hoverHandler({
            composedPath: () => {
                return [el];
            },
        } as any);
        await DOM.nextUpdate();
        const activity: ActivityResult = (element.querySelector(
            "[role=htmlrenderlayer]"
        ) as HTMLRenderLayerTest).lastActivity;
        expect(activity).to.not.be.null;
        expect(activity.activityType === ActivityType.click).to.equal(true);
        expect(activity.datadictionaryId).to.equal("root");

        await disconnect();
    });
    it("should send click activity to layers when nagivation message recieved", async () => {
        const {
            element,
            connect,
            disconnect,
            message,
            messageSystemHasBeenCalled,
        } = await setup();
        await connect();
        await messageSystemHasBeenCalled();
        await DOM.nextUpdate();

        window.setTimeout(() => {
            message.postMessage({
                type: MessageSystemType.navigation,
                action: MessageSystemNavigationTypeAction.update,
                activeDictionaryId: "root",
                activeNavigationConfigId: "",
            });
        }, 20);

        await messageSystemHasBeenCalled();

        await DOM.nextUpdate();
        const activity: ActivityResult = (element.querySelector(
            "[role=htmlrenderlayer]"
        ) as HTMLRenderLayerTest).lastActivity;
        expect(activity).to.not.be.null;
        expect(activity.activityType === ActivityType.click).to.equal(true);
        expect(activity.datadictionaryId).to.equal("root");
        (element.querySelector(
            "[role=htmlrenderlayer]"
        ) as HTMLRenderLayerTest).lastActivity = null;

        await disconnect();
    });
});
