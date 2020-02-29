import { attr, FastElement } from "@microsoft/fast-element";

export type AxisPositioningMode =
    | "uncontrolled"
    | "locktodefault"
    | "dynamic"
    | "onetime";

export type HorizontalPosition = "start" | "end" | "left" | "right" | "unset";

export type VerticalPosition = "top" | "bottom" | "unset";

export type ViewportOption = "#parent" | "#document";

export declare class ResizeObserverClassDefinition {
    constructor(callback: ResizeObserverCallback);
    public observe(target: Element): void;
    public unobserve(target: Element): void;
    public disconnect(): void;
}

export declare type ResizeObserverCallback = (
    entries: ResizeObserverEntry[],
    observer: ResizeObserverClassDefinition
) => void;

export interface ContentRect {
    height: number;
    left: number;
    top: number;
    width: number;
}

export declare const contentRect: (target: Element) => Readonly<ContentRect>;

export declare class ResizeObserverEntry {
    public readonly target: Element;
    public readonly contentRect: ContentRect;
    constructor(target: Element);
}

export class AnchoredRegion extends FastElement {
    @attr
    public anchor: string = "";
    @attr
    public viewport: ViewportOption | string = "#parent";

    @attr
    public horizontalPositioningMode: AxisPositioningMode = "uncontrolled";
    @attr
    public horizontalDefaultPosition: HorizontalPosition = "unset";
    @attr
    public horizontalInset: boolean = false;
    @attr
    public horizontalThreshold: string = "";
    @attr
    public horizontalScalingEnabled: boolean = false;

    @attr
    public verticalPositioningMode: AxisPositioningMode = "uncontrolled";
    @attr
    public verticalDefaultPosition: VerticalPosition = "unset";
    @attr
    public verticalInset: boolean = false;
    @attr
    public verticalThreshold: string = "";
    @attr
    public verticalScalingEnabled: boolean = false;

    public horizontalPosition: HorizontalPosition = "unset";
    public verticalPosition: VerticalPosition = "unset";

    private collisionDetector: IntersectionObserver;
    private resizeDetector: ResizeObserverClassDefinition;

    constructor() {
        super();
    }

    connectedCallback() {
        super.connectedCallback();

        this.collisionDetector = new IntersectionObserver(this.handleCollision, {
            root: viewportElement,
            rootMargin: "0px",
            threshold: [0, 1],
        });
        this.collisionDetector.observe(this.rootElement.current);
        this.collisionDetector.observe(anchorElement);

        this.resizeDetector = new (window as WindowWithResizeObserver).ResizeObserver(
            this.handleResize
        );
        this.resizeDetector.observe(anchorElement);
        this.resizeDetector.observe(this.rootElement.current);

        viewportElement.addEventListener("scroll", this.handleScroll);
    }

    public disconnectedCallback(): void {
        super.disconnectedCallback();

        // disconnect observer
        this.observer.disconnect();
    }

    anchorChanged() {}

    viewportChanged() {}

    positionChanged() {
        this.dispatchEvent(
            new CustomEvent("positionchanged", {
                bubbles: false,
                composed: true,
                detail: "current position",
            })
        );
    }

    /**
     *  Handle collisions
     */
    private handleCollision = (
        entries: IntersectionObserverEntry[],
        observer: IntersectionObserver
    ): void => {
        // let positionerRect: DOMRect | ClientRect = null;
        // entries.forEach((entry: IntersectionObserverEntry) => {
        //     if (entry.target === this.rootElement.current) {
        //         this.handlePositionerCollision(entry, entries.length === 1);
        //         positionerRect = entry.boundingClientRect;
        //     } else {
        //         this.handleAnchorCollision(entry);
        //     }
        // });
        // const viewPortElement: HTMLElement | null = this.getViewportElement(
        //     this.props.viewport
        // );
        // if (!isNil(viewPortElement)) {
        //     this.scrollTop = viewPortElement.scrollTop;
        //     this.scrollLeft = viewPortElement.scrollLeft;
        // }
        // if (entries.length === 2 && positionerRect !== null) {
        //     this.updatePositionerOffset(positionerRect);
        // }
        // this.requestFrame();
    };
}
