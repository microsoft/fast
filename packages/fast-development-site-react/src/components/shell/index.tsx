import React from "react";
import { ComponentStyles, ManagedClasses } from "@microsoft/fast-jss-manager-react";
import { toPx } from "@microsoft/fast-jss-utilities";
import { DevSiteDesignSystem } from "../design-system";
import ShellInfoBar from "./info-bar";
import ShellHeader from "./header";
import ShellPaneCollapse from "./pane-collapse";
import { Container, ContainerClassNamesContract } from "@microsoft/fast-layouts-react";

export enum ShellSlot {
    header = "header",
    actionBar = "action-bar",
    canvas = "canvas",
    infoBar = "info-bar",
    pane = "pane",
    row = "row",
}

class Shell extends React.Component<{}, {}> {
    private containerStyles: Partial<
        ComponentStyles<ContainerClassNamesContract, undefined>
    > = {
        container: {
            fontFamily: "Segoe UI, SegoeUI, Helvetica Neue, Helvetica, Arial, sans-serif",
            fontSize: "12px",
            height: "100vh",
        },
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
export { ShellHeader, ShellInfoBar, ShellPaneCollapse };
