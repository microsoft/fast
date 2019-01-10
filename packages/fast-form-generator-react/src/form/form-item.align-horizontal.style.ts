import {
    applyControl,
    applyControlWrapper,
    applyInputBackplateStyle,
    applyLabelStyle,
    applySoftRemove,
    applySoftRemoveInput,
    colors,
} from "../utilities/";
import { ComponentStyles, CSSRules } from "@microsoft/fast-jss-manager";
import { FormItemAlignHorizontalClassNameContract } from "../class-name-contracts/";

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

const styles: ComponentStyles<FormItemAlignHorizontalClassNameContract, {}> = {
    formItemAlignHorizontal: {
        display: "flex",
        ...applyControlWrapper(),
    },
    formItemAlignHorizontal_control: {
        ...applyControl(),
    },
    formItemAlignHorizontal_controlLabel: {
        ...applyLabelStyle(),
    },
    formItemAlignHorizontal_controlInputContainer: {
        height: "20px",
    },
    formItemAlignHorizontal_controlInput__left: {
        ...applyInputBackplateStyle(),
        borderRadius: "2px 0px 0px 2px",
        background: leftLight,
        "&:checked": {
            backgroundColor: colors.pink,
        },
    },
    formItemAlignHorizontal_controlInput__center: {
        ...applyInputBackplateStyle(),
        borderRight: `1px solid ${colors.background300}`,
        borderLeft: `1px solid ${colors.background300}`,
        background: centerLight,
        "&:checked": {
            backgroundColor: colors.pink,
        },
    },
    formItemAlignHorizontal_controlInput__right: {
        ...applyInputBackplateStyle(),
        borderRadius: "0px 2px 2px 0px",
        background: rightLight,
        "&:checked": {
            backgroundColor: colors.pink,
        },
    },
    formItemAlignHorizontal_softRemove: {
        ...applySoftRemove(),
    },
    formItemAlignHorizontal_softRemoveInput: {
        ...applySoftRemoveInput(),
    },
};

export default styles;
