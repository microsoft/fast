import { Markup, Observable, Subscriber } from "@microsoft/fast-element";

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

class DynamicTokenValue<T> {
    public readonly dependencies = new Set<DesignToken<any>>();
    private static cache = new WeakMap<
        DerivedDesignTokenValue<any>,
        DynamicTokenValue<any>
    >();
    constructor(private readonly value: DerivedDesignTokenValue<T>) {}
    public static getOrCreate<T>(
        value: DerivedDesignTokenValue<T>
    ): DynamicTokenValue<T> {
        let v = DynamicTokenValue.cache.get(value);

        if (v) {
            return v;
        }
        v = new DynamicTokenValue(value);
        DynamicTokenValue.cache.set(value, v);

        return v;
    }
}

export class DesignTokenNode {
    private _parent: DesignTokenNode | null = null;
    private _children: Set<DesignTokenNode> = new Set();
    private _values: Map<DesignToken<any>, StaticDesignTokenValue<any>> = new Map();

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

    public setTokenValue<T>(token: DesignToken<T>, value: StaticDesignTokenValue<T>) {
        this._values.set(token, value);

        Observable.getNotifier(token).notify(this);
    }

    public getTokenValue<T>(token: DesignToken<T>): StaticDesignTokenValue<T> {
        /* eslint-disable-next-line */
        let node: DesignTokenNode | null = this;
        let value;

        while (node !== null) {
            if (node._values.has(token)) {
                value = node._values.get(token)!;
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
