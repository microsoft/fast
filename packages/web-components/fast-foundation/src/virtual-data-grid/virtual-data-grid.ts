import {
    observable,
    oneWay,
    RepeatDirective,
    RepeatOptions,
} from "@microsoft/fast-element";
import { ViewBehaviorOrchestrator } from "@microsoft/fast-element/utilities";
import { inject } from "@microsoft/fast-element/di";
import { FASTDataGrid } from "../data-grid/index.js";
import { Virtualizer } from "../virtual-list/virtualizer.js";

/**
 *  The Virtual Data Grid class
 *
 * @public
 */
export class FASTVirtualDataGrid extends FASTDataGrid {
    @inject(Virtualizer) virtualizer!: Virtualizer;

    /**
     * row height to use if one is not specified
     */
    public defaultRowHeight = 30;

    /**
     * The size in pixels of each item along the virtualization axis.
     * When auto-resizing this is the amount of space reserved for elements until
     * they actually render and report size.  The default value is 50.
     *
     * @public
     * @remarks
     * HTML Attribute: item-size
     */
    @observable
    public rowHeight: number = this.defaultRowHeight;

    /**
     * The HTML ID of the viewport element.
     * If no viewport is set the default viewport is the element itself.
     * Note that viewportElement can be set directly as well.
     *
     * @public
     * @remarks
     * HTML Attribute: anchor
     */
    public viewport: string = "";
    // protected viewportChanged(): void {
    //     if (this.$fastController.isConnected) {
    //         this.viewportElement = this.getViewport();
    //         this.updateDimensions();
    //     }
    //}

    /**
     * The HTML element being used as the viewport
     *
     * @public
     */
    private viewportElement: HTMLElement;
    //  private viewportElementChanged(): void {
    //      if (this.$fastController.isConnected) {
    //          this.resetAutoUpdateMode(this.autoUpdateMode, this.autoUpdateMode);
    //      }
    //  }

    /**
     *
     *
     * @internal
     */
    public containerElement: HTMLElement;

    /**
     * @internal
     */
    connectedCallback() {
        super.connectedCallback();
        if (!this.viewportElement) {
            this.viewportElement = this.getViewport();
        }
        this.virtualizer.itemSize = this.rowHeight;
        this.virtualizer.connect(
            this.sourceItems,
            this.viewportElement,
            this.containerElement,
            "auto"
        );
    }

    /**
     * @internal
     */
    disconnectedCallback() {
        super.disconnectedCallback();
        this.virtualizer.disconnect();
    }

    /**
     * initialize repeat behavior
     */
    protected initializeRepeatBehavior(): void {
        if (this.behaviorOrchestrator === null) {
            if (!this.itemTemplate) {
                this.updateItemTemplate();
            }
            this.createPlaceholderElement();
            this.behaviorOrchestrator = ViewBehaviorOrchestrator.create(this);
            this.$fastController.addBehavior(this.behaviorOrchestrator);
            this.behaviorOrchestrator.addBehaviorFactory(
                new RepeatDirective<typeof this>(
                    oneWay(x => x.virtualizer.renderedItems),
                    oneWay(x => x.itemTemplate),
                    this.getRepeatOptions()
                ),
                this.itemsPlaceholder
            );
        }

        super.initializeRepeatBehavior();
    }

    protected getRepeatOptions(): RepeatOptions {
        //positioning is always true for virtual data grids
        const options = super.getRepeatOptions();
        options.positioning = true;
        return options;
    }

    /**
     * Gets the viewport element by id, or defaults to element
     */
    private getViewport(): HTMLElement {
        let viewport: HTMLElement | null = null;
        const rootNode = this.getRootNode();

        if (rootNode instanceof ShadowRoot) {
            viewport = rootNode.getElementById(this.viewport);
        } else {
            viewport = document.getElementById(this.viewport);
        }

        return viewport ?? this;
    }
}
