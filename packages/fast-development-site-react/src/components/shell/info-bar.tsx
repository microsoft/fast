import * as React from "react";
import manageJss, { ComponentStyles, IManagedClasses } from "@microsoft/fast-jss-manager-react";
import { IDevSiteDesignSystem } from "../design-system";

/* tslint:disable-next-line */
export interface IShellInfoBarProps {}

export interface IShellInfoBarManagedClasses {
    shell__info_bar: string;
}

const style: ComponentStyles<IShellInfoBarManagedClasses, IDevSiteDesignSystem> = {
    shell__info_bar: {
        background: (config: IDevSiteDesignSystem): string => {
            return config.lightGrey;
        },
        padding: (config: IDevSiteDesignSystem): string => {
            return `${config.navigationBarHeight / 4}px`;
        },
        minHeight: (config: IDevSiteDesignSystem): string => {
            return `${config.navigationBarHeight / 2}px`;
        }
    }
};

class ShellInfoBar extends React.Component<IShellInfoBarProps & IManagedClasses<IShellInfoBarManagedClasses>, {}> {

    public render(): JSX.Element {
        return (
            <div className={this.props.managedClasses.shell__info_bar}>
                {this.props.children}
            </div>
        );
    }
}

export default manageJss(style)(ShellInfoBar);
