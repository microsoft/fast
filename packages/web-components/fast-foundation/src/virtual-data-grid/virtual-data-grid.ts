import { FASTDataGrid } from "../data-grid/data-grid.js";
import { Virtualizing, VirtualListBase } from "../virtual-list/index.js";

class _VirtualDataGrid extends FASTDataGrid {}
interface _VirtualDataGrid extends VirtualListBase {}

/**
 * A virtualizing data grid class for the {@link @microsoft/fast-foundation#(FASTVirtualDataGrid:class)} component.
 *
 * @beta
 */
export class VirtualDataGrid extends Virtualizing(_VirtualDataGrid) {}

/**
 *  The Virtual Data Grid class
 *
 * @public
 */
export class FASTVirtualDataGrid extends VirtualDataGrid {
    /**
     * @internal
     */
    connectedCallback() {
        super.connectedCallback();
    }
}
