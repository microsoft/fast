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

export class DesignTokenNode {
    #parent: DesignTokenNode | null = null;
    #children: Set<DesignTokenNode> = new Set();
    #values: Map<DesignToken<any>, StaticDesignTokenValue<any>> = new Map();

    /**
     * Subscribed to the parent {@link DesignTokenNode} during appendChild() and
     * unsubscribed during removeChild(). This handler is responsible for interpreting
     * upstream token changes and notifying the node of relevant changes.
     */
    #parentSubscriber: Subscriber = {
        handleChange: (parent: DesignTokenNode, tokens: DesignToken<any>[]): void => {
            if (this.#values.size) {
                tokens = tokens.filter(token => !this.#values.has(token));
            }

            if (tokens.length) {
                Observable.getNotifier(this).notify(tokens);
            }
        },
    };

    /**
     * Retrieves the tokens assigned directly to a node.
     * @param node - the node to retrieve assigned tokens for
     * @returns
     */
    public static getAssignedTokensForNode(node: DesignTokenNode): DesignToken<any>[] {
        return Array.from(node.#values.keys());
    }

    /**
     * Retrieves the tokens assigned to the node and ancestor nodes.
     * @param node - the node to compose assigned tokens for
     */
    public static getAssignedTokensForNodeTree(
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
        return this.#parent;
    }

    public get children(): DesignTokenNode[] {
        return Array.from(this.#children);
    }

    public appendChild(child: DesignTokenNode) {
        if (child.parent !== null) {
            child.parent.removeChild(child);
        }

        child.#parent = this;
        this.#children.add(child);
        Observable.getNotifier(this).subscribe(child.#parentSubscriber);

        const tokens = DesignTokenNode.getAssignedTokensForNodeTree(this);

        if (tokens.length) {
            child.#parentSubscriber.handleChange(this, tokens);
        }
    }

    public removeChild(child: DesignTokenNode) {
        if (child.parent === this) {
            child.#parent = null;
            this.#children.delete(child);
            Observable.getNotifier(this).unsubscribe(child.#parentSubscriber);
        }
    }

    public setTokenValue<T>(token: DesignToken<T>, value: StaticDesignTokenValue<T>) {
        this.#values.set(token, value);

        Observable.getNotifier(this).notify([token]);
    }

    public getTokenValue<T>(token: DesignToken<T>): StaticDesignTokenValue<T> {
        /* eslint-disable-next-line */
        let node: DesignTokenNode | null = this;
        let value;

        while (node !== null) {
            if (node.#values.has(token)) {
                value = node.#values.get(token)!;
                break;
            }

            node = node.#parent;
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
