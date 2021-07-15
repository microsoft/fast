var __awaiter =
    (this && this.__awaiter) ||
    function (thisArg, _arguments, P, generator) {
        function adopt(value) {
            return value instanceof P
                ? value
                : new P(function (resolve) {
                      resolve(value);
                  });
        }
        return new (P || (P = Promise))(function (resolve, reject) {
            function fulfilled(value) {
                try {
                    step(generator.next(value));
                } catch (e) {
                    reject(e);
                }
            }
            function rejected(value) {
                try {
                    step(generator["throw"](value));
                } catch (e) {
                    reject(e);
                }
            }
            function step(result) {
                result.done
                    ? resolve(result.value)
                    : adopt(result.value).then(fulfilled, rejected);
            }
            step((generator = generator.apply(thisArg, _arguments || [])).next());
        });
    };
import { DOM, html } from "@microsoft/fast-element";
import { expect } from "chai";
import { DesignSystem } from "@microsoft/fast-foundation";
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
import { HTMLRender, HTMLRenderOriginatorId } from "./html-render";
import { fastToolingHTMLRender } from "./";
HTMLRender;
HTMLRenderLayer;
/* eslint-disable-next-line @typescript-eslint/no-var-requires */
const FASTMessageSystemWorker = require("../../../message-system.min.js");
const fastMessageSystemWorker = new FASTMessageSystemWorker();
class ActivityResult {
    constructor(activity, dataid) {
        this.activityType = activity;
        this.datadictionaryId = dataid;
    }
}
export class HTMLRenderLayerTest extends HTMLRenderLayer {
    constructor() {
        super(...arguments);
        this.layerActivityId = "testLayer";
        this.lastActivity = null;
    }
    elementActivity(layerActivityId, activityType, datadictionaryId, elementRef) {
        this.lastActivity = new ActivityResult(activityType, datadictionaryId);
    }
}
export const HTMLRenderLayerNavigationTemplate = context => html`
    <div id="testContainer"></div>
`;
const fastToolingHTMLRenderLayerTest = HTMLRenderLayerTest.compose({
    baseName: "html-render-layer-test",
    template: HTMLRenderLayerNavigationTemplate,
});
function setup() {
    return __awaiter(this, void 0, void 0, function* () {
        const { element, connect, disconnect } = yield fixture(
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
        function messageSystemHasBeenCalled() {
            return __awaiter(this, void 0, void 0, function* () {
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
                dataDictionary: dataDictionaryConfig,
                schemaDictionary,
            });
        }, 20);
        element.markupDefinitions = Object.values(nativeElementDefinitions);
        element.messageSystem = message;
        return { element, messageSystemHasBeenCalled, connect, disconnect, message };
    });
}
xdescribe("HTMLRender", () => {
    it("should initialize and render", () =>
        __awaiter(void 0, void 0, void 0, function* () {
            var _a;
            const {
                element,
                connect,
                messageSystemHasBeenCalled,
                disconnect,
            } = yield setup();
            yield connect();
            yield messageSystemHasBeenCalled();
            yield DOM.nextUpdate();
            expect(element.layers).to.not.be.null;
            expect(element.querySelector("[role=htmlrenderlayer]")).to.not.be.null;
            const el =
                (_a = element.shadowRoot) === null || _a === void 0
                    ? void 0
                    : _a.querySelector("[data-datadictionaryid=root]");
            expect(el).to.not.be.null;
            yield disconnect();
        }));
    it("should send navigation on click", () =>
        __awaiter(void 0, void 0, void 0, function* () {
            var _b;
            const {
                element,
                connect,
                messageSystemHasBeenCalled,
                disconnect,
                message,
            } = yield setup();
            let messageSent = false;
            message.add({
                onMessage: e => {
                    if (
                        e.data.type === MessageSystemType.navigation &&
                        e.data.action === MessageSystemNavigationTypeAction.update &&
                        e.data.options &&
                        e.data.options.originatorId === HTMLRenderOriginatorId &&
                        e.data.activeDictionaryId === "root"
                    ) {
                        messageSent = true;
                    }
                },
            });
            yield connect();
            yield messageSystemHasBeenCalled();
            yield DOM.nextUpdate();
            const el =
                (_b = element.shadowRoot) === null || _b === void 0
                    ? void 0
                    : _b.querySelector("[data-datadictionaryid=root]");
            expect(el).to.not.be.null;
            el.click();
            yield DOM.nextUpdate();
            expect(messageSent).to.equal(true);
            yield disconnect();
        }));
    it("should send navigation on tab", () =>
        __awaiter(void 0, void 0, void 0, function* () {
            var _c;
            const {
                element,
                connect,
                messageSystemHasBeenCalled,
                disconnect,
                message,
            } = yield setup();
            let messageSent = "";
            message.add({
                onMessage: e => {
                    if (
                        e.data.type === MessageSystemType.navigation &&
                        e.data.action === MessageSystemNavigationTypeAction.update &&
                        e.data.options &&
                        e.data.options.originatorId === HTMLRenderOriginatorId
                    ) {
                        messageSent = e.data.activeDictionaryId;
                    }
                },
            });
            yield connect();
            yield messageSystemHasBeenCalled();
            yield DOM.nextUpdate();
            const container =
                (_c = element.shadowRoot) === null || _c === void 0
                    ? void 0
                    : _c.querySelector(".html-render");
            expect(container).to.not.be.null;
            container.focus();
            container.dispatchEvent(new KeyboardEvent("keyup", { key: "Tab" }));
            yield DOM.nextUpdate();
            expect(messageSent).to.equal("root");
            messageSent = "";
            container.dispatchEvent(new KeyboardEvent("keyup", { key: "Tab" }));
            yield DOM.nextUpdate();
            expect(messageSent).to.equal("span");
            container.dispatchEvent(
                new KeyboardEvent("keyup", { key: "Tab", shiftKey: true })
            );
            yield DOM.nextUpdate();
            expect(messageSent).to.equal("root");
            container.dispatchEvent(new KeyboardEvent("keydown", { key: "Tab" }));
            yield DOM.nextUpdate();
            expect(messageSent).to.equal("root");
            container.dispatchEvent(new KeyboardEvent("keyup", { key: "Tab" }));
            yield DOM.nextUpdate();
            messageSent = "";
            container.dispatchEvent(new KeyboardEvent("keyup", { key: "Tab" }));
            yield DOM.nextUpdate();
            expect(messageSent).to.equal("");
            container.dispatchEvent(
                new KeyboardEvent("keyup", { key: "Tab", shiftKey: true })
            );
            yield DOM.nextUpdate();
            expect(messageSent).to.equal("span");
            container.dispatchEvent(new KeyboardEvent("keyup", { key: "a" }));
            yield DOM.nextUpdate();
            expect(messageSent).to.equal("span");
            yield disconnect();
        }));
    it("should send clear navigation on container click", () =>
        __awaiter(void 0, void 0, void 0, function* () {
            var _d;
            const {
                element,
                connect,
                messageSystemHasBeenCalled,
                disconnect,
                message,
            } = yield setup();
            let messageSent = false;
            message.add({
                onMessage: e => {
                    if (
                        e.data.type === MessageSystemType.navigation &&
                        e.data.action === MessageSystemNavigationTypeAction.update &&
                        e.data.options &&
                        e.data.options.originatorId === HTMLRenderOriginatorId &&
                        e.data.activeDictionaryId === ""
                    ) {
                        messageSent = true;
                    }
                },
            });
            yield connect();
            yield messageSystemHasBeenCalled();
            yield DOM.nextUpdate();
            const container =
                (_d = element.shadowRoot) === null || _d === void 0
                    ? void 0
                    : _d.querySelector(".html-render");
            expect(container).to.not.be.null;
            container.focus();
            container.click();
            yield DOM.nextUpdate();
            expect(messageSent).to.equal(true);
            yield disconnect();
        }));
    it("should send click / clear activity to layers", () =>
        __awaiter(void 0, void 0, void 0, function* () {
            var _e, _f;
            const {
                element,
                connect,
                messageSystemHasBeenCalled,
                disconnect,
            } = yield setup();
            yield connect();
            yield messageSystemHasBeenCalled();
            yield DOM.nextUpdate();
            const el =
                (_e = element.shadowRoot) === null || _e === void 0
                    ? void 0
                    : _e.querySelector("[data-datadictionaryid=root]");
            expect(el).to.not.be.null;
            el.click();
            yield DOM.nextUpdate();
            let activity = element.querySelector("[role=htmlrenderlayer]").lastActivity;
            expect(activity).to.not.be.null;
            expect(activity.activityType === ActivityType.click).to.equal(true);
            expect(activity.datadictionaryId).to.equal("root");
            element.querySelector("[role=htmlrenderlayer]").lastActivity = null;
            const container =
                (_f = element.shadowRoot) === null || _f === void 0
                    ? void 0
                    : _f.querySelector(".html-render");
            expect(container).to.not.be.null;
            container.click();
            yield DOM.nextUpdate();
            activity = element.querySelector("[role=htmlrenderlayer]").lastActivity;
            expect(activity).to.not.be.null;
            expect(activity.activityType === ActivityType.clear).to.equal(true);
            expect(activity.datadictionaryId).to.equal("");
            element.querySelector("[role=htmlrenderlayer]").lastActivity = null;
            yield disconnect();
        }));
    it("should send hover / blur activity to layers", () =>
        __awaiter(void 0, void 0, void 0, function* () {
            var _g;
            const {
                element,
                connect,
                messageSystemHasBeenCalled,
                disconnect,
            } = yield setup();
            yield connect();
            yield messageSystemHasBeenCalled();
            yield DOM.nextUpdate();
            const el =
                (_g = element.shadowRoot) === null || _g === void 0
                    ? void 0
                    : _g.querySelector("[data-datadictionaryid=root]");
            expect(el).to.not.be.null;
            element.hoverHandler({
                composedPath: () => {
                    return [el];
                },
            });
            yield DOM.nextUpdate();
            let activity = element.querySelector("[role=htmlrenderlayer]").lastActivity;
            expect(activity).to.not.be.null;
            expect(activity.activityType === ActivityType.hover).to.equal(true);
            expect(activity.datadictionaryId).to.equal("root");
            element.querySelector("[role=htmlrenderlayer]").lastActivity = null;
            element.blurHandler({});
            yield DOM.nextUpdate();
            activity = element.querySelector("[role=htmlrenderlayer]").lastActivity;
            expect(activity).to.not.be.null;
            expect(activity.activityType === ActivityType.blur).to.equal(true);
            expect(activity.datadictionaryId).to.equal("");
            element.querySelector("[role=htmlrenderlayer]").lastActivity = null;
            yield disconnect();
        }));
    it("should not send hover activity on clicked elements to layers", () =>
        __awaiter(void 0, void 0, void 0, function* () {
            var _h;
            const {
                element,
                connect,
                messageSystemHasBeenCalled,
                disconnect,
            } = yield setup();
            yield connect();
            yield messageSystemHasBeenCalled();
            yield DOM.nextUpdate();
            const el =
                (_h = element.shadowRoot) === null || _h === void 0
                    ? void 0
                    : _h.querySelector("[data-datadictionaryid=root]");
            expect(el).to.not.be.null;
            el.click();
            yield DOM.nextUpdate();
            element.hoverHandler({
                composedPath: () => {
                    return [el];
                },
            });
            yield DOM.nextUpdate();
            const activity = element.querySelector("[role=htmlrenderlayer]").lastActivity;
            expect(activity).to.not.be.null;
            expect(activity.activityType === ActivityType.click).to.equal(true);
            expect(activity.datadictionaryId).to.equal("root");
            yield disconnect();
        }));
    it("should send click activity to layers when nagivation message recieved", () =>
        __awaiter(void 0, void 0, void 0, function* () {
            const {
                element,
                connect,
                disconnect,
                message,
                messageSystemHasBeenCalled,
            } = yield setup();
            yield connect();
            yield messageSystemHasBeenCalled();
            yield DOM.nextUpdate();
            window.setTimeout(() => {
                message.postMessage({
                    type: MessageSystemType.navigation,
                    action: MessageSystemNavigationTypeAction.update,
                    activeDictionaryId: "root",
                    activeNavigationConfigId: "",
                });
            }, 20);
            yield messageSystemHasBeenCalled();
            yield DOM.nextUpdate();
            const activity = element.querySelector("[role=htmlrenderlayer]").lastActivity;
            expect(activity).to.not.be.null;
            expect(activity.activityType === ActivityType.click).to.equal(true);
            expect(activity.datadictionaryId).to.equal("root");
            element.querySelector("[role=htmlrenderlayer]").lastActivity = null;
            yield disconnect();
        }));
});
