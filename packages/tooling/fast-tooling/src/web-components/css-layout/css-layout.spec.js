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
import { fastSwitch } from "@microsoft/fast-components";
import { DOM } from "@microsoft/fast-element";
import { DesignSystem } from "@microsoft/fast-foundation";
import { expect } from "chai";
import { fixture } from "../../__test__/fixture";
import { fastToolingCSSLayout } from ".";
function setup() {
    return __awaiter(this, void 0, void 0, function* () {
        const { element, connect, disconnect } = yield fixture(fastToolingCSSLayout(), {
            designSystem: DesignSystem.getOrCreate().register(fastSwitch()),
        });
        return { element, connect, disconnect };
    });
}
describe("CSSLayout", () => {
    it("should only show the flexbox toggle when it has not been pressed", () =>
        __awaiter(void 0, void 0, void 0, function* () {
            var _a;
            const { element, connect, disconnect } = yield setup();
            yield connect();
            const controlRegion =
                (_a = element.shadowRoot) === null || _a === void 0
                    ? void 0
                    : _a.querySelector(".flexbox-controls");
            expect(controlRegion.classList.contains("active")).to.equal(false);
            yield disconnect();
        }));
    it("should show the entire suite of flexbox controls with the flexbox toggle has been pressed", () =>
        __awaiter(void 0, void 0, void 0, function* () {
            var _b, _c;
            const { element, connect, disconnect } = yield setup();
            yield connect();
            const toggle =
                (_b = element.shadowRoot) === null || _b === void 0
                    ? void 0
                    : _b.querySelector("fast-switch");
            const toggleEvent = new Event("click", {});
            toggle.dispatchEvent(toggleEvent);
            const controlRegion =
                (_c = element.shadowRoot) === null || _c === void 0
                    ? void 0
                    : _c.querySelector(".flexbox-controls");
            yield DOM.nextUpdate();
            expect(controlRegion.classList.contains("active")).to.equal(true);
            yield disconnect();
        }));
    it("should add display:flex when the flexbox toggle is triggered", () =>
        __awaiter(void 0, void 0, void 0, function* () {
            var _d;
            const { element, connect, disconnect } = yield setup();
            let css = "";
            yield connect();
            const toggle =
                (_d = element.shadowRoot) === null || _d === void 0
                    ? void 0
                    : _d.querySelector("fast-switch");
            const toggleEvent = new Event("click", {});
            element.addEventListener("change", e => {
                css = e.target.value;
            });
            toggle.dispatchEvent(toggleEvent);
            yield DOM.nextUpdate();
            expect(css).to.equal("display: flex;");
            yield disconnect();
        }));
    it("should emit an updated flex-direction value when the flex-direction value is updated", () =>
        __awaiter(void 0, void 0, void 0, function* () {
            var _e, _f;
            const { element, connect, disconnect } = yield setup();
            let css = "";
            yield connect();
            const toggle =
                (_e = element.shadowRoot) === null || _e === void 0
                    ? void 0
                    : _e.querySelector("fast-switch");
            const toggleEvent = new Event("click", {});
            element.addEventListener("change", e => {
                css = e.target.value;
            });
            toggle.dispatchEvent(toggleEvent);
            yield DOM.nextUpdate();
            const flexDirectionInput =
                (_f = element.shadowRoot) === null || _f === void 0
                    ? void 0
                    : _f.querySelector("input[name='flex-direction']");
            flexDirectionInput.click();
            yield DOM.nextUpdate();
            expect(css).to.equal("display: flex; flex-direction: row;");
            yield disconnect();
        }));
    it("should emit an updated justify-content value when the justify-content value is updated", () =>
        __awaiter(void 0, void 0, void 0, function* () {
            var _g, _h;
            const { element, connect, disconnect } = yield setup();
            let css = "";
            yield connect();
            const toggle =
                (_g = element.shadowRoot) === null || _g === void 0
                    ? void 0
                    : _g.querySelector("fast-switch");
            const toggleEvent = new Event("click", {});
            element.addEventListener("change", e => {
                css = e.target.value;
            });
            toggle.dispatchEvent(toggleEvent);
            yield DOM.nextUpdate();
            const justifyContentInput =
                (_h = element.shadowRoot) === null || _h === void 0
                    ? void 0
                    : _h.querySelector("input[name='justify-content']");
            justifyContentInput.click();
            yield DOM.nextUpdate();
            expect(css).to.equal("display: flex; justify-content: flex-start;");
            yield disconnect();
        }));
    it("should emit an updated align-content value when the align-content value is updated", () =>
        __awaiter(void 0, void 0, void 0, function* () {
            var _j, _k;
            const { element, connect, disconnect } = yield setup();
            let css = "";
            yield connect();
            const toggle =
                (_j = element.shadowRoot) === null || _j === void 0
                    ? void 0
                    : _j.querySelector("fast-switch");
            const toggleEvent = new Event("click", {});
            element.addEventListener("change", e => {
                css = e.target.value;
            });
            toggle.dispatchEvent(toggleEvent);
            yield DOM.nextUpdate();
            const alignContentInput =
                (_k = element.shadowRoot) === null || _k === void 0
                    ? void 0
                    : _k.querySelector("input[name='align-content']");
            alignContentInput.click();
            yield DOM.nextUpdate();
            expect(css).to.equal("display: flex; align-content: flex-start;");
            yield disconnect();
        }));
    it("should emit an updated align-items value when the align-items value is updated", () =>
        __awaiter(void 0, void 0, void 0, function* () {
            var _l, _m;
            const { element, connect, disconnect } = yield setup();
            let css = "";
            yield connect();
            const toggle =
                (_l = element.shadowRoot) === null || _l === void 0
                    ? void 0
                    : _l.querySelector("fast-switch");
            const toggleEvent = new Event("click", {});
            element.addEventListener("change", e => {
                css = e.target.value;
            });
            toggle.dispatchEvent(toggleEvent);
            yield DOM.nextUpdate();
            const alignItemsInput =
                (_m = element.shadowRoot) === null || _m === void 0
                    ? void 0
                    : _m.querySelector("input[name='align-items']");
            alignItemsInput.click();
            yield DOM.nextUpdate();
            expect(css).to.equal("display: flex; align-items: flex-start;");
            yield disconnect();
        }));
    it("should emit an updated row gap value when the row gap value has been updated", () =>
        __awaiter(void 0, void 0, void 0, function* () {
            var _o, _p;
            const { element, connect, disconnect } = yield setup();
            let css = "";
            yield connect();
            const toggle =
                (_o = element.shadowRoot) === null || _o === void 0
                    ? void 0
                    : _o.querySelector("fast-switch");
            const toggleEvent = new Event("click", {});
            element.addEventListener("change", e => {
                css = e.target.value;
            });
            toggle.dispatchEvent(toggleEvent);
            yield DOM.nextUpdate();
            const rowGapInput =
                (_p = element.shadowRoot) === null || _p === void 0
                    ? void 0
                    : _p.querySelector("input.css-row-gap");
            rowGapInput.setAttribute("value", "5");
            yield DOM.nextUpdate();
            const rowGapInputEvent = new KeyboardEvent("input", {});
            rowGapInput.dispatchEvent(rowGapInputEvent);
            yield DOM.nextUpdate();
            expect(css).to.equal("display: flex; row-gap: 5px;");
            yield disconnect();
        }));
    it("should emit an updated column gap value when the column gap value has been updated", () =>
        __awaiter(void 0, void 0, void 0, function* () {
            var _q, _r;
            const { element, connect, disconnect } = yield setup();
            let css = "";
            yield connect();
            const toggle =
                (_q = element.shadowRoot) === null || _q === void 0
                    ? void 0
                    : _q.querySelector("fast-switch");
            const toggleEvent = new Event("click", {});
            element.addEventListener("change", e => {
                css = e.target.value;
            });
            toggle.dispatchEvent(toggleEvent);
            yield DOM.nextUpdate();
            const columnGapInput =
                (_r = element.shadowRoot) === null || _r === void 0
                    ? void 0
                    : _r.querySelector("input.css-column-gap");
            columnGapInput.setAttribute("value", "5");
            yield DOM.nextUpdate();
            const columnGapInputEvent = new KeyboardEvent("input", {});
            columnGapInput.dispatchEvent(columnGapInputEvent);
            yield DOM.nextUpdate();
            expect(css).to.equal("display: flex; column-gap: 5px;");
            yield disconnect();
        }));
    it("should emit an updated flex-wrap value when the flex-wrap value has been updated", () =>
        __awaiter(void 0, void 0, void 0, function* () {
            var _s, _t;
            const { element, connect, disconnect } = yield setup();
            let css = "";
            yield connect();
            const toggle =
                (_s = element.shadowRoot) === null || _s === void 0
                    ? void 0
                    : _s.querySelector("fast-switch");
            const toggleEvent = new Event("click", {});
            element.addEventListener("change", e => {
                css = e.target.value;
            });
            toggle.dispatchEvent(toggleEvent);
            yield DOM.nextUpdate();
            const flexWrapInput =
                (_t = element.shadowRoot) === null || _t === void 0
                    ? void 0
                    : _t.querySelector("input[name='flex-wrap']");
            flexWrapInput.click();
            yield DOM.nextUpdate();
            expect(css).to.equal("display: flex; flex-wrap: wrap;");
            yield disconnect();
        }));
    it("should trigger a custom set onChange if an onChange has been provided", () =>
        __awaiter(void 0, void 0, void 0, function* () {
            var _u;
            const { element, connect, disconnect } = yield setup();
            let changedConfig;
            yield connect();
            element.onChange = config => {
                changedConfig = config;
            };
            const toggle =
                (_u = element.shadowRoot) === null || _u === void 0
                    ? void 0
                    : _u.querySelector("fast-switch");
            const toggleEvent = new Event("click", {});
            toggle.dispatchEvent(toggleEvent);
            yield DOM.nextUpdate();
            expect(changedConfig.toString()).to.equal({ display: "flex" }.toString());
            yield disconnect();
        }));
    it("should update the stored CSS display value when the value is updated", () =>
        __awaiter(void 0, void 0, void 0, function* () {
            var _v;
            const { element, connect, disconnect } = yield setup();
            element.value = "display: flex;";
            yield connect();
            const toggle =
                (_v = element.shadowRoot) === null || _v === void 0
                    ? void 0
                    : _v.querySelector("fast-switch");
            expect(toggle.checked).to.equal(true);
            yield disconnect();
        }));
    it("should update the stored CSS flex-direction value when the value is updated", () =>
        __awaiter(void 0, void 0, void 0, function* () {
            var _w;
            const { element, connect, disconnect } = yield setup();
            element.value = "display: flex; flex-direction: row;";
            yield connect();
            const input =
                (_w = element.shadowRoot) === null || _w === void 0
                    ? void 0
                    : _w.querySelector("input[name='flex-direction']");
            expect(input.checked).to.equal(true);
            yield disconnect();
        }));
    it("should update the stored CSS justify-content value when the value is updated", () =>
        __awaiter(void 0, void 0, void 0, function* () {
            var _x;
            const { element, connect, disconnect } = yield setup();
            element.value = "display: flex; justify-content: center;";
            yield connect();
            const input =
                (_x = element.shadowRoot) === null || _x === void 0
                    ? void 0
                    : _x.querySelectorAll("input[name='justify-content']")[2];
            expect(input.checked).to.equal(true);
            yield disconnect();
        }));
    it("should update the stored CSS align-content value when the value is updated", () =>
        __awaiter(void 0, void 0, void 0, function* () {
            var _y;
            const { element, connect, disconnect } = yield setup();
            element.value = "display: flex; align-content: center;";
            yield connect();
            const input =
                (_y = element.shadowRoot) === null || _y === void 0
                    ? void 0
                    : _y.querySelectorAll("input[name='align-content']")[2];
            expect(input.checked).to.equal(true);
            yield disconnect();
        }));
    it("should update the stored CSS align-items value when the value is updated", () =>
        __awaiter(void 0, void 0, void 0, function* () {
            var _z;
            const { element, connect, disconnect } = yield setup();
            element.value = "display: flex; align-items: stretch;";
            yield connect();
            const input =
                (_z = element.shadowRoot) === null || _z === void 0
                    ? void 0
                    : _z.querySelectorAll("input[name='align-items']")[3];
            expect(input.checked).to.equal(true);
            yield disconnect();
        }));
    it("should update the stored CSS column-gap value when the value is updated", () =>
        __awaiter(void 0, void 0, void 0, function* () {
            var _0;
            const { element, connect, disconnect } = yield setup();
            element.value = "display: flex; column-gap: 12px;";
            yield connect();
            const input =
                (_0 = element.shadowRoot) === null || _0 === void 0
                    ? void 0
                    : _0.querySelector("input[name='column-gap']");
            expect(input.value).to.equal("12");
            yield disconnect();
        }));
    it("should not update the stored CSS column-gap value when the value is updated with a non-px appended value", () =>
        __awaiter(void 0, void 0, void 0, function* () {
            var _1;
            const { element, connect, disconnect } = yield setup();
            element.value = "display: flex; column-gap: 12em;";
            yield connect();
            const input =
                (_1 = element.shadowRoot) === null || _1 === void 0
                    ? void 0
                    : _1.querySelector("input[name='column-gap']");
            expect(input.value).to.equal("");
            yield disconnect();
        }));
    it("should update the stored CSS row-gap value when the value is updated", () =>
        __awaiter(void 0, void 0, void 0, function* () {
            var _2;
            const { element, connect, disconnect } = yield setup();
            element.value = "display: flex; row-gap: 24px;";
            yield connect();
            const input =
                (_2 = element.shadowRoot) === null || _2 === void 0
                    ? void 0
                    : _2.querySelector("input[name='row-gap']");
            expect(input.value).to.equal("24");
            yield disconnect();
        }));
    it("should not update the stored CSS row-gap value when the value is updated with a non-px appended value", () =>
        __awaiter(void 0, void 0, void 0, function* () {
            var _3;
            const { element, connect, disconnect } = yield setup();
            element.value = "display: flex; row-gap: 24em;";
            yield connect();
            const input =
                (_3 = element.shadowRoot) === null || _3 === void 0
                    ? void 0
                    : _3.querySelector("input[name='row-gap']");
            expect(input.value).to.equal("");
            yield disconnect();
        }));
    it("should update the stored CSS flex-wrap value when the value is updated", () =>
        __awaiter(void 0, void 0, void 0, function* () {
            var _4;
            const { element, connect, disconnect } = yield setup();
            element.value = "display: flex; flex-wrap: wrap;";
            yield connect();
            const input =
                (_4 = element.shadowRoot) === null || _4 === void 0
                    ? void 0
                    : _4.querySelector("input[name='flex-wrap']");
            expect(input.checked).to.equal(true);
            yield disconnect();
        }));
});
