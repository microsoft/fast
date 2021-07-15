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
import { fixture } from "../test-utilities/fixture";
import { Disclosure, disclosureTemplate as template } from "./index";
const FastDisclosure = Disclosure.compose({
    baseName: "disclosure",
    template,
});
function createDisclosure() {
    return __awaiter(this, void 0, void 0, function* () {
        const { element, connect, disconnect } = yield fixture(FastDisclosure());
        return { element, connect, disconnect };
    });
}
function macrotask() {
    return __awaiter(this, void 0, void 0, function* () {
        return new Promise((resolve, reject) => {
            window.setTimeout(() => {
                resolve(void 0);
            });
        });
    });
}
describe("Disclosure", () => {
    describe("User interaction", () => {
        it("should toggle the content using `toggle()`", () =>
            __awaiter(void 0, void 0, void 0, function* () {
                const { element, connect, disconnect } = yield createDisclosure();
                yield connect();
                element.toggle();
                yield macrotask();
                expect(element.expanded).to.equal(true);
                yield disconnect();
            }));
        it("should expand and collapse the content using `show()` and `hide()`", () =>
            __awaiter(void 0, void 0, void 0, function* () {
                const { element, connect, disconnect } = yield createDisclosure();
                yield connect();
                element.show();
                yield macrotask();
                expect(element.expanded).to.equal(true);
                element.hide();
                yield macrotask();
                expect(element.expanded).to.equal(false);
                yield disconnect();
            }));
    });
    describe("Accessibility", () => {
        it("should set the `aria-controls` attribute on the internal summary element", () =>
            __awaiter(void 0, void 0, void 0, function* () {
                var _a, _b;
                const { element, connect, disconnect } = yield createDisclosure();
                const ariaControls = "disclosure-content";
                yield connect();
                expect(
                    (_b =
                        (_a = element.shadowRoot) === null || _a === void 0
                            ? void 0
                            : _a.querySelector("summary")) === null || _b === void 0
                        ? void 0
                        : _b.getAttribute("aria-controls")
                ).to.equal(ariaControls);
                yield disconnect();
            }));
        it("should set the `aria-expanded` attribute on the internal summary element", () =>
            __awaiter(void 0, void 0, void 0, function* () {
                var _c, _d;
                const { element, connect, disconnect } = yield createDisclosure();
                const ariaExpanded = true;
                element.expanded = ariaExpanded;
                yield connect();
                expect(
                    (_d =
                        (_c = element.shadowRoot) === null || _c === void 0
                            ? void 0
                            : _c.querySelector("summary")) === null || _d === void 0
                        ? void 0
                        : _d.getAttribute("aria-expanded")
                ).to.equal(ariaExpanded.toString());
                yield disconnect();
            }));
    });
});
