import { FASTElement, HTMLView, observable, ViewTemplate } from "@microsoft/fast-element";
import { FASTDataListItem } from "../data-list/index.js";
import type { SizeMap } from "./virtual-list.options.js";

/**
 *  The VirtualListItem class.  Note that all props are set at runtime by the parent list.
 *
 * @public
 */
export class FASTVirtualListItem extends FASTDataListItem {
    /**
     * The viewtemplate used to render the item contents
     *
     * @internal
     */
    @observable
    public listItemContentsTemplate: ViewTemplate;

    /**
     * The list sizemap
     *
     * @internal
     */
    @observable
    public sizeMap: SizeMap[];
    private sizeMapChanged(): void {
        this.itemSizeMap = this.sizeMap[this.itemIndex];
    }

    /**
     * The item sizemap
     *
     * @internal
     */
    @observable
    public itemSizeMap: SizeMap;
}
