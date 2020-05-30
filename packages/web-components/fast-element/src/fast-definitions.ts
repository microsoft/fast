import { ElementViewTemplate } from "./template";
import { ElementStyles } from "./styles";
import { AttributeConfiguration, AttributeDefinition } from "./attributes";

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

export type PartialFASTElementDefinition = {
    readonly name: string;
    readonly template?: ElementViewTemplate;
    readonly styles?: ElementStyles;
    readonly attributes?: (AttributeConfiguration | string)[];
    readonly shadowOptions?: Partial<ShadowRootInit> | null;
    readonly elementOptions?: ElementDefinitionOptions;
};

/**
 * @internal
 */
export const fastDefinitions = new Map<Function, FASTElementDefinition>();

/**
 * @internal
 */
export function getDefinition<T extends Function>(
    Type: T
): FASTElementDefinition | undefined {
    return fastDefinitions.get(Type);
}
