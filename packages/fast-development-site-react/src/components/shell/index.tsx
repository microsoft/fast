import * as React from "react";
import { ComponentStyles, IManagedClasses } from "@microsoft/fast-jss-manager-react";
import { toPx } from "@microsoft/fast-jss-utilities";
import { IDevSiteDesignSystem } from "../design-system";
import ShellActionBar from "./action-bar";
import ShellInfoBar from "./info-bar";
import ShellCanvas from "./canvas";
import ShellHeader from "./header";
import ShellPane from "./pane";
import ShellPaneCollapse from "./pane-collapse";
import ShellRow from "./row";
import { Container, IContainerClassNamesContract } from "@microsoft/fast-shell-react-msft";

export enum ShellSlot {
    header = "header",
    actionBar = "action-bar",
    canvas = "canvas",
    infoBar = "info-bar",
    pane = "pane",
    row = "row"
}

class Shell extends React.Component<{}, {}> {
    private containerStyles: ComponentStyles<IContainerClassNamesContract, undefined> = {
        container: {
            fontFamily: "Segoe UI, SegoeUI, Helvetica Neue, Helvetica, Arial, sans-serif",
            fontSize: toPx(14),
            height: "100vh"
        }
    };

    public render(): JSX.Element {
        return (
            <Container jssStyleSheet={this.containerStyles}>
                {this.props.children}
            </Container>
        );
    }
}

export default Shell;
export { ShellActionBar, ShellInfoBar, ShellCanvas, ShellHeader, ShellPane, ShellPaneCollapse, ShellRow };
