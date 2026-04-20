/**
 * Lifecycle callbacks for element hydration events.
 * @public
 */
export interface ElementHydrationCallbacks {
    /** Called once when the first prerendered element begins hydrating. */
    hydrationStarted?(): void;
    /** Called before an individual element's hydration begins. */
    elementWillHydrate?(source: HTMLElement): void;
    /** Called after an individual element's hydration has finished. */
    elementDidHydrate?(source: HTMLElement): void;
    /** Called after all prerendered elements have completed hydration. */
    hydrationComplete?(): void;
}

/**
 * Tracks prerendered elements through the hydration lifecycle and
 * fires callbacks at each stage. Each element is added before its
 * hydration bind and removed after. When the last element finishes
 * and no new elements arrive, `hydrationComplete` is fired.
 *
 * @public
 */
export class HydrationTracker {
    private elements: Set<HTMLElement> = new Set();
    private started = false;
    private checkTimer: ReturnType<typeof setTimeout> | null = null;

    constructor(private callbacks: ElementHydrationCallbacks) {}

    /**
     * Registers an element as pending hydration.
     * Fires `hydrationStarted` on the first call.
     */
    public add(element: HTMLElement): void {
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
     * Fires the `elementWillHydrate` callback for an element.
     */
    public notifyWillHydrate(element: HTMLElement): void {
        try {
            this.callbacks.elementWillHydrate?.(element);
        } catch {
            // A lifecycle callback must never prevent hydration.
        }
    }

    /**
     * Removes an element from the pending set, fires
     * `elementDidHydrate`, and schedules a debounced
     * completion check.
     */
    public remove(element: HTMLElement): void {
        try {
            this.callbacks.elementDidHydrate?.(element);
        } catch {
            // A lifecycle callback must never prevent hydration.
        }

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
                    }
                }
            }, 0);
        }
    }
}
