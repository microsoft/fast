import * as React from "react";
import manageJss, { ComponentStyles, IManagedClasses } from "@microsoft/fast-jss-manager-react";
import { IDevSiteDesignSystem } from "../design-system";

export interface IShellPaneProps {
    collapsed?: boolean;
}

export interface IShellPaneManagedClasses {
    shell__pane: string;
    shell__pane_collapsed: string;
    shell__pane_expanded: string;
}

const style: ComponentStyles<IShellPaneManagedClasses, IDevSiteDesignSystem> = {
    shell__pane: {
        display: "inline-block",
        backgroundColor: (config: IDevSiteDesignSystem): string => {
            return config.lightGrey;
        }
    },
    shell__pane_collapsed: {
        width: "48px",
    },
    shell__pane_expanded: {
        width: "300px"
    }
};

class ShellPane extends React.Component<IShellPaneProps & IManagedClasses<IShellPaneManagedClasses>, {}> {

    public render(): JSX.Element {
        return (
            <div className={this.props.managedClasses.shell__pane}>
                <div className={this.getInnerDivClassNames()}>
                    {this.props.children}
                </div>
            </div>
        );
    }

    private getInnerDivClassNames(): string {
        if (this.props.collapsed === false) {
            return this.props.managedClasses.shell__pane_expanded;
        } else if (this.props.collapsed === true) {
            return this.props.managedClasses.shell__pane_collapsed;
        }
    }
}

export default manageJss(style)(ShellPane);
