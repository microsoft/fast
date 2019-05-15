import { ConstructableResizeObserver } from "./resize-observer";
import { ConstructableIntersectionObserver } from "./intersection-observer";

const DisplayNamePrefix: string = "Base";

declare global {
    interface WindowWithResizeObserver extends Window {
        ResizeObserver: ConstructableResizeObserver;
    }

    interface WindowWithIntersectionObserver extends Window {
        IntersectionObserver: ConstructableIntersectionObserver;
    }
}

export { DisplayNamePrefix };
export * from "./resize-observer";
export * from "./resize-observer-entry";
export * from "./intersection-observer";
export * from "./intersection-observer-entry";
