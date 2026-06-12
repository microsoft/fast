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

/**
 * Options for configuring global hydration lifecycle events and behavior.
 * @public
 */
export interface HydrationOptions {
    /** Called when a prerendered hydration batch begins. */
    hydrationStarted?(): void;
    /** Called after all prerendered elements in a hydration batch complete. */
    hydrationComplete?(): void;
    /**
     * Indicates when the hydration hook should stop handling new
     * prerendered elements.
     *
     * @defaultValue StopHydration.hydrationComplete
     */
    stopHydration?: StopHydration;
}

type HydrationCallbacks = Pick<
    HydrationOptions,
    "hydrationStarted" | "hydrationComplete"
>;

/**
 * Tracks prerendered elements through the hydration lifecycle and
 * fires global callbacks at start and completion. Per-element callbacks
 * (`elementWillHydrate`, `elementDidHydrate`) are handled through
 * definition-level `TemplateLifecycleCallbacks`.
 *
 * @public
 */
export class HydrationTracker {
    private elements: Set<HTMLElement> = new Set();
    private started = false;
    private completed = false;
    private checkTimer: ReturnType<typeof setTimeout> | null = null;
    private callbacks: HydrationCallbacks;
    private stopHydration: StopHydration;

    constructor(options: HydrationOptions) {
        this.callbacks = options;
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
     * Fires `hydrationStarted` on the first call.
     */
    public add(element: HTMLElement): void {
        this.completed = false;

        if (!this.started) {
            this.started = true;
            try {
                this.callbacks.hydrationStarted?.();
            } catch {
                // A lifecycle callback must never prevent hydration.
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
                    try {
                        this.callbacks.hydrationComplete?.();
                    } catch {
                        // A lifecycle callback must never prevent post-hydration cleanup.
                    } finally {
                        this.started = false;
                        this.completed = true;
                    }
                }
            }, 0);
        }
    }

    /**
     * Merges additional options into the tracker, chaining
     * callbacks so both the original and new callbacks fire.
     */
    public mergeOptions(incoming: HydrationOptions): void {
        const prev = this.callbacks;
        this.callbacks = {
            hydrationStarted: chainCallback(
                prev.hydrationStarted,
                incoming.hydrationStarted,
            ),
            hydrationComplete: chainCallback(
                prev.hydrationComplete,
                incoming.hydrationComplete,
            ),
        };

        if (incoming.stopHydration !== void 0) {
            this.stopHydration = incoming.stopHydration;
        }
    }
}

function chainCallback(
    first: (() => void) | undefined,
    second: (() => void) | undefined,
): (() => void) | undefined {
    if (!first) return second;
    if (!second) return first;
    return () => {
        try {
            first();
        } catch {
            // Isolate callbacks so one consumer cannot suppress another.
        }
        try {
            second();
        } catch {
            // Isolate callbacks so one consumer cannot suppress another.
        }
    };
}
