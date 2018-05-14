import * as React from "react";
import manageJss, { ComponentStyles, IJSSManagerProps, IManagedClasses } from "@microsoft/fast-jss-manager-react";
import { toPx } from "@microsoft/fast-jss-utilities";
import { IDevSiteDesignSystem } from "../design-system";

export interface IShellPaneProps {
    collapsed?: boolean;
    hidden?: boolean;
}

export interface IShellPaneManagedClasses {
    shellPane: string;
    shellPane__collapsed: string;
    shellPane__expanded: string;
    shellPane__hidden: string;
}

const style: ComponentStyles<IShellPaneManagedClasses, IDevSiteDesignSystem> = {
    shellPane: {
        flexShrink: "0",
        overflowX: "hidden",
        backgroundColor: (config: IDevSiteDesignSystem): string => {
            return config.lightGray;
        }
    },
    shellPane__collapsed: {
        width: toPx(40),
    },
    shellPane__expanded: {
        width: toPx(300),
        padding: toPx(12)
    },
    shellPane__hidden: {
        display: "none"
    }
};

class ShellPane extends React.Component<IShellPaneProps & IManagedClasses<IShellPaneManagedClasses>, {}> {

    public render(): JSX.Element {
        return (
            <div className={this.getClassNames()}>
                <div className={this.getInnerDivClassNames()}>
                    {this.props.children}
                </div>
            </div>
        );
    }

    private getClassNames(): string {
        return this.props.hidden
            ? this.props.managedClasses.shellPane__hidden
            : this.props.managedClasses.shellPane;
    }

    private getInnerDivClassNames(): string {
        return this.props.collapsed
            ? this.props.managedClasses.shellPane__collapsed
            : this.props.managedClasses.shellPane__expanded;
    }
}

export default manageJss(style)(ShellPane);
