import React from "react";
import {
    Canvas,
    Container,
    ContainerClassNamesContract,
    Pane,
    Row,
} from "@microsoft/fast-layouts-react";
import { AppShellApp, AppShellColorModes, AppShellProps } from "./app-shell.props";
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
import AppLink from "../app-link";
import { BrowserRouter, Route } from "react-router-dom";

export class AppShell extends React.Component<AppShellProps, {}> {
    public static defaultProps: Partial<AppShellProps> = {
        colorMode: AppShellColorModes.dark,
    };

    public render(): JSX.Element {
        return (
            <BrowserRouter>
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
                                >
                                    {this.props.apps.map(this.renderAppLink)}
                                </Background>
                            </Pane>
                            <Canvas>{this.props.apps.map(this.renderAppRoute)}</Canvas>
                        </Row>
                    </Container>
                </Background>
            </BrowserRouter>
        );
    }

    private get backgroundValue():
        | typeof LightModeBackgrounds
        | typeof DarkModeBackgrounds {
        return this.props.colorMode === AppShellColorModes.light
            ? LightModeBackgrounds
            : DarkModeBackgrounds;
    }

    private renderAppLink(appConfig: AppShellApp): JSX.Element {
        return (
            <AppLink
                key={appConfig.id}
                aria-label={appConfig.name}
                href={appConfig.rootPath}
                children={appConfig.icon}
                title={appConfig.name}
            />
        );
    }

    private renderAppRoute(appConfig: AppShellApp): JSX.Element {
        return (
            <Route
                key={appConfig.id}
                path={appConfig.rootPath}
                render={appConfig.render}
            />
        );
    }
}

export * from "./app-shell.props";
