import * as React from "react";
import manageJss, { ComponentStyles, IManagedJSSProps, IManagedClasses } from "@microsoft/fast-jss-manager-react";
import { toPx } from "@microsoft/fast-jss-utilities";
import { IDevSiteDesignSystem } from "../design-system";

/* tslint:disable-next-line */
export interface IShellInfoBarProps {}

export interface IShellInfoBarManagedClasses {
    shellInfoBar: string;
}

const style: ComponentStyles<IShellInfoBarManagedClasses, IDevSiteDesignSystem> = {
    shellInfoBar: {
        display: "flex",
        background: "#E9ECEC",
        cursor: "default",
        minHeight: (config: IDevSiteDesignSystem): string => {
            return toPx(config.navigationBarHeight / 2);
        }
    }
};

class ShellInfoBar extends React.Component<IShellInfoBarProps & IManagedClasses<IShellInfoBarManagedClasses>, {}> {

    public render(): JSX.Element {
        return (
            <div className={this.props.managedClasses.shellInfoBar}>
                {this.props.children}
            </div>
        );
    }
}

export default manageJss(style)(ShellInfoBar);
