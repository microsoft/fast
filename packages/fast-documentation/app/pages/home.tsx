import React, { HTMLAttributes } from "react";
import ReactDOM from "react-dom";
import manageJss, { ComponentStyles, ManagedClasses } from "@microsoft/fast-jss-manager-react";
import { Column, ColumnClassNamesContract, Grid, Page } from "@microsoft/fast-layouts-react";
import Foundation, { HandledProps } from "@microsoft/fast-components-foundation-react";
import { Banner, BannerProps, ContentPlacement, DesignSystem, Feature, FeatureProps, SectionDivider } from "../../src";
import {
    Heading,
    HeadingClassNameContract,
    HeadingSize,
    HeadingTag,
    LightweightButton
} from "@microsoft/fast-components-react-msft";
import { Hero } from "../../src/hero/hero";
import { VerticalHeight } from "../../src/vertical-height/vertical-height";
import {
    animationContent,
    colorsContent,
    compositionContent,
    designSystemsContent,
    discordContent,
    heroBackground,
    layoutGridContent,
    mediumContent,
    otherUtiltiesContent,
    technologyContent,
    twitterContent,
    webStandardsContent
} from "../data/homepage.data";

const columnTestStyles: ComponentStyles<ColumnClassNamesContract, undefined> = {
    column: {
        minHeight: "30px",
        margin: "4px 0"
    }
};

const headerTwoStyles: ComponentStyles<HeadingClassNameContract, undefined> = {
    heading: {
        padding: "20px 0px"
    }
};

const HomePageStyles: ComponentStyles<HomePageClassNameContract, DesignSystem> = {
    // move these
    "@font-face": {
        fontFamily: "SegoeUIVF",
        src:
            "url(https://res.cloudinary.com/fast-dna/raw/upload/v1558051831/SegoeUI-Roman-VF_web.ttf) format('truetype')",
        fontWeight: "1 1000"
    },
    "@global": {
        body: {
            fontFamily: "SegoeUIVF, Segoe UI, SegoeUI, Helvetica Neue, Helvetica, Arial, sans-serif",
            margin: "0",
            padding: "0",
            background: (config: DesignSystem): string => config.backgroundColor
        }
    },
    homePage: {}
};

export interface HomePageClassNameContract {
    homePage?: string;
}

export interface HomePageHandledProps extends ManagedClasses<HomePageClassNameContract> {}

export interface HomePageUnhandledProps extends HTMLAttributes<HTMLDivElement> {}
/**
 * Images
 */
/* tslint:disable */
// const heroImage = require("../../images/site-background.svg");
const featureVideo = require("../../images/AdaptiveUIScreens.mp4");
/* tslint:enable */

// const heroBackground: (className: string) => React.ReactNode = (className: string): React.ReactNode => <object className={className} data={heroImage} type="image/svg+xml" />;

const bannerProps: BannerProps = {
    backgroundColor: "#C22551",
    drawBackground: false,
    title: {
        children: "Get started on Github"
    },
    abstract: {
        children:
            "Explore the FAST mono repository on Github and try out our components, utilities, and tools. Or, mix-and-match with your own solutions."
    },
    action: {
        href: "https://github.com/microsoft/fast-dna/"
    },
    style: {
        background: "linear-gradient(90deg, rgba(251,53,109,1) 8%, rgba(0,35,94,1) 100%)"
    }
};

const featureExampleProps: FeatureProps = {
    badge: "COMPONENTS",
    heading: {
        children: "One component, many faces"
    },
    paragraph: {
        children:
            "Using an unopinionated architecture and Adaptive Styling, one suite of components can blend into any environment."
    },
    action: (className: string): React.ReactNode => (
        <LightweightButton className={className} href={"https://explore.fast.design"}>
            View Component Explorer
        </LightweightButton>
    ),
    image: (className: string): React.ReactNode => (
        <video
            className={className}
            role="img"
            aria-label={"Video of the Edge browser themes switching from light to dark"}
            autoPlay={true}
            loop={true}
        >
            <source src={featureVideo} type="video/mp4" />
        </video>
    )
};

class BaseHomePage extends Foundation<HomePageHandledProps, HomePageUnhandledProps, {}> {
    public static displayName: string = "HomePage";

    protected handledProps: HandledProps<HomePageHandledProps> = {
        managedClasses: void 0
    };

