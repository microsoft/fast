import type { FASTElementDefinition } from "../components/fast-definitions.js";
import type { ElementOptions } from "./template.js";

const definitionElementOptionsKey = Symbol("definitionElementOptions");

type FASTElementDefinitionWithOptions = FASTElementDefinition & {
    [definitionElementOptionsKey]?: ElementOptions;
};

export function mergeElementOptions(
    base?: ElementOptions,
    override?: ElementOptions,
): ElementOptions | undefined {
    let result: ElementOptions | undefined;

    const assign = (options?: ElementOptions) => {
        if (options === void 0) {
            return;
        }

        result ??= {};

        if (options.observerMap !== void 0) {
            result.observerMap = options.observerMap;
        }

        if (options.attributeMap !== void 0) {
            result.attributeMap = options.attributeMap;
        }
    };

    assign(base);
    assign(override);

    return result;
}

export function setDefinitionElementOptions(
    definition: FASTElementDefinition,
    options: ElementOptions,
): void {
    const target = definition as FASTElementDefinitionWithOptions;

    target[definitionElementOptionsKey] = mergeElementOptions(
        target[definitionElementOptionsKey],
        options,
    );
}

export function getDefinitionElementOptions(
    definition?: FASTElementDefinition,
): ElementOptions | undefined {
    return (definition as FASTElementDefinitionWithOptions | undefined)?.[
        definitionElementOptionsKey
    ];
}
