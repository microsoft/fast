import * as React from "react";
import * as ReactDOM from "react-dom";
import { get, isPlainObject, pick, set } from "lodash-es";
import { IFoundationProps } from "./foundation.props";

/**
 * Describes the object that stores memoized reference resolver functions
 */
export interface IReferenceResolverStore {
    [key: string]: IReferenceResolverStore | ReferenceResolver;
}

/**
 * Describes the object that stores all resolved react element and component references
 */
export interface IReferenceStore {
    [key: string]: IReferenceStore | React.ReactNode;
}

/**
 * Describes the object that enumerates all handled props for a component. This
 * object includes all props that are in some way consumed or manipulated by component
 * code. These props will not be mapped onto the underlying root DOM node
 */
export type HandledProps<T> = {
    [P in keyof T]: void
};

/**
 * Describes a function that that resolves a react reference element or component.
 */
export type ReferenceResolver = <T>(reference: T) => void;

/**
 * The foundation component is the component that all fast base components are built on top of. It provides a common
 * set of utilities that each component inherits.
 * @param H - These are the props that are "handled". "handled" props are not mapped automatically to the root element
 * returned by the render function. Use handled props to expose inputs that will not map directly to DOM attributes
 * (eg a custom callback) or where the DOM attribute would be required.
 * @param U - These are "unhandled" props. Any props from this interface will be mapped onto the root DOM node of the
 * render function as-is. It is advised that these props map to valid HTML attributes - otherwise you will likely have HTML errors.
 * @param S - The state interface of the component.
 */
class Foundation<H, U, S> extends React.Component<H & U & IFoundationProps, S> {
    /**
     * The props that should never be passed to the root element by unhandled props
     */
    private static defaultHandledProps: string[] = ["children"];

    /**
     * An enumeration of all handled props. All props passed to the component that are not enumerated here will be
     * treated as unhandled props
     */
    protected handledProps: HandledProps<H>;

    /**
     * Store all memoized ref callbacks so they can quickly be accessed. Storing the functions
     * allows us to not create new ref functions every update cycle
     */
    protected referenceResolverStore: IReferenceResolverStore = {};

    /**
     * Location where all react element and component references are stored
     */
    protected referenceStore: IReferenceStore = {};

    /**
     * Stores a react ref callback under the path provided as arguments. Paths are resolved using lodash's get/set API.
     * The reference object itself will be stored on the referenceStore under the path provided and can be accessed via
     * the getRef method under the same path.
     *
     * Usage: <div ref={this.setRef("content-container")} />
     */
    protected setRef(...args: Array<string | number>): ReferenceResolver {
        const storageKey: string = this.processStorageKey(args);
        let resolverFunction: ReferenceResolver | IReferenceResolverStore = get(this.referenceResolverStore, storageKey);

        if (!storageKey || isPlainObject(resolverFunction) || Array.isArray(resolverFunction)) {
            return;
        }

        if (typeof resolverFunction === "function") {
            return resolverFunction;
        } else {
            resolverFunction = (ref: React.ReactNode): void => {
                set(this.referenceStore, storageKey, ref);
            };

            set(this.referenceResolverStore, storageKey, resolverFunction);

            return resolverFunction;
        }
    }

    /**
     * Get a reference by key , where function arguments are used as to create the keyname,
     * eg. getRef('foo', 'bar', 0) resolves to this.references.foo.bar[0];
     *
     * Usage: const contentContainer = this.getRef("content-container");
     */
    protected getRef(...args: Array<string | number>): React.ReactNode {
        return get(this.referenceStore, this.processStorageKey(args));
    }

    /**
     * Returns an object containing all props that are not enumerated as handledProps
     */
    protected unhandledProps(): U {
        const unhandledPropKeys: string[] = Object.keys(this.props).filter((key: string) => {
            return !(Foundation.defaultHandledProps.indexOf(key) > -1) && !this.handledProps.hasOwnProperty(key);
        });

        return pick(this.props, unhandledPropKeys) as U;
    }

    /**
     * Joins any string with the className prop passed to the component. Used for applying a className to the root
     * element of a component's render function.
     */
    protected generateClassNames(componentClasses: string = ""): string | null {
        return componentClasses.concat(` ${this.props.className || ""}`).trim().replace(/(\s){2,}/g, " ") || null;
    }

    /*
     * Return an array of all nodes who's slot prop matches the provided slot.
     * If no nodes are provided, `this.props.children` will be used
     */
    protected matchesSlot<T>(
        slot: T,
        nodes: React.ReactNode | React.ReactNode[] = this.props.children
    ): JSX.Element[] {
        return React.Children.map(nodes, (node: React.ReactNode): JSX.Element | null  => {
            return get(node, "props.slot") === slot
                ? node as React.ReactElement<any>
                : null;
        });
    }

    /**
     * Generates a string that conforms to object/array accessor syntax that can be used by lodash's get / set,
     * eg. => ["foo", "bar", 0] => "foo[bar][0]"
     */
    private processStorageKey(args: Array<string | number>): string {
        return args.filter((item: string | number) => {
            return typeof item === "string" || typeof item === "number";
        }).map((item: string | number, index: number) => {
                return index === 0 ? item : `[${item}]`;
        }).join("");
    }
}

export default Foundation;
export { IFoundationProps };
