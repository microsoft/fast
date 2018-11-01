import * as React from "react";
import { ComponentStyles, ManagedClasses } from "@microsoft/fast-jss-manager";
import { omit } from "lodash-es";
import { Consumer } from "./context";
import { JSSManagedComponentProps, JSSManager, ManagedJSSProps } from "./jss-manager";
import * as hoistNonReactStatics from "hoist-non-react-statics";

/**
 * The prop name that must be passed to the JSSManager and not the managed component
 */
const jssManagerProp: keyof JSSManagedComponentProps<any, any> = "jssStyleSheet";

/**
 * Determines if component prop object contains props
 * that need to be handed to the JSSManager
 */
function containsJssManagerProps<T, S, C>(
    props: T | ManagedJSSProps<T, S, C>
): props is ManagedJSSProps<T, S, C> {
    return props.hasOwnProperty(jssManagerProp);
}

/**
 * Removes props handled by the JSSManager from a prop object
 */
export function cleanLowerOrderComponentProps<T, S, C>(
    props: ManagedJSSProps<T, S, C>
): T {
    return containsJssManagerProps(props) ? (omit(props, [jssManagerProp]) as T) : props;
}

/**
 * Main entry into the style manager. This function accepts a JSS style object and returns a
 * higher order component. That higher-order component can then be used to compose a component
 * with styles managed
 * @param S - The stylesheet class-name contract
 * @param C - The stylesheet design-system configuration object
 */
function manageJss<S, C>(
    styles?: ComponentStyles<S, C>
): <T>(
    Component: React.ComponentType<T & ManagedClasses<S>>
) => React.ComponentClass<ManagedJSSProps<T, S, C>> {
    return function<T>(
        Component: React.ComponentType<T & ManagedClasses<S>>
    ): React.ComponentClass<ManagedJSSProps<T, S, C>> {
        class JSSManagedComponent extends JSSManager<T, S, C> {
            protected styles: ComponentStyles<S, C> = styles;
            protected managedComponent: React.ComponentType<
                T & ManagedClasses<S>
            > = Component;
        }

        return hoistNonReactStatics(JSSManagedComponent, Component);
    };
}

export { manageJss };
