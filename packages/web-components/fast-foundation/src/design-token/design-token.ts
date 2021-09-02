import {
    Behavior,
    Binding,
    BindingObserver,
    CSSDirective,
    defaultExecutionContext,
    FASTElement,
    observable,
    Observable,
    Subscriber,
} from "@microsoft/fast-element";
import { composedParent } from "../utilities";
import { composedContains } from "../utilities/composed-contains";
import { PropertyTargetManager } from "./custom-property-manager";
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
    public readonly id: string;
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

    public static isDerivedDesignTokenValue<T>(
        value: any
    ): value is DerivedDesignTokenValue<T> {
        return typeof value === "function";
    }

    public static uniqueId: () => string = (() => {
        let id = 0;
        return () => {
            id++;
            return id.toString(16);
        };
    })();

    /**
     * Gets a token by ID. Returns undefined if the token was not found.
     * @param id - The ID of the token
     * @returns
     */
    public static getTokenById(id: string): DesignTokenImpl<any> | undefined {
        return DesignTokenImpl.tokensById.get(id);
    }

    /**
     * Token storage by token ID
     */
    private static tokensById = new Map<string, DesignTokenImpl<any>>();

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

        this.id = DesignTokenImpl.uniqueId();
        DesignTokenImpl.tokensById.set(this.id, this);

        this.subscribe(this);
    }

    public createCSS(): string {
        return this.cssVar || "";
    }

    public getValueFor(element: HTMLElement): StaticDesignTokenValue<T> {
        const value = DesignTokenNode.getOrCreate(element).get(this);

        if (value !== undefined) {
            return value;
        }

        throw new Error(
            `Value could not be retrieved for token named "${this.name}". Ensure the value is set for ${element} or an ancestor of ${element}.`
        );
    }

    public setValueFor(
        element: HTMLElement,
        value: DesignTokenValue<T> | DesignToken<T>
    ): this {
        this._appliedTo.add(element);
        if (value instanceof DesignTokenImpl) {
            value = this.alias(value);
        }

        DesignTokenNode.getOrCreate(element).set(this, value as DesignTokenValue<T>);
        return this;
    }

    public deleteValueFor(element: HTMLElement): this {
        this._appliedTo.delete(element);

        if (DesignTokenNode.existsFor(element)) {
            DesignTokenNode.getOrCreate(element).delete(this);
        }

        return this;
    }

    public withDefault(value: DesignTokenValue<T> | DesignToken<T>) {
        this.setValueFor(defaultElement, value);

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
        const list = this.subscribers.get(target || this);

        if (list && list.has(subscriber)) {
            list.delete(subscriber);
        }
    }

    /**
     * Notifies subscribers that the value for an element has changed.
     * @param element - The element to emit a notification for
     */
    public notify(element: HTMLElement) {
        const record = Object.freeze({ token: this, target: element });

        if (this.subscribers.has(this)) {
            this.subscribers.get(this)!.forEach(sub => sub.handleChange(record));
        }

        if (this.subscribers.has(element)) {
            this.subscribers.get(element)!.forEach(sub => sub.handleChange(record));
        }
    }

    /**
     * Proxy changes to Observable
     * @param record - The change record
     */
    public handleChange(record: DesignTokenChangeRecord<this>) {
        const node = DesignTokenNode.getOrCreate(record.target);
        Observable.getNotifier(node).notify(record.token.id);
    }

    /**
     * Alias the token to the provided token.
     * @param token - the token to alias to
     */
    private alias(token: DesignToken<T>): DerivedDesignTokenValue<T> {
        return (((target: HTMLElement) =>
            token.getValueFor(target)) as unknown) as DerivedDesignTokenValue<T>;
    }
}

class CustomPropertyReflector {
    public startReflection(token: CSSDesignToken<any>, target: HTMLElement) {
        token.subscribe(this, target);
        this.handleChange({ token, target });
    }

