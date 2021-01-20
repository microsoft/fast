import {
    FASTElement,
    FASTElementDefinition,
    PartialFASTElementDefinition,
} from "@microsoft/fast-element";
import { DI, Registration } from "../di/di";

const defaultPrefix = "fast";

export interface DesignSystemContext {
    readonly elementPrefix: string;
    defineElement<TType extends Function>(
        type: TType,
        nameOrDef?: string | PartialFASTElementDefinition | undefined
    ): TType;
}

export const DesignSystemContext = DI.createInterface<DesignSystemContext>(x =>
    x.instance({
        elementPrefix: defaultPrefix,
        defineElement: FASTElement.define,
    })
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
        const disambiguate = this.disambiguate;
        const context: DesignSystemContext = {
            elementPrefix: this.prefix,
            defineElement<TType extends Function>(
                type: TType,
                nameOrDef?: string | PartialFASTElementDefinition
            ): TType {
                let attempt: FASTElementDefinition | null = new FASTElementDefinition(
                    type,
                    nameOrDef
                );

                while (attempt !== null && registeredDefinitions.has(attempt.name)) {
                    attempt = disambiguate(
                        registeredDefinitions.get(attempt.name)!,
                        attempt
                    );
                }

                if (attempt !== null) {
                    registeredDefinitions.set(attempt.name, attempt);
                    definitions.push(attempt);
                }

                return type;
            },
        };

        container.register(Registration.instance(DesignSystemContext, context));

        container.register(...this.registrations);

        for (const def of definitions) {
            def.define();
        }

        return container;
    }
}
