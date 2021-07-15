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
import { html } from "@microsoft/fast-element";
import { fixture } from "../test-utilities/fixture";
import { dataGridCellTemplate, DataGridCell } from "./index";
import { newDataRow } from "./data-grid.spec";
import { DataGridCellTypes } from "./data-grid.options";
const FASTDataGridCell = DataGridCell.compose({
    baseName: "data-grid-cell",
    template: dataGridCellTemplate,
});
const testCellContentsTemplate = html`
    <template>
        Test template
    </template>
`;
const testFocusableCellContentsTemplate = html`
    <template>
        <button>Test button</button>
    </template>
`;
function getFocusTarget(cell) {
    return cell.querySelector("button");
}
function setup() {
    return __awaiter(this, void 0, void 0, function* () {
        const { element, connect, disconnect, parent } = yield fixture(
            FASTDataGridCell()
        );
        return { element, connect, disconnect, parent };
    });
}
describe("Data grid cell", () => {
    it("should set role to 'gridcell' by default", () =>
        __awaiter(void 0, void 0, void 0, function* () {
            const { element, connect, disconnect } = yield setup();
            yield connect();
            expect(element.getAttribute("role")).to.equal("gridcell");
            yield disconnect();
        }));
    it("should set role to 'columnheader' when cell-type is 'columnheader'", () =>
        __awaiter(void 0, void 0, void 0, function* () {
            const { element, connect, disconnect } = yield setup();
            element.setAttribute("cell-type", "columnheader");
            yield connect();
            expect(element.getAttribute("role")).to.equal("columnheader");
            yield disconnect();
        }));
    it("should apply 'column-header' css class when cell-type is 'columnheader'", () =>
        __awaiter(void 0, void 0, void 0, function* () {
            const { element, connect, disconnect } = yield setup();
            element.setAttribute("cell-type", "columnheader");
            yield connect();
            expect(element.className).to.contain("column-header");
            yield disconnect();
        }));
    it("should have a tabIndex of -1 by default", () =>
        __awaiter(void 0, void 0, void 0, function* () {
            const { element, connect, disconnect } = yield setup();
            yield connect();
            expect(element.getAttribute("tabindex")).to.equal("-1");
            yield disconnect();
        }));
    it("should set css grid-column style to match attribute", () =>
        __awaiter(void 0, void 0, void 0, function* () {
            const { element, connect, disconnect } = yield setup();
            element.setAttribute("grid-column", "2");
            yield connect();
            expect(element.style.gridColumnStart).to.equal("2");
            expect(element.style.gridColumnEnd).to.equal("auto");
            yield disconnect();
        }));
    it("should set css grid-column style to match attribute", () =>
        __awaiter(void 0, void 0, void 0, function* () {
            const { element, connect, disconnect } = yield setup();
            element.setAttribute("grid-column", "2");
            yield connect();
            expect(element.style.gridColumnStart).to.equal("2");
            expect(element.style.gridColumnEnd).to.equal("auto");
            yield disconnect();
        }));
    it("should not render data if no columndefinition provided", () =>
        __awaiter(void 0, void 0, void 0, function* () {
            const { element, connect, disconnect } = yield setup();
            element.rowData = newDataRow("test");
            yield connect();
            expect(element.textContent).to.equal("");
            yield disconnect();
        }));
    it("should render data if a column definition provided", () =>
        __awaiter(void 0, void 0, void 0, function* () {
            const { element, connect, disconnect } = yield setup();
            element.columnDefinition = { columnDataKey: "item2" };
            element.rowData = newDataRow("test");
            yield connect();
            expect(element.textContent).to.include("value 2-test");
            yield disconnect();
        }));
    it("should render a custom cell template if provided", () =>
        __awaiter(void 0, void 0, void 0, function* () {
            const { element, connect, disconnect } = yield setup();
            element.columnDefinition = {
                columnDataKey: "item2",
                cellTemplate: testCellContentsTemplate,
            };
            element.rowData = newDataRow("test");
            yield connect();
            expect(element.textContent).to.include("Test template");
            yield disconnect();
        }));
    it("should render a custom header cell template if provided", () =>
        __awaiter(void 0, void 0, void 0, function* () {
            const { element, connect, disconnect } = yield setup();
            element.columnDefinition = {
                columnDataKey: "item2",
                headerCellTemplate: testCellContentsTemplate,
            };
            element.rowData = newDataRow("test");
            element.cellType = DataGridCellTypes.columnHeader;
            yield connect();
            expect(element.textContent).to.include("Test template");
            yield disconnect();
        }));
    it("should fire an event when focused", () =>
        __awaiter(void 0, void 0, void 0, function* () {
            const { element, connect, disconnect } = yield setup();
            let wasInvoked = false;
            element.columnDefinition = {
                columnDataKey: "item2",
            };
            element.addEventListener("cell-focused", e => {
                wasInvoked = true;
            });
            yield connect();
            element.focus();
            expect(document.activeElement).to.equal(element);
            expect(wasInvoked).to.equal(true);
            yield disconnect();
        }));
    it("should focus on custom cell template if focus target callback provided", () =>
        __awaiter(void 0, void 0, void 0, function* () {
            var _a;
            const { element, connect, disconnect } = yield setup();
            element.columnDefinition = {
                columnDataKey: "item2",
                cellTemplate: testFocusableCellContentsTemplate,
                cellFocusTargetCallback: getFocusTarget,
            };
            element.rowData = newDataRow("test");
            yield connect();
            element.focus();
            expect(
                (_a = document.activeElement) === null || _a === void 0
                    ? void 0
                    : _a.textContent
            ).to.contain("Test button");
            yield disconnect();
        }));
    it("should focus on custom header cell template if focus target callback provided", () =>
        __awaiter(void 0, void 0, void 0, function* () {
            var _b;
            const { element, connect, disconnect } = yield setup();
            element.columnDefinition = {
                columnDataKey: "item2",
                headerCellTemplate: testFocusableCellContentsTemplate,
                headerCellFocusTargetCallback: getFocusTarget,
            };
            element.cellType = DataGridCellTypes.columnHeader;
            element.rowData = newDataRow("test");
            yield connect();
            element.focus();
            expect(
                (_b = document.activeElement) === null || _b === void 0
                    ? void 0
                    : _b.textContent
            ).to.contain("Test button");
            yield disconnect();
        }));
});
