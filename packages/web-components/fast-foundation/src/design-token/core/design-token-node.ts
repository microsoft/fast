import { Observable } from "@microsoft/fast-element";
import type { Disposable, ExpressionNotifier, Subscriber } from "@microsoft/fast-element";
import type { DesignToken } from "./design-token.js";

/**
 * A function that resolves the value of a DesignToken.
 * @public
 */
export type DesignTokenResolver = <T>(token: DesignToken<T>) => T;

/**
 * A {@link DesignToken} value that is derived. These values can depend on other {@link DesignToken}s
 * or arbitrary observable properties.
 * @public
 */
export type DerivedDesignTokenValue<T> = (resolve: DesignTokenResolver) => T;

/**
 * A design token value with no observable dependencies
 * @public
 */
export type StaticDesignTokenValue<T> = T extends (...args: any[]) => any
    ? DerivedDesignTokenValue<T>
    : T;

/**
 * The type that a {@link DesignToken} can be set to.
 * @public
 */
export type DesignTokenValue<T> = StaticDesignTokenValue<T> | DerivedDesignTokenValue<T>;

class DerivedValueEvaluator<T> {
    private readonly binding: ExpressionNotifier;
    private notifier = Observable.getNotifier(this);
    public readonly dependencies = new Set<DesignToken<any>>();
    private static cache = new WeakMap<
        DerivedDesignTokenValue<any>,
        DerivedValueEvaluator<any>
    >();

    constructor(public readonly value: DerivedDesignTokenValue<T>) {
        this.binding = Observable.binding(value, this);
        this.binding.setMode(false);
    }

    public static getOrCreate<T>(
        value: DerivedDesignTokenValue<T>
    ): DerivedValueEvaluator<T> {
        let v = DerivedValueEvaluator.cache.get(value);

        if (v) {
            return v;
        }
        v = new DerivedValueEvaluator(value);
        DerivedValueEvaluator.cache.set(value, v);

        return v;
    }

    public evaluate(node: DesignTokenNode, tokenContext: DesignToken<any>): T {
        const resolve = <T>(token: DesignToken<T>): T => {
            this.dependencies.add(token);
            if (tokenContext === token) {
                if (node.parent) {
                    return node.parent.getTokenValue(token);
                }

                throw new Error(
                    "DesignTokenNode has encountered a circular token reference. Avoid this by setting the token value for an ancestor node."
                );
            } else {
                return node.getTokenValue(token);
            }
        };

        return this.binding.observe(resolve);
    }

    public handleChange() {
        this.notifier.notify(undefined);
    }
}

class DerivedValue<T> implements Disposable {
    value: T;
    constructor(
        public readonly token: DesignToken<T>,
        public readonly evaluator: DerivedValueEvaluator<T>,
        public readonly node: DesignTokenNode,
        private subscriber?: Subscriber
    ) {
        this.value = evaluator.evaluate(node, token);

        if (this.subscriber) {
            Observable.getNotifier(this.evaluator).subscribe(this.subscriber);
        }
    }

    public dispose(): void {
        if (this.subscriber) {
            Observable.getNotifier(this.evaluator).unsubscribe(this.subscriber);
        }
    }

    public update() {
        this.value = this.evaluator.evaluate(this.node, this.token);

        return this;
    }
}

/**
 * @public
 */
export interface DesignTokenChangeRecord<T> {
    readonly target: DesignTokenNode;
    readonly type: DesignTokenMutationType;
    readonly token: DesignToken<T>;
}

/**
 * @internal
 */
export class DesignTokenChangeRecordImpl<T> implements DesignTokenChangeRecord<T> {
    constructor(
        public readonly target: DesignTokenNode,
        public readonly type: DesignTokenMutationType,
        public readonly token: DesignToken<T>,
        public readonly value?: DesignTokenValue<T>
    ) {}

    public notify() {
        Observable.getNotifier(this.token).notify(this);
    }
}

/**
 * @public
 */
