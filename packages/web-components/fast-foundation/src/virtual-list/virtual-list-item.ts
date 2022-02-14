import { HTMLView, observable, ViewTemplate } from "@microsoft/fast-element";
import { Orientation } from "@microsoft/fast-web-utilities";
import { FoundationElement } from "../foundation-element";

/**
 * Defines the loading behavior of the virtual list item
 *
 * @public
 */
export type VirtualListLoadMode = "none" | "idle";

/**
 *
 *
 * @public
 */
export interface VirtualListItemContext {
    listItemTemplate: ViewTemplate;
    loadMode: VirtualListLoadMode;
}

/**
 *  The VirtualListItem class
 *
 * @public
 */
export class VirtualListItem extends FoundationElement {
    /**
     * The ViewTemplate used to render contents.
     *
     * @public
     */
    @observable
    public itemData: object;

    /**
     *  Custom context provided to the parent virtual list
     *
     * @public
     */
    @observable
    public listItemContext: VirtualListItemContext;

    /**
     *
     *
     * @public
     */
    @observable
    public shouldLoad: boolean = false;

    /**
     * @internal
     */
    connectedCallback() {
        super.connectedCallback();
        if (this.listItemContext) {
            return;
        }

        // const loadMode: VirtualListLoadMode = (this.listItemContext as VirtualListItemContext).loadMode;

        // switch (loadMode){
        //     case "idle":
        //         this.initializeIdleLoad();
        //         break;

        //     default:
        //         this.shouldLoad = true;
        // }
    }

    /**
     * @internal
     */
    disconnectedCallback(): void {
        super.disconnectedCallback();
    }

    /**
     * @internal
     */
    resolveTemplate(): ViewTemplate {
        return this.listItemContext.listItemTemplate;
    }

    // private initializeIdleLoad(): void {
    //     if ('requestIdleCallback' in window) {
    //         window.cancelIdleCallback(0);
    //         window.requestIdleCallback(this.handleIdleCallback, { timeout: 1000 });
    //         return;
    //     }
    //     this.shouldLoad = true;
    // }

    // private handleIdleCallback(): void {
    //     this.shouldLoad = true;
    // }
}
