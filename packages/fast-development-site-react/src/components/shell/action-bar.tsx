import * as React from "react";
import manageJss, { ComponentStyles, IJSSManagerProps, IManagedClasses } from "@microsoft/fast-jss-manager-react";
import { toPx } from "@microsoft/fast-jss-utilities";
import { IDevSiteDesignSystem } from "../design-system";
import { Link, withRouter } from "react-router-dom";
import { RouteComponentProps } from "react-router";

/* tslint:disable-next-line */
export interface IShellActionBarProps extends RouteComponentProps<any> { }

export interface IShellActionBarManagedClasses {
    shellActionBar: string;
}

const style: ComponentStyles<IShellActionBarManagedClasses, IDevSiteDesignSystem> = {
    shellActionBar: {
        background: (config: IDevSiteDesignSystem): string => {
            return config.backgroundColor;
        },
        padding: (config: IDevSiteDesignSystem): string => {
            return toPx(config.navigationBarHeight / 4);
        },
        minHeight: (config: IDevSiteDesignSystem): string => {
            return toPx(config.navigationBarHeight / 2);
        }
    }
};

class ShellActionBar extends React.Component<IShellActionBarProps & IManagedClasses<IShellActionBarManagedClasses>, {}> {
    public render(): JSX.Element {
        return (
            <div className={this.props.managedClasses.shellActionBar}>
                {this.props.children}
            </div>
        );
    }
}

export default withRouter(manageJss(style)(ShellActionBar));
