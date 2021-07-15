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
import {
    dataGridRowTemplate,
    DataGridCell,
    dataGridCellTemplate,
    DataGridRow,
} from "./index";
import { newDataRow } from "./data-grid.spec";
import { KeyCodes } from "@microsoft/fast-web-utilities";
const FASTDataGridCell = DataGridCell.compose({
    baseName: "data-grid-cell",
    template: dataGridCellTemplate,
});
const FASTDataGridRow = DataGridRow.compose({
    baseName: "data-grid-row",
    template: dataGridRowTemplate,
});
function setup() {
    return __awaiter(this, void 0, void 0, function* () {
        const { element, connect, disconnect } = yield fixture([
            FASTDataGridRow(),
            FASTDataGridCell(),
        ]);
        return { element, connect, disconnect };
    });
}
const arrowRightEvent = new KeyboardEvent("keydown", {
    key: "ArrowRight",
    keyCode: KeyCodes.arrowRight,
    bubbles: true,
});
const arrowLeftEvent = new KeyboardEvent("keydown", {
    key: "ArrowLeft",
    keyCode: KeyCodes.arrowLeft,
    bubbles: true,
});
const homeEvent = new KeyboardEvent("keydown", {
    key: "Home",
    keyCode: KeyCodes.home,
    bubbles: true,
});
const endEvent = new KeyboardEvent("keydown", {
    key: "End",
    keyCode: KeyCodes.end,
    bubbles: true,
});
const cellQueryString = '[role="cell"], [role="gridcell"], [role="columnheader"]';
describe("Data grid row", () => {
    it("should set role to 'row'", () =>
        __awaiter(void 0, void 0, void 0, function* () {
            const { element, connect, disconnect } = yield setup();
            yield connect();
            expect(element.getAttribute("role")).to.equal("row");
            yield disconnect();
        }));
    it("should apply 'header' css class when row-type is 'header'", () =>
        __awaiter(void 0, void 0, void 0, function* () {
            const { element, connect, disconnect } = yield setup();
            element.setAttribute("row-type", "header");
            yield connect();
            expect(element.className).to.contain("header");
            yield disconnect();
        }));
    it("should apply 'sticky-header' css class when row-type is 'sticky-header'", () =>
        __awaiter(void 0, void 0, void 0, function* () {
            const { element, connect, disconnect } = yield setup();
            element.setAttribute("row-type", "sticky-header");
            yield connect();
            expect(element.className).to.contain("header");
            yield disconnect();
        }));
    it("should set css grid-template-columns style to match attribute", () =>
        __awaiter(void 0, void 0, void 0, function* () {
            const { element, connect, disconnect } = yield setup();
            element.setAttribute("grid-template-columns", "100px 200px");
            yield connect();
            expect(element.style.gridTemplateColumns).to.equal("100px 200px");
            yield disconnect();
        }));
    it("should render no cells if provided no column definitions ", () =>
        __awaiter(void 0, void 0, void 0, function* () {
            const { element, connect, disconnect } = yield setup();
            yield connect();
            expect(element.querySelectorAll(cellQueryString).length).to.equal(0);
            yield disconnect();
        }));
    it("should render as many column header cells as specified in column definitions", () =>
        __awaiter(void 0, void 0, void 0, function* () {
            const { element, connect, disconnect } = yield setup();
            yield connect();
            expect(element.querySelectorAll(cellQueryString).length).to.equal(0);
            element.columnDefinitions = [{ columnDataKey: "item1" }];
            yield DOM.nextUpdate();
            expect(element.querySelectorAll(cellQueryString).length).to.equal(1);
            element.columnDefinitions = [
                { columnDataKey: "item1" },
                { columnDataKey: "item2" },
            ];
            yield DOM.nextUpdate();
            expect(element.querySelectorAll(cellQueryString).length).to.equal(2);
            yield disconnect();
        }));
    it("should fire an event when a child cell is focused", () =>
        __awaiter(void 0, void 0, void 0, function* () {
            const { element, connect, disconnect } = yield setup();
            let wasInvoked = false;
            element.columnDefinitions = [
                { columnDataKey: "item1" },
                { columnDataKey: "item2" },
            ];
            element.addEventListener("row-focused", e => {
                wasInvoked = true;
            });
            yield connect();
            element.querySelectorAll(cellQueryString)[0].focus();
            expect(wasInvoked).to.equal(true);
            yield disconnect();
        }));
    it("should move focus with left/right arrow key strokes", () =>
        __awaiter(void 0, void 0, void 0, function* () {
            var _a, _b, _c, _d, _e, _f, _g;
            const { element, connect, disconnect } = yield setup();
            element.columnDefinitions = [
                { columnDataKey: "item1" },
                { columnDataKey: "item2" },
                { columnDataKey: "item3" },
            ];
            element.rowData = newDataRow("test");
            yield connect();
            element.querySelectorAll(cellQueryString)[0].focus();
            expect(
                (_a = document.activeElement) === null || _a === void 0
                    ? void 0
                    : _a.textContent
            ).to.contain("value 1-test");
            element.querySelectorAll(cellQueryString)[0].dispatchEvent(arrowRightEvent);
            expect(
                (_b = document.activeElement) === null || _b === void 0
                    ? void 0
                    : _b.textContent
            ).to.contain("value 2-test");
            element.querySelectorAll(cellQueryString)[1].dispatchEvent(arrowRightEvent);
            expect(
                (_c = document.activeElement) === null || _c === void 0
                    ? void 0
                    : _c.textContent
            ).to.contain("value 3-test");
            element.querySelectorAll(cellQueryString)[2].dispatchEvent(arrowRightEvent);
            expect(
                (_d = document.activeElement) === null || _d === void 0
                    ? void 0
                    : _d.textContent
            ).to.contain("value 3-test");
            element.querySelectorAll(cellQueryString)[2].dispatchEvent(arrowLeftEvent);
            expect(
                (_e = document.activeElement) === null || _e === void 0
                    ? void 0
                    : _e.textContent
            ).to.contain("value 2-test");
            element.querySelectorAll(cellQueryString)[1].dispatchEvent(arrowLeftEvent);
            expect(
                (_f = document.activeElement) === null || _f === void 0
                    ? void 0
                    : _f.textContent
            ).to.contain("value 1-test");
            element.querySelectorAll(cellQueryString)[0].dispatchEvent(arrowLeftEvent);
            expect(
                (_g = document.activeElement) === null || _g === void 0
                    ? void 0
                    : _g.textContent
            ).to.contain("value 1-test");
            yield disconnect();
        }));
    it("should move focus to the start/end of the row with home/end keystrokes", () =>
        __awaiter(void 0, void 0, void 0, function* () {
            var _h, _j, _k;
            const { element, connect, disconnect } = yield setup();
            element.columnDefinitions = [
                { columnDataKey: "item1" },
                { columnDataKey: "item2" },
                { columnDataKey: "item3" },
            ];
            element.rowData = newDataRow("test");
            yield connect();
            element.querySelectorAll(cellQueryString)[0].focus();
            expect(
                (_h = document.activeElement) === null || _h === void 0
                    ? void 0
                    : _h.textContent
            ).to.contain("value 1-test");
            element.querySelectorAll(cellQueryString)[0].dispatchEvent(endEvent);
            expect(
                (_j = document.activeElement) === null || _j === void 0
                    ? void 0
                    : _j.textContent
            ).to.contain("value 3-test");
            element.querySelectorAll(cellQueryString)[0].dispatchEvent(homeEvent);
            expect(
                (_k = document.activeElement) === null || _k === void 0
                    ? void 0
                    : _k.textContent
            ).to.contain("value 1-test");
            yield disconnect();
        }));
});
