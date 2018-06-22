import * as React from "react";
import { toPx } from "@microsoft/fast-jss-utilities";
import { IDevSiteDesignSystem } from "../design-system";
import Form from "@microsoft/fast-form-generator-react";
import { Link, withRouter } from "react-router-dom";
import { RouteComponentProps } from "react-router";
import { ComponentViewTypes } from "./component-view";
import { glyphBuildingblocks, glyphExamples, glyphPage } from "@microsoft/fast-glyphs-msft";
import ComponentViewToggle from "./component-view-toggle";
import manageJss, { ComponentStyles, ICSSRules, IJSSManagerProps, IManagedClasses } from "@microsoft/fast-jss-manager-react";

export type tabType = "Presets" | "Properties";

export interface IConfigurationPanelProps {
    // onToggleView: () => void;
    // activeFormData: any;
    // activeSchema: any;
    // activeComponentName: string;
    formChildOptions: any;
    schema: any;
    data: any;
    onChange: any;
    activeTab?: tabType;
}

export interface IConfigurationPanelState {
    activeTab: tabType;
}

export interface IConfigurationPanelManagedClasses {
    configurationPanel: string;
    configurationPanel_controls: string;
    configurationPanel_controls_tabs: string;
    configurationPanel_tab: string;
    configurationPanel_tab__active: string;
    configurationPanel_tabPanel: string;
    site_paneForm: string;
}

const style: ComponentStyles<IConfigurationPanelManagedClasses, IDevSiteDesignSystem> = {
    configurationPanel: {
        width: "100%"
    },
    configurationPanel_controls: {
        display: "flex",
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
            height: toPx(38),
            padding: `${toPx(6)} ${toPx(8)}`,
            minWidth: toPx(25),
            backgroundPosition: "center"
        }
    },
    configurationPanel_controls_tabs: {
        flexGrow: "1"
    },
    configurationPanel_tab: {
        "& button": {
            background: "none",
            "&:focus": {
                outline: "none"
            }
        }
    },
    configurationPanel_tab__active: {
        "& button": {
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
    configurationPanel_tabPanel: {
        "&[aria-hidden=\"true\"]": {
            display: "none"
        }
    },
    site_paneForm: {
        padding: toPx(12)
    },
};

/* tslint:disable-next-line */
class ConfigurationPanel extends React.Component<IConfigurationPanelProps & IManagedClasses<IConfigurationPanelManagedClasses>, IConfigurationPanelState> {
    private tabs: tabType[];

    constructor(props: IConfigurationPanelProps & IManagedClasses<IConfigurationPanelManagedClasses>) {
        super(props);

        this.tabs = ["Presets", "Properties"];

        this.state = {
            activeTab: this.props.activeTab || "Presets"
        };
    }

    public render(): JSX.Element {
        return (
            <div className={this.props.managedClasses.configurationPanel}>
                <div className={this.props.managedClasses.configurationPanel_controls}>
                    {this.renderTabs()}
                </div>
                {this.renderTabPanels()}
            </div>
        );
    }

    private renderTabs(): JSX.Element {
        return (
            <ul className={this.props.managedClasses.configurationPanel_controls_tabs}>
                {this.renderTabItems()}
            </ul>
        );
    }

    private renderTabItems(): JSX.Element[] {
        return this.tabs.map((tabItem: tabType, index: number) => {
            if (tabItem === "Presets" || tabItem === "Properties") {
                return (
                    <li key={index} className={this.getTabClassNames(tabItem)}>
                        <button onClick={this.handleChangeTab(tabItem)}>
                            {tabItem}
                        </button>
                    </li>
                );
            }
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
                    className={this.props.managedClasses.configurationPanel_tabPanel}
                >
                    {this.renderTabPanelContent(tabItem)}
                </div>
            );
        });
    }

    private renderTabPanelContent(tabItem: tabType): JSX.Element {
        switch (tabItem) {
            case "Presets":
                return this.renderPresets();
            case "Properties":
                return this.renderProperties();
            default:
                return null;
        }
    }

    private renderPresets(): JSX.Element {
        return (
            <Form
                className={this.props.managedClasses.site_paneForm}
                schema={this.props.schema}
                data={this.props.data}
                onChange={this.props.onChange}
                childOptions={this.props.formChildOptions}
            />
        );
    }

    private renderProperties(): JSX.Element {
        return <span>TBD</span>;
    }

    private getTabClassNames(tabItem: tabType): string {
        if (tabItem === this.state.activeTab) {
            return `${this.props.managedClasses.configurationPanel_tab} ${this.props.managedClasses.configurationPanel_tab__active}`;
        }

        return this.props.managedClasses.configurationPanel_tab;
    }

    private handleChangeTab(tab: tabType): (e: React.MouseEvent<HTMLButtonElement>) => void {
        return (e: React.MouseEvent<HTMLButtonElement>): void => {
            this.setState({
                activeTab: tab
            });
        };
    }
}

export default manageJss(style)(ConfigurationPanel);
