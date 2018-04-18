import * as React from "react";
import manageJss, { ComponentStyles, IJSSManagerProps, IManagedClasses } from "@microsoft/fast-jss-manager-react";
import { IDevSiteDesignSystem } from "../design-system";

export interface IShellPaneProps {
    collapsed?: boolean;
}

export interface IShellPaneManagedClasses {
    shell_pane: string;
    shell_pane_collapsed: string;
    shell_pane_expanded: string;
}

const style: ComponentStyles<IShellPaneManagedClasses, IDevSiteDesignSystem> = {
    shell_pane: {
        display: "inline-block",
        overflow: "hidden",
        backgroundColor: (config: IDevSiteDesignSystem): string => {
            return config.lightGray;
        }
    },
    shell_pane_collapsed: {
        width: "40px",
    },
    shell_pane_expanded: {
        width: "300px"
    }
};

class ShellPane extends React.Component<IShellPaneProps & IManagedClasses<IShellPaneManagedClasses>, {}> {

    public render(): JSX.Element {
        return (
            <div className={this.props.managedClasses.shell_pane}>
                <div className={this.getInnerDivClassNames()}>
                    {this.props.children}
                </div>
            </div>
        );
    }

    private getInnerDivClassNames(): string {
        return this.props.collapsed ? this.props.managedClasses.shell_pane_collapsed : this.props.managedClasses.shell_pane_expanded;
    }
}

export default manageJss(style)(ShellPane);
