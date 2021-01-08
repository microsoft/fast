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

type ElementDisambiguationCallback = (
    existing: FASTElementDefinition,
    attempting: FASTElementDefinition
) => FASTElementDefinition | null;

const registeredDefinitions = new Map<string, FASTElementDefinition>();

/**
 * @alpha
 */
export class DesignSystem {
    private registrations: any[] = [];
    private prefix: string = defaultPrefix;
    private disambiguate: ElementDisambiguationCallback = () => null;

    public withPrefix(prefix: string) {
        this.prefix = prefix;
        return this;
    }

    public withElementDisambiguation(callback: ElementDisambiguationCallback) {
        this.disambiguate = callback;
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
            let attempt: FASTElementDefinition | null = new FASTElementDefinition(
                type,
                nameOrDef
            );

            while (attempt !== null && registeredDefinitions.has(attempt.name)) {
                attempt = this.disambiguate(
                    registeredDefinitions.get(attempt.name)!,
                    attempt
                );
            }

            if (attempt !== null) {
                registeredDefinitions.set(attempt.name, attempt);
                definitions.push(attempt);
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

        return container;
    }
}
