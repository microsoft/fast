import * as React from "react";
import manageJss, { ComponentStyles, IJSSManagerProps, IManagedClasses } from "@microsoft/fast-jss-manager-react";
import { IDevSiteDesignSystem } from "../design-system";
import ShellActionBar from "./action-bar";
import ShellInfoBar from "./info-bar";
import ShellCanvas from "./canvas";
import ShellHeader from "./header";
import ShellPane from "./pane";
import ShellPaneCollapse from "./pane-collapse";
import ShellRow from "./row";

/* tslint:disable-next-line */
export interface IShellProps { }

export interface IShellManagedClasses {
    shell: string;
}

export enum ShellSlot {
    header = "header",
    actionBar = "action-bar",
    canvas = "canvas",
    infoBar = "info-bar",
    pane = "pane",
    row = "row"
}

const style: ComponentStyles<IShellManagedClasses, IDevSiteDesignSystem> = {
    shell: {
        fontFamily: "Segoe UI, SegoeUI, Helvetica Neue, Helvetica, Arial, sans-serif",
        fontSize: "14px",
        height: "100vh"
    }
};

class Shell extends React.Component<IShellProps & IManagedClasses<IShellManagedClasses>, {}> {
    public render(): JSX.Element {
        return (
            <div className={this.props.managedClasses.shell}>
                {this.props.children}
            </div>
        );
    }
}

export default manageJss(style)(Shell);
export { ShellActionBar, ShellInfoBar, ShellCanvas, ShellHeader, ShellPane, ShellPaneCollapse, ShellRow };