export const enum DesignTokenMutationType {
    add,
    change,
    delete,
}

/**
 * @public
 */
export class DesignTokenNode {
    private _parent: DesignTokenNode | null = null;
    private _children: Set<DesignTokenNode> = new Set();
    private _values: Map<DesignToken<any>, DesignTokenValue<any>> = new Map();
    private _derived: Map<DesignToken<any>, DerivedValue<any>> = new Map();
    private dependencyGraph: Map<DesignToken<any>, Set<DerivedValue<any>>> = new Map();
    private static _notifications: DesignTokenChangeRecordImpl<any>[] = [];

    /**
     * Determines if a value is a {@link DerivedDesignTokenValue}
     * @param value - The value to test
     */
    private static isDerivedTokenValue<T>(
        value: DesignTokenValue<T>
    ): value is DerivedDesignTokenValue<T> {
        return typeof value === "function";
    }

    /**
     * Determines if a token has a derived value for a node.
     */
    private static isDerivedFor<T>(node: DesignTokenNode, token: DesignToken<T>) {
        return node._derived.has(token);
    }

    /**
     * Collects token/value pairs for all derived token / values set on upstream nodes.
     */
    private static collectDerivedContext(
        node: DesignTokenNode
    ): Map<DesignToken<any>, DerivedValue<any>> {
        const collected = new Map<DesignToken<any>, DerivedValue<any>>();
        // Exit early if  there is no parent
        if (node.parent === null) {
            return collected;
        }

        let ignored = DesignTokenNode.getAssignedTokensForNode(node);
        let current: DesignTokenNode | null = node.parent;

        do {
            const assigned = DesignTokenNode.getAssignedTokensForNode(current);
            for (let i = 0, l = assigned.length; i < l; i++) {
                const token = assigned[i];

                if (
                    !ignored.includes(token) &&
                    DesignTokenNode.isDerivedFor(current, token)
                ) {
                    collected.set(token, current!._derived.get(token)!);
                }
            }

            ignored = Array.from(new Set(ignored.concat(assigned)));
            current = current.parent;
        } while (current !== null);

        return collected;
    }

    /**
     * Resolves the local value for a token if it is assigned, otherwise returns undefined.
     */
    private static getLocalTokenValue<T>(
        node: DesignTokenNode,
        token: DesignToken<T>
    ): StaticDesignTokenValue<T> | undefined {
        return !DesignTokenNode.isAssigned(node, token)
            ? undefined
            : DesignTokenNode.isDerivedFor(node, token)
            ? node._derived.get(token)!.value
            : node._values.get(token);
    }

    private static getOrCreateDependencyGraph(
        node: DesignTokenNode,
        token: DesignToken<any>
    ): Set<DerivedValue<any>> {
        let dependents = node.dependencyGraph.get(token);

        if (dependents) {
            return dependents;
        }

        dependents = new Set<DerivedValue<any>>();
        node.dependencyGraph.set(token, dependents);

        return dependents;
    }

    /**
     * Emit all queued notifications
     */
    private static notify() {
        const notifications = this._notifications;
        this._notifications = [];

        for (const record of notifications) {
            record.notify();
        }
    }

    private static queueNotification(...records: DesignTokenChangeRecordImpl<any>[]) {
        this._notifications.push(...records);
    }

    /**
     * Retrieves all tokens assigned directly to a node.
     * @param node - the node to retrieve assigned tokens for
     * @returns
     */
    public static getAssignedTokensForNode(node: DesignTokenNode): DesignToken<any>[] {
        return Array.from(node._values.keys());
    }

    /**
     * Retrieves all tokens assigned to the node and ancestor nodes.
     * @param node - the node to compose assigned tokens for
     */
    public static composeAssignedTokensForNode(
        node: DesignTokenNode
    ): DesignToken<any>[] {
        const tokens = new Set(DesignTokenNode.getAssignedTokensForNode(node));
        let current = node.parent;

        while (current !== null) {
            const assignedTokens = DesignTokenNode.getAssignedTokensForNode(current);

            for (const token of assignedTokens) {
                tokens.add(token);
            }

            current = current.parent;
        }

        return Array.from(tokens);
    }

