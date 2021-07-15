import type { Behavior } from "../observation/behavior";
import { PropertyChangeNotifier } from "../observation/notifier";
import type { ElementStyles } from "../styles/element-styles";
import type { ElementViewTemplate } from "../templating/template";
import type { ElementView } from "../templating/view";
import { FASTElementDefinition } from "./fast-definitions";
/**
 * Controls the lifecycle and rendering of a `FASTElement`.
 * @public
 */
export declare class Controller extends PropertyChangeNotifier {
    private boundObservables;
    private behaviors;
    private needsInitialization;
    private _template;
    private _styles;
    private _isConnected;
    /**
     * The element being controlled by this controller.
     */
    readonly element: HTMLElement;
    /**
     * The element definition that instructs this controller
     * in how to handle rendering and other platform integrations.
     */
    readonly definition: FASTElementDefinition;
    /**
     * The view associated with the custom element.
     * @remarks
     * If `null` then the element is managing its own rendering.
     */
    readonly view: ElementView | null;
    /**
     * Indicates whether or not the custom element has been
     * connected to the document.
     */
    get isConnected(): boolean;
    private setIsConnected;
    /**
     * Gets/sets the template used to render the component.
     * @remarks
     * This value can only be accurately read after connect but can be set at any time.
     */
    get template(): ElementViewTemplate | null;
    set template(value: ElementViewTemplate | null);
    /**
     * Gets/sets the primary styles used for the component.
     * @remarks
     * This value can only be accurately read after connect but can be set at any time.
     */
    get styles(): ElementStyles | null;
    set styles(value: ElementStyles | null);
    /**
     * Creates a Controller to control the specified element.
     * @param element - The element to be controlled by this controller.
     * @param definition - The element definition metadata that instructs this
     * controller in how to handle rendering and other platform integrations.
     * @internal
     */
    constructor(element: HTMLElement, definition: FASTElementDefinition);
    /**
     * Adds styles to this element. Providing an HTMLStyleElement will attach the element instance to the shadowRoot.
     * @param styles - The styles to add.
     */
    addStyles(styles: ElementStyles | HTMLStyleElement): void;
    /**
     * Removes styles from this element. Providing an HTMLStyleElement will detach the element instance from the shadowRoot.
     * @param styles - the styles to remove.
     */
    removeStyles(styles: ElementStyles | HTMLStyleElement): void;
    /**
     * Adds behaviors to this element.
     * @param behaviors - The behaviors to add.
     */
    addBehaviors(behaviors: ReadonlyArray<Behavior>): void;
    /**
     * Removes behaviors from this element.
     * @param behaviors - The behaviors to remove.
     * @param force - Forces unbinding of behaviors.
     */
    removeBehaviors(behaviors: ReadonlyArray<Behavior>, force?: boolean): void;
    /**
     * Runs connected lifecycle behavior on the associated element.
     */
    onConnectedCallback(): void;
    /**
     * Runs disconnected lifecycle behavior on the associated element.
     */
    onDisconnectedCallback(): void;
    /**
     * Runs the attribute changed callback for the associated element.
     * @param name - The name of the attribute that changed.
     * @param oldValue - The previous value of the attribute.
     * @param newValue - The new value of the attribute.
     */
    onAttributeChangedCallback(name: string, oldValue: string, newValue: string): void;
    /**
     * Emits a custom HTML event.
     * @param type - The type name of the event.
     * @param detail - The event detail object to send with the event.
     * @param options - The event options. By default bubbles and composed.
     * @remarks
     * Only emits events if connected.
     */
    emit(
        type: string,
        detail?: any,
        options?: Omit<CustomEventInit, "detail">
    ): void | boolean;
    private finishInitialization;
    private renderTemplate;
    /**
     * Locates or creates a controller for the specified element.
     * @param element - The element to return the controller for.
     * @remarks
     * The specified element must have a {@link FASTElementDefinition}
     * registered either through the use of the {@link customElement}
     * decorator or a call to `FASTElement.define`.
     */
    static forCustomElement(element: HTMLElement): Controller;
}
