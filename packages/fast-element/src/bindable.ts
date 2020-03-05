import { Constructable } from "./interfaces";

export type PartialBindableDefinition = {
    attribute?: string;
    property?: string;
};

type Omit<T, K extends keyof any> = Pick<T, Exclude<keyof T, K>>;
export type PartialBindableDefinitionPropertyOmitted = Omit<
    PartialBindableDefinition,
    "property"
>;

export class BindableDefinition {
    public constructor(
        public readonly attribute: string,
        public readonly property: string
    ) {}

    public static create(
        prop: string,
        def: PartialBindableDefinition = {}
    ): BindableDefinition {
        return new BindableDefinition(
            def.attribute || prop.toLowerCase(),
            def.property || prop
        );
    }
}

// eslint-disable-next-line @typescript-eslint/unbound-method
const isArray = Array.isArray as <T>(arg: unknown) => arg is ReadonlyArray<T>;

export const Bindable = {
    from(
        ...bindableLists: (
            | BindableDefinition
            | Record<string, PartialBindableDefinition>
            | ReadonlyArray<string>
            | undefined)[]
    ): Record<string, BindableDefinition> {
        const bindables: Record<string, BindableDefinition> = {};

        function addName(name: string): void {
            bindables[name] = BindableDefinition.create(name);
        }

        function addDescription(name: string, def: PartialBindableDefinition): void {
            bindables[name] =
                def instanceof BindableDefinition
                    ? def
                    : BindableDefinition.create(name, def);
        }

        function addList(
            maybeList:
                | BindableDefinition
                | Record<string, PartialBindableDefinition>
                | ReadonlyArray<string>
                | undefined
        ): void {
            if (isArray(maybeList)) {
                maybeList.forEach(addName);
            } else if (maybeList instanceof BindableDefinition) {
                bindables[maybeList.property] = maybeList;
            } else if (maybeList !== void 0) {
                Object.keys(maybeList).forEach(name =>
                    addDescription(name, maybeList[name])
                );
            }
        }

        bindableLists.forEach(addList);

        return bindables;
    },
};

/**
 * Decorator: Specifies custom behavior for a bindable property.
 *
 * @param config - The overrides
 */
export function bindable(
    config?: PartialBindableDefinitionPropertyOmitted
): (target: {}, property: string) => void;

/**
 * Decorator: Specifies a bindable property on a class.
 *
 * @param prop - The property name
 */
export function bindable(prop: string): (target: Constructable) => void;

/**
 * Decorator: Specifies a bindable property on a class.
 *
 * @param target - The class
 * @param prop - The property name
 */
export function bindable(target: {}, prop: string): void;
export function bindable(
    configOrTarget?: PartialBindableDefinition | {},
    prop?: string
): void | ((target: {}, property: string) => void) | ((target: Constructable) => void) {
    let config: PartialBindableDefinition;

    function decorator($target: {}, $prop: string): void {
        if (arguments.length > 1) {
            // Non invocation:
            // - @bindable
            // Invocation with or w/o opts:
            // - @bindable()
            // - @bindable({...opts})
            config.property = $prop;
        }

        const bindables =
            ($target.constructor as any).bindables ||
            (($target.constructor as any).bindables = {});
        bindables[$prop] = config;
    }

    if (arguments.length > 1) {
        // Non invocation:
        // - @bindable
        config = {};
        decorator(configOrTarget!, prop!);
        return;
    } else if (typeof configOrTarget === "string") {
        // ClassDecorator
        // - @bindable('bar')
        // Direct call:
        // - @bindable('bar')(Foo)
        config = {};
        return decorator;
    }

    // Invocation with or w/o opts:
    // - @bindable()
    // - @bindable({...opts})
    config = configOrTarget === void 0 ? {} : configOrTarget;
    return decorator;
}

export const attr = bindable;
