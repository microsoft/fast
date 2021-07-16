import {
    BindingObserver,
    CSSDirective,
    defaultExecutionContext,
    FASTElement,
    observable,
    Observable,
} from "@microsoft/fast-element";
import { DI, InterfaceSymbol, Registration } from "../di/di";
import { composedParent } from "../utilities";
import { composedContains } from "../utilities/composed-contains";
import { CustomPropertyManager } from "./custom-property-manager";
import type {
    DerivedDesignTokenValue,
    DesignTokenConfiguration,
    DesignTokenValue,
    StaticDesignTokenValue,
} from "./interfaces";

const defaultElement = document.body;

/**
 * Describes a DesignToken instance.
 * @public
 */
export interface DesignToken<
    T extends string | number | boolean | BigInteger | null | Array<any> | symbol | {}
> {
    /**
     * The name of the token
     */
    readonly name: string;

    /**
     * A list of elements for which the DesignToken has a value set
     */
    readonly appliedTo: HTMLElement[];

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
     * Subscribes a subscriber to change records for a token. If an element is provided, only
     * change records for that element will be emitted.
     */
    subscribe(subscriber: DesignTokenSubscriber<this>, target?: HTMLElement): void;

    /**
     * Unsubscribes a subscriber from change records for a token.
     */
    unsubscribe(subscriber: DesignTokenSubscriber<this>, target?: HTMLElement): void;
}

/**
 * A {@link (DesignToken:interface)} that emits a CSS custom property.
 * @public
 */
export interface CSSDesignToken<
    T extends
        | string
        | number
        | boolean
        | BigInteger
        | null
        | Array<any>
        | symbol
        | ({
              createCSS?(): string;
          } & Record<PropertyKey, any>)
> extends DesignToken<T>, CSSDirective {
    /**
     * The {@link (DesignToken:interface)} formatted as a CSS custom property if the token is
     * configured to write a CSS custom property.
     */
    readonly cssCustomProperty: string;
}

/**
 * Change record provided to to a {@link DesignTokenSubscriber} when a token changes for a target.
 * @public
 */
export interface DesignTokenChangeRecord<T extends DesignToken<any>> {
    /**
     * The element for which the value was changed
     */
    target: HTMLElement;

    /**
     * The token that was changed
     */
    token: T;
}

/**
 * A subscriber that should receive {@link DesignTokenChangeRecord | change records} when a token changes for a target
 * @public
 */
export interface DesignTokenSubscriber<T extends DesignToken<any>> {
    handleChange(record: DesignTokenChangeRecord<T>): void;
}

/**
 * Implementation of {@link (DesignToken:interface)}
 */