    /**
     * Tests if a token is assigned directly to a node
     * @param node - The node to test
     * @param token  - The token to test
     * @returns
     */
    public static isAssigned<T>(node: DesignTokenNode, token: DesignToken<T>) {
        return node._values.has(token);
    }

    /**
     * The parent node
     */
    public get parent(): DesignTokenNode | null {
        return this._parent;
    }

    public get children(): DesignTokenNode[] {
        return Array.from(this._children);
    }

    /**
     * Appends a child to the node, notifying for any tokens set for the node's context.
     */
    public appendChild(child: DesignTokenNode) {
        let prevContext: DesignToken<any>[] | null = null;

        // If this node is already attached, get it's context so change record
        // types can be determined
        if (child.parent !== null) {
            prevContext = DesignTokenNode.composeAssignedTokensForNode(child.parent);
            child.parent._children.delete(child);
        }

        const context = DesignTokenNode.composeAssignedTokensForNode(this);
        const derivedContext = DesignTokenNode.collectDerivedContext(this);
        child._parent = this;
        this._children.add(child);

        for (const token of context) {
            let type = DesignTokenMutationType.add;
            if (prevContext !== null) {
                const prevContextIndex = prevContext.indexOf(token);
                if (prevContextIndex !== -1) {
                    type = DesignTokenMutationType.change;
                    prevContext.splice(prevContextIndex, 1);
                }
            }
            child.dispatch(
                new DesignTokenChangeRecordImpl(
                    this,
                    type,
                    token,
                    derivedContext.get(token)?.evaluator.value
                )
            );
        }

        if (prevContext !== null && prevContext.length > 0) {
            for (const token of prevContext) {
                child.dispatch(
                    new DesignTokenChangeRecordImpl(
                        this,
                        DesignTokenMutationType.delete,
                        token,
                        derivedContext.get(token)?.evaluator.value
                    )
                );
            }
        }

        DesignTokenNode.notify();
    }

    /**
     * Appends a child to the node, notifying for any tokens set for the node's context.
     */
    public removeChild(child: DesignTokenNode) {
        if (child.parent === this) {
            const context = DesignTokenNode.composeAssignedTokensForNode(this);

            child._parent = null;
            this._children.delete(child);

            for (const token of context) {
                child.dispatch(
                    new DesignTokenChangeRecordImpl(
                        this,
                        DesignTokenMutationType.delete,
                        token
                    )
                );
            }

            DesignTokenNode.notify();
        }
    }

    /**
     * Dispose of the node, removing parent/child relationships and
     * unsubscribing all observable binding subscribers. Does not emit
     * notifications.
     */
    public dispose() {
        if (this.parent) {
            this.parent._children.delete(this);
            this._parent = null;
        }

        for (const [, derived] of this._derived) {
            derived.dispose();
        }
    }

