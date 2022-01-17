import { observable } from "@microsoft/fast-element";
import { StaggerLoadService } from "../utilities/stagger-load-service";
import { Card } from "../card";

/**
 * A Loader Card Custom HTML Element.
 *
 * @public
 */
export class LoaderCard extends Card {
    private static staggerLoadService: StaggerLoadService = new StaggerLoadService();

    /**
     *  The array of items to be displayed
     *
     * @public
     */
    @observable
    public preLoad: boolean = false;

    /**
     * @internal
     */
    connectedCallback() {
        super.connectedCallback();
        LoaderCard.staggerLoadService.addToQueue(this, this.startPreload);
    }

    /**
     * @internal
     */
    public disconnectedCallback(): void {
        if (!this.preLoad) {
            LoaderCard.staggerLoadService.removeFromQueue(this);
        }
        this.preLoad = false;
        super.disconnectedCallback();
    }

    private startPreload = (): void => {
        this.preLoad = true;
    };
}
