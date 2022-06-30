import type ReactModule from "react";
import {
    Constructable,
    FASTElementDefinition,
    Observable,
} from "@microsoft/fast-element";

const reservedReactProperties = new Set([
    "children",
    "localName",
    "ref",
    "style",
    "className",
]);

const emptyProps = Object.freeze(Object.create(null));
const DEFAULT_CACHE_NAME = "_default";
// This will be a two levels cache Map<type, Map<name, ReactWrapper>>
// to distinguish components of same type but different tag name.
// Default name: '_default'
const wrappersCache = new Map<any, Map<string, any>>();

/**
 * Event signatures for a React wrapper.
 * @public
 */
export type ReactEvents<T> = {
    [P in keyof T]?: (e: Event) => unknown;
};

/**
 * Maps React event names to DOM event types for special handling.
 * @public
 */
export type ReactEventMap<T> = {
    [P in keyof T]: string;
};

/**
 * Optional configuration for the React wrapper.
 * @public
 */
export type ReactWrapperConfig<TEvents> = {
    /**
     * The tag that the React component will generate.
     */
    name?: string;
    /**
     * A mapping of React event name to DOM event type to be handled
     * by attaching event listeners to the underlying web component.
     * @remarks
     * Typically only needed for non-FAST web components.
     */
    events?: ReactEventMap<TEvents>;
    /**
     * A list of properties to be handled directly by the wrapper.
     * @remarks
     * Typically only needed for vanilla web components.
     */
    properties?: string[];
};

/**
 * The props used by a ReactWrapper.
 * @public
 */
export type ReactWrapperProps<
    TElement extends HTMLElement,
    TEvents
> = ReactModule.PropsWithChildren<
    ReactModule.PropsWithRef<
        Partial<Omit<TElement, "children" | "style">> &
            ReactEvents<TEvents> &
            ReactModule.HTMLAttributes<HTMLElement>
    > & { style?: ReactModule.CSSProperties }
>;

/**
 * A React component that wraps a Web Component.
 * @public
 */
export type ReactWrapper<TElement extends HTMLElement, TEvents> = Constructable<
    ReactModule.Component<ReactWrapperProps<TElement, TEvents>>
>;

// There are 2 kinds of refs and there's no built in React API to set one.
function setRef(ref: React.Ref<unknown>, value: Element | null) {
    if (typeof ref === "function") {
        (ref as (e: Element | null) => void)(value);
    } else {
        (ref as { current: Element | null }).current = value;
    }
}

function getTagName<TElement, TEvents>(
    type: Constructable<TElement>,
    config: ReactWrapperConfig<TEvents>
) {
    if (!config.name) {
        /* eslint-disable-next-line @typescript-eslint/no-non-null-assertion */
        const definition = FASTElementDefinition.getByType(type)!;

        if (definition) {
            config.name = definition.name;
        } else {
            throw new Error(
                "React wrappers must wrap a FASTElement or be configured with a name."
            );
        }
    }

    return config.name;
}

function getElementEvents<TEvents>(config: ReactWrapperConfig<TEvents>) {
    return config.events || (config.events = {} as ReactEventMap<TEvents>);
}

function keyIsValid<TElement, TEvents>(
    type: Constructable<TElement>,
    config: ReactWrapperConfig<TEvents>,
    name: string
): boolean {
    if (reservedReactProperties.has(name)) {
        console.warn(
            `${getTagName(type, config)} contains property ${name} which is a React ` +
                `reserved property. It will be used by React and not set on ` +
                `the element.`
        );

        return false;
    }

    return true;
}

function getElementKeys<TElement, TEvents>(
    type: Constructable<TElement>,
    config: ReactWrapperConfig<TEvents>
) {
    if (!(config as any).keys) {
        if (config.properties) {
            (config as any).keys = new Set(
                config.properties.concat(Object.keys(getElementEvents(config)))
            );
        } else {
            const keys = new Set(Object.keys(getElementEvents(config)));
            const accessors = Observable.getAccessors(type.prototype);

            if (accessors.length > 0) {
                for (const a of accessors) {
                    if (keyIsValid(type, config, a.name)) {
                        keys.add(a.name);
                    }
                }
            } else {
                for (const p in type.prototype) {
                    if (!(p in HTMLElement.prototype) && keyIsValid(type, config, p)) {
                        keys.add(p);
                    }
                }
            }

            (config as any).keys = keys;
        }
    }

    return (config as any).keys;
}

/**
 * @param React - The React module, typically imported from the `react` npm
 * package
 * @param registry - The custom elements registry to register components in if wrapped by definition.
 * @public
 */
