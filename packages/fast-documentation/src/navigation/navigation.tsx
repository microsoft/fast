import React from "react";
import manageJss, { ComponentStyles, DesignSystemProvider } from "@microsoft/fast-jss-manager-react";
import { ColumnClassNamesContract, Grid, Page, Column, GridAlignment } from "@microsoft/fast-layouts-react";
import { BrowserRouter as Router, Route, Link, RouteProps } from "react-router-dom";
import { INavData } from "../../app/data/site-data";
import { breakpoints, colors } from "../../app/data/default-vars";
import { black, white } from "@microsoft/fast-components-styles-msft/dist/utilities/color/color-constants";
import { applyFontWeightSemiBold, neutralForegroundRest } from "@microsoft/fast-components-styles-msft";
import { AccentButton, LightweightButton } from "@microsoft/fast-components-react-msft";
import { DesignSystem } from "src/design-system";

interface INavigationStyle {
    active: string;
    hamburger: string;
    hamburgerButton: string;
    animationProps: string;
    mobileNavActive: string;
    mobileNav: string;
    mobileNavItem: string;
    mobileNavLink: string;
    navigation: string;
    desktopNav: string;
    mobileNavBase: string;
    logoWrapper: string;
    logo: string;
    mobileHeader: string;
    navItem: string;
    navItems: string;
}

/* tslint:disable */
const FASTLogo = require("../../images/fast-dna.svg");
/* tslint:enable */
const navigationStyle: ComponentStyles<INavigationStyle, undefined> = {
    // TODO: remove typeface in favor of using SVG for hamburger nav menu
    "@font-face": {
        fontFamily: "MDL2",
        src: "url(https://www.microsoft.com/design/fonts/FWMDL2.ttf) format('truetype')"
    },
    "@global": {
        fontFamily: "'MDL2', 'Segoe MDL2 Assets'",
        position: "absolute"
    },
    logoWrapper: {
        position: "relative",
        zIndex: "1"
    },
    logo: {
        height: "54px",
        [`@media only screen and (min-width: ${breakpoints.vp3})`]: {
            height: "72px"
        }
    },
    active: {
        ...applyFontWeightSemiBold()
    },
    navigation: {
        top: "0",
        width: "100%",
        zIndex: "10",
        position: "absolute",
        "@media only screen and (max-width: 740px)": {
            padding: "0px"
        },
        "a:visited": {
            color: "white"
        },
        "a:active, a:focus": {
            fontWeight: applyFontWeightSemiBold()
        }
    },
    navItem: {
        color: neutralForegroundRest(() => "#000"),
        margin: "0px 16px"
    },
    mobileNavItem: {
        margin: "24px 0px"
    },
    mobileNavLink: {
        color: neutralForegroundRest(() => "#000"),
        textDecoration: "none"
    },
    navItems: {
        display: "flex",
        flexDirection: "row",
        width: "100%",
        marginLeft: "40px",
        [`@media only screen and (max-width: ${breakpoints.vp3})`]: {
            maxWidth: "500px"
        }
    },
    hamburgerButton: {
        display: "none",
        backgroundColor: "transparent",
        border: "none",
        [`@media only screen and (max-width: ${breakpoints.vp3})`]: {
            position: "relative",
            display: "block",
            marginLeft: "auto"
        }
    },
    hamburger: {
        fontSize: "26px",
        height: "28px",
        width: "26px",
        color: "#FFF",
        // TODO: remove typeface in favor of using SVG for hamburger nav menu
        fontFamily: '"MDL2", "Segoe MDL2 Assets", "SegoeMDL2Assets"'
    },
    desktopNav: {
        display: "flex",
        marginTop: "24px",
        [`@media only screen and (max-width: ${breakpoints.vp3})`]: { display: "none" }
    },
    mobileHeader: {
        marginTop: "24px",
        [`@media only screen and (min-width: ${breakpoints.vp3})`]: {
            display: "none"
        }
    },
    mobileNavBase: {
        height: "100vh",
        display: "block",
        position: "absolute",
        zIndex: "0",
        backgroundColor: "black",
        width: "100%",
        paddingTop: "100px",
        [`@media only screen and (min-width: ${breakpoints.vp3})`]: {
            display: "none"
        }
    },
    mobileNav: {
        top: "calc(-100vh - 100px)"
    },
    mobileNavActive: {
        top: "0px"
    },
    animationProps: {
        transition: "all 0.333s ease"
    }
};

function routeCheck(route: string, href: string): boolean {
    if (route === "/") {
        return route === href;
    }
    if (href) {
        const regex = /([aA-zZ-])\w+/g;
        const match = href.match(regex) && href.match(regex)!.join("");
        return route.includes(match!);
    }
    return false;
}

interface IMenuProps {
    isMobile: boolean;
    NavData: INavData;
    route: string;
    style: INavigationStyle;
}

