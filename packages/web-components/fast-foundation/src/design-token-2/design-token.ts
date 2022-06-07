import { BindingObserver, Markup, Observable } from "@microsoft/fast-element";

export type DesignTokenValueType =
    | string
    | number
    | boolean
    | BigInteger
    | null
    | Array<any>
    | symbol
    | {};
export interface DesignToken<T> {
    /**
     * A unique string identifier
     */
    readonly id: string;
}

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

    constructor(private readonly value: DerivedDesignTokenValue<T>) {
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

    public evaluate(node: DesignTokenNode): StaticDesignTokenValue<T> {
        const resolve = <T>(token: DesignToken<T>): StaticDesignTokenValue<T> => {
            this.dependencies.add(token);
            return node.getTokenValue(token);
        };

        return this.binding.observe(resolve);
    }
}

interface DesignTokenChangeRecord<T> {
    /**
     * The token that changed
     */
    token: DesignToken<T>;

    /**
     * The token value
     */
    value: DesignTokenValue<T>;
}

export class DesignTokenNode {
    private _parent: DesignTokenNode | null = null;
    private _children: Set<DesignTokenNode> = new Set();
    private _values: Map<DesignToken<any>, DesignTokenValue<any>> = new Map();
    private _derived: Map<
        DesignToken<any>,
        [DerivedDesignTokenValue<any>, StaticDesignTokenValue<any>]
    > = new Map();

    /**
     * Retrieves the tokens assigned directly to a node.
     * @param node - the node to retrieve assigned tokens for
     * @returns
     */
    public static getAssignedTokensForNode(node: DesignTokenNode): DesignToken<any>[] {
        return Array.from(node._values.keys());
    }

    /**
     * Retrieves the tokens assigned to the node and ancestor nodes.
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
     * Determines if a value is a { @DerivedDesignTokenValue }
     * @param value - The value to test
     */
    private static isDerivedTokenValue<T>(
        value: DesignTokenValue<T>
    ): value is DerivedDesignTokenValue<T> {
        return typeof value === "function";
    }

    /**
     * Tests if a token is assigned to a node
     * @param node - The node to test
     * @param token  - The token to test
     * @returns
     */
    public static isAssigned(node: DesignTokenNode, token: DesignToken<any>) {
        return node._values.has(token);
    }

    /**
     * Determines if the node has a derived value for token
     * @param node - The node to test
     * @param token - The token to test
     * @returns
     */
    public static isDerivedFor(node: DesignTokenNode, token: DesignToken<any>) {
        return node._derived.has(token);
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

        if (DesignTokenNode.isDerivedTokenValue(value)) {
            const evaluator = DerivedValueEvaluator.getOrCreate(value);
            const derivedValue = evaluator.evaluate(this);
            this._derived.set(token, [value, derivedValue]);
        }

        if (prev !== value) {
            Observable.getNotifier(token).notify(this);
        }
    }

    public getTokenValue<T>(token: DesignToken<T>): StaticDesignTokenValue<T> {
        /* eslint-disable-next-line */
        let node: DesignTokenNode | null = this;
        let value;

        while (node !== null) {
            if (DesignTokenNode.isDerivedFor(node, token)) {
                value = node._derived.get(token);
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
     * Notifies the node that a token has changed for the context.
     */
    private notify(records: DesignTokenChangeRecord<unknown>[]) {
        records = records.filter(
            record => !DesignTokenNode.isAssigned(this, record.token)
        );
    }
}

const nextId = (() => {
    let i = 0;
    return () => {
        return (i++).toString();
    };
})();

function create<T extends Function>(name: string): never;
function create<T extends undefined | void>(name: string): never;
function create<T>(name: string): DesignToken<T>;
function create<T>(name: string): any {
    return { id: Markup.interpolation(nextId()) };
}
export const DesignToken = Object.freeze({
    create,
});
