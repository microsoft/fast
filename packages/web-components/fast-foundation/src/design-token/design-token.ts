import {
    Behavior,
    Binding,
    BindingObserver,
    CSSDirective,
    defaultExecutionContext,
    DOM,
    elements,
    FASTElement,
    observable,
    Observable,
    Subscriber,
} from "@microsoft/fast-element";
import { DI, InterfaceSymbol, Registration } from "../di/di";
import { CustomPropertyManager } from "./custom-property-manager";
import type {
    DerivedDesignTokenValue,
    DesignTokenValue,
    StaticDesignTokenValue,
} from "./interfaces";

const defaultElement = document.createElement("div");

/**
 * Describes a DesignToken instance.
 * @alpha
 */
export interface DesignToken<T extends { createCSS?(): string }> extends CSSDirective {
    readonly name: string;

    /**
     * The {@link (DesignToken:interface)} formatted as a CSS custom property if the token is
     * configured to write a CSS custom property, otherwise empty string;
     */
    readonly cssCustomProperty: string;

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

    /**
     * Subscribe a subscriber to set and delete operations.
     * On initial subscription, the subscriber will be invoked for every
     * element the token has been set for.
     */
    subscribe(subscriber: DesignTokenSubscriber): void;

    /**
     * Unsubscribe a subscribe to set and delete operations.
     */
    unsubscribe(subscriber: DesignTokenSubscriber): void;
}

interface Disposable {
    dispose(): void;
}

export type DesignTokenSubscriber = {
    handleChange: (
        token: DesignToken<any>,
        element: HTMLElement,
        operation: "set" | "delete"
    ) => void;
};

/**
 * Implementation of {@link (DesignToken:interface)}
 */
class DesignTokenImpl<T extends { createCSS?(): string }> extends CSSDirective
    implements DesignToken<T> {
    private cssVar: string;
    private subscribers = new Set<DesignTokenSubscriber>();
    private setFor = new Set<HTMLElement>();

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
        const node = DesignTokenNode.for(this, element);
        Observable.track(node, "value");
        return DesignTokenNode.for(this, element).value;
    }

    public setValueFor(
        element: HTMLElement,
        value: DesignTokenValue<T> | DesignToken<T>
    ): this {
        this.setFor.add(element);
        if (value instanceof DesignTokenImpl) {
            const _value = value;
            value = ((_element: HTMLElement) =>
                DesignTokenNode.for<T>(_value, _element)
                    .value) as DerivedDesignTokenValue<T>;
        }
        DesignTokenNode.for<T>(this, element).set(value);
        this.subscribers.forEach(x => x.handleChange(this, element, "set"));
        return this;
    }

    public deleteValueFor(element: HTMLElement): this {
        this.setFor.delete(element);
        DesignTokenNode.for(this, element).delete();
        this.subscribers.forEach(x => x.handleChange(this, element, "delete"));
        return this;
    }

    public createBehavior() {
        // This behavior only serves to notify authors that the
        // value hasn't been set. We should consider removing this
        // or putting it in a development conditional so it can be
        // removed for production builds.
        return new DesignTokenBehavior(this);
    }

    public withDefault(value: DesignTokenValue<T> | DesignToken<T>) {
        DesignTokenNode.for(this, defaultElement).set(value);

        return this;
    }

    public subscribe(subscriber: DesignTokenSubscriber): void {
        if (!this.subscribers.has(subscriber)) {
            this.subscribers.add(subscriber);
            this.setFor.forEach(x => subscriber.handleChange(this, x, "set"));
        }
    }

    public unsubscribe(subscriber: DesignTokenSubscriber): void {
        this.subscribers.delete(subscriber);
    }
}

/**
 * Behavior to add and Design Token custom properties for an element
 */
class DesignTokenBehavior<T> implements Behavior {
    constructor(public token: DesignToken<T>) {}

    bind(target: HTMLElement & FASTElement) {
        const container = DI.getOrCreateDOMContainer(target);

        if (!container.has(DesignTokenNode.channel(this.token), true)) {
            throw new Error(
                `DesignToken ${this.token.name} used in CSS but has not been set to a value.`
            );
        }
    }

