import * as React from "react";
import manageJss, {IManagedClasses, ComponentStyles} from "@microsoft/fast-jss-manager-react";
import {IDevSiteDesignSystem} from "../design-system";

/* tslint:disable-next-line */
export interface IShellPaneProps { }

export interface IShellPaneManagedClasses {
    shell__pane: string;
}

const style: ComponentStyles<IShellPaneManagedClasses, IDevSiteDesignSystem> = {
    shell__pane: {
        display: "inline-block",
        flexGrow: "1"
    }
};

class ShellPane extends React.Component<IShellPaneProps & IManagedClasses<IShellPaneManagedClasses>, {}> {

    public render(): JSX.Element {
        return (
            <div className={this.props.managedClasses.shell__pane}>
                {this.props.children}
            </div>
        );
    }
}

export default manageJss(style)(ShellPane);
