import type { HydrationDebugger } from "../hydration/hydration-debugger.js";
import { FASTElementDefinition } from "./fast-definitions.js";

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
 * The controller returned by `enableHydration()`.
 * @public
 */
export interface HydrationController {
    /**
     * Resolves when the active hydration batch completes.
     * @remarks
     * If hydration is configured with `stopHydration: StopHydration.never`, this
     * promise intentionally remains pending because hydration never reaches a
     * global completion point.
     */
    whenHydrated(): Promise<void>;
    /**
     * Resolves when hydration work for the specified tag name completes.
     * @param tagName - The custom element tag name to observe.
     */
    whenHydrated(tagName: string): Promise<void>;
}

type TagHydrationState = {
    promise: Promise<void>;
    pendingCount: number;
    resolve(): void;
    resolveTimer: ReturnType<typeof setTimeout> | null;
    resolved: boolean;
};

/**
 * Tracks prerendered elements through the hydration lifecycle and
 * exposes the active global hydration completion promise.
 *
 * @public
 */
export class HydrationTracker implements HydrationController {
    private elements: Set<HTMLElement> = new Set();
    private elementTags: WeakMap<HTMLElement, string> = new WeakMap();
    private tagHydrationStates: Map<string, TagHydrationState> = new Map();
    private started = false;
    private completed = false;
    private checkTimer: ReturnType<typeof setTimeout> | null = null;
    private stopHydration: StopHydration;
    private _whenHydrated!: Promise<void>;
    private resolveWhenHydrated: (() => void) | null = null;

    constructor(options: HydrationOptions) {
        this.prepareHydrationPromise();
        this.stopHydration = options.stopHydration ?? StopHydration.hydrationComplete;
    }

    /**
     * Resolves when the active hydration batch completes.
     */
    public whenHydrated(): Promise<void>;
    public whenHydrated(tagName: string): Promise<void>;
    public whenHydrated(tagName?: string): Promise<void> {
        if (tagName !== void 0) {
            return this.getTagHydrationPromise(tagName);
        }

        return this._whenHydrated;
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

            if (this.resolveWhenHydrated === null) {
                this.prepareHydrationPromise();
            }
        }

        if (!this.elements.has(element)) {
            const tagName =
                FASTElementDefinition.getForInstance(element)?.name ?? element.localName;

            this.elements.add(element);
            this.elementTags.set(element, tagName);
            this.addTagHydration(tagName);
        }
    }

    /**
     * Removes an element from the pending set and schedules
     * a debounced completion check.
     */
    public remove(element: HTMLElement): void {
        if (this.elements.delete(element)) {
            const tagName = this.elementTags.get(element);

            if (tagName !== void 0) {
                this.elementTags.delete(element);
                this.removeTagHydration(tagName);
            }
        }

        // Debounce: reset on every removal so we wait until no
        // new elements arrive before declaring complete.
        if (this.checkTimer !== null) {
            clearTimeout(this.checkTimer);
        }

        if (this.elements.size === 0) {
            this.checkTimer = setTimeout(() => {
                this.checkTimer = null;

                if (this.elements.size === 0) {
                    if (this.stopHydration !== StopHydration.never) {
                        this.resolveHydrationPromise();
                        this.completed = true;
                    }

                    this.started = false;
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

            if (
                incoming.stopHydration === StopHydration.never &&
                this.resolveWhenHydrated === null
            ) {
                this.prepareHydrationPromise();
            }
        }
    }

    private prepareHydrationPromise(): void {
        this._whenHydrated = new Promise<void>(resolve => {
            this.resolveWhenHydrated = resolve;
        });
    }

    private getTagHydrationPromise(tagName: string): Promise<void> {
        const state = this.getTagHydrationState(tagName);

        if (this.completed && this.stopHydration !== StopHydration.never) {
            this.resolveTagHydrationState(state);
        }

        return state.promise;
    }

    private addTagHydration(tagName: string): void {
        const state = this.getTagHydrationState(tagName);

        if (state.resolveTimer !== null) {
            clearTimeout(state.resolveTimer);
            state.resolveTimer = null;
        }

        if (state.resolved) {
            this.prepareTagHydrationState(state);
        }

        state.pendingCount++;
    }

    private removeTagHydration(tagName: string): void {
        const state = this.getTagHydrationState(tagName);

        if (state.pendingCount > 0) {
            state.pendingCount--;
        }

        if (state.pendingCount === 0) {
            this.scheduleTagHydrationResolution(state);
        }
    }

    private getTagHydrationState(tagName: string): TagHydrationState {
        const normalizedTagName = tagName.toLowerCase();
        let state = this.tagHydrationStates.get(normalizedTagName);

        if (state === void 0) {
            state = this.createTagHydrationState();
            this.tagHydrationStates.set(normalizedTagName, state);
        }

        return state;
    }

    private createTagHydrationState(): TagHydrationState {
        let resolve!: () => void;
        const promise = new Promise<void>(settle => {
            resolve = settle;
        });

        return {
            promise,
            pendingCount: 0,
            resolve,
            resolveTimer: null,
            resolved: false,
        };
    }

    private prepareTagHydrationState(state: TagHydrationState): void {
        let resolve!: () => void;
        state.promise = new Promise<void>(settle => {
            resolve = settle;
        });
        state.resolve = resolve;
        state.resolved = false;
    }

    private resolveTagHydrationState(state: TagHydrationState): void {
        if (state.resolved) {
            return;
        }

        if (state.resolveTimer !== null) {
            clearTimeout(state.resolveTimer);
            state.resolveTimer = null;
        }

        state.resolved = true;
        state.resolve();
    }

    private scheduleTagHydrationResolution(state: TagHydrationState): void {
        if (state.resolveTimer !== null) {
            clearTimeout(state.resolveTimer);
        }

        state.resolveTimer = setTimeout(() => {
            state.resolveTimer = null;

            if (state.pendingCount === 0) {
                this.resolveTagHydrationState(state);
            }
        }, 0);
    }

    private resolveTagHydrationPromises(): void {
        for (const state of this.tagHydrationStates.values()) {
            if (state.pendingCount === 0) {
                this.resolveTagHydrationState(state);
            }
        }
    }

    private resolveHydrationPromise(): void {
        const resolve = this.resolveWhenHydrated;
        this.resolveWhenHydrated = null;
        resolve?.();
        this.resolveTagHydrationPromises();
    }
}
