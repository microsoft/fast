import React from "react";
import { ContentPlacementProps } from "../../src";
import { LightweightButton } from "@microsoft/fast-components-react-msft";

/**
 * Images
 */
/* tslint:disable */
const animationUtilsImage = require("../../images/animation.svg");
const colorUtilsImage = require("../../images/colors.svg");
const gridUtilsImage = require("../../images/grids.svg");
const moreUtilsImage = require("../../images/more.svg");
/* tslint:enable */

/**
 * Components content
 */
export const compositionContent: ContentPlacementProps = {
    heading: {
        children: "Composition"
    },
    paragraph: {
        children:
            "Create new component compositions by nesting, styling base components, and passing unhandled props. The combinations are endless."
    }
};
export const designSystemsContent: ContentPlacementProps = {
    heading: {
        children: "Design systems"
    },
    paragraph: {
        children:
            "Use Fluent by default or customize design system properties to make it your own. Or, create your own design system to use with FAST components."
    }
};
export const technologyContent: ContentPlacementProps = {
    heading: {
        children: "Technology"
    },
    paragraph: {
        children:
            "Out of the box, FAST components are built on React, but you can build components on any modern framework using the FAST system."
    }
};
export const webStandardsContent: ContentPlacementProps = {
    heading: {
        children: "Web standards"
    },
    paragraph: {
        children:
            "All FAST components follow WCAG 2.1, are W3C spec-compliant and use the W3C interaction models when available."
    }
};

/**
 * Utilities content
 */
export const animationContent: ContentPlacementProps = {
    heading: {
        children: "Animation"
    },
    paragraph: {
        children:
            "Design sophisticated animation sequences with the animation library, an interface for the Web Animations API."
    },
    action: (className: string): React.ReactNode => {
        return (
            <div className={className}>
                <LightweightButton href={"https://www.fast.design/docs/en/packages/fast-animation/"}>
                    Documentation
                </LightweightButton>
                <LightweightButton href={"https://github.com/microsoft/fast-dna/tree/master/packages/fast-animation"}>
                    GitHub
                </LightweightButton>
            </div>
        );
    },
    image: (className: string): React.ReactNode => (
        <img className={className} src={animationUtilsImage} alt={"green orb representing motion"} />
    )
};

export const colorsContent: ContentPlacementProps = {
    heading: {
        children: "Colors"
    },
    paragraph: {
        children:
            "Create color palettes, extract colors from images, and handle other color operations using our color library."
    },
    action: (className: string): React.ReactNode => {
        return (
            <div className={className}>
                <LightweightButton href={"https://www.fast.design/docs/en/packages/fast-colors/"}>
                    Documentation
                </LightweightButton>
                <LightweightButton href={"https://github.com/microsoft/fast-dna/tree/master/packages/fast-colors"}>
                    GitHub
                </LightweightButton>
            </div>
        );
    },
    image: (className: string): React.ReactNode => (
        <img
            className={className}
            src={colorUtilsImage}
            alt={"controls representing color swatches and computer monitors"}
        />
    )
};

export const layoutGridContent: ContentPlacementProps = {
    heading: {
        children: "Layout & Grid"
    },
    paragraph: {
        children: "Build layouts such as a 12 column grid for content or an application grid with resizable panels."
    },
    action: (className: string): React.ReactNode => {
        return (
            <div className={className}>
                <LightweightButton href={"https://www.fast.design/docs/en/packages/fast-layouts-react/"}>
                    Documentation
                </LightweightButton>
                <LightweightButton
                    href={"https://github.com/microsoft/fast-dna/tree/master/packages/fast-layouts-react"}
                >
                    GitHub
                </LightweightButton>
            </div>
        );
    },
    image: (className: string): React.ReactNode => (
        <img
            className={className}
            src={gridUtilsImage}
            alt={"seven pink lines of varying length representing a grid"}
        />
    )
};

export const otherUtiltiesContent: ContentPlacementProps = {
    heading: {
        children: "Other useful utilities"
    },
    paragraph: {
        children:
            "Leverage a toolkit of general utilities such as keyboarding, Right-To-Left (RTL), number, and string manipulation."
    },
    action: (className: string): React.ReactNode => {
        return (
            <div className={className}>
                <LightweightButton href={"https://www.fast.design/docs/en/packages/fast-web-utilities/"}>
                    Documentation
                </LightweightButton>
                <LightweightButton
                    href={"https://github.com/microsoft/fast-dna/tree/master/packages/fast-web-utilities"}
                >
                    GitHub
                </LightweightButton>
            </div>
        );
    },
    image: (className: string): React.ReactNode => (
        <img className={className} src={moreUtilsImage} alt={"four gradient blue half circles"} />
    )
};