    /**
     * Renders the component
     */
    public render(): React.ReactNode {
        return (
            <div className={super.generateClassNames(this.props.managedClasses.homePage)}>
                <Hero
                    srcBackground={heroBackground}
                    backgroundColor={"#1B1B1B"}
                    destination={"https://explore.fast.design"}
                    callToAction={"EXPLORE COMPONENTS"}
                    text="An unopinionated system to build adaptive interfaces."
                />
                <Page jssStyleSheet={{ page: { position: "relative", marginTop: "-30vh" } }}>
                    <Grid gutter={16}>{this.components()}</Grid>

                    <Grid gutter={16}>{this.utilities()}</Grid>

                    <Grid gutter={16} row={3}>
                        {this.community()}
                    </Grid>
                </Page>
                <Banner {...bannerProps} />
            </div>
        );
    }

    /**
     * Generates the "components" section
     */
    private components(): React.ReactNode {
        return (
            <React.Fragment>
                <VerticalHeight height={5} row={1} />
                <Column jssStyleSheet={columnTestStyles} span={12} row={2}>
                    <Feature {...featureExampleProps} />
                </Column>
                <VerticalHeight height={5} row={3} />
                <Column jssStyleSheet={columnTestStyles} span={[12, 6, 6, 3]} row={4}>
                    <ContentPlacement {...compositionContent} />
                </Column>
                <Column jssStyleSheet={columnTestStyles} span={[12, 6, 6, 3]} row={[5, 4, 4]}>
                    <ContentPlacement {...designSystemsContent} />
                </Column>
                <Column jssStyleSheet={columnTestStyles} span={[12, 6, 6, 3]} row={[6, 5, 5, 4]}>
                    <ContentPlacement {...technologyContent} />
                </Column>
                <Column jssStyleSheet={columnTestStyles} span={[12, 6, 6, 3]} row={[7, 5, 5, 4]}>
                    <ContentPlacement {...webStandardsContent} />
                </Column>
                <VerticalHeight height={5} row={8} />
            </React.Fragment>
        );
    }

    /**
     * Generates the "utilities" section
     */
    private utilities(): React.ReactNode {
        return (
            <React.Fragment>
                <Column jssStyleSheet={columnTestStyles} span={[12, 12, 4]} row={7}>
                    <Heading jssStyleSheet={headerTwoStyles} tag={HeadingTag.h2} size={HeadingSize._3}>
                        Utilities
                    </Heading>
                </Column>
                <Column jssStyleSheet={columnTestStyles} span={[12, 6, 6, 3]} row={8}>
                    <ContentPlacement {...animationContent} />
                </Column>
                <Column jssStyleSheet={columnTestStyles} span={[12, 6, 6, 3]} row={[9, 8, 8]}>
                    <ContentPlacement {...colorsContent} />
                </Column>
                <Column jssStyleSheet={columnTestStyles} span={[12, 6, 6, 3]} row={[10, 9, 9, 8]}>
                    <ContentPlacement {...layoutGridContent} />
                </Column>
                <Column jssStyleSheet={columnTestStyles} span={[12, 6, 6, 3]} row={[11, 9, 9, 8]}>
                    <ContentPlacement {...otherUtiltiesContent} />
                </Column>
            </React.Fragment>
        );
    }

    /**
     * Generates the "community" section
     */
    private community(): React.ReactNode {
        return (
            <React.Fragment>
                <VerticalHeight height={8} row={9} />
                <Column jssStyleSheet={columnTestStyles} span={[12, 12, 4]} row={10}>
                    <Heading jssStyleSheet={headerTwoStyles} tag={HeadingTag.h2} size={HeadingSize._3}>
                        Community
                    </Heading>
                </Column>
                <Column jssStyleSheet={columnTestStyles} span={[12, 12, 4]} row={11}>
                    <ContentPlacement
                        jssStyleSheet={{ contentPlacement_image: { height: "80px" } }}
                        {...discordContent}
                    />
                </Column>
                <Column jssStyleSheet={columnTestStyles} span={[12, 12, 4]} row={[12, 12, 11]}>
                    <ContentPlacement
                        jssStyleSheet={{ contentPlacement_image: { height: "80px" } }}
                        {...twitterContent}
                    />
                </Column>
                <Column jssStyleSheet={columnTestStyles} span={[12, 12, 4]} row={[13, 13, 11]}>
                    <ContentPlacement
                        jssStyleSheet={{ contentPlacement_image: { height: "80px" } }}
                        {...mediumContent}
                    />
                </Column>
                <VerticalHeight height={5} row={18} />
            </React.Fragment>
        );
    }
}

/* tslint:disable-next-line:typedef */
const HomePage = manageJss(HomePageStyles)(BaseHomePage);
type HomePage = InstanceType<typeof HomePage>;

export { HomePage };
