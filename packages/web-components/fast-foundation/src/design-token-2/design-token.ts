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
export interface DesignToken<
    T extends string | number | boolean | BigInteger | null | Array<any> | symbol | {}
> {
    /**
     * The name of the token
     */
    readonly name: string;

    /**
     * The default value of the token
     */
    readonly default: StaticDesignTokenValue<T> | undefined;

    /**
     * Get the token value for an element.
     * @param element - The element to get the value for
     * @returns - The value set for the element, or the value set for the nearest element ancestor.
     */
    getValueFor(element: HTMLElement): StaticDesignTokenValue<T>;

    /**
     * Sets the token to a value for an element.
     * @param element - The element to set the value for.
     * @param value - The value.
     */
    setValueFor(element: HTMLElement, value: DesignTokenValue<T> | DesignToken<T>): void;

    /**
     * Removes a value set for an element.
     * @param element - The element to remove the value from
     */
    deleteValueFor(element: HTMLElement): this;

    /**
     * Associates a default value to the token
     */
    withDefault(value: DesignTokenValue<T> | DesignToken<T>): this;
}

export class DesignTokenNode {
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
}
/**
 * Implementation of {@link (DesignToken:interface)}
 */
class DesignTokenImpl<T> implements DesignToken<T> {
    public readonly name: string;
    public readonly default: StaticDesignTokenValue<T> | undefined;

    constructor(name: string) {
        this.name = name;
    }

    public getValueFor(element: HTMLElement): StaticDesignTokenValue<T> {
        throw new Error(
            `Value could not be retrieved for token named "${this.name}". Ensure the value is set for ${element} or an ancestor of ${element}.`
        );
    }

    public setValueFor(
        element: HTMLElement,
        value: DesignTokenValue<T> | DesignToken<T>
    ): this {
        return this;
    }

    public deleteValueFor(element: HTMLElement): this {
        return this;
    }

    public withDefault(value: DesignTokenValue<T> | DesignToken<T>) {
        return this;
    }
}

/**
 * Factory object for creating {@link (DesignToken:interface)} instances.
 * @public
 */
export const DesignToken = Object.freeze({
    create(name: string) {
        return new DesignTokenImpl(name);
    },
});
