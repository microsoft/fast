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
import { BaseProgress as Progress } from "../progress";
import { progressRingTemplate as template } from "./index";
import { fixture } from "../test-utilities/fixture";
const FASTProgressRing = Progress.compose({
    baseName: "progress-ring",
    template,
});
function setup() {
    return __awaiter(this, void 0, void 0, function* () {
        const { element, connect, disconnect } = yield fixture(FASTProgressRing());
        return { element, connect, disconnect };
    });
}
describe("Progress ring", () => {
    it("should include a role of progressbar", () =>
        __awaiter(void 0, void 0, void 0, function* () {
            const { element, connect, disconnect } = yield setup();
            yield connect();
            expect(element.getAttribute("role")).to.equal("progressbar");
            yield disconnect();
        }));
    it("should set the `aria-valuenow` attribute with the `value` property when provided", () =>
        __awaiter(void 0, void 0, void 0, function* () {
            const { element, connect, disconnect } = yield setup();
            element.value = 50;
            yield connect();
            expect(element.getAttribute("aria-valuenow")).to.equal("50");
            yield disconnect();
        }));
    it("should set the `aria-valuemin` attribute with the `min` property when provided", () =>
        __awaiter(void 0, void 0, void 0, function* () {
            const { element, connect, disconnect } = yield setup();
            element.min = 0;
            yield connect();
            expect(element.getAttribute("aria-valuemin")).to.equal("0");
            yield disconnect();
        }));
    it("should set the `aria-valuemax` attribute with the `max` property when provided", () =>
        __awaiter(void 0, void 0, void 0, function* () {
            const { element, connect, disconnect } = yield setup();
            element.max = 75;
            yield connect();
            expect(element.getAttribute("aria-valuemax")).to.equal("75");
            yield disconnect();
        }));
    it("should add a `paused` class when `paused` is true", () =>
        __awaiter(void 0, void 0, void 0, function* () {
            const { element, connect, disconnect } = yield setup();
            element.paused = true;
            yield connect();
            expect(element.classList.contains("paused")).to.equal(true);
            yield disconnect();
        }));
    it("should render an element with a `determinate` slot when a value is provided", () =>
        __awaiter(void 0, void 0, void 0, function* () {
            var _a, _b;
            const { element, connect, disconnect } = yield setup();
            element.value = 50;
            yield connect();
            expect(
                (_b =
                    (_a = element.shadowRoot) === null || _a === void 0
                        ? void 0
                        : _a.querySelector(".progress")) === null || _b === void 0
                    ? void 0
                    : _b.getAttribute("slot")
            ).to.equal("determinate");
            yield disconnect();
        }));
});
