import { type Constructable, isFunction } from "../interfaces.js";
import { ElementController } from "./element-controller.js";
import {
    applyFASTElementExtensions,
    FASTElementDefinition,
    type FASTElementExtension,
    type PartialFASTElementDefinition,
    resolveFASTElementTemplate,
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
    readonly $fastController: ElementController;

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
        options?: Omit<CustomEventInit, "detail">,
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
        newValue: string | null,
    ): void;
}

/* eslint-disable-next-line @typescript-eslint/explicit-function-return-type */
function createFASTElement<T extends typeof HTMLElement>(
    BaseType: T,
): T & FASTElementConstructor & { new (): InstanceType<T> & FASTElement } {
    const type = class extends (BaseType as any) {
        public readonly $fastController!: ElementController;

        public constructor() {
            /* eslint-disable-next-line */
            super();
            ElementController.forCustomElement(this as any);
        }

        public $emit(
            type: string,
            detail?: any,
            options?: Omit<CustomEventInit, "detail">,
        ): boolean | void {
            return this.$fastController.emit(type, detail, options);
        }

        public connectedCallback(): void {
            this.$fastController.connect();
        }

        public disconnectedCallback(): void {
            this.$fastController.disconnect();
        }

        public attributeChangedCallback(
            name: string,
            oldValue: string | null,
            newValue: string | null,
        ): void {
            this.$fastController.onAttributeChangedCallback(name, oldValue, newValue);
        }
    };

    FASTElementDefinition.registerBaseType(type);

    return type as any;
}

function isPromiseLike<T>(value: T | PromiseLike<T>): value is PromiseLike<T> {
    return typeof (value as PromiseLike<T> | undefined)?.then === "function";
}

function define<TType extends Constructable<HTMLElement> = Constructable<HTMLElement>>(
    this: TType,
    nameOrDef: string | PartialFASTElementDefinition<TType>,
    extensions?: FASTElementExtension[],
): Promise<TType>;
function define<TType extends Constructable<HTMLElement> = Constructable<HTMLElement>>(
    type: TType,
    nameOrDef?: string | PartialFASTElementDefinition<TType>,
    extensions?: FASTElementExtension[],
): Promise<TType>;
function define<TType extends Constructable<HTMLElement> = Constructable<HTMLElement>>(
    type: TType | string | PartialFASTElementDefinition<TType>,
    nameOrDef?: string | PartialFASTElementDefinition<TType> | FASTElementExtension[],
    extensions?: FASTElementExtension[],
): Promise<TType> {
    if (Array.isArray(nameOrDef)) {
        extensions = nameOrDef;
        nameOrDef = undefined;
    }

    const composePromise = isFunction(type)
        ? FASTElementDefinition.compose(
              type,
              nameOrDef as string | PartialFASTElementDefinition<TType> | undefined,
          )
        : FASTElementDefinition.compose(this, type);

    return composePromise.then(def => {
        applyFASTElementExtensions(def, def.registry, extensions);

        const template = resolveFASTElementTemplate(def);

        if (isPromiseLike(template)) {
            return template.then(() => def.define().type);
        }

        return def.define().type;
    });
}

function from<TBase extends typeof HTMLElement>(BaseType: TBase) {
    return createFASTElement(BaseType);
}

/**
 * The FASTElement constructor and static registration helpers.
 * @public
 */
export interface FASTElementConstructor {
    /**
     * Creates a FASTElement instance.
     */
    new (): FASTElement;

    /**
     * Defines a platform custom element based on the provided type and definition.
     * @param nameOrDef - The name of the element to define or a definition object.
     * @param extensions - Optional callbacks to run before registration.
     */
    define<TType extends Constructable<HTMLElement> = Constructable<HTMLElement>>(
        this: TType,
        nameOrDef: string | PartialFASTElementDefinition<TType>,
        extensions?: FASTElementExtension[],
    ): Promise<TType>;

    /**
     * Defines a platform custom element based on the provided type and definition.
     * @param type - The custom element type to define.
     * @param nameOrDef - The name of the element to define or a definition object.
     * @param extensions - Optional callbacks to run before registration.
     */
    define<TType extends Constructable<HTMLElement> = Constructable<HTMLElement>>(
        type: TType,
        nameOrDef?: string | PartialFASTElementDefinition<TType>,
        extensions?: FASTElementExtension[],
    ): Promise<TType>;

    /**
     * Creates a new FASTElement base class inherited from the provided base type.
     * @param BaseType - The base element type to inherit from.
     */
    from<TBase extends typeof HTMLElement>(
        BaseType: TBase,
    ): TBase & FASTElementConstructor & { new (): InstanceType<TBase> & FASTElement };
}

/**
 * A minimal base class for FASTElements that also provides
 * static helpers for working with FASTElements.
 * @public
 */
export const FASTElement: FASTElementConstructor = Object.assign(
    createFASTElement(HTMLElement),
    {
        /**
         * Creates a new FASTElement base class inherited from the
         * provided base type.
         * @param BaseType - The base element type to inherit from.
         */
        from,

        /**
         * Defines a platform custom element based on the provided type and definition.
         * @param type - The custom element type to define.
         * @param nameOrDef - The name of the element to define or a definition object
         * that describes the element to define.
         */
        define,
    },
);

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
