import { Controller } from "./controller";
import { FASTElementDefinition, PartialFASTElementDefinition } from "./fast-definitions";

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

    /**
     * This is only a test for Beachball and should not be in committed source code
     */
    testingOnly(): void;
}

/* eslint-disable-next-line @typescript-eslint/explicit-function-return-type */
function createFASTElement<T extends typeof HTMLElement>(
    BaseType: T
): { new (): InstanceType<T> & FASTElement } {
    return class extends (BaseType as any) implements FASTElement {
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
            oldValue: string,
            newValue: string
        ): void {
            this.$fastController.onAttributeChangedCallback(name, oldValue, newValue);
        }
    } as any;
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
    define<TType extends Function>(
        type: TType,
        nameOrDef?: string | PartialFASTElementDefinition
    ): TType {
        return new FASTElementDefinition(type, nameOrDef).define().type;
    },
});

/**
 * Decorator: Defines a platform custom element based on `FASTElement`.
 * @param nameOrDef - The name of the element to define or a definition object
 * that describes the element to define.
 * @public
 */
export function customElement(nameOrDef: string | PartialFASTElementDefinition) {
    /* eslint-disable-next-line @typescript-eslint/explicit-function-return-type */
    return function (type: Function) {
        new FASTElementDefinition(type, nameOrDef).define();
    };
}
