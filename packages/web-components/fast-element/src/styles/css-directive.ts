import type { Constructable } from "../interfaces.js";
import { createTypeRegistry } from "../platform.js";
import type { HostBehavior } from "./host.js";
import type { ComposableStyles } from "./element-styles.js";

/**
 * Used to add behaviors when constructing styles.
 * @public
 */
export type AddBehavior = (behavior: HostBehavior<HTMLElement>) => void;

/**
 * Directive for use in {@link css}.
 *
 * @public
 */
export interface CSSDirective {
    /**
     * Creates a CSS fragment to interpolate into the CSS document.
     * @returns - the string to interpolate into CSS
     */
    createCSS(add: AddBehavior): ComposableStyles;
}

/**
 * Defines metadata for a CSSDirective.
 * @public
 */
export interface CSSDirectiveDefinition<
    TType extends Constructable<CSSDirective> = Constructable<CSSDirective>
> {
    /**
     * The type that the definition provides metadata for.
     */
    readonly type: TType;
}

const registry = createTypeRegistry<CSSDirectiveDefinition>();

/**
 * Instructs the css engine to provide dynamic styles or
 * associate behaviors with styles.
 * @public
 */
export const CSSDirective = Object.freeze({
    /**
     * Gets the directive definition associated with the instance.
     * @param instance - The directive instance to retrieve the definition for.
     */
    getForInstance: registry.getForInstance,

    /**
     * Gets the directive definition associated with the specified type.
     * @param type - The directive type to retrieve the definition for.
     */
    getByType: registry.getByType,

    /**
     * Defines a CSSDirective.
     * @param type - The type to define as a directive.
     */
    define<TType extends Constructable<CSSDirective>>(type): TType {
        registry.register({ type });
        return type;
    },
});

/**
 * Decorator: Defines a CSSDirective.
 * @public
 */
export function cssDirective() {
    /* eslint-disable-next-line @typescript-eslint/explicit-function-return-type */
    return function (type: Constructable<CSSDirective>) {
        CSSDirective.define(type);
    };
}
