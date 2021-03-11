import {
    Behavior,
    CSSDirective,
    FASTElement,
    Observable,
    Subscriber,
} from "@microsoft/fast-element";
import { StyleElementCustomPropertyManager } from "../custom-properties";
import { CustomPropertyManager } from "./custom-property-manager";
import { DesignTokenNode } from "./token-node";

/**
 * A {@link DesignToken} value that is derived. These values can depend on other {@link DesignToken}s
 * or arbitrary observable properties.
 */
export type DerivedDesignTokenValue<T> = T extends Function
    ? never
    : (target: DesignTokenTarget) => T;

/**
 * A design token value with no observable dependencies
 */
export type StaticDesignTokenValue<T> = T extends Function ? never : T;

/**
 * The type that a {@link DesignToken} can be set to.
 */
export type DesignTokenValue<T> = StaticDesignTokenValue<T> | DerivedDesignTokenValue<T>;

/**
 * Describes where Design Tokens can be retrieved from and set, and also
 * where css custom properties can be emitted to.
 */
export type DesignTokenTarget = HTMLElement & FASTElement;

/**
 * Describes a DesignToken instance.
 */
export interface DesignToken<T> extends CSSDirective {
    /**
     * The {@link DesignToken} formatted as a CSS custom property if the token is
     * configured to write a CSS custom property, otherwise empty string;
     */
    readonly cssCustomProperty: string;

    /**
     * Adds the token as a CSS Custom Property to an element
     * @param element - The element to add the CSS Custom Property to
     */
    addCustomPropertyFor(element: DesignTokenTarget): this;

    /**
     *
     * @param element - The element to remove the CSS Custom Property from
     */
    removeCustomPropertyFor(element: DesignTokenTarget): this;

    /**
     * Get the token value for an element.
     * @param element - The element to get the value for
     * @returns - The value set for the element, or the value set for the nearest element ancestor.
     */
    getValueFor(element: DesignTokenTarget): StaticDesignTokenValue<T>;

    /**
     * Sets the token to a value for an element.
     * @param element - The element to set the value for.
     * @param value - The value.
     */
    setValueFor(element: DesignTokenTarget, value: DesignTokenValue<T>): void;

    /**
     * Removes a value set for an element.
     * @param element - The element to remove the value from
     */
    deleteFor(element: DesignTokenTarget): this;
}

interface Disposable {
    dispose(): void;
}

class DesignTokenImpl<T> extends CSSDirective implements DesignToken<T> {
    private cssVar: string;
    private customPropertyChangeHandlers: WeakMap<
        DesignTokenTarget,
        Subscriber & Disposable
    > = new Map();

    constructor(public readonly name: string) {
        super();

        this.cssCustomProperty = `--${name}`;
        this.cssVar = `var(${this.cssCustomProperty})`;
    }

    public createCSS(): string {
        return this.cssVar;
    }

    public readonly cssCustomProperty: string;

    public getValueFor(element: DesignTokenTarget): StaticDesignTokenValue<T> {
        return DesignTokenNode.for(this, element).value;
    }

    public setValueFor(element: DesignTokenTarget, value: DesignTokenValue<T>): this {
        DesignTokenNode.for(this, element).set(value);
        return this;
    }

    public deleteFor(element: DesignTokenTarget): this {
        DesignTokenNode.for(this, element).delete();
        return this;
    }

    public addCustomPropertyFor(element: DesignTokenTarget): this {
        // TODO: Can we do this in a way where we don't hold strong
        // references to elements and create a memory leak if custom
        // properties are not removed?
        if (!this.customPropertyChangeHandlers.has(element)) {
            const node = DesignTokenNode.for(this, element);
            let style = CustomPropertyManager.get(this, node.value);

            const addStyles = () => element.$fastController.addStyles(style);
            const removeStyles = () => element.$fastController.removeStyles(style);

            const subscriber: Subscriber & Disposable = {
                handleChange: (source, value) => {
                    removeStyles();
                    style = CustomPropertyManager.get(this, source[value]);
                    addStyles();
                },
                dispose: () => {
                    removeStyles();
                    Observable.getNotifier(node).unsubscribe(subscriber, "value");
                    this.customPropertyChangeHandlers.delete(element);
                },
            };

            this.customPropertyChangeHandlers.set(element, subscriber);
            addStyles();

            Observable.getNotifier(node).subscribe(subscriber, "value");
        }

        return this;
    }

    public removeCustomPropertyFor(element: DesignTokenTarget): this {
        if (this.customPropertyChangeHandlers.has(element)) {
            this.customPropertyChangeHandlers.get(element)!.dispose();
        }

        return this;
    }

    public createBehavior() {
        return new DesignTokenBehavior(this);
    }
}

// We probably want to de-dupe here so we don't add the same behavior
// and re-retrieve values when a behavior is used multiple times
class DesignTokenBehavior<T> implements Behavior {
    constructor(public token: DesignToken<T>) {}

    bind(target: HTMLElement & FASTElement) {
        this.token.addCustomPropertyFor(target);
    }
    unbind(target: HTMLElement & FASTElement) {
        this.token.removeCustomPropertyFor(target);
    }
}

function create<T extends Function>(name: string): never;
function create<T>(name: string): DesignToken<T>;
function create<T>(name: string): any {
    return new DesignTokenImpl<T>(name);
}

/**
 * Factory object for creating {@link DesignToken} instances.
 */
export const DesignToken = Object.freeze({
    create,
});
