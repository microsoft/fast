import * as React from "react";
import { toPx } from "@microsoft/fast-jss-utilities";
import manageJss, { ComponentStyles, IJSSManagerProps, IManagedClasses } from "@microsoft/fast-jss-manager-react";
import { IDevSiteDesignSystem } from "../design-system";
import CodePreview from "./dev-tools-code-preview";
import { IFormChildOption } from "./";

export enum frameworkEnum {
    react = "react",
    angular = "angular"
}

export type tabType = "code" | "properties" | "schema";

export interface IDevToolsProps {
    onToggleView: () => void;
    activeFormData: any;
    activeComponentName: string;
    activeFramework: frameworkEnum;
    childOptions: IFormChildOption[];
    frameworks?: frameworkEnum[];
    activeTab?: tabType;
}

export interface IDevToolsState {
    activeFramework: frameworkEnum;
    activeTab: tabType;
}

export interface IDevToolsManagedClasses {
    devTools: string;
    devTools_controls: string;
    devTools_controls_tabs: string;
    devTools_controls_framework: string;
    devTools_controls_framework__active: string;
    devTools_controls_framework_angular: string;
    devTools_controls_framework_react: string;
    devTools_controls_closeButton: string;
    devTools_tab: string;
    devTools_tab__active: string;
    devTools_tabPanel: string;
}

