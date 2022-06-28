import {
    Constructable,
    FASTElement,
    FASTElementDefinition,
} from "@microsoft/fast-element";

export type TemplateElementDependency =
    | string
    | FASTElementDefinition
    | Constructable<FASTElement>;

export function tagFor(dependency: TemplateElementDependency): string {
    if (typeof dependency === "string") {
        return dependency;
    }

    if (typeof dependency === "function") {
        dependency = FASTElementDefinition.getByType(dependency)!;
        if (!dependency) {
            throw new Error("Missing FASTElement definition.");
        }
    }

    return dependency.name;
}
