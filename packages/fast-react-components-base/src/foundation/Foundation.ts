import * as React from "react";
import * as ReactDOM from "react-dom";
import { set, get, pick, has, isPlainObject, without } from "lodash-es";
import { IFoundationProps } from "./Foundation.props";

/**
 * Interface to describe the refereceResolver store
 */
export interface IReferenceResolverStore {
    [key: string]: IReferenceResolverStore | ReferenceResolver;
}

/**
 * Interface of reference store for elements resolved by react. Allows for quick access
 * by getRef
 */
export interface IReferenceStore {
    [key: string]: IReferenceStore | React.ReactNode;
}

export type HandledProps<T> = {
    [P in keyof T]: void
}

/**
 * Typing for a ref callback
 */
export type ReferenceResolver = <T>(reference: T) => void;

class Foundation<H, U, S> extends React.Component<H & U & IFoundationProps, S> {
    /**
     * default props for the component
     */
    public static defaultProps: object;

    /**
     * An enumeration of all prop keys that are handled by the component. All props passed
     * to the component that are not enumerated here will be treated as unhandled props
     */
    protected handledProps: HandledProps<H>;

    /**
     * Store all  memoized ref callbacks so they can quickly be accessed. Storing the functions
     * allows us to not create new ref functions every update cycle
     */
    protected referenceResolvers: IReferenceResolverStore = {};

    /**
     * Stores ref elements themselves.
     * @name references
     */
    protected referenceStore: IReferenceStore = {};

    /**
     * Stores a react ref callback under the path provided as arguments. Paths are resolved using lodash's get/set API.
     * The reference object itself will be stored on the referenceStore under the path provided and can be accessed via 
     * the getRef method under the same path.
     */
    protected setRef(...args: (string | number)[]): ReferenceResolver {
        const storageKey: string = this.processStorageKey(args);
        let resolverFunction: ReferenceResolver | IReferenceResolverStore = get(this.referenceResolvers, storageKey);

        if (!storageKey || isPlainObject(resolverFunction) || Array.isArray(resolverFunction)) {
            return;
        }
        
        if (typeof resolverFunction === "function") {
            return resolverFunction;
        } else {
            resolverFunction = (ref) => {
                set(this.referenceStore, storageKey, ref);
            }

            set(this.referenceResolvers, storageKey, resolverFunction);

            return resolverFunction;
        }
    }


    /**
     * gets a reference stored by the baseclass by keyname, where arguments are
     * used as keynames, eg getRef('foo', 'bar', 0) resolves to this.references.foo.bar[0];
     */
    protected getRef(...args: (string | number)[]): React.ReactNode {
        return get(this.referenceStore, this.processStorageKey(args));
    }

    /**
     * Gets all props that aren't handled by the component.
     */
    protected unhandledProps(): U {
        const unhandledPropKeys: string[] = Object.keys(this.props).filter(key => {
            return !this.handledProps.hasOwnProperty(key);
        });

        return pick(this.props, unhandledPropKeys) as U;
    }

    /**
     * Concatenates a component's generated className string with any additional classNames passed as props.
     */
    protected generateClassNames(componentClasses: string = ""): string {
        return componentClasses.concat(` ${this.props.className || ""}`).trim().replace(/(\s){2,}/g, " ") || null;
    }

    /**
     * Generates a string that conforms to object/array accessor syntax that can be used by lodash's get / set,
     * eg. => ["foo", "bar", 0] => "foo[bar][0]"
     */
    private processStorageKey(args: (string | number)[]): string {
        return args.filter(item => {
            return typeof item === "string" || typeof item === "number";
        }).map((item, index) => {
                return index === 0 ? item : `[${item}]`;
        }).join("");
    }
}

export default Foundation;
export { IFoundationProps };