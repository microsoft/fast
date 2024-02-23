import {
    CSSDirective,
    HostController,
    htmlDirective,
    HTMLDirective,
    Subscriber,
} from "@microsoft/fast-element";
import {
    cssDirective,
    FASTElement,
    HostBehavior,
    Observable,
    SubscriberSet,
} from "@microsoft/fast-element";
import { composedContains, composedParent } from "@microsoft/fast-element/utilities.js";
import type {
    DesignTokenChangeRecord as CoreDesignTokenChangeRecord,
    DerivedDesignTokenValue,
    DesignTokenResolver,
    DesignTokenValue,
} from "./core/design-token-node.js";
import { DesignTokenMutationType, DesignTokenNode } from "./core/design-token-node.js";
import {
    PropertyTarget,
    PropertyTargetManager,
    RootStyleSheetTarget,
} from "./custom-property-manager.js";

/**
 * @public
 */
export interface DesignTokenChangeRecord<T extends DesignToken<any>> {
    /**
     * The element for which the value was changed
     */
    target: FASTElement | "default";

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
    handleChange(token: T, record: DesignTokenChangeRecord<T>): void;
}

/**
 * Describes a {@link DesignToken} configuration
 * @public
 */
export interface DesignTokenConfiguration {
    /**
     * The name of the {@link DesignToken}.
     */
    name: string;
}

/**
 * @public
 */
export interface CSSDesignTokenConfiguration extends DesignTokenConfiguration {
    /**
     * The name of the CSS custom property to associate to the {@link CSSDesignToken}
     */
    cssCustomPropertyName: string;
}

/**
 * @public
 */
export class DesignToken<T> {
    /**
     * The name of the {@link DesignToken}
     */
    public name: string;

    /**
     * The default value of the token (alias of {@link DesignToken.default})
     */
    public get $value() {
        return this.default;
    }

    /**
     * The default value of the token, or undefined if it has not been set.
     */
    public get default(): T | undefined {
        return FASTDesignTokenNode.defaultNode.getTokenValue(this);
    }

    private _subscribers: SubscriberSet | undefined;
    private get subscribers() {
        if (this._subscribers) {
            return this._subscribers;
        }
        this._subscribers = new SubscriberSet(this);
        return this._subscribers;
    }

    constructor(configuration: DesignTokenConfiguration) {
        this.name = configuration.name;

        Observable.getNotifier(this).subscribe(this.subscriberNotifier);
    }

    private static isCSSDesignTokenConfiguration(
        config: CSSDesignTokenConfiguration | DesignTokenConfiguration
    ): config is CSSDesignTokenConfiguration {
        return (
            typeof (config as CSSDesignTokenConfiguration).cssCustomPropertyName ===
            "string"
        );
    }

    /**
     *
     * @param name - Factory function for creating a {@link DesignToken} or {@link CSSDesignToken}
     */
    public static create<T>(name: string): CSSDesignToken<T>;
    public static create<T>(config: DesignTokenConfiguration): DesignToken<T>;
    public static create<T>(config: CSSDesignTokenConfiguration): CSSDesignToken<T>;
    public static create<T>(config: any): any {
        if (typeof config === "string") {
            return new CSSDesignToken<T>({ name: config, cssCustomPropertyName: config });
        } else {
            return DesignToken.isCSSDesignTokenConfiguration(config)
                ? new CSSDesignToken<T>(config)
                : new DesignToken<T>(config);
        }
    }

    /**
     * Configures the strategy for resolving hierarchical relationships between FASTElement targets.
     */
    public static withStrategy(strategy: DesignTokenResolutionStrategy): void {
        FASTDesignTokenNode.withStrategy(strategy);
    }

    /**
     * Registers a target for emitting default style values.
     * {@link CSSDesignToken | CSSDesignTokens} with default values assigned via
     * {@link DesignToken.withDefault} will emit CSS custom properties to all
     * registered targets.
     * @param target - The target to register, defaults to the document
     */
    public static registerDefaultStyleTarget(
        target: FASTElement | Document | PropertyTarget = document
    ) {
        if (target instanceof FASTElement || target instanceof Document) {
            target = PropertyTargetManager.getOrCreate(target);
        }

        RootStyleSheetTarget.registerRoot(target);
    }

