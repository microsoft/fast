import * as React from "react";
import manageJss, { ComponentStyles, IJSSManagerProps, IManagedClasses } from "@microsoft/fast-jss-manager-react";
import { toPx } from "@microsoft/fast-jss-utilities";
import { IDevSiteDesignSystem } from "../design-system";

/* tslint:disable-next-line */
export interface IShellRowProps { }

export interface IShellRowManagedClasses {
    shellRow: string;
}

const style: ComponentStyles<IShellRowManagedClasses, IDevSiteDesignSystem> = {
    shellRow: {
        display: "flex",
        alignItems: "stretch",
        height: (config: IDevSiteDesignSystem): string => `calc(100% - ${toPx(config.navigationBarHeight * 2)}`
    }
};

/**
 * Row - use this to create rows of pane/canvas content or other content.
 */
class ShellRow extends React.Component<IShellRowProps & IManagedClasses<IShellRowManagedClasses>, {}> {

    public render(): JSX.Element {
        return (
            <div className={this.props.managedClasses.shellRow}>
                {this.props.children}
            </div>
        );
    }
}

export default manageJss(style)(ShellRow);
