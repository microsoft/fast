var __decorate =
    (this && this.__decorate) ||
    function (decorators, target, key, desc) {
        var c = arguments.length,
            r =
                c < 3
                    ? target
                    : desc === null
                    ? (desc = Object.getOwnPropertyDescriptor(target, key))
                    : desc,
            d;
        if (typeof Reflect === "object" && typeof Reflect.decorate === "function")
            r = Reflect.decorate(decorators, target, key, desc);
        else
            for (var i = decorators.length - 1; i >= 0; i--)
                if ((d = decorators[i]))
                    r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
        return c > 3 && r && Object.defineProperty(target, key, r), r;
    };
import {
    CSSDirective,
    defaultExecutionContext,
    FASTElement,
    observable,
    Observable,
} from "@microsoft/fast-element";
import { DI, Registration } from "../di/di";
import { composedParent } from "../utilities";
import { composedContains } from "../utilities/composed-contains";
import { CustomPropertyManager } from "./custom-property-manager";
const defaultElement = document.body;
/**
 * Implementation of {@link (DesignToken:interface)}
 */
class DesignTokenImpl extends CSSDirective {
    constructor(configuration) {
        super();
        this.subscribers = new WeakMap();
        this._appliedTo = new Set();
        this.name = configuration.name;
        if (configuration.cssCustomPropertyName !== null) {
            this.cssCustomProperty = `--${configuration.cssCustomPropertyName}`;
            this.cssVar = `var(${this.cssCustomProperty})`;
        }
    }
    get appliedTo() {
        return [...this._appliedTo];
    }
    static from(nameOrConfig) {
        return new DesignTokenImpl({
            name: typeof nameOrConfig === "string" ? nameOrConfig : nameOrConfig.name,
            cssCustomPropertyName:
                typeof nameOrConfig === "string"
                    ? nameOrConfig
                    : nameOrConfig.cssCustomPropertyName === void 0
                    ? nameOrConfig.name
                    : nameOrConfig.cssCustomPropertyName,
        });
    }
    static isCSSDesignToken(token) {
        return typeof token.cssCustomProperty === "string";
    }
    getOrCreateSubscriberSet(target = this) {
        return (
            this.subscribers.get(target) ||
            (this.subscribers.set(target, new Set()) && this.subscribers.get(target))
        );
    }
    createCSS() {
        return this.cssVar || "";
    }
    getValueFor(element) {
        const node = DesignTokenNode.for(this, element);
        Observable.track(node, "value");
        return DesignTokenNode.for(this, element).value;
    }
    setValueFor(element, value) {
        this._appliedTo.add(element);
        if (value instanceof DesignTokenImpl) {
            const tokenValue = value;
            value = target => tokenValue.getValueFor(target);
        }
        DesignTokenNode.for(this, element).set(value);
        [
            ...this.getOrCreateSubscriberSet(this),
            ...this.getOrCreateSubscriberSet(element),
        ].forEach(x => x.handleChange({ token: this, target: element }));
        return this;
    }
    deleteValueFor(element) {
        this._appliedTo.delete(element);
        DesignTokenNode.for(this, element).delete();
        return this;
    }
    withDefault(value) {
        DesignTokenNode.for(this, defaultElement).set(value);
        return this;
    }
    subscribe(subscriber, target) {
        const subscriberSet = this.getOrCreateSubscriberSet(target);
        if (!subscriberSet.has(subscriber)) {
            subscriberSet.add(subscriber);
        }
    }
    unsubscribe(subscriber, target) {
        this.getOrCreateSubscriberSet(target).delete(subscriber);
    }
}
const nodeCache = new WeakMap();
const channelCache = new Map();
const childToParent = new WeakMap();
const noop = Function.prototype;
/**
 * A node responsible for setting and getting token values,
 * emitting values to CSS custom properties, and maintaining
 * inheritance structures.
 */
