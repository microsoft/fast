import * as React from "react";
import manageJss, { ComponentStyles, IManagedJSSProps, IManagedClasses } from "@microsoft/fast-jss-manager-react";
import { toPx } from "@microsoft/fast-jss-utilities";
import { IDevSiteDesignSystem } from "../design-system";

/* tslint:disable-next-line */
export interface IShellPaneCollapseProps {
    onUpdate: () => void;
}

export interface IShellPaneCollapseManagedClasses {
    shellPaneCollapse: string;
}

const style: ComponentStyles<IShellPaneCollapseManagedClasses, IDevSiteDesignSystem> = {
    shellPaneCollapse: {
        background: "blue",
        height: toPx(48),
        width: toPx(48)
    }
};

class ShellPaneCollapse extends React.Component<IShellPaneCollapseProps & IManagedClasses<IShellPaneCollapseManagedClasses>, {}> {

    public render(): JSX.Element {
        return (
            <button className={this.props.managedClasses.shellPaneCollapse} onClick={this.handleUpdateCollapse}>
                {this.props.children}
            </button>
        );
    }

    private handleUpdateCollapse = (): void => {
        if (this.props.onUpdate) {
            this.props.onUpdate();
        }
    }
}

export default manageJss(style)(ShellPaneCollapse);
