import { $global } from "@microsoft/fast-element";

/**
 *  A service to
 *
 * @public
 */
export class StaggerLoadService {
    private updateTimer: number | null = null;
    private updateDelay: number = 20;

    private queuedElements: Element[] = [];
    private callBacks: any[] = [];

    /**
     *
     *
     * @internal
     */
    public addToQueue = (target: Element, callback: () => void): void => {
        this.removeFromQueue(target);
        this.queuedElements.push(target);
        this.callBacks.push(callback);
        this.startUpdateTimer();
    };

    /**
     *
     *
     * @internal
     */
    public removeFromQueue = (target: Element): void => {
        const elementIndex: number = this.queuedElements.indexOf(target);

        if (elementIndex > -1) {
            this.queuedElements.splice(elementIndex, 1);
            this.callBacks.splice(elementIndex, 1);
        }
    };

    private startUpdateTimer(): void {
        if (this.updateTimer === null) {
            this.updateTimer = window.setTimeout((): void => {
                this.clearUpdateTimer();
                this.processQueue();
            }, this.updateDelay);
        }
    }

    /**
     * clears the layout update timer
     */
    private clearUpdateTimer(): void {
        if (this.updateTimer !== null) {
            window.clearTimeout(this.updateTimer);
            this.updateTimer = null;
        }
    }

    /**
     *
     */
    private processQueue = (): void => {
        if (this.queuedElements.length === 0) {
            return;
        }

        this.queuedElements.shift();
        this.callBacks.shift()();

        if (this.queuedElements.length > 0) {
            this.startUpdateTimer();
        }
    };
}
