import { BindingObserver, Observable, Subscriber } from "@microsoft/fast-element";
import type { DesignToken } from "./design-token.js";

export type DesignTokenValueType =
    | string
    | number
    | boolean
    | BigInteger
    | null
    | Array<any>
    | symbol
    | {};

/**
 * A function that resolves the value of a DesignToken.
 */
export type DesignTokenResolver = <T>(token: DesignToken<T>) => StaticDesignTokenValue<T>;

/**
 * A {@link (DesignToken:interface)} value that is derived. These values can depend on other {@link (DesignToken:interface)}s
 * or arbitrary observable properties.
 * @public
 */
export type DerivedDesignTokenValue<T> = T extends Function
    ? never
    : (resolve: DesignTokenResolver) => StaticDesignTokenValue<T>;

/**
 * A design token value with no observable dependencies
 * @public
 */
export type StaticDesignTokenValue<T> = T extends Function ? never : T;

/**
 * The type that a {@link (DesignToken:interface)} can be set to.
 * @public
 */
export type DesignTokenValue<T> = StaticDesignTokenValue<T> | DerivedDesignTokenValue<T>;

class DerivedValueEvaluator<T> {
    private readonly binding: BindingObserver;
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

    public evaluate(
        node: DesignTokenNode,
        tokenContext: DesignToken<any>
    ): StaticDesignTokenValue<T> {
        const resolve = <T>(token: DesignToken<T>): StaticDesignTokenValue<T> => {
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
        Observable.getNotifier(this).notify(undefined);
    }
}

export class DesignTokenChangeRecord {
    constructor(
        public readonly target: DesignTokenNode,
        public readonly type: DesignTokenMutationType
    ) {}
}

export const enum DesignTokenMutationType {
    add,
    change,
    delete,
}

export class DesignTokenNode {
    private _parent: DesignTokenNode | null = null;
    private _children: Set<DesignTokenNode> = new Set();
    private _values: Map<DesignToken<any>, DesignTokenValue<any>> = new Map();
    private _derived: Map<
        DesignToken<any>,
        [DerivedValueEvaluator<any>, StaticDesignTokenValue<any>]
    > = new Map();

    /**
     * Determines if a value is a {@link DerivedDesignTokenValue}
     * @param value - The value to test
     */
    private static isDerivedTokenValue<T>(
        value: DesignTokenValue<T>
    ): value is DerivedDesignTokenValue<T> {
        return typeof value === "function";
    }

    private static evaluateDerived<T>(
        node: DesignTokenNode,
        token: DesignToken<T>,
        value: DerivedValueEvaluator<T>
    ): StaticDesignTokenValue<T> {
        const result = value.evaluate(node, token);
        node._derived.set(token, [value, result]);
        return result;
    }

    /**
     * Notifies the token subscribes that the value has changed for the node
     * @param token - The token that changed
     */
    private static notifyToken<T>(
        token: DesignToken<T>,
        node: DesignTokenNode,
        type: DesignTokenMutationType
    ): void {
        Observable.getNotifier(token).notify(new DesignTokenChangeRecord(node, type));
    }

    private static isDerivedFor<T>(node: DesignTokenNode, token: DesignToken<T>) {
        return node._derived.has(token);
    }

    /**
     * Collects token/value pairs for all derived token / values set on upstream nodes.
     */
    private static collectDerivedContext(
        node: DesignTokenNode
    ): Map<DesignToken<any>, DerivedValueEvaluator<any>> {
        const collected = new Map<DesignToken<any>, DerivedValueEvaluator<any>>();
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
                    collected.set(token, current!._derived.get(token)![0]);
                }
            }

