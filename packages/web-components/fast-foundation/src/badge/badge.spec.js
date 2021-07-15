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
import { Badge, badgeTemplate as template } from "./index";
import { fixture } from "../test-utilities/fixture";
const FASTBadge = Badge.compose({
    baseName: "badge",
    template,
});
function setup() {
    return __awaiter(this, void 0, void 0, function* () {
        const { element, connect, disconnect } = yield fixture(FASTBadge());
        return { element, connect, disconnect };
    });
}
let expectedFill = fill => `background-color: var(--badge-fill-${fill});`;
let expectedColor = color => `color: var(--badge-color-${color});`;
describe("Badge", () => {
    it("should set both the background-color and fill on the control as an inline style when `fill` and `color` are provided", () =>
        __awaiter(void 0, void 0, void 0, function* () {
            var _a, _b;
            const { element, connect, disconnect } = yield setup();
            const fill = "foo";
            const color = "bar";
            element.fill = fill;
            element.color = color;
            yield connect();
            expect(
                (_b =
                    (_a = element.shadowRoot) === null || _a === void 0
                        ? void 0
                        : _a.querySelector(".control")) === null || _b === void 0
                    ? void 0
                    : _b.getAttribute("style")
            ).to.equal(`${expectedColor(color)} ${expectedFill(fill)}`);
            yield disconnect();
        }));
    it("should set the background-color on the control as an inline style when `fill` is provided", () =>
        __awaiter(void 0, void 0, void 0, function* () {
            var _c, _d;
            const { element, connect, disconnect } = yield setup();
            const fill = "foo";
            element.fill = fill;
            yield connect();
            expect(
                (_d =
                    (_c = element.shadowRoot) === null || _c === void 0
                        ? void 0
                        : _c.querySelector(".control")) === null || _d === void 0
                    ? void 0
                    : _d.getAttribute("style")
            ).to.equal(expectedFill(fill));
            yield disconnect();
        }));
    it("should NOT set the background-color on the control as an inline style when `fill` is NOT provided", () =>
        __awaiter(void 0, void 0, void 0, function* () {
            var _e, _f;
            const { element, connect, disconnect } = yield setup();
            yield connect();
            expect(
                (_f =
                    (_e = element.shadowRoot) === null || _e === void 0
                        ? void 0
                        : _e.querySelector(".control")) === null || _f === void 0
                    ? void 0
                    : _f.getAttribute("style")
            ).to.equal(null);
            yield disconnect();
        }));
    it("should set the color on the control as an inline style when `color` is provided", () =>
        __awaiter(void 0, void 0, void 0, function* () {
            var _g, _h;
            const { element, connect, disconnect } = yield setup();
            const color = "bar";
            element.color = color;
            yield connect();
            expect(
                (_h =
                    (_g = element.shadowRoot) === null || _g === void 0
                        ? void 0
                        : _g.querySelector(".control")) === null || _h === void 0
                    ? void 0
                    : _h.getAttribute("style")
            ).to.equal(expectedColor(color));
            yield disconnect();
        }));
    it("should NOT set the color on the control as an inline style when `color` is NOT provided", () =>
        __awaiter(void 0, void 0, void 0, function* () {
            var _j, _k;
            const { element, connect, disconnect } = yield setup();
            yield connect();
            expect(
                (_k =
                    (_j = element.shadowRoot) === null || _j === void 0
                        ? void 0
                        : _j.querySelector(".control")) === null || _k === void 0
                    ? void 0
                    : _k.getAttribute("style")
            ).to.equal(null);
            yield disconnect();
        }));
    it("should NOT set an inline style when neither `fill` or `color` are provided", () =>
        __awaiter(void 0, void 0, void 0, function* () {
            var _l, _m;
            const { element, connect, disconnect } = yield setup();
            yield connect();
            expect(
                (_m =
                    (_l = element.shadowRoot) === null || _l === void 0
                        ? void 0
                        : _l.querySelector(".control")) === null || _m === void 0
                    ? void 0
                    : _m.getAttribute("style")
            ).to.equal(null);
            yield disconnect();
        }));
});
