export declare class IntersectionObserverEntry {
    public readonly boundingClientRect: ClientRect | DOMRect;
    public readonly intersectionRatio: number;
    public readonly intersectionRect: ClientRect | DOMRect;
    public readonly isIntersecting: boolean;
    public readonly rootBounds: ClientRect | DOMRect;
    public readonly target: Element;
    public readonly time: DOMHighResTimeStamp;
    constructor(target: Element);
}
