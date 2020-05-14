import {
    DecoratorAttributeConfiguration,
    observable,
    attr,
} from "@microsoft/fast-element";
import { DesignSystemProvider } from "./design-system-provider.js";
/**
 * Decorator to declare a property as a design-system property.
 * Accepts a config object with the following:
 *
 * default:
 * The default value of the property. Will be assigned when the use-defaults attribute is used.
 *
 * cssCustomProperty?:
 * An optional property to control the name of the css custom property being created.
 * If omitted, the css custom property will share a name with the decorated property name.
 * If assigned a false value, no css custom property will be created.
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

export interface DecoratorDesignSystemPropertyConfiguration
    extends Omit<DecoratorAttributeConfiguration, "attribute"> {
    attribute?: string | false;
    cssCustomProperty?: string | false;
    default: any;
}

export type DesignSystemPropertyDeclarationConfig = Pick<
    DecoratorDesignSystemPropertyConfiguration,
    "cssCustomProperty" | "default"
>;