    /**
     * Sets a token to a value
     */
    public setTokenValue<T>(token: DesignToken<T>, value: DesignTokenValue<T>) {
        const changeType =
            DesignTokenNode.isAssigned(this, token) ||
            DesignTokenNode.isDerivedFor(this, token)
                ? DesignTokenMutationType.change
                : DesignTokenMutationType.add;
        const prev = DesignTokenNode.getLocalTokenValue(this, token);
        this._values.set(token, value);
        if (DesignTokenNode.isDerivedFor(this, token)) {
            this.tearDownDerivedTokenValue(token);
        }
        const isDerived = DesignTokenNode.isDerivedTokenValue(value);
        const derivedContext = DesignTokenNode.collectDerivedContext(this);
        let result: StaticDesignTokenValue<T>;

        if (isDerived) {
            const evaluator = this.setupDerivedTokenValue(token, value, true);
            result = evaluator.value;
        } else {
            result = value;
        }

        if (prev !== result) {
            DesignTokenNode.queueNotification(
                new DesignTokenChangeRecordImpl(this, changeType, token, value)
            );
        }

        this.dispatch(new DesignTokenChangeRecordImpl(this, changeType, token, value));

        derivedContext.forEach((derivedValue, token) => {
            // Skip over any derived values already established locally, because
            // those will get updated via this.notifyDerived and this.notifyStatic
            if (!DesignTokenNode.isDerivedFor(this, token)) {
                const prev = DesignTokenNode.getLocalTokenValue(this, token);
                derivedValue = this.setupDerivedTokenValue(
                    token,
                    derivedValue.evaluator.value
                );
                const result = derivedValue.value;
                if (prev !== result) {
                    DesignTokenNode.queueNotification(
                        new DesignTokenChangeRecordImpl(
                            this,
                            DesignTokenMutationType.change,
                            token,
                            derivedValue.evaluator.value
                        )
                    );
                }

                this.dispatch(
                    new DesignTokenChangeRecordImpl(
                        this,
                        DesignTokenMutationType.add,
                        token,
                        derivedValue.evaluator.value
                    )
                );
            }
        });

        DesignTokenNode.notify();
    }

    /**
     * Returns the resolve value for a token
     */
    public getTokenValue<T>(token: DesignToken<T>): T {
        /* eslint-disable-next-line */
        let node: DesignTokenNode | null = this;
        let value;

        while (node !== null) {
            if (DesignTokenNode.isDerivedFor(node, token)) {
                value = node._derived.get(token)!.value;
                break;
            }

            if (DesignTokenNode.isAssigned(node, token)) {
                value = node._values.get(token);
                break;
            }

            node = node._parent;
        }

        if (value !== undefined) {
            return value;
        } else {
            throw new Error(`No value set for token ${token} in node tree.`);
        }
    }

    /**
     * Deletes the token value for a node
     */
    public deleteTokenValue<T>(token: DesignToken<T>): void {
        if (DesignTokenNode.isAssigned(this, token)) {
            const prev = DesignTokenNode.getLocalTokenValue(this, token);
            this._values.delete(token);
            this.tearDownDerivedTokenValue(token);
            let newValue: T | undefined;
            try {
                newValue = this.getTokenValue(token);
            } catch (e) {
                newValue = undefined;
            }

            DesignTokenNode.queueNotification(
                new DesignTokenChangeRecordImpl(
                    this,
                    DesignTokenMutationType.delete,
                    token
                )
            );

            if (prev !== newValue) {
                this.dispatch(
                    new DesignTokenChangeRecordImpl(
                        this,
                        DesignTokenMutationType.delete,
                        token
                    )
                );
            }

            DesignTokenNode.notify();
        }
    }

