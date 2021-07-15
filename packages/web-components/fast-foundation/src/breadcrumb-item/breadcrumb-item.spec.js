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
import { BreadcrumbItem, breadcrumbItemTemplate as template } from "./index";
import { fixture } from "../test-utilities/fixture";
const FASTBreadcrumbItem = BreadcrumbItem.compose({
    baseName: "breadcrumb-item",
    template,
});
function setup() {
    return __awaiter(this, void 0, void 0, function* () {
        const { element, connect, disconnect } = yield fixture(FASTBreadcrumbItem());
        return { element, connect, disconnect };
    });
}
describe("Breadcrumb item", () => {
    it("should include a `role` of `listitem`", () =>
        __awaiter(void 0, void 0, void 0, function* () {
            var _a;
            const { element, connect, disconnect } = yield setup();
            yield connect();
            expect(
                (_a =
                    element === null || element === void 0
                        ? void 0
                        : element.shadowRoot) === null || _a === void 0
                    ? void 0
                    : _a.querySelector("[role='listitem']")
            ).to.not.equal(null);
            yield disconnect();
        }));
    it("should render `anchor` when `href` is provided", () =>
        __awaiter(void 0, void 0, void 0, function* () {
            var _b;
            const { element, connect, disconnect } = yield setup();
            const hrefExample = "https://fast.design";
            element.href = hrefExample;
            yield connect();
            expect(element.href).to.equal(hrefExample);
            expect(
                (_b = element.shadowRoot) === null || _b === void 0
                    ? void 0
                    : _b.querySelector("a")
            ).not.to.equal(null);
            yield disconnect();
        }));
    it("should NOT render `anchor` when `href` is not provided", () =>
        __awaiter(void 0, void 0, void 0, function* () {
            var _c;
            const { element, connect, disconnect } = yield setup();
            yield connect();
            expect(
                (_c = element.shadowRoot) === null || _c === void 0
                    ? void 0
                    : _c.querySelector("a")
            ).to.equal(null);
            yield disconnect();
        }));
    it("should add an element with a class of `separator` when `separator` is true", () =>
        __awaiter(void 0, void 0, void 0, function* () {
            var _d;
            const { element, connect, disconnect } = yield setup();
            element.separator = true;
            yield connect();
            expect(
                (_d = element.shadowRoot) === null || _d === void 0
                    ? void 0
                    : _d.querySelector(".separator")
            ).to.exist;
            yield disconnect();
        }));
    it("should set the `href` attribute on the internal anchor equal to the value provided", () =>
        __awaiter(void 0, void 0, void 0, function* () {
            var _e, _f;
            const { element, connect, disconnect } = yield setup();
            const hrefExample = "https://fast.design";
            element.href = hrefExample;
            yield connect();
            expect(
                (_f =
                    (_e = element.shadowRoot) === null || _e === void 0
                        ? void 0
                        : _e.querySelector("a")) === null || _f === void 0
                    ? void 0
                    : _f.getAttribute("href")
            ).to.equal(hrefExample);
            yield disconnect();
        }));
    it("should set the `target` attribute on the internal anchor when `href` is passed", () =>
        __awaiter(void 0, void 0, void 0, function* () {
            var _g, _h;
            const { element, connect, disconnect } = yield setup();
            const hrefExample = "https://fast.design";
            const targetExample = "_blank";
            element.href = hrefExample;
            element.target = targetExample;
            yield connect();
            expect(element.href).to.equal(hrefExample);
            expect(
                (_h =
                    (_g = element.shadowRoot) === null || _g === void 0
                        ? void 0
                        : _g.querySelector("a")) === null || _h === void 0
                    ? void 0
                    : _h.getAttribute("target")
            ).to.equal(targetExample);
            yield disconnect();
        }));
    it("should set the `download` attribute on the internal anchor when `href` is passed", () =>
        __awaiter(void 0, void 0, void 0, function* () {
            var _j, _k;
            const { element, connect, disconnect } = yield setup();
            const download = "foo";
            const hrefExample = "https://fast.design";
            element.href = hrefExample;
            element.download = download;
            yield connect();
            expect(element.href).to.equal(hrefExample);
            expect(
                (_k =
                    (_j = element.shadowRoot) === null || _j === void 0
                        ? void 0
                        : _j.querySelector("a")) === null || _k === void 0
                    ? void 0
                    : _k.getAttribute("download")
            ).to.equal(download);
            yield disconnect();
        }));
    it("should set the `hreflang` attribute on the internal anchor when `href` is passed", () =>
        __awaiter(void 0, void 0, void 0, function* () {
            var _l, _m;
            const { element, connect, disconnect } = yield setup();
            const hreflang = "en-GB";
            const hrefExample = "https://fast.design";
            element.href = hrefExample;
            element.hreflang = hreflang;
            yield connect();
            expect(element.href).to.equal(hrefExample);
            expect(
                (_m =
                    (_l = element.shadowRoot) === null || _l === void 0
                        ? void 0
                        : _l.querySelector("a")) === null || _m === void 0
                    ? void 0
                    : _m.getAttribute("hreflang")
            ).to.equal(hreflang);
            yield disconnect();
        }));
    it("should set the `ping` attribute on the internal anchor when `href` is passed", () =>
        __awaiter(void 0, void 0, void 0, function* () {
            var _o, _p;
            const { element, connect, disconnect } = yield setup();
            const ping = "https://fast.design/trackingthepings";
            const hrefExample = "https://fast.design";
            element.href = hrefExample;
            element.ping = ping;
            yield connect();
            expect(element.href).to.equal(hrefExample);
            expect(
                (_p =
                    (_o = element.shadowRoot) === null || _o === void 0
                        ? void 0
                        : _o.querySelector("a")) === null || _p === void 0
                    ? void 0
                    : _p.getAttribute("ping")
            ).to.equal(ping);
            yield disconnect();
        }));
    it("should set the `referrerpolicy` attribute on the internal anchor when `href` is passed", () =>
        __awaiter(void 0, void 0, void 0, function* () {
            var _q, _r;
            const { element, connect, disconnect } = yield setup();
            const referrerpolicy = "no-referrer";
            const hrefExample = "https://fast.design";
            element.href = hrefExample;
            element.referrerpolicy = referrerpolicy;
            yield connect();
            expect(element.href).to.equal(hrefExample);
            expect(
                (_r =
                    (_q = element.shadowRoot) === null || _q === void 0
                        ? void 0
                        : _q.querySelector("a")) === null || _r === void 0
                    ? void 0
                    : _r.getAttribute("referrerpolicy")
            ).to.equal(referrerpolicy);
            yield disconnect();
        }));
    it("should set the `rel` attribute on the internal anchor when `href` is passed", () =>
        __awaiter(void 0, void 0, void 0, function* () {
            var _s, _t;
            const { element, connect, disconnect } = yield setup();
            const rel = "external";
            const hrefExample = "https://fast.design";
            element.href = hrefExample;
            element.rel = rel;
            yield connect();
            expect(element.href).to.equal(hrefExample);
            expect(
                (_t =
                    (_s = element.shadowRoot) === null || _s === void 0
                        ? void 0
                        : _s.querySelector("a")) === null || _t === void 0
                    ? void 0
                    : _t.getAttribute("rel")
            ).to.equal(rel);
            yield disconnect();
        }));
    it("should set the `type` attribute on the internal anchor when `href` is passed", () =>
        __awaiter(void 0, void 0, void 0, function* () {
            var _u, _v;
            const { element, connect, disconnect } = yield setup();
            const type = "text/html";
            const hrefExample = "https://fast.design";
            element.href = hrefExample;
            element.type = type;
            yield connect();
            expect(element.href).to.equal(hrefExample);
            expect(
                (_v =
                    (_u = element.shadowRoot) === null || _u === void 0
                        ? void 0
                        : _u.querySelector("a")) === null || _v === void 0
                    ? void 0
                    : _v.getAttribute("type")
            ).to.equal(type);
            yield disconnect();
        }));
    describe("Delegates ARIA link", () => {
        it("should set the `aria-atomic` attribute on the internal anchor when `href` is passed", () =>
            __awaiter(void 0, void 0, void 0, function* () {
                var _a, _b;
                const { element, connect, disconnect } = yield setup();
                const ariaAtomic = "true";
                const hrefExample = "https://fast.design";
                element.href = hrefExample;
                element.ariaAtomic = ariaAtomic;
                expect(element.href).to.equal(hrefExample);
                yield connect();
                expect(
                    (_b =
                        (_a = element.shadowRoot) === null || _a === void 0
                            ? void 0
                            : _a.querySelector("a")) === null || _b === void 0
                        ? void 0
                        : _b.getAttribute("aria-atomic")
                ).to.equal(ariaAtomic);
                yield disconnect();
            }));
        it("should set the `aria-busy` attribute on the internal anchor when `href` is passed", () =>
            __awaiter(void 0, void 0, void 0, function* () {
                var _c, _d;
                const { element, connect, disconnect } = yield setup();
                const ariaBusy = "false";
                const hrefExample = "https://fast.design";
                element.href = hrefExample;
                element.ariaBusy = ariaBusy;
                yield connect();
                expect(element.href).to.equal(hrefExample);
                expect(
                    (_d =
                        (_c = element.shadowRoot) === null || _c === void 0
                            ? void 0
                            : _c.querySelector("a")) === null || _d === void 0
                        ? void 0
                        : _d.getAttribute("aria-busy")
                ).to.equal(ariaBusy);
                yield disconnect();
            }));
        it("should set the `aria-controls` attribute on the internal anchor when `href` is passed", () =>
            __awaiter(void 0, void 0, void 0, function* () {
                var _e, _f;
                const { element, connect, disconnect } = yield setup();
                const ariaControls = "testId";
                const hrefExample = "https://fast.design";
                element.href = hrefExample;
                element.ariaControls = ariaControls;
                yield connect();
                expect(element.href).to.equal(hrefExample);
                expect(
                    (_f =
                        (_e = element.shadowRoot) === null || _e === void 0
                            ? void 0
                            : _e.querySelector("a")) === null || _f === void 0
                        ? void 0
                        : _f.getAttribute("aria-controls")
                ).to.equal(ariaControls);
                yield disconnect();
            }));
        it("should set the `aria-current` attribute on the internal anchor when `href` is passed", () =>
            __awaiter(void 0, void 0, void 0, function* () {
                var _g, _h;
                const { element, connect, disconnect } = yield setup();
                const ariaCurrent = "page";
                const hrefExample = "https://fast.design";
                element.href = hrefExample;
                element.ariaCurrent = ariaCurrent;
                yield connect();
                expect(element.href).to.equal(hrefExample);
                expect(
                    (_h =
                        (_g = element.shadowRoot) === null || _g === void 0
                            ? void 0
                            : _g.querySelector("a")) === null || _h === void 0
                        ? void 0
                        : _h.getAttribute("aria-current")
                ).to.equal(ariaCurrent);
                yield disconnect();
            }));
        it("should set the `aria-describedBy` attribute on the internal anchor when `href` is passed", () =>
            __awaiter(void 0, void 0, void 0, function* () {
                var _j, _k;
                const { element, connect, disconnect } = yield setup();
                const ariaDescribedby = "testId";
                const hrefExample = "https://fast.design";
                element.href = hrefExample;
                element.ariaDescribedby = ariaDescribedby;
                yield connect();
                expect(element.href).to.equal(hrefExample);
                expect(
                    (_k =
                        (_j = element.shadowRoot) === null || _j === void 0
                            ? void 0
                            : _j.querySelector("a")) === null || _k === void 0
                        ? void 0
                        : _k.getAttribute("aria-describedBy")
                ).to.equal(ariaDescribedby);
                yield disconnect();
            }));
        it("should set the `aria-details` attribute on the internal anchor when `href` is passed", () =>
            __awaiter(void 0, void 0, void 0, function* () {
                var _l, _m;
                const { element, connect, disconnect } = yield setup();
                const ariaDetails = "testId";
                const hrefExample = "https://fast.design";
                element.href = hrefExample;
                element.ariaDetails = ariaDetails;
                yield connect();
                expect(element.href).to.equal(hrefExample);
                expect(
                    (_m =
                        (_l = element.shadowRoot) === null || _l === void 0
                            ? void 0
                            : _l.querySelector("a")) === null || _m === void 0
                        ? void 0
                        : _m.getAttribute("aria-details")
                ).to.equal(ariaDetails);
                yield disconnect();
            }));
        it("should set the `aria-disabled` attribute on the internal anchor when `href` is passed", () =>
            __awaiter(void 0, void 0, void 0, function* () {
                var _o, _p;
                const { element, connect, disconnect } = yield setup();
                const ariaDisabled = "true";
                const hrefExample = "https://fast.design";
                element.href = hrefExample;
                element.ariaDisabled = ariaDisabled;
                yield connect();
                expect(element.href).to.equal(hrefExample);
                expect(
                    (_p =
                        (_o = element.shadowRoot) === null || _o === void 0
                            ? void 0
                            : _o.querySelector("a")) === null || _p === void 0
                        ? void 0
                        : _p.getAttribute("aria-disabled")
                ).to.equal(ariaDisabled);
                yield disconnect();
            }));
        it("should set the `aria-errormessage` attribute on the internal anchor when `href` is passed", () =>
            __awaiter(void 0, void 0, void 0, function* () {
                var _q, _r;
                const { element, connect, disconnect } = yield setup();
                const ariaErrormessage = "test";
                const hrefExample = "https://fast.design";
                element.href = hrefExample;
                element.ariaErrormessage = ariaErrormessage;
                yield connect();
                expect(element.href).to.equal(hrefExample);
                expect(
                    (_r =
                        (_q = element.shadowRoot) === null || _q === void 0
                            ? void 0
                            : _q.querySelector("a")) === null || _r === void 0
                        ? void 0
                        : _r.getAttribute("aria-errormessage")
                ).to.equal(ariaErrormessage);
                yield disconnect();
            }));
        it("should set the `aria-expanded` attribute on the internal anchor when `href` is passed", () =>
            __awaiter(void 0, void 0, void 0, function* () {
                var _s, _t;
                const { element, connect, disconnect } = yield setup();
                const ariaExpanded = "true";
                const hrefExample = "https://fast.design";
                element.href = hrefExample;
                element.ariaExpanded = ariaExpanded;
                yield connect();
                expect(element.href).to.equal(hrefExample);
                expect(
                    (_t =
                        (_s = element.shadowRoot) === null || _s === void 0
                            ? void 0
                            : _s.querySelector("a")) === null || _t === void 0
                        ? void 0
                        : _t.getAttribute("aria-expanded")
                ).to.equal(ariaExpanded);
                yield disconnect();
            }));
        it("should set the `aria-flowto` attribute on the internal anchor when `href` is passed", () =>
            __awaiter(void 0, void 0, void 0, function* () {
                var _u, _v;
                const { element, connect, disconnect } = yield setup();
                const ariaFlowto = "testId";
                const hrefExample = "https://fast.design";
                element.href = hrefExample;
                element.ariaFlowto = ariaFlowto;
                yield connect();
                expect(element.href).to.equal(hrefExample);
                expect(
                    (_v =
                        (_u = element.shadowRoot) === null || _u === void 0
                            ? void 0
                            : _u.querySelector("a")) === null || _v === void 0
                        ? void 0
                        : _v.getAttribute("aria-flowto")
                ).to.equal(ariaFlowto);
                yield disconnect();
            }));
        it("should set the `aria-haspopup` attribute on the internal anchor when `href` is passed", () =>
            __awaiter(void 0, void 0, void 0, function* () {
                var _w, _x;
                const { element, connect, disconnect } = yield setup();
                const ariaHaspopup = "true";
                const hrefExample = "https://fast.design";
                element.href = hrefExample;
                element.ariaHaspopup = ariaHaspopup;
                yield connect();
                expect(element.href).to.equal(hrefExample);
                expect(
                    (_x =
                        (_w = element.shadowRoot) === null || _w === void 0
                            ? void 0
                            : _w.querySelector("a")) === null || _x === void 0
                        ? void 0
                        : _x.getAttribute("aria-haspopup")
                ).to.equal(ariaHaspopup);
                yield disconnect();
            }));
        it("should set the `aria-hidden` attribute on the internal anchor when `href` is passed", () =>
            __awaiter(void 0, void 0, void 0, function* () {
                var _y, _z;
                const { element, connect, disconnect } = yield setup();
                const ariaHidden = "true";
                const hrefExample = "https://fast.design";
                element.href = hrefExample;
                element.ariaHidden = ariaHidden;
                yield connect();
                expect(element.href).to.equal(hrefExample);
                expect(
                    (_z =
                        (_y = element.shadowRoot) === null || _y === void 0
                            ? void 0
                            : _y.querySelector("a")) === null || _z === void 0
                        ? void 0
                        : _z.getAttribute("aria-hidden")
                ).to.equal(ariaHidden);
                yield disconnect();
            }));
        it("should set the `aria-invalid` attribute on the internal anchor when `href` is passed", () =>
            __awaiter(void 0, void 0, void 0, function* () {
                var _0, _1;
                const { element, connect, disconnect } = yield setup();
                const ariaInvalid = "spelling";
                const hrefExample = "https://fast.design";
                element.href = hrefExample;
                element.ariaInvalid = ariaInvalid;
                yield connect();
                expect(element.href).to.equal(hrefExample);
                expect(
                    (_1 =
                        (_0 = element.shadowRoot) === null || _0 === void 0
                            ? void 0
                            : _0.querySelector("a")) === null || _1 === void 0
                        ? void 0
                        : _1.getAttribute("aria-invalid")
                ).to.equal(ariaInvalid);
                yield disconnect();
            }));
        it("should set the `aria-keyshortcuts` attribute on the internal anchor when `href` is passed", () =>
            __awaiter(void 0, void 0, void 0, function* () {
                var _2, _3;
                const { element, connect, disconnect } = yield setup();
                const ariaKeyshortcuts = "F4";
                const hrefExample = "https://fast.design";
                element.href = hrefExample;
                element.ariaKeyshortcuts = ariaKeyshortcuts;
                yield connect();
                expect(element.href).to.equal(hrefExample);
                expect(
                    (_3 =
                        (_2 = element.shadowRoot) === null || _2 === void 0
                            ? void 0
                            : _2.querySelector("a")) === null || _3 === void 0
                        ? void 0
                        : _3.getAttribute("aria-keyshortcuts")
                ).to.equal(ariaKeyshortcuts);
                yield disconnect();
            }));
        it("should set the `aria-label` attribute on the internal anchor when `href` is passed", () =>
            __awaiter(void 0, void 0, void 0, function* () {
                var _4, _5;
                const { element, connect, disconnect } = yield setup();
                const ariaLabel = "Foo label";
                const hrefExample = "https://fast.design";
                element.href = hrefExample;
                element.ariaLabel = ariaLabel;
                yield connect();
                expect(element.href).to.equal(hrefExample);
                expect(
                    (_5 =
                        (_4 = element.shadowRoot) === null || _4 === void 0
                            ? void 0
                            : _4.querySelector("a")) === null || _5 === void 0
                        ? void 0
                        : _5.getAttribute("aria-label")
                ).to.equal(ariaLabel);
                yield disconnect();
            }));
        it("should set the `aria-labelledby` attribute on the internal anchor when `href` is passed", () =>
            __awaiter(void 0, void 0, void 0, function* () {
                var _6, _7;
                const { element, connect, disconnect } = yield setup();
                const ariaLabelledby = "testId";
                const hrefExample = "https://fast.design";
                element.href = hrefExample;
                element.ariaLabelledby = ariaLabelledby;
                yield connect();
                expect(element.href).to.equal(hrefExample);
                expect(
                    (_7 =
                        (_6 = element.shadowRoot) === null || _6 === void 0
                            ? void 0
                            : _6.querySelector("a")) === null || _7 === void 0
                        ? void 0
                        : _7.getAttribute("aria-labelledby")
                ).to.equal(ariaLabelledby);
                yield disconnect();
            }));
        it("should set the `aria-live` attribute on the internal anchor when `href` is passed", () =>
            __awaiter(void 0, void 0, void 0, function* () {
                var _8, _9;
                const { element, connect, disconnect } = yield setup();
                const ariaLive = "polite";
                const hrefExample = "https://fast.design";
                element.href = hrefExample;
                element.ariaLive = ariaLive;
                yield connect();
                expect(element.href).to.equal(hrefExample);
                expect(
                    (_9 =
                        (_8 = element.shadowRoot) === null || _8 === void 0
                            ? void 0
                            : _8.querySelector("a")) === null || _9 === void 0
                        ? void 0
                        : _9.getAttribute("aria-live")
                ).to.equal(ariaLive);
                yield disconnect();
            }));
        it("should set the `aria-owns` attribute on the internal anchor when `href` is passed", () =>
            __awaiter(void 0, void 0, void 0, function* () {
                var _10, _11;
                const { element, connect, disconnect } = yield setup();
                const ariaOwns = "testId";
                const hrefExample = "https://fast.design";
                element.href = hrefExample;
                element.ariaOwns = ariaOwns;
                yield connect();
                expect(element.href).to.equal(hrefExample);
                expect(
                    (_11 =
                        (_10 = element.shadowRoot) === null || _10 === void 0
                            ? void 0
                            : _10.querySelector("a")) === null || _11 === void 0
                        ? void 0
                        : _11.getAttribute("aria-owns")
                ).to.equal(ariaOwns);
                yield disconnect();
            }));
        it("should set the `aria-relevant` attribute on the internal anchor when `href` is passed", () =>
            __awaiter(void 0, void 0, void 0, function* () {
                var _12, _13;
                const { element, connect, disconnect } = yield setup();
                const ariaRelevant = "removals";
                const hrefExample = "https://fast.design";
                element.href = hrefExample;
                element.ariaRelevant = ariaRelevant;
                yield connect();
                expect(element.href).to.equal(hrefExample);
                expect(
                    (_13 =
                        (_12 = element.shadowRoot) === null || _12 === void 0
                            ? void 0
                            : _12.querySelector("a")) === null || _13 === void 0
                        ? void 0
                        : _13.getAttribute("aria-relevant")
                ).to.equal(ariaRelevant);
                yield disconnect();
            }));
        it("should set the `aria-roledescription` attribute on the internal anchor when `href` is passed", () =>
            __awaiter(void 0, void 0, void 0, function* () {
                var _14, _15;
                const { element, connect, disconnect } = yield setup();
                const ariaRoledescription = "slide";
                const hrefExample = "https://fast.design";
                element.href = hrefExample;
                element.ariaRoledescription = ariaRoledescription;
                yield connect();
                expect(element.href).to.equal(hrefExample);
                expect(
                    (_15 =
                        (_14 = element.shadowRoot) === null || _14 === void 0
                            ? void 0
                            : _14.querySelector("a")) === null || _15 === void 0
                        ? void 0
                        : _15.getAttribute("aria-roledescription")
                ).to.equal(ariaRoledescription);
                yield disconnect();
            }));
    });
});
