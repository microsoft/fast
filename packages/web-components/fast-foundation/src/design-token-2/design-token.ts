import { Observable, Subscriber } from "@microsoft/fast-element";

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
    id: symbol;
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
        const local = this.#values.get(token);

        if (local !== undefined) {
            return local;
        }

        if (this.#parent) {
            return this.#parent.getTokenValue(token);
        } else {
            throw new Error(`No value set for token ${token} in node tree.`);
        }
    }
}

function create<T extends Function>(name: string): never;
function create<T extends undefined | void>(name: string): never;
function create<T>(name: string): DesignToken<T>;
function create<T>(name: string): any {
    return { id: Symbol(name) };
}
export const DesignToken = Object.freeze({
    create,
});
