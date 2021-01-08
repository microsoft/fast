import {
    FASTElement,
    FASTElementDefinition,
    PartialFASTElementDefinition,
} from "@microsoft/fast-element";
import { DI, Registration } from "../di/di";

const defaultPrefix = "fast";

export const ElementPrefix = DI.createInterface<string>(x => x.instance(defaultPrefix));
export const DefineElement = DI.createInterface<typeof FASTElement.define>(x =>
    x.instance(FASTElement.define)
);

const registeredNames = new Set<string>();

/**
 * @alpha
 */
export class DesignSystem {
    private registrations: any[] = [];
    private prefix: string = defaultPrefix;

    public withPrefix(prefix: string) {
        this.prefix = prefix;
        return this;
    }

    public register(...params: any[]) {
        this.registrations.push(...params);
        return this;
    }

    public applyTo(element: HTMLElement) {
        const container = DI.getOrCreateDOMContainer(element);
        const definitions: FASTElementDefinition[] = [];
        const defineElement = <TType extends Function>(
            type: TType,
            nameOrDef?: string | PartialFASTElementDefinition
        ): TType => {
            const definition = new FASTElementDefinition(type, nameOrDef);

            if (!registeredNames.has(definition.name)) {
                registeredNames.add(definition.name);
                definitions.push(definition);
            }

            return type;
        };

        container.register(
            Registration.instance(ElementPrefix, this.prefix),
            Registration.instance(DefineElement, defineElement)
        );

        container.register(...this.registrations);

        for (const def of definitions) {
            def.define();
        }
    }
}
