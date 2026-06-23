import type { HydrationDebugger } from "../hydration/hydration-debugger.js";

/**
 * Describes when FAST should stop hydrating newly connected prerendered elements.
 * @public
 */
export const StopHydration = Object.freeze({
    /**
     * Stop hydrating new prerendered elements after the active hydration batch completes.
     */
    hydrationComplete: "hydration-complete",
    /**
     * Keep the hydration hook active for later prerendered elements.
     */
    never: "never",
} as const);

/**
 * Describes when FAST should stop hydrating newly connected prerendered elements.
 * @public
 */
export type StopHydration = (typeof StopHydration)[keyof typeof StopHydration];

let currentWhenHydrated: Promise<void> = Promise.resolve();
let resolveWhenHydrated: (() => void) | null = null;

class HydrationCompletionPromise implements Promise<void> {
    public readonly [Symbol.toStringTag] = "Promise";

    // biome-ignore lint/suspicious/noThenProperty: `whenHydrated` intentionally acts as a stable Promise proxy.
    public then<TResult1 = void, TResult2 = never>(
        onfulfilled?: ((value: void) => TResult1 | PromiseLike<TResult1>) | null,
        onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | null,
    ): Promise<TResult1 | TResult2> {
        return currentWhenHydrated.then(onfulfilled, onrejected);
    }

    public catch<TResult = never>(
        onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | null,
    ): Promise<void | TResult> {
        return currentWhenHydrated.catch(onrejected);
    }
}

/**
 * Resolves when the active hydration batch completes.
 * @public
 */
export const whenHydrated: Promise<void> = new HydrationCompletionPromise();

function prepareHydrationPromise(): void {
    currentWhenHydrated = new Promise<void>(resolve => {
        resolveWhenHydrated = resolve;
    });
}

function resolveHydrationPromise(): void {
    const resolve = resolveWhenHydrated;
    resolveWhenHydrated = null;
    resolve?.();
}

/**
 * Options for configuring hydration behavior.
 * @public
 */
export interface HydrationOptions {
    /**
     * Indicates when the hydration hook should stop handling new
     * prerendered elements.
     *
     * @defaultValue StopHydration.hydrationComplete
     */
    stopHydration?: StopHydration;
    /**
     * Optional opt-in debugger that swaps the default minimal hydration
     * mismatch error message for a rich "Expected … / Received …" report
     * including an HTML snippet of the SSR DOM and structured
     * `expected`/`received` fields on `HydrationBindingError` /
     * `HydrationTargetElementError`. Obtained via
     * `hydrationDebugger()` from `@microsoft/fast-element/hydration.js`.
     */
    debugger?: HydrationDebugger;
}

/**
 * Tracks prerendered elements through the hydration lifecycle and
 * resolves `whenHydrated` at completion.
 *
 * @public
 */
export class HydrationTracker {
    private elements: Set<HTMLElement> = new Set();
    private started = false;
    private completed = false;
    private checkTimer: ReturnType<typeof setTimeout> | null = null;
    private stopHydration: StopHydration;

    constructor(options: HydrationOptions) {
        prepareHydrationPromise();
        this.stopHydration = options.stopHydration ?? StopHydration.hydrationComplete;
    }

    /**
     * Indicates whether the hydration hook should attempt to hydrate
     * prerendered elements.
     */
    public get shouldHydrate(): boolean {
        return !this.completed || this.stopHydration === StopHydration.never;
    }

    /**
     * Registers an element as pending hydration.
     */
    public add(element: HTMLElement): void {
        this.completed = false;

        if (!this.started) {
            this.started = true;

            if (resolveWhenHydrated === null) {
                prepareHydrationPromise();
            }
        }

        this.elements.add(element);
    }

    /**
     * Removes an element from the pending set and schedules
     * a debounced completion check.
     */
    public remove(element: HTMLElement): void {
        this.elements.delete(element);

        // Debounce: reset on every removal so we wait until no
        // new elements arrive before declaring complete.
        if (this.checkTimer !== null) {
            clearTimeout(this.checkTimer);
        }

        if (this.elements.size === 0) {
            this.checkTimer = setTimeout(() => {
                this.checkTimer = null;

                if (this.elements.size === 0) {
                    resolveHydrationPromise();
                    this.started = false;
                    this.completed = true;
                }
            }, 0);
        }
    }

    /**
     * Merges additional options into the tracker.
     */
    public mergeOptions(incoming: HydrationOptions): void {
        if (incoming.stopHydration !== void 0) {
            this.stopHydration = incoming.stopHydration;
        }
    }
}
