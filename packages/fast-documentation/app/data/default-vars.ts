/**
 * Breakpoints
 */
const vp0Value = 0;
const vp1Value = 320;
const vp2Value = 540;
const vp3Value = 768;
const vp4Value = 1024;
const vp5Value = 1400;
const vp6Value = 1779;
const vpMax = 2048;

const breakpoints = {
    vp0Value: vp0Value,
    vp1Value: vp1Value,
    vp2Value: vp2Value,
    vp3Value: vp3Value,
    vp4Value: vp4Value,
    vp5Value: vp5Value,
    vp6Value: vp6Value,
    vpMaxValue: vpMax,
    vp0: `${vp0Value}px`,
    vp1: `${vp1Value}px`,
    vp2: `${vp2Value}px`,
    vp3: `${vp3Value}px`,
    vp4: `${vp4Value}px`,
    vp5: `${vp5Value}px`,
    vp6: `${vp6Value}px`,
    vpMin: `${vp1Value}px`,
    vp0Max: `${vp1Value - 1}px`,
    vp1Max: `${vp2Value - 1}px`,
    vp2Max: `${vp3Value - 1}px`,
    vp3Max: `${vp4Value - 1}px`,
    vp4Max: `${vp5Value - 1}px`,
    vp5Max: `${vp6Value - 1}px`,
    vp6Max: `${vpMax}px`
};

/**
 * Colors
 */
const colors = {
    blue: {
        base: "#2487DB"
    },
    purple: {
        base: "#9365E1"
    },
    orange: {},
    yellow: {},
    green: {
        light: "#1BB29F",
        base: "#008575"
    },
    teal: {},
    gray: {},
    white: "#fff",
    black: "#000"
};

const regularFontStack = "'Segoe UI', 'SegoeUI', 'Helvetica Neue', Helvetica, sans-serif";

const fonts = {
    regular: regularFontStack,
    semibold: `"Segoe UI Semibold", "SegoeUISemibold", ${regularFontStack}`,
    bold: `"Segoe UI Bold", "SegoeUIBold", ${regularFontStack}`,
    symbols: "'MDL2', 'Segoe MDL2 Assets', 'SegoeMDL2Assets'"
};

/**
 * Box shadows
 */
const shadows = {
    light: {
        rest: "0  2px 4px rgba(0, 0, 0, .06), 0 .5px 1px rgba(0, 0, 0, .05)",
        hover: "0 19px 43px rgba(0, 0, 0, .22), 0 4px 11px rgba(0, 0, 0, .18)"
    },
    dark: {
        rest: "0  2px 4px rgba(0, 0, 0, .18), 0 .5px 1px rgba(0, 0, 0, .15)",
        hover: "0 19px 43px rgba(0, 0, 0, .66), 0 4px 11px rgba(0, 0, 0, .54)"
    }
};

export { breakpoints, colors, fonts, shadows };
