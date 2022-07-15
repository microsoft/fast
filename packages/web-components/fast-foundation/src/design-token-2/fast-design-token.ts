import {
    Behavior,
    CSSDirective,
    FASTElement,
    Observable,
    Subscriber,
    SubscriberSet,
} from "@microsoft/fast-element";
import { composedContains, composedParent } from "@microsoft/fast-element/utilities";
import {
    PropertyTargetManager,
    RootStyleSheetTarget,
} from "../design-token/custom-property-manager.js";
import {
    DerivedDesignTokenValue,
    DesignTokenChangeRecord,
    DesignTokenMutationType,
    DesignTokenNode,
    DesignTokenResolver,
    DesignTokenValue,
    DesignTokenValueType,
    StaticDesignTokenValue,
} from "./design-token-node.js";

/**
 * Describes a DesignToken instance.
 * @public
 */
export interface DesignToken<T extends DesignTokenValueType> {
    readonly $value: T | undefined;
    /**
     * The name of the token
     */
    readonly name: string;

    /**
     * A list of elements for which the DesignToken has a value set
     */
    // readonly appliedTo: HTMLElement[];

    /**
     * The default value for the token, otherwise undefined. Also accessible from {@link DesignToken.$value}
     */
    readonly default: StaticDesignTokenValue<T> | undefined;

    /**
     * Get the token value for an element.
     * @param target - The element to get the value for
     * @returns - The value set for the element, or the value set for the nearest element ancestor.
     */
    getValueFor(target: FASTElement): StaticDesignTokenValue<T>;

    /**
     * Sets the token to a value for an element.
     * @param target - The element to set the value for.
     * @param value - The value.
     */
    setValueFor(target: FASTElement, value: DesignTokenValue<T> | DesignToken<T>): void;

    /**
     * Removes a value set for an element.
     * @param target - The element to remove the value from
     */
    deleteValueFor(target: FASTElement): this;

    /**
     * Associates a default value to the token
     */
    withDefault(value: DesignTokenValue<T> | DesignToken<T>): this;

    /**
     * Subscribes a subscriber to change records for a token. If an element is provided, only
     * change records for that element will be emitted.
     */
    subscribe(subscriber: FASTDesignTokenSubscriber<this>): void;

    /**
     * Unsubscribes a subscriber from change records for a token.
     */
    unsubscribe(subscriber: FASTDesignTokenSubscriber<this>): void;
}

export interface FASTDesignTokenChangeRecord<T extends DesignToken<any>> {
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
export interface FASTDesignTokenSubscriber<T extends DesignToken<any>> {
    handleChange(token: T, record: FASTDesignTokenChangeRecord<T>): void;
}

/**
 * A {@link (DesignToken:interface)} that emits a CSS custom property.
 * @public
 */
export interface CSSDesignToken<
    T extends
        | DesignTokenValueType
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
 * Describes a {@link (DesignToken:interface)} configuration
 * @public
 */
export interface DesignTokenConfiguration {
    /**
     * The name of the {@link (DesignToken:interface)}.
     */
    name: string;

    /**
     * The name of the CSS custom property to associate to the {@link (DesignToken:interface)}, or null
     * if not CSS custom property should be associated.
     */
    cssCustomPropertyName?: string | null;
}

class FASTDesignToken<T extends DesignTokenValueType> implements CSSDesignToken<T> {
    public cssCustomProperty: string;
    public name: string;
    public get $value() {
        return this.default;
    }
    public get default(): StaticDesignTokenValue<T> | undefined {
        return FASTDesignTokenNode.defaultNode.getTokenValue(this);
    }

    private cssVar: string | undefined;
    private subscribers = new SubscriberSet(this);

    public static from<T>(
        nameOrConfig: string | DesignTokenConfiguration
    ): FASTDesignToken<T> {
        return new FASTDesignToken<T>({
            name: typeof nameOrConfig === "string" ? nameOrConfig : nameOrConfig.name,
            cssCustomPropertyName:
                typeof nameOrConfig === "string"
                    ? nameOrConfig
                    : nameOrConfig.cssCustomPropertyName === void 0
                    ? nameOrConfig.name
                    : nameOrConfig.cssCustomPropertyName,
        });
    }

    constructor(configuration: DesignTokenConfiguration) {
        this.name = configuration.name;
        if (configuration.cssCustomPropertyName !== null) {
            this.cssCustomProperty = `--${configuration.cssCustomPropertyName}`;
            this.cssVar = `var(${this.cssCustomProperty})`;
            Observable.getNotifier(this).subscribe(this.cssReflector);
        }

        Observable.getNotifier(this).subscribe(this.subscriberNotifier);
    }

    public getValueFor(target: FASTElement): StaticDesignTokenValue<T> {
        return FASTDesignTokenNode.getOrCreate(target).getTokenValue(this);
    }

    public setValueFor(
        target: FASTElement,
        value: DesignToken<T> | DesignTokenValue<T>
    ): void {
        FASTDesignTokenNode.getOrCreate(target).setTokenValue(
            this,
            this.normalizeValue(value)
        );
    }

    public deleteValueFor(target: FASTElement): this {
        FASTDesignTokenNode.getOrCreate(target).deleteTokenValue(this);
        return this;
    }

    public withDefault(value: DesignToken<T> | DesignTokenValue<T>): this {
        FASTDesignTokenNode.defaultNode.setTokenValue(this, this.normalizeValue(value));
        return this;
    }

