import {
    ElementStyles,
    ElementViewTemplate,
    FASTElement,
    PartialFASTElementDefinition,
} from "@microsoft/fast-element";
import { DesignTokens, FASTDesignTokenLibrary } from "../design-tokens";
import { DI, InterfaceSymbol, Key, Registration } from "../di";
import { DesignTokenRegistration } from "../design-tokens/configuration";
import { FASTCustomPropertyManager } from "../css-custom-property-manager";
import { supportsAdoptedStylesheets } from "../feature-detection";

export interface ConfigurationOptions {
    /**
     * Element tagname prefix
     */
    prefix?: string;
}

export interface ComponentConfiguration extends ConfigurationOptions {
    /**
     * The non-prefixed name of the component.
     */
    baseName: string;

    /**
     * The element constructor
     */
    type: typeof FASTElement;

    /**
     * The default template to use for the component.
     */
    template?: ElementViewTemplate;

    /**
     * The default styles to use for the component.
     */
    styles?: ElementStyles;
}

export interface ConfigurationRegistry {
    register(config: Configuration): void;
}

export interface Configuration {
    /**
     * The tag name prefix with which Custom Elements are defined.
     */
    readonly prefix: string;

    /**
     * Registers and defines a custom element
     * @param type The custom element constructor
     * @param definition custom element definition metadata
     */
    registerElement(
        type: typeof FASTElement,
        definition: PartialFASTElementDefinition
    ): Configuration;

    /**
     * Sets the default template for an element.
     * @param baseName The non-prefixed element tag-name.
     * @param template The template to set as the default template.
     */
    setDefaultTemplateFor(
        baseName: string,
        template: ElementViewTemplate | null
    ): Configuration;

    /**
     * Gets the template for an element, or null.
     * @param baseName The non-prefixed element tag-name.
     */
    getDefaultTemplateFor(baseName: string): ElementViewTemplate | null;

    /**
     * Sets the default styles for an element.
     * @param baseName The non-prefixed element tag-name.
     * @param styles The styles to set as the default styles.
     */
    setDefaultStylesFor(baseName: string, styles: ElementStyles | null): Configuration;

    /**
     * Gets the styles for an element, or null.
     * @param baseName The non-prefixed element tag-name.
     */
    getDefaultStylesFor(baseName: string): ElementStyles | null;

    /**
     * Register a design token for the applicaiton.
     * @param registration The token registration
     */
    registerDesignToken<T>(registration: DesignTokenRegistration<T>): Configuration;

    /**
     *
     * @param registrations Registers registries with the Configuration
     */
    register(...registrations: ConfigurationRegistry[]): Configuration;
}

/**
 * Prepends the prefix to the base in spinal case.
 * @param prefix the prefix string
 * @param base the base string
 */
export function prefix(prefix: string, base: string) {
    return `${prefix}-${base}`;
}

/**
 * Removes any spinal-case prefix from a string
 * @param name The name from which to remove a prefix
 */
export function unprefix(name: string) {
    return name.substr(name.indexOf("-") + 1);
}

/**
 * App configuration for defining Custom Elements,
 * associating default styles and templates to elements,
 * and defining Design Tokens.
 *
 * TODO:
 * - refactor to support browsers that don't support adoptedStyleSheets
 */
export class ConfigurationImpl implements Configuration {
    private designTokens = new FASTDesignTokenLibrary<any>();
    private customPropertyManager = new FASTCustomPropertyManager();
    private customPropertySheet = new CSSStyleSheet();
    private designTokenTarget: CSSStyleRule;

    constructor(options: ConfigurationOptions = {}) {
        this.prefix = options.prefix || "fast";

        DI.getOrCreateDOMContainer().register(
            Registration.instance(ConfigurationInterface, this),
            Registration.instance(DesignTokens, this.designTokens),
            Registration.instance(FASTCustomPropertyManager, this.customPropertyManager)
        );

        this.designTokenTarget = this.customPropertySheet[
            this.customPropertySheet.insertRule(":root{}")
        ];
    }

