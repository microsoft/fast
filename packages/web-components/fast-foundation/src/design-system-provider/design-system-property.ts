import {
    attr,
    DecoratorAttributeConfiguration,
    observable,
} from "@microsoft/fast-element";
import type { DesignSystemProvider } from "./design-system-provider";

/**
 * Configuration object for defining a {@link @microsoft/fast-foundation#DesignSystemProvider} property
 *
 * @public
 */
export interface DecoratorDesignSystemPropertyConfiguration
    extends Omit<DecoratorAttributeConfiguration, "attribute"> {
    /**
     * The HTML attribute name to map the property to - defaults to the property name.
     */
    attribute?: string | false;

    /**
     * An optional property to control the name of the css custom property being created.
     * If omitted, the css custom property will share a name with attribute if specified, otherwise the property name being decorated.
     * If assigned a false value, no css custom property will be created.
     */
    cssCustomProperty?: string | false;
    /**
     * The default value of the property. Will be assigned when the use-defaults attribute is used.
     */
    default: any;
}

/**
 * Decorator to declare a property as a design-system property.
 * Intended to be used with the {@link @microsoft/fast-foundation#DesignSystemProvider}
 * @param config - {@link DecoratorDesignSystemPropertyConfiguration}
 *
 * @public
 */
export function designSystemProperty<T extends DesignSystemProvider>(
    config: DecoratorDesignSystemPropertyConfiguration
): (source: T, property: string) => void {
    const decorator = (
        source: T,
        prop: string,
        config: DecoratorDesignSystemPropertyConfiguration
    ) => {
        const { cssCustomProperty, attribute } = config;

        if (!source.designSystemProperties) {
            source.designSystemProperties = {};
        }

        if (attribute === false) {
            observable(source, prop);
        } else {
            /**
             * Default to fromView so we don't perform un-necessary DOM writes
             */
            if (config.mode === void 0) {
                config = { ...config, mode: "fromView" };
            }

            attr(config as DecoratorAttributeConfiguration)(source, prop);
        }

        source.designSystemProperties[prop] = {
            cssCustomProperty:
                cssCustomProperty === false
                    ? false
                    : typeof cssCustomProperty === "string"
                    ? cssCustomProperty
                    : typeof attribute === "string"
                    ? attribute
                    : prop,
            default: config.default,
        };
    };

    return (source: T, prop: string) => {
        decorator(source, prop, config);
    };
}
