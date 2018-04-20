import * as React from "react";
import manageJss, { ComponentStyles, IJSSManagerProps, IManagedClasses } from "@microsoft/fast-jss-manager-react";
import { IDevSiteDesignSystem } from "../design-system";

export interface ISiteMenuProps {
    slot: string;
}

export interface ISiteMenuState {
    visibility: boolean;
}

export interface ISiteNavManagedClasses {
    site_menu: string;
    site_menu_nav: string;
    site_menu_button: string;
    site_menu_button_svg: string;
}

const style: ComponentStyles<ISiteNavManagedClasses, IDevSiteDesignSystem> = {
    site_menu: {
        display: "inline-block",
        verticalAlign: "middle"
    },
    site_menu_nav: {
        position: "absolute",
        "&[aria-hidden=\"true\"]": {
            display: "none"
        }
    },
    site_menu_button: {
        width: "32px",
        height: "32px",
        padding: "3px",
        border: "none",
        background: "none"
    },
    site_menu_button_svg: {
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
            <div className={this.props.managedClasses.site_menu}>
                <button onClick={this.handleMenuVisibilityToggle} className={this.props.managedClasses.site_menu_button}>
                    <svg
                        id="Layer_1"
                        data-name="Layer 1"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 32 32"
                        className={this.props.managedClasses.site_menu_button_svg}
                    >
                        <title>waffle</title>
                        <path d="M6.2,10V6h4v4Zm0,8V14h4v4Zm0,8V22h4v4Zm8-16V6h4v4Zm0,8V14h4v4Zm0,8V22h4v4Zm8-20h4v4h-4Zm0,12V14h4v4Zm0,8V22h4v4Z"/>
                    </svg>
                </button>
                <nav className={this.props.managedClasses.site_menu_nav} {...this.getNavigationAttributes()}>
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
