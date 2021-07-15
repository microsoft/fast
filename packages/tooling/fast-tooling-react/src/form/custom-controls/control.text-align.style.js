import { inputBackplateStyle } from "../../style";
import { accentColorCSSProperty, L4CSSProperty } from "../../style/css-properties";
const leftLight =
    "url(data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTIiIGhlaWdodD0iMTAiIHZpZXdCb3g9IjAgMCAxMiAxMCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZD0iTTAgMEgxMlYxSDBWMFoiIGZpbGw9IiNDNEM0QzQiLz4KPHBhdGggZD0iTTAgNkgxMlY3SDBWNloiIGZpbGw9IiNDNEM0QzQiLz4KPHBhdGggZD0iTTAgM0g4VjRIMFYzWiIgZmlsbD0iI0M0QzRDNCIvPgo8cGF0aCBkPSJNMCA5SDhWMTBIMFY5WiIgZmlsbD0iI0M0QzRDNCIvPgo8L3N2Zz4K) center no-repeat";
const centerLight =
    "url(data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTIiIGhlaWdodD0iMTAiIHZpZXdCb3g9IjAgMCAxMiAxMCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZD0iTTAgMEgxMlYxSDBWMFoiIGZpbGw9IiNDNEM0QzQiLz4KPHBhdGggZD0iTTAgNkgxMlY3SDBWNloiIGZpbGw9IiNDNEM0QzQiLz4KPHBhdGggZD0iTTIgM0gxMFY0SDJWM1oiIGZpbGw9IiNDNEM0QzQiLz4KPHBhdGggZD0iTTIgOUgxMFYxMEgyVjlaIiBmaWxsPSIjQzRDNEM0Ii8+Cjwvc3ZnPgo=) center no-repeat";
const rightLight =
    "url(data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTIiIGhlaWdodD0iMTAiIHZpZXdCb3g9IjAgMCAxMiAxMCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZD0iTTAgMEgxMlYxSDBWMFoiIGZpbGw9IiNDNEM0QzQiLz4KPHBhdGggZD0iTTAgNkgxMlY3SDBWNloiIGZpbGw9IiNDNEM0QzQiLz4KPHBhdGggZD0iTTQgM0gxMlY0SDRWM1oiIGZpbGw9IiNDNEM0QzQiLz4KPHBhdGggZD0iTTQgOUgxMlYxMEg0VjlaIiBmaWxsPSIjQzRDNEM0Ii8+Cjwvc3ZnPgo=) center no-repeat";
const justifyLight =
    "url(data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTIiIGhlaWdodD0iMTAiIHZpZXdCb3g9IjAgMCAxMiAxMCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZD0iTTAgMEgxMlYxSDBWMFoiIGZpbGw9IiNDNEM0QzQiLz4KPHBhdGggZD0iTTAgNkgxMlY3SDBWNloiIGZpbGw9IiNDNEM0QzQiLz4KPHBhdGggZD0iTTAgM0gxMlY0SDBWM1oiIGZpbGw9IiNDNEM0QzQiLz4KPHBhdGggZD0iTTAgOUgxMlYxMEgwVjlaIiBmaWxsPSIjQzRDNEM0Ii8+Cjwvc3ZnPgo=) center no-repeat";
const border = `1px solid ${L4CSSProperty}`;
const styles = {
    textAlignControl: {
        height: "20px",
    },
    textAlignControl__disabled: {},
    textAlignControl_input: Object.assign(Object.assign({}, inputBackplateStyle), {
        "&:checked": {
            backgroundColor: accentColorCSSProperty,
        },
    }),
    textAlignControl_input__left: {
        borderRadius: "2px 0px 0px 2px",
        background: leftLight,
    },
    textAlignControl_input__center: {
        borderRight: border,
        borderLeft: border,
        background: centerLight,
    },
    textAlignControl_input__right: {
        borderRadius: "0px 2px 2px 0px",
        background: rightLight,
    },
    textAlignControl_input__justify: {
        borderRight: border,
        borderLeft: border,
        background: justifyLight,
    },
};
export default styles;