    /**
     * Notifies that a token has been mutated
     */
    private dispatch<T>(record: DesignTokenChangeRecordImpl<T>) {
        if (this !== record.target) {
            const { token } = record;
            // If the node is assigned the token being dispatched and the assigned value does not depend on the token
            // (circular token reference) then terminate the dispatch.
            const isAssigned = DesignTokenNode.isAssigned(this, token);
            const containsCircularForToken =
                isAssigned && this._derived.get(token)?.evaluator.dependencies.has(token);
            if (isAssigned && !containsCircularForToken) {
                return;
            }

            // Delete token evaluations if the token is not assigned explicitly but is derived for the node and
            // the record is a delete type.
            if (
                record.type === DesignTokenMutationType.delete &&
                !isAssigned &&
                DesignTokenNode.isDerivedFor(this, token)
            ) {
                this.tearDownDerivedTokenValue(token);
                DesignTokenNode.queueNotification(
                    new DesignTokenChangeRecordImpl(
                        this,
                        DesignTokenMutationType.delete,
                        token
                    )
                );
            }

            if (containsCircularForToken) {
                record = new DesignTokenChangeRecordImpl(
                    this,
                    DesignTokenMutationType.change,
                    token,
                    this._derived.get(token)?.evaluator.value
                );
            }

            const { value } = record;

            if (value && DesignTokenNode.isDerivedTokenValue(value)) {
                const dependencies =
                    DerivedValueEvaluator.getOrCreate(value).dependencies;
                // If this is not the originator, check to see if this node
                // has any dependencies of the token value. If so, we need to evaluate for this node
                let evaluate = false;

                for (const dependency of dependencies) {
                    if (DesignTokenNode.isAssigned(this, dependency)) {
                        evaluate = true;
                        break;
                    }
                }

                if (evaluate) {
                    const prev = this._derived.get(token)?.value;
                    const derivedValue = this.setupDerivedTokenValue(token, value);

                    if (prev !== derivedValue.value) {
                        const type =
                            prev === undefined
                                ? DesignTokenMutationType.add
                                : DesignTokenMutationType.change;
                        const notification = new DesignTokenChangeRecordImpl(
                            this,
                            type,
                            token,
                            derivedValue.evaluator.value
                        );
                        DesignTokenNode.queueNotification(notification);
                        record = notification;
                    }
                }
            }
        }

        this.collectLocalChangeRecords(record).forEach(_record => {
            DesignTokenNode.queueNotification(_record);
            this.dispatch(_record);
        });

        this.notifyChildren(record);
    }

    /**
     * Generate change-records for local dependencies of a change record
     */
    private collectLocalChangeRecords<T>(
        record: DesignTokenChangeRecordImpl<T>
    ): Map<DesignToken<any>, DesignTokenChangeRecordImpl<any>> {
        const collected = new Map<DesignToken<any>, DesignTokenChangeRecordImpl<any>>();
        for (const dependent of DesignTokenNode.getOrCreateDependencyGraph(
            this,
            record.token
        )) {
            if (dependent.value !== dependent.update().value) {
                collected.set(
                    dependent.token,
                    new DesignTokenChangeRecordImpl(
                        this,
                        DesignTokenMutationType.change,
                        dependent.token,
                        dependent.evaluator.value
                    )
                );
            }
        }

        return collected;
    }

    /**
     *
     * Notify children of changes to the node
     */
    private notifyChildren(...records: DesignTokenChangeRecordImpl<any>[]) {
        if (this.children.length) {
            for (let i = 0, l = this.children.length; i < l; i++) {
                for (let j = 0; j < records.length; j++) {
                    this.children[i].dispatch(records[j]);
                }
            }
        }
    }

    private tearDownDerivedTokenValue(token: DesignToken<any>) {
        if (DesignTokenNode.isDerivedFor(this, token)) {
            const value = this._derived.get(token)!;

            value.dispose();

            this._derived.delete(token);

            value.evaluator.dependencies.forEach(dependency => {
                DesignTokenNode.getOrCreateDependencyGraph(this, dependency).delete(
                    value
                );
            });
        }
    }

    private setupDerivedTokenValue<T>(
        token: DesignToken<any>,
        value: DerivedDesignTokenValue<T>,
        subscribeNode = false
    ) {
        const deriver = new DerivedValue(
            token,
            DerivedValueEvaluator.getOrCreate(value),
            this,
            subscribeNode
                ? {
                      handleChange: () => {
                          if (deriver.value !== deriver.update().value) {
                              const record = new DesignTokenChangeRecordImpl(
                                  this,
                                  DesignTokenMutationType.change,
                                  deriver.token,
                                  deriver.evaluator.value
                              );
                              DesignTokenNode.queueNotification(record);

                              this.dispatch(record);
                              DesignTokenNode.notify();
                          }
                      },
                  }
                : undefined
        );

        this._derived.set(token, deriver);

        deriver.evaluator.dependencies.forEach(dependency => {
            if (dependency !== token) {
                DesignTokenNode.getOrCreateDependencyGraph(this, dependency).add(deriver);
            }
        });

        return deriver;
    }
}
