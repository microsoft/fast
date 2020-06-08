import { AttributeDefinition } from "./attributes";
import { Controller } from "./controller";
import { Observable } from "./observation/observable";
import {
    fastDefinitions,
    FASTElementDefinition,
    PartialFASTElementDefinition,
} from "./fast-definitions";

const defaultShadowOptions: ShadowRootInit = { mode: "open" };
const defaultElementOptions: ElementDefinitionOptions = {};

/**
 * Represents a custom element based on the FASTElement infrastructure.
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
     * @param Type - The custom element type to define.
     * @param nameOrDef - The name of the element to define or a definition object
     * that describes the element to define.
     */
    define<TType extends Function>(
        Type: TType,
        nameOrDef: string | PartialFASTElementDefinition = (Type as any).definition
    ): TType {
        if (typeof nameOrDef === "string") {
            nameOrDef = { name: nameOrDef };
        }

        const name = nameOrDef.name;
        const attributes = AttributeDefinition.collect(Type, nameOrDef.attributes);
        const shadowOptions =
            nameOrDef.shadowOptions === void 0
                ? defaultShadowOptions
                : nameOrDef.shadowOptions === null
                ? void 0
                : { ...defaultShadowOptions, ...nameOrDef.shadowOptions };

        const elementOptions =
            nameOrDef.elementOptions === void 0
                ? defaultElementOptions
                : { ...defaultElementOptions, ...nameOrDef.shadowOptions };

        const observedAttributes = new Array<string>(attributes.length);
        const proto = Type.prototype;
        const propertyLookup = {};
        const attributeLookup = {};

        for (let i = 0, ii = attributes.length; i < ii; ++i) {
            const current = attributes[i];
            observedAttributes[i] = current.attribute;
            propertyLookup[current.name] = current;
            attributeLookup[current.attribute] = current;
            Observable.defineProperty(proto, current);
        }

        Reflect.defineProperty(Type, "observedAttributes", {
            value: observedAttributes,
            enumerable: true,
        });

        const definition = new FASTElementDefinition(
            name,
            attributes,
            propertyLookup,
            attributeLookup,
            nameOrDef.template,
            nameOrDef.styles,
            shadowOptions,
            elementOptions
        );

        fastDefinitions.set(Type, definition);
        customElements.define(name, Type as any, definition.elementOptions);
        return Type;
    },

    /**
     * Gets the element definition associated with the specified type.
     * @param Type - The custom element type to retrieve the definition for.
     */
    getDefinition<T extends Function>(Type: T): FASTElementDefinition | undefined {
        return fastDefinitions.get(Type);
    },
});
/**
 * Decorator: Defines a platform custom element based on `FASTElement`.
 * @param nameOrDef - The name of the element to define or a definition object
 * that describes the element to define.
 */
export function customElement(nameOrDef: string | PartialFASTElementDefinition) {
    /* eslint-disable-next-line @typescript-eslint/explicit-function-return-type */
    return function (type: Function) {
        FASTElement.define(type, nameOrDef);
    };
}
