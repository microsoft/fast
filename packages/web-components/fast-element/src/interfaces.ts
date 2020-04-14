export type Callable = typeof Function.prototype.call | { call(): void };

export const emptyArray = Object.freeze([]);

let currentEvent: Event | null = null;

export function setCurrentEvent(event: Event | null) {
    currentEvent = event;
}

export const defaultExecutionContext = {
    index: 0,
    length: 0,
    parent: null as any,

    get event(): Event {
        return currentEvent!;
    },

    get even(): boolean {
        return this.index % 2 === 0;
    },

    get odd(): boolean {
        return this.index % 2 !== 0;
    },

    get first(): boolean {
        return this.index === 0;
    },

    get middle(): boolean {
        return !this.first && !this.last;
    },

    get last(): boolean {
        return this.index === this.length - 1;
    },
};

/**
 * Provides additional contextual information available to behaviors and expressions.
 */
export type ExecutionContext = typeof defaultExecutionContext;

/**
 * The signature of an arrow function capable of being evaluated as part of a template update.
 */
export type Expression<T = any, K = any> = (scope: T, context: ExecutionContext) => K;
