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
    '@keyframes open-animation': string;
    '@keyframes close-animation': string;
    siteMenu: string;
    siteMenu_nav: string;
    siteMenu_nav__open: string;
    siteMenu_nav__close: string;
    siteMenu_button: string;
    siteMenu_button_open: string;
    siteMenu_buttonGlyph: string;
    siteMenu_buttonGlyph_open: string;
    siteMenu_ul: string;
}

const style: ComponentStyles<ISiteNavManagedClasses, IDevSiteDesignSystem> = {
    '@keyframes open-animation': {
        from: {opacity: 0},
        to: {opacity: 1}
    },
    '@keyframes close-animation': {
        from: {opacity: 1},
        to: {opacity: 0}
    },
    siteMenu: {
        display: "inline-block",
        verticalAlign: "middle"
    },
    siteMenu_nav: {
        position: "absolute",
        background: "#FFFFFF",
        zIndex: "5",
        height: "calc(100vh)",
        top: "0",
        left: "0",
        width: toPx(320),
        animationName: "my-animation",
        animationDuration: "4s",
        boxShadow: `0 ${toPx(16)} ${toPx(24)} 0 rgba(0, 0, 0, 0.1)`,
        "&[aria-hidden=\"true\"]": {
            display: "none"
        }
    },
    siteMenu_nav__open: {
        animationName: "open-animation"
    },
    siteMenu_nav__close: {
        animationName: "close-animation"
    },
    siteMenu_button: {
        width: toPx(32),
        height: toPx(32),
        padding: toPx(3),
        border: "none",
        background: "none"
    },
    siteMenu_button_open: {
        width: toPx(32),
        height: toPx(32),
        padding: toPx(3),
        margin: `${toPx(7)} 0 0 ${toPx(3)}`,
        border: "none",
        background: "none"
    },
    siteMenu_buttonGlyph: {
        fill: (config: IDevSiteDesignSystem): string => {
            return config.backgroundColor;
        },
    },
    siteMenu_buttonGlyph_open: {
        fill: (config: IDevSiteDesignSystem): string => {
            return config.foregroundColor;
        },
    },
    siteMenu_ul: {
        listStyle: "none",
        padding: toPx(12)
    },
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
                <button onClick={this.handStuff} className={this.props.managedClasses.siteMenu_button}>
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
                <nav className={this.generateClassName()} {...this.getNavigationAttributes()}>
                    <button onClick={this.handStuff} className={this.props.managedClasses.siteMenu_button_open}>
                        <svg
                            id="Layer_1"
                            data-name="Layer 1"
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 32 32"
                            className={this.props.managedClasses.siteMenu_buttonGlyph_open}
                        >
                            <title>waffle</title>
                            <path d="M6.2,10V6h4v4Zm0,8V14h4v4Zm0,8V22h4v4Zm8-16V6h4v4Zm0,8V14h4v4Zm0,8V22h4v4Zm8-20h4v4h-4Zm0,12V14h4v4Zm0,8V22h4v4Z"/>
                        </svg>
                    </button>
                    <ul className={this.props.managedClasses.siteMenu_ul}>
                        {this.props.children}
                    </ul>
                </nav>
            </div>
        );
    }

    private handStuff = (): void => {
        window.requestAnimationFrame(this.handleMenuVisibilityToggle);
    }

    private handleMenuVisibilityToggle = (): void => {
        this.setState({
            visibility: !this.state.visibility
        });
        if(this.state.visibility){
            window.requestAnimationFrame(this.handleMenuVisibilityToggle);
        }
    }

    private generateClassName(): string {
        const className: string = this.props.managedClasses.siteMenu_nav;

        return this.state.visibility
            ? `${className} ${this.props.managedClasses.siteMenu_nav__close}`
            : `${className} ${this.props.managedClasses.siteMenu_nav__open}`
    }

    private getNavigationAttributes(): any {
        return { "aria-hidden": this.state.visibility };
    }
}

export default manageJss(style)(SiteMenu);
