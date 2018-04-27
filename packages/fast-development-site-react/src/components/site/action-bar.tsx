import * as React from "react";
import { toPx } from "@microsoft/fast-jss-utilities";
import { IDevSiteDesignSystem } from "../design-system";
import { Link, withRouter } from "react-router-dom";
import { RouteComponentProps } from "react-router";
import { ComponentViewTypes } from "./component-view";

export interface IActionBarProps extends RouteComponentProps<any> {
    onComponentViewChange: (type: ComponentViewTypes) => void;
}

class ActionBar extends React.Component<IActionBarProps, {}> {
    public render(): JSX.Element {
        return (
            <div>
                <Link
                    to={this.props.match.path}
                    onClick={this.onComponentViewChangeCallback(ComponentViewTypes.detail)}
                >
                        View detail
                </Link>
                <Link
                    to={this.props.match.path + `${ComponentViewTypes[ComponentViewTypes.examples]}/`}
                    onClick={this.onComponentViewChangeCallback(ComponentViewTypes.examples)}
                >
                   View examples
                </Link>
            </div>
        );
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
