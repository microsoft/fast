import * as React from "react";
import { toPx } from "@microsoft/fast-jss-utilities";
import { IDevSiteDesignSystem } from "../design-system";
import { Link, withRouter } from "react-router-dom";
import { RouteComponentProps } from "react-router";
import { ComponentViewTypes } from "./component-view";
import { glyphExamples, glyphPage } from "@microsoft/fast-glyphs-msft";
import ComponentViewToggle from "./component-view-toggle";

export interface IActionBarProps extends RouteComponentProps<any> {
    /*
     * The current ComponentView of the app
     */
    componentView: ComponentViewTypes;

    /**
     * A callback to get called when the app/s ComponentView should be changed
     */
    onComponentViewChange: (type: ComponentViewTypes) => void;
}

class ActionBar extends React.Component<IActionBarProps, {}> {
    public render(): JSX.Element {
        return (
            <div style={{display: "flex"}}>
                <ComponentViewToggle
                    to={this.props.match.path}
                    onClick={this.onComponentViewChangeCallback(ComponentViewTypes.detail)}
                    label="View detail"
                    current={this.isAriaCurrent(ComponentViewTypes.detail)}
                    glyph={glyphPage}
                />
                <ComponentViewToggle
                    to={this.props.match.path + `${ComponentViewTypes[ComponentViewTypes.examples]}/`}
                    onClick={this.onComponentViewChangeCallback(ComponentViewTypes.examples)}
                    label="View examples"
                    current={this.isAriaCurrent(ComponentViewTypes.examples)}
                    glyph={glyphExamples}
                />
            </div>
        );
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

export default withRouter(ActionBar);
