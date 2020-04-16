import { Controller } from "./controller";
import { emptyArray } from "./interfaces";
import { ElementViewTemplate } from "./template";
import { ElementStyles } from "./styles";
import { AttributeConfiguration, AttributeDefinition } from "./attributes";

const defaultShadowOptions: ShadowRootInit = { mode: "open" };
const defaultElementOptions: ElementDefinitionOptions = {};

export type PartialFASTElementDefinition = {
    readonly name: string;
    readonly template?: ElementViewTemplate;
    readonly styles?: ElementStyles;
    readonly attributes?: (AttributeConfiguration | string)[];
    readonly shadowOptions?: Partial<ShadowRootInit> | null;
    readonly elementOptions?: ElementDefinitionOptions;
};

export class FASTElementDefinition {
    public constructor(
        public readonly name: string,
        public readonly attributes: ReadonlyArray<AttributeDefinition>,
        public readonly propertyLookup: Record<string, AttributeDefinition>,
        public readonly attributeLookup: Record<string, AttributeDefinition>,
        public readonly template?: ElementViewTemplate,
        public readonly styles?: ElementStyles,
        public readonly shadowOptions?: ShadowRootInit,
        public readonly elementOptions?: ElementDefinitionOptions
    ) {}
}

/* eslint-disable-next-line @typescript-eslint/explicit-function-return-type */
function createFASTElement(BaseType: typeof HTMLElement) {
    return class FASTElement extends BaseType {
        public $fastController!: Controller;

        public constructor() {
            super();
            Controller.forCustomElement(this);
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
    };
}

const fastDefinitions = new Map<Function, FASTElementDefinition>();

export const FASTElement = Object.assign(createFASTElement(HTMLElement), {
    from(BaseType: typeof HTMLElement) {
        return createFASTElement(BaseType);
    },

    define<T extends Function>(
        Type: T,
        nameOrDef: string | PartialFASTElementDefinition = (Type as any).definition
    ): T {
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

        const observedAttributes = new Array(attributes.length);
        const proto = Type.prototype;
        const propertyLookup = {};
        const attributeLookup = {};

        for (let i = 0, ii = attributes.length; i < ii; ++i) {
            const current = attributes[i];
            observedAttributes[i] = current.attribute;
            propertyLookup[current.property] = current;
            attributeLookup[current.attribute] = current;

            Reflect.defineProperty(proto, current.property, {
                enumerable: true,
                get: function (this: any) {
                    return current.getValue(this);
                },
                set: function (this: any, value: any) {
                    return current.setValue(this, value);
                },
            });
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

    getDefinition<T extends Function>(Type: T): FASTElementDefinition | undefined {
        return fastDefinitions.get(Type);
    },
});

export function customElement(nameOrDef: string | PartialFASTElementDefinition) {
    /* eslint-disable-next-line @typescript-eslint/explicit-function-return-type */
    return function (type: Function) {
        FASTElement.define(type, nameOrDef);
    };
}