    public stopReflection(token: CSSDesignToken<any>, target: HTMLElement) {
        token.unsubscribe(this, target);
        this.remove(token, target);
    }

    public handleChange(record: DesignTokenChangeRecord<any>) {
        const { token, target } = record;
        this.add(token, target);
    }

    private add(token: CSSDesignToken<any>, target: HTMLElement) {
        PropertyTargetManager.getOrCreate(target).setProperty(
            token.cssCustomProperty,
            this.resolveCSSValue(
                DesignTokenNode.getOrCreate(target).get(token as DesignTokenImpl<any>)
            )
        );
    }

    private remove(token: CSSDesignToken<any>, target: HTMLElement) {
        PropertyTargetManager.getOrCreate(target).removeProperty(token.cssCustomProperty);
    }

    private resolveCSSValue(value: any) {
        return value && typeof value.createCSS === "function" ? value.createCSS() : value;
    }
}

/**
 * A light wrapper around BindingObserver to handle value caching and
 * token notification
 */
class DesignTokenBindingObserver<T> {
    public readonly dependencies = new Set<DesignTokenImpl<any>>();
    private observer: BindingObserver<HTMLElement, DerivedDesignTokenValue<T>>;
    constructor(
        public readonly source: Binding<HTMLElement, DerivedDesignTokenValue<T>>,
        public readonly token: DesignTokenImpl<T>,
        public readonly node: DesignTokenNode
    ) {
        this.observer = Observable.binding(source, this);

        // This is a little bit hacky because it's using internal APIs of BindingObserverImpl.
        // BindingObserverImpl queues updates to batch it's notifications which doesn't work for this
        // scenario because the DesignToken.getValueFor API is not async. Without this, using DesignToken.getValueFor()
        // after DesignToken.setValueFor() when setting a dependency of the value being retrieved can return a stale
        // value. Assigning .handleChange to .call forces immediate invocation of this classes handleChange() method,
        // allowing resolution of values synchronously.
        // TODO: https://github.com/microsoft/fast/issues/5110
        (this.observer as any).handleChange = (this.observer as any).call;

        this.handleChange();

        for (const record of this.observer.records()) {
            const { propertySource } = record;
            if (propertySource instanceof DesignTokenNode) {
                const token = DesignTokenImpl.getTokenById(record.propertyName);

                // Tokens should not enumerate themselves as a dependency because
                // any setting of the token will override the value for that scope.
                if (token !== undefined && token !== this.token) {
                    this.dependencies.add(token);
                }
            }
        }
    }

    public disconnect() {
        this.observer.disconnect();
    }

    @observable private _value: StaticDesignTokenValue<T>;
    private _valueChanged(prev, next) {
        // Only notify on changes, not initialization
        if (prev !== undefined) {
            this.token.notify(this.node.target);
        }
    }

    /**
     * The value of the binding
     */
    public get value() {
        return this._value;
    }

    /**
     * @internal
     */
    public handleChange() {
        this._value = (this.observer.observe(
            this.node.target,
            defaultExecutionContext
        ) as unknown) as StaticDesignTokenValue<T>;
    }
}

const nodeCache = new WeakMap<HTMLElement, DesignTokenNode>();
const childToParent = new WeakMap<DesignTokenNode, DesignTokenNode>();

/**
 * A node responsible for setting and getting token values,
 * emitting values to CSS custom properties, and maintaining
 * inheritance structures.
 */
class DesignTokenNode implements Behavior, Subscriber {
    /**
     * Returns a DesignTokenNode for an element.
     * Creates a new instance if one does not already exist for a node,
     * otherwise returns the cached instance
     *
     * @param target - The HTML element to retrieve a DesignTokenNode for
     */
    public static getOrCreate(target: HTMLElement): DesignTokenNode {
        return nodeCache.get(target) || new DesignTokenNode(target);
    }

