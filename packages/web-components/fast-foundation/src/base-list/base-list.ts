import {
    attr,
    bind,
    FASTElement,
    observable,
    RepeatBehavior,
    RepeatDirective,
    ViewTemplate,
} from "@microsoft/fast-element";

/**
 *  The BaseList class
 *
 * @public
 */
export class FASTBaseList extends FASTElement {
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
     *  The array of items to be displayed.
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

    // reference to the repeat behavior used to render items
    private itemsRepeatBehavior: RepeatBehavior | null = null;

    // the placeholder element used by the repeat behavior
    private itemsPlaceholder: Node;

    /**
     * @internal
     */
    connectedCallback() {
        super.connectedCallback();

        if (this.itemsPlaceholder === undefined) {
            this.itemsPlaceholder = document.createComment("");
            this.appendChild(this.itemsPlaceholder);
        }

        if (!this.itemTemplate) {
            this.itemTemplate = this.defaultItemTemplate;
        }

        this.initializeRepeatBehavior();
    }

    /**
     * @internal
     */
    public disconnectedCallback(): void {
        super.disconnectedCallback();
        /* eslint-disable-next-line @typescript-eslint/no-non-null-assertion */
        this.$fastController.removeBehaviors([this.itemsRepeatBehavior!]);
    }

    /**
     * initialize repeat behavior
     */
    private initializeRepeatBehavior(): void {
        if (this.itemsRepeatBehavior !== null) {
            return;
        }

        const itemsRepeatDirective = new RepeatDirective<FASTBaseList>(
            bind(x => x.items, false),
            bind(x => x.itemTemplate, false),
            { positioning: true, recycle: this.recycle }
        );
        this.itemsRepeatBehavior = itemsRepeatDirective.createBehavior({
            [itemsRepeatDirective.nodeId]: this.itemsPlaceholder,
        });

        /* eslint-disable-next-line @typescript-eslint/no-non-null-assertion */
        this.$fastController.addBehaviors([this.itemsRepeatBehavior!]);
    }
}