/**
 * Community content
 */
export const discordContent: ContentPlacementProps = {
    heading: {
        children: "Discord"
    },
    paragraph: {
        children:
            "Join our active community on Discord. Follow the latest updates and contributions, ask questions, give feedback, or keep up on our reading list."
    },
    action: (className: string): React.ReactNode => (
        <LightweightButton href={"https://discord.gg/FcSNfg4"} className={className}>
            Join our discord community
        </LightweightButton>
    ),
    image: (className: string): React.ReactNode => {
        return (
            <svg className={className} width="91" height="106" viewBox="0 0 91 106" xmlns="http://www.w3.org/2000/svg">
                <path d="M35.8297 45.0969C32.8463 45.0969 30.491 47.5184 30.491 50.4727C30.491 53.4269 32.8986 55.8484 35.8297 55.8484C38.8131 55.8484 41.1685 53.4269 41.1685 50.4727C41.2208 47.5184 38.8131 45.0969 35.8297 45.0969ZM54.934 45.0969C51.9506 45.0969 49.5953 47.5184 49.5953 50.4727C49.5953 53.4269 52.003 55.8484 54.934 55.8484C57.9174 55.8484 60.2728 53.4269 60.2728 50.4727C60.2728 47.5184 57.9174 45.0969 54.934 45.0969Z" />
                <path d="M80.1313 0.657959H10.6323C4.77157 0.657959 0 5.4717 0 11.4365V82.1776C0 88.1424 4.77157 92.9561 10.6323 92.9561H69.4472L66.6983 83.2764L73.337 89.5028L79.6127 95.363L90.7636 105.304V11.4365C90.7636 5.4717 85.9921 0.657959 80.1313 0.657959ZM60.1115 68.9921C60.1115 68.9921 58.2443 66.7422 56.6884 64.7539C63.4827 62.818 66.0759 58.5275 66.0759 58.5275C63.9495 59.9402 61.9267 60.9343 60.1115 61.6145C57.5182 62.7133 55.0287 63.4458 52.591 63.8644C47.612 64.8063 43.0479 64.5446 39.158 63.8121C36.2017 63.2366 33.6603 62.3994 31.5339 61.5622C30.341 61.0913 29.0444 60.5157 27.7477 59.7832C27.5921 59.6786 27.4366 59.6262 27.281 59.5216C27.1772 59.4693 27.1254 59.417 27.0735 59.3646C26.1399 58.8414 25.6213 58.4751 25.6213 58.4751C25.6213 58.4751 28.1108 62.661 34.6976 64.6493C33.1417 66.6376 31.2227 68.9921 31.2227 68.9921C19.7605 68.6258 15.4039 61.039 15.4039 61.039C15.4039 44.1909 22.8724 30.5345 22.8724 30.5345C30.341 24.8836 37.4465 25.0406 37.4465 25.0406L37.9651 25.6685C28.6294 28.3893 24.3247 32.5228 24.3247 32.5228C24.3247 32.5228 25.4657 31.8949 27.3847 31.0054C32.9342 28.5462 37.3428 27.866 39.158 27.7091C39.4692 27.6567 39.7285 27.6044 40.0397 27.6044C43.2035 27.1858 46.7822 27.0812 50.5164 27.4998C55.4436 28.0753 60.7338 29.5404 66.1278 32.5228C66.1278 32.5228 62.0305 28.5986 53.2134 25.8778L53.9395 25.0406C53.9395 25.0406 61.045 24.8836 68.5136 30.5345C68.5136 30.5345 75.9821 44.1909 75.9821 61.039C75.9821 61.039 71.5736 68.6258 60.1115 68.9921Z" />
            </svg>
        );
    }
};

