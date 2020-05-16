import { ResizeObserverEntry } from "./resize-observer-entry";

export type ConstructibleResizeObserver = new (
    callback: ResizeObserverCallback
) => ResizeObserverClassDefinition;

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
