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
    config: DesignSystemPropertyDeclarationConfig
): (source: T, property: string) => void {
    const decorator = (
        source: T,
        prop: string,
        config: DesignSystemPropertyDeclarationConfig
    ) => {
        if (!source.designSystemProperties) {
            source.designSystemProperties = {};
        }

        source.designSystemProperties[prop] = {
            cssCustomProperty:
                config.cssCustomProperty === void 0 ? prop : config.cssCustomProperty,
            default: config.default,
        };
    };

    return (source: T, prop: string) => {
        decorator(source, prop, config);
    };
}

export interface DesignSystemPropertyDeclarationConfig {
    cssCustomProperty?: string | false;
    default: any;
}
