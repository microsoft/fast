import React from "react";
import { ComponentStyles, ManagedClasses } from "@microsoft/fast-jss-manager";
import { JSSManager, ManagedJSSProps } from "./jss-manager";
/* tslint:disable-next-line */
const hoistNonReactStatics = require("hoist-non-react-statics");

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
            public static displayName: string = `withJSS(${Component.displayName ||
                Component.name})`;
            protected styles: ComponentStyles<S, C> = styles;
            protected managedComponent: React.ComponentType<
                T & ManagedClasses<S>
            > = Component;
        }

        return hoistNonReactStatics(JSSManagedComponent, Component);
    };
}

export { manageJss };
