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
    "@keyframes SiteNavigationOpen": string;
    "@keyframes SiteNavigationClose": string;
    siteMenu: string;
    siteMenu_nav: string;
    siteMenu_nav__open: string;
    siteMenu_nav__close: string;
    siteMenu_button: string;
    siteMenu_button__open: string;
    siteMenu_button__close: string;
    siteMenu_buttonGlyph__open: string;
    siteMenu_buttonGlyph__close: string;
    siteMenu_ul: string;
}

const style: ComponentStyles<ISiteNavManagedClasses, IDevSiteDesignSystem> = {
    "@keyframes SiteNavigationOpen": {
        "0%": {
            opacity: 0,
            transform: "scaleX(0.93)",
            height: "65vh"
        },
        "100%": {
            opacity: 1,
            transform: "scaleX(1)",
            height: "100vh"
        }
    },
    "@keyframes SiteNavigationClose": {
        "0%": {
            opacity: 1,
            transform: "scale(1)",
            height: "100vh"
        },
        "100%": {
            opacity: 0,
            transform: "scale(0.93)",
            height: "65vh"
        }
    },
    siteMenu: {
        display: "inline-block",
        verticalAlign: "middle"
    },
    siteMenu_nav: {
        position: "absolute",
        background: "#FFFFFF",
        zIndex: "5",
        height: "100vh",
        top: "0",
        left: "0",
        width: toPx(320),
        animationDuration: "0.25s",
        animationFillMode: "both",
        display: "none",
        boxShadow: `0 ${toPx(16)} ${toPx(24)} 0 rgba(0, 0, 0, 0.1)`
    },
    siteMenu_nav__open: {
        animationName: "SiteNavigationOpen",
        transitionTimingFunction: "cubic-bezier(.52,0,.74,0)"
    },
    siteMenu_nav__close: {
        animationName: "SiteNavigationClose",
        transitionTimingFunction: "cubic-bezier(.26,1,.48,1)"
    },
    siteMenu_button: {
        width: toPx(40),
        height: toPx(40),
        padding: toPx(7),
        border: "none",
        background: "none",
        transition: "all 0.1s ease-in-out",
        "&:focus": {
            border: (config: IDevSiteDesignSystem): string => {
                return `${toPx(1)} solid ${config.brandColor}`;
            },
            outline: "none"
        },
    },
    siteMenu_button__open: {
        "&:hover": {
            background: (config: IDevSiteDesignSystem): string => {
                return config.brandColor;
            },
        },
    },
    siteMenu_button__close: {
        "&:hover": {
            background: "rgba(0,0,0, .2)"
        },
    },
    siteMenu_buttonGlyph__open: {
        fill: (config: IDevSiteDesignSystem): string => {
            return config.backgroundColor;
        },
    },
    siteMenu_buttonGlyph__close: {
        fill: (config: IDevSiteDesignSystem): string => {
            return config.foregroundColor;
        },
    },
    siteMenu_ul: {
        listStyle: "none",
        padding: toPx(12)
    },
};

/* tslint:disable-next-line */
const waffleGlyph: string = "M6.2,10V6h4v4Zm0,8V14h4v4Zm0,8V22h4v4Zm8-16V6h4v4Zm0,8V14h4v4Zm0,8V22h4v4Zm8-20h4v4h-4Zm0,12V14h4v4Zm0,8V22h4v4Z";

class SiteMenu extends React.Component<ISiteMenuProps & IManagedClasses<ISiteNavManagedClasses>, ISiteMenuState> {
    private navPaneElement: React.RefObject<HTMLElement>;

    constructor(props: ISiteMenuProps & IManagedClasses<ISiteNavManagedClasses>) {
        super(props);

        this.state = {
            visibility: false
        };

        this.navPaneElement = React.createRef();
    }

    // tslint:disable
    public render(): JSX.Element {
        return (
            <div className={this.props.managedClasses.siteMenu}>
                {this.renderWaffleButton("open")}
                <nav
                    className={this.generateClassName()}
                    aria-hidden={!this.state.visibility}
                    ref={this.navPaneElement}
                >
                    {this.renderWaffleButton("close")}
                    <ul className={this.props.managedClasses.siteMenu_ul}>
                        {this.props.children}
                    </ul>
                </nav>
            </div>
        );
    }

    private renderWaffleButton(state: string): JSX.Element {
        const className: string = `${this.props.managedClasses.siteMenu_button} ${this.props.managedClasses[`siteMenu_button__${state}`]}`;

        return (
            <button
                onClick={this.handleMenuVisibilityToggle}
                aria-label={state}
                className={className}
            >
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 32 32"
                    className={this.props.managedClasses[`siteMenu_buttonGlyph__${state}`]}
                >
                    <title>waffle</title>
                    <path d={waffleGlyph}/>
                </svg>
            </button>
        )
    }

    private handleMenuVisibilityToggle = (): void => {
        this.setState({
            visibility: !this.state.visibility
        }, (): void => {
            if (this.state.visibility) {
                this.navPaneElement.current.style.display = "block";
            }

            this.navPaneElement.current.addEventListener("animationend", this.handleNavAnimationEnd);
        });
    }

    private handleNavAnimationEnd = (e: AnimationEvent) => {
        const element = this.navPaneElement.current;
        element.removeEventListener("animationend", this.handleNavAnimationEnd);

        if (!this.state.visibility) {
            element.style.display = "none";
        }
    }

    private generateClassName(): string {
        const className: string = this.props.managedClasses.siteMenu_nav;

        return this.state.visibility
            ? `${className} ${this.props.managedClasses.siteMenu_nav__open}`
            : `${className} ${this.props.managedClasses.siteMenu_nav__close}`
    }

}

export default manageJss(style)(SiteMenu);
