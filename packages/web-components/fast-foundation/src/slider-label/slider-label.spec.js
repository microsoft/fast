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
import { SliderLabel, sliderLabelTemplate as template } from "../index";
import { fixture } from "../test-utilities/fixture";
import { DOM } from "@microsoft/fast-element";
import { Orientation } from "@microsoft/fast-web-utilities";
const FASTSliderLabel = SliderLabel.compose({
    baseName: "slider-label",
    template,
});
function setup() {
    return __awaiter(this, void 0, void 0, function* () {
        const { element, connect, disconnect } = yield fixture(FASTSliderLabel());
        return { element, connect, disconnect };
    });
}
// TODO: Need to add tests for positioning and slider configuration
describe("Slider label", () => {
    it("should set the `aria-disabled` attribute when `disabled` value is true", () =>
        __awaiter(void 0, void 0, void 0, function* () {
            const { element, connect, disconnect } = yield setup();
            element.disabled = true;
            yield connect();
            expect(element.getAttribute("aria-disabled")).to.equal("true");
            yield disconnect();
        }));
    it("should NOT set a default `aria-disabled` value when `disabled` is not defined", () =>
        __awaiter(void 0, void 0, void 0, function* () {
            const { element, connect, disconnect } = yield setup();
            yield connect();
            expect(element.getAttribute("aria-disabled")).to.equal(null);
            yield disconnect();
        }));
    it("should add a class equal to the `sliderOrientation` value", () =>
        __awaiter(void 0, void 0, void 0, function* () {
            const { element, connect, disconnect } = yield setup();
            element.sliderOrientation = Orientation.horizontal;
            yield connect();
            expect(element.classList.contains(`${Orientation.horizontal}`)).to.equal(
                true
            );
            element.sliderOrientation = Orientation.vertical;
            yield DOM.nextUpdate();
            expect(element.classList.contains(`${Orientation.vertical}`)).to.equal(true);
            yield disconnect();
        }));
    it("should add an element with a class of `mark` by default", () =>
        __awaiter(void 0, void 0, void 0, function* () {
            var _a;
            const { element, connect, disconnect } = yield setup();
            yield connect();
            expect(
                (_a = element.shadowRoot) === null || _a === void 0
                    ? void 0
                    : _a.querySelector(".mark")
            ).to.exist;
            yield disconnect();
        }));
    it("should NOT add an element with a class of `mark` when `hideMark` is true", () =>
        __awaiter(void 0, void 0, void 0, function* () {
            var _b;
            const { element, connect, disconnect } = yield setup();
            element.hideMark = true;
            yield connect();
            expect(
                (_b = element.shadowRoot) === null || _b === void 0
                    ? void 0
                    : _b.querySelector(".mark")
            ).to.not.exist;
            yield disconnect();
        }));
});
