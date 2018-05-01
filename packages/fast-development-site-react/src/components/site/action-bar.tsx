import * as React from "react";
import { toPx } from "@microsoft/fast-jss-utilities";
import { IDevSiteDesignSystem } from "../design-system";
import { Link, withRouter } from "react-router-dom";
import { RouteComponentProps } from "react-router";
import { ComponentViewTypes } from "./component-view";
import { glyphBuildingblocks, glyphExamples, glyphPage } from "@microsoft/fast-glyphs-msft";
import ComponentViewToggle from "./component-view-toggle";
import manageJss, { ComponentStyles, ICSSRules, IJSSManagerProps, IManagedClasses } from "@microsoft/fast-jss-manager-react";

export interface IActionBarProps extends RouteComponentProps<any> {
    /*
     * The current ComponentView of the app
     */
    componentView: ComponentViewTypes;

    /**
     * The current viewable state of the Form
     */
    formView: boolean;

    /**
     * A callback to get called when the app's ComponentView should be changed
     */
    onComponentViewChange: (type: ComponentViewTypes) => void;

    /**
     * A callback to get called when the pane containing the form changes visibility
     */
    onFormToggle: () => void;
}

export interface IActionBarClassNameContract {
    actionBar: string;
    actionBar_componentViewToggles: string;
    actionBar_menu: string;
    actionBar_menu_button: string;
    actionBar_menu_button__active: string;
}

function menuButtonBase(): ICSSRules<IDevSiteDesignSystem> {
    return {
        position: "relative",
        height: "40px",
        border: "none",
        background: "none",
        padding: "0",
        "& span": {
            width: "16px",
            height: "16px",
            marginRight: "5px",
            display: "inline-block",
            fontSize: "16px",
            verticalAlign: "text-bottom"
        }
    };
}

const styles: ComponentStyles<IActionBarClassNameContract, IDevSiteDesignSystem> = {
    actionBar: {
        display: "flex",
    },
    actionBar_componentViewToggles: {
        display: "flex",
        justifyContent: "flex-end",
        flexGrow: "1"
    },
    actionBar_menu: {
        flexGrow: "1"
    },
    actionBar_menu_button: {
        ...menuButtonBase()
    },
    actionBar_menu_button__active: {
        ...menuButtonBase(),
        "&:after": {
            content: "''",
            position: "absolute",
            display: "block",
            width: "100%",
            bottom: "0",
            height: "2px",
            // TODO: use callback with brand-color when #342 is fixed
            background: "pink"
        }
    }
};

class ActionBar extends React.Component<IActionBarProps & IManagedClasses<IActionBarClassNameContract>, {}> {
    public render(): JSX.Element {
        return (
            <div className={this.props.managedClasses.actionBar}>
                <div className={this.props.managedClasses.actionBar_menu}>
                    <button className={this.getActionBarMenuButtonClassNames()} onClick={this.props.onFormToggle}>
                        <span dangerouslySetInnerHTML={{__html: glyphBuildingblocks}} />
                        Configure
                    </button>
                </div>
                <div className={this.props.managedClasses.actionBar_componentViewToggles}>
                    <ComponentViewToggle
                        to={this.props.match.path}
                        onClick={this.onComponentViewChangeCallback(ComponentViewTypes.detail)}
                        label="View detail"
                        current={this.isAriaCurrent(ComponentViewTypes.detail)}
                        glyph={glyphPage}
                    />
                    <ComponentViewToggle
                        to={`${this.props.match.path}${ComponentViewTypes[ComponentViewTypes.examples]}/`}
                        onClick={this.onComponentViewChangeCallback(ComponentViewTypes.examples)}
                        label="View examples"
                        current={this.isAriaCurrent(ComponentViewTypes.examples)}
                        glyph={glyphExamples}
                    />
                </div>
            </div>
        );
    }

    private getActionBarMenuButtonClassNames(): string {
        if (this.props.formView) {
            return this.props.managedClasses.actionBar_menu_button__active;
        }

        return this.props.managedClasses.actionBar_menu_button;
    }

    private isAriaCurrent(type: ComponentViewTypes): boolean {
        return this.props.componentView === type;
    }

    /**
     * Get a function to call callback with a passed param
     */
    private onComponentViewChangeCallback(type: ComponentViewTypes): (e: React.MouseEvent<HTMLAnchorElement>) => void {
        return (e: React.MouseEvent<HTMLAnchorElement>): void => {
            if (typeof this.props.onComponentViewChange === "function") {
                this.props.onComponentViewChange(type);
            }
        };
    }
}

export default withRouter(manageJss(styles)(ActionBar));
