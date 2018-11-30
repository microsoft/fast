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
