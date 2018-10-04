import * as React from "react";
import { ClassNames, ComponentStyles, IManagedClasses } from "@microsoft/fast-jss-manager";
import { pick } from "lodash-es";
import { Consumer } from "./context";
import { JSSManager, ManagedJSSProps } from "./jss-manager";

/**
 * Removes props handled by the JSSManager from a prop object
 */
export function cleanLowerOrderComponentProps<T, S, C>(props: ManagedJSSProps<T, S, C>): T {
    // TODO: We can make this more performant, running into type issues so leaving as is for now.
    return pick(props, Object.keys(props).filter((key: string) => {
        return key !== "jssStyleSheet" && key !== "managedClasses";
    })) as T;
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
    Component: React.ComponentType<T & IManagedClasses<S>>
) => React.SFC<ManagedJSSProps<T, S, C>> {
    /*
     * @param T - The component prop interface
     */
    return function<T>(
        Component: React.ComponentType<T & IManagedClasses<S>>
    ): React.SFC<ManagedJSSProps<T, S, C>> {
        return (props: ManagedJSSProps<T, S, C>): React.ReactElement<React.Consumer<unknown>> => {
            /**
             * Define the render prop of the JSSManager. Generated class-names are passed into
             * this function and provided to the wrapped component
             */
            function renderLowerOrderComponent(
                managedClasses: ClassNames<S>
            ): React.ReactNode {
                return (
                    <Component
                        {...cleanLowerOrderComponentProps(props)}
                        managedClasses={managedClasses}
                    />
                );
            }

            /**
             * React Stateless Functional Component to render the JSSManager
             * with props from Consumer
             */
            function renderJSSManager(designSystem: C): React.ReactNode {
                return (
                    <JSSManager
                        styles={styles}
                        designSystem={designSystem}
                        jssStyleSheet={props.jssStyleSheet}
                        render={renderLowerOrderComponent}
                    />
                );
            }

            return (
                <Consumer>
                    {renderJSSManager}
                </Consumer>
            );
        };
    };
}

export { manageJss };
