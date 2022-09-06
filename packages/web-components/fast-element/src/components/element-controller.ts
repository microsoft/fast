import { Message, Mutable, StyleTarget } from "../interfaces.js";
import type { HostBehavior, HostController } from "../styles/host.js";
import { PropertyChangeNotifier } from "../observation/notifier.js";
import { Observable, SourceLifetime } from "../observation/observable.js";
import { FAST } from "../platform.js";
import type { ElementViewTemplate } from "../templating/template.js";
import type { ElementView } from "../templating/view.js";
import type { ElementStyles } from "../styles/element-styles.js";
import type { ViewController } from "../templating/html-directive.js";
import { FASTElementDefinition } from "./fast-definitions.js";

const defaultEventOptions: CustomEventInit = {
    bubbles: true,
    composed: true,
    cancelable: true,
};

const isConnectedPropertyName = "isConnected";

const shadowRoots = new WeakMap<HTMLElement, ShadowRoot>();

function getShadowRoot(element: HTMLElement): ShadowRoot | null {
    return element.shadowRoot ?? shadowRoots.get(element) ?? null;
}

/**
 * Controls the lifecycle and rendering of a `FASTElement`.
 * @public
 */
export class ElementController<TElement extends HTMLElement = HTMLElement>
    extends PropertyChangeNotifier
    implements HostController<TElement> {
    private boundObservables: Record<string, any> | null = null;
    private needsInitialization: boolean = true;
    private hasExistingShadowRoot = false;
    private _template: ElementViewTemplate<TElement> | null = null;
    private _isConnected: boolean = false;
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
        return this._isConnected;
    }

    private setIsConnected(value: boolean): void {
        this._isConnected = value;
        Observable.notify(this, isConnectedPropertyName);
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
                const propertyName = accessors[i].name;
                const value = (element as any)[propertyName];

                if (value !== void 0) {
                    delete (element as any)[propertyName];
                    boundObservables[propertyName] = value;
                }
            }
        }
    }

    /**
     * Adds the behavior to the component.
     * @param behavior - The behavior to add.
     */
    addBehavior(behavior: HostBehavior<TElement>) {
        const targetBehaviors = this.behaviors ?? (this.behaviors = new Map());
        const count = targetBehaviors.get(behavior) ?? 0;

        if (count === 0) {
            targetBehaviors.set(behavior, 1);
            behavior.addedCallback && behavior.addedCallback(this);

            if (behavior.connectedCallback && this.isConnected) {
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
    removeBehavior(behavior: HostBehavior<TElement>, force: boolean = false) {
        const targetBehaviors = this.behaviors;
        if (targetBehaviors === null) {
            return;
        }

        const count = (targetBehaviors.get(behavior) ?? 0) - 1;

        if (count === 0 || force) {
            targetBehaviors.delete(behavior);

            if (behavior.disconnectedCallback && this.isConnected) {
                behavior.disconnectedCallback(this);
            }

            behavior.removedCallback && behavior.removedCallback(this);
        } else {
            targetBehaviors.set(behavior, count);
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
        const target: StyleTarget =
            getShadowRoot(source) ?? ((source.getRootNode() as any) as StyleTarget);

        if (styles instanceof HTMLElement) {
            target.append(styles);
        } else if (!styles.isAttachedTo(target)) {
            const sourceBehaviors = styles.behaviors;
            styles.addStylesTo(target);

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
        const target: StyleTarget =
            getShadowRoot(source) ?? ((source.getRootNode() as any) as StyleTarget);

        if (styles instanceof HTMLElement) {
            target.removeChild(styles);
        } else if (styles.isAttachedTo(target)) {
            const sourceBehaviors = styles.behaviors;

            styles.removeStylesFrom(target);

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
    public connect(): void {
        if (this._isConnected) {
            return;
        }

        if (this.needsInitialization) {
            this.finishInitialization();
        } else if (this.view !== null) {
            this.view.bind(this.source);
        }

        const behaviors = this.behaviors;
        if (behaviors !== null) {
            for (const key of behaviors.keys()) {
                key.connectedCallback && key.connectedCallback(this);
            }
        }

        this.setIsConnected(true);
    }

    /**
     * Runs disconnected lifecycle behavior on the associated element.
     */
    public disconnect(): void {
        if (!this._isConnected) {
            return;
        }

        this.setIsConnected(false);

        if (this.view !== null) {
            this.view.unbind();
        }

        const behaviors = this.behaviors;
        if (behaviors !== null) {
            for (const key of behaviors.keys()) {
                key.disconnectedCallback && key.disconnectedCallback(this);
            }
        }
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
        if (this._isConnected) {
            return this.source.dispatchEvent(
                new CustomEvent(type, { detail, ...defaultEventOptions, ...options })
            );
        }

        return false;
    }

    private finishInitialization(): void {
        const element = this.source;
        const boundObservables = this.boundObservables;

        // If we have any observables that were bound, re-apply their values.
        if (boundObservables !== null) {
            const propertyNames = Object.keys(boundObservables);

            for (let i = 0, ii = propertyNames.length; i < ii; ++i) {
                const propertyName = propertyNames[i];
                (element as any)[propertyName] = boundObservables[propertyName];
            }

            this.boundObservables = null;
        }

        this.renderTemplate(this.template);
        this.addStyles(this.mainStyles);

        this.needsInitialization = false;
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
            ((this.view as any) as Mutable<ViewController>).sourceLifetime =
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

        return ((element as any).$fastController = new ElementController(
            element,
            definition
        ));
    }
}
