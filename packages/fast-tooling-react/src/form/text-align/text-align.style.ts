import { ComponentStyles, CSSRules } from "@microsoft/fast-jss-manager";
import {
    accent,
    applyControl,
    applyControlWrapper,
    applyInputBackplateStyle,
    applyLabelStyle,
    applySoftRemove,
    applySoftRemoveInput,
    background300,
} from "../../style";
import { TextAlignClassNameContract } from "./text-align.props";

/* tslint:disable */
const leftLight: string =
    "url(data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTIiIGhlaWdodD0iMTAiIHZpZXdCb3g9IjAgMCAxMiAxMCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZD0iTTAgMEgxMlYxSDBWMFoiIGZpbGw9IiNDNEM0QzQiLz4KPHBhdGggZD0iTTAgNkgxMlY3SDBWNloiIGZpbGw9IiNDNEM0QzQiLz4KPHBhdGggZD0iTTAgM0g4VjRIMFYzWiIgZmlsbD0iI0M0QzRDNCIvPgo8cGF0aCBkPSJNMCA5SDhWMTBIMFY5WiIgZmlsbD0iI0M0QzRDNCIvPgo8L3N2Zz4K) center no-repeat";
const centerLight: string =
    "url(data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTIiIGhlaWdodD0iMTAiIHZpZXdCb3g9IjAgMCAxMiAxMCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZD0iTTAgMEgxMlYxSDBWMFoiIGZpbGw9IiNDNEM0QzQiLz4KPHBhdGggZD0iTTAgNkgxMlY3SDBWNloiIGZpbGw9IiNDNEM0QzQiLz4KPHBhdGggZD0iTTIgM0gxMFY0SDJWM1oiIGZpbGw9IiNDNEM0QzQiLz4KPHBhdGggZD0iTTIgOUgxMFYxMEgyVjlaIiBmaWxsPSIjQzRDNEM0Ii8+Cjwvc3ZnPgo=) center no-repeat";
const rightLight: string =
    "url(data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTIiIGhlaWdodD0iMTAiIHZpZXdCb3g9IjAgMCAxMiAxMCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZD0iTTAgMEgxMlYxSDBWMFoiIGZpbGw9IiNDNEM0QzQiLz4KPHBhdGggZD0iTTAgNkgxMlY3SDBWNloiIGZpbGw9IiNDNEM0QzQiLz4KPHBhdGggZD0iTTQgM0gxMlY0SDRWM1oiIGZpbGw9IiNDNEM0QzQiLz4KPHBhdGggZD0iTTQgOUgxMlYxMEg0VjlaIiBmaWxsPSIjQzRDNEM0Ii8+Cjwvc3ZnPgo=) center no-repeat";
// TODO #1275: https://github.com/Microsoft/fast-dna/issues/1275
const justifyLight: string =
    "url(data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTIiIGhlaWdodD0iMTAiIHZpZXdCb3g9IjAgMCAxMiAxMCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZD0iTTAgMEgxMlYxSDBWMFoiIGZpbGw9IiNDNEM0QzQiLz4KPHBhdGggZD0iTTAgNkgxMlY3SDBWNloiIGZpbGw9IiNDNEM0QzQiLz4KPHBhdGggZD0iTTAgM0gxMlY0SDBWM1oiIGZpbGw9IiNDNEM0QzQiLz4KPHBhdGggZD0iTTAgOUgxMlYxMEgwVjlaIiBmaWxsPSIjQzRDNEM0Ii8+Cjwvc3ZnPgo=) center no-repeat";
/* tslint:enable */

const styles: ComponentStyles<TextAlignClassNameContract, {}> = {
    textAlign: {
        display: "flex",
        ...applyControlWrapper(),
    },
    textAlign_control: {
        ...applyControl(),
    },
    textAlign_controlLabel: {
        ...applyLabelStyle(),
    },
    textAlign_controlInputContainer: {
        height: "20px",
    },
    textAlign_controlInput__left: {
        ...applyInputBackplateStyle(),
        borderRadius: "2px 0px 0px 2px",
        background: leftLight,
        "&:checked": {
            backgroundColor: accent,
        },
    },
    textAlign_controlInput__center: {
        ...applyInputBackplateStyle(),
        borderRight: `1px solid ${background300}`,
        borderLeft: `1px solid ${background300}`,
        background: centerLight,
        "&:checked": {
            backgroundColor: accent,
        },
    },
    textAlign_controlInput__right: {
        ...applyInputBackplateStyle(),
        borderRadius: "0px 2px 2px 0px",
        background: rightLight,
        "&:checked": {
            backgroundColor: accent,
        },
    },
    textAlign_softRemove: {
        ...applySoftRemove(),
    },
    textAlign_softRemoveInput: {
        ...applySoftRemoveInput(),
    },
};

export default styles;
