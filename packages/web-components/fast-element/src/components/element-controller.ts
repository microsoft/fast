import { Message, Mutable } from "../interfaces.js";
import { PropertyChangeNotifier } from "../observation/notifier.js";
import {
    ExecutionContext,
    ExpressionController,
    Observable,
    SourceLifetime,
} from "../observation/observable.js";
import { FAST, makeSerializationNoop } from "../platform.js";
import { ElementStyles } from "../styles/element-styles.js";
import type { HostBehavior, HostController } from "../styles/host.js";
import type { StyleStrategy, StyleTarget } from "../styles/style-strategy.js";
import type { ViewController } from "../templating/html-directive.js";
import type { ElementViewTemplate } from "../templating/template.js";
import type { ElementView } from "../templating/view.js";
import { FASTElementDefinition } from "./fast-definitions.js";

const defaultEventOptions: CustomEventInit = {
    bubbles: true,
    composed: true,
    cancelable: true,
};

const isConnectedPropertyName = "isConnected";

const shadowRoots = new WeakMap<Element, ShadowRoot>();

function getShadowRoot(element: Element): ShadowRoot | null {
    return element.shadowRoot ?? shadowRoots.get(element) ?? null;
}

let elementControllerStrategy: ElementControllerStrategy;

/**
 * A type that instantiates an ElementController
 * @public
 */
export interface ElementControllerStrategy {
    new (element: HTMLElement, definition: FASTElementDefinition): ElementController;
}

const enum Stages {
    connecting,
    connected,
    disconnecting,
    disconnected,
}

/**
 * Controls the lifecycle and rendering of a `FASTElement`.
 * @public
 */
