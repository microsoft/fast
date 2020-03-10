import { Controller } from "./controller";
import { CustomElementConstructor, emptyArray } from "./interfaces";
import { Observable } from "./observation/observable";
import { ElementViewTemplate } from "./template";
import { ElementStyles } from "./styles";
import { AttributeDefinition, AttributeConfiguration } from "./attributes";
import { Registry } from "./di";

const defaultShadowOptions: ShadowRootInit = { mode: "open" };
const defaultElementOptions: ElementDefinitionOptions = {};

function createFastElement(BaseType: typeof HTMLElement) {
    return class FastElement extends BaseType {
        public $controller!: Controller;

        public constructor() {
            super();
            Controller.forCustomElement(this);
        }

        public $emit(
            type: string,
            detail?: any,
            options?: Omit<CustomEventInit, "detail">
        ) {
            return this.$controller.emit(type, detail, options);
        }

        public connectedCallback() {
            this.$controller.onConnectedCallback();
        }

        public disconnectedCallback() {
            this.$controller.onDisconnectedCallback();
        }

        public attributeChangedCallback(
            name: string,
            oldValue: string,
            newValue: string
        ) {
            this.$controller.onAttributeChangedCallback(name, oldValue, newValue);
        }
    };
}

const fastDefinitions = new Map<CustomElementConstructor, FastElementDefinition>();

export const FastElement = Object.assign(createFastElement(HTMLElement), {
    from(BaseType: typeof HTMLElement) {
        return createFastElement(BaseType);
    },

    define<T extends CustomElementConstructor>(
        Type: T,
        nameOrDef: string | PartialFastElementDefinition = (Type as any).definition
    ): T {
        if (typeof nameOrDef === "string") {
            nameOrDef = { name: nameOrDef };
        }

        const name = nameOrDef.name;
        const attributes = AttributeDefinition.collect(
            (Type as any).attributes,
            nameOrDef.attributes
        );
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
            Observable.define(proto, current.property);
            observedAttributes[i] = current.attribute;
            propertyLookup[current.property] = current;
            attributeLookup[current.attribute] = current;
        }

        Reflect.defineProperty(Type, "observedAttributes", {
            value: observedAttributes,
            enumerable: true,
        });

        const definition = new FastElementDefinition(
            name,
            attributes,
            propertyLookup,
            attributeLookup,
            nameOrDef.template,
            nameOrDef.styles,
            shadowOptions,
            elementOptions,
            nameOrDef.dependencies
        );

        fastDefinitions.set(Type, definition);
        customElements.define(name, Type, definition.elementOptions);
        return Type;
    },

    getDefinition<T extends CustomElementConstructor>(
        Type: T
    ): FastElementDefinition | undefined {
        return fastDefinitions.get(Type);
    },
});

export type PartialFastElementDefinition = {
    readonly name: string;
    readonly template?: ElementViewTemplate;
    readonly styles?: ElementStyles;
    readonly attributes?: (AttributeConfiguration | string)[];
    readonly dependencies?: Registry[];
    readonly shadowOptions?: Partial<ShadowRootInit> | null;
    readonly elementOptions?: ElementDefinitionOptions;
};

export class FastElementDefinition {
    public constructor(
        public readonly name: string,
        public readonly attributes: ReadonlyArray<AttributeDefinition>,
        public readonly propertyLookup: Record<string, AttributeDefinition>,
        public readonly attributeLookup: Record<string, AttributeDefinition>,
        public readonly template?: ElementViewTemplate,
        public readonly styles?: ElementStyles,
        public readonly shadowOptions?: ShadowRootInit,
        public readonly elementOptions?: ElementDefinitionOptions,
        public readonly dependencies: ReadonlyArray<Registry> = emptyArray
    ) {}
}

export function customElement(nameOrDef: string | PartialFastElementDefinition) {
    return function(type: CustomElementConstructor) {
        FastElement.define(type, nameOrDef);
    };
}
