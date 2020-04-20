import { emptyArray } from "../interfaces";
import { DOM } from "../dom";
import { Notifier, PropertyChangeNotifier } from "./notifier";

const notifierLookup = new WeakMap<any, Notifier>();
let watcher: ObservableExpression | undefined = void 0;

export const Observable = {
    /* eslint-disable-next-line @typescript-eslint/no-unused-vars */
    createArrayObserver(array: any[]): Notifier {
        throw new Error("Must call enableArrayObservation before observing arrays.");
    },

    getNotifier<T extends Notifier = Notifier>(source: any): T {
        let found = source.$fastController || notifierLookup.get(source);

        if (found === void 0) {
            if (Array.isArray(source)) {
                found = Observable.createArrayObserver(source);
            } else {
                notifierLookup.set(source, (found = new PropertyChangeNotifier()));
            }
        }

        return found;
    },

    track(source: unknown, propertyName: string): void {
        if (watcher !== void 0) {
            watcher.observe(source, propertyName);
        }
    },

    notify(source: unknown, args: any): void {
        /* eslint-disable-next-line @typescript-eslint/no-use-before-define */
        getNotifier(source).notify(source, args);
    },

    define(target: {}, propertyName: string): void {
        const fieldName = `_${propertyName}`;
        const callbackName = `${propertyName}Changed`;
        const hasCallback = callbackName in target;

        const observedProperties =
            (target as any).observedProperties ||
            ((target as any).observedProperties = []);
        observedProperties.push(propertyName);

        Reflect.defineProperty(target, propertyName, {
            enumerable: true,
            get: function (this: any) {
                if (watcher !== void 0) {
                    watcher.observe(this, propertyName);
                }

                return this[fieldName];
            },
            set: function (this: any, newValue: any) {
                const oldValue = this[fieldName];

                if (oldValue !== newValue) {
                    this[fieldName] = newValue;

                    if (hasCallback) {
                        this[callbackName](oldValue, newValue);
                    }
                    /* eslint-disable-next-line @typescript-eslint/no-use-before-define */
                    getNotifier(this).notify(this, propertyName);
                }
            },
        });
    },

    getObservedProperties(target: {}): string[] {
        return (target as any).observedProperties || emptyArray;
    },
};

const getNotifier = Observable.getNotifier;
const queueUpdate = DOM.queueUpdate;

export function observable($target: {}, $prop: string): void {
    Observable.define($target, $prop);
}

let currentEvent: Event | null = null;

export function setCurrentEvent(event: Event | null): void {
    currentEvent = event;
}

/**
 * Provides additional contextual information available to behaviors and expressions.
 */
export class ExecutionContext<TParent = any> {
    public index: number = 0;
    public length: number = 0;

    public parent: TParent = null as any;

    public get event(): Event {
        return currentEvent!;
    }

    public get even(): boolean {
        return this.index % 2 === 0;
    }

    public get odd(): boolean {
        return this.index % 2 !== 0;
    }

    public get first(): boolean {
        return this.index === 0;
    }

    public get middle(): boolean {
        return !this.first && !this.last;
    }

    public get last(): boolean {
        return this.index === this.length - 1;
    }
}

Observable.define(ExecutionContext.prototype, "index");
Observable.define(ExecutionContext.prototype, "length");

export const defaultExecutionContext = new ExecutionContext();

/**
 * The signature of an arrow function capable of being evaluated as part of a template update.
 */
export type Expression<TScope = any, TReturn = any, TParent = any> = (
    scope: TScope,
    context: ExecutionContext<TParent>
) => TReturn;

export interface ExpressionObserver {
    handleExpressionChange(expression: ObservableExpression): void;
}

interface SubscriptionRecord {
    source: any;
    propertyName: string;
    notifier: Notifier;
    next: SubscriptionRecord | undefined;
}

export class ObservableExpression {
    private needsRefresh: boolean = true;
    private needsQueue: boolean = true;

    private first: SubscriptionRecord = this as any;
    private last: SubscriptionRecord | null = null;

    private source: any = void 0;
    private propertyName: string | undefined = void 0;
    private notifier: Notifier | undefined = void 0;
    private next: SubscriptionRecord | undefined = void 0;

    constructor(private expression: Expression, private observer: ExpressionObserver) {}

    public evaluate(scope: unknown, context: ExecutionContext): any {
        if (this.needsRefresh && this.last !== null) {
            this.dispose();
        }

        watcher = this.needsRefresh ? this : void 0;
        this.needsRefresh = false;
        const result = this.expression(scope, context);
        watcher = void 0;

        return result;
    }

    public dispose(): void {
        if (this.last !== null) {
            let current = this.first;

            while (current !== void 0) {
                current.notifier.unsubscribe(this, current.propertyName);
                current = current.next!;
            }

            this.last = null;
            this.needsRefresh = true;
        }
    }

    /** @internal */
    public observe(source: unknown, propertyName: string): void {
        const prev = this.last;
        const notifier = getNotifier(source);
        const current: SubscriptionRecord = prev === null ? this.first : ({} as any);

        current.source = source;
        current.propertyName = propertyName;
        current.notifier = notifier;

        notifier.subscribe(this, propertyName);

        if (prev !== null) {
            if (!this.needsRefresh) {
                watcher = void 0;
                const prevValue = prev.source[prev.propertyName];
                watcher = this;

                if (source === prevValue) {
                    this.needsRefresh = true;
                }
            }

            prev.next = current;
        }

        this.last = current!;
    }

    /** @internal */
    handleChange(): void {
        if (this.needsQueue) {
            this.needsQueue = false;
            queueUpdate(this);
        }
    }

    /** @internal */
    call(): void {
        this.needsQueue = true;
        this.observer.handleExpressionChange(this);
    }
}
