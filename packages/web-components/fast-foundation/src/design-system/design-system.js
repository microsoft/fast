import { FASTElementDefinition } from "@microsoft/fast-element";
import { DI, Registration } from "../di/di";
import { ComponentPresentation } from "./component-presentation";
/**
 * Design system contextual APIs and configuration usable within component
 * registries.
 * @public
 */
export const DesignSystemRegistrationContext = DI.createInterface();
const elementTypesByTag = new Map();
const elementTagsByType = new Map();
const designSystemKey = DI.createInterface(x =>
    x.cachedCallback(handler => {
        const element = document.body;
        const owned = element.$$designSystem$$;
        if (owned) {
            return owned;
        }
        return new DefaultDesignSystem(element, handler);
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
    tagFor(type) {
        return elementTagsByType.get(type);
    },
    /**
     * Searches the DOM hierarchy for the design system that is responsible
     * for the provided element.
     * @param element - The element to locate the design system for.
     * @returns The located design system.
     * @public
     */
    responsibleFor(element) {
        const owned = element.$$designSystem$$;
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
    getOrCreate(element = document.body) {
        const owned = element.$$designSystem$$;
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
class DefaultDesignSystem {
    constructor(host, container) {
        this.host = host;
        this.container = container;
        this.prefix = "fast";
        this.shadowRootMode = undefined;
        this.disambiguate = () => null;
        host.$$designSystem$$ = this;
        container.register(
            Registration.callback(DesignSystemRegistrationContext, () => this.context)
        );
    }
    withPrefix(prefix) {
        this.prefix = prefix;
        return this;
    }
    withShadowRootMode(mode) {
        this.shadowRootMode = mode;
        return this;
    }
    withElementDisambiguation(callback) {
        this.disambiguate = callback;
        return this;
    }
    register(...registrations) {
        const container = this.container;
        const elementDefinitionEntries = [];
        const disambiguate = this.disambiguate;
        const shadowRootMode = this.shadowRootMode;
        this.context = {
            elementPrefix: this.prefix,
            tryDefineElement(name, type, callback) {
                let elementName = name;
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
                    elementTypesByTag.set(elementName, type);
                    elementTagsByType.set(type, elementName);
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
class ElementDefinitionEntry {
    constructor(container, name, type, shadowRootMode, callback, willDefine) {
        this.container = container;
        this.name = name;
        this.type = type;
        this.shadowRootMode = shadowRootMode;
        this.callback = callback;
        this.willDefine = willDefine;
        this.definition = null;
    }
    definePresentation(presentation) {
        ComponentPresentation.define(this.name, presentation, this.container);
    }
    defineElement(definition) {
        this.definition = new FASTElementDefinition(
            this.type,
            Object.assign(Object.assign({}, definition), { name: this.name })
        );
    }
    tagFor(type) {
        return DesignSystem.tagFor(type);
    }
}