const style: ComponentStyles<IDevToolsManagedClasses, IDevSiteDesignSystem> = {
    devTools: {
        width: "100%"
    },
    devTools_controls: {
        display: "flex",
        background: "#EBEBEB",
        padding: `${toPx(2)} ${toPx(4)}`,
        "& ul": {
            margin: "0",
            padding: "0",
            listStyleType: "none",
            "& li": {
                display: "inline-block"
            }
        },
        "& button": {
            border: "none",
            padding: `${toPx(6)} ${toPx(8)}`,
            minWidth: toPx(25),
            backgroundPosition: "center"
        }
    },
    devTools_controls_tabs: {
        flexGrow: "1"
    },
    devTools_controls_framework: {
        "& button": {
            width: toPx(25),
            height: toPx(25),
            backgroundRepeat: "no-repeat",
            marginRight: toPx(2),
            borderRadius: toPx(2)
        }
    },
    devTools_controls_framework__active: {
        "& button": {
            backgroundColor: "#FFF"
        }
    },
    devTools_controls_framework_angular: {
        backgroundSize: "80% 80%",
        backgroundColor: "transparent",
        /* tslint:disable-next-line */
        backgroundImage: "url(data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0idXRmLTgiPz48c3ZnIHZlcnNpb249IjEuMSIgaWQ9IkxheWVyXzEiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgeG1sbnM6eGxpbms9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsiIHg9IjBweCIgeT0iMHB4IiB2aWV3Qm94PSIwIDAgMjUwIDI1MCIgc3R5bGU9ImVuYWJsZS1iYWNrZ3JvdW5kOm5ldyAwIDAgMjUwIDI1MDsiIHhtbDpzcGFjZT0icHJlc2VydmUiPjxzdHlsZSB0eXBlPSJ0ZXh0L2NzcyI+LnN0MHtmaWxsOiNERDAwMzE7fS5zdDF7ZmlsbDojQzMwMDJGO30uc3Qye2ZpbGw6I0ZGRkZGRjt9PC9zdHlsZT48Zz48cG9seWdvbiBjbGFzcz0ic3QwIiBwb2ludHM9IjEyNSwzMCAxMjUsMzAgMTI1LDMwIDMxLjksNjMuMiA0Ni4xLDE4Ni4zIDEyNSwyMzAgMTI1LDIzMCAxMjUsMjMwIDIwMy45LDE4Ni4zIDIxOC4xLDYzLjIgIi8+PHBvbHlnb24gY2xhc3M9InN0MSIgcG9pbnRzPSIxMjUsMzAgMTI1LDUyLjIgMTI1LDUyLjEgMTI1LDE1My40IDEyNSwxNTMuNCAxMjUsMjMwIDEyNSwyMzAgMjAzLjksMTg2LjMgMjE4LjEsNjMuMiAxMjUsMzAgIi8+PHBhdGggY2xhc3M9InN0MiIgZD0iTTEyNSw1Mi4xTDY2LjgsMTgyLjZoMGgyMS43aDBsMTEuNy0yOS4yaDQ5LjRsMTEuNywyOS4yaDBoMjEuN2gwTDEyNSw1Mi4xTDEyNSw1Mi4xTDEyNSw1Mi4xTDEyNSw1Mi4xTDEyNSw1Mi4xeiBNMTQyLDEzNS40SDEwOGwxNy00MC45TDE0MiwxMzUuNHoiLz48L2c+PC9zdmc+)"
    },
    devTools_controls_framework_react: {
        backgroundSize: "70% 70%",
        backgroundColor: "transparent",
        /* tslint:disable-next-line */
        backgroundImage: "url(data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0idXRmLTgiPz48c3ZnIHZlcnNpb249IjEuMSIgaWQ9IkxheWVyXzJfMV8iIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgeG1sbnM6eGxpbms9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsiIHg9IjBweCIgeT0iMHB4IiB2aWV3Qm94PSIwIDAgNTYxLjggNDk5LjgiIHN0eWxlPSJlbmFibGUtYmFja2dyb3VuZDpuZXcgMCAwIDU2MS44IDQ5OS44OyIgeG1sOnNwYWNlPSJwcmVzZXJ2ZSI+PHN0eWxlIHR5cGU9InRleHQvY3NzIj4uc3Qwe2ZpbGw6IzYxREFGQjt9LnN0MXtmaWxsOm5vbmU7c3Ryb2tlOiM2MURBRkI7c3Ryb2tlLXdpZHRoOjE1O3N0cm9rZS1taXRlcmxpbWl0OjEwO308L3N0eWxlPjx0aXRsZT5sb2dvLXJlYWN0PC90aXRsZT48ZWxsaXBzZSB0cmFuc2Zvcm09Im1hdHJpeCg4LjI0ODA1MWUtMDIgLTAuOTk2NiAwLjk5NjYgOC4yNDgwNTFlLTAyIDkuMTUxMSA1MDguNzk5OCkiIGNsYXNzPSJzdDAiIGN4PSIyODAuOSIgY3k9IjI0OS40IiByeD0iNTAuMiIgcnk9IjUwLjIiLz48cGF0aCBjbGFzcz0ic3QxIiBkPSJNMjgwLjksMTQ3LjRjNjcuNCwwLDEyOS45LDkuNywxNzcuMSwyNS45YzU2LjgsMTkuNiw5MS44LDQ5LjIsOTEuOCw3Ni4xYzAsMjgtMzcsNTkuNS05OC4xLDc5LjdjLTQ2LjEsMTUuMy0xMDYuOSwyMy4zLTE3MC44LDIzLjNjLTY1LjYsMC0xMjcuNi03LjUtMTc0LjMtMjMuNGMtNTktMjAuMi05NC42LTUyLjEtOTQuNi03OS42YzAtMjYuNiwzMy40LTU2LjEsODkuNC03NS42QzE0OC44LDE1Ny4zLDIxMi45LDE0Ny40LDI4MC45LDE0Ny40eiIvPjxwYXRoIGNsYXNzPSJzdDEiIGQ9Ik0xOTIuMSwxOTguN0MyMjUuOCwxNDAuNCwyNjUuNCw5MSwzMDMsNTguMmM0NS4zLTM5LjQsODguNS01NC45LDExMS44LTQxLjVjMjQuMiwxNCwzMyw2MS44LDIwLjEsMTI0LjhjLTkuOCw0Ny42LTMzLjIsMTA0LjItNjUuMiwxNTkuNmMtMzIuOCw1Ni44LTcwLjIsMTA2LjgtMTA3LjQsMTM5LjNjLTQ3LDQxLjEtOTIuNCw1NS45LTExNi4yLDQyLjJjLTIzLjEtMTMuMy0zMS45LTU2LjktMjAuOC0xMTUuMkMxMzQuNiwzMTguMSwxNTguMSwyNTcuNiwxOTIuMSwxOTguN3oiLz48cGF0aCBjbGFzcz0ic3QxIiBkPSJNMTkyLjIsMzAxLjNDMTU4LjQsMjQzLDEzNS41LDE4NCwxMjUuOSwxMzVjLTExLjUtNTktMy40LTEwNC4xLDE5LjktMTE3LjZjMjQuMi0xNCw3MC4xLDIuMiwxMTguMSw0NC45YzM2LjQsMzIuMyw3My43LDgwLjgsMTA1LjcsMTM2LjJjMzIuOCw1Ni43LDU3LjUsMTE0LjIsNjcsMTYyLjZjMTIuMSw2MS4yLDIuMywxMDgtMjEuNSwxMjEuN2MtMjMuMSwxMy4zLTY1LjItMC44LTExMC4yLTM5LjVDMjY2LjksNDEwLjcsMjI2LjMsMzYwLjEsMTkyLjIsMzAxLjN6Ii8+PC9zdmc+)"
    },
    devTools_controls_closeButton: {
        position: "relative",
        background: "none",
        border: "none",
        "&:after": {
            position: "absolute",
            background: "#000000",
            content: "''",
            left: toPx(6),
            top: toPx(12),
            height: toPx(1),
            width: toPx(12),
            transform: "rotate(-45deg)"
        },
        "&:before": {
            position: "absolute",
            background: "#000000",
            content: "''",
            left: toPx(6),
            top: toPx(12),
            height: toPx(1),
            width: toPx(12),
            transform: "rotate(45deg)"
        }
    },
    devTools_tab: {
        "& button": {
            background: "none"
        }
    },
    devTools_tab__active: {
        "& button": {
            background: "#FFFFFF",
            borderRadius: toPx(3),
            position: "relative",
            "&:after": {
                position: "absolute",
                bottom: "0",
                left: toPx(4),
                right: toPx(4),
                content: "''",
                height: toPx(2),
                borderRadius: toPx(3),
                // TODO: Issue #309 https://github.com/Microsoft/fast-dna/issues/309
                // background: (config: IDevSiteDesignSystem): string => {
                //     return config.brandColor;
                // }
                background: "#FB356D"
            }
        }
    },
    devTools_tabPanel: {
        "&[aria-hidden=\"true\"]": {
            display: "none"
        }
    }
};

