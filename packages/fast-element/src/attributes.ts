import { Observable } from "./observation/observable";

export interface ValueConverter {
    toView(value: any): string | null;
    fromView(value: string): any;
}

export type AttributeMode = "reflect" | "boolean" | "fromView";

export type AttributeConfiguration = {
    property: string;
    attribute?: string;
    mode?: AttributeMode;
    converter?: ValueConverter;
};

export type DecoratorAttributeConfiguration = Omit<AttributeConfiguration, "property">;

export const booleanConverter: ValueConverter = {
    toView(value: any): string {
        return value ? "true" : "false";
    },

    fromView(value: any): any {
        if (
            value === null ||
            value === void 0 ||
            value === "false" ||
            value === false ||
            value === 0
        ) {
            return false;
        }

        return true;
    },
};

export const nullableNumberConverter: ValueConverter = {
    toView(value: any): string | null {
        if (value === null || value === undefined) {
            return null;
        }
        let number = value * 1;
        return isNaN(number) ? null : number.toString();
    },

    fromView(value: any): any {
        if (value === null || value === undefined) {
            return null;
        }
        let number = value * 1;
        return isNaN(number) ? null : number;
    },
};

export class AttributeDefinition {
    private readonly fieldName: string;
    private readonly callbackName: string;
    private readonly hasCallback: boolean;
    private readonly guards = new Set();

    public constructor(
        public readonly Owner: Function,
        public readonly property: string,
        public readonly attribute: string = property.toLowerCase(),
        public readonly mode: AttributeMode = "reflect",
        public readonly converter?: ValueConverter
    ) {
        this.fieldName = `_${property}`;
        this.callbackName = `${property}Changed`;
        this.hasCallback = this.callbackName in Owner.prototype;

        if (mode === "boolean" && converter === void 0) {
            this.converter = booleanConverter;
        }
    }

    public setValue(object: any, newValue: any) {
        const oldValue = object[this.fieldName];
        const converter = this.converter;

        if (converter !== void 0) {
            newValue = converter.fromView(newValue);
        }

        if (oldValue !== newValue) {
            object[this.fieldName] = newValue;

            this.tryReflectToAttribute(object, newValue, converter);

            if (this.hasCallback) {
                object[this.callbackName](oldValue, newValue);
            }

            Observable.notify(object, this.property);
        }
    }

    public getValue(object: any): any {
        Observable.track(object, this.property);
        return object[this.fieldName];
    }

    public onAttributeChangedCallback(object: any, value: any) {
        if (this.guards.has(object)) {
            return;
        }

        this.guards.add(object);
        this.setValue(object, value);
        this.guards.delete(object);
    }

    private tryReflectToAttribute(
        object: any,
        newValue: any,
        converter?: ValueConverter
    ) {
        const mode = this.mode;

        if (this.guards.has(object) || mode === "fromView") {
            return;
        }

        this.guards.add(object);

        switch (mode) {
            case "reflect":
                if (converter !== void 0) {
                    newValue = converter.toView(newValue);
                }

                (object as HTMLElement).setAttribute(this.attribute, newValue);
                break;
            case "boolean":
                newValue
                    ? (object as HTMLElement).setAttribute(this.attribute, "")
                    : (object as HTMLElement).removeAttribute(this.attribute);
                break;
        }

        this.guards.delete(object);
    }

    public static collect(
        Owner: Function,
        ...attributeLists: (ReadonlyArray<string | AttributeConfiguration> | undefined)[]
    ): ReadonlyArray<AttributeDefinition> {
        const attributes: AttributeDefinition[] = [];

        attributeLists.push((Owner as any).attributes);

        for (let i = 0, ii = attributeLists.length; i < ii; ++i) {
            const list = attributeLists[i];

            if (list === void 0) {
                continue;
            }

            for (let j = 0, jj = list.length; j < jj; ++j) {
                const config = list[j];

                if (typeof config === "string") {
                    attributes.push(new AttributeDefinition(Owner, config));
                } else {
                    attributes.push(
                        new AttributeDefinition(
                            Owner,
                            config.property,
                            config.attribute,
                            config.mode,
                            config.converter
                        )
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