export function reactWrapper(
    React: any,
    registry: CustomElementRegistry = customElements
) {
    /**
     * Creates a React component for a custom element. Properties are distinguished
     * from attributes automatically, and events can be configured so they are
     * added to the custom element as event listeners.
     *
     * @param type - The custom element class to wrap or a FASTElementDefinition object.
     * @param config - Special configuration for the wrapper.
     */
    function wrap<TElement extends HTMLElement, TEvents>(
        def: FASTElementDefinition<Constructable<TElement>>,
        config?: ReactWrapperConfig<TEvents>
    ): ReactWrapper<TElement, TEvents>;
    function wrap<TElement extends HTMLElement, TEvents>(
        type: Constructable<TElement>,
        config?: ReactWrapperConfig<TEvents>
    ): ReactWrapper<TElement, TEvents>;
    function wrap<TElement extends HTMLElement, TEvents>(
        type: any,
        config: ReactWrapperConfig<TEvents> = {}
    ): ReactWrapper<TElement, TEvents> {
        // Props used by this component wrapper. This is the ComponentProps and the
        // special `__forwardedRef` property. Note, this ref is special because
        // it's both needed in this component to get access to the rendered element
        // and must fulfill any ref passed by the user.
        type InternalProps = ReactWrapperProps<TElement, TEvents> & {
            __forwardedRef?: ReactModule.Ref<unknown>;
        };

        if (type instanceof FASTElementDefinition) {
            type.define(registry);
            type = type.type;
        }

        const cachedCandidates = wrappersCache.get(type);
        if (cachedCandidates) {
            const cachedWrapper = cachedCandidates.get(config.name ?? DEFAULT_CACHE_NAME);
            if (cachedWrapper) {
                return cachedWrapper;
            }
        }

        class ReactComponent extends React.Component<InternalProps> {
            private _element: TElement | null = null;
            private _elementProps!: { [index: string]: unknown };
            private _userRef?: ReactModule.Ref<unknown>;
            private _ref?: (element: TElement | null) => void;

            private _updateElement(oldProps?: InternalProps) {
                const element = this._element;

                if (element === null) {
                    return;
                }

                const currentProps = this.props;
                const previousProps = oldProps || emptyProps;
                const events = getElementEvents(config);

                for (const key in this._elementProps) {
                    const newValue = currentProps[key];
                    const event = events[key as keyof TEvents];

                    if (event === undefined) {
                        element[
                            key as keyof TElement
                        ] = newValue as TElement[keyof TElement];
                    } else {
                        const oldValue = previousProps[key];

                        if (newValue === oldValue) {
                            continue;
                        }

                        if (oldValue !== undefined) {
                            element.removeEventListener(event, oldValue);
                        }

                        if (newValue !== undefined) {
                            element.addEventListener(event, newValue);
                        }
                    }
                }
            }

            componentDidMount() {
                this._updateElement();
            }

            componentDidUpdate(old: InternalProps) {
                this._updateElement(old);
            }

            render() {
                // Since refs only get fulfilled once, pass a new one if the user's
                // ref changed. This allows refs to be fulfilled as expected, going from
                // having a value to null.
                const userRef = this.props.__forwardedRef as ReactModule.Ref<unknown>;
                if (this._ref === undefined || this._userRef !== userRef) {
                    this._ref = (value: TElement | null) => {
                        if (this._element === null) {
                            this._element = value;
                        }
                        if (userRef !== null) {
                            setRef(userRef, value);
                        }
                        this._userRef = userRef;
                    };
                }

                // Filter class properties and pass the remaining attributes to React.
                // This allows attributes to use framework rules
                // for setting attributes and render correctly under SSR.
                const newReactProps: any = { ref: this._ref };
                const newElementProps = (this._elementProps = {} as any);
                const elementKeys = getElementKeys(type, config);
                const currentProps = this.props;

                for (const k in currentProps) {
                    const v = currentProps[k];

                    if (elementKeys.has(k)) {
                        newElementProps[k] = v;
                    } else {
                        // React does *not* handle `className` for custom elements so
                        // coerce it to `class` so it's handled correctly.
                        newReactProps[k === "className" ? "class" : k] = v;
                    }
                }

                return React.createElement(getTagName(type, config), newReactProps);
            }
        }

        const reactComponent = React.forwardRef(
            (
                props?: ReactWrapperProps<TElement, TEvents>,
                ref?: ReactModule.Ref<unknown>
            ) =>
                React.createElement(
                    ReactComponent,
                    { ...props, __forwardedRef: ref } as InternalProps,
                    props?.children
                )
        ) as ReactWrapper<TElement, TEvents>;

        if (!wrappersCache.has(type)) {
            wrappersCache.set(type, new Map<string, any>());
        }
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        wrappersCache.get(type)!.set(config.name ?? DEFAULT_CACHE_NAME, reactComponent);

        return reactComponent;
    }

    return wrap;
}
