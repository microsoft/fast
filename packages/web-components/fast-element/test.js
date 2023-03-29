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
var __metadata =
    (this && this.__metadata) ||
    function (k, v) {
        if (typeof Reflect === "object" && typeof Reflect.metadata === "function")
            return Reflect.metadata(k, v);
    };
import "../interfaces.js";
import { PropertyChangeNotifier } from "../observation/notifier.js";
import { Observable, SourceLifetime } from "../observation/observable.js";
import { FAST, makeSerializationNoop } from "../platform.js";
import { ElementStyles } from "../styles/element-styles.js";
import { FASTElementDefinition } from "./fast-definitions.js";
const defaultEventOptions = {
    bubbles: true,
    composed: true,
    cancelable: true,
};
const isConnectedPropertyName = "isConnected";
const shadowRoots = new WeakMap();
function getShadowRoot(element) {
    var _a, _b;
    return (_b =
        (_a = element.shadowRoot) !== null && _a !== void 0
            ? _a
            : shadowRoots.get(element)) !== null && _b !== void 0
        ? _b
        : null;
}
let elementControllerStrategy;
/**
 * Controls the lifecycle and rendering of a `FASTElement`.
 * @public
 */
let ElementController = class ElementController extends PropertyChangeNotifier {
    /**
     * Creates a Controller to control the specified element.
     * @param element - The element to be controlled by this controller.
     * @param definition - The element definition metadata that instructs this
     * controller in how to handle rendering and other platform integrations.
     * @internal
     */
    constructor(element, definition) {
        super(element);
        this.boundObservables = null;
        this.needsInitialization = true;
        this.hasExistingShadowRoot = false;
        this._template = null;
        this.stage = 3 /* Stages.disconnected */;
        /**
         * A guard against connecting behaviors multiple times
         * during connect in scenarios where a behavior adds
         * another behavior during it's connectedCallback
         */
        this.guardBehaviorConnection = false;
        this.behaviors = null;
        this._mainStyles = null;
        /**
         * This allows Observable.getNotifier(...) to return the Controller
         * when the notifier for the Controller itself is being requested. The
         * result is that the Observable system does not need to create a separate
         * instance of Notifier for observables on the Controller. The component and
         * the controller will now share the same notifier, removing one-object construct
         * per web component instance.
         */
        this.$fastController = this;
        /**
         * The view associated with the custom element.
         * @remarks
         * If `null` then the element is managing its own rendering.
         */
        this.view = null;
        this.source = element;
        this.definition = definition;
        const shadowOptions = definition.shadowOptions;
        if (shadowOptions !== void 0) {
            let shadowRoot = element.shadowRoot;
            if (shadowRoot) {
                this.hasExistingShadowRoot = true;
            } else {
                shadowRoot = element.attachShadow(shadowOptions);
                if (shadowOptions.mode === "closed") {
                    shadowRoots.set(element, shadowRoot);
                }
            }
        }
        // Capture any observable values that were set by the binding engine before
        // the browser upgraded the element. Then delete the property since it will
        // shadow the getter/setter that is required to make the observable operate.
        // Later, in the connect callback, we'll re-apply the values.
        const accessors = Observable.getAccessors(element);
        if (accessors.length > 0) {
            const boundObservables = (this.boundObservables = Object.create(null));
            for (let i = 0, ii = accessors.length; i < ii; ++i) {
                const propertyName = accessors[i].name;
                const value = element[propertyName];
                if (value !== void 0) {
                    delete element[propertyName];
                    boundObservables[propertyName] = value;
                }
            }
        }
    }
    /**
     * Indicates whether or not the custom element has been
     * connected to the document.
     */
    get isConnected() {
        Observable.track(this, isConnectedPropertyName);
        return this.stage === 1 /* Stages.connected */;
    }
    /**
     * Gets/sets the template used to render the component.
     * @remarks
     * This value can only be accurately read after connect but can be set at any time.
     */
    get template() {
        var _a;
        // 1. Template overrides take top precedence.
        if (this._template === null) {
            const definition = this.definition;
            if (this.source.resolveTemplate) {
                // 2. Allow for element instance overrides next.
                this._template = this.source.resolveTemplate();
            } else if (definition.template) {
                // 3. Default to the static definition.
                this._template =
                    (_a = definition.template) !== null && _a !== void 0 ? _a : null;
            }
        }
        return this._template;
    }
    set template(value) {
        if (this._template === value) {
            return;
        }
        this._template = value;
        if (!this.needsInitialization) {
            this.renderTemplate(value);
        }
    }
    /**
     * The main set of styles used for the component, independent
     * of any dynamically added styles.
     */
    get mainStyles() {
        var _a;
        // 1. Styles overrides take top precedence.
        if (this._mainStyles === null) {
            const definition = this.definition;
            if (this.source.resolveStyles) {
                // 2. Allow for element instance overrides next.
                this._mainStyles = this.source.resolveStyles();
            } else if (definition.styles) {
                // 3. Default to the static definition.
                this._mainStyles =
                    (_a = definition.styles) !== null && _a !== void 0 ? _a : null;
            }
        }
        return this._mainStyles;
    }
    set mainStyles(value) {
        if (this._mainStyles === value) {
            return;
        }
        if (this._mainStyles !== null) {
            this.removeStyles(this._mainStyles);
        }
        this._mainStyles = value;
        if (!this.needsInitialization) {
            this.addStyles(value);
        }
    }
    /**
     * Adds the behavior to the component.
     * @param behavior - The behavior to add.
     */
    addBehavior(behavior) {
        var _a, _b;
        const targetBehaviors =
            (_a = this.behaviors) !== null && _a !== void 0
                ? _a
                : (this.behaviors = new Map());
        const count =
            (_b = targetBehaviors.get(behavior)) !== null && _b !== void 0 ? _b : 0;
        if (count === 0) {
            targetBehaviors.set(behavior, 1);
            behavior.addedCallback && behavior.addedCallback(this);
            if (
                behavior.connectedCallback &&
                !this.guardBehaviorConnection &&
                (this.stage === 1 /* Stages.connected */ ||
                    this.stage === 0) /* Stages.connecting */
            ) {
                behavior.connectedCallback(this);
            }
        } else {
            targetBehaviors.set(behavior, count + 1);
        }
    }
    /**
     * Removes the behavior from the component.
     * @param behavior - The behavior to remove.
     * @param force - Forces removal even if this behavior was added more than once.
     */
    removeBehavior(behavior, force = false) {
        const targetBehaviors = this.behaviors;
        if (targetBehaviors === null) {
            return;
        }
        const count = targetBehaviors.get(behavior);
        if (count === void 0) {
            return;
        }
        if (count === 1 || force) {
            targetBehaviors.delete(behavior);
            if (
                behavior.disconnectedCallback &&
                this.stage !== 3 /* Stages.disconnected */
            ) {
                behavior.disconnectedCallback(this);
            }
            behavior.removedCallback && behavior.removedCallback(this);
        } else {
            targetBehaviors.set(behavior, count - 1);
        }
    }
    /**
     * Adds styles to this element. Providing an HTMLStyleElement will attach the element instance to the shadowRoot.
     * @param styles - The styles to add.
     */
    addStyles(styles) {
        var _a;
        if (!styles) {
            return;
        }
        const source = this.source;
        if (styles instanceof HTMLElement) {
            const target =
                (_a = getShadowRoot(source)) !== null && _a !== void 0 ? _a : this.source;
            target.append(styles);
        } else if (!styles.isAttachedTo(source)) {
            const sourceBehaviors = styles.behaviors;
            styles.addStylesTo(source);
            if (sourceBehaviors !== null) {
                for (let i = 0, ii = sourceBehaviors.length; i < ii; ++i) {
                    this.addBehavior(sourceBehaviors[i]);
                }
            }
        }
    }
    /**
     * Removes styles from this element. Providing an HTMLStyleElement will detach the element instance from the shadowRoot.
     * @param styles - the styles to remove.
     */
    removeStyles(styles) {
        var _a;
        if (!styles) {
            return;
        }
        const source = this.source;
        if (styles instanceof HTMLElement) {
            const target =
                (_a = getShadowRoot(source)) !== null && _a !== void 0 ? _a : source;
            target.removeChild(styles);
        } else if (styles.isAttachedTo(source)) {
            const sourceBehaviors = styles.behaviors;
            styles.removeStylesFrom(source);
            if (sourceBehaviors !== null) {
                for (let i = 0, ii = sourceBehaviors.length; i < ii; ++i) {
                    this.addBehavior(sourceBehaviors[i]);
                }
            }
        }
    }
    /**
     * Runs connected lifecycle behavior on the associated element.
     */
    connect() {
        if (this.stage !== 3 /* Stages.disconnected */) {
            return;
        }
        this.stage = 0 /* Stages.connecting */;
        // If we have any observables that were bound, re-apply their values.
        if (this.boundObservables !== null) {
            const element = this.source;
            const boundObservables = this.boundObservables;
            const propertyNames = Object.keys(boundObservables);
            for (let i = 0, ii = propertyNames.length; i < ii; ++i) {
                const propertyName = propertyNames[i];
                element[propertyName] = boundObservables[propertyName];
            }
            this.boundObservables = null;
        }
        const behaviors = this.behaviors;
        if (behaviors !== null) {
            this.guardBehaviorConnection = true;
            for (const key of behaviors.keys()) {
                key.connectedCallback && key.connectedCallback(this);
            }
            this.guardBehaviorConnection = false;
        }
        if (this.needsInitialization) {
            this.renderTemplate(this.template);
            this.addStyles(this.mainStyles);
            this.needsInitialization = false;
        } else if (this.view !== null) {
            this.view.bind(this.source);
        }
        this.stage = 1 /* Stages.connected */;
        Observable.notify(this, isConnectedPropertyName);
    }
    /**
     * Runs disconnected lifecycle behavior on the associated element.
     */
    disconnect() {
        if (this.stage !== 1 /* Stages.connected */) {
            return;
        }
        this.stage = 2 /* Stages.disconnecting */;
        Observable.notify(this, isConnectedPropertyName);
        if (this.view !== null) {
            this.view.unbind();
        }
        const behaviors = this.behaviors;
        if (behaviors !== null) {
            for (const key of behaviors.keys()) {
                key.disconnectedCallback && key.disconnectedCallback(this);
            }
        }
        this.stage = 3 /* Stages.disconnected */;
    }
    /**
     * Runs the attribute changed callback for the associated element.
     * @param name - The name of the attribute that changed.
     * @param oldValue - The previous value of the attribute.
     * @param newValue - The new value of the attribute.
     */
    onAttributeChangedCallback(name, oldValue, newValue) {
        const attrDef = this.definition.attributeLookup[name];
        if (attrDef !== void 0) {
            attrDef.onAttributeChangedCallback(this.source, newValue);
        }
    }
    /**
     * Emits a custom HTML event.
     * @param type - The type name of the event.
     * @param detail - The event detail object to send with the event.
     * @param options - The event options. By default bubbles and composed.
     * @remarks
     * Only emits events if connected.
     */
    emit(type, detail, options) {
        if (this.stage === 1 /* Stages.connected */) {
            return this.source.dispatchEvent(
                new CustomEvent(
                    type,
                    Object.assign(Object.assign({ detail }, defaultEventOptions), options)
                )
            );
        }
        return false;
    }
    renderTemplate(template) {
        var _a;
        // When getting the host to render to, we start by looking
        // up the shadow root. If there isn't one, then that means
        // we're doing a Light DOM render to the element's direct children.
        const element = this.source;
        const host =
            (_a = getShadowRoot(element)) !== null && _a !== void 0 ? _a : element;
        if (this.view !== null) {
            // If there's already a view, we need to unbind and remove through dispose.
            this.view.dispose();
            this.view = null;
        } else if (!this.needsInitialization || this.hasExistingShadowRoot) {
            this.hasExistingShadowRoot = false;
            // If there was previous custom rendering, we need to clear out the host.
            for (let child = host.firstChild; child !== null; child = host.firstChild) {
                host.removeChild(child);
            }
        }
        if (template) {
            // If a new template was provided, render it.
            this.view = template.render(element, host, element);
            this.view.sourceLifetime = SourceLifetime.coupled;
        }
    }
    /**
     * Locates or creates a controller for the specified element.
     * @param element - The element to return the controller for.
     * @remarks
     * The specified element must have a {@link FASTElementDefinition}
     * registered either through the use of the {@link customElement}
     * decorator or a call to `FASTElement.define`.
     */
    static forCustomElement(element) {
        const controller = element.$fastController;
        if (controller !== void 0) {
            return controller;
        }
        const definition = FASTElementDefinition.getForInstance(element);
        if (definition === void 0) {
            throw FAST.error(1401 /* Message.missingElementDefinition */);
        }
        return (element.$fastController = new elementControllerStrategy(
            element,
            definition
        ));
    }
    /**
     * Sets the strategy that ElementController.forCustomElement uses to construct
     * ElementController instances for an element.
     * @param strategy - The strategy to use.
     */
    static setStrategy(strategy) {
        elementControllerStrategy = strategy;
    }
};
ElementController = __decorate(
    [
        makeSerializationNoop,
        __metadata("design:paramtypes", [Object, FASTElementDefinition]),
    ],
    ElementController
);
export { ElementController };
// makeSerializationNoop(ElementController);
// Set default strategy for ElementController
ElementController.setStrategy(ElementController);
/**
 * Converts a styleTarget into the operative target. When the provided target is an Element
 * that is a FASTElement, the function will return the ShadowRoot for that element. Otherwise,
 * it will return the root node for the element.
 * @param target
 * @returns
 */
