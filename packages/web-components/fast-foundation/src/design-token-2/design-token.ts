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

export class DesignTokenNode implements Subscriber {
    #parent: DesignTokenNode | null = null;
    #children: Set<DesignTokenNode> = new Set();
    #values: Map<DesignToken<any>, DesignTokenValue<any>> = new Map();

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
        Observable.getNotifier(this).subscribe(child);
    }

    public removeChild(child: DesignTokenNode) {
        if (child.parent === this) {
            child.#parent = null;
            this.#children.delete(child);
            Observable.getNotifier(this).unsubscribe(child);
        }
    }

    public setTokenValue<T>(token: DesignToken<T>, value: StaticDesignTokenValue<T>) {
        this.#values.set(token, value);

        Observable.getNotifier(this).notify([token]);
    }

    /**
     * Invoked when design tokens change upstream.
     *
     * @internal
     */
    public handleChange(source: DesignTokenNode, tokens: DesignToken<any>[]): void {
        // If source !== this, it means the notification is coming from upstream. In that case,
        // filter out any locally set tokens and notify.
        if (source !== this) {
            tokens = tokens.filter(token => !this.#values.has(token));

            if (tokens.length) {
                Observable.getNotifier(this).notify(tokens);
            }
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
