import { Template, noopTemplate } from "./template";
import { BindableDefinition, Bindable } from "./bindable";
import { Constructable } from "./interfaces";
import { Registry } from "./di";
import { Observable } from "./observation/observable";

export type PartialCustomElementDefinition = {
    readonly name: string;
    readonly template?: Template;
    readonly bindables?: Record<string, BindableDefinition>;
    readonly dependencies?: Registry[];
    readonly shadowOptions?: ShadowRootInit | null;
    readonly elementOptions?: ElementDefinitionOptions;
};

export function customElement(nameOrDef: string | PartialCustomElementDefinition) {
    return function(type: Constructable) {
        CustomElement.define(nameOrDef, type);
    };
}

const elementDefinitions = new Map<Constructable, CustomElementDefinition>();

export const CustomElement = {
    define<T extends Constructable>(
        nameOrDef: string | PartialCustomElementDefinition,
        Type: T
    ): T {
        const definition = CustomElementDefinition.create(nameOrDef, Type);
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
        customElements.define(definition.name, Type as any, definition.elementOptions);
        return Type;
    },

    getDefinition<T extends Constructable>(Type: T): CustomElementDefinition | undefined {
        return elementDefinitions.get(Type);
    },
};

function buildTemplate(def: PartialCustomElementDefinition): Template {
    if (def.template === void 0) {
        return noopTemplate;
    }

    return def.template;
}

export class CustomElementDefinition {
    public readonly attributes: Record<string, BindableDefinition>;

    public constructor(
        public readonly name: string,
        public readonly template: Template,
        public readonly bindables: Record<string, BindableDefinition>,
        public readonly dependencies: Registry[],
        public readonly shadowOptions: ShadowRootInit | null,
        public readonly elementOptions: ElementDefinitionOptions | undefined
    ) {
        this.attributes = {};
        Object.keys(this.bindables).forEach(key => {
            const bindable = bindables[key];
            this.attributes[bindable.attribute] = bindable;
        });
    }

    public static create(
        nameOrDef: string | PartialCustomElementDefinition,
        Type: Constructable
    ) {
        if (typeof nameOrDef === "string") {
            nameOrDef = { name: nameOrDef };
        }

        const name = nameOrDef.name;
        const bindables = Bindable.from((Type as any).bindables, nameOrDef.bindables);
        const dependencies = nameOrDef.dependencies || [];
        const shadowOptions =
            nameOrDef.shadowOptions === void 0
                ? ({ mode: "open" } as ShadowRootInit)
                : nameOrDef.shadowOptions;

        return new CustomElementDefinition(
            name,
            buildTemplate(nameOrDef),
            bindables,
            dependencies,
            shadowOptions,
            nameOrDef.elementOptions
        );
    }
}
