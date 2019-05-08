import React from "react";
import { toPx } from "@microsoft/fast-jss-utilities";
import { get, set } from "lodash-es";
import devSiteDesignSystemDefaults, { DevSiteDesignSystem } from "../design-system";
import { applyScrollbarStyle } from "../../utilities";
import { CSSEditor, Form } from "@microsoft/fast-tooling-react";
import { CSSPropertyEditor } from "@microsoft/fast-tooling-react/dist/css-property-editor";
import manageJss, {
    ComponentStyles,
    ManagedClasses,
    ManagedJSSProps,
} from "@microsoft/fast-jss-manager-react";

export interface ConfigurationPanelProps {
    formChildOptions: any;
    schema: any;
    data: any;
    dataLocation: string;
    onChange: any;
    onLocationUpdate: (dataLocation: string) => void;
    styleEditing?: boolean;
}

export interface ConfigurationPanelManagedClasses {
    configurationPanel: string;
    configurationPanel_categoryTitle: string;
}

const style: ComponentStyles<ConfigurationPanelManagedClasses, DevSiteDesignSystem> = {
    configurationPanel: {
        width: "100%",
        height: "100%",
        overflowY: "auto",
        overflowX: "auto",
        color: (config: DevSiteDesignSystem): string => {
            return config.foreground300 || devSiteDesignSystemDefaults.foreground300;
        },
        ...applyScrollbarStyle(),
    },
    configurationPanel_categoryTitle: {
        fontSize: "12px",
        fontWeight: "400",
        padding: "5px 10px 6px",
        margin: "0 0 10px",
        borderBottom: "1px solid rgba(213, 213, 213, 0.3)",
        borderTop: "2px solid rgba(213, 213, 213, 0.3)",
    },
};

/* tslint:disable-next-line */
class ConfigurationPanel extends React.Component<
    ConfigurationPanelProps & ManagedClasses<ConfigurationPanelManagedClasses>,
    {}
> {
    public render(): JSX.Element {
        return (
            <div className={this.props.managedClasses.configurationPanel}>
                {this.renderForm()}
                {this.renderCSSEditor()}
                {this.renderCSSPropertyEditor()}
            </div>
        );
    }

    private renderForm(): React.ReactNode {
        return (
            <React.Fragment>
                {this.renderCategoryTitle("Properties")}
                <Form
                    jssStyleSheet={{ form: { height: "unset" } }}
                    schema={this.props.schema}
                    data={this.props.data}
                    onChange={this.props.onChange}
                    childOptions={this.props.formChildOptions}
                    location={{
                        dataLocation: this.props.dataLocation,
                        onChange: this.handleLocationUpdate,
                    }}
                />
            </React.Fragment>
        );
    }

    private renderCSSEditor(): React.ReactNode {
        if (!!this.props.styleEditing) {
            return (
                <React.Fragment>
                    {this.renderCategoryTitle("CSS")}
                    <CSSEditor
                        jssStyleSheet={{ cssEditor: { height: "unset" } }}
                        onChange={this.handleStyleChange}
                        data={this.getStyle()}
                    />
                </React.Fragment>
            );
        }

        return null;
    }

    private renderCSSPropertyEditor(): React.ReactNode {
        if (!!this.props.styleEditing) {
            return (
                <div style={{ padding: "0 10px" }}>
                    <h5 style={{ fontSize: "12px", fontWeight: 400, margin: "6px 0" }}>
                        Additional properties
                    </h5>
                    <CSSPropertyEditor
                        jssStyleSheet={{ cssPropertyEditor: { marginBottom: "20px" } }}
                        onChange={this.handleStyleChange}
                        data={this.getStyle()}
                    />
                </div>
            );
        }
    }

    private renderCategoryTitle(text: string): React.ReactNode {
        return (
            <h2 className={this.props.managedClasses.configurationPanel_categoryTitle}>
                {text}
            </h2>
        );
    }

    private getStyle(): any {
        return get(
            this.props.data,
            `${this.props.dataLocation}${this.props.dataLocation === "" ? "" : "."}style`
        );
    }

    private handleStyleChange = (updatedStyle: any): void => {
        this.props.onChange(
            set(
                this.props.data,
                `${this.props.dataLocation}${
                    this.props.dataLocation === "" ? "" : "."
                }style`,
                updatedStyle
            )
        );
    };

    private handleLocationUpdate = (dataLocation: string): void => {
        this.props.onLocationUpdate(dataLocation);
    };
}

export default manageJss(style)(ConfigurationPanel);
