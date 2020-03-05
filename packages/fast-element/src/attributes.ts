export type AttributeConfiguration = {
    property: string;
    attribute?: string;
};

export type DecoratorAttributeConfiguration = Omit<AttributeConfiguration, "property">;

export class AttributeDefinition {
    public constructor(
        public readonly property: string,
        public readonly attribute: string = property.toLowerCase()
    ) {}

    public static collect(
        ...attributeLists: (ReadonlyArray<string | AttributeConfiguration> | undefined)[]
    ): ReadonlyArray<AttributeDefinition> {
        const attributes: AttributeDefinition[] = [];

        for (let i = 0, ii = attributeLists.length; i < ii; ++i) {
            const list = attributeLists[i];

            if (list === void 0) {
                continue;
            }

            for (let j = 0, jj = list.length; j < jj; ++j) {
                const config = list[j];

                if (typeof config === "string") {
                    attributes.push(new AttributeDefinition(config));
                } else {
                    attributes.push(
                        new AttributeDefinition(config.property, config.attribute)
                    );
                }
            }
        }

        return attributes;
    }
}

/**
 * Decorator: Specifies an HTML attribute.
 *
 * @param config - The overrides
 */
export function attr(
    config?: DecoratorAttributeConfiguration
): (target: {}, property: string) => void;

/**
 * Decorator: Specifies an HTML attribute.
 *
 * @param target - The class
 * @param prop - The property name
 */
export function attr(target: {}, prop: string): void;
export function attr(
    configOrTarget?: DecoratorAttributeConfiguration | {},
    prop?: string
): void | ((target: {}, property: string) => void) {
    let config: AttributeConfiguration;

    function decorator($target: {}, $prop: string): void {
        if (arguments.length > 1) {
            // Non invocation:
            // - @attr
            // Invocation with or w/o opts:
            // - @attr()
            // - @attr({...opts})
            config.property = $prop;
        }

        const attributes: AttributeConfiguration[] =
            ($target.constructor as any).attributes ||
            (($target.constructor as any).attributes = []);

        attributes.push(config);
    }

    if (arguments.length > 1) {
        // Non invocation:
        // - @attr
        config = {} as any;
        decorator(configOrTarget!, prop!);
        return;
    }

    // Invocation with or w/o opts:
    // - @attr()
    // - @attr({...opts})
    config = configOrTarget === void 0 ? ({} as any) : configOrTarget;
    return decorator;
}
