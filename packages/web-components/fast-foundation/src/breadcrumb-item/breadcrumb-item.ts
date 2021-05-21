import { DOM, HTMLView, observable, ViewTemplate } from "@microsoft/fast-element";
import { DelegatesARIALink, Anchor } from "../anchor";
import { StartEnd } from "../patterns/index";
import { applyMixins } from "../utilities/apply-mixins";

/**
 * A Breadcrumb Item Custom HTML Element.
 *
 * @public
 */
export class BreadcrumbItem extends Anchor {
    @observable
    public separatorView: HTMLView | null = null;

    /**
     * @internal
     */
    @observable
    public defaultItemSeparatorTemplate: ViewTemplate;
    public defaultItemSeparatorTemplateChange() {
        if (this.$fastController.isConnected) {
            this.updateSeparatorView();
        }
    }

    /**
     * @internal
     */
    @observable
    public separator: boolean = true;

    /**
     * @internal
     */
    public connectedCallback(): void {
        super.connectedCallback();

        DOM.queueUpdate(() => {
            this.updateSeparatorView();
        });
    }

    /**
     * @internal
     */
    public disconnectedCallback(): void {
        super.disconnectedCallback();

        this.disconnectSeparatorView();
    }

    private updateSeparatorView(): void {
        this.disconnectSeparatorView();

        //TODO: find children that has a slot with a separator name, and just return it.

        if (this.defaultItemSeparatorTemplate !== undefined) {
            this.separatorView = this.defaultItemSeparatorTemplate.render(this, this);
        }
    }

    private disconnectSeparatorView(): void {
        if (this.separatorView !== null) {
            this.separatorView.dispose();
            this.separatorView = null;
        }
    }
}

/**
 * Mark internal because exporting class and interface of the same name
 * confuses API documenter.
 * TODO: https://github.com/microsoft/fast/issues/3317
 * @internal
 */
/* eslint-disable-next-line */
export interface BreadcrumbItem extends StartEnd, DelegatesARIALink {}
applyMixins(BreadcrumbItem, StartEnd, DelegatesARIALink);