    /* eslint-disable-next-line */
    unbind(target: HTMLElement & FASTElement) {}
}

const nodeCache = new WeakMap<HTMLElement, Map<DesignToken<any>, DesignTokenNode<any>>>();
const channelCache = new Map<DesignToken<any>, InterfaceSymbol<DesignTokenNode<any>>>();
const childToParent = new WeakMap<DesignTokenNode<any>, DesignTokenNode<any>>();
const noop = Function.prototype;

/**
 * A node responsible for setting and getting token values,
 * emitting values to CSS custom properties, and maintaining
 * inheritance structures.
 */
class DesignTokenNode<T extends { createCSS?(): string }> {
    /** Track downstream nodes */
    private children: Set<DesignTokenNode<any>> = new Set();
    private bindingObserver: BindingObserver | undefined;

    /**
     * The raw, unresolved value that was set for a token.
     */
    @observable
    private _rawValue: DesignTokenValue<T> | undefined;
    private _rawValueChanged() {
        Observable.getNotifier(this).notify("value");
    }

    constructor(
        public readonly token: DesignToken<T>,
        public readonly target: HTMLElement | (HTMLElement & FASTElement)
    ) {
        if (nodeCache.has(target) && nodeCache.get(target)!.has(token)) {
            throw new Error(
                `DesignTokenNode already created for ${token.name} and ${target}. Use DesignTokenNode.for() to ensure proper reuse`
            );
        }

        const container = DI.getOrCreateDOMContainer(this.target);
        const channel = DesignTokenNode.channel(token);
        container.register(Registration.instance(channel, this));

        if (target instanceof FASTElement) {
            (target as FASTElement).$fastController.addBehaviors([this]);
        } else {
            // this.findParentNode()?.appendChild(this);
        }
        this.bind();
    }

    public bind() {
        this.findParentNode()?.appendChild(this);
    }

    public unbind() {
        childToParent.get(this)?.removeChild(this);
    }

    private resolveRealValueForNode(node: DesignTokenNode<T>): T {
        let current: DesignTokenNode<T> | undefined = node;

        while (current !== undefined) {
            if (current.rawValue !== undefined) {
                const { rawValue } = current;
                if (DesignTokenNode.isDerivedTokenValue(rawValue)) {
                    if (
                        !this.bindingObserver ||
                        this.bindingObserver.source !== rawValue
                    ) {
                        this.setupBindingObserver(rawValue);
                    }

                    return this.bindingObserver!.observe(
                        this.target,
                        defaultExecutionContext
                    );
                } else {
                    return rawValue as any;
                }
            }

            current = childToParent.get(current);
        }

        throw new Error(
            `Value could not be retrieved for token named "${this.token.name}". Ensure the value is set for ${this.target} or an ancestor of ${this.target}. `
        );
    }

    private resolveCSSValue(value: T) {
        return value && typeof value.createCSS === "function" ? value.createCSS() : value;
    }

    public static channel<T>(token: DesignToken<T>): InterfaceSymbol<DesignTokenNode<T>> {
        return channelCache.has(token)
            ? channelCache.get(token)!
            : channelCache.set(token, DI.createInterface<DesignTokenNode<T>>()) &&
                  channelCache.get(token)!;
    }

    private static isDerivedTokenValue<T>(
        value: DesignTokenValue<T> | DesignTokenImpl<T>
    ): value is DerivedDesignTokenValue<T> {
        return typeof value === "function";
    }

    /**
     * Invoked when parent node's value changes
     */
    public handleChange = this.unsetValueChangeHandler;

    private unsetValueChangeHandler(source: DesignTokenNode<T>, key: "value") {
        if (this._rawValue === void 0) {
            Observable.getNotifier(this).notify("value");
        }
    }

    private setupBindingObserver(value: DerivedDesignTokenValue<T>) {
        this.tearDownBindingObserver();

        const handler = {
            handleChange: (source: Binding<HTMLElement>) => {
                this.setCSSCustomProperty();
                Observable.getNotifier(this).notify("value");
            },
        };

        this.bindingObserver = Observable.binding(value, handler);
    }

