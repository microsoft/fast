import * as React from "react";
import manageJss, { ComponentStyles, ManagedClasses, ManagedJSSProps } from "@microsoft/fast-jss-manager-react";
import { toPx } from "@microsoft/fast-jss-utilities";
import { DevSiteDesignSystem } from "../design-system";

/* tslint:disable-next-line */
export interface ShellPaneCollapseProps {
    onUpdate: () => void;
}

export interface ShellPaneCollapseManagedClasses {
    shellPaneCollapse: string;
}

const style: ComponentStyles<ShellPaneCollapseManagedClasses, DevSiteDesignSystem> = {
    shellPaneCollapse: {
        background: "blue",
        height: toPx(48),
        width: toPx(48)
    }
};

class ShellPaneCollapse extends React.Component<ShellPaneCollapseProps & ManagedClasses<ShellPaneCollapseManagedClasses>, {}> {

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
