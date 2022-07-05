import { Constructable, isFunction } from "../interfaces.js";
import { Controller } from "./controller.js";
import {
    FASTElementDefinition,
    PartialFASTElementDefinition,
} from "./fast-definitions.js";

/**
 * Represents a custom element based on the FASTElement infrastructure.
 * @public
 */
export interface FASTElement extends HTMLElement {
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
    attributeChangedCallback(
        name: string,
        oldValue: string | null,
        newValue: string | null
    ): void;
}

/* eslint-disable-next-line @typescript-eslint/explicit-function-return-type */
function createFASTElement<T extends typeof HTMLElement>(
    BaseType: T
): { new (): InstanceType<T> & FASTElement } {
    return class extends (BaseType as any) {
        public readonly $fastController!: Controller;

        public constructor() {
            /* eslint-disable-next-line */
            super();
            Controller.forCustomElement(this as any);
        }

        public $emit(
            type: string,
            detail?: any,
            options?: Omit<CustomEventInit, "detail">
        ): boolean | void {
            return this.$fastController.emit(type, detail, options);
        }

        public connectedCallback(): void {
            this.$fastController.onConnectedCallback();
        }

        public disconnectedCallback(): void {
            this.$fastController.onDisconnectedCallback();
        }

        public attributeChangedCallback(
            name: string,
            oldValue: string | null,
            newValue: string | null
        ): void {
            this.$fastController.onAttributeChangedCallback(name, oldValue, newValue);
        }
    } as any;
}

function compose<TType extends Constructable<HTMLElement> = Constructable<HTMLElement>>(
    this: TType,
    nameOrDef: string | PartialFASTElementDefinition
): FASTElementDefinition<TType>;
function compose<TType extends Constructable<HTMLElement> = Constructable<HTMLElement>>(
    type: TType,
    nameOrDef?: string | PartialFASTElementDefinition
): FASTElementDefinition<TType>;
function compose<TType extends Constructable<HTMLElement> = Constructable<HTMLElement>>(
    type: TType | string | PartialFASTElementDefinition,
    nameOrDef?: string | PartialFASTElementDefinition
): FASTElementDefinition<TType> {
    if (isFunction(type)) {
        return FASTElementDefinition.compose(type, nameOrDef);
    }

    return FASTElementDefinition.compose(this, type);
}

function define<TType extends Constructable<HTMLElement> = Constructable<HTMLElement>>(
    this: TType,
    nameOrDef: string | PartialFASTElementDefinition
): TType;
function define<TType extends Constructable<HTMLElement> = Constructable<HTMLElement>>(
    type: TType,
    nameOrDef?: string | PartialFASTElementDefinition
): TType;
function define<TType extends Constructable<HTMLElement> = Constructable<HTMLElement>>(
    type: TType | string | PartialFASTElementDefinition,
    nameOrDef?: string | PartialFASTElementDefinition
): TType {
    if (isFunction(type)) {
        return FASTElementDefinition.compose(type, nameOrDef).define().type;
    }

    return FASTElementDefinition.compose(this, type).define().type;
}

/**
 * A minimal base class for FASTElements that also provides
 * static helpers for working with FASTElements.
 * @public
 */
export const FASTElement = Object.assign(createFASTElement(HTMLElement), {
    /**
     * Creates a new FASTElement base class inherited from the
     * provided base type.
     * @param BaseType - The base element type to inherit from.
     */
    from<TBase extends typeof HTMLElement>(BaseType: TBase) {
        return createFASTElement(BaseType);
    },

    /**
     * Defines a platform custom element based on the provided type and definition.
     * @param type - The custom element type to define.
     * @param nameOrDef - The name of the element to define or a definition object
     * that describes the element to define.
     */
    define,

    /**
     * Defines metadata for a FASTElement which can be used to later define the element.
     * @public
     */
    compose,
});

/**
 * Decorator: Defines a platform custom element based on `FASTElement`.
 * @param nameOrDef - The name of the element to define or a definition object
 * that describes the element to define.
 * @public
 */
export function customElement(nameOrDef: string | PartialFASTElementDefinition) {
    /* eslint-disable-next-line @typescript-eslint/explicit-function-return-type */
    return function (type: Constructable<HTMLElement>) {
        define(type, nameOrDef);
    };
}
