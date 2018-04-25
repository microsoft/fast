import * as React from "react";
import manageJss, { ComponentStyles, IJSSManagerProps, IManagedClasses } from "@microsoft/fast-jss-manager-react";
import { toPx } from "@microsoft/fast-jss-utilities";
import { IDevSiteDesignSystem } from "../design-system";

export interface ISiteMenuProps {
    slot: string;
}

export interface ISiteMenuState {
    visibility: boolean;
}

export interface ISiteNavManagedClasses {
    siteMenu: string;
    siteMenu_nav: string;
    siteMenu_button: string;
    siteMenu_buttonGlyph: string;
}

const style: ComponentStyles<ISiteNavManagedClasses, IDevSiteDesignSystem> = {
    siteMenu: {
        display: "inline-block",
        verticalAlign: "middle"
    },
    siteMenu_nav: {
        position: "absolute",
        "&[aria-hidden=\"true\"]": {
            display: "none"
        }
    },
    siteMenu_button: {
        width: toPx(32),
        height: toPx(32),
        padding: toPx(3),
        border: "none",
        background: "none"
    },
    siteMenu_buttonGlyph: {
        fill: (config: IDevSiteDesignSystem): string => {
            return config.backgroundColor;
        },
    }
};

class SiteMenu extends React.Component<ISiteMenuProps & IManagedClasses<ISiteNavManagedClasses>, ISiteMenuState> {

    constructor(props: ISiteMenuProps & IManagedClasses<ISiteNavManagedClasses>) {
        super(props);

        this.state = {
            visibility: true
        };
    }

    // tslint:disable
    public render(): JSX.Element {
        return (
            <div className={this.props.managedClasses.siteMenu}>
                <button onClick={this.handleMenuVisibilityToggle} className={this.props.managedClasses.siteMenu_button}>
                    <svg
                        id="Layer_1"
                        data-name="Layer 1"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 32 32"
                        className={this.props.managedClasses.siteMenu_buttonGlyph}
                    >
                        <title>waffle</title>
                        <path d="M6.2,10V6h4v4Zm0,8V14h4v4Zm0,8V22h4v4Zm8-16V6h4v4Zm0,8V14h4v4Zm0,8V22h4v4Zm8-20h4v4h-4Zm0,12V14h4v4Zm0,8V22h4v4Z"/>
                    </svg>
                </button>
                <nav className={this.props.managedClasses.siteMenu_nav} {...this.getNavigationAttributes()}>
                    <ul>
                        {this.props.children}
                    </ul>
                </nav>
            </div>
        );
    }

    private handleMenuVisibilityToggle = (): void => {
        this.setState({
            visibility: !this.state.visibility
        });
    }

    private getNavigationAttributes(): any {
        return { "aria-hidden": this.state.visibility };
    }
}

export default manageJss(style)(SiteMenu);