class DesignTokenImpl<T extends { createCSS?(): string }> extends CSSDirective
    implements DesignToken<T> {
    public readonly name: string;
    public readonly cssCustomProperty: string | undefined;
    private cssVar: string | undefined;
    private subscribers = new WeakMap<
        HTMLElement | this,
        Set<DesignTokenSubscriber<this>>
    >();
    private _appliedTo = new Set<HTMLElement>();
    public get appliedTo() {
        return [...this._appliedTo];
    }

    public static from<T>(
        nameOrConfig: string | DesignTokenConfiguration
    ): DesignTokenImpl<T> {
        return new DesignTokenImpl<T>({
            name: typeof nameOrConfig === "string" ? nameOrConfig : nameOrConfig.name,
            cssCustomPropertyName:
                typeof nameOrConfig === "string"
                    ? nameOrConfig
                    : nameOrConfig.cssCustomPropertyName === void 0
                    ? nameOrConfig.name
                    : nameOrConfig.cssCustomPropertyName,
        });
    }

    public static isCSSDesignToken<T>(
        token: DesignToken<T> | CSSDesignToken<T>
    ): token is CSSDesignToken<T> {
        return typeof (token as CSSDesignToken<T>).cssCustomProperty === "string";
    }

    private getOrCreateSubscriberSet(
        target: HTMLElement | this = this
    ): Set<DesignTokenSubscriber<this>> {
        return (
            this.subscribers.get(target) ||
            (this.subscribers.set(target, new Set()) && this.subscribers.get(target)!)
        );
    }

    constructor(configuration: Required<DesignTokenConfiguration>) {
        super();

        this.name = configuration.name;

        if (configuration.cssCustomPropertyName !== null) {
            this.cssCustomProperty = `--${configuration.cssCustomPropertyName}`;
            this.cssVar = `var(${this.cssCustomProperty})`;
        }
    }

    public createCSS(): string {
        return this.cssVar || "";
    }

    public getValueFor(element: HTMLElement): StaticDesignTokenValue<T> {
        const node = DesignTokenNode.for(this, element);
        Observable.track(node, "value");
        return DesignTokenNode.for(this, element).value;
    }

    public setValueFor(
        element: HTMLElement,
        value: DesignTokenValue<T> | DesignToken<T>
    ): this {
        this._appliedTo.add(element);
        if (value instanceof DesignTokenImpl) {
            const tokenValue = value;

            value = ((target: HTMLElement) =>
                tokenValue.getValueFor(target)) as DerivedDesignTokenValue<T>;
        }
        DesignTokenNode.for<T>(this, element).set(value);
        [
            ...this.getOrCreateSubscriberSet(this),
            ...this.getOrCreateSubscriberSet(element),
        ].forEach(x => x.handleChange({ token: this, target: element }));
        return this;
    }

    public deleteValueFor(element: HTMLElement): this {
        this._appliedTo.delete(element);
        DesignTokenNode.for(this, element).delete();
        return this;
    }

    public withDefault(value: DesignTokenValue<T> | DesignToken<T>) {
        DesignTokenNode.for(this, defaultElement).set(value);

        return this;
    }

    public subscribe(
        subscriber: DesignTokenSubscriber<this>,
        target?: HTMLElement
    ): void {
        const subscriberSet = this.getOrCreateSubscriberSet(target);
        if (!subscriberSet.has(subscriber)) {
            subscriberSet.add(subscriber);
        }
    }

    public unsubscribe(
        subscriber: DesignTokenSubscriber<this>,
        target?: HTMLElement
    ): void {
        this.getOrCreateSubscriberSet(target).delete(subscriber);
    }
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

    /**
     * The actual value set for the node, or undefined.
     * This will be a reference to the original object for all data types
     * passed by reference.
     */
    public get rawValue(): DesignTokenValue<T> | undefined {
        return this._rawValue;
    }

    @observable
    public useCSSCustomProperty = false;
    private useCSSCustomPropertyChanged?(prev: undefined | boolean, next: boolean) {
        if (next) {
            Observable.getNotifier(this).subscribe(
                this.cssCustomPropertySubscriber,
                "value"
            );

            this.cssCustomPropertySubscriber.handleChange();
        } else if (prev) {
            Observable.getNotifier(this).unsubscribe(
                this.cssCustomPropertySubscriber,
                "value"
            );
            this.cssCustomPropertySubscriber.dispose();
        }
    }

    constructor(
        public readonly token: DesignToken<T> | CSSDesignToken<T>,
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

        if (!DesignTokenImpl.isCSSDesignToken(token)) {
            delete this.useCSSCustomPropertyChanged;
        }

        if (target instanceof FASTElement) {
            (target as FASTElement).$fastController.addBehaviors([this]);
        } else {
            this.findParentNode()?.appendChild(this);
        }
    }

    public bind() {
        this.findParentNode()?.appendChild(this);
    }

    public unbind() {
        childToParent.get(this)?.removeChild(this);
        this.tearDownBindingObserver();
    }

    private resolveRealValue(): T {
        const rawValue = this.resolveRawValue();

        if (DesignTokenNode.isDerivedTokenValue(rawValue)) {
            if (!this.bindingObserver || this.bindingObserver.source !== rawValue) {
                this.setupBindingObserver(rawValue);
            }

            return this.bindingObserver!.observe(this.target, defaultExecutionContext);
        } else {
            if (this.bindingObserver) {
                this.tearDownBindingObserver();
            }

            return rawValue as any;
        }
    }

    private resolveRawValue(): DesignTokenValue<T> {
        /* eslint-disable-next-line */
        let current: DesignTokenNode<T> | undefined = this;

        do {
            const { rawValue } = current;

            if (rawValue !== void 0) {
                return rawValue;
            }

            current = childToParent.get(current);
        } while (current !== undefined);

        // If there is no parent, try to resolve parent and try again.
        if (!childToParent.has(this)) {
            const parent = this.findParentNode();

            if (parent) {
                parent.appendChild(this);
                return this.resolveRawValue();
            }
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

        this.bindingObserver = Observable.binding(value, this.bindingChangeHandler);
    }

    private bindingChangeHandler = {
        handleChange: () => {
            Observable.getNotifier(this).notify("value");
        },
    };

    private tearDownBindingObserver() {
        if (this.bindingObserver) {
            this.bindingObserver.disconnect();
            this.bindingObserver = undefined;
        }
    }

    private cssCustomPropertySubscriber = {
        handleChange: () => {
            CustomPropertyManager.removeFrom(
                this.target,
                this.token as CSSDesignToken<T>
            );
            CustomPropertyManager.addTo(
                this.target,
                this.token as CSSDesignToken<T>,
                this.resolveCSSValue(this.value)
            );
        },
        dispose: () => {
            CustomPropertyManager.removeFrom(
                this.target,
                this.token as CSSDesignToken<T>
            );
        },
    };

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
        return composedContains(this.target, node.target);
    }

    private findParentNode(): DesignTokenNode<T> | null {
        if (this.target === defaultElement) {
            return null;
        }

        const parent = composedParent(this.target);

        if (this.target !== document.body && parent) {
            const container = DI.getOrCreateDOMContainer(parent);

            // TODO: use Container.tryGet() when added by https://github.com/microsoft/fast/issues/4582
            if (container.has(DesignTokenNode.channel(this.token), true)) {
                return container.get(DesignTokenNode.channel(this.token));
            }
        }

        return DesignTokenNode.for(this.token, defaultElement);
    }

    private tokenDependencySubscriber = {
        handleChange: (record: DesignTokenChangeRecord<DesignToken<any>>) => {
            const rawValue = this.resolveRawValue();
            const target = DesignTokenNode.for(this.token, record.target);

            // Only act on downstream nodes
            if (
                this.contains(target) &&
                !target.useCSSCustomProperty &&
                target.resolveRawValue() === rawValue
            ) {
                target.useCSSCustomProperty = true;
            }
        },
    };

    /**
     * The resolved value for a node.
     */
    public get value(): T {
        return this.resolveRealValue();
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

        if (!this.useCSSCustomProperty) {
            this.useCSSCustomProperty = true;
        }

        if (this.bindingObserver) {
            const records = this.bindingObserver.records();

            for (const record of records) {
                if (
                    record.propertySource instanceof DesignTokenNode &&
                    record.propertySource.token instanceof DesignTokenImpl
                ) {
                    const { token } = record.propertySource;
                    token.subscribe(this.tokenDependencySubscriber);
                    token.appliedTo.forEach(target =>
                        this.tokenDependencySubscriber.handleChange({ token, target })
                    );
                }
            }
        }
    }

    /**
     * Deletes any value set for the node.
     */
    public delete() {
        if (this.useCSSCustomProperty) {
            this.useCSSCustomProperty = false;
        }

        this._rawValue = void 0;
        this.handleChange = this.unsetValueChangeHandler;
        this.tearDownBindingObserver();
    }
}

function create<T extends Function>(
    nameOrConfig: string | DesignTokenConfiguration
): never;
function create<T extends undefined | void>(
    nameOrConfig: string | DesignTokenConfiguration
): never;
function create<T>(nameOrConfig: string): CSSDesignToken<T>;
function create<T>(
    nameOrConfig:
        | Omit<DesignTokenConfiguration, "cssCustomPropertyName">
        | (DesignTokenConfiguration & Record<"cssCustomPropertyName", string>)
): CSSDesignToken<T>;
function create<T>(
    nameOrConfig: DesignTokenConfiguration & Record<"cssCustomPropertyName", null>
): DesignToken<T>;
function create<T>(nameOrConfig: string | DesignTokenConfiguration): any {
    return DesignTokenImpl.from(nameOrConfig);
}

/**
 * Factory object for creating {@link (DesignToken:interface)} instances.
 * @public
 */
export const DesignToken = Object.freeze({
    create,
});
