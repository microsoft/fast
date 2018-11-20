import { ContentRect } from "./resize-observer";

export declare class ResizeObserverEntry {
    public readonly target: Element;
    public readonly contentRect: ContentRect;
    constructor(target: Element);
}