function normalizeStyleTarget(target) {
    var _a;
    if ("adoptedStyleSheets" in target) {
        return target;
    } else {
        return (_a = getShadowRoot(target)) !== null && _a !== void 0
            ? _a
            : target.getRootNode();
    }
}
// Default StyleStrategy implementations are defined in this module because they
// require access to element shadowRoots, and we don't want to leak shadowRoot
// objects out of this module.
/**
 * https://wicg.github.io/construct-stylesheets/
 * https://developers.google.com/web/updates/2019/02/constructable-stylesheets
 *
 * @internal
 */
export class AdoptedStyleSheetsStrategy {
    constructor(styles) {
        const styleSheetCache = AdoptedStyleSheetsStrategy.styleSheetCache;
        this.sheets = styles.map(x => {
            if (x instanceof CSSStyleSheet) {
                return x;
            }
            let sheet = styleSheetCache.get(x);
            if (sheet === void 0) {
                sheet = new CSSStyleSheet();
                sheet.replaceSync(x);
                styleSheetCache.set(x, sheet);
            }
            return sheet;
        });
    }
    addStylesTo(target) {
        const t = normalizeStyleTarget(target);
        t.adoptedStyleSheets = [...t.adoptedStyleSheets, ...this.sheets];
    }
    removeStylesFrom(target) {
        const t = normalizeStyleTarget(target);
        const sheets = this.sheets;
        t.adoptedStyleSheets = t.adoptedStyleSheets.filter(x => sheets.indexOf(x) === -1);
    }
}
AdoptedStyleSheetsStrategy.styleSheetCache = new Map();
let id = 0;
const nextStyleId = () => `fast-${++id}`;
function usableStyleTarget(target) {
    return target === document ? document.body : target;
}
/**
 * @internal
 */
export class StyleElementStrategy {
    constructor(styles) {
        this.styles = styles;
        this.styleClass = nextStyleId();
    }
    addStylesTo(target) {
        target = usableStyleTarget(normalizeStyleTarget(target));
        const styles = this.styles;
        const styleClass = this.styleClass;
        for (let i = 0; i < styles.length; i++) {
            const element = document.createElement("style");
            element.innerHTML = styles[i];
            element.className = styleClass;
            target.append(element);
        }
    }
    removeStylesFrom(target) {
        target = usableStyleTarget(normalizeStyleTarget(target));
        const styles = target.querySelectorAll(`.${this.styleClass}`);
        for (let i = 0, ii = styles.length; i < ii; ++i) {
            target.removeChild(styles[i]);
        }
    }
}
ElementStyles.setDefaultStrategy(
    ElementStyles.supportsAdoptedStyleSheets
        ? AdoptedStyleSheetsStrategy
        : StyleElementStrategy
);