    /**
     * Unregister a target for default style emission.
     * @param target - The root to deregister, defaults to the document
     */
    public static unregisterDefaultStyleTarget(
        target: FASTElement | Document | PropertyTarget = document
    ) {
        if (target instanceof FASTElement || target instanceof Document) {
            target = PropertyTargetManager.getOrCreate(target);
        }

        RootStyleSheetTarget.unregisterRoot(target);
    }

    /**
     * Retrieves the value of the token for a target element.
     */
    public getValueFor(target: FASTElement): T {
        return FASTDesignTokenNode.getOrCreate(target).getTokenValue(this);
    }

    /**
     * Sets the value of the token for a target element.
     */
    public setValueFor(
        target: FASTElement,
        value: DesignToken<T> | DesignTokenValue<T>
    ): void {
        FASTDesignTokenNode.getOrCreate(target).setTokenValue(
            this,
            this.normalizeValue(value)
        );
    }

    /**
     * Deletes the value of the token for a target element.
     */
    public deleteValueFor(target: FASTElement): this {
        FASTDesignTokenNode.getOrCreate(target).deleteTokenValue(this);
        return this;
    }

    /**
     * Sets the default value of the token.
     */
    public withDefault(value: DesignToken<T> | DesignTokenValue<T>): this {
        FASTDesignTokenNode.defaultNode.setTokenValue(this, this.normalizeValue(value));
        return this;
    }

    /**
     * Subscribes a subscriber to notifications for the token.
     */
    public subscribe(subscriber: DesignTokenSubscriber<this>): void {
        this.subscribers.subscribe(subscriber);
    }

    /**
     * Unsubscribes a subscriber to notifications for the token.
     */
    public unsubscribe(subscriber: DesignTokenSubscriber<this>): void {
        this.subscribers.unsubscribe(subscriber);
    }

    /**
     * Alias the token to the provided token.
     * @param token - the token to alias to
     */
    private alias(token: DesignToken<T>): DerivedDesignTokenValue<T> {
        return ((resolve: DesignTokenResolver) =>
            resolve(token)) as DerivedDesignTokenValue<T>;
    }

    private normalizeValue(value: DesignToken<T> | DesignTokenValue<T>) {
        if (value instanceof DesignToken) {
            value = this.alias(value);
        }

        return value as DesignTokenValue<T>;
    }

    private subscriberNotifier: Subscriber = {
        handleChange: (
            source: DesignToken<T>,
            change: CoreDesignTokenChangeRecord<T>
        ) => {
            const record: DesignTokenChangeRecord<this> = {
                target:
                    change.target === FASTDesignTokenNode.defaultNode
                        ? "default"
                        : (change.target as FASTDesignTokenNode).target,
                token: this,
            };
            this.subscribers.notify(record);
        },
    };
}

/**
 * @public
 */
@cssDirective()
@htmlDirective()
export class CSSDesignToken<T>
    extends DesignToken<T>
    implements CSSDirective, HTMLDirective
{
    /**
     * The CSS Custom property name of the token.
     */
    public readonly cssCustomProperty: string;
    private cssVar: string;

    /**
     * The DesignToken represented as a string that can be used in CSS.
     */
    public createCSS(): string {
        return this.cssVar;
    }

    /**
     * Creates HTML to be used within a template.
     */
    public createHTML(): string {
        return this.cssVar;
    }

    private cssReflector: Subscriber = {
        handleChange: <T>(
            source: DesignToken<T>,
            record: CoreDesignTokenChangeRecord<T>
        ) => {
            const target =
                record.target === FASTDesignTokenNode.defaultNode
                    ? FASTDesignTokenNode.rootStyleSheetTarget
                    : record.target instanceof FASTDesignTokenNode
                    ? PropertyTargetManager.getOrCreate(record.target.target)
                    : null;
            if (target) {
                if (record.type === DesignTokenMutationType.delete) {
                    target.removeProperty(this.cssCustomProperty);
                } else {
                    target.setProperty(
                        this.cssCustomProperty,
                        this.resolveCSSValue(record.target.getTokenValue(this)) as any
                    );
                }
            }
        },
    };

    constructor(configuration: CSSDesignTokenConfiguration) {
        super(configuration);
        this.cssCustomProperty = `--${configuration.cssCustomPropertyName}`;
        this.cssVar = `var(${this.cssCustomProperty})`;
        Observable.getNotifier(this).subscribe(this.cssReflector);
    }

    private resolveCSSValue(value: any) {
        return value && typeof value.createCSS === "function" ? value.createCSS() : value;
    }
}

