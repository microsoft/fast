import {
    Behavior,
    BindingObserver,
    CSSDirective,
    defaultExecutionContext,
    FASTElement,
    observable,
    Observable,
    TargetedHTMLDirective,
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
        return DesignTokenNode.getOrCreate(element).get(this);
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
        DesignTokenNode.getOrCreate(element).delete(this);
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
        this.getOrCreateSubscriberSet(target).delete(subscriber);
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

const nodeCache = new WeakMap<HTMLElement, DesignTokenNode>();
const childToParent = new WeakMap<DesignTokenNode, DesignTokenNode>();

/**
 * A node responsible for setting and getting token values,
 * emitting values to CSS custom properties, and maintaining
 * inheritance structures.
 */
class DesignTokenNode implements Behavior {
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
        }

        return null;
    }

    /**
     * All children assigned to the node
     */
    @observable
    private children: Array<DesignTokenNode> = [];

    constructor(public readonly target: HTMLElement | (HTMLElement & FASTElement)) {
        nodeCache.set(target, this);

        if (target instanceof FASTElement) {
            (target as FASTElement).$fastController.addBehaviors([this]);
        } else if (target.isConnected) {
            this.bind();
        }
    }

    /**
     * Gets the value of a token for a node
     * @param token - The token to retrieve the value for
     * @returns
     */
    public get<T>(token: DesignToken<T>): StaticDesignTokenValue<T> {
        return 0 as any;
    }

    /**
     * Sets a token to a value for a node
     * @param token - The token to set
     * @param value - The value to set the token to
     */
    public set<T>(token: DesignToken<T>, value: DesignTokenValue<T>): void {
        console.log("setting:", token, value);
    }

    public delete<T>(token: DesignToken<T>): void {
        console.log("deleting:", token);
    }

    /**
     * Invoked when the DesignTokenNode.target is attached to the document
     */
    public bind() {
        const parent = DesignTokenNode.findParent(this);

        if (parent) {
            parent.appendChild(this);
        }
    }

    /**
     * Invoked when the DesignTokenNode.target is detached from the document
     */
    public unbind() {
        if (childToParent.has(this)) {
            const parent = childToParent.get(this)!;
            parent.removeChild(this);
        }
    }

    /**
     * Appends a child to a parent DesignTokenNode.
     * @param child - The child to append to the node
     */
    public appendChild(child: DesignTokenNode): void {
        childToParent.get(child)?.removeChild(child);
        const reParent = this.children.filter(x => child.contains(x));

        childToParent.set(child, this);
        this.children.push(child);

        reParent.forEach(x => child.appendChild(x));
    }

    /**
     * Removes a child from an element if the
     * @param child - The child to remove.
     */
    public removeChild(child: DesignTokenNode): boolean {
        const childIndex = this.children.indexOf(child);

        if (childIndex !== -1) {
            this.children.splice(childIndex, 1);
        }

        return childToParent.get(child) === this ? childToParent.delete(child) : false;
    }

    /**
     * Tests whether a provided node is contained by
     * the calling node.
     * @param test - The node to test
     */
    public contains(test: DesignTokenNode): boolean {
        return composedContains(this.target, test.target);
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