export class ElementController<TElement extends HTMLElement = HTMLElement>
    extends PropertyChangeNotifier
    implements HostController<TElement>
{
    private boundObservables: Record<string, any> | null = null;
    private needsInitialization: boolean = true;
    private hasExistingShadowRoot = false;
    private _template: ElementViewTemplate<TElement> | null = null;
    private stage: Stages = Stages.disconnected;
    /**
     * A guard against connecting behaviors multiple times
     * during connect in scenarios where a behavior adds
     * another behavior during it's connectedCallback
     */
    private guardBehaviorConnection = false;
    private behaviors: Map<HostBehavior<TElement>, number> | null = null;
    private _mainStyles: ElementStyles | null = null;

    /**
     * This allows Observable.getNotifier(...) to return the Controller
     * when the notifier for the Controller itself is being requested. The
     * result is that the Observable system does not need to create a separate
     * instance of Notifier for observables on the Controller. The component and
     * the controller will now share the same notifier, removing one-object construct
     * per web component instance.
     */
    private readonly $fastController = this;

    /**
     * The element being controlled by this controller.
     */
    public readonly source: TElement;

    /**
     * The element definition that instructs this controller
     * in how to handle rendering and other platform integrations.
     */
    public readonly definition: FASTElementDefinition;

    /**
     * The view associated with the custom element.
     * @remarks
     * If `null` then the element is managing its own rendering.
     */
    public readonly view: ElementView<TElement> | null = null;

    /**
     * Indicates whether or not the custom element has been
     * connected to the document.
     */
    public get isConnected(): boolean {
        Observable.track(this, isConnectedPropertyName);
        return this.stage === Stages.connected;
    }

    /**
     * The context the expression is evaluated against.
     */
    public get context(): ExecutionContext {
        return this.view?.context ?? ExecutionContext.default;
    }

    /**
     * Indicates whether the controller is bound.
     */
    public get isBound(): boolean {
        return this.view?.isBound ?? false;
    }

    /**
     * Indicates how the source's lifetime relates to the controller's lifetime.
     */
    public get sourceLifetime(): SourceLifetime | undefined {
        return this.view?.sourceLifetime;
    }

    /**
     * Gets/sets the template used to render the component.
     * @remarks
     * This value can only be accurately read after connect but can be set at any time.
     */
    public get template(): ElementViewTemplate<TElement> | null {
        // 1. Template overrides take top precedence.
        if (this._template === null) {
            const definition = this.definition;

            if ((this.source as any).resolveTemplate) {
                // 2. Allow for element instance overrides next.
                this._template = (this.source as any).resolveTemplate();
            } else if (definition.template) {
                // 3. Default to the static definition.
                this._template = definition.template ?? null;
            }
        }

        return this._template;
    }

    public set template(value: ElementViewTemplate<TElement> | null) {
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
    public get mainStyles(): ElementStyles | null {
        // 1. Styles overrides take top precedence.
        if (this._mainStyles === null) {
            const definition = this.definition;

            if ((this.source as any).resolveStyles) {
                // 2. Allow for element instance overrides next.
                this._mainStyles = (this.source as any).resolveStyles();
            } else if (definition.styles) {
                // 3. Default to the static definition.
                this._mainStyles = definition.styles ?? null;
            }
        }

        return this._mainStyles;
    }

    public set mainStyles(value: ElementStyles | null) {
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
     * Creates a Controller to control the specified element.
     * @param element - The element to be controlled by this controller.
     * @param definition - The element definition metadata that instructs this
     * controller in how to handle rendering and other platform integrations.
     * @internal
     */
    public constructor(element: TElement, definition: FASTElementDefinition) {
        super(element);

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
                const propertyName = accessors[i].name as keyof TElement;
                const value = (element as any)[propertyName];

                if (value !== void 0) {
                    delete element[propertyName];
                    boundObservables[propertyName] = value;
                }
            }
        }
    }

    /**
     * Registers an unbind handler with the controller.
     * @param behavior - An object to call when the controller unbinds.
     */
    onUnbind(behavior: { unbind(controller: ExpressionController<TElement>) }): void {
        this.view?.onUnbind(behavior);
    }

    /**
     * Adds the behavior to the component.
     * @param behavior - The behavior to add.
     */
    public addBehavior(behavior: HostBehavior<TElement>) {
        const targetBehaviors = this.behaviors ?? (this.behaviors = new Map());
        const count = targetBehaviors.get(behavior) ?? 0;

        if (count === 0) {
            targetBehaviors.set(behavior, 1);
            behavior.addedCallback && behavior.addedCallback(this);

            if (
                behavior.connectedCallback &&
                !this.guardBehaviorConnection &&
                (this.stage === Stages.connected || this.stage === Stages.connecting)
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
    public removeBehavior(behavior: HostBehavior<TElement>, force: boolean = false) {
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

            if (behavior.disconnectedCallback && this.stage !== Stages.disconnected) {
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
    public addStyles(styles: ElementStyles | HTMLStyleElement | null | undefined): void {
        if (!styles) {
            return;
        }

        const source = this.source;

        if (styles instanceof HTMLElement) {
            const target = getShadowRoot(source) ?? this.source;
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
    public removeStyles(
        styles: ElementStyles | HTMLStyleElement | null | undefined
    ): void {
        if (!styles) {
            return;
        }

        const source = this.source;

        if (styles instanceof HTMLElement) {
            const target = getShadowRoot(source) ?? source;
            target.removeChild(styles);
        } else if (styles.isAttachedTo(source)) {
            const sourceBehaviors = styles.behaviors;

            styles.removeStylesFrom(source);

            if (sourceBehaviors !== null) {
                for (let i = 0, ii = sourceBehaviors.length; i < ii; ++i) {
                    this.removeBehavior(sourceBehaviors[i]);
                }
            }
        }
    }

    /**
     * Runs connected lifecycle behavior on the associated element.
     */
    public connect(): void {
        if (this.stage !== Stages.disconnected) {
            return;
        }

        this.stage = Stages.connecting;

        // If we have any observables that were bound, re-apply their values.
        if (this.boundObservables !== null) {
            const element = this.source;
            const boundObservables = this.boundObservables;
            const propertyNames = Object.keys(boundObservables);

            for (let i = 0, ii = propertyNames.length; i < ii; ++i) {
                const propertyName = propertyNames[i];
                (element as any)[propertyName] = boundObservables[propertyName];
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

        this.stage = Stages.connected;
        Observable.notify(this, isConnectedPropertyName);
    }

    /**
     * Runs disconnected lifecycle behavior on the associated element.
     */
    public disconnect(): void {
        if (this.stage !== Stages.connected) {
            return;
        }

        this.stage = Stages.disconnecting;
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

        this.stage = Stages.disconnected;
    }

    /**
     * Runs the attribute changed callback for the associated element.
     * @param name - The name of the attribute that changed.
     * @param oldValue - The previous value of the attribute.
     * @param newValue - The new value of the attribute.
     */
    public onAttributeChangedCallback(
        name: string,
        oldValue: string | null,
        newValue: string | null
    ): void {
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
    public emit(
        type: string,
        detail?: any,
        options?: Omit<CustomEventInit, "detail">
    ): void | boolean {
        if (this.stage === Stages.connected) {
            return this.source.dispatchEvent(
                new CustomEvent(type, { detail, ...defaultEventOptions, ...options })
            );
        }

        return false;
    }

    private renderTemplate(template: ElementViewTemplate | null | undefined): void {
        // When getting the host to render to, we start by looking
        // up the shadow root. If there isn't one, then that means
        // we're doing a Light DOM render to the element's direct children.
        const element = this.source;
        const host = getShadowRoot(element) ?? element;

        if (this.view !== null) {
            // If there's already a view, we need to unbind and remove through dispose.
            this.view.dispose();
            (this as Mutable<this>).view = null;
        } else if (!this.needsInitialization || this.hasExistingShadowRoot) {
            this.hasExistingShadowRoot = false;

            // If there was previous custom rendering, we need to clear out the host.
            for (let child = host.firstChild; child !== null; child = host.firstChild) {
                host.removeChild(child);
            }
        }

        if (template) {
            // If a new template was provided, render it.
            (this as Mutable<this>).view = template.render(element, host, element);
            (this.view as any as Mutable<ViewController>).sourceLifetime =
                SourceLifetime.coupled;
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
    public static forCustomElement(element: HTMLElement): ElementController {
        const controller: ElementController = (element as any).$fastController;

        if (controller !== void 0) {
            return controller;
        }

        const definition = FASTElementDefinition.getForInstance(element);

        if (definition === void 0) {
            throw FAST.error(Message.missingElementDefinition);
        }

        return ((element as any).$fastController = new elementControllerStrategy(
            element,
            definition
        ));
    }

    /**
     * Sets the strategy that ElementController.forCustomElement uses to construct
     * ElementController instances for an element.
     * @param strategy - The strategy to use.
     */
    public static setStrategy(strategy: ElementControllerStrategy) {
        elementControllerStrategy = strategy;
    }
}

makeSerializationNoop(ElementController);

// Set default strategy for ElementController
ElementController.setStrategy(ElementController);

/**
 * Converts a styleTarget into the operative target. When the provided target is an Element
 * that is a FASTElement, the function will return the ShadowRoot for that element. Otherwise,
 * it will return the root node for the element.
 * @param target
 * @returns
 */
function normalizeStyleTarget(target: StyleTarget): Required<StyleTarget> {
    if ("adoptedStyleSheets" in target) {
        return target as Required<StyleTarget>;
    } else {
        return (
            (getShadowRoot(target as any) as null | StyleTarget) ??
            (target.getRootNode() as any)
        );
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
export class AdoptedStyleSheetsStrategy implements StyleStrategy {
    private static styleSheetCache = new Map<string, CSSStyleSheet>();
    /** @internal */
    public readonly sheets: CSSStyleSheet[];

    public constructor(styles: (string | CSSStyleSheet)[]) {
        const styleSheetCache = AdoptedStyleSheetsStrategy.styleSheetCache;
        this.sheets = styles.map((x: string | CSSStyleSheet) => {
            if (x instanceof CSSStyleSheet) {
                return x;
            }

            let sheet = styleSheetCache.get(x);

            if (sheet === void 0) {
                sheet = new CSSStyleSheet();
                (sheet as any).replaceSync(x);
                styleSheetCache.set(x, sheet);
            }

            return sheet;
        });
    }

    public addStylesTo(target: StyleTarget): void {
        addAdoptedStyleSheets(normalizeStyleTarget(target), this.sheets);
    }

    public removeStylesFrom(target: StyleTarget): void {
        removeAdoptedStyleSheets(normalizeStyleTarget(target), this.sheets);
    }
}

let id = 0;
const nextStyleId = (): string => `fast-${++id}`;
function usableStyleTarget(target: StyleTarget): StyleTarget {
    return target === document ? document.body : target;
}
/**
 * @internal
 */
export class StyleElementStrategy implements StyleStrategy {
    private readonly styleClass: string;

    public constructor(private readonly styles: string[]) {
        this.styleClass = nextStyleId();
    }

    public addStylesTo(target: StyleTarget): void {
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

    public removeStylesFrom(target: StyleTarget): void {
        target = usableStyleTarget(normalizeStyleTarget(target));
        const styles: NodeListOf<HTMLStyleElement> = target.querySelectorAll(
            `.${this.styleClass}`
        );

        for (let i = 0, ii = styles.length; i < ii; ++i) {
            target.removeChild(styles[i]);
        }
    }
}

let addAdoptedStyleSheets = (target: Required<StyleTarget>, sheets: CSSStyleSheet[]) => {
    target.adoptedStyleSheets = [...target.adoptedStyleSheets!, ...sheets];
};
let removeAdoptedStyleSheets = (
    target: Required<StyleTarget>,
    sheets: CSSStyleSheet[]
) => {
    target.adoptedStyleSheets = target.adoptedStyleSheets!.filter(
        (x: CSSStyleSheet) => sheets.indexOf(x) === -1
    );
};
if (ElementStyles.supportsAdoptedStyleSheets) {
    try {
        // Test if browser implementation uses FrozenArray.
        // If not, use push / splice to alter the stylesheets
        // in place. This circumvents a bug in Safari 16.4 where
        // periodically, assigning the array would previously
        // cause sheets to be removed.
        (document as any).adoptedStyleSheets.push();
        (document as any).adoptedStyleSheets.splice();
        addAdoptedStyleSheets = (target, sheets) => {
            target.adoptedStyleSheets.push(...sheets);
        };
        removeAdoptedStyleSheets = (target, sheets) => {
            for (const sheet of sheets) {
                const index = target.adoptedStyleSheets.indexOf(sheet);
                if (index !== -1) {
                    target.adoptedStyleSheets.splice(index, 1);
                }
            }
        };
    } catch (e) {
        // Do nothing if an error is thrown, the default
        // case handles FrozenArray.
    }

    ElementStyles.setDefaultStrategy(AdoptedStyleSheetsStrategy);
} else {
    ElementStyles.setDefaultStrategy(StyleElementStrategy);
}
