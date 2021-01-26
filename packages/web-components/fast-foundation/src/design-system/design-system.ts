import {
    Constructable,
    FASTElementDefinition,
    PartialFASTElementDefinition,
} from "@microsoft/fast-element";
import { Container, DI, Registration } from "../di/di";

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
    defineElement(definition?: ContextualElementDefinition): void;
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
export const DesignSystemRegistrationContext = DI.createInterface<
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
export class DesignSystem {
    private registrations: any[] = [];
    private prefix: string = "fast";
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
        const elementDefinitionEntries: ElementDefinitionEntry[] = [];
        const disambiguate = this.disambiguate;
        const context: DesignSystemRegistrationContext = {
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

                if (elementTagsByType.has(type)) {
                    type = class extends type {};
                }

                if (elementName) {
                    elementTypesByTag.set(elementName, type);
                    elementTagsByType.set(type, elementName);
                }

                elementDefinitionEntries.push(
                    new ElementDefinitionEntry(
                        container,
                        elementName || name,
                        type,
                        callback,
                        !!elementName
                    )
                );
            },
        };

        container.register(
            Registration.instance(DesignSystemRegistrationContext, context)
        );

        container.register(...this.registrations);

        for (const entry of elementDefinitionEntries) {
            entry.callback(entry);

            if (entry.willDefine && entry.definition !== null) {
                entry.definition.define();
            }
        }

        return container;
    }
}

class ElementDefinitionEntry implements ElementDefinitionContext {
    public definition: FASTElementDefinition | null = null;

    constructor(
        public readonly container: Container,
        public readonly name: string,
        public readonly type: Constructable,
        public readonly callback: ElementDefinitionCallback,
        public readonly willDefine: boolean
    ) {}

    defineElement(definition: ContextualElementDefinition) {
        this.definition = new FASTElementDefinition(this.type, {
            ...definition,
            name: this.name,
        });
    }

    tagFor(type: Constructable): string {
        return elementTagsByType.get(type)!;
    }
}
