import * as React from "react";
import {Link} from "react-router-dom";
import {IDevSiteDesignSystem} from "../design-system";
import manageJss, { ComponentStyles, IManagedClasses } from "@microsoft/fast-jss-manager-react";
import Toc from "./";

export interface ITocMenuProps {
    controls: string;
    active: boolean;
}

export interface ITocMenuState {
    active: boolean;
}

export interface ITocMenuManagedClasses {
    toc__menu: string;
    toc__menu__button: string;
}

// tslint:disable-next-line
const dropdownActive: string = "PHN2ZyBpZD0iTGF5ZXJfMSIgZGF0YS1uYW1lPSJMYXllciAxIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAzMiAzMiI+PHRpdGxlPmNoZXZyb24tZG93bjwvdGl0bGU+PHBhdGggZD0iTTMwLjUsNy4yOSwzMS45LDguNywxNi4yLDI0LjQuNSw4LjcsMS45LDcuMjlsMTQuMywxNC4zWiIvPjwvc3ZnPg==";
// tslint:disable-next-line
const dropdownInactive: string = "PHN2ZyBpZD0iTGF5ZXJfMSIgZGF0YS1uYW1lPSJMYXllciAxIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAzMiAzMiI+PHRpdGxlPmNoZXZyb24tcmlnaHQ8L3RpdGxlPjxwYXRoIGQ9Ik0yMi43OCwxNiw4LjI1LDEuNDUsOS42NSwwbDE2LDE2LTE2LDE2LTEuNC0xLjQxWiIvPjwvc3ZnPg==";

const style: ComponentStyles<ITocMenuManagedClasses, IDevSiteDesignSystem> = {
    toc__menu: {},
    toc__menu__button: {
        "&[aria-expanded='true']": {
            "&::after": {
                content: `url('data:image/svg+xml;base64,${dropdownActive}')`
            }
        },
        "&::after": {
            content: `url('data:image/svg+xml;base64,${dropdownInactive}')`,
            fill: "white",
            display: "inline-block",
            width: "16px",
            height: "16px",
            paddingLeft: "10px"
        }
    }
};

class TocMenu extends React.Component<ITocMenuProps & IManagedClasses<ITocMenuManagedClasses>, ITocMenuState> {

    constructor(props: ITocMenuProps & IManagedClasses<ITocMenuManagedClasses>) {
        super(props);

        this.state = {
            active: this.props.active
        };
    }

    public render(): JSX.Element {
        return (
            <React.Fragment>
                <button
                    className={this.props.managedClasses.toc__menu__button}
                    {...this.getButtonAttributes()}
                >
                    {this.props.children[0]}
                </button>
                <Toc id={this.props.controls} ariaHidden={!this.state.active}>
                    {this.props.children[1]}
                </Toc>
            </React.Fragment>
        );
    }

    private getButtonAttributes(): string {
        const attributes: any = {};

        attributes.onClick = this.handleButtonClick;

        attributes["aria-expanded"] = this.state.active;

        if (this.props.controls) {
            attributes["aria-controls"] = this.props.controls;
        }

        return attributes;
    }

    private handleButtonClick = (e: MouseEvent): void => {
        this.setState({
            active: !this.state.active
        });
    }
}

export default manageJss(style)(TocMenu);
