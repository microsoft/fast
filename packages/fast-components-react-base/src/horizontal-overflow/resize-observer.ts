import { ResizeObserverEntry } from "./resize-observer-entry";

export declare class ResizeObserver {
    constructor(callback: ResizeObserverCallback);
    public observe(target: Element): void;
    public unobserve(target: Element): void;
    public disconnect(): void;
}

declare const install: () => typeof ResizeObserver;

export interface ContentRect {
    height: number;
    left: number;
    top: number;
    width: number;
}

export declare const contentRect: (target: Element) => Readonly<ContentRect>;

export declare type ResizeObserverCallback = (
    entries: ResizeObserverEntry[],
    observer: ResizeObserver
) => void;
