import React from "react";
import manageJss, { ComponentStyles } from "@microsoft/fast-jss-manager-react";
import { ColumnClassNamesContract } from "@microsoft/fast-layouts-react";
import {
    Background,
    CallToAction,
    CallToActionAppearance,
    Divider,
    DividerRoles,
    Heading,
    HeadingClassNameContract,
    HeadingSize,
    HeadingTag
} from "@microsoft/fast-components-react-msft";
import { DesignSystem } from "src/design-system";
import { applyScaledTypeRamp, neutralForegroundRest } from "@microsoft/fast-components-styles-msft";
import { breakpoints } from "../../app/data/default-vars";

const heroColumn: ComponentStyles<ColumnClassNamesContract, undefined> = {
    column: {}
};

interface HeroClassNameContract {
    hero: string;
    headingWrapper: string;
    imageZ0: string;
}

const heroStyles: ComponentStyles<HeroClassNameContract, undefined> = {
    hero: {
        height: "100vh",
        position: "relative",
        overflow: "hidden",
        minHeight: "650px",
        title: {
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            height: "100%"
        }
    },
    headingWrapper: {
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        textAlign: "center",
        height: "100vh",
        minHeight: "650px",
        position: "relative",
        zIndex: "5",
        padding: "0 5%"
    },
    imageZ0: {
        position: "absolute",
        top: "0",
        left: "0",
        zIndex: "0",
        minWidth: "100%",
        height: "100vh",
        overflow: "hidden"
    }
};

const headingStyles: ComponentStyles<HeadingClassNameContract, DesignSystem> = {
    heading__3: {
        position: "relative",
        [`@media only screen and (max-width: ${breakpoints.vp2Max})`]: {
            ...applyScaledTypeRamp("t5")
        }
    }
};

const designSystemMergingFunction: (config: DesignSystem) => DesignSystem = (config: DesignSystem): DesignSystem =>
    Object.assign({}, config, { backgroundColor: "#C22551", density: 2 });

const BaseHero: React.FC<{
    managedClasses: HeroClassNameContract;
    foregroundPosition?: { top?: string; right?: string; left?: string; bottom?: string };
    srcBackground?: (className: string) => React.ReactNode;
    text: string;
    backgroundColor?: string;
    tall?: boolean;
    destination: string;
    callToAction: string;
}> = (props: any): JSX.Element => {
    return (
        <Background
            className={props.managedClasses.hero}
            value={props.backgroundColor}
            designSystemMergingFunction={designSystemMergingFunction}
        >
            {typeof props.srcBackground === "function" ? props.srcBackground(props.managedClasses.imageZ0) : null}
            <div className={props.managedClasses.headingWrapper}>
                <Heading jssStyleSheet={headingStyles} size={HeadingSize._3} tag={HeadingTag.h1}>
                    {props.text}
                </Heading>
                <Divider
                    jssStyleSheet={{
                        divider: {
                            marginTop: "48px",
                            width: "100%",
                            maxWidth: "1299px",
                            borderColor: neutralForegroundRest(() => "#000"),
                            [`@media only screen and (max-width: ${breakpoints.vp2Max})`]: {
                                marginTop: "24px"
                            }
                        }
                    }}
                    role={DividerRoles.presentation}
                />
                <CallToAction
                    href={props.destination}
                    appearance={CallToActionAppearance.lightweight}
                    jssStyleSheet={{
                        callToAction: {
                            marginTop: "48px",
                            [`@media only screen and (max-width: ${breakpoints.vp2Max})`]: {
                                marginTop: "24px"
                            }
                        }
                    }}
                >
                    {props.callToAction}
                </CallToAction>
            </div>
        </Background>
    );
};

export const Hero: any = manageJss(heroStyles)(BaseHero);