class DevTools extends React.Component<IDevToolsProps & IManagedClasses<IDevToolsManagedClasses>, IDevToolsState> {

    private tabs: tabType[];

    constructor(props: IDevToolsProps & IManagedClasses<IDevToolsManagedClasses>) {
        super(props);

        this.tabs = ["code", "properties", "schema"];

        this.state = {
            activeFramework: this.props.activeFramework || frameworkEnum.react,
            activeTab: this.props.activeTab || "code"
        };
    }

    public render(): JSX.Element {
        return (
            <div className={this.props.managedClasses.devTools}>
                <div className={this.props.managedClasses.devTools_controls}>
                    {this.renderTabs()}
                    {this.renderComponentFrameworkType()}
                    <button
                        onClick={this.props.onToggleView}
                        aria-label="close development tools"
                        className={this.props.managedClasses.devTools_controls_closeButton}
                    />
                </div>
                {this.renderTabPanels()}
            </div>
        );
    }

    private renderTabs(): JSX.Element {
        return (
            <ul className={this.props.managedClasses.devTools_controls_tabs}>
                {this.renderTabItems()}
            </ul>
        );
    }

    private renderTabItems(): JSX.Element[] {
        return this.tabs.map((tabItem: tabType, index: number) => {
            return (
                <li key={index} className={this.getTabClassNames(tabItem)}>
                    <button onClick={this.handleChangeTab(tabItem)}>
                        {tabItem}
                    </button>
                </li>
            );
        });
    }

    private renderTabPanels(): JSX.Element {
        return (
            <div>
                {this.renderTabPanelItems()}
            </div>
        );
    }

    private renderTabPanelItems(): JSX.Element[] {
        return this.tabs.map((tabItem: tabType, index: number) => {
            return (
                <div
                    key={index}
                    aria-hidden={this.state.activeTab !== tabItem}
                    className={this.props.managedClasses.devTools_tabPanel}
                >
                    {this.renderTabPanelContent(tabItem)}
                </div>
            );
        });
    }

    private renderTabPanelContent(tabItem: tabType): JSX.Element {
        switch (tabItem) {
            case "code":
                return this.renderCode();
            case "properties":
                return this.renderProperties();
            case "schema":
                return this.renderSchema();
            default:
                return null;
        }
    }

    private renderCode(): JSX.Element {
        return (
            <CodePreview
                componentName={this.props.activeComponentName}
                childOptions={this.props.childOptions}
                framework={this.state.activeFramework}
                data={this.props.activeFormData}
            />
        );
    }

    private renderProperties(): JSX.Element {
        return <span>TBD</span>;
    }

    private renderSchema(): JSX.Element {
        return <span>TBD</span>;
    }

    private renderComponentFrameworkType(): JSX.Element {
        if (this.props.frameworks.length > 1) {
            return (
                <ul className={this.props.managedClasses.devTools_controls_framework}>
                    {this.renderComponentFrameworkTypeToggle()}
                </ul>
            );
        }

        return null;
    }

    private renderComponentFrameworkTypeToggle(): JSX.Element[] {
        return this.props.frameworks.map((framework: frameworkEnum, index: number) => {
            return (
                <li
                    key={index}
                    className={this.getFrameworkActiveClassName(framework)}
                >
                    <button
                        onClick={this.handleChangeFramework(framework)}
                        className={this.getFrameworkClassName(framework)}
                    />
                </li>
            );
        });
    }

    private getFrameworkClassName(framework: frameworkEnum): string {
        return framework === "angular"
            ? this.props.managedClasses.devTools_controls_framework_angular
            : this.props.managedClasses.devTools_controls_framework_react;
    }

    private getFrameworkActiveClassName(framework: frameworkEnum): string {
        return this.state.activeFramework === framework
            ? this.props.managedClasses.devTools_controls_framework__active
            : "";
    }

    private getTabClassNames(tabItem: tabType): string {
        if (tabItem === this.state.activeTab) {
            return `${this.props.managedClasses.devTools_tab} ${this.props.managedClasses.devTools_tab__active}`;
        }

        return this.props.managedClasses.devTools_tab;
    }

    private handleChangeFramework(framework: frameworkEnum): (e: React.MouseEvent<HTMLButtonElement>) => void {
        return (e: React.MouseEvent<HTMLButtonElement>): void => {
            this.setState({
                activeFramework: framework
            });
        };
    }

    private handleChangeTab(tab: tabType): (e: React.MouseEvent<HTMLButtonElement>) => void {
        return (e: React.MouseEvent<HTMLButtonElement>): void => {
            this.setState({
                activeTab: tab
            });
        };
    }
}

export default manageJss(style)(DevTools);
