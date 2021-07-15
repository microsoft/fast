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
import { AccordionItem, accordionItemTemplate as template } from "./index";
import { fixture } from "../test-utilities/fixture";
const FASTAccordionItem = AccordionItem.compose({
    baseName: "accordion-item",
    template,
});
function setup() {
    return __awaiter(this, void 0, void 0, function* () {
        const { element, connect, disconnect } = yield fixture(FASTAccordionItem());
        return { element, connect, disconnect };
    });
}
describe("Accordion item", () => {
    it("should set an `aria-level` to the heading when provided", () =>
        __awaiter(void 0, void 0, void 0, function* () {
            var _a, _b;
            const { element, connect, disconnect } = yield setup();
            element.headinglevel = 4;
            yield connect();
            expect(element.headinglevel).to.equal(4);
            expect(
                (_b =
                    (_a = element.shadowRoot) === null || _a === void 0
                        ? void 0
                        : _a.querySelector("[role='heading']")) === null || _b === void 0
                    ? void 0
                    : _b.getAttribute("aria-level")
            ).to.equal("4");
            yield disconnect();
        }));
    it("should set a default heading level of 2 when NOT provided a `headinglevel`", () =>
        __awaiter(void 0, void 0, void 0, function* () {
            var _c, _d;
            const { element, connect, disconnect } = yield setup();
            yield connect();
            expect(element.headinglevel).to.equal(2);
            expect(
                (_d =
                    (_c = element.shadowRoot) === null || _c === void 0
                        ? void 0
                        : _c.querySelector("[role='heading']")) === null || _d === void 0
                    ? void 0
                    : _d.getAttribute("aria-level")
            ).to.equal("2");
            yield disconnect();
        }));
    it("should add a class of `expanded` when expanded is true", () =>
        __awaiter(void 0, void 0, void 0, function* () {
            const { element, connect, disconnect } = yield setup();
            element.expanded = true;
            yield connect();
            expect(element.classList.contains("expanded")).to.equal(true);
            yield disconnect();
        }));
    it("should NOT add a class of `expanded` when expanded is false", () =>
        __awaiter(void 0, void 0, void 0, function* () {
            const { element, connect, disconnect } = yield setup();
            element.expanded = false;
            yield connect();
            expect(element.classList.contains("expanded")).to.equal(false);
            yield disconnect();
        }));
    it("should set `aria-expanded` value to false on the button when expanded is false", () =>
        __awaiter(void 0, void 0, void 0, function* () {
            var _e, _f;
            const { element, connect, disconnect } = yield setup();
            element.expanded = false;
            yield connect();
            expect(
                (_f =
                    (_e = element.shadowRoot) === null || _e === void 0
                        ? void 0
                        : _e.querySelector("button")) === null || _f === void 0
                    ? void 0
                    : _f.getAttribute("aria-expanded")
            ).to.equal("false");
            yield disconnect();
        }));
    it("should set `aria-expanded` value to false on the button when expanded is false", () =>
        __awaiter(void 0, void 0, void 0, function* () {
            var _g, _h;
            const { element, connect, disconnect } = yield setup();
            element.expanded = true;
            yield connect();
            expect(
                (_h =
                    (_g = element.shadowRoot) === null || _g === void 0
                        ? void 0
                        : _g.querySelector("button")) === null || _h === void 0
                    ? void 0
                    : _h.getAttribute("aria-expanded")
            ).to.equal("true");
            yield disconnect();
        }));
    it("should set `aria-expanded` value to false on the button when expanded is undefined", () =>
        __awaiter(void 0, void 0, void 0, function* () {
            var _j, _k;
            const { element, connect, disconnect } = yield setup();
            yield connect();
            expect(
                (_k =
                    (_j = element.shadowRoot) === null || _j === void 0
                        ? void 0
                        : _j.querySelector("button")) === null || _k === void 0
                    ? void 0
                    : _k.getAttribute("aria-expanded")
            ).to.equal("false");
            yield disconnect();
        }));
    it("should set `aria-labelledby` value on the region when the id attribute is provided", () =>
        __awaiter(void 0, void 0, void 0, function* () {
            var _l, _m;
            const { element, connect, disconnect } = yield setup();
            const id = "testId";
            element.id = id;
            yield connect();
            expect(
                (_m =
                    (_l = element.shadowRoot) === null || _l === void 0
                        ? void 0
                        : _l.querySelector("[role='region']")) === null || _m === void 0
                    ? void 0
                    : _m.getAttribute("aria-labelledby")
            ).to.equal(id);
            yield disconnect();
        }));
    it("should set the id value on the button when the id attribute is provided", () =>
        __awaiter(void 0, void 0, void 0, function* () {
            var _o, _p;
            const { element, connect, disconnect } = yield setup();
            const id = "testId";
            element.id = id;
            yield connect();
            expect(
                (_p =
                    (_o = element.shadowRoot) === null || _o === void 0
                        ? void 0
                        : _o.querySelector("button")) === null || _p === void 0
                    ? void 0
                    : _p.getAttribute("id")
            ).to.equal(id);
            yield disconnect();
        }));
});