            ignored = Array.from(new Set(ignored.concat(assigned)));
            current = current.parent;
        } while (current !== null);

        return collected;
    }

    /**
     * Resolves the local value for a token if it exists, otherwise returns undefined.
     */
    private static getLocalTokenValue<T>(
        node: DesignTokenNode,
        token: DesignToken<T>
    ): StaticDesignTokenValue<T> | undefined {
        return !DesignTokenNode.isAssigned(node, token)
            ? undefined
            : DesignTokenNode.isDerivedFor(node, token)
            ? node._derived.get(token)![1]
            : node._values.get(token);
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

    public get parent() {
        return this._parent;
    }

    public get children(): DesignTokenNode[] {
        return Array.from(this._children);
    }

    public appendChild(child: DesignTokenNode) {
        if (child.parent !== null) {
            child.parent.removeChild(child);
        }

        child._parent = this;
        this._children.add(child);
    }

    public removeChild(child: DesignTokenNode) {
        if (child.parent === this) {
            child._parent = null;
            this._children.delete(child);
        }
    }

    public setTokenValue<T>(token: DesignToken<T>, value: DesignTokenValue<T>) {
        const changeType =
            DesignTokenNode.isAssigned(this, token) ||
            DesignTokenNode.isDerivedFor(this, token)
                ? DesignTokenMutationType.change
                : DesignTokenMutationType.add;
        const prev = DesignTokenNode.getLocalTokenValue(this, token);
        this._values.set(token, value);
        const isDerived = DesignTokenNode.isDerivedTokenValue(value);
        const derivedContext = DesignTokenNode.collectDerivedContext(this);
        let result: StaticDesignTokenValue<T>;

        if (isDerived) {
            const evaluator = DerivedValueEvaluator.getOrCreate(value);
            Observable.getNotifier(evaluator).subscribe(this.derivedSubscriber);
            result = DesignTokenNode.evaluateDerived(this, token, evaluator);
        } else {
            result = value;
        }

        if (!isDerived && DesignTokenNode.isDerivedFor(this, token)) {
            this.tearDownDerivedTokenValue(token);
        }

        if (prev !== result) {
            DesignTokenNode.notifyToken(token, this, changeType);
        }

        this.notify(
            token,
            this,
            isDerived ? DerivedValueEvaluator.getOrCreate(value) : undefined
        );

        derivedContext.forEach((evaluator, token) => {
            // Skip over any derived values already established locally, because
            // those will get updated via this.notifyDerived and this.notifyStatic
            if (!DesignTokenNode.isDerivedFor(this, token)) {
                const prev = DesignTokenNode.getLocalTokenValue(this, token);
                const result = DesignTokenNode.evaluateDerived(this, token, evaluator);
                if (prev !== result) {
                    DesignTokenNode.notifyToken(
                        token,
                        this,
                        DesignTokenMutationType.change
                    );
                }

                this.notify(token, this, evaluator);
            }
        });
    }

    public getTokenValue<T>(token: DesignToken<T>): StaticDesignTokenValue<T> {
        /* eslint-disable-next-line */
        let node: DesignTokenNode | null = this;
        let value;

        while (node !== null) {
            if (DesignTokenNode.isDerivedFor(node, token)) {
                value = node._derived.get(token)![1];
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

    public deleteTokenValue<T>(token: DesignToken<T>): void {
        if (DesignTokenNode.isAssigned(this, token)) {
            const prev = DesignTokenNode.getLocalTokenValue(this, token);
            this._values.delete(token);
            this.tearDownDerivedTokenValue(token);
            let newValue: StaticDesignTokenValue<T> | undefined;
            try {
                newValue = this.getTokenValue(token);
            } catch (e) {
                newValue = undefined;
            }

            DesignTokenNode.notifyToken(token, this, DesignTokenMutationType.delete);

            if (prev !== newValue) {
                this.notify(token, this);
            }
        }
    }

    /**
     * Notifies that a token has been assigned a {@link DerivedDesignTokenValue } for the context.
     */
    private notify<T>(
        token: DesignToken<T>,
        originator: DesignTokenNode,
        evaluator?: DerivedValueEvaluator<T>
    ) {
        if (this !== originator) {
            if (DesignTokenNode.isAssigned(this, token)) {
                return;
            }

            if (evaluator) {
                // If this is not the originator, check to see if this node
                // has any dependencies of the token value. If so, we need to evaluate for this node
                evaluator.dependencies.forEach(dep => {
                    if (DesignTokenNode.isAssigned(this, dep)) {
                        const prev = DesignTokenNode.getLocalTokenValue(this, token);
                        const value = DesignTokenNode.evaluateDerived(
                            this,
                            token,
                            evaluator
                        );

                        if (prev !== value) {
                            DesignTokenNode.notifyToken(
                                token,
                                this,
                                DesignTokenMutationType.change
                            );
                        }
                        this.notify(token, this, evaluator);
                    }
                });
            }
        }

        // For all derived tokens on the node,
        // check if the fn has dependencies on the changed token.
        // If it does, re-evaluate and notify for the dependee
        for (const entry of this._derived) {
            if (originator === this && entry[0] === token) {
                // If this fn was just called by the node itself,
                // skip the token that kicked off notification
                continue;
            }

            const [_token, [evaluator]] = entry;

            if (evaluator.dependencies.has(token)) {
                DesignTokenNode.evaluateDerived(this, _token, evaluator);
                DesignTokenNode.notifyToken(_token, this, DesignTokenMutationType.change);
                this.notify(_token, originator, evaluator);
            }
        }

        for (let i = 0, l = this.children.length; i < l; i++) {
            this.children[i].notify(token, originator, evaluator);
        }
    }

    private derivedSubscriber: Subscriber = {
        handleChange: (subject: DerivedValueEvaluator<unknown>) => {
            for (const entry of this._derived.entries()) {
                const [token, [evaluator, prev]] = entry;

                if (evaluator === subject) {
                    const result = DesignTokenNode.evaluateDerived(
                        this,
                        token,
                        evaluator
                    );
                    if (result !== prev) {
                        DesignTokenNode.notifyToken(
                            token,
                            this,
                            DesignTokenMutationType.change
                        );
                        this.notify(token, this, evaluator);
                    }
                }
            }
        },
    };

    private tearDownDerivedTokenValue(token: DesignToken<any>) {
        if (DesignTokenNode.isDerivedFor(this, token)) {
            if (DesignTokenNode.isAssigned(this, token)) {
                Observable.getNotifier(this._derived.get(token)![0]).unsubscribe(
                    this.derivedSubscriber
                );
            }

            this._derived.delete(token);
        }
    }
}
