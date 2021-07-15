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
import { DOM } from "@microsoft/fast-element";
import { expect } from "chai";
import { fixture } from "../../__test__/fixture";
import { MessageSystem, MessageSystemType } from "../../message-system";
import dataDictionaryConfig from "../../__test__/html-render/data-dictionary-config";
import schemaDictionary from "../../__test__/html-render/schema-dictionary";
import { ActivityType } from "../html-render-layer/html-render-layer";
import { fastToolingHTMLRenderLayerNavigation } from "./";
/* eslint-disable-next-line @typescript-eslint/no-var-requires */
const FASTMessageSystemWorker = require("../../../message-system.min.js");
const fastMessageSystemWorker = new FASTMessageSystemWorker();
const wait = () => new Promise(done => setTimeout(done, 20));
function setup() {
    return __awaiter(this, void 0, void 0, function* () {
        const { element, connect, disconnect, parent } = yield fixture(
            fastToolingHTMLRenderLayerNavigation()
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
        element.messageSystem = message;
        return { element, connect, disconnect, messageSystemHasBeenCalled, parent };
    });
}
xdescribe("HTMLRenderLayerNavgation", () => {
    it("should handle click / clear", () =>
        __awaiter(void 0, void 0, void 0, function* () {
            var _a, _b, _c, _d, _e;
            const {
                element,
                connect,
                messageSystemHasBeenCalled,
                disconnect,
                parent,
            } = yield setup();
            yield connect();
            yield messageSystemHasBeenCalled();
            yield DOM.nextUpdate();
            const div = document.createElement("div");
            parent.appendChild(div);
            element.elementActivity("test", ActivityType.click, "root", div);
            yield DOM.nextUpdate();
            const select =
                (_a = element.shadowRoot) === null || _a === void 0
                    ? void 0
                    : _a.querySelector(".click-layer");
            expect(select.classList.contains("active")).to.equal(true);
            let pill =
                (_b = element.shadowRoot) === null || _b === void 0
                    ? void 0
                    : _b.querySelector(".click-layer .pill");
            expect(pill.innerHTML).to.equal(schemaDictionary["div"].title);
            element.dataDictionary = null;
            element.elementActivity("test", ActivityType.click, "root", div);
            yield DOM.nextUpdate();
            pill =
                (_c = element.shadowRoot) === null || _c === void 0
                    ? void 0
                    : _c.querySelector(".click-layer .pill");
            expect(pill.innerHTML).to.equal("Untitled");
            element.elementActivity("test", ActivityType.clear, "", div);
            yield DOM.nextUpdate();
            const selectClear =
                (_d = element.shadowRoot) === null || _d === void 0
                    ? void 0
                    : _d.querySelector(".click-layer");
            expect(selectClear.classList.contains("active")).to.equal(false);
            const pillClear =
                (_e = element.shadowRoot) === null || _e === void 0
                    ? void 0
                    : _e.querySelector(".click-layer .pill");
            expect(pillClear.innerHTML).to.equal("");
            yield disconnect();
        }));
    it("should handle hover / blur", () =>
        __awaiter(void 0, void 0, void 0, function* () {
            var _f, _g, _h, _j, _k;
            const {
                element,
                connect,
                messageSystemHasBeenCalled,
                disconnect,
                parent,
            } = yield setup();
            yield connect();
            yield messageSystemHasBeenCalled();
            yield DOM.nextUpdate();
            const div = document.createElement("div");
            parent.appendChild(div);
            element.elementActivity("test", ActivityType.hover, "root", div);
            yield DOM.nextUpdate();
            const hover =
                (_f = element.shadowRoot) === null || _f === void 0
                    ? void 0
                    : _f.querySelector(".hover-layer");
            expect(hover.classList.contains("active")).to.equal(true);
            let pill =
                (_g = element.shadowRoot) === null || _g === void 0
                    ? void 0
                    : _g.querySelector(".hover-layer .pill");
            expect(pill.innerHTML).to.equal(schemaDictionary["div"].title);
            element.dataDictionary = null;
            element.elementActivity("test", ActivityType.hover, "root", div);
            yield DOM.nextUpdate();
            pill =
                (_h = element.shadowRoot) === null || _h === void 0
                    ? void 0
                    : _h.querySelector(".hover-layer .pill");
            expect(pill.innerHTML).to.equal("Untitled");
            element.elementActivity("test", ActivityType.blur, "", div);
            yield DOM.nextUpdate();
            const hoverBlur =
                (_j = element.shadowRoot) === null || _j === void 0
                    ? void 0
                    : _j.querySelector(".hover-layer");
            expect(hoverBlur.classList.contains("active")).to.equal(false);
            const pillBlur =
                (_k = element.shadowRoot) === null || _k === void 0
                    ? void 0
                    : _k.querySelector(".hover-layer .pill");
            expect(pillBlur.innerHTML).to.equal("");
            yield disconnect();
        }));
    it("should handle scroll", () =>
        __awaiter(void 0, void 0, void 0, function* () {
            var _l, _m, _o, _p;
            const {
                element,
                connect,
                messageSystemHasBeenCalled,
                disconnect,
                parent,
            } = yield setup();
            yield connect();
            yield messageSystemHasBeenCalled();
            yield DOM.nextUpdate();
            const div = document.createElement("div");
            parent.appendChild(div);
            element.elementActivity("test", ActivityType.hover, "root", div);
            yield DOM.nextUpdate();
            const hover =
                (_l = element.shadowRoot) === null || _l === void 0
                    ? void 0
                    : _l.querySelector(".hover-layer");
            expect(hover.classList.contains("active")).to.equal(true);
            const scrollEvent = document.createEvent("CustomEvent"); // MUST be 'CustomEvent'
            scrollEvent.initCustomEvent("scroll", false, false, null);
            window.dispatchEvent(scrollEvent);
            yield wait();
            yield DOM.nextUpdate();
            const hoverBlur =
                (_m = element.shadowRoot) === null || _m === void 0
                    ? void 0
                    : _m.querySelector(".hover-layer");
            expect(hoverBlur.classList.contains("active")).to.equal(false);
            element.elementActivity("test", ActivityType.click, "root", div);
            yield DOM.nextUpdate();
            const select =
                (_o = element.shadowRoot) === null || _o === void 0
                    ? void 0
                    : _o.querySelector(".click-layer");
            expect(select.classList.contains("active")).to.equal(true);
            window.dispatchEvent(scrollEvent);
            yield wait();
            yield DOM.nextUpdate();
            const selectScroll =
                (_p = element.shadowRoot) === null || _p === void 0
                    ? void 0
                    : _p.querySelector(".click-layer");
            expect(selectScroll.classList.contains("active")).to.equal(false);
            yield disconnect();
        }));
});