    public createCSS(): string {
        return this.cssVar || "";
    }

    public subscribe(subscriber: FASTDesignTokenSubscriber<this>): void {
        this.subscribers.subscribe(subscriber);
    }

    public unsubscribe(subscriber: FASTDesignTokenSubscriber<this>): void {
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

    private normalizeValue(
        value: DesignToken<T> | DesignTokenValue<T>
    ): DesignTokenValue<T> {
        if (value instanceof FASTDesignToken) {
            value = this.alias(value);
        }

        return value as DesignTokenValue<T>;
    }

    private cssReflector: Subscriber = {
        handleChange: <T>(
            source: FASTDesignToken<T>,
            record: DesignTokenChangeRecord<T>
        ) => {
            const target =
                record.target === FASTDesignTokenNode.defaultNode
                    ? FASTDesignTokenNode.rootStyleSheetTarget
                    : record.target instanceof FASTDesignTokenNode
                    ? PropertyTargetManager.getOrCreate(record.target.target)
                    : null;
            if (target) {
                if (record.type === DesignTokenMutationType.delete) {
                    target.removeProperty(this.cssCustomProperty!);
                } else {
                    target.setProperty(
                        this.cssCustomProperty!,
                        record.target.getTokenValue(this) as any
                    );
                }
            }
        },
    };

    private subscriberNotifier: Subscriber = {
        handleChange: (
            source: FASTDesignToken<T>,
            change: DesignTokenChangeRecord<T>
        ) => {
            const record: FASTDesignTokenChangeRecord<this> = {
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

class FASTDesignTokenNode extends DesignTokenNode implements Behavior {
    public static defaultNode = new DesignTokenNode();
    public static rootStyleSheetTarget = new RootStyleSheetTarget();
    private static cache = new WeakMap<FASTElement, FASTDesignTokenNode>();
    private bound = false;
    bind(target: FASTElement) {
        this.bound = true;

        let parent = FASTDesignTokenNode.findParent(target);

        // Reset these methods to the super method do avoid
        // state checking prior to token operations.
        this.setTokenValue = super.setTokenValue;
        this.getTokenValue = super.getTokenValue;
        this.deleteTokenValue = super.deleteTokenValue;

        if (parent === null) {
            parent = FASTDesignTokenNode.defaultNode;
        }

        if (parent !== this.parent) {
            const reparent = [];
            for (const child of parent.children as FASTDesignTokenNode[]) {
                if (composedContains(target, child.target)) {
                    reparent.push(child);
                }
            }

            parent.appendChild(this);

            for (const child of reparent) {
                this.appendChild(child);
            }
        }
    }

    unbind(): void {}

    public static getOrCreate(target: FASTElement) {
        let found = FASTDesignTokenNode.cache.get(target);

        if (found) {
            return found;
        }

        found = new FASTDesignTokenNode(target);
        FASTDesignTokenNode.cache.set(target, found);
        target.$fastController.addBehaviors([found]);

        return found;
    }

    private static findParent(target: FASTElement): DesignTokenNode | null {
        let current = composedParent(target);

        while (current !== null) {
            const node = FASTDesignTokenNode.cache.get(current as FASTElement);
            if (node) {
                return node;
            }

            current = composedParent(current);
        }

        return null;
    }

    constructor(public readonly target: FASTElement) {
        super();

        /**
         * Get, set, and delete operations should lazily append the node to the default node
         * if they're called prior to the node getting bound to an element. This is a slight perf optimization
         * over appending the node to the default node in all cases during construction, which would force the default
         * node to notify the child of all tokens set for the default. In most cases, the node will be bound before any of these
         * APIs are called, so skip that notification unless they're called.
         *
         * These methods get reset to the super method in {@link FASTDesignTokenNode.bind()}
         */
        this.getTokenValue = this.lazyAppendToDefaultNode(super.getTokenValue);
        this.setTokenValue = this.lazyAppendToDefaultNode(super.setTokenValue);
        this.deleteTokenValue = this.lazyAppendToDefaultNode(super.deleteTokenValue);
    }

    /**
     * Appends the node to the 'default' node prior to executing the provided callback
     * if the node has not been bound and parent is null.
     */
    private lazyAppendToDefaultNode<T extends Function>(fn: T): T {
        return ((...args: any[]) => {
            if (!this.bound && this.parent === null) {
                FASTDesignTokenNode.defaultNode.appendChild(this);
            }

            return fn.apply(this, args);
        }) as any;
    }
}

/* eslint-disable @typescript-eslint/no-unused-vars */
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
    return FASTDesignToken.from(nameOrConfig);
}
/* eslint-enable @typescript-eslint/no-unused-vars */
/**
 * Factory object for creating {@link (DesignToken:interface)} instances.
 * @public
 */
export const DesignToken = Object.freeze({
    create,

    /**
     * Registers and element or document as a DesignToken root.
     * {@link CSSDesignToken | CSSDesignTokens} with default values assigned via
     * {@link (DesignToken:interface).withDefault} will emit CSS custom properties to all
     * registered roots.
     * @param target - The root to register
     */
    registerRoot(target: FASTElement | Document = document) {
        RootStyleSheetTarget.registerRoot(target);
    },

    /**
     * Unregister an element or document as a DesignToken root.
     * @param target - The root to deregister
     */
    unregisterRoot(target: FASTElement | Document = document) {
        RootStyleSheetTarget.unregisterRoot(target);
    },
});
