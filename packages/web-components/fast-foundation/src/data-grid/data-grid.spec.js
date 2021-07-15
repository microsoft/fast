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
import {
    dataGridTemplate,
    DataGrid,
    DataGridRow,
    dataGridRowTemplate,
    DataGridCell,
    dataGridCellTemplate,
} from "./index";
import { DataGridRowTypes, GenerateHeaderOptions } from "./data-grid.options";
import { DOM } from "@microsoft/fast-element";
import { KeyCodes } from "@microsoft/fast-web-utilities";
const FASTDataGridCell = DataGridCell.compose({
    baseName: "data-grid-cell",
    template: dataGridCellTemplate,
});
const FASTDataGridRow = DataGridRow.compose({
    baseName: "data-grid-row",
    template: dataGridRowTemplate,
});
const FASTDataGrid = DataGrid.compose({
    baseName: "data-grid",
    template: dataGridTemplate,
});
// Utility functions to generate test data
export function newDataSet(rowCount) {
    const newRows = [];
    for (let i = 0; i < rowCount; i++) {
        newRows.push(newDataRow(`${i + 1}`));
    }
    return newRows;
}
export function newDataRow(id) {
    return {
        item1: `value 1-${id}`,
        item2: `value 2-${id}`,
        item3: `value 3-${id}`,
        item4: `value 4-${id}`,
        item5: `value 5-${id}`,
        item6: `value 6-${id}`,
    };
}
const arrowUpEvent = new KeyboardEvent("keydown", {
    key: "ArrowUp",
    keyCode: KeyCodes.arrowUp,
    bubbles: true,
});
const arrowDownEvent = new KeyboardEvent("keydown", {
    key: "ArrowDown",
    keyCode: KeyCodes.arrowDown,
    bubbles: true,
});
const homeEvent = new KeyboardEvent("keydown", {
    key: "Home",
    keyCode: KeyCodes.home,
    bubbles: true,
    ctrlKey: true,
});
const endEvent = new KeyboardEvent("keydown", {
    key: "End",
    keyCode: KeyCodes.end,
    bubbles: true,
    ctrlKey: true,
});
const cellQueryString = '[role="cell"], [role="gridcell"], [role="columnheader"]';
function setup() {
    return __awaiter(this, void 0, void 0, function* () {
        const { document, element, connect, disconnect } = yield fixture([
            FASTDataGrid(),
            FASTDataGridRow(),
            FASTDataGridCell(),
        ]);
        return { document, element, connect, disconnect };
    });
}
describe("Data grid", () => {
    it("should set role to 'grid'", () =>
        __awaiter(void 0, void 0, void 0, function* () {
            const { document, element, connect, disconnect } = yield setup();
            yield connect();
            expect(element.getAttribute("role")).to.equal("grid");
            yield disconnect();
        }));
    it("should have a tabIndex of 0 by default", () =>
        __awaiter(void 0, void 0, void 0, function* () {
            const { document, element, connect, disconnect } = yield setup();
            yield connect();
            expect(element.getAttribute("tabindex")).to.equal("0");
            yield disconnect();
        }));
    it("should have a tabIndex of -1 when a cell is focused", () =>
        __awaiter(void 0, void 0, void 0, function* () {
            const { document, element, connect, disconnect } = yield setup();
            element.rowsData = newDataSet(2);
            yield connect();
            yield DOM.nextUpdate();
            const rows = Array.from(element.querySelectorAll('[role="row"]'));
            expect(rows.length).to.equal(3);
            const cells = Array.from(rows[0].querySelectorAll(cellQueryString));
            expect(cells.length).to.equal(6);
            cells[0].focus();
            expect(element.getAttribute("tabindex")).to.equal("-1");
            yield disconnect();
        }));
    it("should generate basic column definitions when generateColumns is called", () =>
        __awaiter(void 0, void 0, void 0, function* () {
            const columns = DataGrid.generateColumns(newDataRow("test"));
            expect(columns.length).to.equal(6);
            expect(columns[0].columnDataKey).to.equal("item1");
            expect(columns[5].columnDataKey).to.equal("item6");
        }));
    it("should generate a basic grid with a row header based on rowsdata only", () =>
        __awaiter(void 0, void 0, void 0, function* () {
            const { document, element, connect, disconnect } = yield setup();
            element.rowsData = newDataSet(5);
            yield connect();
            const rows = Array.from(element.querySelectorAll('[role="row"]'));
            expect(rows.length).to.equal(6);
            expect(rows[0].rowType).to.equal(DataGridRowTypes.header);
            yield disconnect();
        }));
    it("should not generate a header when generateHeader is set to 'none'", () =>
        __awaiter(void 0, void 0, void 0, function* () {
            const { document, element, connect, disconnect } = yield setup();
            element.rowsData = newDataSet(5);
            element.generateHeader = GenerateHeaderOptions.none;
            yield connect();
            const rows = Array.from(element.querySelectorAll('[role="row"]'));
            expect(rows.length).to.equal(5);
            expect(rows[0].rowType).to.equal(DataGridRowTypes.default);
            yield disconnect();
        }));
    it("should generate a sticky header when generateHeader is set to 'sticky'", () =>
        __awaiter(void 0, void 0, void 0, function* () {
            const { document, element, connect, disconnect } = yield setup();
            element.rowsData = newDataSet(5);
            element.generateHeader = GenerateHeaderOptions.sticky;
            yield connect();
            const rows = Array.from(element.querySelectorAll('[role="row"]'));
            expect(rows.length).to.equal(6);
            expect(rows[0].rowType).to.equal(DataGridRowTypes.stickyHeader);
            yield disconnect();
        }));
    it("should set the row index attribute of child rows'", () =>
        __awaiter(void 0, void 0, void 0, function* () {
            const { document, element, connect, disconnect } = yield setup();
            element.rowsData = newDataSet(5);
            element.generateHeader = GenerateHeaderOptions.sticky;
            yield connect();
            const rows = Array.from(element.querySelectorAll('[role="row"]'));
            yield DOM.nextUpdate();
            expect(rows.length).to.equal(6);
            expect(rows[0].rowIndex).to.equal(0);
            expect(rows[1].rowIndex).to.equal(1);
            expect(rows[2].rowIndex).to.equal(2);
            expect(rows[3].rowIndex).to.equal(3);
            expect(rows[4].rowIndex).to.equal(4);
            expect(rows[5].rowIndex).to.equal(5);
            yield disconnect();
        }));
    it("should move focus with up/down arrow key strokes", () =>
        __awaiter(void 0, void 0, void 0, function* () {
            var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o;
            const { document, element, connect, disconnect } = yield setup();
            element.rowsData = newDataSet(2);
            yield connect();
            yield DOM.nextUpdate();
            const rows = Array.from(element.querySelectorAll('[role="row"]'));
            expect(rows.length).to.equal(3);
            const cells = Array.from(rows[0].querySelectorAll(cellQueryString));
            expect(cells.length).to.equal(6);
            cells[0].focus();
            expect(
                (_a = document.activeElement) === null || _a === void 0
                    ? void 0
                    : _a.textContent
            ).to.contain("item1");
            (_b = document.activeElement) === null || _b === void 0
                ? void 0
                : _b.dispatchEvent(arrowDownEvent);
            expect(
                (_c = document.activeElement) === null || _c === void 0
                    ? void 0
                    : _c.textContent
            ).to.contain("value 1-1");
            (_d = document.activeElement) === null || _d === void 0
                ? void 0
                : _d.dispatchEvent(arrowDownEvent);
            expect(
                (_e = document.activeElement) === null || _e === void 0
                    ? void 0
                    : _e.textContent
            ).to.contain("value 1-2");
            (_f = document.activeElement) === null || _f === void 0
                ? void 0
                : _f.dispatchEvent(arrowDownEvent);
            expect(
                (_g = document.activeElement) === null || _g === void 0
                    ? void 0
                    : _g.textContent
            ).to.contain("value 1-2");
            (_h = document.activeElement) === null || _h === void 0
                ? void 0
                : _h.dispatchEvent(arrowUpEvent);
            expect(
                (_j = document.activeElement) === null || _j === void 0
                    ? void 0
                    : _j.textContent
            ).to.contain("value 1-1");
            (_k = document.activeElement) === null || _k === void 0
                ? void 0
                : _k.dispatchEvent(arrowUpEvent);
            expect(
                (_l = document.activeElement) === null || _l === void 0
                    ? void 0
                    : _l.textContent
            ).to.contain("item1");
            (_m = document.activeElement) === null || _m === void 0
                ? void 0
                : _m.dispatchEvent(arrowUpEvent);
            expect(
                (_o = document.activeElement) === null || _o === void 0
                    ? void 0
                    : _o.textContent
            ).to.contain("item1");
            yield disconnect();
        }));
    it("should move focus to first/last cells with ctrl + home/end key strokes", () =>
        __awaiter(void 0, void 0, void 0, function* () {
            var _p, _q, _r, _s, _t;
            const { document, element, connect, disconnect } = yield setup();
            element.rowsData = newDataSet(2);
            yield connect();
            yield DOM.nextUpdate();
            const rows = Array.from(element.querySelectorAll('[role="row"]'));
            expect(rows.length).to.equal(3);
            const cells = Array.from(rows[0].querySelectorAll(cellQueryString));
            expect(cells.length).to.equal(6);
            cells[0].focus();
            expect(
                (_p = document.activeElement) === null || _p === void 0
                    ? void 0
                    : _p.textContent
            ).to.contain("item1");
            (_q = document.activeElement) === null || _q === void 0
                ? void 0
                : _q.dispatchEvent(endEvent);
            expect(
                (_r = document.activeElement) === null || _r === void 0
                    ? void 0
                    : _r.textContent
            ).to.contain("value 6-2");
            (_s = document.activeElement) === null || _s === void 0
                ? void 0
                : _s.dispatchEvent(homeEvent);
            expect(
                (_t = document.activeElement) === null || _t === void 0
                    ? void 0
                    : _t.textContent
            ).to.contain("item1");
            yield disconnect();
        }));
    it("should move focus by setting focusRowIndex", () =>
        __awaiter(void 0, void 0, void 0, function* () {
            var _u, _v, _w, _x;
            const { document, element, connect, disconnect } = yield setup();
            element.rowsData = newDataSet(2);
            yield connect();
            yield DOM.nextUpdate();
            const rows = Array.from(element.querySelectorAll('[role="row"]'));
            expect(rows.length).to.equal(3);
            const cells = Array.from(rows[0].querySelectorAll(cellQueryString));
            expect(cells.length).to.equal(6);
            cells[0].focus();
            expect(
                (_u = document.activeElement) === null || _u === void 0
                    ? void 0
                    : _u.textContent
            ).to.contain("item1");
            element.focusRowIndex = 1;
            yield DOM.nextUpdate();
            expect(
                (_v = document.activeElement) === null || _v === void 0
                    ? void 0
                    : _v.textContent
            ).to.contain("value 1-1");
            element.focusRowIndex = 2;
            yield DOM.nextUpdate();
            expect(
                (_w = document.activeElement) === null || _w === void 0
                    ? void 0
                    : _w.textContent
            ).to.contain("value 1-2");
            element.focusRowIndex = 3;
            yield DOM.nextUpdate();
            expect(
                (_x = document.activeElement) === null || _x === void 0
                    ? void 0
                    : _x.textContent
            ).to.contain("value 1-2");
            yield disconnect();
        }));
    it("should move focus by setting focusColumnIndex", () =>
        __awaiter(void 0, void 0, void 0, function* () {
            var _y, _z, _0, _1;
            const { document, element, connect, disconnect } = yield setup();
            element.rowsData = newDataSet(2);
            yield connect();
            yield DOM.nextUpdate();
            const rows = Array.from(element.querySelectorAll('[role="row"]'));
            expect(rows.length).to.equal(3);
            const cells = Array.from(rows[0].querySelectorAll(cellQueryString));
            expect(cells.length).to.equal(6);
            cells[0].focus();
            expect(
                (_y = document.activeElement) === null || _y === void 0
                    ? void 0
                    : _y.textContent
            ).to.contain("item1");
            element.focusColumnIndex = 1;
            yield DOM.nextUpdate();
            expect(
                (_z = document.activeElement) === null || _z === void 0
                    ? void 0
                    : _z.textContent
            ).to.contain("item2");
            element.focusColumnIndex = 6;
            yield DOM.nextUpdate();
            expect(
                (_0 = document.activeElement) === null || _0 === void 0
                    ? void 0
                    : _0.textContent
            ).to.contain("item6");
            element.focusColumnIndex = 7;
            yield DOM.nextUpdate();
            expect(
                (_1 = document.activeElement) === null || _1 === void 0
                    ? void 0
                    : _1.textContent
            ).to.contain("item6");
            yield disconnect();
        }));
});