export interface DesignTokenResolutionStrategy extends HostBehavior<FASTElement> {
    /**
     * Determines if a 'child' element is contained by a 'parent'.
     * @param child - The child element
     * @param parent - The parent element
     */
    contains(parent: FASTElement, child: FASTElement): boolean;

    /**
     * Finds the nearest FASTElement parent node
     * @param element - The element to find the parent of
     */
    parent(element: FASTElement): FASTElement | null;
}

const defaultDesignTokenResolutionStrategy: DesignTokenResolutionStrategy = {
    contains: composedContains,
    parent(element: FASTElement): FASTElement | null {
        let parent: HTMLElement | null = composedParent(element);

        while (parent !== null) {
            if (parent instanceof FASTElement) {
                return parent as FASTElement;
            }

            parent = composedParent(parent);
        }

        return null;
    },
};

class FASTDesignTokenNode extends DesignTokenNode implements HostBehavior {
    private static _strategy: DesignTokenResolutionStrategy;
    private static get strategy() {
        if (this._strategy === undefined) {
            FASTDesignTokenNode.withStrategy(defaultDesignTokenResolutionStrategy);
        }

        return this._strategy;
    }
    public static defaultNode = new DesignTokenNode();
    public static rootStyleSheetTarget = new RootStyleSheetTarget();
    private static cache = new WeakMap<FASTElement, FASTDesignTokenNode>();

    public connectedCallback(controller: HostController) {
        let parent = FASTDesignTokenNode.findParent(controller.source);

        if (parent === null) {
            parent = FASTDesignTokenNode.defaultNode;
        }

        if (parent !== this.parent) {
            const reparent = [];
            for (const child of parent.children) {
                if (
                    child instanceof FASTDesignTokenNode &&
                    FASTDesignTokenNode.strategy.contains(controller.source, child.target)
                ) {
                    reparent.push(child);
                }
            }

            parent.appendChild(this);

            for (const child of reparent) {
                this.appendChild(child);
            }
        }
    }

    public disconnectedCallback(controller: HostController): void {
        FASTDesignTokenNode.cache.delete(this.target);
        this.dispose();
    }

    public static getOrCreate(target: FASTElement) {
        let found = FASTDesignTokenNode.cache.get(target);

        if (found) {
            return found;
        }

        found = new FASTDesignTokenNode(target);
        FASTDesignTokenNode.cache.set(target, found);
        target.$fastController.addBehavior(FASTDesignTokenNode.strategy);
        target.$fastController.addBehavior(found);

        return found;
    }

    public static withStrategy(strategy: DesignTokenResolutionStrategy) {
        this._strategy = strategy;
    }

    private static findParent(target: FASTElement): DesignTokenNode | null {
        let current = FASTDesignTokenNode.strategy.parent(target);

        while (current !== null) {
            const node = FASTDesignTokenNode.cache.get(current as FASTElement);
            if (node) {
                return node;
            }

            current = FASTDesignTokenNode.strategy.parent(current);
        }

        return null;
    }

    constructor(public readonly target: FASTElement) {
        super();
        // By default, nodes are not attached to the defaultNode for performance
        // reasons. However, that behavior can throw if retrieval for a node
        // happens before the bind() method is called. To guard against that,
        //  lazily attach to the defaultNode when get/set/delete methods are called.
        this.setTokenValue = this.lazyAttachToDefault(super.setTokenValue);
        this.getTokenValue = this.lazyAttachToDefault(super.getTokenValue);
        this.deleteTokenValue = this.lazyAttachToDefault(super.deleteTokenValue);
    }

    /**
     * Creates a function from a function that lazily attaches the node to the default node.
     */
    private lazyAttachToDefault<T extends (...args: any) => any>(fn: T): T {
        const cb = ((...args: Parameters<T>): ReturnType<T> => {
            if (this.parent === null) {
                FASTDesignTokenNode.defaultNode.appendChild(this);
            }

            return fn.apply(this, args);
        }) as T;

        return cb;
    }
}
