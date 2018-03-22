import * as React from "react";
import manageJss, { IInjectedProps, ComponentStyles } from "@microsoft/fast-jss-manager-react";
import {IDevSiteDesignSystem} from "../design-system";

/* tslint:disable-next-line */
export interface IShellRowProps { }

export interface IShellRowManagedClasses {
    shell__row: string;
}

const style: ComponentStyles<IShellRowManagedClasses, IDevSiteDesignSystem> = {
    shell__row: {
        display: "flex",
        alignItems: "stretch",
        height: (config: IDevSiteDesignSystem): string => `calc(100% - ${config.navigationBarHeight * 2}px)`
    }
};

/**
 * Row - use this to create rows of pane/canvas content or other content.
 */
class ShellRow extends React.Component<IShellRowProps & IInjectedProps<IShellRowManagedClasses>, {}> {

    public render(): JSX.Element {
        return (
            <div className={this.props.managedClasses.shell__row}>
                {this.props.children}
            </div>
        );
    }
}

export default manageJss(style)(ShellRow);
