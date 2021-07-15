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
import { expect } from "chai";
import { fastTextField } from "@microsoft/fast-components";
import { DesignSystem } from "@microsoft/fast-foundation";
import { fixture } from "../../__test__/fixture";
import { fastToolingColorPicker } from "./";
function setup() {
    return __awaiter(this, void 0, void 0, function* () {
        const { element, connect, disconnect } = yield fixture(fastToolingColorPicker(), {
            designSystem: DesignSystem.getOrCreate().register(fastTextField()),
        });
        return { element, connect, disconnect };
    });
}
describe("ColorPicker", () => {
    it("should open the color picker when the component is focused", () =>
        __awaiter(void 0, void 0, void 0, function* () {
            const { element, connect, disconnect } = yield setup();
            yield connect();
            // Setting the tabindex to 0 to allow focus()
            // due to mismatch between user focus and programmatically calling focus
            // during testing when using delegateFocus
            element.setAttribute("tabindex", "0");
            expect(element.open).to.equal(false);
            element.focus();
            expect(element.open).to.equal(true);
            yield disconnect();
        }));
    it("should close the color picker when the component is blurred", () =>
        __awaiter(void 0, void 0, void 0, function* () {
            const { element, connect, disconnect } = yield setup();
            yield connect();
            // Setting the tabindex to 0 to allow focus()
            // due to mismatch between user focus and programmatically calling focus
            // during testing when using delegateFocus
            element.setAttribute("tabindex", "0");
            element.focus();
            expect(element.open).to.equal(true);
            element.blur();
            expect(element.open).to.equal(false);
            yield disconnect();
        }));
    it("should fire a change event if the text field value is changed", () =>
        __awaiter(void 0, void 0, void 0, function* () {
            var _a;
            const { element, connect, disconnect } = yield setup();
            const event = new Event("change", {
                key: "a",
            });
            let wasChanged = false;
            yield connect();
            element.addEventListener("change", e => {
                wasChanged = true;
            });
            const mainTextField =
                (_a = element.shadowRoot) === null || _a === void 0
                    ? void 0
                    : _a.querySelectorAll(".root > fast-text-field");
            expect(mainTextField.length).to.equal(1);
            mainTextField[0].dispatchEvent(event);
            expect(wasChanged).to.equal(true);
            yield disconnect();
        }));
    it("should fire a change event if the r (red) text field input value is changed", () =>
        __awaiter(void 0, void 0, void 0, function* () {
            var _b;
            const { element, connect, disconnect } = yield setup();
            const event = new Event("input", {});
            let wasChanged = false;
            event.composedPath = () => {
                return [
                    Object.assign(Object.assign({}, new EventTarget()), { value: "5" }),
                ];
            };
            yield connect();
            element.addEventListener("change", e => {
                wasChanged = true;
            });
            const textField =
                (_b = element.shadowRoot) === null || _b === void 0
                    ? void 0
                    : _b.querySelectorAll(".input-region fast-text-field")[0];
            textField.dispatchEvent(event);
            expect(wasChanged).to.equal(true);
            yield disconnect();
        }));
    it("should fire a change event if the g (green) text field input value is changed", () =>
        __awaiter(void 0, void 0, void 0, function* () {
            var _c;
            const { element, connect, disconnect } = yield setup();
            const event = new Event("input", {});
            let wasChanged = false;
            event.composedPath = () => {
                return [
                    Object.assign(Object.assign({}, new EventTarget()), { value: "5" }),
                ];
            };
            yield connect();
            element.addEventListener("change", e => {
                wasChanged = true;
            });
            const textField =
                (_c = element.shadowRoot) === null || _c === void 0
                    ? void 0
                    : _c.querySelectorAll(".input-region fast-text-field")[1];
            textField.dispatchEvent(event);
            expect(wasChanged).to.equal(true);
            yield disconnect();
        }));
    it("should fire a change event if the b (blue) text field input value is changed", () =>
        __awaiter(void 0, void 0, void 0, function* () {
            var _d;
            const { element, connect, disconnect } = yield setup();
            const event = new Event("input", {});
            let wasChanged = false;
            event.composedPath = () => {
                return [
                    Object.assign(Object.assign({}, new EventTarget()), { value: "5" }),
                ];
            };
            yield connect();
            element.addEventListener("change", e => {
                wasChanged = true;
            });
            const textField =
                (_d = element.shadowRoot) === null || _d === void 0
                    ? void 0
                    : _d.querySelectorAll(".input-region fast-text-field")[2];
            textField.dispatchEvent(event);
            expect(wasChanged).to.equal(true);
            yield disconnect();
        }));
    it("should fire a change event if the h (hue) text field input value is changed", () =>
        __awaiter(void 0, void 0, void 0, function* () {
            var _e;
            const { element, connect, disconnect } = yield setup();
            const event = new Event("input", {});
            let wasChanged = false;
            event.composedPath = () => {
                return [
                    Object.assign(Object.assign({}, new EventTarget()), { value: "5" }),
                ];
            };
            yield connect();
            element.addEventListener("change", e => {
                wasChanged = true;
            });
            const textField =
                (_e = element.shadowRoot) === null || _e === void 0
                    ? void 0
                    : _e.querySelectorAll(".input-region fast-text-field")[3];
            textField.dispatchEvent(event);
            expect(wasChanged).to.equal(true);
            yield disconnect();
        }));
    it("should fire a change event if the s (saturation) text field input value is changed", () =>
        __awaiter(void 0, void 0, void 0, function* () {
            var _f;
            const { element, connect, disconnect } = yield setup();
            const event = new Event("input", {});
            let wasChanged = false;
            event.composedPath = () => {
                return [
                    Object.assign(Object.assign({}, new EventTarget()), { value: "5" }),
                ];
            };
            yield connect();
            element.addEventListener("change", e => {
                wasChanged = true;
            });
            const textField =
                (_f = element.shadowRoot) === null || _f === void 0
                    ? void 0
                    : _f.querySelectorAll(".input-region fast-text-field")[4];
            textField.dispatchEvent(event);
            expect(wasChanged).to.equal(true);
            yield disconnect();
        }));
    it("should fire a change event if the v (value) text field input value is changed", () =>
        __awaiter(void 0, void 0, void 0, function* () {
            var _g;
            const { element, connect, disconnect } = yield setup();
            const event = new Event("input", {});
            let wasChanged = false;
            event.composedPath = () => {
                return [
                    Object.assign(Object.assign({}, new EventTarget()), { value: "5" }),
                ];
            };
            yield connect();
            element.addEventListener("change", e => {
                wasChanged = true;
            });
            const textField =
                (_g = element.shadowRoot) === null || _g === void 0
                    ? void 0
                    : _g.querySelectorAll(".input-region fast-text-field")[5];
            textField.dispatchEvent(event);
            expect(wasChanged).to.equal(true);
            yield disconnect();
        }));
    it("should fire a change event if the a (alpha) text field input value is changed", () =>
        __awaiter(void 0, void 0, void 0, function* () {
            var _h;
            const { element, connect, disconnect } = yield setup();
            const event = new Event("input", {});
            let wasChanged = false;
            event.composedPath = () => {
                return [
                    Object.assign(Object.assign({}, new EventTarget()), { value: "5" }),
                ];
            };
            yield connect();
            element.addEventListener("change", e => {
                wasChanged = true;
            });
            const textField =
                (_h = element.shadowRoot) === null || _h === void 0
                    ? void 0
                    : _h.querySelectorAll(".input-region fast-text-field")[6];
            textField.dispatchEvent(event);
            expect(wasChanged).to.equal(true);
            yield disconnect();
        }));
    it("should fire a change event if the saturation & light picker is clicked", () =>
        __awaiter(void 0, void 0, void 0, function* () {
            var _j;
            const { element, connect, disconnect } = yield setup();
            const event = new Event("mousedown", {});
            event.composedPath = () => {
                return [document.createElement("div")];
            };
            let wasChanged = false;
            yield connect();
            element.addEventListener("change", e => {
                wasChanged = true;
            });
            const satLightPicker =
                (_j = element.shadowRoot) === null || _j === void 0
                    ? void 0
                    : _j.querySelector(".sat-light-picker");
            satLightPicker.dispatchEvent(event);
            expect(wasChanged).to.equal(true);
            yield disconnect();
        }));
    it("should fire a change event if the hue picker is clicked", () =>
        __awaiter(void 0, void 0, void 0, function* () {
            var _k;
            const { element, connect, disconnect } = yield setup();
            const event = new Event("mousedown", {});
            event.composedPath = () => {
                return [document.createElement("div")];
            };
            let wasChanged = false;
            yield connect();
            element.addEventListener("change", e => {
                wasChanged = true;
            });
            const huePicker =
                (_k = element.shadowRoot) === null || _k === void 0
                    ? void 0
                    : _k.querySelector(".hue-picker");
            huePicker.dispatchEvent(event);
            expect(wasChanged).to.equal(true);
            yield disconnect();
        }));
    it("should fire a change event if the alpha picker is clicked", () =>
        __awaiter(void 0, void 0, void 0, function* () {
            var _l;
            const { element, connect, disconnect } = yield setup();
            const event = new Event("mousedown", {});
            event.composedPath = () => {
                return [document.createElement("div")];
            };
            let wasChanged = false;
            yield connect();
            element.addEventListener("change", e => {
                wasChanged = true;
            });
            const alphaPicker =
                (_l = element.shadowRoot) === null || _l === void 0
                    ? void 0
                    : _l.querySelector(".alpha-picker");
            alphaPicker.dispatchEvent(event);
            expect(wasChanged).to.equal(true);
            yield disconnect();
        }));
});
