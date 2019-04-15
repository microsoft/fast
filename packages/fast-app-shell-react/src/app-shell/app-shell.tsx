import React from "react";
import {
    Canvas,
    Container,
    ContainerClassNamesContract,
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
                <Background value={this.backgroundValue}>
                    <Container>
                        <Row fill={true}>Hello world</Row>
                    </Container>
                </Background>
            </DesignSystemProvider>
        );
    }

    private get backgroundValue(): LightModeBackgrounds | DarkModeBackgrounds {
        return this.props.colorMode === AppShellColorModes.light
            ? LightModeBackgrounds.L1
            : DarkModeBackgrounds.L1;
    }
}

export * from "./app-shell.props";
