/**
 * Options for configuring global hydration lifecycle events.
 * @public
 */
export interface HydrationOptions {
    /** Called once when the first prerendered element begins hydrating. */
    hydrationStarted?(): void;
    /** Called after all prerendered elements have completed hydration. */
    hydrationComplete?(): void;
}

/**
 * Tracks prerendered elements through the hydration lifecycle and
 * fires global callbacks at start and completion. Per-element callbacks
 * (`elementWillHydrate`, `elementDidHydrate`) are handled through
 * definition-level {@link TemplateLifecycleCallbacks}.
 *
 * @public
 */
export class HydrationTracker {
    private elements: Set<HTMLElement> = new Set();
    private started = false;
    private checkTimer: ReturnType<typeof setTimeout> | null = null;

    constructor(private options: HydrationOptions) {}

    /**
     * Registers an element as pending hydration.
     * Fires `hydrationStarted` on the first call.
     */
    public add(element: HTMLElement): void {
        if (!this.started) {
            this.started = true;
            try {
                this.options.hydrationStarted?.();
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
                        this.options.hydrationComplete?.();
                    } catch {
                        // A lifecycle callback must never prevent post-hydration cleanup.
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
        const prev = this.options;
        this.options = {
            hydrationStarted: chainCallback(
                prev.hydrationStarted,
                incoming.hydrationStarted,
            ),
            hydrationComplete: chainCallback(
                prev.hydrationComplete,
                incoming.hydrationComplete,
            ),
        };
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
