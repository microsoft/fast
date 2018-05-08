import * as React from "react";
import manageJss, { ComponentStyles, IJSSManagerProps, IManagedClasses } from "@microsoft/fast-jss-manager-react";
import { toPx } from "@microsoft/fast-jss-utilities";
import { IDevSiteDesignSystem } from "../design-system";

/* tslint:disable-next-line */
export interface IShellActionBarProps {}

export interface IShellActionBarManagedClasses {
    shellActionBar: string;
}

const style: ComponentStyles<IShellActionBarManagedClasses, IDevSiteDesignSystem> = {
    shellActionBar: {
        background: (config: IDevSiteDesignSystem): string => {
            return config.backgroundColor;
        },
        height: toPx(39),
        overflow: "hidden",
        borderBottom: `${toPx(1)} solid #CCCCCC`
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

export default manageJss(style)(ShellActionBar);
