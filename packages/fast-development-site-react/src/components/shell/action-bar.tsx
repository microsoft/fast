import * as React from "react";
import manageJss, { ComponentStyles, IJSSManagerProps, IManagedClasses } from "@microsoft/fast-jss-manager-react";
import { IDevSiteDesignSystem } from "../design-system";

/* tslint:disable-next-line */
export interface IShellActionBarProps {}

export interface IShellActionBarManagedClasses {
    shell_actionBar: string;
}

const style: ComponentStyles<IShellActionBarManagedClasses, IDevSiteDesignSystem> = {
    shell_actionBar: {
        background: (config: IDevSiteDesignSystem): string => {
            return config.backgroundColor;
        },
        padding: (config: IDevSiteDesignSystem): string => {
            return `${config.navigationBarHeight / 4}px`;
        },
        minHeight: (config: IDevSiteDesignSystem): string => {
            return `${config.navigationBarHeight / 2}px`;
        }
    }
};

class ShellActionBar extends React.Component<IShellActionBarProps & IManagedClasses<IShellActionBarManagedClasses>, {}> {

    public render(): JSX.Element {
        return (
            <div className={this.props.managedClasses.shell_actionBar}>
                {this.props.children}
            </div>
        );
    }
}

export default manageJss(style)(ShellActionBar);
