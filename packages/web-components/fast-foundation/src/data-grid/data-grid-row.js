var __decorate =
    (this && this.__decorate) ||
    function (decorators, target, key, desc) {
        var c = arguments.length,
            r =
                c < 3
                    ? target
                    : desc === null
                    ? (desc = Object.getOwnPropertyDescriptor(target, key))
                    : desc,
            d;
        if (typeof Reflect === "object" && typeof Reflect.decorate === "function")
            r = Reflect.decorate(decorators, target, key, desc);
        else
            for (var i = decorators.length - 1; i >= 0; i--)
                if ((d = decorators[i]))
                    r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
        return c > 3 && r && Object.defineProperty(target, key, r), r;
    };
import { attr, observable, RepeatDirective } from "@microsoft/fast-element";
import { FoundationElement } from "../foundation-element";
import {
    eventFocusOut,
    eventKeyDown,
    keyCodeArrowLeft,
    keyCodeArrowRight,
    keyCodeEnd,
    keyCodeHome,
} from "@microsoft/fast-web-utilities";
import { DataGridRowTypes } from "./data-grid.options";
/**
 * A Data Grid Row Custom HTML Element.
 *
 * @public
 */
export class DataGridRow extends FoundationElement {
    constructor() {
        super(...arguments);
        /**
         * The type of row
         *
         * @public
         * @remarks
         * HTML Attribute: row-type
         */
        this.rowType = DataGridRowTypes.default;
        /**
         * The base data for this row
         *
         * @public
         */
        this.rowData = null;
        /**
         * The column definitions of the row
         *
         * @public
         */
        this.columnDefinitions = null;
        /**
         * Whether focus is on/in a cell within this row.
         *
         * @internal
         */
        this.isActiveRow = false;
        this.cellsRepeatBehavior = null;
        this.cellsPlaceholder = null;
        /**
         * @internal
         */
        this.focusColumnIndex = 0;
        this.refocusOnLoad = false;
        this.updateRowStyle = () => {
            this.style.gridTemplateColumns = this.gridTemplateColumns;
        };
    }
    gridTemplateColumnsChanged() {
        if (this.$fastController.isConnected) {
            this.updateRowStyle();
        }
    }
    rowTypeChanged() {
        if (this.$fastController.isConnected) {
            this.updateItemTemplate();
        }
    }
    rowDataChanged() {
        if (this.rowData !== null && this.isActiveRow) {
            this.refocusOnLoad = true;
            return;
        }
    }
    cellItemTemplateChanged() {
        this.updateItemTemplate();
    }
    headerCellItemTemplateChanged() {
        this.updateItemTemplate();
    }
    /**
     * @internal
     */
    connectedCallback() {
        super.connectedCallback();
        // note that row elements can be reused with a different data object
        // as the parent grid's repeat behavior reacts to changes in the data set.
        if (this.cellsRepeatBehavior === null) {
            this.cellsPlaceholder = document.createComment("");
            this.appendChild(this.cellsPlaceholder);
            this.updateItemTemplate();
            this.cellsRepeatBehavior = new RepeatDirective(
                x => x.columnDefinitions,
                x => x.activeCellItemTemplate,
                { positioning: true }
            ).createBehavior(this.cellsPlaceholder);
            this.$fastController.addBehaviors([this.cellsRepeatBehavior]);
        }
        this.addEventListener("cell-focused", this.handleCellFocus);
        this.addEventListener(eventFocusOut, this.handleFocusout);
        this.addEventListener(eventKeyDown, this.handleKeydown);
        this.updateRowStyle();
        if (this.refocusOnLoad) {
            // if focus was on the row when data changed try to refocus on same cell
            this.refocusOnLoad = false;
            if (this.cellElements.length > this.focusColumnIndex) {
                this.cellElements[this.focusColumnIndex].focus();
            }
        }
    }
    /**
     * @internal
     */
    disconnectedCallback() {
        super.disconnectedCallback();
        this.removeEventListener("cell-focused", this.handleCellFocus);
        this.removeEventListener(eventFocusOut, this.handleFocusout);
        this.removeEventListener(eventKeyDown, this.handleKeydown);
    }
    handleFocusout(e) {
        if (!this.contains(e.target)) {
            this.isActiveRow = false;
            this.focusColumnIndex = 0;
        }
    }
    handleCellFocus(e) {
        this.isActiveRow = true;
        this.focusColumnIndex = this.cellElements.indexOf(e.target);
        this.$emit("row-focused", this);
    }
    handleKeydown(e) {
        if (e.defaultPrevented) {
            return;
        }
        let newFocusColumnIndex = 0;
        switch (e.keyCode) {
            case keyCodeArrowLeft:
                // focus left one cell
                newFocusColumnIndex = Math.max(0, this.focusColumnIndex - 1);
                this.cellElements[newFocusColumnIndex].focus();
                e.preventDefault();
                break;
            case keyCodeArrowRight:
                // focus right one cell
                newFocusColumnIndex = Math.min(
                    this.cellElements.length - 1,
                    this.focusColumnIndex + 1
                );
                this.cellElements[newFocusColumnIndex].focus();
                e.preventDefault();
                break;
            case keyCodeHome:
                if (!e.ctrlKey) {
                    this.cellElements[0].focus();
                    e.preventDefault();
                }
                break;
            case keyCodeEnd:
                if (!e.ctrlKey) {
                    // focus last cell of the row
                    this.cellElements[this.cellElements.length - 1].focus();
                    e.preventDefault();
                }
                break;
        }
    }
    updateItemTemplate() {
        this.activeCellItemTemplate =
            this.rowType === DataGridRowTypes.default &&
            this.cellItemTemplate !== undefined
                ? this.cellItemTemplate
                : this.rowType === DataGridRowTypes.default &&
                  this.cellItemTemplate === undefined
                ? this.defaultCellItemTemplate
                : this.headerCellItemTemplate !== undefined
                ? this.headerCellItemTemplate
                : this.defaultHeaderCellItemTemplate;
    }
}
__decorate(
    [attr({ attribute: "grid-template-columns" })],
    DataGridRow.prototype,
    "gridTemplateColumns",
    void 0
);
__decorate([attr({ attribute: "row-type" })], DataGridRow.prototype, "rowType", void 0);
__decorate([observable], DataGridRow.prototype, "rowData", void 0);
__decorate([observable], DataGridRow.prototype, "columnDefinitions", void 0);
__decorate([observable], DataGridRow.prototype, "cellItemTemplate", void 0);
__decorate([observable], DataGridRow.prototype, "headerCellItemTemplate", void 0);
__decorate([observable], DataGridRow.prototype, "rowIndex", void 0);
__decorate([observable], DataGridRow.prototype, "isActiveRow", void 0);
__decorate([observable], DataGridRow.prototype, "activeCellItemTemplate", void 0);
__decorate([observable], DataGridRow.prototype, "defaultCellItemTemplate", void 0);
__decorate([observable], DataGridRow.prototype, "defaultHeaderCellItemTemplate", void 0);
__decorate([observable], DataGridRow.prototype, "cellElements", void 0);
