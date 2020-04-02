(window.webpackJsonp = window.webpackJsonp || []).push([
    [0],
    {
        1: function(module, __webpack_exports__, __webpack_require__) {
            "use strict";
            var SystemColors;
            __webpack_require__.d(__webpack_exports__, "a", function() {
                return SystemColors;
            }),
                (function(SystemColors) {
                    (SystemColors.Canvas = "Canvas"),
                        (SystemColors.CanvasText = "CanvasText"),
                        (SystemColors.LinkText = "LinkText"),
                        (SystemColors.VisitedText = "VisitedText"),
                        (SystemColors.ActiveText = "ActiveText"),
                        (SystemColors.ButtonFace = "ButtonFace"),
                        (SystemColors.ButtonText = "ButtonText"),
                        (SystemColors.Field = "Field"),
                        (SystemColors.FieldText = "FieldText"),
                        (SystemColors.Highlight = "Highlight"),
                        (SystemColors.HighlightText = "HighlightText"),
                        (SystemColors.GrayText = "GrayText");
                })(SystemColors || (SystemColors = {}));
        },
        10: function(module, __webpack_exports__, __webpack_require__) {
            "use strict";
            var fast_element = __webpack_require__(79);
            function clamp(i, min, max) {
                return isNaN(i) || i <= min ? min : i >= max ? max : i;
            }
            function normalize(i, min, max) {
                return isNaN(i) || i <= min ? 0 : i >= max ? 1 : i / (max - min);
            }
            function denormalize(i, min, max) {
                return isNaN(i) ? min : min + i * (max - min);
            }
            function degreesToRadians(i) {
                return i * (Math.PI / 180);
            }
            function lerp(i, min, max) {
                return isNaN(i) || i <= 0 ? min : i >= 1 ? max : min + i * (max - min);
            }
            function lerpAnglesInDegrees(i, min, max) {
                if (i <= 0) return min % 360;
                if (i >= 1) return max % 360;
                const a = (min - max + 360) % 360;
                return a <= (max - min + 360) % 360
                    ? (min - a * i + 360) % 360
                    : (min + a * i + 360) % 360;
            }
            Math.PI;
            function roundToPrecisionSmall(i, precision) {
                const factor = Math.pow(10, precision);
                return Math.round(i * factor) / factor;
            }
            class color_rgba_64_ColorRGBA64 {
                static fromObject(data) {
                    return !data || isNaN(data.r) || isNaN(data.g) || isNaN(data.b)
                        ? null
                        : new color_rgba_64_ColorRGBA64(data.r, data.g, data.b, data.a);
                }
                constructor(red, green, blue, alpha) {
                    (this.r = red),
                        (this.g = green),
                        (this.b = blue),
                        (this.a = "number" != typeof alpha || isNaN(alpha) ? 1 : alpha);
                }
                equalValue(rhs) {
                    return (
                        this.r === rhs.r &&
                        this.g === rhs.g &&
                        this.b === rhs.b &&
                        this.a === rhs.a
                    );
                }
                toStringHexRGB() {
                    return (
                        "#" + [this.r, this.g, this.b].map(this.formatHexValue).join("")
                    );
                }
                toStringHexRGBA() {
                    return this.toStringHexRGB() + this.formatHexValue(this.a);
                }
                toStringHexARGB() {
                    return (
                        "#" +
                        [this.a, this.r, this.g, this.b].map(this.formatHexValue).join("")
                    );
                }
                toStringWebRGB() {
                    return `rgb(${Math.round(denormalize(this.r, 0, 255))},${Math.round(
                        denormalize(this.g, 0, 255)
                    )},${Math.round(denormalize(this.b, 0, 255))})`;
                }
                toStringWebRGBA() {
                    return `rgba(${Math.round(denormalize(this.r, 0, 255))},${Math.round(
                        denormalize(this.g, 0, 255)
                    )},${Math.round(denormalize(this.b, 0, 255))},${clamp(
                        this.a,
                        0,
                        1
                    )})`;
                }
                roundToPrecision(precision) {
                    return new color_rgba_64_ColorRGBA64(
                        roundToPrecisionSmall(this.r, precision),
                        roundToPrecisionSmall(this.g, precision),
                        roundToPrecisionSmall(this.b, precision),
                        roundToPrecisionSmall(this.a, precision)
                    );
                }
                clamp() {
                    return new color_rgba_64_ColorRGBA64(
                        clamp(this.r, 0, 1),
                        clamp(this.g, 0, 1),
                        clamp(this.b, 0, 1),
                        clamp(this.a, 0, 1)
                    );
                }
                toObject() {
                    return { r: this.r, g: this.g, b: this.b, a: this.a };
                }
                formatHexValue(value) {
                    return (function getHexStringForByte(i) {
                        const s = Math.round(clamp(i, 0, 255)).toString(16);
                        return 1 === s.length ? "0" + s : s;
                    })(denormalize(value, 0, 255));
                }
            }
            const webRGBRegex = /^rgb\(\s*((?:(?:25[0-5]|2[0-4]\d|1\d\d|\d{1,2})\s*,\s*){2}(?:25[0-5]|2[0-4]\d|1\d\d|\d{1,2})\s*)\)$/i,
                hexRGBRegex = /^#((?:[0-9a-f]{6}|[0-9a-f]{3}))$/i;
            function isColorStringHexRGB(raw) {
                return hexRGBRegex.test(raw);
            }
            function isColorStringWebRGB(raw) {
                return webRGBRegex.test(raw);
            }
            function parseColorHexRGB(raw) {
                const result = hexRGBRegex.exec(raw);
                if (null === result) return null;
                let digits = result[1];
                if (3 === digits.length) {
                    const r = digits.charAt(0),
                        g = digits.charAt(1),
                        b = digits.charAt(2);
                    digits = r.concat(r, g, g, b, b);
                }
                const rawInt = parseInt(digits, 16);
                return isNaN(rawInt)
                    ? null
                    : new color_rgba_64_ColorRGBA64(
                          normalize((16711680 & rawInt) >>> 16, 0, 255),
                          normalize((65280 & rawInt) >>> 8, 0, 255),
                          normalize(255 & rawInt, 0, 255),
                          1
                      );
            }
            function parseColorWebRGB(raw) {
                const result = webRGBRegex.exec(raw);
                if (null === result) return null;
                const split = result[1].split(",");
                return new color_rgba_64_ColorRGBA64(
                    normalize(Number(split[0]), 0, 255),
                    normalize(Number(split[1]), 0, 255),
                    normalize(Number(split[2]), 0, 255),
                    1
                );
            }
            var Direction;
            !(function(Direction) {
                (Direction.ltr = "ltr"), (Direction.rtl = "rtl");
            })(Direction || (Direction = {}));
            __webpack_require__(36);
            var white = "#FFFFFF",
                paletteConstants = { steps: 94, clipLight: 0, clipDark: 0 },
                memoize = (Object.assign({}, paletteConstants),
                Object.assign({}, paletteConstants, {
                    baseColor: parseColorHexRGB("#0078D4"),
                }),
                __webpack_require__(623));
            __webpack_require__(629);
            var isFunction = __webpack_require__(76),
                designSystemDefaults = {
                    backgroundColor: white,
                    contrast: 0,
                    density: 0,
                    designUnit: 4,
                    baseHeightMultiplier: 8,
                    baseHorizontalSpacingMultiplier: 3,
                    direction: Direction.ltr,
                    cornerRadius: 2,
                    elevatedCornerRadius: 4,
                    focusOutlineWidth: 2,
                    fontWeight: {
                        light: 100,
                        semilight: 200,
                        normal: 400,
                        semibold: 600,
                        bold: 700,
                    },
                    disabledOpacity: 0.3,
                    outlineWidth: 1,
                    neutralPalette: [
                        "#FFFFFF",
                        "#FCFCFC",
                        "#FAFAFA",
                        "#F7F7F7",
                        "#F5F5F5",
                        "#F2F2F2",
                        "#EFEFEF",
                        "#EDEDED",
                        "#EAEAEA",
                        "#E8E8E8",
                        "#E5E5E5",
                        "#E2E2E2",
                        "#E0E0E0",
                        "#DDDDDD",
                        "#DBDBDB",
                        "#D8D8D8",
                        "#D6D6D6",
                        "#D3D3D3",
                        "#D0D0D0",
                        "#CECECE",
                        "#CBCBCB",
                        "#C9C9C9",
                        "#C6C6C6",
                        "#C3C3C3",
                        "#C1C1C1",
                        "#BEBEBE",
                        "#BCBCBC",
                        "#B9B9B9",
                        "#B6B6B6",
                        "#B4B4B4",
                        "#B1B1B1",
                        "#AFAFAF",
                        "#ACACAC",
                        "#A9A9A9",
                        "#A7A7A7",
                        "#A4A4A4",
                        "#A2A2A2",
                        "#9F9F9F",
                        "#9D9D9D",
                        "#9A9A9A",
                        "#979797",
                        "#959595",
                        "#929292",
                        "#909090",
                        "#8D8D8D",
                        "#8A8A8A",
                        "#888888",
                        "#858585",
                        "#838383",
                        "#808080",
                        "#7D7D7D",
                        "#7B7B7B",
                        "#787878",
                        "#767676",
                        "#737373",
                        "#717171",
                        "#6E6E6E",
                        "#6B6B6B",
                        "#696969",
                        "#666666",
                        "#646464",
                        "#616161",
                        "#5F5F5F",
                        "#5C5C5C",
                        "#5A5A5A",
                        "#575757",
                        "#545454",
                        "#525252",
                        "#4F4F4F",
                        "#4D4D4D",
                        "#4A4A4A",
                        "#484848",
                        "#454545",
                        "#424242",
                        "#404040",
                        "#3D3D3D",
                        "#3B3B3B",
                        "#383838",
                        "#363636",
                        "#333333",
                        "#313131",
                        "#2E2E2E",
                        "#2B2B2B",
                        "#292929",
                        "#262626",
                        "#242424",
                        "#212121",
                        "#1E1E1E",
                        "#1B1B1B",
                        "#181818",
                        "#151515",
                        "#121212",
                        "#101010",
                        "#000000",
                    ],
                    accentPalette: [
                        "#FFFFFF",
                        "#FBFDFE",
                        "#F6FAFE",
                        "#F2F8FD",
                        "#EEF6FC",
                        "#E9F4FB",
                        "#E5F1FB",
                        "#E1EFFA",
                        "#DCEDF9",
                        "#D8EAF8",
                        "#D4E8F8",
                        "#CFE6F7",
                        "#CBE4F6",
                        "#C7E1F6",
                        "#C2DFF5",
                        "#BEDDF4",
                        "#BADAF3",
                        "#B6D8F3",
                        "#B1D6F2",
                        "#ADD4F1",
                        "#A9D1F0",
                        "#A4CFF0",
                        "#A0CDEF",
                        "#9CCAEE",
                        "#97C8EE",
                        "#93C6ED",
                        "#8FC4EC",
                        "#8AC1EB",
                        "#86BFEB",
                        "#82BDEA",
                        "#7DBAE9",
                        "#79B8E8",
                        "#75B6E8",
                        "#70B3E7",
                        "#6CB1E6",
                        "#68AFE5",
                        "#63ADE5",
                        "#5FAAE4",
                        "#5BA8E3",
                        "#56A6E3",
                        "#52A3E2",
                        "#4EA1E1",
                        "#499FE0",
                        "#459DE0",
                        "#419ADF",
                        "#3D98DE",
                        "#3896DD",
                        "#3493DD",
                        "#3091DC",
                        "#2B8FDB",
                        "#278DDB",
                        "#238ADA",
                        "#1E88D9",
                        "#1A86D8",
                        "#1683D8",
                        "#1181D7",
                        "#0D7FD6",
                        "#097DD5",
                        "#047AD5",
                        "#0078D4",
                        "#0075CF",
                        "#0072C9",
                        "#006FC4",
                        "#006CBE",
                        "#0069B9",
                        "#0066B4",
                        "#0063AE",
                        "#0060A9",
                        "#005CA3",
                        "#00599E",
                        "#005699",
                        "#005393",
                        "#00508E",
                        "#004D88",
                        "#004A83",
                        "#00477D",
                        "#004478",
                        "#004173",
                        "#003E6D",
                        "#003B68",
                        "#003862",
                        "#00355D",
                        "#003258",
                        "#002F52",
                        "#002B4D",
                        "#002847",
                        "#002542",
                        "#00223C",
                        "#001F36",
                        "#001B30",
                        "#00182B",
                        "#001525",
                        "#00121F",
                        "#000000",
                    ],
                    accentBaseColor: "#0078D4",
                    accentFillRestDelta: 0,
                    accentFillHoverDelta: 4,
                    accentFillActiveDelta: -5,
                    accentFillFocusDelta: 0,
                    accentFillSelectedDelta: 12,
                    accentForegroundRestDelta: 0,
                    accentForegroundHoverDelta: 6,
                    accentForegroundActiveDelta: -4,
                    accentForegroundFocusDelta: 0,
                    neutralFillRestDelta: 7,
                    neutralFillHoverDelta: 10,
                    neutralFillActiveDelta: 5,
                    neutralFillFocusDelta: 0,
                    neutralFillSelectedDelta: 7,
                    neutralFillInputRestDelta: 0,
                    neutralFillInputHoverDelta: 0,
                    neutralFillInputActiveDelta: 0,
                    neutralFillInputFocusDelta: 0,
                    neutralFillInputSelectedDelta: 0,
                    neutralFillStealthRestDelta: 0,
                    neutralFillStealthHoverDelta: 5,
                    neutralFillStealthActiveDelta: 3,
                    neutralFillStealthFocusDelta: 0,
                    neutralFillStealthSelectedDelta: 7,
                    neutralFillToggleHoverDelta: 8,
                    neutralFillToggleActiveDelta: -5,
                    neutralFillToggleFocusDelta: 0,
                    baseLayerLuminance: -1,
                    neutralFillCardDelta: 3,
                    neutralForegroundDarkIndex: 93,
                    neutralForegroundLightIndex: 0,
                    neutralForegroundHoverDelta: 0,
                    neutralForegroundActiveDelta: 0,
                    neutralForegroundFocusDelta: 0,
                    neutralDividerRestDelta: 8,
                    neutralOutlineRestDelta: 25,
                    neutralOutlineHoverDelta: 40,
                    neutralOutlineActiveDelta: 16,
                    neutralOutlineFocusDelta: 25,
                };
            function checkDesignSystemResolver(arg, designSystem) {
                return Object(isFunction.a)(arg) ? arg(designSystem) : arg;
            }
            var design_system = designSystemDefaults;
            __webpack_require__(55);
            class color_hsl_ColorHSL {
                static fromObject(data) {
                    return !data || isNaN(data.h) || isNaN(data.s) || isNaN(data.l)
                        ? null
                        : new color_hsl_ColorHSL(data.h, data.s, data.l);
                }
                constructor(hue, sat, lum) {
                    (this.h = hue), (this.s = sat), (this.l = lum);
                }
                equalValue(rhs) {
                    return this.h === rhs.h && this.s === rhs.s && this.l === rhs.l;
                }
                roundToPrecision(precision) {
                    return new color_hsl_ColorHSL(
                        roundToPrecisionSmall(this.h, precision),
                        roundToPrecisionSmall(this.s, precision),
                        roundToPrecisionSmall(this.l, precision)
                    );
                }
                toObject() {
                    return { h: this.h, s: this.s, l: this.l };
                }
            }
            class color_hsv_ColorHSV {
                static fromObject(data) {
                    return !data || isNaN(data.h) || isNaN(data.s) || isNaN(data.v)
                        ? null
                        : new color_hsv_ColorHSV(data.h, data.s, data.v);
                }
                constructor(hue, sat, val) {
                    (this.h = hue), (this.s = sat), (this.v = val);
                }
                equalValue(rhs) {
                    return this.h === rhs.h && this.s === rhs.s && this.v === rhs.v;
                }
                roundToPrecision(precision) {
                    return new color_hsv_ColorHSV(
                        roundToPrecisionSmall(this.h, precision),
                        roundToPrecisionSmall(this.s, precision),
                        roundToPrecisionSmall(this.v, precision)
                    );
                }
                toObject() {
                    return { h: this.h, s: this.s, v: this.v };
                }
            }
            class color_lab_ColorLAB {
                constructor(l, a, b) {
                    (this.l = l), (this.a = a), (this.b = b);
                }
                static fromObject(data) {
                    return !data || isNaN(data.l) || isNaN(data.a) || isNaN(data.b)
                        ? null
                        : new color_lab_ColorLAB(data.l, data.a, data.b);
                }
                equalValue(rhs) {
                    return this.l === rhs.l && this.a === rhs.a && this.b === rhs.b;
                }
                roundToPrecision(precision) {
                    return new color_lab_ColorLAB(
                        roundToPrecisionSmall(this.l, precision),
                        roundToPrecisionSmall(this.a, precision),
                        roundToPrecisionSmall(this.b, precision)
                    );
                }
                toObject() {
                    return { l: this.l, a: this.a, b: this.b };
                }
            }
            (color_lab_ColorLAB.epsilon = 216 / 24389),
                (color_lab_ColorLAB.kappa = 24389 / 27);
            class color_lch_ColorLCH {
                static fromObject(data) {
                    return !data || isNaN(data.l) || isNaN(data.c) || isNaN(data.h)
                        ? null
                        : new color_lch_ColorLCH(data.l, data.c, data.h);
                }
                constructor(l, c, h) {
                    (this.l = l), (this.c = c), (this.h = h);
                }
                equalValue(rhs) {
                    return this.l === rhs.l && this.c === rhs.c && this.h === rhs.h;
                }
                roundToPrecision(precision) {
                    return new color_lch_ColorLCH(
                        roundToPrecisionSmall(this.l, precision),
                        roundToPrecisionSmall(this.c, precision),
                        roundToPrecisionSmall(this.h, precision)
                    );
                }
                toObject() {
                    return { l: this.l, c: this.c, h: this.h };
                }
            }
            class color_xyz_ColorXYZ {
                constructor(x, y, z) {
                    (this.x = x), (this.y = y), (this.z = z);
                }
                static fromObject(data) {
                    return !data || isNaN(data.x) || isNaN(data.y) || isNaN(data.z)
                        ? null
                        : new color_xyz_ColorXYZ(data.x, data.y, data.z);
                }
                equalValue(rhs) {
                    return this.x === rhs.x && this.y === rhs.y && this.z === rhs.z;
                }
                roundToPrecision(precision) {
                    return new color_xyz_ColorXYZ(
                        roundToPrecisionSmall(this.x, precision),
                        roundToPrecisionSmall(this.y, precision),
                        roundToPrecisionSmall(this.z, precision)
                    );
                }
                toObject() {
                    return { x: this.x, y: this.y, z: this.z };
                }
            }
            function rgbToRelativeLuminance(rgb) {
                function luminanceHelper(i) {
                    return i <= 0.03928 ? i / 12.92 : Math.pow((i + 0.055) / 1.055, 2.4);
                }
                return rgbToLinearLuminance(
                    new color_rgba_64_ColorRGBA64(
                        luminanceHelper(rgb.r),
                        luminanceHelper(rgb.g),
                        luminanceHelper(rgb.b),
                        1
                    )
                );
            }
            color_xyz_ColorXYZ.whitePoint = new color_xyz_ColorXYZ(0.95047, 1, 1.08883);
            const calculateContrastRatio = (a, b) => (a + 0.05) / (b + 0.05);
            function contrastRatio(a, b) {
                const luminanceA = rgbToRelativeLuminance(a),
                    luminanceB = rgbToRelativeLuminance(b);
                return luminanceA > luminanceB
                    ? calculateContrastRatio(luminanceA, luminanceB)
                    : calculateContrastRatio(luminanceB, luminanceA);
            }
            function rgbToLinearLuminance(rgb) {
                return 0.2126 * rgb.r + 0.7152 * rgb.g + 0.0722 * rgb.b;
            }
            function rgbToHSL(rgb) {
                const max = Math.max(rgb.r, rgb.g, rgb.b),
                    min = Math.min(rgb.r, rgb.g, rgb.b),
                    delta = max - min;
                let hue = 0;
                0 !== delta &&
                    (hue =
                        max === rgb.r
                            ? (((rgb.g - rgb.b) / delta) % 6) * 60
                            : max === rgb.g
                                ? 60 * ((rgb.b - rgb.r) / delta + 2)
                                : 60 * ((rgb.r - rgb.g) / delta + 4)),
                    hue < 0 && (hue += 360);
                const lum = (max + min) / 2;
                let sat = 0;
                return (
                    0 !== delta && (sat = delta / (1 - Math.abs(2 * lum - 1))),
                    new color_hsl_ColorHSL(hue, sat, lum)
                );
            }
            function hslToRGB(hsl, alpha = 1) {
                const c = (1 - Math.abs(2 * hsl.l - 1)) * hsl.s,
                    x = c * (1 - Math.abs(((hsl.h / 60) % 2) - 1)),
                    m = hsl.l - c / 2;
                let r = 0,
                    g = 0,
                    b = 0;
                return (
                    hsl.h < 60
                        ? ((r = c), (g = x), (b = 0))
                        : hsl.h < 120
                            ? ((r = x), (g = c), (b = 0))
                            : hsl.h < 180
                                ? ((r = 0), (g = c), (b = x))
                                : hsl.h < 240
                                    ? ((r = 0), (g = x), (b = c))
                                    : hsl.h < 300
                                        ? ((r = x), (g = 0), (b = c))
                                        : hsl.h < 360 && ((r = c), (g = 0), (b = x)),
                    new color_rgba_64_ColorRGBA64(r + m, g + m, b + m, alpha)
                );
            }
            function rgbToHSV(rgb) {
                const max = Math.max(rgb.r, rgb.g, rgb.b),
                    delta = max - Math.min(rgb.r, rgb.g, rgb.b);
                let hue = 0;
                0 !== delta &&
                    (hue =
                        max === rgb.r
                            ? (((rgb.g - rgb.b) / delta) % 6) * 60
                            : max === rgb.g
                                ? 60 * ((rgb.b - rgb.r) / delta + 2)
                                : 60 * ((rgb.r - rgb.g) / delta + 4)),
                    hue < 0 && (hue += 360);
                let sat = 0;
                return (
                    0 !== max && (sat = delta / max),
                    new color_hsv_ColorHSV(hue, sat, max)
                );
            }
            function labToLCH(lab) {
                let h = 0;
                (0 === lab.b && 0 === lab.a) ||
                    (h = (function radiansToDegrees(i) {
                        return i * (180 / Math.PI);
                    })(Math.atan2(lab.b, lab.a))),
                    h < 0 && (h += 360);
                const c = Math.sqrt(lab.a * lab.a + lab.b * lab.b);
                return new color_lch_ColorLCH(lab.l, c, h);
            }
            function rgbToXYZ(rgb) {
                function rgbToXYZHelper(i) {
                    return i <= 0.04045 ? i / 12.92 : Math.pow((i + 0.055) / 1.055, 2.4);
                }
                const r = rgbToXYZHelper(rgb.r),
                    g = rgbToXYZHelper(rgb.g),
                    b = rgbToXYZHelper(rgb.b);
                return new color_xyz_ColorXYZ(
                    0.4124564 * r + 0.3575761 * g + 0.1804375 * b,
                    0.2126729 * r + 0.7151522 * g + 0.072175 * b,
                    0.0193339 * r + 0.119192 * g + 0.9503041 * b
                );
            }
            function xyzToRGB(xyz, alpha = 1) {
                function xyzToRGBHelper(i) {
                    return i <= 0.0031308
                        ? 12.92 * i
                        : 1.055 * Math.pow(i, 1 / 2.4) - 0.055;
                }
                const r = xyzToRGBHelper(
                        3.2404542 * xyz.x - 1.5371385 * xyz.y - 0.4985314 * xyz.z
                    ),
                    g = xyzToRGBHelper(
                        -0.969266 * xyz.x + 1.8760108 * xyz.y + 0.041556 * xyz.z
                    ),
                    b = xyzToRGBHelper(
                        0.0556434 * xyz.x - 0.2040259 * xyz.y + 1.0572252 * xyz.z
                    );
                return new color_rgba_64_ColorRGBA64(r, g, b, alpha);
            }
            function rgbToLAB(rgb) {
                return (function xyzToLAB(xyz) {
                    function xyzToLABHelper(i) {
                        return i > color_lab_ColorLAB.epsilon
                            ? Math.pow(i, 1 / 3)
                            : (color_lab_ColorLAB.kappa * i + 16) / 116;
                    }
                    const x = xyzToLABHelper(xyz.x / color_xyz_ColorXYZ.whitePoint.x),
                        y = xyzToLABHelper(xyz.y / color_xyz_ColorXYZ.whitePoint.y),
                        z = xyzToLABHelper(xyz.z / color_xyz_ColorXYZ.whitePoint.z);
                    return new color_lab_ColorLAB(
                        116 * y - 16,
                        500 * (x - y),
                        200 * (y - z)
                    );
                })(rgbToXYZ(rgb));
            }
            function labToRGB(lab, alpha = 1) {
                return xyzToRGB(
                    (function labToXYZ(lab) {
                        const fy = (lab.l + 16) / 116,
                            fx = fy + lab.a / 500,
                            fz = fy - lab.b / 200,
                            xcubed = Math.pow(fx, 3),
                            ycubed = Math.pow(fy, 3),
                            zcubed = Math.pow(fz, 3);
                        let x = 0;
                        x =
                            xcubed > color_lab_ColorLAB.epsilon
                                ? xcubed
                                : (116 * fx - 16) / color_lab_ColorLAB.kappa;
                        let y = 0;
                        y =
                            lab.l > color_lab_ColorLAB.epsilon * color_lab_ColorLAB.kappa
                                ? ycubed
                                : lab.l / color_lab_ColorLAB.kappa;
                        let z = 0;
                        return (
                            (z =
                                zcubed > color_lab_ColorLAB.epsilon
                                    ? zcubed
                                    : (116 * fz - 16) / color_lab_ColorLAB.kappa),
                            (x = color_xyz_ColorXYZ.whitePoint.x * x),
                            (y = color_xyz_ColorXYZ.whitePoint.y * y),
                            (z = color_xyz_ColorXYZ.whitePoint.z * z),
                            new color_xyz_ColorXYZ(x, y, z)
                        );
                    })(lab),
                    alpha
                );
            }
            function rgbToLCH(rgb) {
                return labToLCH(rgbToLAB(rgb));
            }
            function lchToRGB(lch, alpha = 1) {
                return labToRGB(
                    (function lchToLAB(lch) {
                        let a = 0,
                            b = 0;
                        return (
                            0 !== lch.h &&
                                ((a = Math.cos(degreesToRadians(lch.h)) * lch.c),
                                (b = Math.sin(degreesToRadians(lch.h)) * lch.c)),
                            new color_lab_ColorLAB(lch.l, a, b)
                        );
                    })(lch),
                    alpha
                );
            }
            function saturateViaLCH(input, saturation, saturationConstant = 18) {
                const lch = rgbToLCH(input);
                let sat = lch.c + saturation * saturationConstant;
                return (
                    sat < 0 && (sat = 0),
                    lchToRGB(new color_lch_ColorLCH(lch.l, sat, lch.h))
                );
            }
            function blendMultiplyChannel(bottom, top) {
                return bottom * top;
            }
            function blendMultiply(bottom, top) {
                return new color_rgba_64_ColorRGBA64(
                    blendMultiplyChannel(bottom.r, top.r),
                    blendMultiplyChannel(bottom.g, top.g),
                    blendMultiplyChannel(bottom.b, top.b),
                    1
                );
            }
            function blendOverlayChannel(bottom, top) {
                return clamp(
                    bottom < 0.5 ? 2 * top * bottom : 1 - 2 * (1 - top) * (1 - bottom),
                    0,
                    1
                );
            }
            function blendOverlay(bottom, top) {
                return new color_rgba_64_ColorRGBA64(
                    blendOverlayChannel(bottom.r, top.r),
                    blendOverlayChannel(bottom.g, top.g),
                    blendOverlayChannel(bottom.b, top.b),
                    1
                );
            }
            var ColorBlendMode, ColorInterpolationSpace;
            function interpolateByColorSpace(position, space, left, right) {
                if (isNaN(position) || position <= 0) return left;
                if (position >= 1) return right;
                switch (space) {
                    case ColorInterpolationSpace.HSL:
                        return hslToRGB(
                            (function interpolateHSL(position, left, right) {
                                return isNaN(position) || position <= 0
                                    ? left
                                    : position >= 1
                                        ? right
                                        : new color_hsl_ColorHSL(
                                              lerpAnglesInDegrees(
                                                  position,
                                                  left.h,
                                                  right.h
                                              ),
                                              lerp(position, left.s, right.s),
                                              lerp(position, left.l, right.l)
                                          );
                            })(position, rgbToHSL(left), rgbToHSL(right))
                        );
                    case ColorInterpolationSpace.HSV:
                        return (function hsvToRGB(hsv, alpha = 1) {
                            const c = hsv.s * hsv.v,
                                x = c * (1 - Math.abs(((hsv.h / 60) % 2) - 1)),
                                m = hsv.v - c;
                            let r = 0,
                                g = 0,
                                b = 0;
                            return (
                                hsv.h < 60
                                    ? ((r = c), (g = x), (b = 0))
                                    : hsv.h < 120
                                        ? ((r = x), (g = c), (b = 0))
                                        : hsv.h < 180
                                            ? ((r = 0), (g = c), (b = x))
                                            : hsv.h < 240
                                                ? ((r = 0), (g = x), (b = c))
                                                : hsv.h < 300
                                                    ? ((r = x), (g = 0), (b = c))
                                                    : hsv.h < 360 &&
                                                      ((r = c), (g = 0), (b = x)),
                                new color_rgba_64_ColorRGBA64(r + m, g + m, b + m, alpha)
                            );
                        })(
                            (function interpolateHSV(position, left, right) {
                                return isNaN(position) || position <= 0
                                    ? left
                                    : position >= 1
                                        ? right
                                        : new color_hsv_ColorHSV(
                                              lerpAnglesInDegrees(
                                                  position,
                                                  left.h,
                                                  right.h
                                              ),
                                              lerp(position, left.s, right.s),
                                              lerp(position, left.v, right.v)
                                          );
                            })(position, rgbToHSV(left), rgbToHSV(right))
                        );
                    case ColorInterpolationSpace.XYZ:
                        return xyzToRGB(
                            (function interpolateXYZ(position, left, right) {
                                return isNaN(position) || position <= 0
                                    ? left
                                    : position >= 1
                                        ? right
                                        : new color_xyz_ColorXYZ(
                                              lerp(position, left.x, right.x),
                                              lerp(position, left.y, right.y),
                                              lerp(position, left.z, right.z)
                                          );
                            })(position, rgbToXYZ(left), rgbToXYZ(right))
                        );
                    case ColorInterpolationSpace.LAB:
                        return labToRGB(
                            (function interpolateLAB(position, left, right) {
                                return isNaN(position) || position <= 0
                                    ? left
                                    : position >= 1
                                        ? right
                                        : new color_lab_ColorLAB(
                                              lerp(position, left.l, right.l),
                                              lerp(position, left.a, right.a),
                                              lerp(position, left.b, right.b)
                                          );
                            })(position, rgbToLAB(left), rgbToLAB(right))
                        );
                    case ColorInterpolationSpace.LCH:
                        return lchToRGB(
                            (function interpolateLCH(position, left, right) {
                                return isNaN(position) || position <= 0
                                    ? left
                                    : position >= 1
                                        ? right
                                        : new color_lch_ColorLCH(
                                              lerp(position, left.l, right.l),
                                              lerp(position, left.c, right.c),
                                              lerpAnglesInDegrees(
                                                  position,
                                                  left.h,
                                                  right.h
                                              )
                                          );
                            })(position, rgbToLCH(left), rgbToLCH(right))
                        );
                    default:
                        return (function interpolateRGB(position, left, right) {
                            return isNaN(position) || position <= 0
                                ? left
                                : position >= 1
                                    ? right
                                    : new color_rgba_64_ColorRGBA64(
                                          lerp(position, left.r, right.r),
                                          lerp(position, left.g, right.g),
                                          lerp(position, left.b, right.b),
                                          lerp(position, left.a, right.a)
                                      );
                        })(position, left, right);
                }
            }
            !(function(ColorBlendMode) {
                (ColorBlendMode[(ColorBlendMode.Burn = 0)] = "Burn"),
                    (ColorBlendMode[(ColorBlendMode.Color = 1)] = "Color"),
                    (ColorBlendMode[(ColorBlendMode.Darken = 2)] = "Darken"),
                    (ColorBlendMode[(ColorBlendMode.Dodge = 3)] = "Dodge"),
                    (ColorBlendMode[(ColorBlendMode.Lighten = 4)] = "Lighten"),
                    (ColorBlendMode[(ColorBlendMode.Multiply = 5)] = "Multiply"),
                    (ColorBlendMode[(ColorBlendMode.Overlay = 6)] = "Overlay"),
                    (ColorBlendMode[(ColorBlendMode.Screen = 7)] = "Screen");
            })(ColorBlendMode || (ColorBlendMode = {})),
                (function(ColorInterpolationSpace) {
                    (ColorInterpolationSpace[(ColorInterpolationSpace.RGB = 0)] = "RGB"),
                        (ColorInterpolationSpace[(ColorInterpolationSpace.HSL = 1)] =
                            "HSL"),
                        (ColorInterpolationSpace[(ColorInterpolationSpace.HSV = 2)] =
                            "HSV"),
                        (ColorInterpolationSpace[(ColorInterpolationSpace.XYZ = 3)] =
                            "XYZ"),
                        (ColorInterpolationSpace[(ColorInterpolationSpace.LAB = 4)] =
                            "LAB"),
                        (ColorInterpolationSpace[(ColorInterpolationSpace.LCH = 5)] =
                            "LCH");
                })(ColorInterpolationSpace || (ColorInterpolationSpace = {}));
            class color_scale_ColorScale {
                static createBalancedColorScale(colors) {
                    if (null == colors || 0 === colors.length)
                        throw new Error("The colors argument must be non-empty");
                    const stops = new Array(colors.length);
                    for (let i = 0; i < colors.length; i++)
                        0 === i
                            ? (stops[i] = { color: colors[i], position: 0 })
                            : i === colors.length - 1
                                ? (stops[i] = { color: colors[i], position: 1 })
                                : (stops[i] = {
                                      color: colors[i],
                                      position: i * (1 / (colors.length - 1)),
                                  });
                    return new color_scale_ColorScale(stops);
                }
                constructor(stops) {
                    if (null == stops || 0 === stops.length)
                        throw new Error("The stops argument must be non-empty");
                    this.stops = this.sortColorScaleStops(stops);
                }
                getColor(position, interpolationMode = ColorInterpolationSpace.RGB) {
                    if (1 === this.stops.length) return this.stops[0].color;
                    if (position <= 0) return this.stops[0].color;
                    if (position >= 1) return this.stops[this.stops.length - 1].color;
                    let lowerIndex = 0;
                    for (let i = 0; i < this.stops.length; i++)
                        this.stops[i].position <= position && (lowerIndex = i);
                    let upperIndex = lowerIndex + 1;
                    return (
                        upperIndex >= this.stops.length &&
                            (upperIndex = this.stops.length - 1),
                        interpolateByColorSpace(
                            (position - this.stops[lowerIndex].position) *
                                (1 /
                                    (this.stops[upperIndex].position -
                                        this.stops[lowerIndex].position)),
                            interpolationMode,
                            this.stops[lowerIndex].color,
                            this.stops[upperIndex].color
                        )
                    );
                }
                trim(
                    lowerBound,
                    upperBound,
                    interpolationMode = ColorInterpolationSpace.RGB
                ) {
                    if (lowerBound < 0 || upperBound > 1 || upperBound < lowerBound)
                        throw new Error("Invalid bounds");
                    if (lowerBound === upperBound)
                        return new color_scale_ColorScale([
                            {
                                color: this.getColor(lowerBound, interpolationMode),
                                position: 0,
                            },
                        ]);
                    const containedStops = [];
                    for (let i = 0; i < this.stops.length; i++)
                        this.stops[i].position >= lowerBound &&
                            this.stops[i].position <= upperBound &&
                            containedStops.push(this.stops[i]);
                    if (0 === containedStops.length)
                        return new color_scale_ColorScale([
                            { color: this.getColor(lowerBound), position: lowerBound },
                            { color: this.getColor(upperBound), position: upperBound },
                        ]);
                    containedStops[0].position !== lowerBound &&
                        containedStops.unshift({
                            color: this.getColor(lowerBound),
                            position: lowerBound,
                        }),
                        containedStops[containedStops.length - 1].position !==
                            upperBound &&
                            containedStops.push({
                                color: this.getColor(upperBound),
                                position: upperBound,
                            });
                    const range = upperBound - lowerBound,
                        finalStops = new Array(containedStops.length);
                    for (let i = 0; i < containedStops.length; i++)
                        finalStops[i] = {
                            color: containedStops[i].color,
                            position: (containedStops[i].position - lowerBound) / range,
                        };
                    return new color_scale_ColorScale(finalStops);
                }
                findNextColor(
                    position,
                    contrast,
                    searchDown = !1,
                    interpolationMode = ColorInterpolationSpace.RGB,
                    contrastErrorMargin = 0.005,
                    maxSearchIterations = 32
                ) {
                    isNaN(position) || position <= 0
                        ? (position = 0)
                        : position >= 1 && (position = 1);
                    const startingColor = this.getColor(position, interpolationMode),
                        finalPosition = searchDown ? 0 : 1;
                    if (
                        contrastRatio(
                            startingColor,
                            this.getColor(finalPosition, interpolationMode)
                        ) <= contrast
                    )
                        return finalPosition;
                    let testRangeMin = searchDown ? 0 : position,
                        testRangeMax = searchDown ? position : 0,
                        mid = finalPosition,
                        iterations = 0;
                    for (; iterations <= maxSearchIterations; ) {
                        mid = Math.abs(testRangeMax - testRangeMin) / 2 + testRangeMin;
                        const midContrast = contrastRatio(
                            startingColor,
                            this.getColor(mid, interpolationMode)
                        );
                        if (Math.abs(midContrast - contrast) <= contrastErrorMargin)
                            return mid;
                        midContrast > contrast
                            ? searchDown
                                ? (testRangeMin = mid)
                                : (testRangeMax = mid)
                            : searchDown
                                ? (testRangeMax = mid)
                                : (testRangeMin = mid),
                            iterations++;
                    }
                    return mid;
                }
                clone() {
                    const newStops = new Array(this.stops.length);
                    for (let i = 0; i < newStops.length; i++)
                        newStops[i] = {
                            color: this.stops[i].color,
                            position: this.stops[i].position,
                        };
                    return new color_scale_ColorScale(newStops);
                }
                sortColorScaleStops(stops) {
                    return stops.sort((a, b) => {
                        const A = a.position,
                            B = b.position;
                        return A < B ? -1 : A > B ? 1 : 0;
                    });
                }
            }
            class color_palette_ColorPalette {
                constructor(config) {
                    (this.config = Object.assign(
                        {},
                        color_palette_ColorPalette.defaultPaletteConfig,
                        config
                    )),
                        (this.palette = []),
                        this.updatePaletteColors();
                }
                updatePaletteGenerationValues(newConfig) {
                    let changed = !1;
                    for (const key in newConfig)
                        this.config[key] &&
                            (this.config[key].equalValue
                                ? this.config[key].equalValue(newConfig[key]) ||
                                  ((this.config[key] = newConfig[key]), (changed = !0))
                                : newConfig[key] !== this.config[key] &&
                                  ((this.config[key] = newConfig[key]), (changed = !0)));
                    return changed && this.updatePaletteColors(), changed;
                }
                updatePaletteColors() {
                    const scale = this.generatePaletteColorScale();
                    for (let i = 0; i < this.config.steps; i++)
                        this.palette[i] = scale.getColor(
                            i / (this.config.steps - 1),
                            this.config.interpolationMode
                        );
                }
                generatePaletteColorScale() {
                    const baseColorHSL = rgbToHSL(this.config.baseColor),
                        trimmedScale = new color_scale_ColorScale([
                            { position: 0, color: this.config.scaleColorLight },
                            { position: 0.5, color: this.config.baseColor },
                            { position: 1, color: this.config.scaleColorDark },
                        ]).trim(this.config.clipLight, 1 - this.config.clipDark);
                    let adjustedLight = trimmedScale.getColor(0),
                        adjustedDark = trimmedScale.getColor(1);
                    if (
                        (baseColorHSL.s >= this.config.saturationAdjustmentCutoff &&
                            ((adjustedLight = saturateViaLCH(
                                adjustedLight,
                                this.config.saturationLight
                            )),
                            (adjustedDark = saturateViaLCH(
                                adjustedDark,
                                this.config.saturationDark
                            ))),
                        0 !== this.config.multiplyLight)
                    ) {
                        const multiply = blendMultiply(
                            this.config.baseColor,
                            adjustedLight
                        );
                        adjustedLight = interpolateByColorSpace(
                            this.config.multiplyLight,
                            this.config.interpolationMode,
                            adjustedLight,
                            multiply
                        );
                    }
                    if (0 !== this.config.multiplyDark) {
                        const multiply = blendMultiply(
                            this.config.baseColor,
                            adjustedDark
                        );
                        adjustedDark = interpolateByColorSpace(
                            this.config.multiplyDark,
                            this.config.interpolationMode,
                            adjustedDark,
                            multiply
                        );
                    }
                    if (0 !== this.config.overlayLight) {
                        const overlay = blendOverlay(
                            this.config.baseColor,
                            adjustedLight
                        );
                        adjustedLight = interpolateByColorSpace(
                            this.config.overlayLight,
                            this.config.interpolationMode,
                            adjustedLight,
                            overlay
                        );
                    }
                    if (0 !== this.config.overlayDark) {
                        const overlay = blendOverlay(this.config.baseColor, adjustedDark);
                        adjustedDark = interpolateByColorSpace(
                            this.config.overlayDark,
                            this.config.interpolationMode,
                            adjustedDark,
                            overlay
                        );
                    }
                    return this.config.baseScalePosition
                        ? this.config.baseScalePosition <= 0
                            ? new color_scale_ColorScale([
                                  { position: 0, color: this.config.baseColor },
                                  { position: 1, color: adjustedDark.clamp() },
                              ])
                            : this.config.baseScalePosition >= 1
                                ? new color_scale_ColorScale([
                                      { position: 0, color: adjustedLight.clamp() },
                                      { position: 1, color: this.config.baseColor },
                                  ])
                                : new color_scale_ColorScale([
                                      { position: 0, color: adjustedLight.clamp() },
                                      {
                                          position: this.config.baseScalePosition,
                                          color: this.config.baseColor,
                                      },
                                      { position: 1, color: adjustedDark.clamp() },
                                  ])
                        : new color_scale_ColorScale([
                              { position: 0, color: adjustedLight.clamp() },
                              { position: 0.5, color: this.config.baseColor },
                              { position: 1, color: adjustedDark.clamp() },
                          ]);
                }
            }
            (color_palette_ColorPalette.defaultPaletteConfig = {
                baseColor: parseColorHexRGB("#808080"),
                steps: 11,
                interpolationMode: ColorInterpolationSpace.RGB,
                scaleColorLight: new color_rgba_64_ColorRGBA64(1, 1, 1, 1),
                scaleColorDark: new color_rgba_64_ColorRGBA64(0, 0, 0, 1),
                clipLight: 0.185,
                clipDark: 0.16,
                saturationAdjustmentCutoff: 0.05,
                saturationLight: 0.35,
                saturationDark: 1.25,
                overlayLight: 0,
                overlayDark: 0.25,
                multiplyLight: 0,
                multiplyDark: 0,
                baseScalePosition: 0.5,
            }),
                (color_palette_ColorPalette.greyscalePaletteConfig = {
                    baseColor: parseColorHexRGB("#808080"),
                    steps: 11,
                    interpolationMode: ColorInterpolationSpace.RGB,
                    scaleColorLight: new color_rgba_64_ColorRGBA64(1, 1, 1, 1),
                    scaleColorDark: new color_rgba_64_ColorRGBA64(0, 0, 0, 1),
                    clipLight: 0,
                    clipDark: 0,
                    saturationAdjustmentCutoff: 0,
                    saturationLight: 0,
                    saturationDark: 0,
                    overlayLight: 0,
                    overlayDark: 0,
                    multiplyLight: 0,
                    multiplyDark: 0,
                    baseScalePosition: 0.5,
                });
            color_palette_ColorPalette.defaultPaletteConfig.scaleColorLight,
                color_palette_ColorPalette.defaultPaletteConfig.scaleColorDark;
            class component_state_color_palette_ComponentStateColorPalette {
                constructor(config) {
                    (this.palette = []),
                        (this.config = Object.assign(
                            {},
                            component_state_color_palette_ComponentStateColorPalette.defaultPaletteConfig,
                            config
                        )),
                        this.regenPalettes();
                }
                regenPalettes() {
                    let steps = this.config.steps;
                    (isNaN(steps) || steps < 3) && (steps = 3);
                    const darkLumColor = new color_rgba_64_ColorRGBA64(
                            0.14,
                            0.14,
                            0.14,
                            1
                        ),
                        referencePalette = new color_palette_ColorPalette(
                            Object.assign(
                                {},
                                color_palette_ColorPalette.greyscalePaletteConfig,
                                {
                                    baseColor: darkLumColor,
                                    baseScalePosition: 86 / 94,
                                    steps: steps,
                                }
                            )
                        ).palette,
                        baseColorLum =
                            (rgbToLinearLuminance(this.config.baseColor) +
                                rgbToHSL(this.config.baseColor).l) /
                            2,
                        baseColorPercent =
                            this.matchRelativeLuminanceIndex(
                                baseColorLum,
                                referencePalette
                            ) /
                            (steps - 1),
                        darkPercent =
                            this.matchRelativeLuminanceIndex(0.14, referencePalette) /
                            (steps - 1),
                        baseColorHSL = rgbToHSL(this.config.baseColor),
                        darkBaseColor = hslToRGB(
                            color_hsl_ColorHSL.fromObject({
                                h: baseColorHSL.h,
                                s: baseColorHSL.s,
                                l: 0.14,
                            })
                        ),
                        darkestBaseColor = hslToRGB(
                            color_hsl_ColorHSL.fromObject({
                                h: baseColorHSL.h,
                                s: baseColorHSL.s,
                                l: 0.06,
                            })
                        ),
                        fullColorScaleStops = new Array(5);
                    (fullColorScaleStops[0] = {
                        position: 0,
                        color: new color_rgba_64_ColorRGBA64(1, 1, 1, 1),
                    }),
                        (fullColorScaleStops[1] = {
                            position: baseColorPercent,
                            color: this.config.baseColor,
                        }),
                        (fullColorScaleStops[2] = {
                            position: darkPercent,
                            color: darkBaseColor,
                        }),
                        (fullColorScaleStops[3] = {
                            position: 0.99,
                            color: darkestBaseColor,
                        }),
                        (fullColorScaleStops[4] = {
                            position: 1,
                            color: new color_rgba_64_ColorRGBA64(0, 0, 0, 1),
                        });
                    const scale = new color_scale_ColorScale(fullColorScaleStops);
                    this.palette = new Array(steps);
                    for (let i = 0; i < steps; i++) {
                        const c = scale.getColor(
                            i / (steps - 1),
                            ColorInterpolationSpace.RGB
                        );
                        this.palette[i] = c;
                    }
                }
                matchRelativeLuminanceIndex(input, reference) {
                    let bestFitValue = Number.MAX_VALUE,
                        bestFitIndex = 0,
                        i = 0;
                    const referenceLength = reference.length;
                    for (; i < referenceLength; i++) {
                        const fitValue = Math.abs(
                            rgbToLinearLuminance(reference[i]) - input
                        );
                        fitValue < bestFitValue &&
                            ((bestFitValue = fitValue), (bestFitIndex = i));
                    }
                    return bestFitIndex;
                }
            }
            component_state_color_palette_ComponentStateColorPalette.defaultPaletteConfig = {
                baseColor: parseColorHexRGB("#808080"),
                steps: 94,
            };
            var observable = __webpack_require__(38),
                __decorate = function(decorators, target, key, desc) {
                    var d,
                        c = arguments.length,
                        r =
                            c < 3
                                ? target
                                : null === desc
                                    ? (desc = Object.getOwnPropertyDescriptor(
                                          target,
                                          key
                                      ))
                                    : desc;
                    if (
                        "object" == typeof Reflect &&
                        "function" == typeof Reflect.decorate
                    )
                        r = Reflect.decorate(decorators, target, key, desc);
                    else
                        for (var i = decorators.length - 1; i >= 0; i--)
                            (d = decorators[i]) &&
                                (r =
                                    (c < 3
                                        ? d(r)
                                        : c > 3
                                            ? d(target, key, r)
                                            : d(target, key)) || r);
                    return c > 3 && r && Object.defineProperty(target, key, r), r;
                };
            function designSystemProperty(target, name) {
                const store = `_${name}`,
                    callbackName = `${name}Changed`;
                Reflect.defineProperty(target, name, {
                    enumerable: !0,
                    get() {
                        return observable.a.track(this, name), this[store];
                    },
                    set(value) {
                        this[store] !== value &&
                            ((this[store] = value),
                            observable.a.notify(this, name),
                            (this.designSystem = Object.assign(
                                Object.assign({}, this.designSystem),
                                { [name]: value }
                            )),
                            "function" == typeof this[callbackName] &&
                                this[callbackName]());
                    },
                });
            }
            class design_system_provider_DesignSystemProvider extends fast_element.a {
                constructor() {
                    super(...arguments),
                        (this.accentBaseColor = "#0078D4"),
                        (this.backgroundColor = "#FFFFFF"),
                        (this.baseHeightMultiplier = 8),
                        (this.bodyFont = "Segoe UI, sans-serif"),
                        (this.cornerRadius = 2),
                        (this.disabledOpacity = 0.3),
                        (this.density = 0),
                        (this.designUnit = 4),
                        (this.elevatedCornerRadius = 4),
                        (this.focusOutlineWidth = 2),
                        (this.outlineWidth = 1),
                        (this.designSystem = design_system);
                }
                accentBaseColorChanged() {
                    const color = parseColorHexRGB(this.accentBaseColor);
                    var baseColor;
                    null !== color &&
                        (this.designSystem = Object.assign(
                            Object.assign({}, this.designSystem),
                            {
                                accentPalette: ((baseColor = color),
                                new component_state_color_palette_ComponentStateColorPalette(
                                    { baseColor: baseColor }
                                ).palette.map(function(color) {
                                    return color.toStringHexRGB().toUpperCase();
                                })),
                            }
                        ));
                }
            }
            function getDesignSystemValue(key) {
                return function(designSystem) {
                    return designSystem && void 0 !== designSystem[key]
                        ? designSystem[key]
                        : design_system[key];
                };
            }
            __decorate(
                [designSystemProperty],
                design_system_provider_DesignSystemProvider.prototype,
                "accentBaseColor",
                void 0
            ),
                __decorate(
                    [designSystemProperty],
                    design_system_provider_DesignSystemProvider.prototype,
                    "backgroundColor",
                    void 0
                ),
                __decorate(
                    [designSystemProperty],
                    design_system_provider_DesignSystemProvider.prototype,
                    "baseHeightMultiplier",
                    void 0
                ),
                __decorate(
                    [designSystemProperty],
                    design_system_provider_DesignSystemProvider.prototype,
                    "bodyFont",
                    void 0
                ),
                __decorate(
                    [designSystemProperty],
                    design_system_provider_DesignSystemProvider.prototype,
                    "cornerRadius",
                    void 0
                ),
                __decorate(
                    [designSystemProperty],
                    design_system_provider_DesignSystemProvider.prototype,
                    "disabledOpacity",
                    void 0
                ),
                __decorate(
                    [designSystemProperty],
                    design_system_provider_DesignSystemProvider.prototype,
                    "density",
                    void 0
                ),
                __decorate(
                    [designSystemProperty],
                    design_system_provider_DesignSystemProvider.prototype,
                    "designUnit",
                    void 0
                ),
                __decorate(
                    [designSystemProperty],
                    design_system_provider_DesignSystemProvider.prototype,
                    "elevatedCornerRadius",
                    void 0
                ),
                __decorate(
                    [designSystemProperty],
                    design_system_provider_DesignSystemProvider.prototype,
                    "focusOutlineWidth",
                    void 0
                ),
                __decorate(
                    [designSystemProperty],
                    design_system_provider_DesignSystemProvider.prototype,
                    "outlineWidth",
                    void 0
                ),
                __decorate(
                    [observable.c],
                    design_system_provider_DesignSystemProvider.prototype,
                    "designSystem",
                    void 0
                );
            var SwatchFamilyType,
                design_system_backgroundColor = getDesignSystemValue("backgroundColor"),
                design_system_accentBaseColor = getDesignSystemValue("accentBaseColor"),
                design_system_neutralPalette = (getDesignSystemValue("cornerRadius"),
                getDesignSystemValue("elevatedCornerRadius"),
                getDesignSystemValue("neutralPalette")),
                design_system_accentPalette = getDesignSystemValue("accentPalette"),
                accentFillHoverDelta = (getDesignSystemValue("contrast"),
                getDesignSystemValue("designUnit"),
                getDesignSystemValue("baseHeightMultiplier"),
                getDesignSystemValue("baseHorizontalSpacingMultiplier"),
                getDesignSystemValue("direction"),
                getDesignSystemValue("outlineWidth"),
                getDesignSystemValue("focusOutlineWidth"),
                getDesignSystemValue("disabledOpacity"),
                getDesignSystemValue("accentFillRestDelta"),
                getDesignSystemValue("accentFillHoverDelta")),
                accentFillActiveDelta = getDesignSystemValue("accentFillActiveDelta"),
                accentFillFocusDelta = getDesignSystemValue("accentFillFocusDelta"),
                accentFillSelectedDelta = getDesignSystemValue("accentFillSelectedDelta"),
                accentForegroundRestDelta = getDesignSystemValue(
                    "accentForegroundRestDelta"
                ),
                accentForegroundHoverDelta = getDesignSystemValue(
                    "accentForegroundHoverDelta"
                ),
                accentForegroundActiveDelta = getDesignSystemValue(
                    "accentForegroundActiveDelta"
                ),
                accentForegroundFocusDelta = getDesignSystemValue(
                    "accentForegroundFocusDelta"
                ),
                neutralFillRestDelta = getDesignSystemValue("neutralFillRestDelta"),
                neutralFillHoverDelta = getDesignSystemValue("neutralFillHoverDelta"),
                neutralFillActiveDelta = getDesignSystemValue("neutralFillActiveDelta"),
                neutralFillFocusDelta = getDesignSystemValue("neutralFillFocusDelta"),
                neutralFillSelectedDelta = getDesignSystemValue(
                    "neutralFillSelectedDelta"
                ),
                neutralFillInputRestDelta = getDesignSystemValue(
                    "neutralFillInputRestDelta"
                ),
                neutralFillInputHoverDelta = getDesignSystemValue(
                    "neutralFillInputHoverDelta"
                ),
                neutralFillInputActiveDelta = getDesignSystemValue(
                    "neutralFillInputActiveDelta"
                ),
                neutralFillInputFocusDelta = getDesignSystemValue(
                    "neutralFillInputFocusDelta"
                ),
                neutralFillInputSelectedDelta = getDesignSystemValue(
                    "neutralFillInputSelectedDelta"
                ),
                neutralFillStealthRestDelta = getDesignSystemValue(
                    "neutralFillStealthRestDelta"
                ),
                neutralFillStealthHoverDelta = getDesignSystemValue(
                    "neutralFillStealthHoverDelta"
                ),
                neutralFillStealthActiveDelta = getDesignSystemValue(
                    "neutralFillStealthActiveDelta"
                ),
                neutralFillStealthFocusDelta = getDesignSystemValue(
                    "neutralFillStealthFocusDelta"
                ),
                neutralFillStealthSelectedDelta = getDesignSystemValue(
                    "neutralFillStealthSelectedDelta"
                ),
                neutralFillToggleHoverDelta = getDesignSystemValue(
                    "neutralFillToggleHoverDelta"
                ),
                neutralFillToggleActiveDelta = getDesignSystemValue(
                    "neutralFillToggleActiveDelta"
                ),
                neutralFillToggleFocusDelta = getDesignSystemValue(
                    "neutralFillToggleFocusDelta"
                ),
                baseLayerLuminance = getDesignSystemValue("baseLayerLuminance"),
                neutralFillCardDelta = getDesignSystemValue("neutralFillCardDelta"),
                neutralForegroundHoverDelta = (getDesignSystemValue(
                    "neutralForegroundDarkIndex"
                ),
                getDesignSystemValue("neutralForegroundLightIndex"),
                getDesignSystemValue("neutralForegroundHoverDelta")),
                neutralForegroundActiveDelta = getDesignSystemValue(
                    "neutralForegroundActiveDelta"
                ),
                neutralForegroundFocusDelta = getDesignSystemValue(
                    "neutralForegroundFocusDelta"
                ),
                neutralDividerRestDelta = getDesignSystemValue("neutralDividerRestDelta"),
                neutralOutlineRestDelta = getDesignSystemValue("neutralOutlineRestDelta"),
                neutralOutlineHoverDelta = getDesignSystemValue(
                    "neutralOutlineHoverDelta"
                ),
                neutralOutlineActiveDelta = getDesignSystemValue(
                    "neutralOutlineActiveDelta"
                ),
                neutralOutlineFocusDelta = (getDesignSystemValue("fontWeight"),
                getDesignSystemValue("neutralOutlineFocusDelta"));
            function colorRecipeFactory(recipe) {
                var memoizedRecipe = Object(memoize.a)(recipe);
                return function(arg) {
                    return "function" == typeof arg
                        ? function(designSystem) {
                              return memoizedRecipe(
                                  Object.assign({}, designSystem, {
                                      backgroundColor: arg(designSystem),
                                  })
                              );
                          }
                        : memoizedRecipe(arg);
                };
            }
            function swatchFamilyToSwatchRecipeFactory(type, callback) {
                var memoizedRecipe = Object(memoize.a)(callback);
                return function(arg) {
                    return "function" == typeof arg
                        ? function(designSystem) {
                              return memoizedRecipe(
                                  Object.assign({}, designSystem, {
                                      backgroundColor: arg(designSystem),
                                  })
                              )[type];
                          }
                        : memoizedRecipe(arg)[type];
                };
            }
            !(function(SwatchFamilyType) {
                (SwatchFamilyType.rest = "rest"),
                    (SwatchFamilyType.hover = "hover"),
                    (SwatchFamilyType.active = "active"),
                    (SwatchFamilyType.focus = "focus"),
                    (SwatchFamilyType.selected = "selected");
            })(SwatchFamilyType || (SwatchFamilyType = {}));
            var parseColorString = Object(memoize.a)(function(color) {
                var parsed = parseColorHexRGB(color);
                if (null !== parsed) return parsed;
                if (null !== (parsed = parseColorWebRGB(color))) return parsed;
                throw new Error(
                    "".concat(
                        color,
                        ' cannot be converted to a ColorRGBA64. Color strings must be one of the following formats: "#RGB", "#RRGGBB", or "rgb(r, g, b)"'
                    )
                );
            });
            function isValidColor(color) {
                return isColorStringHexRGB(color) || isColorStringWebRGB(color);
            }
            var common_contrast = Object(memoize.a)(
                function(a, b) {
                    return contrastRatio(parseColorString(a), parseColorString(b));
                },
                function(a, b) {
                    return a + b;
                }
            );
            function common_luminance(color) {
                return rgbToRelativeLuminance(parseColorString(color));
            }
            function designSystemResolverMax() {
                for (
                    var _len = arguments.length, args = Array(_len), _key = 0;
                    _key < _len;
                    _key++
                )
                    args[_key] = arguments[_key];
                return function(designSystem) {
                    return Math.max.apply(
                        null,
                        args.map(function(fn) {
                            return fn(designSystem);
                        })
                    );
                };
            }
            var PaletteType,
                common_clamp = function(value, min, max) {
                    return Math.min(Math.max(value, min), max);
                };
            __webpack_require__(16),
                __webpack_require__(601),
                __webpack_require__(132),
                __webpack_require__(160),
                __webpack_require__(602);
            function findSwatchIndex(paletteResolver, swatch) {
                return function(designSystem) {
                    if (!isValidColor(swatch)) return -1;
                    var colorPalette = checkDesignSystemResolver(
                            paletteResolver,
                            designSystem
                        ),
                        index = colorPalette.indexOf(swatch);
                    return -1 !== index
                        ? index
                        : colorPalette.findIndex(function(paletteSwatch) {
                              return (
                                  isValidColor(paletteSwatch) &&
                                  (function colorMatches(a, b) {
                                      return parseColorString(a).equalValue(
                                          parseColorString(b)
                                      );
                                  })(swatch, paletteSwatch)
                              );
                          });
                };
            }
            function findClosestSwatchIndex(paletteResolver, swatch) {
                return function(designSystem) {
                    var swatchLuminance,
                        resolvedPalette = checkDesignSystemResolver(
                            paletteResolver,
                            designSystem
                        ),
                        resolvedSwatch = checkDesignSystemResolver(swatch, designSystem),
                        index = findSwatchIndex(resolvedPalette, resolvedSwatch)(
                            designSystem
                        );
                    if (-1 !== index) return index;
                    try {
                        swatchLuminance = common_luminance(resolvedSwatch);
                    } catch (e) {
                        swatchLuminance = -1;
                    }
                    return -1 === swatchLuminance
                        ? 0
                        : resolvedPalette
                              .map(function(mappedSwatch, mappedIndex) {
                                  return {
                                      luminance: common_luminance(mappedSwatch),
                                      index: mappedIndex,
                                  };
                              })
                              .reduce(function(previousValue, currentValue) {
                                  return Math.abs(
                                      currentValue.luminance - swatchLuminance
                                  ) < Math.abs(previousValue.luminance - swatchLuminance)
                                      ? currentValue
                                      : previousValue;
                              }).index;
                };
            }
            function isDarkMode(designSystem) {
                return (
                    common_luminance(design_system_backgroundColor(designSystem)) <=
                    (-0.1 + Math.sqrt(0.21)) / 2
                );
            }
            function getSwatch(index, colorPalette) {
                return "function" == typeof index
                    ? function(designSystem) {
                          return colorPalette(designSystem)[
                              common_clamp(
                                  index(designSystem),
                                  0,
                                  colorPalette(designSystem).length - 1
                              )
                          ];
                      }
                    : colorPalette[common_clamp(index, 0, colorPalette.length - 1)];
            }
            function swatchByMode(paletteResolver) {
                return function(valueA, valueB) {
                    return function(designSystem) {
                        return getSwatch(
                            isDarkMode(designSystem)
                                ? checkDesignSystemResolver(valueB, designSystem)
                                : checkDesignSystemResolver(valueA, designSystem),
                            paletteResolver(designSystem)
                        );
                    };
                };
            }
            function swatchByContrast(referenceColor) {
                return function(paletteResolver) {
                    return function(indexResolver) {
                        return function(directionResolver) {
                            return function(contrastCondition) {
                                return function(designSystem) {
                                    var color = checkDesignSystemResolver(
                                            referenceColor,
                                            designSystem
                                        ),
                                        sourcePalette = checkDesignSystemResolver(
                                            paletteResolver,
                                            designSystem
                                        ),
                                        length = sourcePalette.length,
                                        initialSearchIndex = common_clamp(
                                            indexResolver(
                                                color,
                                                sourcePalette,
                                                designSystem
                                            ),
                                            0,
                                            length - 1
                                        ),
                                        direction = directionResolver(
                                            initialSearchIndex,
                                            sourcePalette,
                                            designSystem
                                        ),
                                        constrainedSourcePalette = [].concat(
                                            sourcePalette
                                        ),
                                        endSearchIndex = length - 1,
                                        startSearchIndex = initialSearchIndex;
                                    return (
                                        -1 === direction &&
                                            (constrainedSourcePalette.reverse(),
                                            (startSearchIndex =
                                                endSearchIndex - startSearchIndex)),
                                        (function binarySearch(
                                            valuesToSearch,
                                            searchCondition
                                        ) {
                                            var startIndex =
                                                    2 < arguments.length &&
                                                    void 0 !== arguments[2]
                                                        ? arguments[2]
                                                        : 0,
                                                endIndex =
                                                    3 < arguments.length &&
                                                    void 0 !== arguments[3]
                                                        ? arguments[3]
                                                        : valuesToSearch.length - 1;
                                            if (endIndex === startIndex)
                                                return valuesToSearch[startIndex];
                                            var middleIndex =
                                                Math.floor((endIndex - startIndex) / 2) +
                                                startIndex;
                                            return searchCondition(
                                                valuesToSearch[middleIndex]
                                            )
                                                ? binarySearch(
                                                      valuesToSearch,
                                                      searchCondition,
                                                      startIndex,
                                                      middleIndex
                                                  )
                                                : binarySearch(
                                                      valuesToSearch,
                                                      searchCondition,
                                                      middleIndex + 1,
                                                      endIndex
                                                  );
                                        })(
                                            constrainedSourcePalette,
                                            function(valueToCheckAgainst) {
                                                return contrastCondition(
                                                    common_contrast(
                                                        color,
                                                        valueToCheckAgainst
                                                    )
                                                );
                                            },
                                            startSearchIndex,
                                            endSearchIndex
                                        )
                                    );
                                };
                            };
                        };
                    };
                };
            }
            function referenceColorInitialIndexResolver(
                referenceColor,
                sourcePalette,
                designSystem
            ) {
                return findClosestSwatchIndex(sourcePalette, referenceColor)(
                    designSystem
                );
            }
            function findClosestBackgroundIndex(designSystem) {
                return findClosestSwatchIndex(
                    design_system_neutralPalette,
                    design_system_backgroundColor(designSystem)
                )(designSystem);
            }
            function accessibleAlgorithm(
                palette,
                minContrast,
                restDelta,
                hoverDelta,
                activeDelta,
                focusDelta
            ) {
                return function(designSystem) {
                    var resolvedPalette = checkDesignSystemResolver(
                            palette,
                            designSystem
                        ),
                        direction = isDarkMode(designSystem) ? -1 : 1,
                        accessibleSwatch = swatchByContrast(
                            design_system_backgroundColor
                        )(resolvedPalette)(referenceColorInitialIndexResolver)(
                            function() {
                                return direction;
                            }
                        )(
                            (function minContrastTargetFactory(targetContrast) {
                                return function(instanceContrast) {
                                    return instanceContrast >= targetContrast;
                                };
                            })(checkDesignSystemResolver(minContrast, designSystem))
                        )(designSystem),
                        accessibleIndex = findSwatchIndex(palette, accessibleSwatch)(
                            designSystem
                        ),
                        resolvedRest = checkDesignSystemResolver(restDelta, designSystem),
                        resolvedHover = checkDesignSystemResolver(
                            hoverDelta,
                            designSystem
                        ),
                        resolvedActive = checkDesignSystemResolver(
                            activeDelta,
                            designSystem
                        ),
                        resolvedFocus = checkDesignSystemResolver(
                            focusDelta,
                            designSystem
                        );
                    return (function indexToSwatchFamily(
                        accessibleIndex,
                        palette,
                        direction,
                        restDelta,
                        hoverDelta,
                        activeDelta,
                        focusDelta
                    ) {
                        var accessibleIndex2 =
                                accessibleIndex +
                                direction * Math.abs(restDelta - hoverDelta),
                            indexOneIsRestState =
                                1 === direction
                                    ? restDelta < hoverDelta
                                    : direction * restDelta > direction * hoverDelta,
                            restIndex = indexOneIsRestState
                                ? accessibleIndex
                                : accessibleIndex2,
                            hoverIndex = indexOneIsRestState
                                ? accessibleIndex2
                                : accessibleIndex;
                        return {
                            rest: getSwatch(restIndex, palette),
                            hover: getSwatch(hoverIndex, palette),
                            active: getSwatch(
                                restIndex + direction * activeDelta,
                                palette
                            ),
                            focus: getSwatch(restIndex + direction * focusDelta, palette),
                        };
                    })(
                        accessibleIndex,
                        resolvedPalette,
                        direction,
                        resolvedRest,
                        resolvedHover,
                        resolvedActive,
                        resolvedFocus
                    );
                };
            }
            !(function(PaletteType) {
                (PaletteType.neutral = "neutral"), (PaletteType.accent = "accent");
            })(PaletteType || (PaletteType = {}));
            var neutralForeground = colorRecipeFactory(
                    accessibleAlgorithm(
                        design_system_neutralPalette,
                        14,
                        0,
                        neutralForegroundHoverDelta,
                        neutralForegroundActiveDelta,
                        neutralForegroundFocusDelta
                    )
                ),
                neutralFillToggle = (swatchFamilyToSwatchRecipeFactory(
                    SwatchFamilyType.rest,
                    neutralForeground
                ),
                swatchFamilyToSwatchRecipeFactory(
                    SwatchFamilyType.hover,
                    neutralForeground
                ),
                swatchFamilyToSwatchRecipeFactory(
                    SwatchFamilyType.active,
                    neutralForeground
                ),
                swatchFamilyToSwatchRecipeFactory(
                    SwatchFamilyType.focus,
                    neutralForeground
                ),
                colorRecipeFactory(
                    accessibleAlgorithm(
                        design_system_neutralPalette,
                        4.5,
                        0,
                        neutralFillToggleHoverDelta,
                        neutralFillToggleActiveDelta,
                        neutralFillToggleFocusDelta
                    )
                )),
                neutralFillToggleRest = swatchFamilyToSwatchRecipeFactory(
                    SwatchFamilyType.rest,
                    neutralFillToggle
                ),
                neutralForegroundToggleAlgorithm = (swatchFamilyToSwatchRecipeFactory(
                    SwatchFamilyType.hover,
                    neutralFillToggle
                ),
                swatchFamilyToSwatchRecipeFactory(
                    SwatchFamilyType.active,
                    neutralFillToggle
                ),
                swatchFamilyToSwatchRecipeFactory(
                    SwatchFamilyType.focus,
                    neutralFillToggle
                ),
                function(backgroundColor, targetContrast) {
                    return common_contrast(white, backgroundColor) >= targetContrast
                        ? white
                        : "#000000";
                });
            function neutralForegroundToggleFactory(targetContrast) {
                return function(arg) {
                    return "function" == typeof arg
                        ? function(designSystem) {
                              return neutralForegroundToggleAlgorithm(
                                  arg(designSystem),
                                  targetContrast
                              );
                          }
                        : neutralForegroundToggleAlgorithm(
                              neutralFillToggleRest(arg),
                              targetContrast
                          );
                };
            }
            var neutralForegroundToggle = neutralForegroundToggleFactory(4.5),
                neutralForegroundToggleLarge = neutralForegroundToggleFactory(3);
            function neutralForegroundHintAlgorithm(targetContrast) {
                return accessibleAlgorithm(
                    design_system_neutralPalette,
                    targetContrast,
                    0,
                    0,
                    0,
                    0
                );
            }
            var neutralForegroundHint = swatchFamilyToSwatchRecipeFactory(
                    SwatchFamilyType.rest,
                    colorRecipeFactory(neutralForegroundHintAlgorithm(4.5))
                ),
                neutralForegroundHintLarge = swatchFamilyToSwatchRecipeFactory(
                    SwatchFamilyType.rest,
                    colorRecipeFactory(neutralForegroundHintAlgorithm(3))
                );
            function accentForegroundAlgorithm(contrastTarget) {
                return function(designSystem) {
                    var palette = design_system_accentPalette(designSystem),
                        accent = design_system_accentBaseColor(designSystem),
                        accentIndex = findClosestSwatchIndex(
                            design_system_accentPalette,
                            accent
                        )(designSystem),
                        stateDeltas = {
                            rest: accentForegroundRestDelta(designSystem),
                            hover: accentForegroundHoverDelta(designSystem),
                            active: accentForegroundActiveDelta(designSystem),
                            focus: accentForegroundFocusDelta(designSystem),
                        },
                        direction = isDarkMode(designSystem) ? -1 : 1,
                        startIndex =
                            accentIndex +
                            (1 === direction
                                ? Math.min(stateDeltas.rest, stateDeltas.hover)
                                : Math.max(
                                      direction * stateDeltas.rest,
                                      direction * stateDeltas.hover
                                  )),
                        accessibleSwatch = swatchByContrast(
                            design_system_backgroundColor
                        )(design_system_accentPalette)(function() {
                            return startIndex;
                        })(function() {
                            return direction;
                        })(function(swatchContrast) {
                            return swatchContrast >= contrastTarget;
                        })(designSystem),
                        accessibleIndex1 = findSwatchIndex(
                            design_system_accentPalette,
                            accessibleSwatch
                        )(designSystem),
                        accessibleIndex2 =
                            accessibleIndex1 +
                            direction * Math.abs(stateDeltas.rest - stateDeltas.hover),
                        indexOneIsRestState =
                            1 === direction
                                ? stateDeltas.rest < stateDeltas.hover
                                : direction * stateDeltas.rest >
                                  direction * stateDeltas.hover,
                        restIndex = indexOneIsRestState
                            ? accessibleIndex1
                            : accessibleIndex2,
                        hoverIndex = indexOneIsRestState
                            ? accessibleIndex2
                            : accessibleIndex1,
                        activeIndex = restIndex + direction * stateDeltas.active,
                        focusIndex = restIndex + direction * stateDeltas.focus;
                    return {
                        rest: getSwatch(restIndex, palette),
                        hover: getSwatch(hoverIndex, palette),
                        active: getSwatch(activeIndex, palette),
                        focus: getSwatch(focusIndex, palette),
                    };
                };
            }
            var accentForeground = colorRecipeFactory(accentForegroundAlgorithm(4.5)),
                accentForegroundLarge = colorRecipeFactory(accentForegroundAlgorithm(3)),
                accentForegroundCutAlgorithm = (swatchFamilyToSwatchRecipeFactory(
                    SwatchFamilyType.rest,
                    accentForeground
                ),
                swatchFamilyToSwatchRecipeFactory(
                    SwatchFamilyType.hover,
                    accentForeground
                ),
                swatchFamilyToSwatchRecipeFactory(
                    SwatchFamilyType.active,
                    accentForeground
                ),
                swatchFamilyToSwatchRecipeFactory(
                    SwatchFamilyType.focus,
                    accentForeground
                ),
                swatchFamilyToSwatchRecipeFactory(
                    SwatchFamilyType.rest,
                    accentForegroundLarge
                ),
                swatchFamilyToSwatchRecipeFactory(
                    SwatchFamilyType.hover,
                    accentForegroundLarge
                ),
                swatchFamilyToSwatchRecipeFactory(
                    SwatchFamilyType.active,
                    accentForegroundLarge
                ),
                swatchFamilyToSwatchRecipeFactory(
                    SwatchFamilyType.focus,
                    accentForegroundLarge
                ),
                function(backgroundColor, targetContrast) {
                    return common_contrast(white, backgroundColor) >= targetContrast
                        ? white
                        : "#000000";
                });
            function accentForegroundCutFactory(targetContrast) {
                return function(arg) {
                    return "function" == typeof arg
                        ? function(designSystem) {
                              return accentForegroundCutAlgorithm(
                                  arg(designSystem),
                                  targetContrast
                              );
                          }
                        : accentForegroundCutAlgorithm(
                              design_system_accentBaseColor(arg),
                              targetContrast
                          );
                };
            }
            var accentForegroundCut = accentForegroundCutFactory(4.5),
                neutralFillThreshold = (accentForegroundCutFactory(3),
                designSystemResolverMax(
                    neutralFillRestDelta,
                    neutralFillHoverDelta,
                    neutralFillActiveDelta,
                    neutralFillFocusDelta
                ));
            function neutralFillAlgorithm(deltaResolver) {
                return function(designSystem) {
                    var backgroundIndex = findClosestBackgroundIndex(designSystem);
                    return getSwatch(
                        backgroundIndex +
                            (backgroundIndex >= neutralFillThreshold(designSystem)
                                ? -1
                                : 1) *
                                deltaResolver(designSystem),
                        design_system_neutralPalette(designSystem)
                    );
                };
            }
            var neutralFill = colorRecipeFactory(function(designSystem) {
                    return {
                        rest: neutralFillRest(designSystem),
                        hover: neutralFillHover(designSystem),
                        active: neutralFillActive(designSystem),
                        focus: neutralFillFocus(designSystem),
                        selected: neutralFillSelected(designSystem),
                    };
                }),
                neutralFillRest = colorRecipeFactory(
                    neutralFillAlgorithm(neutralFillRestDelta)
                ),
                neutralFillHover = colorRecipeFactory(
                    neutralFillAlgorithm(neutralFillHoverDelta)
                ),
                neutralFillActive = colorRecipeFactory(
                    neutralFillAlgorithm(neutralFillActiveDelta)
                ),
                neutralFillFocus = colorRecipeFactory(
                    neutralFillAlgorithm(neutralFillFocusDelta)
                ),
                neutralFillSelected = colorRecipeFactory(
                    neutralFillAlgorithm(neutralFillSelectedDelta)
                ),
                neutralFillStealthSwapThreshold = designSystemResolverMax(
                    neutralFillRestDelta,
                    neutralFillHoverDelta,
                    neutralFillActiveDelta,
                    neutralFillFocusDelta,
                    neutralFillStealthRestDelta,
                    neutralFillStealthHoverDelta,
                    neutralFillStealthActiveDelta,
                    neutralFillStealthFocusDelta
                );
            function neutralFillStealthAlgorithm(deltaResolver) {
                return function(designSystem) {
                    var backgroundIndex = findClosestBackgroundIndex(designSystem);
                    return getSwatch(
                        backgroundIndex +
                            (backgroundIndex >=
                            neutralFillStealthSwapThreshold(designSystem)
                                ? -1
                                : 1) *
                                deltaResolver(designSystem),
                        design_system_neutralPalette(designSystem)
                    );
                };
            }
            var neutralFillStealth = colorRecipeFactory(function(designSystem) {
                    return {
                        rest: neutralFillStealthRest(designSystem),
                        hover: neutralFillStealthHover(designSystem),
                        active: neutralFillStealthActive(designSystem),
                        focus: neutralFillStealthFocus(designSystem),
                        selected: neutralFillStealthSelected(designSystem),
                    };
                }),
                neutralFillStealthRest = colorRecipeFactory(
                    neutralFillStealthAlgorithm(neutralFillStealthRestDelta)
                ),
                neutralFillStealthHover = colorRecipeFactory(
                    neutralFillStealthAlgorithm(neutralFillStealthHoverDelta)
                ),
                neutralFillStealthActive = colorRecipeFactory(
                    neutralFillStealthAlgorithm(neutralFillStealthActiveDelta)
                ),
                neutralFillStealthFocus = colorRecipeFactory(
                    neutralFillStealthAlgorithm(neutralFillStealthFocusDelta)
                ),
                neutralFillStealthSelected = colorRecipeFactory(
                    neutralFillStealthAlgorithm(neutralFillStealthSelectedDelta)
                );
            function neutralFillInputAlgorithm(indexResolver) {
                return function(designSystem) {
                    var direction = isDarkMode(designSystem) ? -1 : 1;
                    return getSwatch(
                        findClosestBackgroundIndex(designSystem) -
                            indexResolver(designSystem) * direction,
                        design_system_neutralPalette(designSystem)
                    );
                };
            }
            var neutralFillInput = colorRecipeFactory(function(designSystem) {
                    return {
                        rest: neutralFillInputRest(designSystem),
                        hover: neutralFillInputHover(designSystem),
                        active: neutralFillInputActive(designSystem),
                        focus: neutralFillInputFocus(designSystem),
                        selected: neutralFillInputSelected(designSystem),
                    };
                }),
                neutralFillInputRest = colorRecipeFactory(
                    neutralFillInputAlgorithm(neutralFillInputRestDelta)
                ),
                neutralFillInputHover = colorRecipeFactory(
                    neutralFillInputAlgorithm(neutralFillInputHoverDelta)
                ),
                neutralFillInputActive = colorRecipeFactory(
                    neutralFillInputAlgorithm(neutralFillInputActiveDelta)
                ),
                neutralFillInputFocus = colorRecipeFactory(
                    neutralFillInputAlgorithm(neutralFillInputFocusDelta)
                ),
                neutralFillInputSelected = colorRecipeFactory(
                    neutralFillInputAlgorithm(neutralFillInputSelectedDelta)
                ),
                inRange = __webpack_require__(630),
                accent_fill_neutralFillThreshold = designSystemResolverMax(
                    neutralFillRestDelta,
                    neutralFillHoverDelta,
                    neutralFillActiveDelta
                );
            function accentFillAlgorithm(contrastTarget) {
                return function(designSystem) {
                    for (
                        var palette = design_system_accentPalette(designSystem),
                            paletteLength = palette.length,
                            accent = design_system_accentBaseColor(designSystem),
                            textColor = accentForegroundCut(
                                Object.assign({}, designSystem, {
                                    backgroundColor: accent,
                                })
                            ),
                            hoverDelta = accentFillHoverDelta(designSystem),
                            direction =
                                findClosestBackgroundIndex(designSystem) >=
                                accent_fill_neutralFillThreshold(designSystem)
                                    ? -1
                                    : 1,
                            accentIndex = findClosestSwatchIndex(
                                design_system_accentPalette,
                                accent
                            )(designSystem),
                            accessibleOffset = 0;
                        accessibleOffset < direction * hoverDelta &&
                        Object(inRange.a)(
                            accentIndex + accessibleOffset + direction,
                            0,
                            paletteLength
                        ) &&
                        common_contrast(
                            palette[accentIndex + accessibleOffset + direction],
                            textColor
                        ) >= contrastTarget &&
                        Object(inRange.a)(
                            accentIndex + accessibleOffset + direction + direction,
                            0,
                            paletteLength - 1
                        );

                    )
                        accessibleOffset += direction;
                    var hoverIndex = accentIndex + accessibleOffset,
                        restIndex = hoverIndex + -1 * direction * hoverDelta,
                        activeIndex =
                            restIndex + direction * accentFillActiveDelta(designSystem),
                        focusIndex =
                            restIndex + direction * accentFillFocusDelta(designSystem);
                    return {
                        rest: getSwatch(restIndex, palette),
                        hover: getSwatch(hoverIndex, palette),
                        active: getSwatch(activeIndex, palette),
                        focus: getSwatch(focusIndex, palette),
                        selected: getSwatch(
                            restIndex +
                                (isDarkMode(designSystem)
                                    ? -1 * accentFillSelectedDelta(designSystem)
                                    : accentFillSelectedDelta(designSystem)),
                            palette
                        ),
                    };
                };
            }
            var accentFill = colorRecipeFactory(accentFillAlgorithm(4.5)),
                accentFillLarge = colorRecipeFactory(accentFillAlgorithm(3)),
                neutralCardFillAlgorithm = (swatchFamilyToSwatchRecipeFactory(
                    SwatchFamilyType.rest,
                    accentFill
                ),
                swatchFamilyToSwatchRecipeFactory(SwatchFamilyType.hover, accentFill),
                swatchFamilyToSwatchRecipeFactory(SwatchFamilyType.active, accentFill),
                swatchFamilyToSwatchRecipeFactory(SwatchFamilyType.focus, accentFill),
                swatchFamilyToSwatchRecipeFactory(SwatchFamilyType.selected, accentFill),
                swatchFamilyToSwatchRecipeFactory(SwatchFamilyType.rest, accentFillLarge),
                swatchFamilyToSwatchRecipeFactory(
                    SwatchFamilyType.hover,
                    accentFillLarge
                ),
                swatchFamilyToSwatchRecipeFactory(
                    SwatchFamilyType.active,
                    accentFillLarge
                ),
                swatchFamilyToSwatchRecipeFactory(
                    SwatchFamilyType.focus,
                    accentFillLarge
                ),
                swatchFamilyToSwatchRecipeFactory(
                    SwatchFamilyType.selected,
                    accentFillLarge
                ),
                function(designSystem) {
                    var offset = neutralFillCardDelta(designSystem),
                        index = findClosestSwatchIndex(
                            design_system_neutralPalette,
                            design_system_backgroundColor(designSystem)
                        )(designSystem);
                    return getSwatch(
                        index - (index < offset ? -1 * offset : offset),
                        design_system_neutralPalette(designSystem)
                    );
                });
            var neutralOutline = colorRecipeFactory(function(designSystem) {
                    var palette = design_system_neutralPalette(designSystem),
                        backgroundIndex = findClosestBackgroundIndex(designSystem),
                        direction = isDarkMode(designSystem) ? -1 : 1,
                        restDelta = neutralOutlineRestDelta(designSystem),
                        restIndex = backgroundIndex + direction * restDelta,
                        hoverDelta = neutralOutlineHoverDelta(designSystem),
                        activeDelta = neutralOutlineActiveDelta(designSystem),
                        focusDelta = neutralOutlineFocusDelta(designSystem);
                    return {
                        rest: getSwatch(restIndex, palette),
                        hover: getSwatch(
                            restIndex + direction * (hoverDelta - restDelta),
                            palette
                        ),
                        active: getSwatch(
                            restIndex + direction * (activeDelta - restDelta),
                            palette
                        ),
                        focus: getSwatch(
                            restIndex + direction * (focusDelta - restDelta),
                            palette
                        ),
                    };
                }),
                neutralDividerRest = (swatchFamilyToSwatchRecipeFactory(
                    SwatchFamilyType.rest,
                    neutralOutline
                ),
                swatchFamilyToSwatchRecipeFactory(SwatchFamilyType.hover, neutralOutline),
                swatchFamilyToSwatchRecipeFactory(
                    SwatchFamilyType.active,
                    neutralOutline
                ),
                swatchFamilyToSwatchRecipeFactory(SwatchFamilyType.focus, neutralOutline),
                colorRecipeFactory(function(designSystem) {
                    var palette = design_system_neutralPalette(designSystem),
                        backgroundIndex = findClosestBackgroundIndex(designSystem),
                        delta = neutralDividerRestDelta(designSystem);
                    return getSwatch(
                        backgroundIndex + (isDarkMode(designSystem) ? -1 : 1) * delta,
                        palette
                    );
                }));
            function performOperation(operation) {
                return (...args) => designSystem => {
                    const firstArg = args[0];
                    let value =
                        "function" == typeof firstArg ? firstArg(designSystem) : firstArg;
                    for (let i = 1; i < args.length; i++) {
                        const currentValue = args[i];
                        value = operation(
                            value,
                            "function" == typeof currentValue
                                ? currentValue(designSystem)
                                : currentValue
                        );
                    }
                    return value;
                };
            }
            const _add = performOperation((a, b) => a + b),
                _subtract = performOperation((a, b) => a - b),
                _multiply = performOperation((a, b) => a * b);
            performOperation((a, b) => a / b);
            function add(...args) {
                return _add.apply(this, args);
            }
            function subtract(...args) {
                return _subtract.apply(this, args);
            }
            function math_multiply(...args) {
                return _multiply.apply(this, args);
            }
            var NeutralPaletteLightModeLayers,
                NeutralPaletteDarkModeLayers,
                StandardLuminance;
            function luminanceOrBackgroundColor(luminanceRecipe, backgroundRecipe) {
                return function(designSystem) {
                    return -1 === baseLayerLuminance(designSystem)
                        ? backgroundRecipe(designSystem)
                        : luminanceRecipe(designSystem);
                };
            }
            !(function(NeutralPaletteLightModeLayers) {
                (NeutralPaletteLightModeLayers[(NeutralPaletteLightModeLayers.L1 = 0)] =
                    "L1"),
                    (NeutralPaletteLightModeLayers[
                        (NeutralPaletteLightModeLayers.L1Alt = 3)
                    ] = "L1Alt"),
                    (NeutralPaletteLightModeLayers[
                        (NeutralPaletteLightModeLayers.L2 = 10)
                    ] = "L2"),
                    (NeutralPaletteLightModeLayers[
                        (NeutralPaletteLightModeLayers.L3 = 13)
                    ] = "L3"),
                    (NeutralPaletteLightModeLayers[
                        (NeutralPaletteLightModeLayers.L4 = 16)
                    ] = "L4");
            })(NeutralPaletteLightModeLayers || (NeutralPaletteLightModeLayers = {})),
                (function(NeutralPaletteDarkModeLayers) {
                    (NeutralPaletteDarkModeLayers[
                        (NeutralPaletteDarkModeLayers.L1 = 76)
                    ] = "L1"),
                        (NeutralPaletteDarkModeLayers[
                            (NeutralPaletteDarkModeLayers.L1Alt = 76)
                        ] = "L1Alt"),
                        (NeutralPaletteDarkModeLayers[
                            (NeutralPaletteDarkModeLayers.L2 = 79)
                        ] = "L2"),
                        (NeutralPaletteDarkModeLayers[
                            (NeutralPaletteDarkModeLayers.L3 = 82)
                        ] = "L3"),
                        (NeutralPaletteDarkModeLayers[
                            (NeutralPaletteDarkModeLayers.L4 = 85)
                        ] = "L4");
                })(NeutralPaletteDarkModeLayers || (NeutralPaletteDarkModeLayers = {})),
                (function(StandardLuminance) {
                    (StandardLuminance[(StandardLuminance.LightMode = 1)] = "LightMode"),
                        (StandardLuminance[(StandardLuminance.DarkMode = 0.23)] =
                            "DarkMode");
                })(StandardLuminance || (StandardLuminance = {}));
            var baseLayerLuminanceIndex = findClosestSwatchIndex(
                    design_system_neutralPalette,
                    function(designSystem) {
                        var luminance = baseLayerLuminance(designSystem);
                        return new color_rgba_64_ColorRGBA64(
                            luminance,
                            luminance,
                            luminance,
                            1
                        ).toStringHexRGB();
                    }
                ),
                neutralLayerCardIndex = function(designSystem) {
                    return clamp(
                        subtract(baseLayerLuminanceIndex, neutralFillCardDelta)(
                            designSystem
                        ),
                        0,
                        design_system_neutralPalette(designSystem).length - 1
                    );
                },
                lightNeutralLayerL2 = designSystemResolverMax(
                    neutralFillRestDelta,
                    neutralFillHoverDelta,
                    neutralFillActiveDelta
                ),
                neutralLayerL2Index = designSystemResolverMax(
                    add(baseLayerLuminanceIndex, neutralFillCardDelta),
                    lightNeutralLayerL2
                ),
                darkNeutralLayerL4 = function(designSystem) {
                    var darkColor = new color_rgba_64_ColorRGBA64(0.14, 0.14, 0.14, 1);
                    return findClosestSwatchIndex(
                        design_system_neutralPalette,
                        darkColor.toStringHexRGB()
                    )(designSystem);
                },
                neutralLayerFloating = colorRecipeFactory(
                    luminanceOrBackgroundColor(
                        getSwatch(
                            subtract(neutralLayerCardIndex, neutralFillCardDelta),
                            design_system_neutralPalette
                        ),
                        swatchByMode(design_system_neutralPalette)(
                            0,
                            subtract(
                                darkNeutralLayerL4,
                                math_multiply(neutralFillCardDelta, 5)
                            )
                        )
                    )
                ),
                neutralLayerCard = colorRecipeFactory(
                    luminanceOrBackgroundColor(
                        getSwatch(neutralLayerCardIndex, design_system_neutralPalette),
                        swatchByMode(design_system_neutralPalette)(
                            0,
                            subtract(
                                darkNeutralLayerL4,
                                math_multiply(neutralFillCardDelta, 4)
                            )
                        )
                    )
                ),
                neutralLayerCardContainer = colorRecipeFactory(
                    luminanceOrBackgroundColor(
                        getSwatch(
                            add(neutralLayerCardIndex, neutralFillCardDelta),
                            design_system_neutralPalette
                        ),
                        swatchByMode(design_system_neutralPalette)(
                            neutralFillCardDelta,
                            subtract(
                                darkNeutralLayerL4,
                                math_multiply(neutralFillCardDelta, 3)
                            )
                        )
                    )
                ),
                neutralLayerL1 = colorRecipeFactory(
                    luminanceOrBackgroundColor(
                        getSwatch(baseLayerLuminanceIndex, design_system_neutralPalette),
                        swatchByMode(design_system_neutralPalette)(
                            0,
                            subtract(
                                darkNeutralLayerL4,
                                math_multiply(neutralFillCardDelta, 3)
                            )
                        )
                    )
                ),
                neutralLayerL1Alt = neutralLayerCardContainer,
                neutralLayerL2 = colorRecipeFactory(
                    luminanceOrBackgroundColor(
                        getSwatch(neutralLayerL2Index, design_system_neutralPalette),
                        swatchByMode(design_system_neutralPalette)(
                            lightNeutralLayerL2,
                            subtract(
                                darkNeutralLayerL4,
                                math_multiply(neutralFillCardDelta, 2)
                            )
                        )
                    )
                ),
                neutralLayerL3 = colorRecipeFactory(
                    luminanceOrBackgroundColor(
                        getSwatch(
                            add(neutralLayerL2Index, neutralFillCardDelta),
                            design_system_neutralPalette
                        ),
                        swatchByMode(design_system_neutralPalette)(
                            add(lightNeutralLayerL2, neutralFillCardDelta),
                            subtract(darkNeutralLayerL4, neutralFillCardDelta)
                        )
                    )
                ),
                neutralLayerL4 = colorRecipeFactory(
                    luminanceOrBackgroundColor(
                        getSwatch(
                            add(
                                neutralLayerL2Index,
                                math_multiply(neutralFillCardDelta, 2)
                            ),
                            design_system_neutralPalette
                        ),
                        swatchByMode(design_system_neutralPalette)(
                            add(
                                lightNeutralLayerL2,
                                math_multiply(neutralFillCardDelta, 2)
                            ),
                            darkNeutralLayerL4
                        )
                    )
                );
            function neutralFocusContrastCondition(contrastRatio) {
                return contrastRatio > 3.5;
            }
            var neutralFocus = colorRecipeFactory(
                swatchByContrast(design_system_backgroundColor)(
                    design_system_neutralPalette
                )(function neutralFocusIndexResolver(
                    referenceColor,
                    palette,
                    designSystem
                ) {
                    return findClosestSwatchIndex(
                        design_system_neutralPalette,
                        referenceColor
                    )(designSystem);
                })(function neutralFocusDirectionResolver(index, palette, designSystem) {
                    return isDarkMode(designSystem) ? -1 : 1;
                })(neutralFocusContrastCondition)
            );
            function neutralFocusInnerAccentDirectionResolver(
                referenceIndex,
                palette,
                designSystem
            ) {
                return isDarkMode(designSystem) ? 1 : -1;
            }
            const DesignSystemProviderTemplate = __webpack_require__(631).a`
  <template style="
    --accent-base-color: ${x => x.accentBaseColor};
    --background-color: ${x => x.backgroundColor};
    --base-height-multiplier: ${x => x.baseHeightMultiplier};
    --body-font: ${x => x.bodyFont};
    --corner-radius: ${x => x.cornerRadius};
    --disabled-opacity: ${x => x.disabledOpacity};
    --density: ${x => x.density};
    --design-unit: ${x => x.designUnit};
    --elevated-corner-radius: ${x => x.elevatedCornerRadius};
    --focus-outline-width: ${x => x.focusOutlineWidth};
    --outline-width: ${x => x.outlineWidth};

    --height-number: calc((var(--base-height-multiplier) + var(--density)) * var(--design-unit));

    --neutral-foreground-rest: ${x => neutralForeground(x.designSystem).rest};
    --neutral-foreground-hover: ${x => neutralForeground(x.designSystem).hover};
    --neutral-foreground-active: ${x => neutralForeground(x.designSystem).active};
    --neutral-foreground-focus: ${x => neutralForeground(x.designSystem).focus};

    --neutral-foreground-toggle: ${x => neutralForegroundToggle(x.designSystem)};
    --neutral-foreground-toggle-large: ${x =>
        neutralForegroundToggleLarge(x.designSystem)};

    --neutral-foreground-hint: ${x => neutralForegroundHint(x.designSystem)};
    --neutral-foreground-hint-large: ${x => neutralForegroundHintLarge(x.designSystem)};

    --accent-foreground-rest: ${x => accentForeground(x.designSystem).rest};
    --accent-foreground-hover: ${x => accentForeground(x.designSystem).hover};
    --accent-foreground-active: ${x => accentForeground(x.designSystem).active};
    --accent-foreground-focus: ${x => accentForeground(x.designSystem).focus};

    --accent-foreground-cut-rest: ${x => accentForegroundCut(x.designSystem)};

    --accent-foreground-large-rest: ${x => accentForegroundLarge(x.designSystem).rest};
    --accent-foreground-large-hover: ${x => accentForegroundLarge(x.designSystem).hover};
    --accent-foreground-large-active: ${x =>
        accentForegroundLarge(x.designSystem).active};
    --accent-foreground-large-focus: ${x => accentForegroundLarge(x.designSystem).focus};

    --neutral-fill-rest: ${x => neutralFill(x.designSystem).rest};
    --neutral-fill-hover: ${x => neutralFill(x.designSystem).hover};
    --neutral-fill-active: ${x => neutralFill(x.designSystem).active};
    --neutral-fill-focus: ${x => neutralFill(x.designSystem).focus};
    --neutral-fill-selected: ${x => neutralFill(x.designSystem).selected};

    --neutral-fill-stealth-rest: ${x => neutralFillStealth(x.designSystem).rest};
    --neutral-fill-stealth-hover: ${x => neutralFillStealth(x.designSystem).hover};
    --neutral-fill-stealth-active: ${x => neutralFillStealth(x.designSystem).active};
    --neutral-fill-stealth-focus: ${x => neutralFillStealth(x.designSystem).focus};
    --neutral-fill-stealth-selected: ${x => neutralFillStealth(x.designSystem).selected};

    --neutral-fill-toggle-rest: ${x => neutralFillToggle(x.designSystem).rest};
    --neutral-fill-toggle-hover: ${x => neutralFillToggle(x.designSystem).hover};
    --neutral-fill-toggle-active: ${x => neutralFillToggle(x.designSystem).active};
    --neutral-fill-toggle-focus: ${x => neutralFillToggle(x.designSystem).focus};

    --neutral-fill-input-rest: ${x => neutralFillInput(x.designSystem).rest};
    --neutral-fill-input-hover: ${x => neutralFillInput(x.designSystem).hover};
    --neutral-fill-input-active: ${x => neutralFillInput(x.designSystem).active};
    --neutral-fill-input-focus: ${x => neutralFillInput(x.designSystem).focus};

    --accent-fill-rest: ${x => accentFill(x.designSystem).rest};
    --accent-fill-hover: ${x => accentFill(x.designSystem).hover};
    --accent-fill-active: ${x => accentFill(x.designSystem).active};
    --accent-fill-focus: ${x => accentFill(x.designSystem).focus};
    --accent-fill-selected: ${x => accentFill(x.designSystem).selected};

    --accent-fill-large-rest: ${x => accentFillLarge(x.designSystem).rest};
    --accent-fill-large-hover: ${x => accentFillLarge(x.designSystem).hover};
    --accent-fill-large-active: ${x => accentFillLarge(x.designSystem).active};
    --accent-fill-large-focus: ${x => accentFillLarge(x.designSystem).focus};
    --accent-fill-large-selected: ${x => accentFillLarge(x.designSystem).selected};

    --neutral-fill-card-rest: ${x =>
        (function neutralFillCard(arg) {
            return "function" == typeof arg
                ? function(designSystem) {
                      return neutralCardFillAlgorithm(
                          Object.assign({}, designSystem, {
                              backgroundColor: arg(designSystem),
                          })
                      );
                  }
                : neutralCardFillAlgorithm(arg);
        })(x.designSystem)};

    --neutral-outline-rest: ${x => neutralOutline(x.designSystem).rest};
    --neutral-outline-hover: ${x => neutralOutline(x.designSystem).hover};
    --neutral-outline-active: ${x => neutralOutline(x.designSystem).active};
    --neutral-outline-focus: ${x => neutralOutline(x.designSystem).focus};

    --neutral-divider-rest: ${x => neutralDividerRest(x.designSystem)};

    --neutral-layer-floating: ${x => neutralLayerFloating(x.designSystem)};
    --neutral-layer-card: ${x => neutralLayerCard(x.designSystem)};
    --neutral-layer-card-container: ${x => neutralLayerCardContainer(x.designSystem)};
    --neutral-layer-l1: ${x => neutralLayerL1(x.designSystem)};
    --neutral-layer-l1-alt: ${x => neutralLayerL1Alt(x.designSystem)};
    --neutral-layer-l2: ${x => neutralLayerL2(x.designSystem)};
    --neutral-layer-l3: ${x => neutralLayerL3(x.designSystem)};
    --neutral-layer-l4: ${x => neutralLayerL4(x.designSystem)};

    --neutral-focus: ${x => neutralFocus(x.designSystem)};

    --neutral-focus-inner-accent: ${x =>
        (function neutralFocusInnerAccent(accentFillColor) {
            return swatchByContrast(neutralFocus)(design_system_accentPalette)(
                (function neutralFocusInnerAccentIndexResolver(accentFillColor) {
                    return function(referenceColor, sourcePalette, designSystem) {
                        return sourcePalette.indexOf(accentFillColor(designSystem));
                    };
                })(accentFillColor)
            )(neutralFocusInnerAccentDirectionResolver)(neutralFocusContrastCondition);
        })(() => x.designSystem.accentBaseColor)(x.designSystem)};
  ">
  <slot></slot>
  </template>
`;
            var styles = __webpack_require__(621),
                display = __webpack_require__(622);
            const DesignSystemProviderStyles = styles.a`
    ${Object(display.a)("block")};
`;
            __webpack_require__.d(__webpack_exports__, "a", function() {
                return design_system_provider_FASTDesignSystemProvider;
            });
            let design_system_provider_FASTDesignSystemProvider = class FASTDesignSystemProvider extends design_system_provider_DesignSystemProvider {};
            design_system_provider_FASTDesignSystemProvider = (function(
                decorators,
                target,
                key,
                desc
            ) {
                var d,
                    c = arguments.length,
                    r =
                        c < 3
                            ? target
                            : null === desc
                                ? (desc = Object.getOwnPropertyDescriptor(target, key))
                                : desc;
                if ("object" == typeof Reflect && "function" == typeof Reflect.decorate)
                    r = Reflect.decorate(decorators, target, key, desc);
                else
                    for (var i = decorators.length - 1; i >= 0; i--)
                        (d = decorators[i]) &&
                            (r =
                                (c < 3
                                    ? d(r)
                                    : c > 3
                                        ? d(target, key, r)
                                        : d(target, key)) || r);
                return c > 3 && r && Object.defineProperty(target, key, r), r;
            })(
                [
                    Object(fast_element.b)({
                        name: "fast-design-system-provider",
                        template: DesignSystemProviderTemplate,
                        styles: DesignSystemProviderStyles,
                    }),
                ],
                design_system_provider_FASTDesignSystemProvider
            );
        },
        133: function(module, __webpack_exports__, __webpack_require__) {
            "use strict";
            __webpack_require__.d(__webpack_exports__, "a", function() {
                return Controller;
            });
            var _fast_element__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(79),
                _observation_notifier__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(
                    138
                );
            const defaultEventOptions = { bubbles: !0, composed: !0 };
            class Controller extends _observation_notifier__WEBPACK_IMPORTED_MODULE_1__.a {
                constructor(element, definition) {
                    super(),
                        (this.element = element),
                        (this.definition = definition),
                        (this.view = null),
                        (this.isConnected = !1),
                        (this.resolvers = new Map());
                    const template = definition.template,
                        styles = definition.styles,
                        shadowRoot =
                            void 0 === definition.shadowOptions
                                ? void 0
                                : element.attachShadow(definition.shadowOptions);
                    if (void 0 !== template) {
                        const view = (this.view = template.create(this.element));
                        void 0 === shadowRoot
                            ? view.appendTo(element)
                            : view.appendTo(shadowRoot);
                    }
                    void 0 !== styles &&
                        void 0 !== shadowRoot &&
                        styles.applyTo(shadowRoot),
                        definition.dependencies.forEach(x => x.register(this));
                }
                onConnectedCallback() {
                    this.isConnected ||
                        (null !== this.view && this.view.bind(this.element),
                        (this.isConnected = !0));
                }
                onDisconnectedCallback() {
                    !1 !== this.isConnected &&
                        ((this.isConnected = !1),
                        null !== this.view && this.view.unbind());
                }
                onAttributeChangedCallback(name, oldValue, newValue) {
                    const attrDef = this.definition.attributeLookup[name];
                    void 0 !== attrDef &&
                        attrDef.onAttributeChangedCallback(this.element, newValue);
                }
                emit(type, detail, options) {
                    return (
                        !!this.isConnected &&
                        this.element.dispatchEvent(
                            new CustomEvent(
                                type,
                                Object.assign(
                                    Object.assign(
                                        { detail: detail },
                                        defaultEventOptions
                                    ),
                                    options
                                )
                            )
                        )
                    );
                }
                register(registry) {
                    registry.register(this);
                }
                get(key) {
                    const resolver = this.resolvers.get(key);
                    return void 0 === resolver ? null : resolver(this);
                }
                registerResolver(key, resolver) {
                    this.resolvers.set(key, resolver);
                }
                static forCustomElement(element) {
                    const controller = element.$controller;
                    if (void 0 !== controller) return controller;
                    const definition = _fast_element__WEBPACK_IMPORTED_MODULE_0__.a.getDefinition(
                        element.constructor
                    );
                    if (void 0 === definition)
                        throw new Error("Missing fast element definition.");
                    return (element.$controller = new Controller(element, definition));
                }
            }
        },
        137: function(module, __webpack_exports__, __webpack_require__) {
            "use strict";
            __webpack_require__.d(__webpack_exports__, "a", function() {
                return BaseProgress;
            });
            var _microsoft_fast_element__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(
                    79
                ),
                _microsoft_fast_element__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(
                    22
                ),
                __decorate = function(decorators, target, key, desc) {
                    var d,
                        c = arguments.length,
                        r =
                            c < 3
                                ? target
                                : null === desc
                                    ? (desc = Object.getOwnPropertyDescriptor(
                                          target,
                                          key
                                      ))
                                    : desc;
                    if (
                        "object" == typeof Reflect &&
                        "function" == typeof Reflect.decorate
                    )
                        r = Reflect.decorate(decorators, target, key, desc);
                    else
                        for (var i = decorators.length - 1; i >= 0; i--)
                            (d = decorators[i]) &&
                                (r =
                                    (c < 3
                                        ? d(r)
                                        : c > 3
                                            ? d(target, key, r)
                                            : d(target, key)) || r);
                    return c > 3 && r && Object.defineProperty(target, key, r), r;
                };
            class BaseProgress extends _microsoft_fast_element__WEBPACK_IMPORTED_MODULE_0__.a {
                pausedChanged() {
                    this.paused
                        ? this.classList.add("paused")
                        : this.classList.remove("paused");
                }
            }
            __decorate(
                [
                    Object(_microsoft_fast_element__WEBPACK_IMPORTED_MODULE_1__.b)({
                        converter: _microsoft_fast_element__WEBPACK_IMPORTED_MODULE_1__.c,
                    }),
                ],
                BaseProgress.prototype,
                "value",
                void 0
            ),
                __decorate(
                    [
                        Object(_microsoft_fast_element__WEBPACK_IMPORTED_MODULE_1__.b)({
                            converter:
                                _microsoft_fast_element__WEBPACK_IMPORTED_MODULE_1__.c,
                        }),
                    ],
                    BaseProgress.prototype,
                    "min",
                    void 0
                ),
                __decorate(
                    [
                        Object(_microsoft_fast_element__WEBPACK_IMPORTED_MODULE_1__.b)({
                            converter:
                                _microsoft_fast_element__WEBPACK_IMPORTED_MODULE_1__.c,
                        }),
                    ],
                    BaseProgress.prototype,
                    "max",
                    void 0
                ),
                __decorate(
                    [
                        Object(_microsoft_fast_element__WEBPACK_IMPORTED_MODULE_1__.b)({
                            mode: "boolean",
                        }),
                    ],
                    BaseProgress.prototype,
                    "paused",
                    void 0
                );
        },
        138: function(module, __webpack_exports__, __webpack_require__) {
            "use strict";
            class SubscriberCollection {
                constructor() {
                    (this.sub1 = void 0),
                        (this.sub2 = void 0),
                        (this.sub3 = void 0),
                        (this.spillover = void 0);
                }
                hasSubscribers() {
                    return (
                        void 0 !== this.sub1 ||
                        void 0 !== this.sub2 ||
                        void 0 !== this.sub3 ||
                        (void 0 !== this.spillover && this.spillover.length > 0)
                    );
                }
                hasSubscriber(subscriber) {
                    return (
                        this.sub1 === subscriber ||
                        (this.sub2 === subscriber ||
                            (this.sub3 === subscriber ||
                                (void 0 !== this.spillover &&
                                    -1 !== this.spillover.indexOf(subscriber))))
                    );
                }
                addSubscriber(subscriber) {
                    this.hasSubscriber(subscriber) ||
                        (void 0 !== this.sub1
                            ? void 0 !== this.sub2
                                ? void 0 !== this.sub3
                                    ? (void 0 === this.spillover && (this.spillover = []),
                                      this.spillover.push(subscriber))
                                    : (this.sub3 = subscriber)
                                : (this.sub2 = subscriber)
                            : (this.sub1 = subscriber));
                }
                removeSubscriber(subscriber) {
                    if (this.sub1 !== subscriber)
                        if (this.sub2 !== subscriber)
                            if (this.sub3 !== subscriber) {
                                if (void 0 !== this.spillover) {
                                    const index = this.spillover.indexOf(subscriber);
                                    -1 !== index && this.spillover.splice(index, 1);
                                }
                            } else this.sub3 = void 0;
                        else this.sub2 = void 0;
                    else this.sub1 = void 0;
                }
                notifySubscribers(source, args) {
                    const sub1 = this.sub1,
                        sub2 = this.sub2,
                        sub3 = this.sub3,
                        spillover = this.spillover;
                    if (
                        (void 0 !== sub1 && sub1.handleChange(source, args),
                        void 0 !== sub2 && sub2.handleChange(source, args),
                        void 0 !== sub3 && sub3.handleChange(source, args),
                        void 0 !== spillover)
                    )
                        for (let i = 0, ii = spillover.length; i < ii; ++i)
                            spillover[i].handleChange(source, args);
                }
            }
            __webpack_require__.d(__webpack_exports__, "a", function() {
                return notifier_PropertyChangeNotifier;
            });
            class notifier_PropertyChangeNotifier {
                constructor() {
                    this.subscribers = {};
                }
                notify(source, propertyName) {
                    const subscribers = this.subscribers[propertyName];
                    void 0 !== subscribers &&
                        subscribers.notifySubscribers(source, propertyName);
                }
                subscribe(subscriber, propertyName) {
                    (
                        this.subscribers[propertyName] ||
                        (this.subscribers[propertyName] = new SubscriberCollection())
                    ).addSubscriber(subscriber);
                }
                unsubscribe(subscriber, propertyName) {
                    const subscribers = this.subscribers[propertyName];
                    void 0 !== subscribers && subscribers.removeSubscriber(subscriber);
                }
            }
        },
        14: function(module, __webpack_exports__, __webpack_require__) {
            "use strict";
            __webpack_require__.d(__webpack_exports__, "a", function() {
                return DOM;
            });
            const markerClass = `fast-${Math.random()
                    .toString(36)
                    .substring(7)}`,
                updateQueue = [];
            void 0 === globalThis.trustedTypes &&
                (globalThis.trustedTypes = { createPolicy: (name, rules) => rules });
            const fastHTMLPolicy = globalThis.trustedTypes.createPolicy("fast-html", {
                createHTML: html => html,
            });
            let htmlPolicy = fastHTMLPolicy;
            const DOM = Object.freeze({
                setHTMLPolicy(policy) {
                    if (htmlPolicy !== fastHTMLPolicy)
                        throw new Error("The HTML policy can only be set once.");
                    htmlPolicy = policy;
                },
                createHTML: html => htmlPolicy.createHTML(html),
                isMarker: node =>
                    8 === node.nodeType && node.data.startsWith(markerClass),
                extractDirectiveIndexFromMarker: node =>
                    parseInt(node.data.replace(`${markerClass}:`, "")),
                createInterpolationPlaceholder: index => `@{${index}}`,
                createCustomAttributePlaceholder(attributeName, index) {
                    return `${attributeName}="${this.createInterpolationPlaceholder(
                        index
                    )}"`;
                },
                createBlockPlaceholder: index => `\x3c!--${markerClass}:${index}--\x3e`,
                queueUpdate(callable) {
                    updateQueue.length < 1 && window.requestAnimationFrame(processQueue),
                        updateQueue.push(callable);
                },
            });
            function processQueue() {
                let index = 0;
                for (; index < updateQueue.length; ) {
                    if ((updateQueue[index].call(), index++, index > 1024)) {
                        for (
                            let scan = 0, newLength = updateQueue.length - index;
                            scan < newLength;
                            scan++
                        )
                            updateQueue[scan] = updateQueue[scan + index];
                        (updateQueue.length -= index), (index = 0);
                    }
                }
                updateQueue.length = 0;
            }
        },
        180: function(module, __webpack_exports__, __webpack_require__) {
            "use strict";
            __webpack_require__.d(__webpack_exports__, "a", function() {
                return emptyArray;
            });
            const emptyArray = Object.freeze([]);
        },
        22: function(module, __webpack_exports__, __webpack_require__) {
            "use strict";
            __webpack_require__.d(__webpack_exports__, "c", function() {
                return nullableNumberConverter;
            }),
                __webpack_require__.d(__webpack_exports__, "a", function() {
                    return AttributeDefinition;
                }),
                __webpack_require__.d(__webpack_exports__, "b", function() {
                    return attr;
                });
            var _observation_observable__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(
                38
            );
            const booleanConverter = {
                    toView: value => (value ? "true" : "false"),
                    fromView: value =>
                        null != value && "false" !== value && !1 !== value && 0 !== value,
                },
                nullableNumberConverter = {
                    toView(value) {
                        if (null == value) return null;
                        let number = 1 * value;
                        return isNaN(number) ? null : number.toString();
                    },
                    fromView(value) {
                        if (null == value) return null;
                        let number = 1 * value;
                        return isNaN(number) ? null : number;
                    },
                };
            class AttributeDefinition {
                constructor(
                    Owner,
                    property,
                    attribute = property.toLowerCase(),
                    mode = "reflect",
                    converter
                ) {
                    (this.Owner = Owner),
                        (this.property = property),
                        (this.attribute = attribute),
                        (this.mode = mode),
                        (this.converter = converter),
                        (this.guards = new Set()),
                        (this.fieldName = `_${property}`),
                        (this.callbackName = `${property}Changed`),
                        (this.hasCallback = this.callbackName in Owner.prototype),
                        "boolean" === mode &&
                            void 0 === converter &&
                            (this.converter = booleanConverter);
                }
                setValue(object, newValue) {
                    const oldValue = object[this.fieldName],
                        converter = this.converter;
                    void 0 !== converter && (newValue = converter.fromView(newValue)),
                        oldValue !== newValue &&
                            ((object[this.fieldName] = newValue),
                            this.tryReflectToAttribute(object, newValue, converter),
                            this.hasCallback &&
                                object[this.callbackName](oldValue, newValue),
                            _observation_observable__WEBPACK_IMPORTED_MODULE_0__.a.notify(
                                object,
                                this.property
                            ));
                }
                getValue(object) {
                    return (
                        _observation_observable__WEBPACK_IMPORTED_MODULE_0__.a.track(
                            object,
                            this.property
                        ),
                        object[this.fieldName]
                    );
                }
                onAttributeChangedCallback(object, value) {
                    this.guards.has(object) ||
                        (this.guards.add(object),
                        this.setValue(object, value),
                        this.guards.delete(object));
                }
                tryReflectToAttribute(object, newValue, converter) {
                    const mode = this.mode;
                    if (!this.guards.has(object) && "fromView" !== mode) {
                        switch ((this.guards.add(object), mode)) {
                            case "reflect":
                                void 0 !== converter &&
                                    (newValue = converter.toView(newValue)),
                                    object.setAttribute(this.attribute, newValue);
                                break;
                            case "boolean":
                                newValue
                                    ? object.setAttribute(this.attribute, "")
                                    : object.removeAttribute(this.attribute);
                        }
                        this.guards.delete(object);
                    }
                }
                static collect(Owner, ...attributeLists) {
                    const attributes = [];
                    attributeLists.push(Owner.attributes);
                    for (let i = 0, ii = attributeLists.length; i < ii; ++i) {
                        const list = attributeLists[i];
                        if (void 0 !== list)
                            for (let j = 0, jj = list.length; j < jj; ++j) {
                                const config = list[j];
                                "string" == typeof config
                                    ? attributes.push(
                                          new AttributeDefinition(Owner, config)
                                      )
                                    : attributes.push(
                                          new AttributeDefinition(
                                              Owner,
                                              config.property,
                                              config.attribute,
                                              config.mode,
                                              config.converter
                                          )
                                      );
                            }
                    }
                    return attributes;
                }
            }
            function attr(configOrTarget, prop) {
                let config;
                function decorator($target, $prop) {
                    arguments.length > 1 && (config.property = $prop);
                    const attributes =
                        $target.constructor.attributes ||
                        ($target.constructor.attributes = []);
                    attributes.push(config);
                }
                return arguments.length > 1
                    ? ((config = {}), void decorator(configOrTarget, prop))
                    : ((config = void 0 === configOrTarget ? {} : configOrTarget),
                      decorator);
            }
        },
        285: function(module, __webpack_exports__, __webpack_require__) {
            "use strict";
            __webpack_require__.d(__webpack_exports__, "a", function() {
                return elevation;
            });
            const elevation =
                "box-shadow: 0 0 calc((var(--elevation) * 0.225px) + 2px) rgba(0, 0, 0, calc(.11 * (2 - var(--background-luminance, 1)))), 0 calc(var(--elevation) * 0.4px) calc((var(--elevation) * 0.9px)) rgba(0, 0, 0, calc(.13 * (2 - var(--background-luminance, 1))));";
        },
        288: function(module, exports) {
            module.exports =
                '<fast-design-system-provider>\n    <style>\n        .class-override {\n            height: 163px;\n            width: 300px;\n        }\n\n        .state-override:hover {\n            --elevation: 12;\n        }\n    </style>\n    <div>\n        <fast-card style="--card-height: 400px; --card-width: 500px">Card with text</fast-card>\n        <br>\n        <fast-card class="class-override" style="--elevation: 12">Custom depth with class-based height/width</fast-card>\n        <br>\n        <fast-card class="state-override">Custom depth on hover using CSS</fast-card>\n    </div>\n</fast-design-system-provider>';
        },
        289: function(module, exports) {
            module.exports =
                '<fast-design-system-provider style="font-family: var(--body-font)">\r\n    <h1>Checkbox</h1>\r\n    <h4>Default</h4>\r\n    <fast-checkbox></fast-checkbox>\r\n    <fast-checkbox>label</fast-checkbox>\r\n\r\n    <h4>Checked</h4>\r\n    <fast-checkbox checked></fast-checkbox>\r\n\r\n    \x3c!-- Required --\x3e\r\n    <h4>Required</h4>\r\n    <fast-checkbox required></fast-checkbox>\r\n\r\n    <h4>Indeterminate</h4>\r\n    <fast-checkbox class="flag-indeterminate">Unchecked</fast-checkbox>\r\n    <fast-checkbox checked class="flag-indeterminate">Checked</fast-checkbox>\r\n\r\n    \x3c!-- Disabled --\x3e\r\n    <h4>Disabled</h1>\r\n    <fast-checkbox disabled></fast-checkbox>\r\n    <fast-checkbox disabled>label</fast-checkbox>\r\n    <fast-checkbox disabled checked>checked</fast-checkbox>\r\n    <fast-checkbox disabled checked class="flag-indeterminate">Indeterminate checked</fast-checkbox>\r\n    <fast-checkbox disabled class="flag-indeterminate">Indeterminate unchecked</fast-checkbox>\r\n\r\n    <h4>Inline</h4>\r\n    <fast-checkbox checked>Apples</fast-checkbox>\r\n    <fast-checkbox checked>Bananas</fast-checkbox>\r\n    <fast-checkbox>Honeydew</fast-checkbox>\r\n    <fast-checkbox checked>Oranges</fast-checkbox>\r\n\r\n    <h4>Vertical</h4>\r\n    <fieldset style="display: flex; flex-direction: column; align-items: start;">\r\n        <legend>Fruit</legend>\r\n        <fast-checkbox checked>Apples</fast-checkbox>\r\n        <fast-checkbox checked>Bananas</fast-checkbox>\r\n        <fast-checkbox>Honeydew</fast-checkbox>\r\n        <fast-checkbox checked>Oranges</fast-checkbox>\r\n    </fieldset>\r\n\r\n\r\n    <h4>Visual vs audio label</h4>\r\n    <fast-checkbox>\r\n        <span aria-label="Audio label">Visible label</span>\r\n    </fast-checkbox>\r\n    \x3c!-- With label --\x3e\r\n</fast-design-system-provider>';
        },
        290: function(module, exports) {
            module.exports =
                '<fast-design-system-provider>\n    \x3c!-- <fast-dialog hidden>Hidden dialog with text</fast-dialog> --\x3e\n    \x3c!-- <fast-dialog id="foo" aria-labelledby="heading" modal="true">\n        <h2 id="heading">Dialog with aria-labelledby support</h2>\n        <button>Button (should autofocus)</button>\n    </fast-dialog> --\x3e\n    <fast-dialog id="foo" aria-label="Simple dialog" modal="true">\n        <h2>Dialog with text and button. The button should recieve focus</h2>\n        <button>Button A</button>\n        <button id="element" autofocus>Should autofocus</button>\n    </fast-dialog>\n</fast-design-system-provider>';
        },
        291: function(module, exports) {
            module.exports =
                '<fast-design-system-provider>\r\n    <fast-name-tag>Mark!</fast-name-tag>\r\n    <fast-name-tag style="--background-color: #00F">Blue Mark!</fast-name-tag>\r\n</fast-design-system-provider>';
        },
        292: function(module, exports) {
            module.exports =
                '<fast-design-system-provider style="font-family: var(--body-font)">\n    <h1>Progress ring</h1>\n    <h4>Default</h4>\n    <fast-progress-ring min="0" max="100" value="75"></fast-progress-ring>\n    <fast-progress-ring></fast-progress-ring>\n    <h4>Paused</h4>\n    <fast-progress-ring paused="true" min="0" max="100" value="75"></fast-progress-ring>\n    <fast-progress-ring paused="true"></fast-progress-ring>\n    <h4>Custom Sizes</h4>\n    <div style="display: grid; grid-gap: 12px; grid-auto-flow: column;">\n        <fast-progress-ring min="0" max="100" value="20"></fast-progress-ring>\n        <fast-progress-ring \n            min="0"\n            max="100" \n            value="40"\n            style="width: 42px; height: 42px;"\n        ></fast-progress-ring>\n        <fast-progress-ring \n            min="0"\n            max="100" \n            value="60"\n            style="width: 62px; height: 62px;"\n        ></fast-progress-ring>\n        <fast-progress-ring \n            min="0"\n            max="100" \n            value="80"\n            style="width: 82px; height: 82px;"\n        ></fast-progress-ring>\n        <fast-progress-ring \n            min="0"\n            max="100" \n            value="100"\n            style="width: 102px; height: 102px;"\n        ></fast-progress-ring>\n    </div>\n    <div style="display: grid; grid-gap: 12px; grid-auto-flow: column;">\n        <fast-progress-ring></fast-progress-ring>\n        <fast-progress-ring style="width: 42px; height: 42px;"></fast-progress-ring>\n        <fast-progress-ring style="width: 62px; height: 62px;"></fast-progress-ring>\n        <fast-progress-ring style="width: 82px; height: 82px;"></fast-progress-ring>\n        <fast-progress-ring style="width: 102px; height: 102px;"></fast-progress-ring>\n    </div>\n\n</fast-design-system-provider>';
        },
        293: function(module, exports) {
            module.exports =
                '<fast-design-system-provider style="font-family: var(--body-font)">\n    <h1>Progress</h1>\n    <h4>Default</h4>\n    <div style="width: 300px;">\n        <fast-progress min="0" max="100" value="75"></fast-progress>\n        <fast-progress></fast-progress>\n    </div>\n    <h4>Paused</h4>\n    <div style="width: 300px;">\n        <fast-progress paused="true" min="0" max="100" value="75"></fast-progress>\n        <fast-progress paused="true"></fast-progress>\n    </div>\n    <h4>Custom Sizes</h4>\n    <div style="width: 300px;">\n        <fast-progress \n            min="0"\n            max="100"\n            value="20"\n        ></fast-progress>\n        <fast-progress \n            min="0"\n            max="100"\n            value="40"\n            style="height: 8px;"\n        ></fast-progress>\n        <fast-progress \n            min="0"\n            max="100"\n            value="60"\n            style="height: 12px;"\n        ></fast-progress>\n        <fast-progress \n            min="0"\n            max="100"\n            value="80"\n            style="height: 16px;"\n        ></fast-progress>\n        <fast-progress \n            min="0"\n            max="100"\n            value="100"\n            style="height: 20px;"\n        ></fast-progress>\n        <fast-progress></fast-progress>\n        <fast-progress\n            style="height: 8px;"\n        >\n        </fast-progress>\n        <fast-progress\n            style="height: 12px;"\n        >\n        </fast-progress>\n        <fast-progress\n            style="height: 16px;"\n        >\n        </fast-progress>\n        <fast-progress\n            style="height: 20px;"\n        >\n        </fast-progress>\n    </div>\n\n</fast-design-system-provider>';
        },
        294: function(module, exports) {
            module.exports =
                '<fast-design-system-provider>\n    <h1>Switch</h1>\n    <h4>Default</h4>\n    <div style="display: flex; flex-direction: column">\n        <fast-switch></fast-switch>\n        <fast-switch>\n            Dark Mode\n        </fast-switch>\n        <fast-switch checked>\n            New Feature\n            <span slot="checked-message">On</span>\n            <span slot="unchecked-message">Off</span>\n        </fast-switch>\n        <fast-switch>\n            Theme\n            <span slot="checked-message">Dark</span>\n            <span slot="unchecked-message">Light</span>\n        </fast-switch>\n    </div>\n\n    <h4>Checked</h4>\n    <fast-switch checked></fast-switch>\n\n    \x3c!-- Required --\x3e\n    <h4>Required</h4>\n    <fast-switch required></fast-switch>\n\n    \x3c!-- Disabled --\x3e\n    <h4>Disabled</h1>\n    <div style="display: flex; flex-direction: column">\n        <fast-switch disabled></fast-switch>\n        <fast-switch disabled>label</fast-switch>\n        <fast-switch disabled checked>checked</fast-switch>\n        <fast-switch disabled checked>\n            checked\n            <span slot="checked-message">On</span>\n            <span slot="unchecked-message">Off</span>\n        </fast-switch>\n    </div>\n\n    <h4>Inline</h4>\n    <fast-switch style="margin-right: 12px">Light Speed</fast-switch>\n    <fast-switch style="margin-right: 12px">Ridiculous Speed</fast-switch >\n    <fast-switch style="margin-right: 12px">Ludicrous Speed</fast-switch>\n    <fast-switch checked>Plaid Speed</fast-switch>\n\n</fast-design-system-provider>';
        },
        295: function(module, exports) {
            module.exports =
                '<fast-design-system-provider style="font-family: var(--body-font)">\n    <h1>Text area</h1>\n    <h4>Default</h4>\n    <fast-text-area></fast-text-area>\n    <fast-text-area>\n        <span slot="label">label</span>\n    </fast-text-area>\n\n    <h4>Placeholder</h4>\n    <fast-text-area placeholder="Placeholder"></fast-text-area>\n\n    \x3c!-- Required --\x3e\n    <h4>Required</h4>\n    <fast-text-area required></fast-text-area>\n\n    \x3c!-- Disabled --\x3e\n    <h4>Disabled</h4>\n    <fast-text-area disabled></fast-text-area>\n    <fast-text-area disabled>\n        <span slot="label">label</span>\n    </fast-text-area>\n    <fast-text-area disabled placeholder="placeholder"></fast-text-area>\n\n    \x3c!-- Read only --\x3e\n    <h4>Read only</h4>\n    <fast-text-area readonly value="Readonly text area"></fast-text-area>\n    <fast-text-area readonly value="Readonly text area">label</fast-text-area>\n\n    \x3c!-- Read only --\x3e\n    <h4>Autofocus</h4>\n    <fast-text-area autofocus>autofocus</fast-text-area>\n\n    \x3c!-- Resize --\x3e\n    <h4>Resize</h4>\n    <h5>Both</h5>\n    <fast-text-area resize="both">resize both</fast-text-area>\n\n    <h5>Horizontal</h5>\n    <fast-text-area resize="horizontal">resize horizontal</fast-text-area>\n\n    <h5>Vertical</h5>\n    <fast-text-area resize="vertical">resize vertical</fast-text-area>\n\n    <h4>Filled</h4>\n    <h5>Default</h5>\n    <fast-text-area appearance="filled"></fast-text-area>\n    <fast-text-area appearance="filled">\n        <span slot="label">label</span>\n    </fast-text-area>\n\n    <h5>Placeholder</h5>\n    <fast-text-area appearance="filled" placeholder="Placeholder"></fast-text-area>\n\n    \x3c!-- Required --\x3e\n    <h5>Required</h5>\n    <fast-text-area appearance="filled" required></fast-text-area>\n\n    \x3c!-- Disabled --\x3e\n    <h5>Disabled</h5>\n    <fast-text-area appearance="filled" disabled></fast-text-area>\n    <fast-text-area appearance="filled" disabled>\n        <span slot="label">label</span>\n    </fast-text-area>\n    <fast-text-area appearance="filled" disabled placeholder="placeholder"></fast-text-area>\n\n    \x3c!-- Read only --\x3e\n    <h5>Read only</h5>\n    <fast-text-area appearance="filled" value="Readonly text area" readonly>label</fast-text-area>\n    <fast-text-area appearance="filled" value="Readonly text area" readonly>label</fast-text-area>\n\n    \x3c!-- With label --\x3e\n    <h4>Visual vs audio label</h4>\n    <fast-text-area>\n        <span slot="label" aria-label="Audio label">Visible label</span>\n    </fast-text-area>\n\n    \x3c!-- With hidden label --\x3e\n    <h4>Audio label only</h4>\n    <fast-text-area>\n        <span slot="label" aria-label="Audio label only"></span>\n    </fast-text-area>\n\n</fast-design-system-provider>';
        },
        296: function(module, exports) {
            module.exports =
                '<fast-design-system-provider style="font-family: var(--body-font)">\n    <h1>Text field</h1>\n    <h4>Default</h4>\n    <fast-text-field></fast-text-field>\n    <fast-text-field>Label</fast-text-field>\n\n    <h4>Placeholder</h4>\n    <fast-text-field placeholder="Placeholder"></fast-text-field>\n\n    \x3c!-- Required --\x3e\n    <h4>Required</h4>\n    <fast-text-field required></fast-text-field>\n\n    \x3c!-- Disabled --\x3e\n    <h4>Disabled</h1>\n    <fast-text-field disabled></fast-text-field>\n    <fast-text-field disabled>label</fast-text-field>\n    <fast-text-field disabled placeholder="placeholder"></fast-text-field>\n\n    \x3c!-- Read only --\x3e\n    <h4>Read only</h1>\n    <fast-text-field readonly value="Readonly"></fast-text-field>\n    <fast-text-field readonly value="Readonly">label</fast-text-field>\n\n    \x3c!-- Read only --\x3e\n    <h4>Autofocus</h1>\n    <fast-text-field autofocus>autofocus</fast-text-field>\n\n    \x3c!-- Before Content --\x3e\n    <h4>Before Content</h4>\n    <fast-text-field>\n        <svg\n            slot="before-content"\n            width="16"\n            height="16"\n            viewBox="0 0 16 16"\n            xmlns="http://www.w3.org/2000/svg"\n        >\n            <path d="M6.5,7.7h-1v-1h1V7.7z M10.6,7.7h-1v-1h1V7.7z M14.7,6.7v2.1h-1v2.6c0,0.2,0,0.4-0.1,0.6c-0.1,0.2-0.2,0.4-0.3,0.5c-0.1,0.1-0.3,0.3-0.5,0.3c-0.2,0.1-0.4,0.1-0.6,0.1H10l-3.5,3v-3H3.9c-0.2,0-0.4,0-0.6-0.1c-0.2-0.1-0.4-0.2-0.5-0.3c-0.1-0.1-0.3-0.3-0.3-0.5c-0.1-0.2-0.1-0.4-0.1-0.6V8.8h-1V6.7h1V5.2c0-0.2,0-0.4,0.1-0.6c0.1-0.2,0.2-0.4,0.3-0.5c0.1-0.1,0.3-0.3,0.5-0.3c0.2-0.1,0.4-0.1,0.6-0.1h3.6V1.9C7.3,1.8,7.2,1.7,7.1,1.5C7,1.4,7,1.2,7,1C7,0.9,7,0.8,7,0.6c0.1-0.1,0.1-0.2,0.2-0.3c0.1-0.1,0.2-0.2,0.3-0.2C7.7,0,7.9,0,8,0c0.1,0,0.3,0,0.4,0.1c0.1,0.1,0.2,0.1,0.3,0.2C8.8,0.4,8.9,0.5,9,0.6C9,0.8,9,0.9,9,1c0,0.2,0,0.4-0.1,0.5C8.8,1.7,8.7,1.8,8.5,1.9v1.7h3.6c0.2,0,0.4,0,0.6,0.1c0.2,0.1,0.4,0.2,0.5,0.3c0.1,0.1,0.3,0.3,0.3,0.5c0.1,0.2,0.1,0.4,0.1,0.6v1.5H14.7z M12.6,5.2c0-0.1-0.1-0.3-0.2-0.4c-0.1-0.1-0.2-0.2-0.4-0.2H3.9c-0.1,0-0.3,0.1-0.4,0.2C3.4,4.9,3.4,5,3.4,5.2v6.2c0,0.1,0.1,0.3,0.2,0.4c0.1,0.1,0.2,0.2,0.4,0.2h3.6v1.8l2.1-1.8h2.5c0.1,0,0.3-0.1,0.4-0.2c0.1-0.1,0.2-0.2,0.2-0.4V5.2z M5.8,8.9c0.3,0.3,0.6,0.5,1,0.7C7.2,9.7,7.6,9.8,8,9.8s0.8-0.1,1.2-0.2c0.4-0.2,0.7-0.4,1-0.7l0.7,0.7c-0.4,0.4-0.8,0.7-1.4,0.9c-0.5,0.2-1,0.3-1.6,0.3s-1.1-0.1-1.6-0.3c-0.5-0.2-1-0.5-1.3-0.9L5.8,8.9z" />\n        </svg>\n    </fast-text-field>\n\n    \x3c!-- After Content --\x3e\n    <h4>After Content</h4>\n    <fast-text-field>\n        <svg\n            slot="after-content"\n            width="16"\n            height="16"\n            viewBox="0 0 16 16"\n            xmlns="http://www.w3.org/2000/svg"\n        >\n            <path d="M6.5,7.7h-1v-1h1V7.7z M10.6,7.7h-1v-1h1V7.7z M14.7,6.7v2.1h-1v2.6c0,0.2,0,0.4-0.1,0.6c-0.1,0.2-0.2,0.4-0.3,0.5c-0.1,0.1-0.3,0.3-0.5,0.3c-0.2,0.1-0.4,0.1-0.6,0.1H10l-3.5,3v-3H3.9c-0.2,0-0.4,0-0.6-0.1c-0.2-0.1-0.4-0.2-0.5-0.3c-0.1-0.1-0.3-0.3-0.3-0.5c-0.1-0.2-0.1-0.4-0.1-0.6V8.8h-1V6.7h1V5.2c0-0.2,0-0.4,0.1-0.6c0.1-0.2,0.2-0.4,0.3-0.5c0.1-0.1,0.3-0.3,0.5-0.3c0.2-0.1,0.4-0.1,0.6-0.1h3.6V1.9C7.3,1.8,7.2,1.7,7.1,1.5C7,1.4,7,1.2,7,1C7,0.9,7,0.8,7,0.6c0.1-0.1,0.1-0.2,0.2-0.3c0.1-0.1,0.2-0.2,0.3-0.2C7.7,0,7.9,0,8,0c0.1,0,0.3,0,0.4,0.1c0.1,0.1,0.2,0.1,0.3,0.2C8.8,0.4,8.9,0.5,9,0.6C9,0.8,9,0.9,9,1c0,0.2,0,0.4-0.1,0.5C8.8,1.7,8.7,1.8,8.5,1.9v1.7h3.6c0.2,0,0.4,0,0.6,0.1c0.2,0.1,0.4,0.2,0.5,0.3c0.1,0.1,0.3,0.3,0.3,0.5c0.1,0.2,0.1,0.4,0.1,0.6v1.5H14.7z M12.6,5.2c0-0.1-0.1-0.3-0.2-0.4c-0.1-0.1-0.2-0.2-0.4-0.2H3.9c-0.1,0-0.3,0.1-0.4,0.2C3.4,4.9,3.4,5,3.4,5.2v6.2c0,0.1,0.1,0.3,0.2,0.4c0.1,0.1,0.2,0.2,0.4,0.2h3.6v1.8l2.1-1.8h2.5c0.1,0,0.3-0.1,0.4-0.2c0.1-0.1,0.2-0.2,0.2-0.4V5.2z M5.8,8.9c0.3,0.3,0.6,0.5,1,0.7C7.2,9.7,7.6,9.8,8,9.8s0.8-0.1,1.2-0.2c0.4-0.2,0.7-0.4,1-0.7l0.7,0.7c-0.4,0.4-0.8,0.7-1.4,0.9c-0.5,0.2-1,0.3-1.6,0.3s-1.1-0.1-1.6-0.3c-0.5-0.2-1-0.5-1.3-0.9L5.8,8.9z" />\n        </svg>\n    </fast-text-field>\n\n    <h4>Filled</h4>\n    <h5>Default</h5>\n    <fast-text-field appearance="filled"></fast-text-field>\n    <fast-text-field appearance="filled">label</fast-text-field>\n\n    <h5>Placeholder</h5>\n    <fast-text-field appearance="filled" placeholder="Placeholder"></fast-text-field>\n\n    \x3c!-- Required --\x3e\n    <h5>Required</h5>\n    <fast-text-field appearance="filled" required></fast-text-field>\n\n    \x3c!-- Disabled --\x3e\n    <h5>Disabled</h5>\n    <fast-text-field appearance="filled" disabled></fast-text-field>\n    <fast-text-field appearance="filled" disabled>label</fast-text-field>\n    <fast-text-field appearance="filled" disabled placeholder="placeholder"></fast-text-field>\n\n    \x3c!-- Read only --\x3e\n    <h5>Read only</h5>\n    <fast-text-field appearance="filled" readonly value="Readonly"></fast-text-field>\n    <fast-text-field appearance="filled" readonly value="Readonly">label</fast-text-field>\n\n    \x3c!-- With label --\x3e\n    <h4>Visual vs audio label</h4>\n    <fast-text-field>\n        <span aria-label="Audio label">Visible label</span>\n    </fast-text-field>\n\n    \x3c!-- With hidden label --\x3e\n    <h4>Audio label only</h4>\n    <fast-text-field>\n        <span aria-label="Audio label only"></span>\n    </fast-text-field>\n\n</fast-design-system-provider>';
        },
        300: function(module, exports, __webpack_require__) {
            __webpack_require__(301),
                __webpack_require__(414),
                (module.exports = __webpack_require__(415));
        },
        323: function(module, exports) {},
        37: function(module, __webpack_exports__, __webpack_require__) {
            "use strict";
            var can_use_dom = __webpack_require__(626),
                isBoolean = __webpack_require__(625);
            let _canUseFocusVisible;
            __webpack_require__.d(__webpack_exports__, "a", function() {
                return focusVisible;
            });
            const focusVisible = (function canUseFocusVisible() {
                if (Object(isBoolean.a)(_canUseFocusVisible)) return _canUseFocusVisible;
                if (!Object(can_use_dom.a)())
                    return (_canUseFocusVisible = !1), _canUseFocusVisible;
                const styleElement = document.createElement("style");
                document.head.appendChild(styleElement);
                try {
                    styleElement.sheet.insertRule("foo:focus-visible {color:inherit}", 0),
                        (_canUseFocusVisible = !0);
                } catch (e) {
                    _canUseFocusVisible = !1;
                } finally {
                    document.head.removeChild(styleElement);
                }
                return _canUseFocusVisible;
            })()
                ? "focus-visible"
                : "focus";
        },
        38: function(module, __webpack_exports__, __webpack_require__) {
            "use strict";
            __webpack_require__.d(__webpack_exports__, "a", function() {
                return Observable;
            }),
                __webpack_require__.d(__webpack_exports__, "c", function() {
                    return observable;
                }),
                __webpack_require__.d(__webpack_exports__, "b", function() {
                    return inspectAndEvaluate;
                });
            var _controller__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(133),
                _fast_element__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(79),
                _notifier__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(138);
            const notifierLookup = new WeakMap();
            let currentInspector = void 0;
            const Observable = {
                setInspector(inspector) {
                    currentInspector = inspector;
                },
                clearInspector() {
                    currentInspector = void 0;
                },
                createArrayObserver(array) {
                    throw new Error(
                        "Must call enableArrayObservation before observing arrays."
                    );
                },
                getNotifier(source) {
                    let found = source.$controller || notifierLookup.get(source);
                    return (
                        void 0 === found &&
                            (source instanceof
                            _fast_element__WEBPACK_IMPORTED_MODULE_1__.a
                                ? (found = _controller__WEBPACK_IMPORTED_MODULE_0__.a.forCustomElement(
                                      source
                                  ))
                                : Array.isArray(source)
                                    ? (found = Observable.createArrayObserver(source))
                                    : notifierLookup.set(
                                          source,
                                          (found = new _notifier__WEBPACK_IMPORTED_MODULE_2__.a())
                                      )),
                        found
                    );
                },
                track(source, propertyName) {
                    void 0 !== currentInspector &&
                        currentInspector.inspect(source, propertyName);
                },
                notify(source, args) {
                    Observable.getNotifier(source).notify(source, args);
                },
                define(target, propertyName) {
                    const fieldName = `_${propertyName}`,
                        callbackName = `${propertyName}Changed`,
                        hasCallback = callbackName in target;
                    Reflect.defineProperty(target, propertyName, {
                        enumerable: !0,
                        get: function() {
                            return Observable.track(this, propertyName), this[fieldName];
                        },
                        set: function(newValue) {
                            const oldValue = this[fieldName];
                            oldValue !== newValue &&
                                ((this[fieldName] = newValue),
                                hasCallback && this[callbackName](oldValue, newValue),
                                Observable.notify(this, propertyName));
                        },
                    });
                },
            };
            function observable($target, $prop) {
                Observable.define($target, $prop);
            }
            function inspectAndEvaluate(expression, scope, context, inspector) {
                Observable.setInspector(inspector);
                const value = expression(scope, context);
                return Observable.clearInspector(), value;
            }
        },
        415: function(module, __webpack_exports__, __webpack_require__) {
            "use strict";
            __webpack_require__.r(__webpack_exports__),
                function(module) {
                    var _storybook_html__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(
                        284
                    );
                    (module._StorybookPreserveDecorators = !0),
                        Object(_storybook_html__WEBPACK_IMPORTED_MODULE_0__.configure)(
                            [__webpack_require__(600)],
                            module
                        );
                }.call(this, __webpack_require__(111)(module));
        },
        49: function(module, __webpack_exports__, __webpack_require__) {
            "use strict";
            __webpack_require__.d(__webpack_exports__, "b", function() {
                return Directive;
            }),
                __webpack_require__.d(__webpack_exports__, "a", function() {
                    return AttachedBehaviorDirective;
                });
            var _dom__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(14);
            class Directive {
                constructor() {
                    this.targetIndex = 0;
                }
            }
            class AttachedBehaviorDirective extends Directive {
                constructor(name, behavior, options) {
                    super(),
                        (this.name = name),
                        (this.behavior = behavior),
                        (this.options = options);
                }
                createPlaceholder(index) {
                    return _dom__WEBPACK_IMPORTED_MODULE_0__.a.createCustomAttributePlaceholder(
                        this.name,
                        index
                    );
                }
                createBehavior(target) {
                    return new this.behavior(target, this.options);
                }
            }
        },
        600: function(module, exports, __webpack_require__) {
            var map = {
                "./card/card.stories.ts": 608,
                "./checkbox/checkbox.stories.ts": 609,
                "./dialog/dialog.stories.ts": 610,
                "./name-tag/name-tag.stories.ts": 611,
                "./progress/progress-ring/progress-ring.stories.ts": 615,
                "./progress/progress/progress.stories.ts": 616,
                "./switch/switch.stories.ts": 612,
                "./text-area/text-area.stories.ts": 613,
                "./text-field/text-field.stories.ts": 614,
            };
            function webpackContext(req) {
                var id = webpackContextResolve(req);
                return __webpack_require__(id);
            }
            function webpackContextResolve(req) {
                if (!__webpack_require__.o(map, req)) {
                    var e = new Error("Cannot find module '" + req + "'");
                    throw ((e.code = "MODULE_NOT_FOUND"), e);
                }
                return map[req];
            }
            (webpackContext.keys = function webpackContextKeys() {
                return Object.keys(map);
            }),
                (webpackContext.resolve = webpackContextResolve),
                (module.exports = webpackContext),
                (webpackContext.id = 600);
        },
        608: function(module, __webpack_exports__, __webpack_require__) {
            "use strict";
            __webpack_require__.r(__webpack_exports__);
            var fast_element = __webpack_require__(79);
            class card_Card extends fast_element.a {}
            const CardTemplate = __webpack_require__(631).a`
  <slot></slot>
`;
            var styles = __webpack_require__(621),
                display = __webpack_require__(622),
                elevation = __webpack_require__(285),
                system_colors = __webpack_require__(1);
            const CardStyles = styles.a`
    ${Object(display.a)("block")} :host {
        --elevation: 4;
        display: block;
        contain: content;
        height: var(--card-height, 100%);
        width: var(--card-width, 100%);
        box-sizing: border-box;
        background: var(--neutral-layer-card);
        border-radius: calc(var(--elevated-corner-radius) * 1px);
        ${elevation.a};
    }

    @media (forced-colors: active) {
        :host {
            forced-color-adjust: none;
            border: calc(var(--outline-width) * 1px) solid ${system_colors.a.CanvasText};
            background: ${system_colors.a.Canvas};
        }
    }
`;
            let card_FASTCard = class FASTCard extends card_Card {};
            card_FASTCard = (function(decorators, target, key, desc) {
                var d,
                    c = arguments.length,
                    r =
                        c < 3
                            ? target
                            : null === desc
                                ? (desc = Object.getOwnPropertyDescriptor(target, key))
                                : desc;
                if ("object" == typeof Reflect && "function" == typeof Reflect.decorate)
                    r = Reflect.decorate(decorators, target, key, desc);
                else
                    for (var i = decorators.length - 1; i >= 0; i--)
                        (d = decorators[i]) &&
                            (r =
                                (c < 3
                                    ? d(r)
                                    : c > 3
                                        ? d(target, key, r)
                                        : d(target, key)) || r);
                return c > 3 && r && Object.defineProperty(target, key, r), r;
            })(
                [
                    Object(fast_element.b)({
                        name: "fast-card",
                        template: CardTemplate,
                        styles: CardStyles,
                    }),
                ],
                card_FASTCard
            );
            var design_system_provider = __webpack_require__(10),
                card = __webpack_require__(288),
                card_default = __webpack_require__.n(card);
            __webpack_require__.d(__webpack_exports__, "Card", function() {
                return card_stories_Card;
            }),
                design_system_provider.a;
            __webpack_exports__.default = { title: "Card" };
            const card_stories_Card = () => card_default.a;
        },
        609: function(module, __webpack_exports__, __webpack_require__) {
            "use strict";
            __webpack_require__.r(__webpack_exports__);
            var fast_element = __webpack_require__(79),
                attributes = __webpack_require__(22),
                observable = __webpack_require__(38),
                key_codes = __webpack_require__(618),
                form_associated = __webpack_require__(77),
                __decorate = function(decorators, target, key, desc) {
                    var d,
                        c = arguments.length,
                        r =
                            c < 3
                                ? target
                                : null === desc
                                    ? (desc = Object.getOwnPropertyDescriptor(
                                          target,
                                          key
                                      ))
                                    : desc;
                    if (
                        "object" == typeof Reflect &&
                        "function" == typeof Reflect.decorate
                    )
                        r = Reflect.decorate(decorators, target, key, desc);
                    else
                        for (var i = decorators.length - 1; i >= 0; i--)
                            (d = decorators[i]) &&
                                (r =
                                    (c < 3
                                        ? d(r)
                                        : c > 3
                                            ? d(target, key, r)
                                            : d(target, key)) || r);
                    return c > 3 && r && Object.defineProperty(target, key, r), r;
                };
            class checkbox_Checkbox extends form_associated.a {
                constructor() {
                    super(),
                        (this.value = "on"),
                        (this.defaultChecked = !!this.checkedAttribute),
                        (this.checked = this.defaultChecked),
                        (this.proxy = document.createElement("input")),
                        (this.indeterminate = !1),
                        (this.dirtyChecked = !1),
                        (this.constructed = !1),
                        (this.keypressHandler = e => {
                            switch ((super.keypressHandler(e), e.keyCode)) {
                                case key_codes.c:
                                    this.checked = !this.checked;
                            }
                        }),
                        (this.clickHandler = e => {
                            this.disabled ||
                                this.readOnly ||
                                (this.checked = !this.checked);
                        }),
                        this.proxy.setAttribute("type", "checkbox"),
                        (this.constructed = !0);
                }
                readOnlyChanged() {
                    this.proxy instanceof HTMLElement &&
                        (this.proxy.readOnly = this.readOnly),
                        this.readOnly
                            ? this.classList.add("readonly")
                            : this.classList.remove("readonly");
                }
                valueChanged() {
                    this.proxy instanceof HTMLElement && (this.proxy.value = this.value);
                }
                checkedAttributeChanged() {
                    this.defaultChecked = this.checkedAttribute;
                }
                defaultCheckedChanged() {
                    this.dirtyChecked ||
                        ((this.checked = this.defaultChecked), (this.dirtyChecked = !1));
                }
                checkedChanged() {
                    this.dirtyChecked || (this.dirtyChecked = !0),
                        this.updateForm(),
                        this.proxy instanceof HTMLElement &&
                            (this.proxy.checked = this.checked),
                        this.constructed &&
                            this.dispatchEvent(
                                new CustomEvent("change", { bubbles: !0, composed: !0 })
                            ),
                        this.checked
                            ? this.classList.add("checked")
                            : this.classList.remove("checked");
                }
                indeterminateChanged() {
                    this.indeterminate
                        ? this.classList.add("indeterminate")
                        : this.classList.remove("indeterminate");
                }
                connectedCallback() {
                    super.connectedCallback(), this.updateForm();
                }
                updateForm() {
                    const value = this.checked ? this.value : null;
                    this.setFormValue(value, value);
                }
            }
            __decorate(
                [Object(attributes.b)({ attribute: "readonly", mode: "boolean" })],
                checkbox_Checkbox.prototype,
                "readOnly",
                void 0
            ),
                __decorate([attributes.b], checkbox_Checkbox.prototype, "value", void 0),
                __decorate(
                    [Object(attributes.b)({ attribute: "checked", mode: "boolean" })],
                    checkbox_Checkbox.prototype,
                    "checkedAttribute",
                    void 0
                ),
                __decorate(
                    [observable.c],
                    checkbox_Checkbox.prototype,
                    "defaultChecked",
                    void 0
                ),
                __decorate(
                    [observable.c],
                    checkbox_Checkbox.prototype,
                    "checked",
                    void 0
                ),
                __decorate(
                    [observable.c],
                    checkbox_Checkbox.prototype,
                    "indeterminate",
                    void 0
                );
            var template = __webpack_require__(631),
                when = __webpack_require__(624);
            const CheckboxTemplate = template.a`
    <template
        role="checkbox"
        aria-checked="${x => x.checked}"
        aria-required="${x => x.required}"
        aria-disabled="${x => x.disabled}"
        aria-readonly="${x => x.readOnly}"
        tabindex="${x => (x.disabled ? null : 0)}"
        @keypress="${(x, c) => x.keypressHandler(c.event)}"
        @click="${(x, c) => x.clickHandler(c.event)}"
    >
    <div
        part="checkbox"
        class="checkbox"
    >
            <slot
                name="checked-indicator"
            >
                <svg
                    aria-hidden="true"
                    part="checked-indicator"
                    class="checked-indicator"
                    viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"
                >
                    <path
                        fill-rule="evenodd"
                        clip-rule="evenodd"
                        d="M8.143 12.6697L15.235 4.5L16.8 5.90363L8.23812 15.7667L3.80005 11.2556L5.27591 9.7555L8.143 12.6697Z"
                        />
                </svg>
            </slot>
            <slot
                name="indeterminate-indicator"
             >
                <div
                    part="indeterminate-indicator"
                    class="indeterminate-indicator"
                ></div>
             </slot>

    </div>
    ${Object(when.a)(
        x => x.childNodes.length,
        template.a`
        <label
            part="label"
            class="label"
        ><slot></slot></label>
    `
    )}
    </template>
`;
            var styles = __webpack_require__(621),
                display = __webpack_require__(622),
                disabled = __webpack_require__(627),
                styles_focus = __webpack_require__(37),
                system_colors = __webpack_require__(1);
            const CheckboxStyles = styles.a`
    ${Object(display.a)("inline-flex")} :host {
        align-items: center;
        outline: none;
        margin: calc(var(--design-unit) * 1px) 0;
        ${""} user-select: none;
    }

    .checkbox {
        position: relative;
        width: calc((var(--height-number) / 2 + var(--design-unit)) * 1px);
        height: calc((var(--height-number) / 2 + var(--design-unit)) * 1px);
        box-sizing: border-box;
        border-radius: calc(var(--corner-radius) * 1px);
        border: calc(var(--outline-width) * 1px) solid var(--neutral-outline-rest);
        background: var(--neutral-fill-input-rest);
        outline: none;
        cursor: pointer;
    }

    .label {
        font-family: var(--body-font);
        color: var(--neutral-foreground-rest);
        ${""} padding-inline-start: calc(var(--design-unit) * 2px + 2px);
        margin-inline-end: calc(var(--design-unit) * 2px + 2px);
        cursor: pointer;
        ${""} font-size: calc(1rem + (var(--density) * 2px));
    }

    .checked-indicator {
        width: 100%;
        height: 100%;
        display: block;
        fill: var(--neutral-foreground-rest);
        opacity: 0;
        pointer-events: none;
    }

    .indeterminate-indicator {
        border-radius: calc(var(--corner-radius) * 1px);
        background: var(--neutral-foreground-rest);
        position: absolute;
        top: 25%;
        right: 25%;
        bottom: 25%;
        left: 25%;
        opacity: 0;
    }

    .checkbox:hover {
        background: var(--neutral-fill-input-hover);
        border-color: var(--neutral-outline-hover);
    }

    :host(:${styles_focus.a}) .checkbox {
        box-shadow: 0 0 0 1px var(--neutral-focus) inset;
        border-color: var(--neutral-focus);
    }

    :host(.disabled) .label,
    :host(.readonly) .label,
    :host(.readonly) .checkbox,
    :host(.disabled) .checkbox {
        cursor: ${disabled.a};
    }

    :host(.checked:not(.indeterminate)) .checked-indicator,
    :host(.indeterminate) .indeterminate-indicator {
        opacity: 1;
    }

    :host(.disabled) {
        opacity: var(--disabled-opacity);
    }

    @media (forced-colors: active) {
        .checkbox, .checkbox:hover, .checkbox:active {
            forced-color-adjust: none;
            border-color: ${system_colors.a.FieldText};
            background: ${system_colors.a.Field};
        }
        
        .checked-indicator {
            fill: ${system_colors.a.FieldText};
        }

        .indeterminate-indicator  {
            background: ${system_colors.a.FieldText};
        }
        
        :host(:${styles_focus.a}) .checkbox {
            border-color: ${system_colors.a.Highlight};
        }

        :host(.disabled) {
            opacity: 1;
        }

        :host(.disabled) .checkbox {
            forced-color-adjust: none;
            border-color: ${system_colors.a.GrayText};
        }

        :host(.disabled) .indeterminate-indicator {
            forced-color-adjust: none;
            background: ${system_colors.a.GrayText};
        }

        :host(.disabled) .checked-indicator {
            forced-color-adjust: none;
            fill: ${system_colors.a.GrayText};
        }
    }
`;
            let checkbox_FASTCheckbox = class FASTCheckbox extends checkbox_Checkbox {};
            checkbox_FASTCheckbox = (function(decorators, target, key, desc) {
                var d,
                    c = arguments.length,
                    r =
                        c < 3
                            ? target
                            : null === desc
                                ? (desc = Object.getOwnPropertyDescriptor(target, key))
                                : desc;
                if ("object" == typeof Reflect && "function" == typeof Reflect.decorate)
                    r = Reflect.decorate(decorators, target, key, desc);
                else
                    for (var i = decorators.length - 1; i >= 0; i--)
                        (d = decorators[i]) &&
                            (r =
                                (c < 3
                                    ? d(r)
                                    : c > 3
                                        ? d(target, key, r)
                                        : d(target, key)) || r);
                return c > 3 && r && Object.defineProperty(target, key, r), r;
            })(
                [
                    Object(fast_element.b)({
                        name: "fast-checkbox",
                        template: CheckboxTemplate,
                        styles: CheckboxStyles,
                    }),
                ],
                checkbox_FASTCheckbox
            );
            var design_system_provider = __webpack_require__(10),
                base = __webpack_require__(289),
                base_default = __webpack_require__.n(base),
                dist = __webpack_require__(97),
                public_api = __webpack_require__(98),
                public_api_default = __webpack_require__.n(public_api);
            function setIndeterminate() {
                document.querySelectorAll(".flag-indeterminate").forEach(el => {
                    el instanceof checkbox_FASTCheckbox && (el.indeterminate = !0);
                });
            }
            __webpack_require__.d(__webpack_exports__, "Base", function() {
                return Base;
            }),
                design_system_provider.a,
                public_api_default.a
                    .getChannel()
                    .addListener(dist.STORY_RENDERED, name => {
                        name.toLowerCase().startsWith("checkbox") && setIndeterminate();
                    }),
                document.addEventListener("readystatechange", () => {
                    "complete" === document.readyState && setIndeterminate();
                });
            __webpack_exports__.default = { title: "Checkbox" };
            const Base = () => base_default.a;
        },
        610: function(module, __webpack_exports__, __webpack_require__) {
            "use strict";
            __webpack_require__.r(__webpack_exports__);
            var fast_element = __webpack_require__(79),
                dom = __webpack_require__(14),
                attributes = __webpack_require__(22),
                key_codes = __webpack_require__(618),
                tabbable = __webpack_require__(182),
                tabbable_default = __webpack_require__.n(tabbable),
                __decorate = function(decorators, target, key, desc) {
                    var d,
                        c = arguments.length,
                        r =
                            c < 3
                                ? target
                                : null === desc
                                    ? (desc = Object.getOwnPropertyDescriptor(
                                          target,
                                          key
                                      ))
                                    : desc;
                    if (
                        "object" == typeof Reflect &&
                        "function" == typeof Reflect.decorate
                    )
                        r = Reflect.decorate(decorators, target, key, desc);
                    else
                        for (var i = decorators.length - 1; i >= 0; i--)
                            (d = decorators[i]) &&
                                (r =
                                    (c < 3
                                        ? d(r)
                                        : c > 3
                                            ? d(target, key, r)
                                            : d(target, key)) || r);
                    return c > 3 && r && Object.defineProperty(target, key, r), r;
                };
            class dialog_Dialog extends fast_element.a {
                constructor() {
                    super(...arguments),
                        (this.modal = !0),
                        (this.hidden = !1),
                        (this.trapFocus = !0),
                        (this.trapFocusChanged = () => {
                            this.shouldDialogTrapFocus()
                                ? (document.addEventListener(
                                      "focusin",
                                      this.handleDocumentFocus
                                  ),
                                  this.shouldForceFocus(document.activeElement) &&
                                      this.focusFirstElement())
                                : document.removeEventListener(
                                      "focusin",
                                      this.handleDocumentFocus
                                  );
                        }),
                        (this.handleDocumentKeydown = e => {
                            if (!e.defaultPrevented && !this.isDialogHidden())
                                switch (e.keyCode) {
                                    case key_codes.b:
                                        this.dismiss();
                                        break;
                                    case key_codes.d:
                                        this.handleTabKeyDown(e);
                                }
                        }),
                        (this.handleDocumentFocus = e => {
                            !e.defaultPrevented &&
                                this.shouldForceFocus(e.target) &&
                                (this.focusFirstElement(), e.preventDefault());
                        }),
                        (this.handleTabKeyDown = e => {
                            if (!this.shouldDialogTrapFocus()) return;
                            const tabbableElementCount = this.tabbableElements.length;
                            if (0 === tabbableElementCount)
                                return this.dialog.focus(), void e.preventDefault();
                            e.shiftKey && e.target === this.tabbableElements[0]
                                ? (this.tabbableElements[
                                      tabbableElementCount - 1
                                  ].focus(),
                                  e.preventDefault())
                                : e.shiftKey ||
                                  e.target !==
                                      this.tabbableElements[tabbableElementCount - 1] ||
                                  (this.tabbableElements[0].focus(), e.preventDefault());
                        }),
                        (this.focusFirstElement = () => {
                            0 === this.tabbableElements.length
                                ? this.dialog.focus()
                                : this.tabbableElements[0].focus();
                        }),
                        (this.shouldForceFocus = currentFocusElement =>
                            !this.isDialogHidden() &&
                            !this.contains(currentFocusElement));
                }
                dismiss() {
                    this.dispatchEvent(
                        new CustomEvent("dismiss", { bubbles: !0, composed: !0 })
                    );
                }
                connectedCallback() {
                    super.connectedCallback(),
                        (this.tabbableElements = tabbable_default()(this)),
                        (this.observer = new MutationObserver(this.onChildListChange)),
                        this.observer.observe(this, { childList: !0 }),
                        document.addEventListener("keydown", this.handleDocumentKeydown),
                        dom.a.queueUpdate(this.trapFocusChanged);
                }
                disconnectedCallback() {
                    super.disconnectedCallback(),
                        this.observer.disconnect(),
                        document.removeEventListener(
                            "keydown",
                            this.handleDocumentKeydown
                        ),
                        this.shouldDialogTrapFocus() &&
                            document.removeEventListener(
                                "focusin",
                                this.handleDocumentFocus
                            );
                }
                onChildListChange(mutations, observer) {
                    mutations.length &&
                        (this.tabbableElements = tabbable_default()(this));
                }
                isDialogHidden() {
                    return "boolean" != typeof this.hidden;
                }
                shouldDialogTrapFocus() {
                    return "boolean" == typeof this.trapFocus;
                }
            }
            __decorate([attributes.b], dialog_Dialog.prototype, "modal", void 0),
                __decorate([attributes.b], dialog_Dialog.prototype, "hidden", void 0),
                __decorate(
                    [Object(attributes.b)({ attribute: "trap-focus" })],
                    dialog_Dialog.prototype,
                    "trapFocus",
                    void 0
                ),
                __decorate(
                    [Object(attributes.b)({ attribute: "aria-describedby" })],
                    dialog_Dialog.prototype,
                    "ariaDescribedby",
                    void 0
                ),
                __decorate(
                    [Object(attributes.b)({ attribute: "aria-labelledby" })],
                    dialog_Dialog.prototype,
                    "ariaLabelledby",
                    void 0
                ),
                __decorate(
                    [Object(attributes.b)({ attribute: "aria-label" })],
                    dialog_Dialog.prototype,
                    "ariaLabel",
                    void 0
                );
            var template = __webpack_require__(631),
                when = __webpack_require__(624),
                ref = __webpack_require__(628);
            const DialogTemplate = template.a`
<div class="positioning-region" part="positioning-region">
    ${Object(when.a)(
        x => x.modal,
        template.a`
        <div
            class="overlay"
            part="overlay"
            role="presentation"
            tabindex="-1"
            @click=${(x, c) => x.dismiss()}
        ></div>
    `
    )}
    <div
        role="dialog"
        class="root"
        part="root"
        aria-modal=${x => x.modal}
        aria-describedby=${x => x.ariaDescribedby}
        aria-labelledby=${x => x.ariaLabelledby}
        aria-label=${x => x.ariaLabel}
        ${Object(ref.a)("dialog")}
    >
        <slot></slot>
    </div>
</div>
`;
            var styles = __webpack_require__(621),
                elevation = __webpack_require__(285);
            const DialogStyles = styles.a`
    :host([hidden]) {
        display: none;
    }

    :host {
        --elevation: 14;
        --dialog-height: 480px;
        --dialog-width: 640px;
        display: block;
    }

    .overlay {
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: rgba(0, 0, 0, 0.3);
        touch-action: none;
    }

    .positioning-region {
        display: flex;
        justify-content: center;
        position: fixed;
        top: 0;
        bottom: 0;
        left: 0;
        right: 0;
        overflow: auto;
    }

    .root {
        ${elevation.a} margin-top: auto;
        margin-bottom: auto;
        border-radius: calc(var(--elevated-corner-radius));
        width: var(--dialog-width);
        height: var(--dialog-height);
        background: var(--background-color);
        z-index: 1;
    }
`;
            let dialog_FASTDialog = class FASTDialog extends dialog_Dialog {};
            dialog_FASTDialog = (function(decorators, target, key, desc) {
                var d,
                    c = arguments.length,
                    r =
                        c < 3
                            ? target
                            : null === desc
                                ? (desc = Object.getOwnPropertyDescriptor(target, key))
                                : desc;
                if ("object" == typeof Reflect && "function" == typeof Reflect.decorate)
                    r = Reflect.decorate(decorators, target, key, desc);
                else
                    for (var i = decorators.length - 1; i >= 0; i--)
                        (d = decorators[i]) &&
                            (r =
                                (c < 3
                                    ? d(r)
                                    : c > 3
                                        ? d(target, key, r)
                                        : d(target, key)) || r);
                return c > 3 && r && Object.defineProperty(target, key, r), r;
            })(
                [
                    Object(fast_element.b)({
                        name: "fast-dialog",
                        template: DialogTemplate,
                        styles: DialogStyles,
                    }),
                ],
                dialog_FASTDialog
            );
            var design_system_provider = __webpack_require__(10),
                dialog = __webpack_require__(290),
                dialog_default = __webpack_require__.n(dialog);
            __webpack_require__.d(__webpack_exports__, "Dialog", function() {
                return dialog_stories_Dialog;
            }),
                design_system_provider.a;
            __webpack_exports__.default = { title: "Dialog" };
            const dialog_stories_Dialog = () => dialog_default.a;
        },
        611: function(module, __webpack_exports__, __webpack_require__) {
            "use strict";
            __webpack_require__.r(__webpack_exports__);
            var fast_element = __webpack_require__(79);
            class name_tag_NameTag extends fast_element.a {
                constructor() {
                    super(...arguments), (this.greeting = "Hello");
                }
            }
            (function(decorators, target, key, desc) {
                var d,
                    c = arguments.length,
                    r =
                        c < 3
                            ? target
                            : null === desc
                                ? (desc = Object.getOwnPropertyDescriptor(target, key))
                                : desc;
                if ("object" == typeof Reflect && "function" == typeof Reflect.decorate)
                    r = Reflect.decorate(decorators, target, key, desc);
                else
                    for (var i = decorators.length - 1; i >= 0; i--)
                        (d = decorators[i]) &&
                            (r =
                                (c < 3
                                    ? d(r)
                                    : c > 3
                                        ? d(target, key, r)
                                        : d(target, key)) || r);
                c > 3 && r && Object.defineProperty(target, key, r);
            })(
                [__webpack_require__(22).b],
                name_tag_NameTag.prototype,
                "greeting",
                void 0
            );
            const NameTagTemplate = __webpack_require__(631).a`
  <div class="header">
    <slot name="avatar"></slot>
    <h3>${x => x.greeting.toUpperCase()}</h3>
    <h4>my name is</h4>
  </div>

  <div class="body">
    <slot></slot>
  </div>

  <div class="footer"></div>
`;
            const NameTagStyles = __webpack_require__(621).a`
    :host([hidden]) {
        display: none;
    }

    :host {
        --depth: 4;
        display: block;
        color: var(--accent-foreground-cut-rest);
        background: var(--accent-fill-rest);
        border-radius: calc(var(--corner-radius) * 1px);
        min-width: calc(var(--design-unit) * 81.25px);
        max-width: calc(var(--design-unit) * 125px);
        text-align: center;
        box-shadow: 0 0 calc(var(--depth) * 1px) rgba(0, 0, 0, 0.5);
        overflow: hidden;
        margin: calc(var(--design-unit) * 8px) 0;
    }

    .header {
        padding: 16px 0;
        position: relative;
    }

    h3 {
        font-weight: bold;
        font-family: "Source Sans Pro";
        letter-spacing: 4px;
        font-size: calc(var(--density) * 24px + 20px);
        margin: 0;
        padding: 0;
    }

    h4 {
        font-family: sans-serif;
        font-size: calc(var(--density) * 16px + 10px);
        margin: 0;
        padding: 0;
    }

    .body {
        background: white;
        color: black;
        padding: calc(var(--density) * var(--design-unit) * 8px + 12px) 8px;
        font-size: calc(var(--density) * 24px + 30px);
        font-family: cursive;
    }

    .footer {
        height: 16px;
    }

    ::slotted(img) {
        border-radius: 50%;
        height: 64px;
        width: 64px;
        box-shadow: 0 0 calc(var(--depth) / 2px) rgba(0, 0, 0, 0.5);
        position: absolute;
        left: 16px;
        top: -4px;
    }
`;
            let name_tag_FASTNameTag = class FASTNameTag extends name_tag_NameTag {};
            name_tag_FASTNameTag = (function(decorators, target, key, desc) {
                var d,
                    c = arguments.length,
                    r =
                        c < 3
                            ? target
                            : null === desc
                                ? (desc = Object.getOwnPropertyDescriptor(target, key))
                                : desc;
                if ("object" == typeof Reflect && "function" == typeof Reflect.decorate)
                    r = Reflect.decorate(decorators, target, key, desc);
                else
                    for (var i = decorators.length - 1; i >= 0; i--)
                        (d = decorators[i]) &&
                            (r =
                                (c < 3
                                    ? d(r)
                                    : c > 3
                                        ? d(target, key, r)
                                        : d(target, key)) || r);
                return c > 3 && r && Object.defineProperty(target, key, r), r;
            })(
                [
                    Object(fast_element.b)({
                        name: "fast-name-tag",
                        template: NameTagTemplate,
                        styles: NameTagStyles,
                    }),
                ],
                name_tag_FASTNameTag
            );
            var design_system_provider = __webpack_require__(10),
                mark = __webpack_require__(291),
                mark_default = __webpack_require__.n(mark);
            __webpack_require__.d(__webpack_exports__, "Mark", function() {
                return Mark;
            }),
                design_system_provider.a;
            __webpack_exports__.default = { title: "Name tag" };
            const Mark = () => mark_default.a;
        },
        612: function(module, __webpack_exports__, __webpack_require__) {
            "use strict";
            __webpack_require__.r(__webpack_exports__);
            var fast_element = __webpack_require__(79),
                attributes = __webpack_require__(22),
                observable = __webpack_require__(38),
                form_associated = __webpack_require__(77),
                key_codes = __webpack_require__(618),
                __decorate = function(decorators, target, key, desc) {
                    var d,
                        c = arguments.length,
                        r =
                            c < 3
                                ? target
                                : null === desc
                                    ? (desc = Object.getOwnPropertyDescriptor(
                                          target,
                                          key
                                      ))
                                    : desc;
                    if (
                        "object" == typeof Reflect &&
                        "function" == typeof Reflect.decorate
                    )
                        r = Reflect.decorate(decorators, target, key, desc);
                    else
                        for (var i = decorators.length - 1; i >= 0; i--)
                            (d = decorators[i]) &&
                                (r =
                                    (c < 3
                                        ? d(r)
                                        : c > 3
                                            ? d(target, key, r)
                                            : d(target, key)) || r);
                    return c > 3 && r && Object.defineProperty(target, key, r), r;
                };
            class switch_Switch extends form_associated.a {
                constructor() {
                    super(),
                        (this.value = "on"),
                        (this.defaultChecked = !!this.checkedAttribute),
                        (this.checked = this.defaultChecked),
                        (this.proxy = document.createElement("input")),
                        (this.dirtyChecked = !1),
                        (this.keypressHandler = e => {
                            switch ((super.keypressHandler(e), e.keyCode)) {
                                case key_codes.c:
                                    this.checked = !this.checked;
                            }
                        }),
                        (this.clickHandler = e => {
                            this.disabled ||
                                this.readOnly ||
                                (this.checked = !this.checked);
                        }),
                        this.proxy.setAttribute("type", "checkbox");
                }
                readOnlyChanged() {
                    this.proxy instanceof HTMLElement &&
                        (this.proxy.readOnly = this.readOnly),
                        this.readOnly
                            ? this.classList.add("readonly")
                            : this.classList.remove("readonly");
                }
                valueChanged() {
                    this.proxy instanceof HTMLElement && (this.proxy.value = this.value);
                }
                checkedAttributeChanged() {
                    this.defaultChecked = this.checkedAttribute;
                }
                defaultCheckedChanged() {
                    this.dirtyChecked ||
                        ((this.checked = this.defaultChecked), (this.dirtyChecked = !1));
                }
                checkedChanged() {
                    this.dirtyChecked || (this.dirtyChecked = !0),
                        this.updateForm(),
                        this.proxy instanceof HTMLElement &&
                            (this.proxy.checked = this.checked),
                        this.$emit("change"),
                        this.checked
                            ? this.classList.add("checked")
                            : this.classList.remove("checked");
                }
                connectedCallback() {
                    super.connectedCallback(), this.updateForm();
                }
                updateForm() {
                    const value = this.checked ? this.value : null;
                    this.setFormValue(value, value);
                }
            }
            __decorate(
                [Object(attributes.b)({ attribute: "readonly", mode: "boolean" })],
                switch_Switch.prototype,
                "readOnly",
                void 0
            ),
                __decorate([attributes.b], switch_Switch.prototype, "value", void 0),
                __decorate(
                    [Object(attributes.b)({ attribute: "checked", mode: "boolean" })],
                    switch_Switch.prototype,
                    "checkedAttribute",
                    void 0
                ),
                __decorate(
                    [observable.c],
                    switch_Switch.prototype,
                    "defaultChecked",
                    void 0
                ),
                __decorate([observable.c], switch_Switch.prototype, "checked", void 0);
            var template = __webpack_require__(631),
                when = __webpack_require__(624);
            const SwitchTemplate = template.a`
    <template
        role="switch"
        aria-checked="${x => x.checked}"
        aria-required="${x => x.required}"
        aria-disabled="${x => x.disabled}"
        aria-readonly="${x => x.readOnly}"
        tabindex="${x => (x.disabled ? null : 0)}"
        @keypress="${(x, c) => x.keypressHandler(c.event)}"
        @click="${(x, c) => x.clickHandler(c.event)}"
    >
        ${Object(when.a)(
            x => x.childNodes.length,
            template.a`
            <label
                part="label"
                class="label"
                id="switch-label"
            >
                <slot></slot>
            </label>
        `
        )}
        <div
            part="switch"
            class="switch"
        >
            <span class="checked-indicator" part="checked-indicator"></span>
        </div>
        <span class="status-message" part="status-message">
            <span class="checked-message" part="checked-message">
                <slot name="checked-message"></slot>
            </span>
            <span class="unchecked-message" part="unchecked-message">
                <slot name="unchecked-message"></slot>
            </span>
        </span>
    </template>
`;
            var styles = __webpack_require__(621),
                display = __webpack_require__(622),
                disabled = __webpack_require__(627),
                styles_focus = __webpack_require__(37),
                system_colors = __webpack_require__(1);
            const SwitchStyles = styles.a`
    :host([hidden]) {
        display: none;
    }

    ${Object(display.a)("inline-flex")} :host {
        align-items: center;
        outline: none;
        margin: calc(var(--design-unit) * 1px) 0;
        ${""} user-select: none;
    }

    :host(.disabled) {
        opacity: var(--disabled-opacity);
    }

    :host(.disabled) .label,
    :host(.readonly) .label,
    :host(.readonly) .switch,
    :host(.disabled) .switch {
        cursor: ${disabled.a};
    }

    .switch {
        position: relative;
        outline: none;
        width: calc(var(--height-number) * 2px);
        height: calc(var(--height-number) * 1px);
        background: var(--neutral-fill-input-rest);
        border-radius: calc(var(--height-number) * 1px);
        border: calc(var(--outline-width) * 1px) solid var(--neutral-outline-rest);
    }

    .switch:hover {
        cursor: pointer;
    }

    .switch:hover {
        background: var(--neutral-fill-input-hover);
        border-color: var(--neutral-outline-hover);
    }

    .switch:active {
        background: var(--neutral-fill-input-active);
        border-color: var(--neutral-outline-active);
    }

    :host(:${styles_focus.a}) .switch {
        box-shadow: 0 0 0 1px var(--neutral-focus) inset;
        border-color: var(--neutral-focus);
    }

    .checked-indicator {
        position: absolute;
        height: calc((var(--height-number) - (var(--design-unit) * 2)) * 1px);
        width: calc((var(--height-number) - (var(--design-unit) * 2)) * 1px);
        top: calc(var(--design-unit) * 1px);
        left: calc(var(--design-unit) * 1px);
        background: var(--neutral-foreground-rest);
        border-radius: 50%;
        transition: all 0.2s ease-in-out;
    }

    .label .status-maessage {
        font-family: var(--body-font);
        color: var(--neutral-foreground-rest);
        cursor: pointer;
        ${""} font-size: calc(1rem + (var(--density) * 2px));
    }

    .label {
        ${""} margin-inline-end: calc(var(--design-unit) * 2px + 2px);
    }

    ::slotted(*) {
        ${""} margin-inline-start: calc(var(--design-unit) * 2px + 2px);
    }

    :host(.checked) .checked-indicator {
        left: calc((var(--height-number) + var(--design-unit)) * 1px);
        background: var(--accent-foreground-cut-rest);
    }

    :host(.checked) .switch {
        background: var(--accent-fill-rest);
    }

    .unchecked-message {
        display: block;
    }

    .checked-message {
        display: none;
    }

    :host(.checked) .unchecked-message {
        display: none;
    }

    :host(.checked) .checked-message {
        display: block;
    }

    @media (forced-colors: active) {
        .checked-indicator {
            forced-color-adjust: none;
            background: ${system_colors.a.FieldText};
        }

        .switch, .switch:hover, .switch:active {
            forced-color-adjust: none;
            background: ${system_colors.a.Field};
            border-color: ${system_colors.a.FieldText};
        }

        :host(.checked) .switch {
            background: ${system_colors.a.FieldText};
        }

        :host(.checked) .checked-indicator {
            background: ${system_colors.a.Field};
        }

        :host(.disabled) {
            opacity: 1;
        }

        :host(:${styles_focus.a}) .switch {
            border-color: ${system_colors.a.Highlight};
        }
        :host(.disabled) .checked-indicator {
            background: ${system_colors.a.GrayText};
        }

        :host(.disabled) .switch {
            background: ${system_colors.a.Field};
            border-color: ${system_colors.a.GrayText};
        }
    }
`;
            let switch_FASTSwitch = class FASTSwitch extends switch_Switch {};
            switch_FASTSwitch = (function(decorators, target, key, desc) {
                var d,
                    c = arguments.length,
                    r =
                        c < 3
                            ? target
                            : null === desc
                                ? (desc = Object.getOwnPropertyDescriptor(target, key))
                                : desc;
                if ("object" == typeof Reflect && "function" == typeof Reflect.decorate)
                    r = Reflect.decorate(decorators, target, key, desc);
                else
                    for (var i = decorators.length - 1; i >= 0; i--)
                        (d = decorators[i]) &&
                            (r =
                                (c < 3
                                    ? d(r)
                                    : c > 3
                                        ? d(target, key, r)
                                        : d(target, key)) || r);
                return c > 3 && r && Object.defineProperty(target, key, r), r;
            })(
                [
                    Object(fast_element.b)({
                        name: "fast-switch",
                        template: SwitchTemplate,
                        styles: SwitchStyles,
                    }),
                ],
                switch_FASTSwitch
            );
            var design_system_provider = __webpack_require__(10),
                base = __webpack_require__(294),
                base_default = __webpack_require__.n(base);
            __webpack_require__.d(__webpack_exports__, "Base", function() {
                return Base;
            }),
                design_system_provider.a;
            __webpack_exports__.default = { title: "Switch" };
            const Base = () => base_default.a;
        },
        613: function(module, __webpack_exports__, __webpack_require__) {
            "use strict";
            __webpack_require__.r(__webpack_exports__);
            var TextAreaAppearance,
                TextAreaResize,
                fast_element = __webpack_require__(79),
                attributes = __webpack_require__(22),
                __decorate = function(decorators, target, key, desc) {
                    var d,
                        c = arguments.length,
                        r =
                            c < 3
                                ? target
                                : null === desc
                                    ? (desc = Object.getOwnPropertyDescriptor(
                                          target,
                                          key
                                      ))
                                    : desc;
                    if (
                        "object" == typeof Reflect &&
                        "function" == typeof Reflect.decorate
                    )
                        r = Reflect.decorate(decorators, target, key, desc);
                    else
                        for (var i = decorators.length - 1; i >= 0; i--)
                            (d = decorators[i]) &&
                                (r =
                                    (c < 3
                                        ? d(r)
                                        : c > 3
                                            ? d(target, key, r)
                                            : d(target, key)) || r);
                    return c > 3 && r && Object.defineProperty(target, key, r), r;
                };
            !(function(TextAreaAppearance) {
                (TextAreaAppearance.filled = "filled"),
                    (TextAreaAppearance.outline = "outline");
            })(TextAreaAppearance || (TextAreaAppearance = {})),
                (function(TextAreaResize) {
                    (TextAreaResize.none = "none"),
                        (TextAreaResize.both = "both"),
                        (TextAreaResize.horizontal = "horizontal"),
                        (TextAreaResize.vertical = "vertical");
                })(TextAreaResize || (TextAreaResize = {}));
            class text_area_TextArea extends fast_element.a {
                constructor() {
                    super(...arguments),
                        (this.appearance = TextAreaAppearance.outline),
                        (this.resize = TextAreaResize.none),
                        (this.cols = 20),
                        (this.handleTextInput = () => {
                            this.$emit("change", this.textarea.value);
                        });
                }
                appearanceChanged() {
                    this.appearance === TextAreaAppearance.filled
                        ? this.classList.add("filled")
                        : this.classList.remove("filled");
                }
                requiredChanged() {
                    this.required
                        ? this.classList.add("required")
                        : this.classList.remove("required");
                }
                readonlyChanged() {
                    this.readonly
                        ? this.classList.add("readonly")
                        : this.classList.remove("readonly");
                }
                resizeChanged() {
                    this.resize !== TextAreaResize.none
                        ? this.classList.add(`resize-${this.resize}`)
                        : this.classList.remove(`resize-${this.resize}`);
                }
                valueChanged() {
                    this.textarea &&
                        this.value !== this.textarea.value &&
                        (this.textarea.value = this.value);
                }
                connectedCallback() {
                    super.connectedCallback(),
                        this.value && (this.textarea.value = this.value);
                }
            }
            __decorate(
                [attributes.b],
                text_area_TextArea.prototype,
                "appearance",
                void 0
            ),
                __decorate(
                    [Object(attributes.b)({ attribute: "required", mode: "boolean" })],
                    text_area_TextArea.prototype,
                    "required",
                    void 0
                ),
                __decorate(
                    [Object(attributes.b)({ mode: "boolean" })],
                    text_area_TextArea.prototype,
                    "readonly",
                    void 0
                ),
                __decorate(
                    [attributes.b],
                    text_area_TextArea.prototype,
                    "resize",
                    void 0
                ),
                __decorate(
                    [attributes.b],
                    text_area_TextArea.prototype,
                    "autofocus",
                    void 0
                ),
                __decorate([attributes.b], text_area_TextArea.prototype, "cols", void 0),
                __decorate(
                    [attributes.b],
                    text_area_TextArea.prototype,
                    "disabled",
                    void 0
                ),
                __decorate([attributes.b], text_area_TextArea.prototype, "form", void 0),
                __decorate([attributes.b], text_area_TextArea.prototype, "list", void 0),
                __decorate(
                    [attributes.b],
                    text_area_TextArea.prototype,
                    "maxlength",
                    void 0
                ),
                __decorate(
                    [attributes.b],
                    text_area_TextArea.prototype,
                    "minlength",
                    void 0
                ),
                __decorate([attributes.b], text_area_TextArea.prototype, "name", void 0),
                __decorate(
                    [attributes.b],
                    text_area_TextArea.prototype,
                    "placeholder",
                    void 0
                ),
                __decorate([attributes.b], text_area_TextArea.prototype, "rows", void 0),
                __decorate(
                    [attributes.b],
                    text_area_TextArea.prototype,
                    "spellcheck",
                    void 0
                ),
                __decorate([attributes.b], text_area_TextArea.prototype, "value", void 0);
            var template = __webpack_require__(631),
                when = __webpack_require__(624),
                ref = __webpack_require__(628);
            const TextAreaTemplate = template.a`
    ${Object(when.a)(
        x => x.childNodes.length,
        template.a`
        <label
            part="label"
            class="label"
            for="control"
        >
            <slot name="label"></slot>
        </label>
    `
    )}
    <textarea
        part="control"
        class="control"
        id="control"
        ?autofocus="${x => x.autofocus}"
        cols="${x => x.cols}"
        ?disabled="${x => x.disabled}"
        form="${x => x.form}"
        list="${x => x.list}"
        maxlength="${x => x.maxlength}"
        minlength="${x => x.minlength}"
        name="${x => x.name}"
        placeholder="${x => x.placeholder}"
        ?readonly="${x => x.readonly}"
        ?required="${x => x.required}"
        rows="${x => x.rows}"
        ?spellcheck="${x => x.spellcheck}"
        value="${x => x.value}"
        @input=${x => x.handleTextInput()}"
        ${Object(ref.a)("textarea")}
    ></textarea>
`;
            var styles = __webpack_require__(621),
                display = __webpack_require__(622),
                disabled = __webpack_require__(627),
                styles_focus = __webpack_require__(37);
            const TextAreaStyles = styles.a`
    ${Object(display.a)("inline-block")} :host {
        font-family: var(--body-font);
        outline: none;
        user-select: none;
    }

    .control {
        box-sizing: border-box;
        position: relative;
        color: var(--neutral-foreground-rest);
        background: var(--neutral-fill-input-rest);
        border-radius: calc(var(--corner-radius) * 1px);
        border: calc(var(--outline-width) * 1px) solid var(--neutral-outline-rest);
        height: calc(var(--height-number) * 2px);
        font: inherit;
        ${""} font-size: 14px;
        font-weight: 400px;
        line-height: 20px;
        padding-top: calc(var(--design-unit) * 1.5);
        padding-bottom: calc(var(--design-unit) * 1.5);
        max-width: 100%;
        resize: none;
    }

    .control:hover:enabled {
        background: var(--neutral-fill-input-hover);
        border-color: var(--neutral-outline-hover);
    }

    .control:hover,
    .control:${styles_focus.a},
    .control:disabled,
    .control:active {
        outline: none;
    }

    :host(:focus-within) .control {
        border-color: var(--neutral-focus);
        box-shadow: 0 0 0 1px var(--neutral-focus) inset;
    }

    :host(.filled) .control {
        background: var(--neutral-fill-rest);
        border-color: transparent;
    }

    :host(.filled:hover:not([disabled])) .control {
        background: var(--neutral-fill-hover);
        border-color: transparent;
    }

    :host(.resize-both) .control {
        resize: both;
    }

    :host(.resize-horizontal) .control {
        resize: horizontal;
    }

    :host(.resize-vertical) .control {
        resize: vertical;
    }

    .label {
        display: block;
        color: var(--neutral-foreground-rest);
        cursor: pointer;
        ${""} font-size: 14px;
        font-weight: 400px;
        line-height: 20px;
        margin-bottom: 4px;
    }

    :host([disabled]) .label,
    :host([readonly]) .label,
    :host([readonly]) .control,
    :host([disabled]) .control {
        cursor: ${disabled.a};
    }
    :host([disabled]) {
        opacity: var(--disabled-opacity);
    }

    @media (forced-colors: active) {
        :host([disabled]) {
            opacity: 1;
        }
    }
`;
            let text_area_FASTTextArea = class FASTTextArea extends text_area_TextArea {};
            text_area_FASTTextArea = (function(decorators, target, key, desc) {
                var d,
                    c = arguments.length,
                    r =
                        c < 3
                            ? target
                            : null === desc
                                ? (desc = Object.getOwnPropertyDescriptor(target, key))
                                : desc;
                if ("object" == typeof Reflect && "function" == typeof Reflect.decorate)
                    r = Reflect.decorate(decorators, target, key, desc);
                else
                    for (var i = decorators.length - 1; i >= 0; i--)
                        (d = decorators[i]) &&
                            (r =
                                (c < 3
                                    ? d(r)
                                    : c > 3
                                        ? d(target, key, r)
                                        : d(target, key)) || r);
                return c > 3 && r && Object.defineProperty(target, key, r), r;
            })(
                [
                    Object(fast_element.b)({
                        name: "fast-text-area",
                        template: TextAreaTemplate,
                        styles: TextAreaStyles,
                        shadowOptions: { delegatesFocus: !0 },
                    }),
                ],
                text_area_FASTTextArea
            );
            var design_system_provider = __webpack_require__(10),
                text_area = __webpack_require__(295),
                text_area_default = __webpack_require__.n(text_area);
            __webpack_require__.d(__webpack_exports__, "TextField", function() {
                return TextField;
            }),
                design_system_provider.a;
            __webpack_exports__.default = { title: "Text area" };
            const TextField = () => text_area_default.a;
        },
        614: function(module, __webpack_exports__, __webpack_require__) {
            "use strict";
            __webpack_require__.r(__webpack_exports__);
            var TextFieldAppearance,
                TextFieldType,
                fast_element = __webpack_require__(79),
                attributes = __webpack_require__(22),
                form_associated = __webpack_require__(77),
                __decorate = function(decorators, target, key, desc) {
                    var d,
                        c = arguments.length,
                        r =
                            c < 3
                                ? target
                                : null === desc
                                    ? (desc = Object.getOwnPropertyDescriptor(
                                          target,
                                          key
                                      ))
                                    : desc;
                    if (
                        "object" == typeof Reflect &&
                        "function" == typeof Reflect.decorate
                    )
                        r = Reflect.decorate(decorators, target, key, desc);
                    else
                        for (var i = decorators.length - 1; i >= 0; i--)
                            (d = decorators[i]) &&
                                (r =
                                    (c < 3
                                        ? d(r)
                                        : c > 3
                                            ? d(target, key, r)
                                            : d(target, key)) || r);
                    return c > 3 && r && Object.defineProperty(target, key, r), r;
                };
            !(function(TextFieldAppearance) {
                (TextFieldAppearance.filled = "filled"),
                    (TextFieldAppearance.outline = "outline");
            })(TextFieldAppearance || (TextFieldAppearance = {})),
                (function(TextFieldType) {
                    (TextFieldType.email = "email"),
                        (TextFieldType.password = "password"),
                        (TextFieldType.tel = "tel"),
                        (TextFieldType.text = "text"),
                        (TextFieldType.url = "url");
                })(TextFieldType || (TextFieldType = {}));
            class text_field_TextField extends form_associated.a {
                constructor() {
                    super(),
                        (this.appearance = TextFieldAppearance.outline),
                        (this.type = TextFieldType.text),
                        (this.proxy = document.createElement("input")),
                        this.proxy.setAttribute("type", this.type);
                }
                appearanceChanged() {
                    this.appearance === TextFieldAppearance.filled
                        ? this.classList.add("filled")
                        : this.classList.remove("filled");
                }
                readOnlyChanged() {
                    this.proxy instanceof HTMLElement &&
                        (this.proxy.readOnly = this.readOnly),
                        this.readOnly
                            ? this.classList.add("readonly")
                            : this.classList.remove("readonly");
                }
                autofocusChanged() {
                    this.proxy instanceof HTMLElement &&
                        (this.proxy.autofocus = this.autofocus);
                }
                placeholderChanged() {
                    this.proxy instanceof HTMLElement &&
                        (this.proxy.placeholder = this.placeholder);
                }
                typeChanged() {
                    this.proxy instanceof HTMLElement && (this.proxy.type = this.type);
                }
                listChanged() {
                    this.proxy instanceof HTMLElement &&
                        this.proxy.setAttribute("list", this.list);
                }
                maxlengthChanged() {
                    this.proxy instanceof HTMLElement &&
                        (this.proxy.maxLength = this.maxlength);
                }
                minlengthChanged() {
                    this.proxy instanceof HTMLElement &&
                        (this.proxy.minLength = this.minlength);
                }
                patternChanged() {
                    this.proxy instanceof HTMLElement &&
                        (this.proxy.pattern = this.pattern);
                }
                sizeChanged() {
                    this.proxy instanceof HTMLElement && (this.proxy.size = this.size);
                }
                spellcheckChanged() {
                    this.proxy instanceof HTMLElement &&
                        (this.proxy.spellcheck = this.spellcheck);
                }
                valueChanged() {
                    this.proxy instanceof HTMLElement && (this.proxy.value = this.value),
                        this.$emit("change", this.value);
                }
                connectedCallback() {
                    super.connectedCallback(),
                        this.autofocus && this.focus(),
                        this.setFormValue(this.value, this.value);
                }
                handleTextInput() {
                    this.control &&
                        this.control.value &&
                        (this.value = this.control.value);
                }
                handleAfterContentChange() {
                    this.afterContent.assignedNodes().length > 0
                        ? this.afterContentContainer.classList.add("after-content")
                        : this.afterContentContainer.classList.remove("after-content");
                }
                handleBeforeContentChange() {
                    this.beforeContent.assignedNodes().length > 0
                        ? this.beforeContentContainer.classList.add("before-content")
                        : this.beforeContentContainer.classList.remove("before-content");
                }
            }
            __decorate(
                [attributes.b],
                text_field_TextField.prototype,
                "appearance",
                void 0
            ),
                __decorate(
                    [
                        Object(attributes.b)({ mode: "boolean" }),
                        Object(attributes.b)({ attribute: "readonly", mode: "boolean" }),
                    ],
                    text_field_TextField.prototype,
                    "readOnly",
                    void 0
                ),
                __decorate(
                    [Object(attributes.b)({ mode: "boolean" })],
                    text_field_TextField.prototype,
                    "autofocus",
                    void 0
                ),
                __decorate(
                    [attributes.b],
                    text_field_TextField.prototype,
                    "placeholder",
                    void 0
                ),
                __decorate(
                    [attributes.b],
                    text_field_TextField.prototype,
                    "type",
                    void 0
                ),
                __decorate(
                    [attributes.b],
                    text_field_TextField.prototype,
                    "list",
                    void 0
                ),
                __decorate(
                    [attributes.b],
                    text_field_TextField.prototype,
                    "maxlength",
                    void 0
                ),
                __decorate(
                    [attributes.b],
                    text_field_TextField.prototype,
                    "minlength",
                    void 0
                ),
                __decorate(
                    [attributes.b],
                    text_field_TextField.prototype,
                    "pattern",
                    void 0
                ),
                __decorate(
                    [attributes.b],
                    text_field_TextField.prototype,
                    "size",
                    void 0
                ),
                __decorate(
                    [Object(attributes.b)({ mode: "boolean" })],
                    text_field_TextField.prototype,
                    "spellcheck",
                    void 0
                ),
                __decorate(
                    [attributes.b],
                    text_field_TextField.prototype,
                    "value",
                    void 0
                );
            var template = __webpack_require__(631),
                when = __webpack_require__(624),
                ref = __webpack_require__(628);
            const TextFieldTemplate = template.a`
<template
    role="textbox"
    appearance="${x => x.appearance}"
    aria-required="${x => x.required}"
    aria-disabled="${x => x.disabled}"
    aria-readonly="${x => x.readOnly}"
    tabindex="${x => (x.disabled ? null : 0)}"
>
    ${Object(when.a)(
        x => x.childNodes.length,
        template.a`
        <label
            part="label"
            class="label"
            for="control"
        ><slot></slot></label>
    `
    )}
    <div
        class="root"
        part="root"    
    >
        <span
            part="before-content"
            ${Object(ref.a)("beforeContentContainer")}
        >
            <slot
                name="before-content"
                @slotchange=${x => x.handleBeforeContentChange()}
                ${Object(ref.a)("beforeContent")}
            ></slot>
        </span>
        <input
            class="control"
            part="control"
            id="control"
            @input=${x => x.handleTextInput()}
            placeholder=${x => x.placeholder}
            ?required=${x => x.required}
            ?disabled=${x => x.disabled}
            ?readonly=${x => x.readOnly}
            value=${x => x.value}
            ${Object(ref.a)("control")}
        />
        <span
            part="after-content"
            ${Object(ref.a)("afterContentContainer")}
        >
            <slot
                name="after-content"
                @slotchange=${x => x.handleAfterContentChange()}
                ${Object(ref.a)("afterContent")}
            ></slot>
        </span>
    </div>
</template>
`;
            var styles = __webpack_require__(621),
                display = __webpack_require__(622),
                disabled = __webpack_require__(627),
                styles_focus = __webpack_require__(37),
                system_colors = __webpack_require__(1);
            const TextFieldStyles = styles.a`
    ${Object(display.a)("inline-block")} :host {
        font-family: var(--body-font);
        outline: none;
        user-select: none;
    }

    .root {
        box-sizing: border-box;
        position: relative;
        display: flex;
        flex-direction: row;
        color: var(--neutral-foreground-rest);
        background: var(--neutral-fill-input-rest);
        border-radius: calc(var(--corner-radius) * 1px);
        border: calc(var(--outline-width) * 1px) solid var(--neutral-outline-rest);
        height: calc(var(--height-number) * 1px);
    }

    .control {
        -webkit-appearance: none;
        background: transparent;
        border: 0;
        padding: 0;
        height: calc(100% - 4px);
        margin-top: auto;
        margin-bottom: auto;
        border: none;
        padding: 0 calc(var(--design-unit) * 2px + 1px);
        ${""} font-size: 14px;
        line-height: 20px;
    }

    .control:hover,
    .control:${styles_focus.a},
    .control:disabled,
    .control:active {
        outline: none;
    }

    .label {
        display: block;
        color: var(--neutral-foreground-rest);
        cursor: pointer;
        ${""} font-size: 14px;
        margin-bottom: 4px;
    }

    .before-content,
    .after-content {
        ${""} width: 16px;
        height: 16px;
        margin: auto;
        fill: var(--neutral-foreground-rest);
    }

    .before-content {
        margin-inline-start: 11px;
    }

    .after-content {
        margin-inline-end: 11px;
    }

    :host(:hover:not(.disabled)) .root {
        background: var(--neutral-fill-input-hover);
        border-color: var(--neutral-outline-hover);
    }

    :host(:focus-within) .root {
        border-color: var(--neutral-focus);
        box-shadow: 0 0 0 1px var(--neutral-focus) inset;
    }

    :host(.filled) .root {
        background: var(--neutral-fill-rest);
        border-color: transparent;
    }

    :host(.filled:hover:not(.disabled)) .root {
        background: var(--neutral-fill-hover);
        border-color: transparent;
    }

    :host(.disabled) .label,
    :host(.readonly) .label,
    :host(.readonly) .control,
    :host(.disabled) .control {
        cursor: ${disabled.a};
    }

    :host(.disabled) {
        opacity: var(--disabled-opacity);
    }

    @media (forced-colors: active) {
        .root, :host(.filled) .root {
            forced-color-adjust: none;
            background: ${system_colors.a.Field};
            border-color: ${system_colors.a.FieldText};
        }

        :host(.disabled) {
            opacity: 1;
        }
        
        :host(.disabled) .root {
            border-color: ${system_colors.a.GrayText};
            background: ${system_colors.a.Field};
        }

        
        :host(:focus-within) .root {
            border-color: ${system_colors.a.Highlight};
            box-shadow: 0 0 0 1px ${system_colors.a.Highlight} inset;
        }
    }
`;
            let text_field_FASTTextField = class FASTTextField extends text_field_TextField {};
            text_field_FASTTextField = (function(decorators, target, key, desc) {
                var d,
                    c = arguments.length,
                    r =
                        c < 3
                            ? target
                            : null === desc
                                ? (desc = Object.getOwnPropertyDescriptor(target, key))
                                : desc;
                if ("object" == typeof Reflect && "function" == typeof Reflect.decorate)
                    r = Reflect.decorate(decorators, target, key, desc);
                else
                    for (var i = decorators.length - 1; i >= 0; i--)
                        (d = decorators[i]) &&
                            (r =
                                (c < 3
                                    ? d(r)
                                    : c > 3
                                        ? d(target, key, r)
                                        : d(target, key)) || r);
                return c > 3 && r && Object.defineProperty(target, key, r), r;
            })(
                [
                    Object(fast_element.b)({
                        name: "fast-text-field",
                        template: TextFieldTemplate,
                        styles: TextFieldStyles,
                        shadowOptions: { delegatesFocus: !0 },
                    }),
                ],
                text_field_FASTTextField
            );
            var design_system_provider = __webpack_require__(10),
                text_field = __webpack_require__(296),
                text_field_default = __webpack_require__.n(text_field),
                dist = __webpack_require__(97),
                public_api = __webpack_require__(98),
                public_api_default = __webpack_require__.n(public_api);
            __webpack_require__.d(__webpack_exports__, "TextField", function() {
                return text_field_stories_TextField;
            }),
                design_system_provider.a,
                public_api_default.a
                    .getChannel()
                    .addListener(dist.STORY_RENDERED, name => {
                        name.toLowerCase().startsWith("text-field") &&
                            (function setFormCallback() {
                                document.querySelectorAll(".form").forEach(el => {
                                    el instanceof HTMLFormElement &&
                                        (el.onsubmit = event => {
                                            console.log(event, "event"),
                                                event.preventDefault();
                                            const form = document.forms.myForm;
                                            console.log(
                                                form.elements.fname.value,
                                                "value of input"
                                            );
                                        });
                                });
                            })();
                    });
            __webpack_exports__.default = { title: "Text Field" };
            const text_field_stories_TextField = () => text_field_default.a;
        },
        615: function(module, __webpack_exports__, __webpack_require__) {
            "use strict";
            __webpack_require__.r(__webpack_exports__);
            var fast_element = __webpack_require__(79),
                base_progress = __webpack_require__(137),
                template = __webpack_require__(631),
                when = __webpack_require__(624);
            const ProgressRingTemplate = template.a`
    <template
        role="progressbar"
        aria-valuenow="${x => x.value}"
        aria-valuemin="${x => x.min}"
        aria-valuemax="${x => x.max}"
    >
        ${Object(when.a)(
            x => x.value,
            template.a`
            <svg class="progress" part="progress" viewBox="0 0 16 16" slot="determinate">
                <circle class="background" part="background" cx="8px" cy="8px" r="7px"></circle>
                <circle class="determinate" part="determinate" style="stroke-dasharray: ${x =>
                    (44 * x.value) / 100}px 44px" cx="8px" cy="8px" r="7px"></circle>
            </svg>
        `
        )}
        ${Object(when.a)(
            x => !x.value,
            template.a`
            <slot name="indeterminate" slot="indeterminate">
                <svg class="progress" part="progress" viewBox="0 0 16 16">
                    <circle class="background" part="background" cx="8px" cy="8px" r="7px"></circle>
                    <circle class="indeterminate-indicator-1" part="indeterminate-indicator-1" cx="8px" cy="8px" r="7px"></circle>
                </svg>
            </slot>
           
        `
        )}
    </template>
`;
            var styles = __webpack_require__(621),
                display = __webpack_require__(622),
                system_colors = __webpack_require__(1);
            const ProgressRingStyles = styles.a`
    ${Object(display.a)("flex")} :host {
        align-items: center;
        outline: none;
        height: calc(var(--height-number) * 1px);
        width: calc(var(--height-number) * 1px);
        margin: calc(var(--design-unit) * 1px) 0;
    }

    .progress {
        height: 100%;
        width: 100%;
    }

    .background {
        stroke: var(--neutral-fill-rest);
        fill: none;
        stroke-width: 2px;
    }

    .determinate {
        stroke: var(--accent-fill-rest);
        fill: none;
        stroke-width: 2px;
        stroke-linecap: round;
        transform-origin: 50% 50%;
        transform: rotate(-90deg);
        transition: all 0.2s ease-in-out;
    }

    .indeterminate-indicator-1 {
        stroke: var(--accent-fill-rest);
        fill: none;
        stroke-width: 2px;
        stroke-linecap: round;
        transform-origin: 50% 50%;
        transform: rotate(-90deg);
        transition: all 0.2s ease-in-out;
        animation: spin-infinite 2s linear infinite;
    }

    :host(.paused) .indeterminate-indicator-1 {
        animation-play-state: paused;
        stroke: var(--neutral-fill-rest);
    }

    :host(.paused) .determinate {
        stroke: var(--neutral-foreground-hint);
    }

    @media (forced-colors: active) {
        .indeterminate-indicator-1,
        .determinate {
            stroke: ${system_colors.a.FieldText};
        }

        .background {
            stroke: ${system_colors.a.Field};
        }

        :host(.paused) .indeterminate-indicator-1 {
            stroke: ${system_colors.a.Field};
        }

        :host(.paused) .determinate {
            stroke: ${system_colors.a.GrayText};
        }
    }

    @keyframes spin-infinite {
        0% {
            stroke-dasharray: 0.01px 43.97px;
            transform: rotate(0deg);
        }
        50% {
            stroke-dasharray: 21.99px 21.99px;
            transform: rotate(450deg);
        }
        100% {
            stroke-dasharray: 0.01px 43.97px;
            transform: rotate(1080deg);
        }
    }
`;
            let progress_ring_FASTProgressRing = class FASTProgressRing extends base_progress.a {};
            progress_ring_FASTProgressRing = (function(decorators, target, key, desc) {
                var d,
                    c = arguments.length,
                    r =
                        c < 3
                            ? target
                            : null === desc
                                ? (desc = Object.getOwnPropertyDescriptor(target, key))
                                : desc;
                if ("object" == typeof Reflect && "function" == typeof Reflect.decorate)
                    r = Reflect.decorate(decorators, target, key, desc);
                else
                    for (var i = decorators.length - 1; i >= 0; i--)
                        (d = decorators[i]) &&
                            (r =
                                (c < 3
                                    ? d(r)
                                    : c > 3
                                        ? d(target, key, r)
                                        : d(target, key)) || r);
                return c > 3 && r && Object.defineProperty(target, key, r), r;
            })(
                [
                    Object(fast_element.b)({
                        name: "fast-progress-ring",
                        template: ProgressRingTemplate,
                        styles: ProgressRingStyles,
                    }),
                ],
                progress_ring_FASTProgressRing
            );
            var design_system_provider = __webpack_require__(10),
                circular = __webpack_require__(292),
                circular_default = __webpack_require__.n(circular);
            __webpack_require__.d(__webpack_exports__, "Base", function() {
                return Base;
            }),
                design_system_provider.a;
            __webpack_exports__.default = { title: "Progress Ring" };
            const Base = () => circular_default.a;
        },
        616: function(module, __webpack_exports__, __webpack_require__) {
            "use strict";
            __webpack_require__.r(__webpack_exports__);
            var fast_element = __webpack_require__(79),
                base_progress = __webpack_require__(137),
                template = __webpack_require__(631),
                when = __webpack_require__(624);
            const ProgressTemplate = template.a`
    <template
        role="progressbar"
        aria-valuenow="${x => x.value}"
        aria-valuemin="${x => x.min}"
        aria-valuemax="${x => x.max}"
    >
        ${Object(when.a)(
            x => x.value,
            template.a`
            <div class="progress" part="progress" slot="determinate">
                <div class="determinate" part="determinate" style="width: ${x =>
                    x.value}%"></div>
            </div>
        `
        )}
        ${Object(when.a)(
            x => !x.value,
            template.a`
            <div class="progress" part="progress" slot="indeterminate">
                <slot class="indeterminate" name="indeterminate">
                    <span class="indeterminate-indicator-1" part="indeterminate-indicator-1"></span>
                    <span class="indeterminate-indicator-2" part="indeterminate-indicator-2"></span>
                </slot>
            </div>
        `
        )}
    </template>
`;
            var styles = __webpack_require__(621),
                display = __webpack_require__(622),
                system_colors = __webpack_require__(1);
            const ProgressStyles = styles.a`
    ${Object(display.a)("flex")} :host {
        align-items: center;
        outline: none;
        height: calc(var(--design-unit) * 1px);
        margin: calc(var(--design-unit) * 1px) 0;
    }

    .progress {
        background-color: var(--neutral-fill-rest);
        border-radius: calc(var(--design-unit) * 1px);
        width: 100%;
        height: 100%;
        display: flex;
        align-items: center;
        position: relative;
    }

    .determinate {
        background-color: var(--accent-fill-rest);
        border-radius: calc(var(--design-unit) * 1px);
        height: 100%;
        transition: all 0.2s ease-in-out;
        display: flex;
    }

    .indeterminate {
        height: 100%;
        border-radius: calc(var(--design-unit) * 1px);
        display: flex;
        width: 100%;
        position: relative;
        overflow: hidden;
    }

    .indeterminate-indicator-1 {
        position: absolute;
        opacity: 0;
        height: 100%;
        background-color: var(--accent-fill-rest);
        border-radius: calc(var(--design-unit) * 1px);
        animation-timing-function: cubic-bezier(0.4, 0.0, 0.6, 1.0);
        width: 40%;
        animation: indeterminate-1 2s infinite;
    }

    .indeterminate-indicator-2 {
        position: absolute;
        opacity: 0;
        height: 100%;
        background-color: var(--accent-fill-rest);
        border-radius: calc(var(--design-unit) * 1px);
        animation-timing-function: cubic-bezier(0.4, 0.0, 0.6, 1.0);
        width: 60%;
        animation: indeterminate-2 2s infinite;
    }

    :host(.paused) .indeterminate-indicator-1, :host(.paused) .indeterminate-indicator-2 {
        animation-play-state: paused;
        background-color: var(--neutral-fill-rest);
    }

    :host(.paused) .determinate {
        background-color: var(--neutral-foreground-hint);
    }

    @media (forced-colors: active) {
        .indeterminate-indicator-1, .indeterminate-indicator-2, .determinate  {
            forced-color-adjust: none;
            background-color: ${system_colors.a.FieldText};
        }

        .progress {
            background-color: ${system_colors.a.Field};
            border: calc(var(--outline-width) * 1px) solid ${system_colors.a.FieldText};
        }

        :host(.paused) .indeterminate-indicator-1, .indeterminate-indicator-2 {
            background-color: ${system_colors.a.Field};
        }

        :host(.paused) .determinate {
            background-color: ${system_colors.a.GrayText};
        }
    }

    @keyframes indeterminate-1 {
        0% {
            opacity: 1;
            transform: translateX(-100%);
        }
        70% {
            opacity: 1;
            transform: translateX(300%);
        }
        70.01% {
            opacity: 0;
        }
        100% {
            opacity: 0;
            transform: translateX(300%);
        },
    }

    @keyframes indeterminate-2 {
        0% {
            opacity: 0;
            transform: translateX(-150%);
        }
        29.99% {
            opacity: 0;
        }
        30% {
            opacity: 1;
            transform: translateX(-150%);
        }
        100% {
            transform: translateX(166.66%);
            opacity: 1;
        },
    },
`;
            let progress_FASTProgress = class FASTProgress extends base_progress.a {};
            progress_FASTProgress = (function(decorators, target, key, desc) {
                var d,
                    c = arguments.length,
                    r =
                        c < 3
                            ? target
                            : null === desc
                                ? (desc = Object.getOwnPropertyDescriptor(target, key))
                                : desc;
                if ("object" == typeof Reflect && "function" == typeof Reflect.decorate)
                    r = Reflect.decorate(decorators, target, key, desc);
                else
                    for (var i = decorators.length - 1; i >= 0; i--)
                        (d = decorators[i]) &&
                            (r =
                                (c < 3
                                    ? d(r)
                                    : c > 3
                                        ? d(target, key, r)
                                        : d(target, key)) || r);
                return c > 3 && r && Object.defineProperty(target, key, r), r;
            })(
                [
                    Object(fast_element.b)({
                        name: "fast-progress",
                        template: ProgressTemplate,
                        styles: ProgressStyles,
                    }),
                ],
                progress_FASTProgress
            );
            var design_system_provider = __webpack_require__(10),
                linear = __webpack_require__(293),
                linear_default = __webpack_require__.n(linear);
            __webpack_require__.d(__webpack_exports__, "Base", function() {
                return Base;
            }),
                design_system_provider.a;
            __webpack_exports__.default = { title: "Progress" };
            const Base = () => linear_default.a;
        },
        618: function(module, __webpack_exports__, __webpack_require__) {
            "use strict";
            var KeyCodes;
            __webpack_require__.d(__webpack_exports__, "a", function() {
                return keyCodeEnter;
            }),
                __webpack_require__.d(__webpack_exports__, "b", function() {
                    return keyCodeEscape;
                }),
                __webpack_require__.d(__webpack_exports__, "c", function() {
                    return keyCodeSpace;
                }),
                __webpack_require__.d(__webpack_exports__, "d", function() {
                    return keyCodeTab;
                }),
                (function(KeyCodes) {
                    (KeyCodes[(KeyCodes.alt = 18)] = "alt"),
                        (KeyCodes[(KeyCodes.arrowDown = 40)] = "arrowDown"),
                        (KeyCodes[(KeyCodes.arrowLeft = 37)] = "arrowLeft"),
                        (KeyCodes[(KeyCodes.arrowRight = 39)] = "arrowRight"),
                        (KeyCodes[(KeyCodes.arrowUp = 38)] = "arrowUp"),
                        (KeyCodes[(KeyCodes.back = 8)] = "back"),
                        (KeyCodes[(KeyCodes.backSlash = 220)] = "backSlash"),
                        (KeyCodes[(KeyCodes.break = 19)] = "break"),
                        (KeyCodes[(KeyCodes.capsLock = 20)] = "capsLock"),
                        (KeyCodes[(KeyCodes.closeBracket = 221)] = "closeBracket"),
                        (KeyCodes[(KeyCodes.colon = 186)] = "colon"),
                        (KeyCodes[(KeyCodes.colon2 = 59)] = "colon2"),
                        (KeyCodes[(KeyCodes.comma = 188)] = "comma"),
                        (KeyCodes[(KeyCodes.ctrl = 17)] = "ctrl"),
                        (KeyCodes[(KeyCodes.delete = 46)] = "delete"),
                        (KeyCodes[(KeyCodes.end = 35)] = "end"),
                        (KeyCodes[(KeyCodes.enter = 13)] = "enter"),
                        (KeyCodes[(KeyCodes.equals = 187)] = "equals"),
                        (KeyCodes[(KeyCodes.equals2 = 61)] = "equals2"),
                        (KeyCodes[(KeyCodes.equals3 = 107)] = "equals3"),
                        (KeyCodes[(KeyCodes.escape = 27)] = "escape"),
                        (KeyCodes[(KeyCodes.forwardSlash = 191)] = "forwardSlash"),
                        (KeyCodes[(KeyCodes.function1 = 112)] = "function1"),
                        (KeyCodes[(KeyCodes.function10 = 121)] = "function10"),
                        (KeyCodes[(KeyCodes.function11 = 122)] = "function11"),
                        (KeyCodes[(KeyCodes.function12 = 123)] = "function12"),
                        (KeyCodes[(KeyCodes.function2 = 113)] = "function2"),
                        (KeyCodes[(KeyCodes.function3 = 114)] = "function3"),
                        (KeyCodes[(KeyCodes.function4 = 115)] = "function4"),
                        (KeyCodes[(KeyCodes.function5 = 116)] = "function5"),
                        (KeyCodes[(KeyCodes.function6 = 117)] = "function6"),
                        (KeyCodes[(KeyCodes.function7 = 118)] = "function7"),
                        (KeyCodes[(KeyCodes.function8 = 119)] = "function8"),
                        (KeyCodes[(KeyCodes.function9 = 120)] = "function9"),
                        (KeyCodes[(KeyCodes.home = 36)] = "home"),
                        (KeyCodes[(KeyCodes.insert = 45)] = "insert"),
                        (KeyCodes[(KeyCodes.menu = 93)] = "menu"),
                        (KeyCodes[(KeyCodes.minus = 189)] = "minus"),
                        (KeyCodes[(KeyCodes.minus2 = 109)] = "minus2"),
                        (KeyCodes[(KeyCodes.numLock = 144)] = "numLock"),
                        (KeyCodes[(KeyCodes.numPad0 = 96)] = "numPad0"),
                        (KeyCodes[(KeyCodes.numPad1 = 97)] = "numPad1"),
                        (KeyCodes[(KeyCodes.numPad2 = 98)] = "numPad2"),
                        (KeyCodes[(KeyCodes.numPad3 = 99)] = "numPad3"),
                        (KeyCodes[(KeyCodes.numPad4 = 100)] = "numPad4"),
                        (KeyCodes[(KeyCodes.numPad5 = 101)] = "numPad5"),
                        (KeyCodes[(KeyCodes.numPad6 = 102)] = "numPad6"),
                        (KeyCodes[(KeyCodes.numPad7 = 103)] = "numPad7"),
                        (KeyCodes[(KeyCodes.numPad8 = 104)] = "numPad8"),
                        (KeyCodes[(KeyCodes.numPad9 = 105)] = "numPad9"),
                        (KeyCodes[(KeyCodes.numPadDivide = 111)] = "numPadDivide"),
                        (KeyCodes[(KeyCodes.numPadDot = 110)] = "numPadDot"),
                        (KeyCodes[(KeyCodes.numPadMinus = 109)] = "numPadMinus"),
                        (KeyCodes[(KeyCodes.numPadMultiply = 106)] = "numPadMultiply"),
                        (KeyCodes[(KeyCodes.numPadPlus = 107)] = "numPadPlus"),
                        (KeyCodes[(KeyCodes.openBracket = 219)] = "openBracket"),
                        (KeyCodes[(KeyCodes.pageDown = 34)] = "pageDown"),
                        (KeyCodes[(KeyCodes.pageUp = 33)] = "pageUp"),
                        (KeyCodes[(KeyCodes.period = 190)] = "period"),
                        (KeyCodes[(KeyCodes.print = 44)] = "print"),
                        (KeyCodes[(KeyCodes.quote = 222)] = "quote"),
                        (KeyCodes[(KeyCodes.scrollLock = 145)] = "scrollLock"),
                        (KeyCodes[(KeyCodes.shift = 16)] = "shift"),
                        (KeyCodes[(KeyCodes.space = 32)] = "space"),
                        (KeyCodes[(KeyCodes.tab = 9)] = "tab"),
                        (KeyCodes[(KeyCodes.tilde = 192)] = "tilde"),
                        (KeyCodes[(KeyCodes.windowsLeft = 91)] = "windowsLeft"),
                        (KeyCodes[(KeyCodes.windowsOpera = 219)] = "windowsOpera"),
                        (KeyCodes[(KeyCodes.windowsRight = 92)] = "windowsRight");
                })(KeyCodes || (KeyCodes = {}));
            const keyCodeEnter = 13,
                keyCodeEscape = 27,
                keyCodeSpace = 32,
                keyCodeTab = 9;
        },
        621: function(module, __webpack_exports__, __webpack_require__) {
            "use strict";
            __webpack_require__.d(__webpack_exports__, "a", function() {
                return css;
            });
            const elementStylesBrand = Symbol();
            function isElementStyles(object) {
                return object.brand === elementStylesBrand;
            }
            function reduceStyles(styles) {
                return styles
                    .map(x => (isElementStyles(x) ? reduceStyles(x.styles) : [x]))
                    .reduce((prev, curr) => prev.concat(curr), []);
            }
            class AdoptedStyleSheetsStyles {
                constructor(styles, styleSheetCache) {
                    (this.styles = styles),
                        (this.brand = elementStylesBrand),
                        (this.styleSheets = reduceStyles(styles).map(x => {
                            let sheet = styleSheetCache.get(x);
                            return (
                                void 0 === sheet &&
                                    ((sheet = new CSSStyleSheet()),
                                    sheet.replaceSync(x),
                                    styleSheetCache.set(x, sheet)),
                                sheet
                            );
                        }));
                }
                applyTo(shadowRoot) {
                    shadowRoot.adoptedStyleSheets = [
                        ...shadowRoot.adoptedStyleSheets,
                        ...this.styleSheets,
                    ];
                }
            }
            class StyleElementStyles {
                constructor(styles) {
                    (this.styles = styles),
                        (this.brand = elementStylesBrand),
                        (this.styleSheets = reduceStyles(styles));
                }
                applyTo(shadowRoot) {
                    const styleSheets = this.styleSheets;
                    for (let i = styleSheets.length - 1; i > -1; --i) {
                        const element = document.createElement("style");
                        (element.innerHTML = styleSheets[i]), shadowRoot.prepend(element);
                    }
                }
            }
            const createStyles = (() => {
                if ("adoptedStyleSheets" in window.ShadowRoot.prototype) {
                    const styleSheetCache = new Map();
                    return styles =>
                        new AdoptedStyleSheetsStyles(styles, styleSheetCache);
                }
                return styles => new StyleElementStyles(styles);
            })();
            function css(strings, ...values) {
                const styles = [];
                let cssString = "";
                for (let i = 0, ii = strings.length - 1; i < ii; ++i) {
                    cssString += strings[i];
                    const value = values[i];
                    isElementStyles(value) ? styles.push(value) : (cssString += value);
                }
                return (
                    (cssString += strings[strings.length - 1]),
                    styles.push(cssString),
                    createStyles(styles)
                );
            }
        },
        622: function(module, __webpack_exports__, __webpack_require__) {
            "use strict";
            __webpack_require__.d(__webpack_exports__, "a", function() {
                return display;
            });
            function display(displayValue) {
                return `\n        \n    :host([hidden]) {\n        display: none;\n    }\n :host {\n            display: ${displayValue};\n        }\n    `;
            }
        },
        624: function(module, __webpack_exports__, __webpack_require__) {
            "use strict";
            __webpack_require__.d(__webpack_exports__, "a", function() {
                return when;
            });
            var _dom__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(14),
                _observation_observable__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(
                    38
                ),
                _directive__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(49);
            class WhenDirective extends _directive__WEBPACK_IMPORTED_MODULE_2__.b {
                constructor(expression, template) {
                    super(),
                        (this.expression = expression),
                        (this.template = template),
                        (this.createPlaceholder =
                            _dom__WEBPACK_IMPORTED_MODULE_0__.a.createBlockPlaceholder);
                }
                createBehavior(target) {
                    return new WhenBehavior(target, this.expression, this.template);
                }
            }
            class WhenBehavior {
                constructor(location, expression, template) {
                    (this.location = location),
                        (this.expression = expression),
                        (this.template = template),
                        (this.view = null);
                }
                bind(source) {
                    (this.source = source),
                        this.updateTarget(
                            Object(
                                _observation_observable__WEBPACK_IMPORTED_MODULE_1__.b
                            )(this.expression, source, null, this)
                        );
                }
                unbind() {
                    null !== this.view && this.view.unbind(), (this.source = null);
                }
                inspect(source, propertyName) {
                    _observation_observable__WEBPACK_IMPORTED_MODULE_1__.a
                        .getNotifier(source)
                        .subscribe(this, propertyName);
                }
                handleChange(source, propertyName) {
                    _dom__WEBPACK_IMPORTED_MODULE_0__.a.queueUpdate(this);
                }
                call() {
                    this.updateTarget(this.expression(this.source, null));
                }
                updateTarget(show) {
                    show && null == this.view
                        ? ((this.view =
                              this.cachedView ||
                              (this.cachedView = this.template.create())),
                          this.view.bind(this.source),
                          this.view.insertBefore(this.location))
                        : show ||
                          null === this.view ||
                          (this.view.remove(), this.view.unbind(), (this.view = null));
                }
            }
            function when(expression, template) {
                return new WhenDirective(expression, template);
            }
        },
        627: function(module, __webpack_exports__, __webpack_require__) {
            "use strict";
            __webpack_require__.d(__webpack_exports__, "a", function() {
                return disabledCursor;
            });
            const disabledCursor = "not-allowed";
        },
        628: function(module, __webpack_exports__, __webpack_require__) {
            "use strict";
            __webpack_require__.d(__webpack_exports__, "a", function() {
                return ref;
            });
            var _directive__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(49);
            class RefBehavior {
                constructor(target, propertyName) {
                    (this.target = target), (this.propertyName = propertyName);
                }
                bind(source) {
                    source[this.propertyName] = this.target;
                }
                unbind() {}
            }
            function ref(propertyName) {
                return new _directive__WEBPACK_IMPORTED_MODULE_0__.a(
                    "ref",
                    RefBehavior,
                    propertyName
                );
            }
        },
        631: function(module, __webpack_exports__, __webpack_require__) {
            "use strict";
            var dom = __webpack_require__(14),
                directives_directive = __webpack_require__(49),
                observable = __webpack_require__(38);
            function normalBind(source) {
                (this.source = source),
                    this.updateTarget(
                        Object(observable.b)(this.expression, source, context, this)
                    );
            }
            function triggerBind(source) {
                (this.source = source),
                    this.target.addEventListener(this.targetName, this, !0);
            }
            function normalUnbind() {
                null !== this.record && this.record.unsubscribe(this),
                    (this.source = null);
            }
            function triggerUnbind() {
                this.target.removeEventListener(this.targetName, this, !0),
                    (this.source = null);
            }
            function updateAttributeTarget(value) {
                null == value
                    ? this.target.removeAttribute(this.targetName)
                    : this.target.setAttribute(this.targetName, value);
            }
            function updateBooleanAttributeTarget(value) {
                value
                    ? this.target.setAttribute(this.targetName, "")
                    : this.target.removeAttribute(this.targetName);
            }
            function updateTextTarget(value) {
                this.target.textContent = value;
            }
            function updatePropertyTarget(value) {
                this.target[this.targetName] = value;
            }
            class binding_BindingDirective extends directives_directive.b {
                constructor(expression) {
                    super(),
                        (this.expression = expression),
                        (this.createPlaceholder = dom.a.createInterpolationPlaceholder),
                        (this.bind = normalBind),
                        (this.unbind = normalUnbind),
                        (this.updateTarget = updateAttributeTarget);
                }
                get targetName() {
                    return this._targetName;
                }
                set targetName(value) {
                    if (((this._targetName = value), void 0 !== value))
                        switch (value[0]) {
                            case ":":
                                if (
                                    ((this._cleanedTargetName = value.substr(1)),
                                    (this.updateTarget = updatePropertyTarget),
                                    "innerHTML" === this._cleanedTargetName)
                                ) {
                                    const expression = this.expression;
                                    this.expression = (s, c) =>
                                        dom.a.createHTML(expression(s, c));
                                }
                                break;
                            case "?":
                                (this._cleanedTargetName = value.substr(1)),
                                    (this.updateTarget = updateBooleanAttributeTarget);
                                break;
                            case "@":
                                (this._cleanedTargetName = value.substr(1)),
                                    (this.bind = triggerBind),
                                    (this.unbind = triggerUnbind);
                                break;
                            default:
                                "class" === value
                                    ? ((this._cleanedTargetName = "className"),
                                      (this.updateTarget = updatePropertyTarget))
                                    : (this._cleanedTargetName = value);
                        }
                }
                makeIntoTextBinding() {
                    this.updateTarget = updateTextTarget;
                }
                createBehavior(target) {
                    return new binding_BindingBehavior(
                        target,
                        this.expression,
                        this.bind,
                        this.unbind,
                        this.updateTarget,
                        this._cleanedTargetName
                    );
                }
            }
            class binding_ObservationRecord {
                constructor(source, propertyName) {
                    (this.source = source), (this.propertyName = propertyName);
                }
                subscribe(subscriber) {
                    observable.a
                        .getNotifier(this.source)
                        .subscribe(subscriber, this.propertyName);
                }
                unsubscribe(subscriber) {
                    observable.a
                        .getNotifier(this.source)
                        .unsubscribe(subscriber, this.propertyName);
                }
            }
            const context = {};
            class binding_BindingBehavior {
                constructor(target, expression, bind, unbind, updateTarget, targetName) {
                    (this.target = target),
                        (this.expression = expression),
                        (this.bind = bind),
                        (this.unbind = unbind),
                        (this.updateTarget = updateTarget),
                        (this.targetName = targetName),
                        (this.record = null),
                        (this.needsQueue = !0);
                }
                handleChange(source, propertyName) {
                    this.needsQueue && ((this.needsQueue = !1), dom.a.queueUpdate(this));
                }
                handleEvent(event) {
                    const context = { event: event };
                    !0 !== this.expression(this.source, context) &&
                        event.preventDefault();
                }
                call() {
                    (this.needsQueue = !0),
                        this.updateTarget(this.expression(this.source, context));
                }
                inspect(source, propertyName) {
                    null !== this.record && this.record.unsubscribe(this),
                        (this.record = new binding_ObservationRecord(
                            source,
                            propertyName
                        )),
                        this.record.subscribe(this);
                }
            }
            const compilationContext = { locatedDirectives: 0, targetIndex: -1 };
            function compileAttributes(
                node,
                directives,
                factories,
                includeBasicValues = !1
            ) {
                const attributes = node.attributes;
                for (let i = 0, ii = attributes.length; i < ii; ++i) {
                    const attr = attributes[i],
                        attrValue = attr.value;
                    let directive = tryParsePlaceholders(attrValue, directives);
                    null === directive &&
                        includeBasicValues &&
                        ((directive = new binding_BindingDirective(x => attrValue)),
                        (directive.targetName = attr.name)),
                        null !== directive &&
                            (node.removeAttributeNode(attr),
                            i--,
                            ii--,
                            (directive.targetIndex = compilationContext.targetIndex),
                            factories.push(directive));
                }
            }
            function tryParsePlaceholders(value, directives) {
                let char,
                    interpolationStart,
                    parts,
                    targetName,
                    i = value.indexOf("@{", 0),
                    ii = value.length,
                    pos = 0,
                    open = 0,
                    quote = null,
                    partIndex = 0;
                for (; i >= 0 && i < ii - 2; ) {
                    (open = 1), (interpolationStart = i), (i += 2);
                    do {
                        (char = value[i]),
                            i++,
                            "'" !== char && '"' !== char
                                ? "\\" !== char
                                    ? null === quote &&
                                      ("{" === char ? open++ : "}" === char && open--)
                                    : i++
                                : null === quote
                                    ? (quote = char)
                                    : quote === char && (quote = null);
                    } while (open > 0 && i < ii);
                    if (0 !== open) break;
                    if (
                        ((parts = parts || []),
                        "\\" === value[interpolationStart - 1] &&
                            "\\" !== value[interpolationStart - 2])
                    )
                        (parts[partIndex] =
                            value.substring(pos, interpolationStart - 1) +
                            value.substring(interpolationStart, i)),
                            partIndex++;
                    else {
                        (parts[partIndex] = value.substring(pos, interpolationStart)),
                            partIndex++;
                        let directive =
                            directives[
                                parseInt(value.substring(interpolationStart + 2, i - 1))
                            ];
                        (parts[partIndex] = directive), partIndex++;
                    }
                    (pos = i), (i = value.indexOf("@{", i));
                }
                if (0 === partIndex) return null;
                if (
                    ((parts[partIndex] = value.substr(pos)),
                    (parts = parts.filter(x => "" !== x)),
                    1 == parts.length)
                )
                    return compilationContext.locatedDirectives++, parts[0];
                const partCount = parts.length,
                    finalParts = parts.map(
                        x =>
                            "string" == typeof x
                                ? () => x
                                : ((targetName = x.targetName || targetName),
                                  compilationContext.locatedDirectives++,
                                  x.expression)
                    ),
                    binding = new binding_BindingDirective((scope, context) => {
                        let output = "";
                        for (let i = 0; i < partCount; ++i)
                            output += finalParts[i](scope, context);
                        return output;
                    });
                return (binding.targetName = targetName), binding;
            }
            const range = document.createRange();
            class HTMLView {
                constructor(fragment, behaviors) {
                    (this.fragment = fragment),
                        (this.behaviors = behaviors),
                        (this.source = void 0),
                        (this.firstChild = fragment.firstChild),
                        (this.lastChild = fragment.lastChild);
                }
                appendTo(node) {
                    node.appendChild(this.fragment);
                }
                insertBefore(node) {
                    if (this.fragment.hasChildNodes())
                        node.parentNode.insertBefore(this.fragment, node);
                    else {
                        let parentNode = node.parentNode;
                        const end = this.lastChild;
                        let next,
                            current = this.firstChild;
                        for (; current !== end; )
                            (next = current.nextSibling),
                                parentNode.insertBefore(current, node),
                                (current = next);
                        parentNode.insertBefore(end, node);
                    }
                }
                remove() {
                    range.setStart(this.firstChild, 0),
                        range.setEnd(this.lastChild, 0),
                        (this.fragment = range.extractContents()),
                        (this.firstChild = this.fragment.firstChild),
                        (this.lastChild = this.fragment.lastChild);
                }
                dispose() {
                    range.setStart(this.firstChild, 0),
                        range.setEnd(this.lastChild, 0),
                        range.deleteContents();
                    const behaviors = this.behaviors;
                    for (let i = 0, ii = behaviors.length; i < ii; ++i)
                        behaviors[i].unbind();
                }
                bind(source) {
                    if (this.source === source) return;
                    void 0 !== this.source && this.unbind();
                    const behaviors = this.behaviors;
                    for (let i = 0, ii = behaviors.length; i < ii; ++i)
                        behaviors[i].bind(source);
                }
                unbind() {
                    if (void 0 === this.source) return;
                    const behaviors = this.behaviors;
                    for (let i = 0, ii = behaviors.length; i < ii; ++i)
                        behaviors[i].unbind();
                    this.source = void 0;
                }
                static disposeContiguousBatch(views) {
                    if (0 !== views.length) {
                        range.setStart(views[0].firstChild, 0),
                            range.setEnd(views[views.length - 1].lastChild, 0),
                            range.deleteContents();
                        for (let i = 0, ii = views.length; i < ii; ++i) {
                            const behaviors = views[i].behaviors;
                            for (let j = 0, jj = behaviors.length; j < jj; ++j)
                                behaviors[j].unbind();
                        }
                    }
                }
            }
            __webpack_require__.d(__webpack_exports__, "a", function() {
                return template_html;
            });
            class template_ViewTemplate extends directives_directive.b {
                constructor(html, directives) {
                    super(),
                        (this.html = html),
                        (this.directives = directives),
                        (this.createPlaceholder = dom.a.createBlockPlaceholder),
                        (this.behaviorCount = 0),
                        (this.hasHostBehaviors = !1),
                        (this.fragment = null),
                        (this.targetOffset = 0),
                        (this.viewBehaviorFactories = null),
                        (this.hostBehaviorFactories = null);
                }
                create(host) {
                    if (null === this.fragment) {
                        let template;
                        const html = this.html;
                        if ("string" == typeof html) {
                            (template = document.createElement("template")),
                                (template.innerHTML = dom.a.createHTML(html));
                            const fec = template.content.firstElementChild;
                            null !== fec &&
                                "TEMPLATE" === fec.tagName &&
                                (template = fec);
                        } else template = html;
                        const result = (function compileTemplate(template, directives) {
                            const hostBehaviorFactories = [];
                            (compilationContext.locatedDirectives = 0),
                                compileAttributes(
                                    template,
                                    directives,
                                    hostBehaviorFactories,
                                    !0
                                );
                            const fragment = template.content,
                                viewBehaviorFactories = [],
                                directiveCount = directives.length,
                                walker = document.createTreeWalker(
                                    fragment,
                                    133,
                                    null,
                                    !1
                                );
                            for (
                                compilationContext.targetIndex = -1;
                                compilationContext.locatedDirectives < directiveCount;

                            ) {
                                const node = walker.nextNode();
                                if (null === node) break;
                                switch (
                                    (compilationContext.targetIndex++, node.nodeType)
                                ) {
                                    case 1:
                                        compileAttributes(
                                            node,
                                            directives,
                                            viewBehaviorFactories
                                        );
                                        break;
                                    case 3:
                                        const directive = tryParsePlaceholders(
                                            node.wholeText,
                                            directives
                                        );
                                        if (null !== directive)
                                            for (
                                                node.textContent = " ",
                                                    directive.makeIntoTextBinding(),
                                                    viewBehaviorFactories.push(directive),
                                                    directive.targetIndex =
                                                        compilationContext.targetIndex;
                                                node.nextSibling &&
                                                3 === node.nextSibling.nodeType;

                                            )
                                                node.parentNode.removeChild(
                                                    node.nextSibling
                                                );
                                        break;
                                    case 8:
                                        if (dom.a.isMarker(node)) {
                                            const directive =
                                                directives[
                                                    dom.a.extractDirectiveIndexFromMarker(
                                                        node
                                                    )
                                                ];
                                            (directive.targetIndex =
                                                compilationContext.targetIndex),
                                                compilationContext.locatedDirectives++,
                                                viewBehaviorFactories.push(directive);
                                        } else
                                            node.parentNode.removeChild(node),
                                                compilationContext.targetIndex--;
                                }
                            }
                            let targetOffset = 0;
                            return (
                                dom.a.isMarker(fragment.firstChild) &&
                                    (fragment.insertBefore(
                                        document.createComment(""),
                                        fragment.firstChild
                                    ),
                                    (targetOffset = -1)),
                                {
                                    fragment: fragment,
                                    viewBehaviorFactories: viewBehaviorFactories,
                                    hostBehaviorFactories: hostBehaviorFactories,
                                    targetOffset: targetOffset,
                                }
                            );
                        })(template, this.directives);
                        (this.fragment = result.fragment),
                            (this.viewBehaviorFactories = result.viewBehaviorFactories),
                            (this.hostBehaviorFactories = result.hostBehaviorFactories),
                            (this.targetOffset = result.targetOffset),
                            (this.behaviorCount =
                                this.viewBehaviorFactories.length +
                                this.hostBehaviorFactories.length),
                            (this.hasHostBehaviors =
                                this.hostBehaviorFactories.length > 0);
                    }
                    const fragment = this.fragment.cloneNode(!0),
                        viewFactories = this.viewBehaviorFactories,
                        behaviors = new Array(this.behaviorCount),
                        walker = document.createTreeWalker(fragment, 133, null, !1);
                    let behaviorIndex = 0,
                        targetIndex = this.targetOffset,
                        node = walker.nextNode();
                    for (
                        let ii = viewFactories.length;
                        behaviorIndex < ii;
                        ++behaviorIndex
                    ) {
                        const factory = viewFactories[behaviorIndex],
                            factoryIndex = factory.targetIndex;
                        for (; null !== node; ) {
                            if (targetIndex === factoryIndex) {
                                behaviors[behaviorIndex] = factory.createBehavior(node);
                                break;
                            }
                            (node = walker.nextNode()), targetIndex++;
                        }
                    }
                    if (this.hasHostBehaviors) {
                        const hostFactories = this.hostBehaviorFactories;
                        for (
                            let i = 0, ii = hostFactories.length;
                            i < ii;
                            ++i, ++behaviorIndex
                        )
                            behaviors[behaviorIndex] = hostFactories[i].createBehavior(
                                host
                            );
                    }
                    return new HTMLView(fragment, behaviors);
                }
                createBehavior(target) {
                    return new HTMLTemplateBehavior(this, target);
                }
            }
            class HTMLTemplateBehavior {
                constructor(template, location) {
                    (this.view = template.create()), this.view.insertBefore(location);
                }
                bind(source) {
                    this.view.bind(source);
                }
                unbind() {
                    this.view.unbind();
                }
            }
            function template_html(strings, ...values) {
                const directives = [];
                let html = "";
                for (let i = 0, ii = strings.length - 1; i < ii; ++i) {
                    let currentString = strings[i],
                        value = values[i];
                    if (((html += currentString), "function" == typeof value)) {
                        value = new binding_BindingDirective(value);
                        const match = lastAttributeNameRegex.exec(currentString);
                        null !== match && (value.targetName = match[2]);
                    }
                    value instanceof directives_directive.b
                        ? ((html += value.createPlaceholder(i)), directives.push(value))
                        : (html += value);
                }
                return (
                    (html += strings[strings.length - 1]),
                    new template_ViewTemplate(html, directives)
                );
            }
            const lastAttributeNameRegex = /([ \x09\x0a\x0c\x0d])([^\0-\x1F\x7F-\x9F "'>=/]+)([ \x09\x0a\x0c\x0d]*=[ \x09\x0a\x0c\x0d]*(?:[^ \x09\x0a\x0c\x0d"'`<>=]*|"[^"]*|'[^']*))$/;
        },
        77: function(module, __webpack_exports__, __webpack_require__) {
            "use strict";
            __webpack_require__.d(__webpack_exports__, "a", function() {
                return FormAssociated;
            });
            var _microsoft_fast_element__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(
                    79
                ),
                _microsoft_fast_element__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(
                    180
                ),
                _microsoft_fast_element__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(
                    22
                ),
                _microsoft_fast_web_utilities__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(
                    618
                ),
                __decorate = function(decorators, target, key, desc) {
                    var d,
                        c = arguments.length,
                        r =
                            c < 3
                                ? target
                                : null === desc
                                    ? (desc = Object.getOwnPropertyDescriptor(
                                          target,
                                          key
                                      ))
                                    : desc;
                    if (
                        "object" == typeof Reflect &&
                        "function" == typeof Reflect.decorate
                    )
                        r = Reflect.decorate(decorators, target, key, desc);
                    else
                        for (var i = decorators.length - 1; i >= 0; i--)
                            (d = decorators[i]) &&
                                (r =
                                    (c < 3
                                        ? d(r)
                                        : c > 3
                                            ? d(target, key, r)
                                            : d(target, key)) || r);
                    return c > 3 && r && Object.defineProperty(target, key, r), r;
                };
            const supportsElementInternals = "ElementInternals" in window;
            class FormAssociated extends _microsoft_fast_element__WEBPACK_IMPORTED_MODULE_0__.a {
                constructor() {
                    super(),
                        (this.value = ""),
                        (this.disabled = !1),
                        (this.required = !1),
                        (this.proxyEventsToBlock = ["change", "click"]),
                        supportsElementInternals &&
                            (this.elementInternals = this.attachInternals());
                }
                static get formAssociated() {
                    return supportsElementInternals;
                }
                get validity() {
                    return supportsElementInternals
                        ? this.elementInternals.validity
                        : this.proxy.validity;
                }
                get form() {
                    return supportsElementInternals
                        ? this.elementInternals.form
                        : this.proxy.form;
                }
                get validationMessage() {
                    return supportsElementInternals
                        ? this.elementInternals.validationMessage
                        : this.proxy.validationMessage;
                }
                get willValidate() {
                    return supportsElementInternals
                        ? this.elementInternals.willValidate
                        : this.proxy.willValidate;
                }
                get labels() {
                    if (supportsElementInternals)
                        return Object.freeze(Array.from(this.elementInternals.labels));
                    if (
                        this.proxy instanceof HTMLElement &&
                        this.proxy.ownerDocument &&
                        this.id
                    ) {
                        const parentLabels = this.proxy.labels,
                            forLabels = Array.from(
                                this.proxy
                                    .getRootNode()
                                    .querySelectorAll(`[for='${this.id}']`)
                            ),
                            labels = parentLabels
                                ? forLabels.concat(Array.from(parentLabels))
                                : forLabels;
                        return Object.freeze(labels);
                    }
                    return _microsoft_fast_element__WEBPACK_IMPORTED_MODULE_1__.a;
                }
                disabledChanged() {
                    this.proxy instanceof HTMLElement &&
                        (this.proxy.disabled = this.disabled),
                        this.disabled
                            ? this.classList.add("disabled")
                            : this.classList.remove("disabled");
                }
                nameChanged() {
                    this.proxy instanceof HTMLElement && (this.proxy.name = this.name);
                }
                requiredChanged() {
                    this.proxy instanceof HTMLElement &&
                        (this.proxy.required = this.required),
                        this.required
                            ? this.classList.add("required")
                            : this.classList.remove("required");
                }
                connectedCallback() {
                    super.connectedCallback(),
                        supportsElementInternals ||
                            ((this.proxy.style.display = "none"),
                            this.appendChild(this.proxy),
                            this.proxyEventsToBlock.forEach(name =>
                                this.proxy.addEventListener(name, this.stopPropagation)
                            ),
                            (this.proxy.disabled = this.disabled),
                            (this.proxy.required = this.required),
                            "string" == typeof this.name && (this.proxy.name = this.name),
                            "string" == typeof this.value &&
                                (this.proxy.value = this.value));
                }
                disconnectedCallback() {
                    this.proxyEventsToBlock.forEach(name =>
                        this.proxy.removeEventListener(name, this.stopPropagation)
                    );
                }
                checkValidity() {
                    return supportsElementInternals
                        ? this.elementInternals.checkValidity()
                        : this.proxy.checkValidity();
                }
                reportValidity() {
                    return supportsElementInternals
                        ? this.elementInternals.reportValidity()
                        : this.proxy.reportValidity();
                }
                setValidity(flags, message, anchor) {
                    supportsElementInternals
                        ? this.elementInternals.setValidity(flags, message, anchor)
                        : "string" == typeof message &&
                          this.proxy.setCustomValidity(message);
                }
                formDisabledCallback(disabled) {
                    this.disabled = disabled;
                }
                setFormValue(value, state) {
                    supportsElementInternals &&
                        this.elementInternals.setFormValue(value, state);
                }
                keypressHandler(e) {
                    switch (e.keyCode) {
                        case _microsoft_fast_web_utilities__WEBPACK_IMPORTED_MODULE_3__.a:
                            this.form instanceof HTMLFormElement && this.form.submit();
                    }
                }
                stopPropagation(e) {
                    e.stopPropagation();
                }
            }
            __decorate(
                [_microsoft_fast_element__WEBPACK_IMPORTED_MODULE_2__.b],
                FormAssociated.prototype,
                "value",
                void 0
            ),
                __decorate(
                    [
                        Object(_microsoft_fast_element__WEBPACK_IMPORTED_MODULE_2__.b)({
                            mode: "boolean",
                        }),
                    ],
                    FormAssociated.prototype,
                    "disabled",
                    void 0
                ),
                __decorate(
                    [_microsoft_fast_element__WEBPACK_IMPORTED_MODULE_2__.b],
                    FormAssociated.prototype,
                    "name",
                    void 0
                ),
                __decorate(
                    [
                        Object(_microsoft_fast_element__WEBPACK_IMPORTED_MODULE_2__.b)({
                            mode: "boolean",
                        }),
                    ],
                    FormAssociated.prototype,
                    "required",
                    void 0
                );
        },
        79: function(module, __webpack_exports__, __webpack_require__) {
            "use strict";
            __webpack_require__.d(__webpack_exports__, "a", function() {
                return FastElement;
            }),
                __webpack_require__.d(__webpack_exports__, "b", function() {
                    return customElement;
                });
            var _controller__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(133),
                _interfaces__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(180),
                _attributes__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(22);
            const defaultShadowOptions = { mode: "open" },
                defaultElementOptions = {};
            function createFastElement(BaseType) {
                return class FastElement extends BaseType {
                    constructor() {
                        super(),
                            _controller__WEBPACK_IMPORTED_MODULE_0__.a.forCustomElement(
                                this
                            );
                    }
                    $emit(type, detail, options) {
                        return this.$controller.emit(type, detail, options);
                    }
                    connectedCallback() {
                        this.$controller.onConnectedCallback();
                    }
                    disconnectedCallback() {
                        this.$controller.onDisconnectedCallback();
                    }
                    attributeChangedCallback(name, oldValue, newValue) {
                        this.$controller.onAttributeChangedCallback(
                            name,
                            oldValue,
                            newValue
                        );
                    }
                };
            }
            const fastDefinitions = new Map(),
                FastElement = Object.assign(createFastElement(HTMLElement), {
                    from: BaseType => createFastElement(BaseType),
                    define(Type, nameOrDef = Type.definition) {
                        "string" == typeof nameOrDef && (nameOrDef = { name: nameOrDef });
                        const name = nameOrDef.name,
                            attributes = _attributes__WEBPACK_IMPORTED_MODULE_2__.a.collect(
                                Type,
                                nameOrDef.attributes
                            ),
                            shadowOptions =
                                void 0 === nameOrDef.shadowOptions
                                    ? defaultShadowOptions
                                    : null === nameOrDef.shadowOptions
                                        ? void 0
                                        : Object.assign(
                                              Object.assign({}, defaultShadowOptions),
                                              nameOrDef.shadowOptions
                                          ),
                            elementOptions =
                                void 0 === nameOrDef.elementOptions
                                    ? defaultElementOptions
                                    : Object.assign(
                                          Object.assign({}, defaultElementOptions),
                                          nameOrDef.shadowOptions
                                      ),
                            observedAttributes = new Array(attributes.length),
                            proto = Type.prototype,
                            propertyLookup = {},
                            attributeLookup = {};
                        for (let i = 0, ii = attributes.length; i < ii; ++i) {
                            const current = attributes[i];
                            (observedAttributes[i] = current.attribute),
                                (propertyLookup[current.property] = current),
                                (attributeLookup[current.attribute] = current),
                                Reflect.defineProperty(proto, current.property, {
                                    enumerable: !0,
                                    get: function() {
                                        return current.getValue(this);
                                    },
                                    set: function(value) {
                                        return current.setValue(this, value);
                                    },
                                });
                        }
                        Reflect.defineProperty(Type, "observedAttributes", {
                            value: observedAttributes,
                            enumerable: !0,
                        });
                        const definition = new FastElementDefinition(
                            name,
                            attributes,
                            propertyLookup,
                            attributeLookup,
                            nameOrDef.template,
                            nameOrDef.styles,
                            shadowOptions,
                            elementOptions,
                            nameOrDef.dependencies
                        );
                        return (
                            fastDefinitions.set(Type, definition),
                            customElements.define(name, Type, definition.elementOptions),
                            Type
                        );
                    },
                    getDefinition: Type => fastDefinitions.get(Type),
                });
            class FastElementDefinition {
                constructor(
                    name,
                    attributes,
                    propertyLookup,
                    attributeLookup,
                    template,
                    styles,
                    shadowOptions,
                    elementOptions,
                    dependencies = _interfaces__WEBPACK_IMPORTED_MODULE_1__.a
                ) {
                    (this.name = name),
                        (this.attributes = attributes),
                        (this.propertyLookup = propertyLookup),
                        (this.attributeLookup = attributeLookup),
                        (this.template = template),
                        (this.styles = styles),
                        (this.shadowOptions = shadowOptions),
                        (this.elementOptions = elementOptions),
                        (this.dependencies = dependencies);
                }
            }
            function customElement(nameOrDef) {
                return function(type) {
                    FastElement.define(type, nameOrDef);
                };
            }
        },
    },
    [[300, 1, 2]],
]);
//# sourceMappingURL=main.d47e90f5a413c1201df5.bundle.js.map
