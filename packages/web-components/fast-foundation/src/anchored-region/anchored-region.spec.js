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
import { AnchoredRegion, anchoredRegionTemplate as template } from "./index";
import { fixture } from "../test-utilities/fixture";
import { DOM } from "@microsoft/fast-element";
const FASTAnchoredRegion = AnchoredRegion.compose({
    baseName: "anchored-region",
    template,
});
function setup() {
    return __awaiter(this, void 0, void 0, function* () {
        const { element, connect, disconnect, parent } = yield fixture(
            FASTAnchoredRegion()
        );
        const button = document.createElement("button");
        const content = document.createElement("div");
        button.id = "anchor";
        button.setAttribute("style", "width: 100px; height: 100px;");
        content.id = "content";
        content.setAttribute("style", "width: 100px; height: 100px;");
        parent.id = "viewport";
        parent.setAttribute("style", "width: 1000px; height: 1000px;");
        parent.insertBefore(button, element);
        element.appendChild(content);
        element.setAttribute("viewport", "viewport");
        element.setAttribute("anchor", "anchor");
        element.id = "region";
        return { element, connect, disconnect, content };
    });
}
describe("Anchored Region", () => {
    it("should set positioning modes to 'uncontrolled' by default", () =>
        __awaiter(void 0, void 0, void 0, function* () {
            const { element, connect, disconnect } = yield setup();
            yield connect();
            expect(element.verticalPositioningMode).to.equal("uncontrolled");
            expect(element.horizontalPositioningMode).to.equal("uncontrolled");
            yield disconnect();
        }));
    it("should assign anchor and viewport elements by id", () =>
        __awaiter(void 0, void 0, void 0, function* () {
            var _a, _b;
            const { element, connect, disconnect } = yield setup();
            yield connect();
            yield DOM.nextUpdate();
            expect(
                (_a = element.anchorElement) === null || _a === void 0 ? void 0 : _a.id
            ).to.equal("anchor");
            expect(
                (_b = element.viewportElement) === null || _b === void 0 ? void 0 : _b.id
            ).to.equal("viewport");
            yield disconnect();
        }));
    it("should be sized to match content by default", () =>
        __awaiter(void 0, void 0, void 0, function* () {
            const { element, connect, disconnect, content } = yield setup();
            yield connect();
            yield DOM.nextUpdate();
            expect(element.clientHeight).to.equal(content.clientHeight);
            expect(element.clientWidth).to.equal(content.clientWidth);
            yield disconnect();
        }));
});
