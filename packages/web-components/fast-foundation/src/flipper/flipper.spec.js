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
import { DOM } from "@microsoft/fast-element";
import { fixture } from "../test-utilities/fixture";
import { FlipperDirection } from "./flipper.options";
import { Flipper, flipperTemplate as template } from "./index";
const FASTFlipper = Flipper.compose({
    baseName: "flipper",
    template,
});
function setup() {
    return __awaiter(this, void 0, void 0, function* () {
        const { element, connect, disconnect } = yield fixture(FASTFlipper());
        return { element, connect, disconnect };
    });
}
describe("Flipper", () => {
    it("should include a role of button", () =>
        __awaiter(void 0, void 0, void 0, function* () {
            const { element, connect, disconnect } = yield setup();
            yield connect();
            expect(element.getAttribute("role")).to.equal("button");
            yield disconnect();
        }));
    it("should include an attribute of `aria-disabled` when disabled is true", () =>
        __awaiter(void 0, void 0, void 0, function* () {
            const { element, connect, disconnect } = yield setup();
            element.disabled = true;
            yield connect();
            expect(element.getAttribute("aria-disabled")).to.equal("true");
            yield disconnect();
        }));
    it("should include a tabindex of -1 when hiddenFromAT is true", () =>
        __awaiter(void 0, void 0, void 0, function* () {
            const { element, connect, disconnect } = yield setup();
            element.hiddenFromAT = true;
            yield connect();
            expect(element.getAttribute("tabindex")).to.equal("-1");
            yield disconnect();
        }));
    it("should set an attribute of aria-hidden with a value of true by default", () =>
        __awaiter(void 0, void 0, void 0, function* () {
            const { element, connect, disconnect } = yield setup();
            yield connect();
            yield DOM.nextUpdate();
            expect(element.getAttribute("aria-hidden")).to.equal("true");
            yield disconnect();
        }));
    it("should set a default value of true for hiddenFromAT property", () =>
        __awaiter(void 0, void 0, void 0, function* () {
            const { element, connect, disconnect } = yield setup();
            yield connect();
            expect(element.hiddenFromAT).to.equal(true);
            yield disconnect();
        }));
    it("should set a tabindex of 0 when aria-hidden attribute is false", () =>
        __awaiter(void 0, void 0, void 0, function* () {
            const { element, connect, disconnect } = yield setup();
            element.setAttribute("aria-hidden", "false");
            yield connect();
            yield DOM.nextUpdate();
            expect(element.getAttribute("tabindex")).to.equal("0");
            yield disconnect();
        }));
    it("should render a span with a class of `next` when direction is `next`", () =>
        __awaiter(void 0, void 0, void 0, function* () {
            var _a, _b;
            const { element, connect, disconnect } = yield setup();
            element.direction = FlipperDirection.next;
            yield connect();
            expect(
                (_b =
                    (_a = element.shadowRoot) === null || _a === void 0
                        ? void 0
                        : _a.querySelector("span")) === null || _b === void 0
                    ? void 0
                    : _b.classList.contains("next")
            ).to.equal(true);
            yield disconnect();
        }));
    it("should render a span with a class of `previous` when direction is `previous`", () =>
        __awaiter(void 0, void 0, void 0, function* () {
            var _c, _d;
            const { element, connect, disconnect } = yield setup();
            element.direction = FlipperDirection.previous;
            yield connect();
            expect(
                (_d =
                    (_c = element.shadowRoot) === null || _c === void 0
                        ? void 0
                        : _c.querySelector("span")) === null || _d === void 0
                    ? void 0
                    : _d.classList.contains("previous")
            ).to.equal(true);
            yield disconnect();
        }));
    it("should render a span with a class of `next` when direction is NOT passed", () =>
        __awaiter(void 0, void 0, void 0, function* () {
            var _e, _f;
            const { element, connect, disconnect } = yield setup();
            yield connect();
            yield DOM.nextUpdate();
            expect(
                (_f =
                    (_e = element.shadowRoot) === null || _e === void 0
                        ? void 0
                        : _e.querySelector("span")) === null || _f === void 0
                    ? void 0
                    : _f.classList.contains("next")
            ).to.equal(true);
            yield disconnect();
        }));
});