    /**
     * Determines if a DesignTokenNode has been created for a target
     * @param target - The element to test
     */
    public static existsFor(target: HTMLElement): boolean {
        return nodeCache.has(target);
    }

    /**
     * Searches for and return the nearest parent DesignTokenNode.
     * Null is returned if no node is found or the node provided is for a default element.
     */
    public static findParent(node: DesignTokenNode): DesignTokenNode | null {
        if (!(defaultElement === node.target)) {
            let parent = composedParent(node.target);

            while (parent !== null) {
                if (nodeCache.has(parent)) {
                    return nodeCache.get(parent)!;
                }

                parent = composedParent(parent);
            }

            return DesignTokenNode.getOrCreate(defaultElement);
        }

        return null;
    }

    /**
     * Finds the closest node with a value explicitly assigned for a token, otherwise null.
     * @param token - The token to look for
     * @param start - The node to start looking for value assignment
     * @returns
     */
    public static findClosestAssignedNode<T>(
        token: DesignTokenImpl<T>,
        start: DesignTokenNode
    ): DesignTokenNode | null {
        let current: DesignTokenNode | null = start;
        do {
            if (current.has(token)) {
                return current;
            }

            current = current.parent
                ? current.parent
                : current.target !== defaultElement
                ? DesignTokenNode.getOrCreate(defaultElement)
                : null;
        } while (current !== null);

        return null;
    }

    /**
     * Responsible for reflecting tokens to CSS custom properties
     */
    public static cssCustomPropertyReflector = new CustomPropertyReflector();

    /**
     * All children assigned to the node
     */
    @observable
    private children: Array<DesignTokenNode> = [];

    /**
     * All values explicitly assigned to the node in their raw form
     */
    private rawValues: Map<DesignTokenImpl<any>, DesignTokenValue<any>> = new Map();

    /**
     * Tokens currently being reflected to CSS custom properties
     */
    private reflecting = new Set<CSSDesignToken<any>>();

    /**
     * Binding observers for assigned and inherited derived values.
     */
    private bindingObservers = new Map<
        DesignTokenImpl<any>,
        DesignTokenBindingObserver<any>
    >();

    /**
     * Tracks subscribers for tokens assigned a derived value for the node.
     */
    private tokenSubscribers = new Map<
        DesignTokenImpl<any>,
        DesignTokenSubscriber<any>
    >();

    public get parent(): DesignTokenNode | null {
        return childToParent.get(this) || null;
    }

    constructor(public readonly target: HTMLElement | (HTMLElement & FASTElement)) {
        nodeCache.set(target, this);

        if (target instanceof FASTElement) {
            (target as FASTElement).$fastController.addBehaviors([this]);
        } else if (target.isConnected) {
            this.bind();
        }
    }

    /**
     * Checks if a token has been assigned an explicit value the node.
     * @param token - the token to check.
     */
    public has<T>(token: DesignTokenImpl<T>): boolean {
        return this.rawValues.has(token);
    }

    /**
     * Gets the value of a token for a node
     * @param token - The token to retrieve the value for
     * @returns
     */
    public get<T>(token: DesignTokenImpl<T>): StaticDesignTokenValue<T> | undefined {
        const raw = this.getRaw(token);
        Observable.track(this, token.id);

        if (raw !== undefined) {
            if (DesignTokenImpl.isDerivedDesignTokenValue(raw)) {
                return (
                    this.bindingObservers.get(token) ||
                    this.setupBindingObserver(token, raw)
                ).value;
            } else {
                return raw;
            }
        }

        return undefined;
    }

    /**
     * Retrieves the raw assigned value of a token from the nearest assigned node.
     * @param token - The token to retrieve a raw value for
     * @returns
     */
    public getRaw<T>(token: DesignTokenImpl<T>): DesignTokenValue<T> | undefined {
        if (this.rawValues.has(token)) {
            return this.rawValues.get(token);
        }

        return DesignTokenNode.findClosestAssignedNode(token, this)?.getRaw(token);
    }

