import { Message, Mutable, StyleTarget } from "../interfaces.js";
import type { Behavior } from "../observation/behavior.js";
import { PropertyChangeNotifier } from "../observation/notifier.js";
import { ExecutionContext, Observable } from "../observation/observable.js";
import { FAST } from "../platform.js";
import type { ElementStyles } from "../styles/element-styles.js";
import type { ElementViewTemplate } from "../templating/template.js";
import type { ElementView } from "../templating/view.js";
import { FASTElementDefinition } from "./fast-definitions.js";

const shadowRoots = new WeakMap<HTMLElement, ShadowRoot>();
const defaultEventOptions: CustomEventInit = {
    bubbles: true,
    composed: true,
    cancelable: true,
};

function getShadowRoot(element: HTMLElement): ShadowRoot | null {
    return element.shadowRoot ?? shadowRoots.get(element) ?? null;
}

const isConnectedPropertyName = "isConnected";

/**
 * Controls the lifecycle and rendering of a `FASTElement`.
 * @public
 */
export class Controller<
    TElement extends HTMLElement = HTMLElement
> extends PropertyChangeNotifier {
    private boundObservables: Record<string, any> | null = null;
    private behaviors: Map<Behavior<TElement>, number> | null = null;
    private needsInitialization: boolean = true;
    private hasExistingShadowRoot = false;
    private _template: ElementViewTemplate<TElement> | null = null;
    private _styles: ElementStyles | null = null;
    private _isConnected: boolean = false;

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
    public readonly element: TElement;

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

            if ((this.element as any).resolveTemplate) {
                // 2. Allow for element instance overrides next.
                this._template = (this.element as any).resolveTemplate();
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
     * Gets/sets the primary styles used for the component.
     * @remarks
     * This value can only be accurately read after connect but can be set at any time.
     */
    public get styles(): ElementStyles | null {
        // 1. Styles overrides take top precedence.
        if (this._styles === null) {
            const definition = this.definition;

            if ((this.element as any).resolveStyles) {
                // 2. Allow for element instance overrides next.
                this._styles = (this.element as any).resolveStyles();
            } else if (definition.styles) {
                // 3. Default to the static definition.
                this._styles = definition.styles ?? null;
            }
        }

        return this._styles;
    }

    public set styles(value: ElementStyles | null) {
        if (this._styles === value) {
            return;
        }

        if (this._styles !== null) {
            this.removeStyles(this._styles);
        }

        this._styles = value;

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

        this.element = element;
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
     * Adds styles to this element. Providing an HTMLStyleElement will attach the element instance to the shadowRoot.
     * @param styles - The styles to add.
     */
    public addStyles(styles: ElementStyles | HTMLStyleElement | null | undefined): void {
        if (!styles) {
            return;
        }

        const target =
            getShadowRoot(this.element) ||
            ((this.element.getRootNode() as any) as StyleTarget);

        if (styles instanceof HTMLElement) {
            target.append(styles);
        } else if (!styles.isAttachedTo(target)) {
            const sourceBehaviors = styles.behaviors;
            styles.addStylesTo(target);

            if (sourceBehaviors !== null) {
                this.addBehaviors(sourceBehaviors);
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

        const target =
            getShadowRoot(this.element) ||
            ((this.element.getRootNode() as any) as StyleTarget);

        if (styles instanceof HTMLElement) {
            target.removeChild(styles);
        } else if (styles.isAttachedTo(target)) {
            const sourceBehaviors = styles.behaviors;

            styles.removeStylesFrom(target);

            if (sourceBehaviors !== null) {
                this.removeBehaviors(sourceBehaviors);
            }
        }
    }

    /**
     * Adds behaviors to this element.
     * @param behaviors - The behaviors to add.
     */
    public addBehaviors(behaviors: ReadonlyArray<Behavior<TElement>>): void {
        const targetBehaviors = this.behaviors ?? (this.behaviors = new Map());
        const length = behaviors.length;
        const behaviorsToBind: Behavior<TElement>[] = [];

        for (let i = 0; i < length; ++i) {
            const behavior = behaviors[i];

            if (targetBehaviors.has(behavior)) {
                targetBehaviors.set(behavior, targetBehaviors.get(behavior) + 1);
            } else {
                targetBehaviors.set(behavior, 1);
                behaviorsToBind.push(behavior);
            }
        }

        if (this._isConnected) {
            const element = this.element;
            const context = ExecutionContext.default;

            for (let i = 0; i < behaviorsToBind.length; ++i) {
                behaviorsToBind[i].bind(element, context);
            }
        }
    }

    /**
     * Removes behaviors from this element.
     * @param behaviors - The behaviors to remove.
     * @param force - Forces unbinding of behaviors.
     */
    public removeBehaviors(
        behaviors: ReadonlyArray<Behavior<TElement>>,
        force: boolean = false
    ): void {
        const targetBehaviors = this.behaviors;

        if (targetBehaviors === null) {
            return;
        }

        const length = behaviors.length;
        const behaviorsToUnbind: Behavior<TElement>[] = [];

        for (let i = 0; i < length; ++i) {
            const behavior = behaviors[i];

            if (targetBehaviors.has(behavior)) {
                const count = targetBehaviors.get(behavior)! - 1;

                count === 0 || force
                    ? targetBehaviors.delete(behavior) && behaviorsToUnbind.push(behavior)
                    : targetBehaviors.set(behavior, count);
            }
        }

        if (this._isConnected) {
            const element = this.element;
            const context = ExecutionContext.default;

            for (let i = 0; i < behaviorsToUnbind.length; ++i) {
                behaviorsToUnbind[i].unbind(element, context);
            }
        }
    }

    /**
     * Runs connected lifecycle behavior on the associated element.
     */
    public onConnectedCallback(): void {
        if (this._isConnected) {
            return;
        }

        const element = this.element;
        const context = ExecutionContext.default;

        if (this.needsInitialization) {
            this.finishInitialization();
        } else if (this.view !== null) {
            this.view.bind(element, context);
        }

        const behaviors = this.behaviors;

        if (behaviors !== null) {
            for (const behavior of behaviors.keys()) {
                behavior.bind(element, context);
            }
        }

        this.setIsConnected(true);
    }

    /**
     * Runs disconnected lifecycle behavior on the associated element.
     */
    public onDisconnectedCallback(): void {
        if (!this._isConnected) {
            return;
        }

        this.setIsConnected(false);

        const view = this.view;

        if (view !== null) {
            view.unbind();
        }

        const behaviors = this.behaviors;

        if (behaviors !== null) {
            const element = this.element;
            const context = ExecutionContext.default;

            for (const behavior of behaviors.keys()) {
                behavior.unbind(element, context);
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
            attrDef.onAttributeChangedCallback(this.element, newValue);
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
            return this.element.dispatchEvent(
                new CustomEvent(type, { detail, ...defaultEventOptions, ...options })
            );
        }

        return false;
    }

    private finishInitialization(): void {
        const element = this.element;
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
        this.addStyles(this.styles);

        this.needsInitialization = false;
    }

    private renderTemplate(template: ElementViewTemplate | null | undefined): void {
        const element = this.element;
        // When getting the host to render to, we start by looking
        // up the shadow root. If there isn't one, then that means
        // we're doing a Light DOM render to the element's direct children.
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
    public static forCustomElement(element: HTMLElement): Controller {
        const controller: Controller = (element as any).$fastController;

        if (controller !== void 0) {
            return controller;
        }

        const definition = FASTElementDefinition.getForInstance(element);

        if (definition === void 0) {
            throw FAST.error(Message.missingElementDefinition);
        }

        return ((element as any).$fastController = new Controller(element, definition));
    }
}
