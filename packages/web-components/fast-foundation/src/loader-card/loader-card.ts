import { attr, nullableNumberConverter, observable } from "@microsoft/fast-element";
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
     *
     *
     * @beta
     * @remarks
     * HTML Attribute: stagger-load
     */
    @attr({ attribute: "stagger-load", mode: "boolean" })
    public staggerLoad: boolean = true;

    /**
     *
     *
     * @beta
     * @remarks
     * HTML Attribute: load-delay
     */
    @attr({ attribute: "load-delay", converter: nullableNumberConverter })
    public loadDelay: number = 0;

    /**
     *
     *
     * @public
     */
    @observable
    public canLoad: boolean = false;

    /**
     * The timer that tracks delay time
     */
    private delayTimer: number | null = null;

    /**
     * @internal
     */
    connectedCallback() {
        super.connectedCallback();

        if (this.loadDelay > 0) {
            this.startLoadDelayTimer();
            return;
        }

        this.queueLoad();
    }

    /**
     * @internal
     */
    public disconnectedCallback(): void {
        if (this.delayTimer === null && !this.canLoad) {
            LoaderCard.staggerLoadService.removeFromQueue(this);
        }

        this.clearLoadDelayTimer();
        this.canLoad = false;

        super.disconnectedCallback();
    }

    private startLoadDelayTimer(): void {
        if (this.delayTimer === null) {
            this.delayTimer = window.setTimeout((): void => {
                this.queueLoad();
            }, this.loadDelay);
        }
    }

    private clearLoadDelayTimer(): void {
        if (this.delayTimer !== null) {
            this.delayTimer = null;
        }
    }

    private queueLoad = (): void => {
        if (this.staggerLoad) {
            LoaderCard.staggerLoadService.addToQueue(this, this.load);
            return;
        }
        this.load();
    };

    private load = (): void => {
        this.canLoad = true;
    };
}