    /**
     * Sets a token to a value for a node
     * @param token - The token to set
     * @param value - The value to set the token to
     */
    public set<T>(token: DesignTokenImpl<T>, value: DesignTokenValue<T>): void {
        // Disconnect any existing binding observer
        // And delete it
        if (DesignTokenImpl.isDerivedDesignTokenValue(this.rawValues.get(token))) {
            this.tearDownBindingObserver(token);
            this.children.forEach(x => x.purgeInheritedBindings(token));
        }

        this.rawValues.set(token, value);

        if (this.tokenSubscribers.has(token)) {
            token.unsubscribe(this.tokenSubscribers.get(token)!);
            this.tokenSubscribers.delete(token);
        }

        if (DesignTokenImpl.isDerivedDesignTokenValue(value)) {
            const binding = this.setupBindingObserver(token, value);
            const { dependencies } = binding;

            const reflect = DesignTokenImpl.isCSSDesignToken(token);

            if (dependencies.size > 0) {
                const subscriber: DesignTokenSubscriber<any> = {
                    handleChange: record => {
                        const node = DesignTokenNode.getOrCreate(record.target);

                        if (this !== node && this.contains(node)) {
                            token.notify(record.target);
                            DesignTokenNode.getOrCreate(record.target).reflectToCSS(
                                token as any
                            );
                        }
                    },
                };

                this.tokenSubscribers.set(token, subscriber);

                dependencies.forEach(x => {
                    // Check all existing nodes for which a dependency has been applied
                    // and determine if we need to update the token being set for that node
                    if (reflect) {
                        x.appliedTo.forEach(y => {
                            const node = DesignTokenNode.getOrCreate(y);

                            if (this.contains(node) && node.getRaw(token) === value) {
                                token.notify(node.target);
                                node.reflectToCSS(token as CSSDesignToken<T>);
                            }
                        });
                    }
                    x.subscribe(subscriber);
                });
            }
        }

        if (DesignTokenImpl.isCSSDesignToken(token)) {
            this.reflectToCSS(token);
        }

        token.notify(this.target);
    }

    /**
     * Deletes a token value for the node.
     * @param token - The token to delete the value for
     */
    public delete<T>(token: DesignTokenImpl<T>): void {
        this.rawValues.delete(token);
        this.tearDownBindingObserver(token);
        this.children.forEach(x => x.purgeInheritedBindings(token));
        token.notify(this.target);
    }

    /**
     * Invoked when the DesignTokenNode.target is attached to the document
     */
    public bind(): void {
        const parent = DesignTokenNode.findParent(this);

        if (parent) {
            parent.appendChild(this);
        }

        for (const key of this.rawValues.keys()) {
            key.notify(this.target);
        }
    }

    /**
     * Invoked when the DesignTokenNode.target is detached from the document
     */
    public unbind(): void {
        if (this.parent) {
            const parent = childToParent.get(this)!;
            parent.removeChild(this);
        }
    }

    /**
     * Appends a child to a parent DesignTokenNode.
     * @param child - The child to append to the node
     */
    public appendChild(child: DesignTokenNode): void {
        if (child.parent) {
            childToParent.get(child)!.removeChild(child);
        }
        const reParent = this.children.filter(x => child.contains(x));

        childToParent.set(child, this);
        this.children.push(child);

        reParent.forEach(x => child.appendChild(x));

        Observable.getNotifier(this).subscribe(child);
    }

    /**
     * Removes a child from a node.
     * @param child - The child to remove.
     */
    public removeChild(child: DesignTokenNode): boolean {
        const childIndex = this.children.indexOf(child);

        if (childIndex !== -1) {
            this.children.splice(childIndex, 1);
        }

        Observable.getNotifier(this).unsubscribe(child);
        return child.parent === this ? childToParent.delete(child) : false;
    }

