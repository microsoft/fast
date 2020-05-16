import { AttributeDefinition } from "./attributes";
import { Controller } from "./controller";
import { Observable } from "./observation/observable";
import {
    fastDefinitions,
    FASTElementDefinition,
    getDefinition,
    PartialFASTElementDefinition,
} from "./fast-definitions";

const defaultShadowOptions: ShadowRootInit = { mode: "open" };
const defaultElementOptions: ElementDefinitionOptions = {};

export interface FASTElement {
    $fastController: Controller;
    $emit(
        type: string,
        detail?: any,
        options?: Omit<CustomEventInit, "detail">
    ): boolean | void;
    connectedCallback(): void;
    disconnectedCallback(): void;
    attributeChangedCallback(name: string, oldValue: string, newValue: string): void;
}

/* eslint-disable-next-line @typescript-eslint/explicit-function-return-type */
function createFASTElement<T extends typeof HTMLElement>(
    BaseType: T
): { new (): InstanceType<T> & FASTElement } {
    return class extends (BaseType as any) implements FASTElement {
        public $fastController!: Controller;

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

export const FASTElement = Object.assign(createFASTElement(HTMLElement), {
    from<TBase extends typeof HTMLElement>(BaseType: TBase) {
        return createFASTElement(BaseType);
    },

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

    getDefinition,
});

export function customElement(nameOrDef: string | PartialFASTElementDefinition) {
    /* eslint-disable-next-line @typescript-eslint/explicit-function-return-type */
    return function (type: Function) {
        FASTElement.define(type, nameOrDef);
    };
}