    private tearDownBindingObserver() {
        if (this.bindingObserver) {
            this.bindingObserver.disconnect();
            this.bindingObserver = undefined;
        }
    }

    public setCSSCustomProperty() {
        const handler = {
            handleChange: () => {
                try {
                    CustomPropertyManager.addTo(
                        this.target,
                        this.token,
                        this.resolveCSSValue(this.value)
                    );
                } catch (e) {
                    console.log("could not set CSS custom property for some reason");
                }
            },
        };

        Observable.getNotifier(this).subscribe(handler, "value");

        handler.handleChange();
    }

    public static for<T>(token: DesignToken<T>, target: HTMLElement) {
        const targetCache = nodeCache.has(target)
            ? nodeCache.get(target)!
            : nodeCache.set(target, new Map()) && nodeCache.get(target)!;
        return targetCache.has(token)
            ? targetCache.get(token)!
            : targetCache.set(token, new DesignTokenNode(token, target)) &&
                  targetCache.get(token)!;
    }

    public appendChild<T>(child: DesignTokenNode<T>) {
        if (this.children.has(child)) {
            return;
        }

        this.children.forEach(c => {
            if (child.contains(c)) {
                this.removeChild(c);
                child.appendChild(c);
            }
        });

        this.children.add(child);
        Observable.getNotifier(this).subscribe(child, "value");
        childToParent.set(child, this);
    }

    public removeChild<T>(child: DesignTokenNode<T>) {
        this.children.delete(child);
        childToParent.delete(child);
        Observable.getNotifier(this).unsubscribe(child, "value");
    }

    public contains<T>(node: DesignTokenNode<T>) {
        return this.target.contains(node.target);
    }

    private findParentNode(): DesignTokenNode<T> | null {
        if (this.target === defaultElement) {
            return null;
        }

        if (this.target !== document.body && this.target.parentNode) {
            const container = DI.getOrCreateDOMContainer(this.target.parentElement!);

            // TODO: use Container.tryGet() when added by https://github.com/microsoft/fast/issues/4582
            if (container.has(DesignTokenNode.channel(this.token), true)) {
                return container.get(DesignTokenNode.channel(this.token));
            }
        }

        return DesignTokenNode.for(this.token, defaultElement);
    }

    private tokenDependencySubscriber = {
        handleChange: (
            token: DesignToken<any>,
            element: HTMLElement,
            operation: "set" | "delete"
        ) => {
            if (operation === "set") {
                DesignTokenNode.for(this.token, element).setCSSCustomProperty();
            }
        },
    };

    /**
     * The resolved value for a node.
     */
    public get value(): T {
        try {
            return this.resolveRealValueForNode(this);
        } catch (e) {
            if (!childToParent.has(this)) {
                const parent = this.findParentNode();

                if (parent) {
                    parent.appendChild(this);
                    return this.resolveRealValueForNode(this);
                }
            }

            throw e;
        }
    }

    /**
     * The actual value set for the node, or undefined.
     * This will be a reference to the original object for all data types
     * passed by reference.
     */
    public get rawValue(): DesignTokenValue<T> | undefined {
        return this._rawValue;
    }

    /**
     * Sets a value for the node
     * @param value The value to set
     */
    public set(value: DesignTokenValue<T>): void {
        if (value === this._rawValue) {
            return;
        }

        this.handleChange = noop as () => void;
        this._rawValue = value;

        this.setCSSCustomProperty();

        if (this.bindingObserver) {
            const dependencies = this.bindingObserver.dependencies();

            for (const dep of dependencies) {
                // TODO: tear down in delete
                (dep.propertySource as DesignTokenNode<any>).token.subscribe(
                    this.tokenDependencySubscriber
                );
            }
        }
    }

    /**
     * Deletes any value set for the node.
     */
    public delete() {
        this._rawValue = void 0;
        this.handleChange = this.unsetValueChangeHandler;
        this.tearDownBindingObserver();
        CustomPropertyManager.removeFrom(this.target, this.token);
    }
}

function create<T extends Function>(name: string): never;
function create<T extends undefined | void>(name: string): never;
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
