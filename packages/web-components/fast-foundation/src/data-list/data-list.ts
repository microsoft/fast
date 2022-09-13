import { Orientation } from "@microsoft/fast-web-utilities";
import { attr, FASTElement, observable, ViewTemplate } from "@microsoft/fast-element";
import type { DataList, DataListController } from "./data-list.options.js";
import { DefaultListController } from "./data-list-controller.js";

/**
 *  The DataList class
 *
 * @public
 */
export class FASTDataList extends FASTElement implements DataList {
    /**
     * Whether or not to recycle the html container used to display items.
     * May help performance but containers may retain artifacts from previous use that
     * developers will need to clear.
     *
     * @public
     */
    @attr({ attribute: "recycle", mode: "boolean" })
    public recycle: boolean = false;

    /**
     * Whether the list is oriented vertically or horizontally.
     * Default is vertical.
     *
     * @public
     * @remarks
     * HTML Attribute: orientation
     */
    @attr({ attribute: "orientation" })
    public orientation: Orientation = Orientation.vertical;

    /**
     *  The array of objects to be displayed.
     *
     * @public
     */
    @observable
    public items: object[] = [];

    /**
     * The ViewTemplate used in the items repeat loop
     *
     * @public
     */
    @observable
    public itemTemplate: ViewTemplate;

    /**
     * The ViewTemplate used to render a list item contents
     *
     * @public
     */
    @observable
    public listItemContentsTemplate: ViewTemplate;

    /**
     * The default ViewTemplate used to render items
     *
     * @internal
     */
    @observable
    public defaultItemTemplate: ViewTemplate;

    /**
     * The default ViewTemplate used to render items
     *
     * @internal
     */
    @observable
    public listController: DataListController;

    /**
     * @internal
     */
    connectedCallback() {
        super.connectedCallback();
        if (!this.itemTemplate) {
            this.itemTemplate = this.defaultItemTemplate;
        }
        if (!this.listController) {
            this.listController = new DefaultListController();
        }
        this.listController.connect(this);
    }

    /**
     * @internal
     */
    public disconnectedCallback(): void {
        this.listController.disconnect();
        super.disconnectedCallback();
    }
}
