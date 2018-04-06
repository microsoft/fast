import * as React from "react";
import manageJss, { ComponentStyles, IManagedClasses } from "@microsoft/fast-jss-manager-react";
import { IDevSiteDesignSystem } from "../design-system";

/* tslint:disable-next-line */
export interface IShellPaneCollapseProps {
    onUpdate: () => void;
}

export interface IShellPaneCollapseManagedClasses {
    shell__pane_collapse: string;
}

const style: ComponentStyles<IShellPaneCollapseManagedClasses, IDevSiteDesignSystem> = {
    shell__pane_collapse: {
        background: "blue",
        height: "48px",
        width: "48px"
    }
};

class ShellPaneCollapse extends React.Component<IShellPaneCollapseProps & IManagedClasses<IShellPaneCollapseManagedClasses>, {}> {

    public render(): JSX.Element {
        return (
            <button className={this.props.managedClasses.shell__pane_collapse} onClick={this.handleUpdateCollapse}>
                {this.props.children}
            </button>
        );
    }

    private handleUpdateCollapse = (): void => {
        this.props.onUpdate();
    }
}

export default manageJss(style)(ShellPaneCollapse);
