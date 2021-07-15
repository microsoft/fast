import { Controller } from "./controller";
import { PartialFASTElementDefinition } from "./fast-definitions";
/**
 * Represents a custom element based on the FASTElement infrastructure.
 * @public
 */
export interface FASTElement {
    /**
     * The underlying controller that handles the lifecycle and rendering of
     * this FASTElement.
     */
    readonly $fastController: Controller;
    /**
     * Emits a custom HTML event.
     * @param type - The type name of the event.
     * @param detail - The event detail object to send with the event.
     * @param options - The event options. By default bubbles and composed.
     * @remarks
     * Only emits events if the element is connected.
     */
    $emit(
        type: string,
        detail?: any,
        options?: Omit<CustomEventInit, "detail">
    ): boolean | void;
    /**
     * The connected callback for this FASTElement.
     * @remarks
     * This method is invoked by the platform whenever this FASTElement
     * becomes connected to the document.
     */
    connectedCallback(): void;
    /**
     * The disconnected callback for this FASTElement.
     * @remarks
     * This method is invoked by the platform whenever this FASTElement
     * becomes disconnected from the document.
     */
    disconnectedCallback(): void;
    /**
     * The attribute changed callback for this FASTElement.
     * @param name - The name of the attribute that changed.
     * @param oldValue - The previous value of the attribute.
     * @param newValue - The new value of the attribute.
     * @remarks
     * This method is invoked by the platform whenever an observed
     * attribute of FASTElement has a value change.
     */
    attributeChangedCallback(name: string, oldValue: string, newValue: string): void;
}
/**
 * A minimal base class for FASTElements that also provides
 * static helpers for working with FASTElements.
 * @public
 */
export declare const FASTElement: (new () => HTMLElement & FASTElement) & {
    /**
     * Creates a new FASTElement base class inherited from the
     * provided base type.
     * @param BaseType - The base element type to inherit from.
     */
    from<
        TBase extends {
            new (): HTMLElement;
            prototype: HTMLElement;
        }
    >(
        BaseType: TBase
    ): new () => InstanceType<TBase> & FASTElement;
    /**
     * Defines a platform custom element based on the provided type and definition.
     * @param type - The custom element type to define.
     * @param nameOrDef - The name of the element to define or a definition object
     * that describes the element to define.
     */
    define<TType extends Function>(
        type: TType,
        nameOrDef?: string | PartialFASTElementDefinition
    ): TType;
};
/**
 * Decorator: Defines a platform custom element based on `FASTElement`.
 * @param nameOrDef - The name of the element to define or a definition object
 * that describes the element to define.
 * @public
 */
export declare function customElement(
    nameOrDef: string | PartialFASTElementDefinition
): (type: Function) => void;
