import type { FASTElementDefinition } from "../components/fast-definitions.js";
import type { Schema } from "./schema.js";

const definitionSchemaHooksKey = Symbol("definitionSchemaHooks");

let schemaHookOrder = 0;

type FASTElementDefinitionWithSchemaHooks = FASTElementDefinition & {
    [definitionSchemaHooksKey]?: DefinitionSchemaHookRecord[];
};

interface DefinitionSchemaHookRecord {
    key: string;
    hook: DeclarativeSchemaHook;
    order: number;
    priority: number;
}

export interface DeclarativeSchemaHookContext {
    definition: FASTElementDefinition;
    schema: Schema;
}

export type DeclarativeSchemaHook = (context: DeclarativeSchemaHookContext) => void;

export function setDefinitionSchemaHook(
    definition: FASTElementDefinition,
    key: string,
    hook: DeclarativeSchemaHook,
    priority: number,
): void {
    const target = definition as FASTElementDefinitionWithSchemaHooks;
    const hooks = (target[definitionSchemaHooksKey] ??= []);
    const existingIndex = hooks.findIndex(record => record.key === key);

    if (existingIndex !== -1) {
        hooks.splice(existingIndex, 1);
    }

    hooks.push({
        key,
        hook,
        order: schemaHookOrder++,
        priority,
    });

    hooks.sort((a, b) => a.priority - b.priority || a.order - b.order);
}

export function getDefinitionSchemaHooks(
    definition?: FASTElementDefinition,
): readonly DeclarativeSchemaHook[] {
    const hooks = (definition as FASTElementDefinitionWithSchemaHooks | undefined)?.[
        definitionSchemaHooksKey
    ];

    return hooks?.map(record => record.hook) ?? [];
}
