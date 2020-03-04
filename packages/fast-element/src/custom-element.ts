import { ElementViewTemplate } from "./template";
import {
    BindableDefinition,
    Bindable,
    PartialBindableDefinitionPropertyOmitted,
} from "./bindable";
import { emptyArray } from "./interfaces";
import { Registry } from "./di";
import { Observable } from "./observation/observable";
import { ElementStyles } from "./styles";

export type PartialCustomElementDefinition = {
    readonly name: string;
    readonly template?: ElementViewTemplate;
    readonly styles?: ElementStyles;
    readonly bindables?:
        | Record<string, PartialBindableDefinitionPropertyOmitted>
        | string[];
    readonly dependencies?: Registry[];
    readonly shadowOptions?: ShadowRootInit | null;
    readonly elementOptions?: ElementDefinitionOptions;
};

type CustomElementConstructor = {
    new (): HTMLElement;
};

export function customElement(nameOrDef: string | PartialCustomElementDefinition) {
    return function(type: CustomElementConstructor) {
        CustomElement.define(type, nameOrDef);
    };
}

const elementDefinitions = new Map<CustomElementConstructor, CustomElementDefinition>();

export const CustomElement = {
    define<T extends CustomElementConstructor>(
        Type: T,
        nameOrDef?: string | PartialCustomElementDefinition
    ): T {
        const definition = CustomElementDefinition.create(Type, nameOrDef);
        const observedAttributes = Object.keys(definition.attributes);
        const proto = Type.prototype;

        Reflect.defineProperty(Type, "observedAttributes", {
            get: () => observedAttributes,
            enumerable: true,
        });

        observedAttributes.forEach(name =>
            Observable.define(proto, definition.attributes[name].property)
        );

        elementDefinitions.set(Type, definition);
        customElements.define(definition.name, Type, definition.elementOptions);
        return Type;
    },

    getDefinition<T extends CustomElementConstructor>(
        Type: T
    ): CustomElementDefinition | undefined {
        return elementDefinitions.get(Type);
    },
};

export class CustomElementDefinition {
    public readonly attributes: Record<string, BindableDefinition>;

    public constructor(
        public readonly name: string,
        public readonly bindables: Record<string, BindableDefinition>,
        public readonly template?: ElementViewTemplate,
        public readonly styles?: ElementStyles,
        public readonly shadowOptions?: ShadowRootInit,
        public readonly elementOptions?: ElementDefinitionOptions,
        public readonly dependencies: ReadonlyArray<Registry> = emptyArray
    ) {
        this.attributes = {};
        Object.keys(this.bindables).forEach(key => {
            const bindable = bindables[key];
            this.attributes[bindable.attribute] = bindable;
        });
    }

    public static create<T extends CustomElementConstructor>(
        Type: T,
        nameOrDef: string | PartialCustomElementDefinition = (Type as any).definition
    ) {
        if (typeof nameOrDef === "string") {
            nameOrDef = { name: nameOrDef };
        }

        const name = nameOrDef.name;
        const bindables = Bindable.from((Type as any).bindables, nameOrDef.bindables);
        const shadowOptions =
            nameOrDef.shadowOptions === void 0
                ? ({ mode: "open" } as ShadowRootInit)
                : nameOrDef.shadowOptions || void 0;

        return new CustomElementDefinition(
            name,
            bindables,
            nameOrDef.template,
            nameOrDef.styles,
            shadowOptions,
            nameOrDef.elementOptions,
            nameOrDef.dependencies
        );
    }
}
