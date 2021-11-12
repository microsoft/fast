// TODO: the Resize Observer related files are a temporary stopgap measure until
// Resize Observer types are pulled into TypeScript, which seems imminent
// At that point these files should be deleted.
// https://github.com/microsoft/TypeScript/issues/37861

/** @internal */
export interface ContentRect {
    height: number;
    left: number;
    top: number;
    width: number;
}

/** @internal */
export declare const contentRect: (target: Element) => Readonly<ContentRect>;

/** @internal */
export declare class ResizeObserverEntry {
    public readonly target: Element;
    public readonly contentRect: ContentRect;
    constructor(target: Element);
}

/** @internal */
export declare class ResizeObserverClassDefinition {
    constructor(callback: ResizeObserverCallback);
    public observe(target: Element): void;
    public unobserve(target: Element): void;
    public disconnect(): void;
}

/** @internal */
export declare type ResizeObserverCallback = (
    entries: ResizeObserverEntry[],
    observer: ResizeObserverClassDefinition
) => void;

/** @internal */
export type ConstructibleResizeObserver = new (
    callback: ResizeObserverCallback
) => ResizeObserverClassDefinition;

declare global {
    interface WindowWithResizeObserver extends Window {
        ResizeObserver: ConstructibleResizeObserver;
    }
}
