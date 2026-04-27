import type { FASTElementDefinition } from "../components/fast-definitions.js";
import type { Schema } from "./schema.js";

const definitionSchemaTransformsKey = Symbol("definitionSchemaTransforms");

let schemaTransformOrder = 0;

type FASTElementDefinitionWithSchemaTransforms = FASTElementDefinition & {
    [definitionSchemaTransformsKey]?: DefinitionSchemaTransformRecord[];
};

interface DefinitionSchemaTransformRecord {
    key: string;
    transform: DeclarativeSchemaTransform;
    order: number;
    priority: number;
}

export interface DeclarativeSchemaTransformContext {
    definition: FASTElementDefinition;
    schema: Schema;
}

export type DeclarativeSchemaTransform = (
    context: DeclarativeSchemaTransformContext,
) => void;

export function setDefinitionSchemaTransform(
    definition: FASTElementDefinition,
    key: string,
    transform: DeclarativeSchemaTransform,
    priority: number,
): void {
    const target = definition as FASTElementDefinitionWithSchemaTransforms;
    const transforms = (target[definitionSchemaTransformsKey] ??= []);
    const existingIndex = transforms.findIndex(record => record.key === key);

    if (existingIndex !== -1) {
        transforms.splice(existingIndex, 1);
    }

    transforms.push({
        key,
        transform,
        order: schemaTransformOrder++,
        priority,
    });

    transforms.sort((a, b) => a.priority - b.priority || a.order - b.order);
}

export function getDefinitionSchemaTransforms(
    definition?: FASTElementDefinition,
): readonly DeclarativeSchemaTransform[] {
    const transforms = (
        definition as FASTElementDefinitionWithSchemaTransforms | undefined
    )?.[definitionSchemaTransformsKey];

    return transforms?.map(record => record.transform) ?? [];
}
