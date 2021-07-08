import {
    Constructable,
    FASTElementDefinition,
    PartialFASTElementDefinition,
} from "@microsoft/fast-element";
import { Container, DI, InterfaceSymbol, Registration } from "../di/di";
import { ComponentPresentation } from "./component-presentation";

/**
 * Enables defining an element within the context of a design system.
 * @public
 */
export type ContextualElementDefinition = Omit<PartialFASTElementDefinition, "name">;

/**
 * The design system context in which an element can be defined.
 * @public
 */
export interface ElementDefinitionContext {
    /**
     * The name that the element will be defined as.
     * @public
     */
    readonly name: string;

    /**
     * The type that will be defined.
     * @public
     */
    readonly type: Constructable;

    /**
     * The dependency injection container associated with the design system.
     * @public
     */
    readonly container: Container;

    /**
     * Indicates whether or not a platform define call will be made in order
     * to define the element.
     * @public
     */
    readonly willDefine: boolean;

    /**
     * The shadow root mode specified by the design system's configuration.
     * @public
     */
    readonly shadowRootMode: ShadowRootMode | undefined;

    /**
     * Defines the element.
     * @param definition - The definition for the element.
     * @public
     */
    defineElement(definition?: ContextualElementDefinition): void;

    /**
     * Defines a presentation for the element.
     * @param presentation - The presentation configuration.
     * @public
     */
    definePresentation(presentation: ComponentPresentation): void;

    /**
     * Returns the HTML element tag name that the type will be defined as.
     * @param type - The type to lookup.
     * @public
     */
    tagFor(type: Constructable): string;
}

/**
 * The callback type that is invoked when an element can be defined by a design system.
 * @public
 */
export type ElementDefinitionCallback = (ctx: ElementDefinitionContext) => void;

interface ElementDefinitionParams
    extends Pick<ElementDefinitionContext, "name" | "type"> {
    baseClass?: Constructable;
    callback: ElementDefinitionCallback;
}

/**
 * Design system contextual APIs and configuration usable within component
 * registries.
 * @public
 */
export interface DesignSystemRegistrationContext {
    /**
     * The element prefix specified by the design system's configuration.
     * @public
     */
    readonly elementPrefix: string;

    /**
     * Used to attempt to define a custom element.
     * @param name - The name of the element to define.
     * @param type - The type of the constructor to use to define the element.
     * @param callback - A callback to invoke if definition will happen.
     * @public
     */
    tryDefineElement(ctx: ElementDefinitionParams);
}

/**
 * Design system contextual APIs and configuration usable within component
 * registries.
 * @public
 */
export const DesignSystemRegistrationContext: InterfaceSymbol<DesignSystemRegistrationContext> = DI.createInterface<
    DesignSystemRegistrationContext
>();

/**
 * The callback type that is invoked when two elements are trying to define themselves with
 * the same name.
 * @public
 */
export type ElementDisambiguationCallback = (
    nameAttempt: string,
    typeAttempt: Constructable,
    existingType: Constructable
) => string | null;

const elementTypesByTag = new Map<string, Constructable>();
const elementTagsByType = new Map<Constructable, string>();

/**
 * Represents a configurable design system.
 * @public
 */
export interface DesignSystem {
    /**
     * Registers components and services with the design system and the
     * underlying dependency injection container.
     * @param params - The registries to pass to the design system
     * and the underlying dependency injection container.
     * @public
     */
    register(...params: any[]): DesignSystem;

    /**
     * Configures the prefix to add to each custom element name.
     * @param prefix - The prefix to use for custom elements.
     * @public
     */
    withPrefix(prefix: string): DesignSystem;

    /**
     * Overrides the default Shadow DOM mode for custom elements.
     * @param mode - The Shadow DOM mode to use for custom elements.
     * @public
     */
    withShadowRootMode(mode: ShadowRootMode): DesignSystem;

    /**
     * Provides a custom callback capable of resolving scenarios where
     * two different elements request the same element name.
     * @param callback - The disambiguation callback.
     * @public
     */
    withElementDisambiguation(callback: ElementDisambiguationCallback): DesignSystem;
}

const designSystemKey = DI.createInterface<DesignSystem>(x =>
    x.cachedCallback(handler => {
        const element = document.body as any;
        const owned = element.$$designSystem$$ as DesignSystem;

        if (owned) {
            return owned;
        }

        return (new DefaultDesignSystem(element, handler) as any) as DesignSystem;
    })
);

/**
 * An API gateway to design system features.
 * @public
 */
export const DesignSystem = Object.freeze({
    /**
     * Returns the HTML element name that the type is defined as.
     * @param type - The type to lookup.
     * @public
     */
    tagFor(type: Constructable): string {
        return elementTagsByType.get(type)!;
    },

    /**
     * Searches the DOM hierarchy for the design system that is responsible
     * for the provided element.
     * @param element - The element to locate the design system for.
     * @returns The located design system.
     * @public
     */
    responsibleFor(element: HTMLElement): DesignSystem {
        const owned = (element as any).$$designSystem$$ as DesignSystem;

        if (owned) {
            return owned;
        }

        const container = DI.findResponsibleContainer(element);
        return container.get(designSystemKey);
    },

    /**
     * Gets the DesignSystem if one is explicitly defined on the provided element;
     * otherwise creates a design system defined directly on the element.
     * @param element - The element to get or create a design system for.
     * @returns The design system.
     * @public
     */
    getOrCreate(element: HTMLElement = document.body): DesignSystem {
        const owned = (element as any).$$designSystem$$ as DesignSystem;

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
        (host as any).$$designSystem$$ = this;

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
            tryDefineElement(ctx: ElementDefinitionParams) {
                const { name, baseClass, callback } = ctx;
                let { type } = ctx;
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
                    if (baseClass) {
                        elementTagsByType.set(baseClass, elementName!);
                    }
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