export const twitterContent: ContentPlacementProps = {
    heading: {
        children: "Twitter"
    },
    paragraph: {
        children:
            "Follow along as we share out the latest happenings on Twitter. You will find important updates, announcements, and sneak peeks."
    },
    action: (className: string): React.ReactNode => (
        <LightweightButton href={"https://twitter.com/fast_dna"} className={className}>
            Follow along on Twitter
        </LightweightButton>
    ),
    image: (className: string): React.ReactNode => {
        return (
            <svg className={className} width="116" height="95" viewBox="0 0 116 95" xmlns="http://www.w3.org/2000/svg">
                <path d="M36.406 94.2383C80.1396 94.2383 104.07 57.9714 104.07 26.5741C104.07 25.5538 104.07 24.5335 104.024 23.5132C108.662 20.174 112.696 15.9537 115.896 11.1769C111.63 13.0783 107.038 14.3305 102.215 14.9334C107.131 12.0117 110.888 7.32758 112.696 1.76233C108.105 4.49858 103.004 6.44642 97.5774 7.51309C93.218 2.87538 87.0498 0 80.2324 0C67.1077 0 56.4409 10.6667 56.4409 23.7915C56.4409 25.6465 56.6728 27.4552 57.0438 29.2176C37.2872 28.2437 19.7566 18.7364 8.02324 4.35945C5.98265 7.88411 4.82322 11.9653 4.82322 16.3247C4.82322 24.5799 9.04354 31.8611 15.3972 36.1278C11.5015 35.9886 7.83773 34.922 4.63771 33.1596C4.63771 33.2524 4.63771 33.3451 4.63771 33.4843C4.63771 44.9858 12.8465 54.6322 23.6987 56.812C21.7045 57.3685 19.6175 57.6467 17.4378 57.6467C15.9073 57.6467 14.4233 57.5076 12.9856 57.2294C16.0001 66.6903 24.8118 73.5541 35.2002 73.7396C27.0379 80.1396 16.7885 83.9426 5.65801 83.9426C3.75655 83.9426 1.85508 83.8498 0 83.6179C10.4812 90.2962 23.003 94.2383 36.406 94.2383Z" />
            </svg>
        );
    }
};

export const mediumContent: ContentPlacementProps = {
    heading: {
        children: "Medium"
    },
    paragraph: {
        children:
            "Dive deeper on important FAST related topics, find tutorials, and hear our opinions on up and coming industry topics."
    },
    action: (className: string): React.ReactNode => (
        <LightweightButton href={"https://medium.com/fast-dna"} className={className}>
            Read our blog on Medium
        </LightweightButton>
    ),
    image: (className: string): React.ReactNode => {
        return (
            <svg className={className} width="113" height="91" viewBox="0 0 113 91" xmlns="http://www.w3.org/2000/svg">
                <path d="M13.3996 19.2345C13.54 17.8429 13.011 16.4675 11.9753 15.5308L1.42437 2.77952V0.874756H34.1849L59.507 56.589L81.7694 0.874756H113V2.77952L103.979 11.4568C103.201 12.0515 102.815 13.029 102.977 13.9964V77.7531C102.815 78.7205 103.201 79.698 103.979 80.2927L112.789 88.97V90.8748H68.4753V88.97L77.6018 80.0811C78.4986 79.1816 78.4986 78.9171 78.4986 77.5414V26.007L53.1237 90.6631H49.6947L20.1522 26.007V69.3404C19.9059 71.1622 20.509 72.9964 21.7876 74.3139L33.6573 88.7583V90.6631H0V88.7583L11.8697 74.3139C13.139 72.9942 13.707 71.1479 13.3996 69.3404V19.2345Z" />
            </svg>
        );
    }
};

