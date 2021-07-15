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
import { tooltipTemplate as template, Tooltip } from "./index";
import { TooltipPosition } from "./tooltip";
import { AnchoredRegion, anchoredRegionTemplate } from "../anchored-region";
const FASTTooltip = Tooltip.compose({
    baseName: "tooltip",
    template,
});
const FASTAnchoredRegion = AnchoredRegion.compose({
    baseName: "anchored-region",
    template: anchoredRegionTemplate,
});
function setup() {
    return __awaiter(this, void 0, void 0, function* () {
        const { element, connect, disconnect, parent } = yield fixture([
            FASTTooltip(),
            FASTAnchoredRegion(),
        ]);
        const button = document.createElement("button");
        button.id = "anchor";
        parent.insertBefore(button, element);
        element.setAttribute("anchor", "anchor");
        element.id = "tooltip";
        return { element, connect, disconnect };
    });
}
describe("Tooltip", () => {
    it("should not render the tooltip by default", () =>
        __awaiter(void 0, void 0, void 0, function* () {
            var _a;
            const { element, connect, disconnect } = yield setup();
            const tooltip = element;
            tooltip.delay = 0;
            yield connect();
            yield DOM.nextUpdate();
            expect(tooltip.tooltipVisible).to.equal(false);
            expect(
                (_a = tooltip.shadowRoot) === null || _a === void 0
                    ? void 0
                    : _a.querySelector("fast-anchored-region")
            ).to.equal(null);
            yield disconnect();
        }));
    it("should render the tooltip when visible is true", () =>
        __awaiter(void 0, void 0, void 0, function* () {
            var _b;
            const { element, connect, disconnect } = yield setup();
            const tooltip = element;
            tooltip.visible = true;
            tooltip.delay = 0;
            yield connect();
            yield DOM.nextUpdate();
            expect(tooltip.tooltipVisible).to.equal(true);
            expect(
                (_b = tooltip.shadowRoot) === null || _b === void 0
                    ? void 0
                    : _b.querySelector("fast-anchored-region")
            ).not.to.equal(null);
            yield disconnect();
        }));
    it("should not render the tooltip when visible is false", () =>
        __awaiter(void 0, void 0, void 0, function* () {
            var _c;
            const { element, connect, disconnect } = yield setup();
            const tooltip = element;
            tooltip.visible = false;
            tooltip.delay = 0;
            yield connect();
            yield DOM.nextUpdate();
            expect(tooltip.tooltipVisible).to.equal(false);
            expect(
                (_c = tooltip.shadowRoot) === null || _c === void 0
                    ? void 0
                    : _c.querySelector("fast-anchored-region")
            ).to.equal(null);
            yield disconnect();
        }));
    it("should set positioning mode to dynamic by default", () =>
        __awaiter(void 0, void 0, void 0, function* () {
            const { element, connect, disconnect } = yield setup();
            const tooltip = element;
            yield connect();
            expect(tooltip.verticalPositioningMode).to.equal("dynamic");
            expect(tooltip.horizontalPositioningMode).to.equal("dynamic");
            yield disconnect();
        }));
    it("should not set a default position by default", () =>
        __awaiter(void 0, void 0, void 0, function* () {
            const { element, connect, disconnect } = yield setup();
            const tooltip = element;
            yield connect();
            expect(tooltip.verticalDefaultPosition).to.equal(undefined);
            expect(tooltip.horizontalDefaultPosition).to.equal(undefined);
            yield disconnect();
        }));
    it("should set horizontal scaling to match anchor and vertical scaling to match content by default", () =>
        __awaiter(void 0, void 0, void 0, function* () {
            const { element, connect, disconnect } = yield setup();
            const tooltip = element;
            yield connect();
            expect(tooltip.verticalScaling).to.equal("content");
            expect(tooltip.horizontalScaling).to.equal("anchor");
            yield disconnect();
        }));
    // top position settings
    it("should set vertical positioning mode to locked and horizontal to dynamic when position is set to top", () =>
        __awaiter(void 0, void 0, void 0, function* () {
            const { element, connect, disconnect } = yield setup();
            const tooltip = element;
            tooltip.position = TooltipPosition.top;
            yield connect();
            expect(tooltip.verticalPositioningMode).to.equal("locktodefault");
            expect(tooltip.horizontalPositioningMode).to.equal("dynamic");
            yield disconnect();
        }));
    it("should set default vertical position to top when position is set to top", () =>
        __awaiter(void 0, void 0, void 0, function* () {
            const { element, connect, disconnect } = yield setup();
            const tooltip = element;
            tooltip.position = TooltipPosition.top;
            yield connect();
            expect(tooltip.verticalDefaultPosition).to.equal("top");
            expect(tooltip.horizontalDefaultPosition).to.equal(undefined);
            yield disconnect();
        }));
    it("should set horizontal scaling to match anchor and vertical scaling to match content when position is set to top", () =>
        __awaiter(void 0, void 0, void 0, function* () {
            const { element, connect, disconnect } = yield setup();
            const tooltip = element;
            tooltip.position = TooltipPosition.top;
            yield connect();
            expect(tooltip.verticalScaling).to.equal("content");
            expect(tooltip.horizontalScaling).to.equal("anchor");
            yield disconnect();
        }));
    // bottom position settings
    it("should set vertical positioning mode to locked and horizontal to dynamic when position is set to bottom", () =>
        __awaiter(void 0, void 0, void 0, function* () {
            const { element, connect, disconnect } = yield setup();
            const tooltip = element;
            tooltip.position = TooltipPosition.bottom;
            yield connect();
            expect(tooltip.verticalPositioningMode).to.equal("locktodefault");
            expect(tooltip.horizontalPositioningMode).to.equal("dynamic");
            yield disconnect();
        }));
    it("should set default vertical position to top when position is set to top", () =>
        __awaiter(void 0, void 0, void 0, function* () {
            const { element, connect, disconnect } = yield setup();
            const tooltip = element;
            tooltip.position = TooltipPosition.bottom;
            yield connect();
            expect(tooltip.verticalDefaultPosition).to.equal("bottom");
            expect(tooltip.horizontalDefaultPosition).to.equal(undefined);
            yield disconnect();
        }));
    it("should set horizontal scaling to match anchor and vertical scaling to match content when position is set to bottom", () =>
        __awaiter(void 0, void 0, void 0, function* () {
            const { element, connect, disconnect } = yield setup();
            const tooltip = element;
            tooltip.position = TooltipPosition.bottom;
            yield connect();
            expect(tooltip.verticalScaling).to.equal("content");
            expect(tooltip.horizontalScaling).to.equal("anchor");
            yield disconnect();
        }));
    // left position settings
    it("should set horizontal positioning mode to locked and vertical to dynamic when position is set to left", () =>
        __awaiter(void 0, void 0, void 0, function* () {
            const { element, connect, disconnect } = yield setup();
            const tooltip = element;
            tooltip.position = TooltipPosition.left;
            yield connect();
            expect(tooltip.verticalPositioningMode).to.equal("dynamic");
            expect(tooltip.horizontalPositioningMode).to.equal("locktodefault");
            yield disconnect();
        }));
    it("should set default horizontal position to left when position is set to left", () =>
        __awaiter(void 0, void 0, void 0, function* () {
            const { element, connect, disconnect } = yield setup();
            const tooltip = element;
            tooltip.position = TooltipPosition.left;
            yield connect();
            expect(tooltip.verticalDefaultPosition).to.equal(undefined);
            expect(tooltip.horizontalDefaultPosition).to.equal("left");
            yield disconnect();
        }));
    it("should set vertical scaling to match anchor and horizontal scaling to match content when position is set to bottom", () =>
        __awaiter(void 0, void 0, void 0, function* () {
            const { element, connect, disconnect } = yield setup();
            const tooltip = element;
            tooltip.position = TooltipPosition.left;
            yield connect();
            expect(tooltip.verticalScaling).to.equal("anchor");
            expect(tooltip.horizontalScaling).to.equal("content");
            yield disconnect();
        }));
    // right position settings
    it("should set horizontal positioning mode to locked and vertical to dynamic when position is set to right", () =>
        __awaiter(void 0, void 0, void 0, function* () {
            const { element, connect, disconnect } = yield setup();
            const tooltip = element;
            tooltip.position = TooltipPosition.right;
            yield connect();
            expect(tooltip.verticalPositioningMode).to.equal("dynamic");
            expect(tooltip.horizontalPositioningMode).to.equal("locktodefault");
            yield disconnect();
        }));
    it("should set default horizontal position to right when position is set to right", () =>
        __awaiter(void 0, void 0, void 0, function* () {
            const { element, connect, disconnect } = yield setup();
            const tooltip = element;
            tooltip.position = TooltipPosition.right;
            yield connect();
            expect(tooltip.verticalDefaultPosition).to.equal(undefined);
            expect(tooltip.horizontalDefaultPosition).to.equal("right");
            yield disconnect();
        }));
    it("should set vertical scaling to match anchor and horizontal scaling to match content when position is set to rig", () =>
        __awaiter(void 0, void 0, void 0, function* () {
            const { element, connect, disconnect } = yield setup();
            const tooltip = element;
            tooltip.position = TooltipPosition.right;
            yield connect();
            expect(tooltip.verticalScaling).to.equal("anchor");
            expect(tooltip.horizontalScaling).to.equal("content");
            yield disconnect();
        }));
});
