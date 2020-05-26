import { FASTElement, observable } from "@microsoft/fast-element";

export class BackgroundDesign extends FASTElement {
    private animationFrame: number | void;
    private cachedClientHeight: number = this.clientHeight;
    private resizeTimeout: number | void;
    private scrollTimeout: number | void;

    @observable
    public blurAmount: number = 0;

    constructor() {
        super();

        window.addEventListener("resize", this.resizeHandler, { passive: true });
        window.addEventListener("scroll", this.scrollHandler, { passive: true });

        // trigger both events in case we're viewing a page refresh
        window.dispatchEvent(new Event("resize"));
        window.dispatchEvent(new Event("scroll"));
    }

    private resizeHandler = (): void => {
        if (this.resizeTimeout) {
            this.resizeTimeout = window.clearTimeout(this.resizeTimeout);
        }

        this.resizeTimeout = window.setTimeout(this.setCachedClientHeight, 150);
    };

    private setCachedClientHeight = (): void => {
        this.cachedClientHeight = this.clientHeight;
    };

    private render = (): void => {
        const amount = window.scrollY / this.cachedClientHeight;
        this.blurAmount = amount < 1 ? amount : 1;
        this.animationFrame = window.requestAnimationFrame(this.render);
    };

    private cancelAnimationLoop = (): void => {
        if (this.animationFrame) {
            this.animationFrame = window.cancelAnimationFrame(this.animationFrame);
        }
    };

    private scrollHandler = (): void => {
        if (this.scrollTimeout) {
            window.clearTimeout(this.scrollTimeout);
        }

        if (!this.animationFrame) {
            this.animationFrame = window.requestAnimationFrame(this.render);
        }

        this.scrollTimeout = window.setTimeout(this.cancelAnimationLoop, 150);
    };
}
