import { Accessor, Observable } from "./observation/observable.js";
import { DOM } from "./dom.js";
import { Notifier } from "./observation/notifier.js";

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
        const number: number = value * 1;
        return isNaN(number) ? null : number.toString();
    },

    fromView(value: any): any {
        if (value === null || value === undefined) {
            return null;
        }
        const number: number = value * 1;
        return isNaN(number) ? null : number;
    },
};

export class AttributeDefinition implements Accessor {
    private readonly fieldName: string;
    private readonly callbackName: string;
    private readonly hasCallback: boolean;
    private readonly guards: Set<unknown> = new Set();

    public constructor(
        public readonly Owner: Function,
        public readonly name: string,
        public readonly attribute: string = name.toLowerCase(),
        public readonly mode: AttributeMode = "reflect",
        public readonly converter?: ValueConverter
    ) {
        this.fieldName = `_${name}`;
        this.callbackName = `${name}Changed`;
        this.hasCallback = this.callbackName in Owner.prototype;

        if (mode === "boolean" && converter === void 0) {
            this.converter = booleanConverter;
        }
    }

    public setValue(source: HTMLElement, newValue: any): void {
        const oldValue = source[this.fieldName];
        const converter = this.converter;

        if (converter !== void 0) {
            newValue = converter.fromView(newValue);
        }

        if (oldValue !== newValue) {
            source[this.fieldName] = newValue;

            this.tryReflectToAttribute(source);

            if (this.hasCallback) {
                source[this.callbackName](oldValue, newValue);
            }

            ((source as any).$fastController as Notifier).notify(this.name);
        }
    }

    public getValue(source: HTMLElement): any {
        Observable.track(source, this.name);
        return source[this.fieldName];
    }

    public onAttributeChangedCallback(element: HTMLElement, value: any): void {
        if (this.guards.has(element)) {
            return;
        }

        this.guards.add(element);
        this.setValue(element, value);
        this.guards.delete(element);
    }

    private tryReflectToAttribute(element: HTMLElement): void {
        const mode = this.mode;
        const guards = this.guards;

        if (guards.has(element) || mode === "fromView") {
            return;
        }

        DOM.queueUpdate(() => {
            guards.add(element);

            const latestValue = element[this.fieldName];

            switch (mode) {
                case "reflect":
                    const converter = this.converter;
                    DOM.setAttribute(
                        element,
                        this.attribute,
                        converter !== void 0 ? converter.toView(latestValue) : latestValue
                    );
                    break;
                case "boolean":
                    DOM.setBooleanAttribute(element, this.attribute, latestValue);
                    break;
            }

            guards.delete(element);
        });
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
