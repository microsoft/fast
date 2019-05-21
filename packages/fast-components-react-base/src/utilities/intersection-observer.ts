import { IntersectionObserverEntry } from "./intersection-observer-entry";

export type ConstructibleIntersectionObserver = new (
    callback: IntersectionObserverCallback,
    options: IntersectionObserverOptions
) => IntersectionObserverClassDefinition;

export declare class IntersectionObserverClassDefinition {
    public root: Element;
    public rootMargin: string;
    public thresholds: number[];
    constructor(
        callback: IntersectionObserverCallback,
        options: IntersectionObserverOptions
    );
    public observe(target: Element): void;
    public unobserve(target: Element): void;
    public disconnect(): void;
    public takeRecords(): IntersectionObserverEntry[];
}

export declare type IntersectionObserverCallback = (
    entries: IntersectionObserverEntry[],
    observer: IntersectionObserverClassDefinition
) => void;

export interface IntersectionObserverOptions {
    root: Element;
    rootMargin: string;
    threshold: number | number[];
}
