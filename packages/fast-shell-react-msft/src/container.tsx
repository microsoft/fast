import * as React from "react";
import manageJss, { IManagedClasses, IJSSManagerProps, ComponentStyles } from "@microsoft/fast-jss-manager-react";

class Foundation<H, U, S> extends React.Component<H & U, S> { }
export interface IContainerClassNamesContract {
    container: string;
}

export const styles: ComponentStyles<IContainerClassNamesContract, undefined> = {
    container: {
        display: "flex",
        width: "100vw",
        height: "100vh",
        flexDirection: "column"
    }
};
export interface IContainerHandledProps {}
export interface IContainerUnhandledProps extends React.HTMLAttributes<HTMLDivElement> {}
export interface IContainerManagedClasses extends IManagedClasses<IContainerClassNamesContract> {}

export type ContainerProps = IContainerHandledProps & IContainerUnhandledProps & IContainerManagedClasses;
// export type IButtonManagedClasses = IManagedClasses<IButtonClassNameContract>;


/**
 * The Grid Container. This element wraps all other grid elements.
 */
// class Container extends Foundation<IManagedClasses<IContainerClassNamesContract>, React.HTMLAttributes<HTMLDivElement>>, undefined> {
class Container extends React.Component<ContainerProps, undefined> {
    /**
     * Renders the Container markup
     */
    public render(): React.ReactElement<HTMLDivElement> {
        return (
            <div
                // TODO {...this.unhandledProps()}
                className={this.props.managedClasses.container}
                data-grid-app="container"
            >
                {this.props.children}
            </div>
        );
    }
}
export default Container;
//export default manageJss(styles)(Container);
