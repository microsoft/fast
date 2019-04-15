import React from "react";
import {
    Canvas,
    Container,
    ContainerClassNamesContract,
    Pane,
    Row,
} from "@microsoft/fast-layouts-react";
import { AppShellColorModes, AppShellProps } from "./app-shell.props";
import { DesignSystem, neutralFillRest } from "@microsoft/fast-components-styles-msft";
import {
    ComponentStyleSheet,
    DesignSystemProvider,
} from "@microsoft/fast-jss-manager-react";
import {
    Background,
    DarkModeBackgrounds,
    LightModeBackgrounds,
} from "@microsoft/fast-components-react-msft";
import { DesignSystemDefaults } from "@microsoft/fast-components-styles-msft";

export class AppShell extends React.Component<AppShellProps, {}> {
    public static defaultProps: Partial<AppShellProps> = {
        colorMode: AppShellColorModes.dark,
    };

    public render(): JSX.Element {
        return (
            <DesignSystemProvider designSystem={DesignSystemDefaults}>
                <Background
                    value={this.backgroundValue.L1}
                    className={this.props.managedClasses.appShell}
                >
                    <Container>
                        <Row fill={true}>
                            <Pane
                                minWidth={40}
                                width={40}
                                className={
                                    this.props.managedClasses.appShell_navigationPane
                                }
                            >
                                <Background
                                    value={this.backgroundValue.L2}
                                    style={{ width: "100%", height: "100%" }}
                                />
                            </Pane>
                            Hello world
                        </Row>
                    </Container>
                </Background>
            </DesignSystemProvider>
        );
    }

    private get backgroundValue():
        | typeof LightModeBackgrounds
        | typeof DarkModeBackgrounds {
        return this.props.colorMode === AppShellColorModes.light
            ? LightModeBackgrounds
            : DarkModeBackgrounds;
    }
}

export * from "./app-shell.props";