    /**
     * Tests whether a provided node is contained by
     * the calling node.
     * @param test - The node to test
     */
    public contains(test: DesignTokenNode): boolean {
        return composedContains(this.target, test.target);
    }

    /**
     * Instructs the node to reflect a design token for the provided token.
     * @param token - The design token to reflect
     */
    public reflectToCSS(token: CSSDesignToken<any>) {
        if (!this.reflecting.has(token)) {
            this.reflecting.add(token);
            DesignTokenNode.cssCustomPropertyReflector.startReflection(
                token,
                this.target
            );
        }
    }

    /**
     * Handle changes to upstream tokens
     * @param source - The parent DesignTokenNode
     * @param property - The token ID that changed
     */
    public handleChange(source: DesignTokenNode, property: string) {
        const token = DesignTokenImpl.getTokenById(property);

        // Propagate change notifications down to children
        // Don't propagate changes for tokens with bindingObservers
        // because the bindings are responsible for notifying themselves
        if (token && !this.has(token) && !this.bindingObservers.has(token)) {
            token.notify(this.target);
        }
    }

    /**
     * Recursively purge binding observers for a token for descendent of the node.
     * Bindings will only be purged for trees of nodes where no explicit value for the node
     * is assigned.
     * @param token - the token to purge bindings on
     */
    public purgeInheritedBindings<T>(token: DesignTokenImpl<T>) {
        if (!this.has(token)) {
            this.tearDownBindingObserver(token);

            if (this.children.length) {
                this.children.forEach(child => child.purgeInheritedBindings(token));
            }
        }
    }

    /**
     * Sets up a binding observer for a derived token value that notifies token
     * subscribers on change.
     *
     * @param token - The token to notify when the binding updates
     * @param source - The binding source
     */
    private setupBindingObserver<T>(
        token: DesignTokenImpl<T>,
        source: DerivedDesignTokenValue<T>
    ): DesignTokenBindingObserver<T> {
        const binding = new DesignTokenBindingObserver(source as any, token, this);

        this.bindingObservers.set(token, binding);
        return binding;
    }

    /**
     * Tear down a binding observer for a token.
     */
    private tearDownBindingObserver<T>(token: DesignTokenImpl<T>): boolean {
        if (this.bindingObservers.has(token)) {
            this.bindingObservers.get(token)!.disconnect();
            this.bindingObservers.delete(token);
            return true;
        }

        return false;
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

    /**
     * Informs DesignToken that an HTMLElement for which tokens have
     * been set has been connected to the document.
     *
     * The browser does not provide a reliable mechanism to observe an HTMLElement's connectedness
     * in all scenarios, so invoking this method manually is necessary when:
     *
     * 1. Token values are set for an HTMLElement.
     * 2. The HTMLElement does not inherit from FASTElement.
     * 3. The HTMLElement is not connected to the document when token values are set.
     *
     * @param element - The element to notify
     * @returns - true if notification was successful, otherwise false.
     */
    notifyConnection(element: HTMLElement): boolean {
        if (!element.isConnected || !DesignTokenNode.existsFor(element)) {
            return false;
        }

        DesignTokenNode.getOrCreate(element).bind();

        return true;
    },

    /**
     * Informs DesignToken that an HTMLElement for which tokens have
     * been set has been disconnected to the document.
     *
     * The browser does not provide a reliable mechanism to observe an HTMLElement's connectedness
     * in all scenarios, so invoking this method manually is necessary when:
     *
     * 1. Token values are set for an HTMLElement.
     * 2. The HTMLElement does not inherit from FASTElement.
     *
     * @param element - The element to notify
     * @returns - true if notification was successful, otherwise false.
     */
    notifyDisconnection(element: HTMLElement): boolean {
        if (element.isConnected || !DesignTokenNode.existsFor(element)) {
            return false;
        }

        DesignTokenNode.getOrCreate(element).unbind();
        return true;
    },
});