class DesignTokenNode {
    constructor(token, target) {
        var _a;
        this.token = token;
        this.target = target;
        /** Track downstream nodes */
        this.children = new Set();
        this.useCSSCustomProperty = false;
        /**
         * Invoked when parent node's value changes
         */
        this.handleChange = this.unsetValueChangeHandler;
        this.bindingChangeHandler = {
            handleChange: () => {
                Observable.getNotifier(this).notify("value");
            },
        };
        this.cssCustomPropertySubscriber = {
            handleChange: () => {
                CustomPropertyManager.removeFrom(this.target, this.token);
                CustomPropertyManager.addTo(
                    this.target,
                    this.token,
                    this.resolveCSSValue(this.value)
                );
            },
            dispose: () => {
                CustomPropertyManager.removeFrom(this.target, this.token);
            },
        };
        this.tokenDependencySubscriber = {
            handleChange: record => {
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
        if (nodeCache.has(target) && nodeCache.get(target).has(token)) {
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
            target.$fastController.addBehaviors([this]);
        } else {
            (_a = this.findParentNode()) === null || _a === void 0
                ? void 0
                : _a.appendChild(this);
        }
    }
    _rawValueChanged() {
        Observable.getNotifier(this).notify("value");
    }
    /**
     * The actual value set for the node, or undefined.
     * This will be a reference to the original object for all data types
     * passed by reference.
     */
    get rawValue() {
        return this._rawValue;
    }
    useCSSCustomPropertyChanged(prev, next) {
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
    bind() {
        var _a;
        (_a = this.findParentNode()) === null || _a === void 0
            ? void 0
            : _a.appendChild(this);
    }
    unbind() {
        var _a;
        (_a = childToParent.get(this)) === null || _a === void 0
            ? void 0
            : _a.removeChild(this);
        this.tearDownBindingObserver();
    }
    resolveRealValue() {
        const rawValue = this.resolveRawValue();
        if (DesignTokenNode.isDerivedTokenValue(rawValue)) {
            if (!this.bindingObserver || this.bindingObserver.source !== rawValue) {
                this.setupBindingObserver(rawValue);
            }
            return this.bindingObserver.observe(this.target, defaultExecutionContext);
        } else {
            if (this.bindingObserver) {
                this.tearDownBindingObserver();
            }
            return rawValue;
        }
    }
    resolveRawValue() {
        /* eslint-disable-next-line */
        let current = this;
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
    resolveCSSValue(value) {
        return value && typeof value.createCSS === "function" ? value.createCSS() : value;
    }
    static channel(token) {
        return channelCache.has(token)
            ? channelCache.get(token)
            : channelCache.set(token, DI.createInterface()) && channelCache.get(token);
    }
    static isDerivedTokenValue(value) {
        return typeof value === "function";
    }
    unsetValueChangeHandler(source, key) {
        if (this._rawValue === void 0) {
            Observable.getNotifier(this).notify("value");
        }
    }
    setupBindingObserver(value) {
        this.tearDownBindingObserver();
        this.bindingObserver = Observable.binding(value, this.bindingChangeHandler);
    }
    tearDownBindingObserver() {
        if (this.bindingObserver) {
            this.bindingObserver.disconnect();
            this.bindingObserver = undefined;
        }
    }
    static for(token, target) {
        const targetCache = nodeCache.has(target)
            ? nodeCache.get(target)
            : nodeCache.set(target, new Map()) && nodeCache.get(target);
        return targetCache.has(token)
            ? targetCache.get(token)
            : targetCache.set(token, new DesignTokenNode(token, target)) &&
                  targetCache.get(token);
    }
    appendChild(child) {
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
    removeChild(child) {
        this.children.delete(child);
        childToParent.delete(child);
        Observable.getNotifier(this).unsubscribe(child, "value");
    }
    contains(node) {
        return composedContains(this.target, node.target);
    }
    findParentNode() {
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
    /**
     * The resolved value for a node.
     */
    get value() {
        return this.resolveRealValue();
    }
    /**
     * Sets a value for the node
     * @param value The value to set
     */
    set(value) {
        if (value === this._rawValue) {
            return;
        }
        this.handleChange = noop;
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
    delete() {
        if (this.useCSSCustomProperty) {
            this.useCSSCustomProperty = false;
        }
        this._rawValue = void 0;
        this.handleChange = this.unsetValueChangeHandler;
        this.tearDownBindingObserver();
    }
}
__decorate([observable], DesignTokenNode.prototype, "_rawValue", void 0);
__decorate([observable], DesignTokenNode.prototype, "useCSSCustomProperty", void 0);
function create(nameOrConfig) {
    return DesignTokenImpl.from(nameOrConfig);
}
/**
 * Factory object for creating {@link (DesignToken:interface)} instances.
 * @public
 */
export const DesignToken = Object.freeze({
    create,
});