export const heroBackground: (className: string) => React.ReactNode = (className: string): React.ReactNode => {
    return (
        <React.Fragment>
            <style
                dangerouslySetInnerHTML={{
                    __html: `
                #curve1 path {
                    animation: anim1 16s ease-in-out -12s infinite alternate;
                }

                @keyframes anim1 {
                    0% {  }
                    100% { d: path("M1920 1080V180.6c-66.5 11.6-127.2 62.2-239.1 104.4-108.8 41-250.6 57.6-360.5 41-102.7-15.5-179.6-8.4-265.5 6.9-138.7 24.8-193.6-47.2-305.2-77.3-124.8-33.7-232.9-3.3-318.1 12.9C280.1 297.2 150.3 46.5 0 91.2V1080h1920z"); } }

                #curve2 path {
                    animation: anim2 16s ease-in-out -4s infinite alternate;
                }

                @keyframes anim2 {
                    0% {  }
                    100% { d: path("M1655.6 348.5c98.5 10.8 175.1-27.5 264.4-18.2V1080H0V335.6c76.2-19.9 175.9-65.3 299.9-42.4 128.8 23.8 244.3 24.8 307.2 9.9 71.3-16.8 179.8-77 273.5-36.7 78.3 33.7 124.8 153.6 240.8 150.6 120.4-3.1 156.4-100.9 268.5-115.9 110.9-14.8 157.7 35.5 265.7 47.4z"); } }

                #curve3 path {
                    animation: anim3 16s ease-in-out -8s infinite alternate;
                }

                @keyframes anim3 {
                    0% {  }
                    100% { d: path("M1920 1080V420.9c-128.7 3.1-381.6 97.3-534.2 173.5-169.9 84.9-233.8 142-404.3 111-143-26-276.4-101.8-548.9-43.6C216.8 707.9 19.7 537.7 0 529.7V369v711h1920z"); } }

                #curve4 path {
                    animation: anim4 16s ease-in-out 0s infinite alternate;
                }

                    @keyframes anim4 {
                    0% {  }
                    100% { d: path("M238.5 465.6C157.3 438.2 78 416.1 0 438.6V1080h1727.2C1390.8 858.9 1237.4 449.3 960 481.5c-85.4 9.9-204.3 43.6-275.7 5.9-81.5-43-128.8-61.3-206.1-45.6-79.7 16.3-164.8 49.2-239.7 23.8z"); } }

            `
                }}
            />
            <svg
                className={className}
                xmlns="http://www.w3.org/2000/svg"
                width="1920"
                height="900"
                viewBox="0 0 1920 900"
                preserveAspectRatio="xMinYMax slice"
            >
                {/* Background - MIGHT NEED TO DELETE ME */}
                <path d="M0 0h1920v900H0z" fill="#021B4F" />
                {/* Bright Back Curves */}
                <g id="curve1">
                    <linearGradient
                        id="gradient1"
                        gradientUnits="userSpaceOnUse"
                        x1="509.562"
                        y1="-1016.382"
                        x2="1408.152"
                        y2="-1638.59"
                        gradientTransform="matrix(1 0 0 -1 0 -698)"
                    >
                        <stop offset="0" stopColor="#AD3B8F" />
                        <stop offset="1" stopColor="#D84498" />
                    </linearGradient>
                    <path
                        d="M1920 900V180.6c-30.8 25.5-91.3 66.1-234 49.7-152.4-17.5-252.6 45.1-359.5 115.7-86.7 57.2-206.2 41.4-285.2-3.1-75.3-42.4-173.6-184.4-296.7-112.4-130 76-225.7 80.6-300.9 42.7C367.4 234.6 146.3 23.7 0 91.2V1080h1920z"
                        fill="url(#gradient1)"
                    />
                </g>
                {/* Bright Front Curves */}
                <g id="curve2">
                    <linearGradient
                        id="gradient2"
                        gradientUnits="userSpaceOnUse"
                        x1="423.43"
                        y1="-1023.418"
                        x2="1488.562"
                        y2="-1777.18"
                        gradientTransform="matrix(1 0 0 -1 0 -698)"
                    >
                        <stop offset="0" stopColor="#D34395" />
                        <stop offset="0.3" stopColor="#B63386" />
                        <stop offset="1" stopColor="#823389" />
                    </linearGradient>
                    <path
                        d="M1653.4 302.3c99.1 12.7 172.4 56.3 266.6 28V1080H0V335.6c87.9 60.7 153 74.1 289.2-14.1 135.5-87.7 241.6-114.6 300.6-100 61.8 15.3 144.7 91.6 241.5 120.7 101.4 30.5 148.4 46.1 233.9 53.6 84.9 7.4 199.8-5.1 279-40.4 88.2-39.4 209.3-66 309.2-53.1z"
                        fill="url(#gradient2)"
                    />
                </g>
                {/* Dark Blue Bottom Matte */}
                <g id="curve3">
                    <path
                        d="M1920 900V420.9c-128.7 3.1-331.2 214.6-524.8 249.8-186.9 34-230.1-39.6-411.2-44.8-145.3-4.2-250.9 91.6-544.5 58.3C220.2 659.4 19.7 537.7 0 529.7V369v711h1920z"
                        fill="#021B4F"
                    />
                </g>
                {/* Purple Foreground Fade */}
                <g id="curve4">
                    <linearGradient
                        id="gradient4"
                        gradientUnits="userSpaceOnUse"
                        x1="369.253"
                        y1="-1145.08"
                        x2="1190.462"
                        y2="-2196.5"
                        gradientTransform="matrix(1 0 0 -1 0 -698)"
                    >
                        <stop offset="0" stopColor="#643187" />
                        <stop offset="1" stopColor="#3722BA" stopOpacity="0" />
                    </linearGradient>
                    <path
                        d="M246.7 452.1c-79.5 32-162.4 27.1-246.7-13.5V1080h1727.2c-336.4-221.1-502.8-609.8-779.1-650.9-80.6-12-139.3 17.9-237.2 24.9-92 6.6-130.5-23.3-216.8-38.1-80.2-13.7-171.3 5.6-247.4 36.2z"
                        fill="url(#gradient4)"
                    />
                </g>
                {/* Bottom Gradient */}
                <g id="gradient">
                    <linearGradient id="gradient5" gradientUnits="userSpaceOnUse" x1="960" y1="900" x2="960" y2="740">
                        <stop offset="0" stopColor="#1B1B1B" stopOpacity="1" />
                        <stop offset="1" stopColor="#1B1B1B" stopOpacity="0" />
                    </linearGradient>
                    <path fill="url(#gradient5)" d="M0 650h1920v250H0z" />
                </g>
            </svg>
        </React.Fragment>
    );
};