    /**
     * Builds a component registration object to be registered to a {@link Configuration}
     * @param defaultElementConfiguration
     */
    public static forComponent(defaultElementConfiguration: ComponentConfiguration) {
        return (
            elementConfiguration: Partial<Omit<ComponentConfiguration, "type">> = {}
        ): ConfigurationRegistry => {
            return {
                register(configuration: Configuration) {
                    const conf = {
                        ...defaultElementConfiguration,
                        ...elementConfiguration,
                    };
                    const definition = {
                        name: prefix(conf.prefix || configuration.prefix, conf.baseName),
                    };

                    configuration
                        .setDefaultTemplateFor(conf.baseName, conf.template || null)
                        .setDefaultStylesFor(conf.baseName, conf.styles || null)
                        .registerElement(defaultElementConfiguration.type, definition);
                },
            };
        };
    }

    /** {@inheritdoc Configuration.prefix} */
    public readonly prefix: string;

    /** {@inheritdoc Configuration.registerElement} */
    public registerElement(
        type: typeof FASTElement,
        definition: PartialFASTElementDefinition
    ): this {
        this.elementRegistry.set(type, definition);
        FASTElement.define(type, definition);

        return this;
    }

    /** {@inheritdoc Configuration.setDefaultTemplateFor} */
    public setDefaultTemplateFor(name: string, template: ElementViewTemplate | null) {
        this.templateRegistry.set(name, template);
        return this;
    }

    /** {@inheritdoc Configuration.getDefaultTemplateFor} */
    public getDefaultTemplateFor(name: string): ElementViewTemplate | null {
        return this.templateRegistry.get(name) || null;
    }

    /** {@inheritdoc Configuration.setDefaultStylesFor} */
    public setDefaultStylesFor(name: string, styles: ElementStyles | null) {
        this.stylesRegistry.set(name, styles);
        return this;
    }

    /** {@inheritdoc Configuration.getDefaultStylesFor}*/
    public getDefaultStylesFor(name: string): ElementStyles | null {
        return this.stylesRegistry.get(name) || null;
    }

    /** {@inheritdoc Configuration.register} */
    public register(...registrations: ConfigurationRegistry[]) {
        registrations.forEach(x => x.register(this));
        return this;
    }

    /** {@inheritdoc Configuration.registerDesignToken} */
    public registerDesignToken<T>(registration: DesignTokenRegistration<T>) {
        const { key, value, customProperty } = registration;
        this.designTokenRegistry.set(key, registration);

        if (value) {
            this.designTokens.set(key, value);
        }

        if (customProperty) {
            if (key !== customProperty) {
                this.customPropertyManager.alias(key, customProperty);
            }

            if (value) {
                this.designTokenTarget.style.setProperty(
                    this.customPropertyManager.name(key),
                    value as any
                );
            }
        }

        return this;
    }

    /**
     * Attaches DesignTokens to a document.
     *
     * @param doc - the document object to attach DesignTokens to
     */
    public attachDesignTokensTo(doc: Document) {
        if (
            supportsAdoptedStylesheets(doc) &&
            doc.adoptedStyleSheets.indexOf(this.customPropertySheet) == -(-1)
        ) {
            doc.adoptedStyleSheets = [
                ...doc.adoptedStyleSheets,
                this.customPropertySheet,
            ];
        }
    }

    private templateRegistry = new Map<string, ElementViewTemplate | null>();
    private stylesRegistry = new Map<string, ElementStyles | null>();
    private elementRegistry = new Map<typeof FASTElement, PartialFASTElementDefinition>();
    private designTokenRegistry = new Map<string, DesignTokenRegistration<any>>();
}

export const ConfigurationInterface: InterfaceSymbol<Key, any> = DI.createInterface(
    "Configuration"
).noDefault();
