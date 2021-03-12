import {
    Behavior,
    CSSDirective,
    FASTElement,
    Observable,
    Subscriber,
} from "@microsoft/fast-element";
import { CustomPropertyManager } from "./custom-property-manager";
import { DesignTokenNode } from "./token-node";

/**
 * A {@link (DesignToken:interface)} value that is derived. These values can depend on other {@link (DesignToken:interface)}s
 * or arbitrary observable properties.
 * @alpha
 */
export type DerivedDesignTokenValue<T> = T extends Function
    ? never
    : (target: HTMLElement) => T;

/**
 * A design token value with no observable dependencies
 * @alpha
 */
export type StaticDesignTokenValue<T> = T extends Function ? never : T;

/**
 * The type that a {@link (DesignToken:interface)} can be set to.
 * @alpha
 */
export type DesignTokenValue<T> = StaticDesignTokenValue<T> | DerivedDesignTokenValue<T>;

/**
 * Describes a DesignToken instance.
 * @alpha
 */
export interface DesignToken<T> extends CSSDirective {
    /**
     * The {@link (DesignToken:interface)} formatted as a CSS custom property if the token is
     * configured to write a CSS custom property, otherwise empty string;
     */
    readonly cssCustomProperty: string;

    /**
     * Adds the token as a CSS Custom Property to an element
     * @param element - The element to add the CSS Custom Property to
     */
    addCustomPropertyFor(element: HTMLElement): this;

    /**
     *
     * @param element - The element to remove the CSS Custom Property from
     */
    removeCustomPropertyFor(element: HTMLElement): this;

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
    setValueFor(element: HTMLElement, value: DesignTokenValue<T>): void;

    /**
     * Removes a value set for an element.
     * @param element - The element to remove the value from
     */
    deleteValueFor(element: HTMLElement): this;
}

interface Disposable {
    dispose(): void;
}

class DesignTokenImpl<T> extends CSSDirective implements DesignToken<T> {
    private cssVar: string;
    private customPropertyChangeHandlers: WeakMap<
        HTMLElement,
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

    public getValueFor(element: HTMLElement): StaticDesignTokenValue<T> {
        return DesignTokenNode.for(this, element).value;
    }

    public setValueFor(element: HTMLElement, value: DesignTokenValue<T>): this {
        DesignTokenNode.for(this, element).set(value);
        return this;
    }

    public deleteValueFor(element: HTMLElement): this {
        DesignTokenNode.for(this, element).delete();
        return this;
    }

    public addCustomPropertyFor(element: HTMLElement): this {
        // TODO: Can we do this in a way where we don't hold strong
        // references to elements and create a memory leak if custom
        // properties are not removed?
        if (!this.customPropertyChangeHandlers.has(element)) {
            const node = DesignTokenNode.for(this, element);
            let value = node.value;

            const add = () => CustomPropertyManager.addTo(element, this, value);
            const remove = () => CustomPropertyManager.removeFrom(element, this, value);

            const subscriber: Subscriber & Disposable = {
                handleChange: (source, key) => {
                    remove();
                    value = source[key];
                    add();
                },
                dispose: () => {
                    remove();
                    Observable.getNotifier(node).unsubscribe(subscriber, "value");
                    this.customPropertyChangeHandlers.delete(element);
                },
            };

            this.customPropertyChangeHandlers.set(element, subscriber);
            add();

            Observable.getNotifier(node).subscribe(subscriber, "value");
        }

        return this;
    }

    public removeCustomPropertyFor(element: HTMLElement): this {
        if (this.customPropertyChangeHandlers.has(element)) {
            this.customPropertyChangeHandlers.get(element)!.dispose();
        }

        return this;
    }

    public createBehavior() {
        return new DesignTokenBehavior(this);
    }
}

class DesignTokenBehavior<T> implements Behavior {
    constructor(public token: DesignToken<T>) {}

    bind(target: HTMLElement) {
        this.token.addCustomPropertyFor(target);
    }
    unbind(target: HTMLElement) {
        this.token.removeCustomPropertyFor(target);
    }
}

function create<T extends Function>(name: string): never;
function create<T>(name: string): DesignToken<T>;
function create<T>(name: string): any {
    return new DesignTokenImpl<T>(name);
}

/**
 * Factory object for creating {@link (DesignToken:interface)} instances.
 * @alpha
 */
export const DesignToken = Object.freeze({
    create,
});
