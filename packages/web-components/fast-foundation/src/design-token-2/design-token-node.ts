import { BindingObserver, Observable, Subscriber } from "@microsoft/fast-element";
import { ObservableMap } from "./observable-map.js";
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
        this.binding = Observable.binding(value);
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
}

export class DesignTokenNode {
    private _parent: DesignTokenNode | null = null;
    private _children: Set<DesignTokenNode> = new Set();
    private _values: Map<DesignToken<any>, DesignTokenValue<any>> = new Map();
    private _derived: ObservableMap<
        DesignToken<any>,
        [DerivedDesignTokenValue<any>, StaticDesignTokenValue<any>]
    > = new ObservableMap();

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
        value: DerivedDesignTokenValue<T>
    ) {
        const evaluator = DerivedValueEvaluator.getOrCreate(value);
        const result = evaluator.evaluate(node, token);
        const prev = node._derived.get(token);

        if (prev === undefined || value !== prev[0] || result !== prev[1]) {
            node._derived.set(token, [value, result]);
        }

        return result;
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

    private static isDerivedFor<T>(node: DesignTokenNode, token: DesignToken<T>) {
        return node._derived.has(token);
    }

    /**
     * Collects token/value pairs for all derived token / values set on upstream nodes.
     */
    private static collectDerivedContext(
        node: DesignTokenNode
    ): Map<DesignToken<any>, DerivedDesignTokenValue<any>> {
        const collected = new Map<DesignToken<any>, DerivedDesignTokenValue<any>>();
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

    constructor() {
        Observable.getNotifier(this._derived).subscribe(this.derivedSubscriber);
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
        const prev = this._values.get(token);
        this._values.set(token, value);

        const derived = DesignTokenNode.collectDerivedContext(this);

        if (DesignTokenNode.isDerivedTokenValue(value)) {
            DesignTokenNode.evaluateDerived(this, token, value);
            this.notifyDerived(token, DerivedValueEvaluator.getOrCreate(value), this);
        } else {
            // _derived.delete will notify for the token that is deleted, so only notify if deleting the value
            // was unsuccessful
            const notified =
                DesignTokenNode.isDerivedFor(this, token) && this._derived.delete(token);

            if (prev !== value) {
                if (!notified) {
                    Observable.getNotifier(token).notify(this);
                }

                this.notifyStatic(token, this);
            }
        }

        derived.forEach((fn, token) => {
            const evaluator = DerivedValueEvaluator.getOrCreate(fn);
            DesignTokenNode.evaluateDerived(this, token, fn);
            this.notifyDerived(token, evaluator, this);
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
            this._values.delete(token);
            const notified =
                DesignTokenNode.isDerivedFor(this, token) && this._derived.delete(token);

            if (!notified) {
                Observable.getNotifier(token).notify(this);
            }
        }
    }

    /**
     * Notifies the node that a token has changed for the context.
     */
    private notifyStatic<T>(token: DesignToken<T>, originator: DesignTokenNode) {
        if (this !== originator && DesignTokenNode.isAssigned(this, token)) {
            return;
        }

        for (const entry of this._derived) {
            const [_token, [source]] = entry;
            const evaluator = DerivedValueEvaluator.getOrCreate(source);

            if (evaluator.dependencies.has(token)) {
                DesignTokenNode.evaluateDerived(this, _token, source);
                this.notifyDerived(_token, evaluator, originator);
            }
        }

        for (let i = 0, l = this.children.length; i < l; i++) {
            this.children[i].notifyStatic(token, originator);
        }
    }

    /**
     * Notifies that a token has been assigned a {@link DerivedDesignTokenValue } for the context.
     */
    private notifyDerived<T>(
        token: DesignToken<T>,
        evaluator: DerivedValueEvaluator<T>,
        originator: DesignTokenNode
    ) {
        if (this !== originator) {
            if (DesignTokenNode.isAssigned(this, token)) {
                return;
            }

            // If this is not the originator, check to see if this node
            // has any dependencies of the token value. If so, we need to evaluate for this node
            evaluator.dependencies.forEach(dep => {
                if (DesignTokenNode.isAssigned(this, dep)) {
                    DesignTokenNode.evaluateDerived(this, token, evaluator.value);
                    this.notifyDerived(token, evaluator, this);
                }
            });
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

            const [_token, [source]] = entry;
            const evaluator = DerivedValueEvaluator.getOrCreate(source);

            if (evaluator.dependencies.has(token)) {
                DesignTokenNode.evaluateDerived(this, _token, source);
                this.notifyDerived(_token, evaluator, originator);
            }
        }

        for (let i = 0, l = this.children.length; i < l; i++) {
            this.children[i].notifyDerived(token, evaluator, originator);
        }
    }

    /**
     * Change handler for derived token values
     */
    private derivedSubscriber: Subscriber = {
        handleChange: (source: ObservableMap, value: DesignToken<any>) => {
            this.notifyToken(value);
        },
    };

    /**
     * Notifies the token subscribes that the value has changed for the node
     * @param token - The token that changed
     */
    private notifyToken<T>(token: DesignToken<T>): void {
        Observable.getNotifier(token).notify(this);
    }
}
