import type { Subscriber } from "@microsoft/fast-element";

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
    }

    public removeChild(child: DesignTokenNode) {
        if (child.parent === this) {
            child.#parent = null;
            this.#children.delete(child);
        }
    }

    /**
     * Invoked when design tokens change upstream.
     *
     * @internal
     */
    public handleChange(subject: any, args: any): void {}
}
