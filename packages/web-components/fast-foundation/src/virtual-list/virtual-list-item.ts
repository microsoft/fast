import { observable, ViewTemplate } from "@microsoft/fast-element";
import { FoundationElement } from "../foundation-element";

/**
 * List item context interface
 *
 * @public
 */
export interface VirtualListItemContext {
    listItemTemplate: ViewTemplate;
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
     * @internal
     */
    connectedCallback() {
        super.connectedCallback();
        if (!this.listItemContext) {
            return;
        }
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
}
