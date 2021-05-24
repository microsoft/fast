import {
    Constructable,
    FASTElementDefinition,
    PartialFASTElementDefinition,
} from "@microsoft/fast-element";
import { Container, DI, InterfaceSymbol, Registration } from "../di/di";
import { ComponentPresentation } from "./component-presentation";

/**
 * Defines an element within the context of a design system.
 * @alpha
 */
export type ContextualElementDefinition = Omit<PartialFASTElementDefinition, "name">;

/**
 * The design system context in which an element can be defined.
 * @alpha
 */
export interface ElementDefinitionContext {
    readonly name: string;
    readonly type: Constructable;
    readonly container: Container;
    readonly willDefine: boolean;
    readonly shadowRootMode: ShadowRootMode | undefined;
    defineElement(definition?: ContextualElementDefinition): void;
    definePresentation(presentation: ComponentPresentation): void;
    tagFor(type: Constructable): string;
}

/**
 * The callback type that is invoked when an element can be defined by a design system.
 * @alpha
 */
export type ElementDefinitionCallback = (ctx: ElementDefinitionContext) => void;

/**
 * Design system contextual APIs and configuration usable within component
 * registries.
 * @alpha
 */
export interface DesignSystemRegistrationContext {
    readonly elementPrefix: string;
    tryDefineElement(
        name: string,
        type: Constructable,
        callback: ElementDefinitionCallback
    );
}

/**
 * @alpha
 */
export const DesignSystemRegistrationContext: InterfaceSymbol<DesignSystemRegistrationContext> = DI.createInterface<
    DesignSystemRegistrationContext
>();

/**
 * The callback type that is invoked when two elements are trying to define themselves with
 * the same name.
 * @alpha
 */
export type ElementDisambiguationCallback = (
    nameAttempt: string,
    typeAttempt: Constructable,
    existingType: Constructable
) => string | null;

const elementTypesByTag = new Map<string, Constructable>();
const elementTagsByType = new Map<Constructable, string>();

/**
 * @alpha
 */
export interface DesignSystem {
    register(...params: any[]): DesignSystem;
    withPrefix(prefix: string): DesignSystem;
    withShadowRootMode(mode: ShadowRootMode): DesignSystem;
    withElementDisambiguation(callback: ElementDisambiguationCallback): DesignSystem;
}

const designSystemKey = DI.createInterface<DesignSystem>(x =>
    x.cachedCallback(handler => {
        const element = document.body as any;
        const owned = element.$designSystem as DesignSystem;

        if (owned) {
            return owned;
        }

        return (new DefaultDesignSystem(element, handler) as any) as DesignSystem;
    })
);

/**
 * @alpha
 */
export const DesignSystem = Object.freeze({
    tagFor(type: Constructable): string {
        return elementTagsByType.get(type)!;
    },

    responsibleFor(element: HTMLElement): DesignSystem {
        const owned = (element as any).$designSystem as DesignSystem;

        if (owned) {
            return owned;
        }

        const container = DI.findResponsibleContainer(element);
        return container.get(designSystemKey);
    },

    getOrCreate(element: HTMLElement = document.body): DesignSystem {
        const owned = (element as any).$designSystem as DesignSystem;

        if (owned) {
            return owned;
        }

        const container = DI.getOrCreateDOMContainer(element);

        if (!container.has(designSystemKey, false)) {
            container.register(
                Registration.instance(
                    designSystemKey,
                    new DefaultDesignSystem(element, container)
                )
            );
        }

        return container.get(designSystemKey);
    },
});

class DefaultDesignSystem implements DesignSystem {
    private prefix: string = "fast";
    private shadowRootMode: ShadowRootMode | undefined = undefined;
    private disambiguate: ElementDisambiguationCallback = () => null;
    private context: DesignSystemRegistrationContext;

    constructor(private host: HTMLElement, private container: Container) {
        (host as any).$designSystem = this;

        container.register(
            Registration.callback(DesignSystemRegistrationContext, () => this.context)
        );
    }

    public withPrefix(prefix: string): DesignSystem {
        this.prefix = prefix;
        return this;
    }

    public withShadowRootMode(mode: ShadowRootMode): DesignSystem {
        this.shadowRootMode = mode;
        return this;
    }

    public withElementDisambiguation(
        callback: ElementDisambiguationCallback
    ): DesignSystem {
        this.disambiguate = callback;
        return this;
    }

    public register(...registrations: any[]): DesignSystem {
        const container = this.container;
        const elementDefinitionEntries: ElementDefinitionEntry[] = [];
        const disambiguate = this.disambiguate;
        const shadowRootMode = this.shadowRootMode;

        this.context = {
            elementPrefix: this.prefix,
            tryDefineElement(
                name: string,
                type: Constructable,
                callback: ElementDefinitionCallback
            ) {
                let elementName: string | null = name;
                let foundByName = elementTypesByTag.get(elementName);

                while (foundByName && elementName) {
                    elementName = disambiguate(elementName, type, foundByName);

                    if (elementName) {
                        foundByName = elementTypesByTag.get(elementName);
                    }
                }

                const willDefine = !!elementName;

                if (willDefine) {
                    if (elementTagsByType.has(type)) {
                        type = class extends type {};
                    }

                    elementTypesByTag.set(elementName!, type);
                    elementTagsByType.set(type, elementName!);
                }

                elementDefinitionEntries.push(
                    new ElementDefinitionEntry(
                        container,
                        elementName || name,
                        type,
                        shadowRootMode,
                        callback,
                        willDefine
                    )
                );
            },
        };

        container.register(...registrations);

        for (const entry of elementDefinitionEntries) {
            entry.callback(entry);

            if (entry.willDefine && entry.definition !== null) {
                entry.definition.define();
            }
        }

        return this;
    }
}

class ElementDefinitionEntry implements ElementDefinitionContext {
    public definition: FASTElementDefinition | null = null;

    constructor(
        public readonly container: Container,
        public readonly name: string,
        public readonly type: Constructable,
        public shadowRootMode: ShadowRootMode | undefined,
        public readonly callback: ElementDefinitionCallback,
        public readonly willDefine: boolean
    ) {}

    definePresentation(presentation: ComponentPresentation) {
        ComponentPresentation.define(this.name, presentation, this.container);
    }

    defineElement(definition: ContextualElementDefinition) {
        this.definition = new FASTElementDefinition(this.type, {
            ...definition,
            name: this.name,
        });
    }

    tagFor(type: Constructable): string {
        return DesignSystem.tagFor(type)!;
    }
}