function Menu({ isMobile, route, NavData, style }: IMenuProps): JSX.Element {
    const menu = Object.keys(NavData);

    if (isMobile) {
        return (
            <Column span={12} position={1}>
                {menu.map((item, index) => {
                    const menuItem = NavData[item];
                    const isActive = routeCheck(route, menuItem.href) ? style.active : "";
                    let node: React.ReactNode;

                    if (!!menuItem.external) {
                        node = (
                            <LightweightButton href={menuItem.href} className={`${isActive} ${style.mobileNavLink}`}>
                                {menuItem.text}
                            </LightweightButton>
                        );
                    } else {
                        node = (
                            <Link to={menuItem.href} className={`${isActive} ${style.mobileNavLink}`}>
                                {menuItem.text}
                            </Link>
                        );
                    }

                    return (
                        <div className={style.mobileNavItem} key={index}>
                            {node}
                        </div>
                    );
                })}
                <AccentButton href={"https://github.com/microsoft/fast-dna/"}>GitHub</AccentButton>
            </Column>
        );
    }

    return (
        <div style={{ display: "flex", width: "100%" }}>
            <div className={style.navItems}>
                {menu.map((item, index) => {
                    const menuItem = NavData[item];
                    const isActive = routeCheck(route, menuItem.href) ? style.active : "";
                    let node: React.ReactNode;

                    if (!!menuItem.external) {
                        node = (
                            <LightweightButton
                                href={menuItem.href}
                                key={index}
                                className={`${isActive} ${style.navItem}`}
                            >
                                {menuItem.text}
                            </LightweightButton>
                        );
                    } else {
                        node = (
                            <Link to={menuItem.href} key={index} className={`${isActive} ${style.navItem}`}>
                                {menuItem.text}
                            </Link>
                        );
                    }

                    return node;
                })}
                <AccentButton
                    href={"https://github.com/microsoft/fast-dna/"}
                    jssStyleSheet={{ button: { marginLeft: "auto" } }}
                >
                    GitHub
                </AccentButton>
            </div>
        </div>
    );
}

function useLockScroll(className: string, isOpen: boolean): void {
    React.useEffect(
        () => {
            if (document) {
                if (document.body) {
                    if (isOpen === true) {
                        document.body.setAttribute("style", "overflow: hidden");
                    } else {
                        document.body.setAttribute("style", "overflow: auto");
                    }
                }
            }
        },
        [isOpen]
    );
    // only run the effect if menu is open
}

interface INavigationProps {
    NavData: INavData;
    routeProps: RouteProps;
    managedClasses: INavigationStyle;
}
const navigationColumn: ComponentStyles<ColumnClassNamesContract, DesignSystem> = {
    column: { display: "inline-flex", alignItems: "center", width: "100%" }
};
const Navigation: React.FC<INavigationProps> = props => {
    const [isOpen, setOpen] = React.useState<boolean>(false);

    function toggleOpen() {
        setOpen(prev => !prev);
    }

    React.useEffect(
        () => {
            setOpen(false);
        },
        [props.routeProps.location.pathname]
    );

    useLockScroll("lockScroll", isOpen);

    return (
        <DesignSystemProvider designSystem={{ density: 2 }}>
            <Page className={props.managedClasses.navigation}>
                <Grid
                    gutter={16}
                    gridColumn={1}
                    className={`${props.managedClasses.animationProps} ${props.managedClasses.mobileNavBase} ${
                        isOpen ? props.managedClasses.mobileNavActive : props.managedClasses.mobileNav
                    }`}
                />
                <Grid
                    gutter={16}
                    className={`${props.managedClasses.animationProps} ${props.managedClasses.mobileNavBase} ${
                        isOpen ? props.managedClasses.mobileNavActive : props.managedClasses.mobileNav
                    }`}
                >
                    <Menu
                        NavData={props.NavData}
                        isMobile={true}
                        route={props.routeProps.location.pathname}
                        style={props.managedClasses}
                    />
                </Grid>
                <Grid gutter={16} className={props.managedClasses.mobileHeader} verticalAlign={GridAlignment.center}>
                    <Column position={1} span={12} jssStyleSheet={navigationColumn}>
                        <Link className={props.managedClasses.logoWrapper} to="/">
                            <img className={props.managedClasses.logo} src={FASTLogo} />
                        </Link>
                        <button className={props.managedClasses.hamburgerButton} onClick={toggleOpen}>
                            <span className={props.managedClasses.hamburger}>{`\uE700`}</span>
                        </button>
                    </Column>
                </Grid>
                <Grid gutter={16} className={props.managedClasses.desktopNav} verticalAlign={GridAlignment.center}>
                    <Column position={1} span={12} jssStyleSheet={navigationColumn}>
                        <Link to="/" className={props.managedClasses.logoWrapper}>
                            <img
                                className={props.managedClasses.logo}
                                src={FASTLogo}
                                alt={"FAST-DNA text in white"}
                                aria-label={"Home"}
                            />
                        </Link>
                        <Menu
                            NavData={props.NavData}
                            isMobile={false}
                            route={props.routeProps.location.pathname}
                            style={props.managedClasses}
                        />
                    </Column>
                </Grid>
            </Page>
        </DesignSystemProvider>
    );
};

export default manageJss(navigationStyle)(Navigation);
