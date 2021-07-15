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
import { css, DOM } from "@microsoft/fast-element";
import { expect } from "chai";
import { fixture } from "../test-utilities/fixture";
import { HorizontalScroll, horizontalScrollTemplate as template } from "./index";
const styles = css`
    :host {
        display: block;
    }

    .content-container {
        white-space: nowrap;
        display: inline-block;
    }

    .content-container ::slotted(*) {
        display: inline-block;
        white-space: normal;
    }

    div.scroll-view {
        overflow-x: hidden;
    }
`;
const FASTHorizontalScroll = HorizontalScroll.compose({
    baseName: "horizontal-scroll",
    template,
    styles,
});
/**
 * Static widths for calculating expected returns
 */
const horizontalScrollWidth = 400;
const cardWidth = 100;
const cardMargin = 10;
const cardSpace = cardWidth + cardMargin * 2;
/**
 * Function for getting the x-position of an element
 */
const getXPosition = elm => {
    if (!elm) return null;
    return elm.scrollLeft;
};
/**
 * Templates used for content
 */
const cardTemplate = `<div class="card" style="width: ${cardWidth}px; height: 100px; margin: ${cardMargin}px;"></div>`;
/**
 * Multi card templates
 * @param cnt number of cards
 */
const getCards = cnt => new Array(cnt).fill(cardTemplate).reduce((s, c) => (s += c), "");
function setup() {
    return __awaiter(this, void 0, void 0, function* () {
        const { element, connect, disconnect } = yield fixture(FASTHorizontalScroll());
        return { element, connect, disconnect };
    });
}
describe("HorinzontalScroll", () => {
    describe("Flippers", () => {
        it("should enable the next flipper when content exceeds horizontal-scroll width", () =>
            __awaiter(void 0, void 0, void 0, function* () {
                var _a, _b;
                const { element, connect, disconnect } = yield setup();
                element.setAttribute("style", `width: ${horizontalScrollWidth}px}`);
                element.innerHTML = getCards(8);
                yield connect();
                yield DOM.nextUpdate();
                expect(
                    (_b =
                        (_a = element.shadowRoot) === null || _a === void 0
                            ? void 0
                            : _a.querySelector(".scroll-next")) === null || _b === void 0
                        ? void 0
                        : _b.classList.contains("disabled")
                ).to.equal(false);
                yield disconnect();
            }));
        it("should disable the next flipper if content is less than horizontal-scroll width", () =>
            __awaiter(void 0, void 0, void 0, function* () {
                var _c, _d;
                const { element, connect, disconnect } = yield setup();
                element.setAttribute("style", "width: 800px");
                element.innerHTML = cardTemplate;
                yield connect();
                yield DOM.nextUpdate();
                expect(
                    (_d =
                        (_c = element.shadowRoot) === null || _c === void 0
                            ? void 0
                            : _c.querySelector(".scroll-next")) === null || _d === void 0
                        ? void 0
                        : _d.classList.contains("disabled")
                ).to.equal(true);
                yield disconnect();
            }));
        it("should disable the previous flipper by default", () =>
            __awaiter(void 0, void 0, void 0, function* () {
                var _e, _f;
                const { element, connect, disconnect } = yield setup();
                element.innerHTML = getCards(8);
                yield connect();
                yield DOM.nextUpdate();
                expect(
                    (_f =
                        (_e = element.shadowRoot) === null || _e === void 0
                            ? void 0
                            : _e.querySelector(".scroll-prev")) === null || _f === void 0
                        ? void 0
                        : _f.classList.contains("disabled")
                ).to.equal(true);
                yield disconnect();
            }));
        it("should enable the previous flipper when content is scrolled", () =>
            __awaiter(void 0, void 0, void 0, function* () {
                const { element, connect, disconnect } = yield setup();
                element.speed = -1;
                element.setAttribute("style", `width: ${horizontalScrollWidth}px}`);
                element.innerHTML = getCards(8);
                yield connect();
                yield DOM.nextUpdate();
                element.scrollToNext();
                yield setTimeout(
                    () =>
                        __awaiter(void 0, void 0, void 0, function* () {
                            var _g, _h;
                            expect(
                                (_h =
                                    (_g = element.shadowRoot) === null || _g === void 0
                                        ? void 0
                                        : _g.querySelector(".scroll-prev")) === null ||
                                    _h === void 0
                                    ? void 0
                                    : _h.classList.contains("disabled")
                            ).to.equal(false);
                            yield disconnect();
                        }),
                    1
                );
            }));
        it("should disable the previous flipper when scrolled back to the beginning", () =>
            __awaiter(void 0, void 0, void 0, function* () {
                const { element, connect, disconnect } = yield setup();
                element.speed = -1;
                element.setAttribute("style", `width: ${horizontalScrollWidth}px}`);
                element.innerHTML = getCards(8);
                yield connect();
                yield DOM.nextUpdate();
                element.scrollToNext();
                element.scrollToPrevious();
                yield setTimeout(
                    () =>
                        __awaiter(void 0, void 0, void 0, function* () {
                            yield setTimeout(() => {
                                var _a, _b;
                                return expect(
                                    (_b =
                                        (_a = element.shadowRoot) === null ||
                                        _a === void 0
                                            ? void 0
                                            : _a.querySelector(".scroll-prev")) ===
                                        null || _b === void 0
                                        ? void 0
                                        : _b.classList.contains("disabled")
                                ).to.equal(true);
                            }, 10);
                            yield disconnect();
                        }),
                    1
                );
            }));
        it("should disable the next flipper when it reaches the end of the content", () =>
            __awaiter(void 0, void 0, void 0, function* () {
                const { element, connect, disconnect } = yield setup();
                element.speed = -1;
                element.setAttribute("style", `width: ${horizontalScrollWidth}px}`);
                element.innerHTML = getCards(5);
                yield connect();
                yield DOM.nextUpdate();
                element.scrollToNext();
                element.scrollToNext();
                element.scrollToNext();
                element.scrollToNext();
                yield setTimeout(
                    () =>
                        __awaiter(void 0, void 0, void 0, function* () {
                            var _j, _k;
                            expect(
                                (_k =
                                    (_j = element.shadowRoot) === null || _j === void 0
                                        ? void 0
                                        : _j.querySelector(".scroll-next")) === null ||
                                    _k === void 0
                                    ? void 0
                                    : _k.classList.contains("disabled")
                            ).to.equal(45);
                            yield disconnect();
                        }),
                    1
                );
            }));
        it("should re-enable the next flipper when its scrolled back from the end", () =>
            __awaiter(void 0, void 0, void 0, function* () {
                const { element, connect, disconnect } = yield setup();
                element.speed = -1;
                element.setAttribute("style", `width: ${horizontalScrollWidth}px}`);
                element.innerHTML = getCards(8);
                yield connect();
                yield DOM.nextUpdate();
                element.scrollToNext();
                element.scrollToNext();
                element.scrollToNext();
                element.scrollToNext();
                element.scrollToPrevious();
                yield setTimeout(
                    () =>
                        __awaiter(void 0, void 0, void 0, function* () {
                            var _l, _m;
                            expect(
                                (_m =
                                    (_l = element.shadowRoot) === null || _l === void 0
                                        ? void 0
                                        : _l.querySelector(".scroll-next")) === null ||
                                    _m === void 0
                                    ? void 0
                                    : _m.classList.contains("disabled")
                            ).to.equal(false);
                            yield disconnect();
                        }),
                    1
                );
            }));
    });
    describe("Scrolling", () => {
        it("should start in the 0 position", () =>
            __awaiter(void 0, void 0, void 0, function* () {
                const { element, connect, disconnect } = yield setup();
                element.setAttribute("style", `width: ${horizontalScrollWidth}px}`);
                element.innerHTML = getCards(8);
                yield connect();
                yield DOM.nextUpdate();
                expect(getXPosition(element)).to.equal(0);
                yield disconnect();
            }));
        it("should scroll to the beginning of the last element in full view", () =>
            __awaiter(void 0, void 0, void 0, function* () {
                const { element, connect, disconnect } = yield setup();
                element.speed = -1;
                element.setAttribute("style", `width: ${horizontalScrollWidth}px}`);
                element.innerHTML = getCards(8);
                yield connect();
                yield DOM.nextUpdate();
                element.scrollToNext();
                yield setTimeout(
                    () =>
                        __awaiter(void 0, void 0, void 0, function* () {
                            const position = getXPosition(element) || 0;
                            const cardsFit =
                                (horizontalScrollWidth -
                                    (horizontalScrollWidth % cardSpace)) /
                                cardSpace;
                            const cardStart = cardSpace * (cardsFit - 1);
                            const currentInView =
                                position + cardSpace < horizontalScrollWidth;
                            const nextInView =
                                position - cardSpace * 2 < horizontalScrollWidth;
                            expect(currentInView && !nextInView).to.equal(true);
                            yield disconnect();
                        }),
                    1
                );
            }));
        it("should not scroll past the beginning", () =>
            __awaiter(void 0, void 0, void 0, function* () {
                const { element, connect, disconnect } = yield setup();
                element.setAttribute("style", `width: ${horizontalScrollWidth}px}`);
                element.innerHTML = getCards(8);
                yield connect();
                yield DOM.nextUpdate();
                element.scrollToPrevious();
                yield setTimeout(
                    () =>
                        __awaiter(void 0, void 0, void 0, function* () {
                            const scrollPosition = getXPosition(element);
                            expect(
                                scrollPosition !== null && scrollPosition >= 0
                            ).to.equal(true);
                            yield disconnect();
                        }),
                    1
                );
            }));
        it("should not scroll past the last in view element", () =>
            __awaiter(void 0, void 0, void 0, function* () {
                const { element, connect, disconnect } = yield setup();
                element.setAttribute("style", `width: ${horizontalScrollWidth}px}`);
                element.innerHTML = getCards(8);
                yield connect();
                yield DOM.nextUpdate();
                element.scrollToNext();
                element.scrollToNext();
                element.scrollToNext();
                element.scrollToNext();
                element.scrollToNext();
                element.scrollToNext();
                yield setTimeout(
                    () =>
                        __awaiter(void 0, void 0, void 0, function* () {
                            let cardViewWidth = cardSpace * 5 * -1;
                            const scrollPosition = getXPosition(element);
                            expect(
                                scrollPosition !== null && scrollPosition > cardViewWidth
                            ).to.equal(true);
                            yield disconnect();
                        }),
                    1
                );
            }));
        it("should change scroll stop on resize", () =>
            __awaiter(void 0, void 0, void 0, function* () {
                var _a;
                const { element, connect, disconnect } = yield setup();
                element.speed = -1;
                element.setAttribute("style", `width: ${horizontalScrollWidth * 2}px}`);
                element.innerHTML = getCards(8);
                yield connect();
                yield DOM.nextUpdate();
                const scrollContent =
                    (_a = element.shadowRoot) === null || _a === void 0
                        ? void 0
                        : _a.querySelector(".content-container");
                element.scrollToNext();
                yield setTimeout(
                    () =>
                        __awaiter(void 0, void 0, void 0, function* () {
                            const firstXPos = getXPosition(scrollContent);
                            element.scrollToPrevious();
                            element.style.width = `${horizontalScrollWidth}px`;
                            element.scrollToNext();
                            yield setTimeout(
                                () =>
                                    __awaiter(void 0, void 0, void 0, function* () {
                                        const secondXPos = getXPosition(scrollContent);
                                        expect(firstXPos === secondXPos).to.equal(false);
                                        yield disconnect();
                                    }),
                                1
                            );
                        }),
                    1
                );
            }));
    });
});
