import { ConstructibleResizeObserver } from "./resize-observer";
import { ConstructibleIntersectionObserver } from "./intersection-observer";

const DisplayNamePrefix: string = "Base";

declare global {
    interface WindowWithResizeObserver extends Window {
        ResizeObserver: ConstructibleResizeObserver;
    }

    interface WindowWithIntersectionObserver extends Window {
        IntersectionObserver: ConstructibleIntersectionObserver;
    }
}

export { DisplayNamePrefix, WindowWithIntersectionObserver, WindowWithResizeObserver };

export * from "./resize-observer";
export * from "./resize-observer-entry";
export * from "./intersection-observer";
export * from "./intersection-observer-entry";
