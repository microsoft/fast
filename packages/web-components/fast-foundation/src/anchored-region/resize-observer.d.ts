import type { ResizeObserverEntry } from "./resize-observer-entry";
export declare type ConstructibleResizeObserver = new (
    callback: ResizeObserverCallback
) => ResizeObserverClassDefinition;
export declare class ResizeObserverClassDefinition {
    constructor(callback: ResizeObserverCallback);
    observe(target: Element): void;
    unobserve(target: Element): void;
    disconnect(): void;
}
export declare type ResizeObserverCallback = (
    entries: ResizeObserverEntry[],
    observer: ResizeObserverClassDefinition
) => void;
