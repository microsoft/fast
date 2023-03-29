/******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ "./src/app/css/style.css":
/*!*******************************!*\
  !*** ./src/app/css/style.css ***!
  \*******************************/
/***/ (() => {

// extracted by mini-css-extract-plugin

/***/ }),

/***/ "./node_modules/tslib/tslib.es6.js":
/*!*****************************************!*\
  !*** ./node_modules/tslib/tslib.es6.js ***!
  \*****************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "__assign": () => (/* binding */ __assign),
/* harmony export */   "__asyncDelegator": () => (/* binding */ __asyncDelegator),
/* harmony export */   "__asyncGenerator": () => (/* binding */ __asyncGenerator),
/* harmony export */   "__asyncValues": () => (/* binding */ __asyncValues),
/* harmony export */   "__await": () => (/* binding */ __await),
/* harmony export */   "__awaiter": () => (/* binding */ __awaiter),
/* harmony export */   "__classPrivateFieldGet": () => (/* binding */ __classPrivateFieldGet),
/* harmony export */   "__classPrivateFieldSet": () => (/* binding */ __classPrivateFieldSet),
/* harmony export */   "__createBinding": () => (/* binding */ __createBinding),
/* harmony export */   "__decorate": () => (/* binding */ __decorate),
/* harmony export */   "__exportStar": () => (/* binding */ __exportStar),
/* harmony export */   "__extends": () => (/* binding */ __extends),
/* harmony export */   "__generator": () => (/* binding */ __generator),
/* harmony export */   "__importDefault": () => (/* binding */ __importDefault),
/* harmony export */   "__importStar": () => (/* binding */ __importStar),
/* harmony export */   "__makeTemplateObject": () => (/* binding */ __makeTemplateObject),
/* harmony export */   "__metadata": () => (/* binding */ __metadata),
/* harmony export */   "__param": () => (/* binding */ __param),
/* harmony export */   "__read": () => (/* binding */ __read),
/* harmony export */   "__rest": () => (/* binding */ __rest),
/* harmony export */   "__spread": () => (/* binding */ __spread),
/* harmony export */   "__spreadArrays": () => (/* binding */ __spreadArrays),
/* harmony export */   "__values": () => (/* binding */ __values)
/* harmony export */ });
/*! *****************************************************************************
Copyright (c) Microsoft Corporation.

Permission to use, copy, modify, and/or distribute this software for any
purpose with or without fee is hereby granted.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
PERFORMANCE OF THIS SOFTWARE.
***************************************************************************** */
/* global Reflect, Promise */

var extendStatics = function(d, b) {
    extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return extendStatics(d, b);
};

function __extends(d, b) {
    extendStatics(d, b);
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
}

var __assign = function() {
    __assign = Object.assign || function __assign(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
        }
        return t;
    }
    return __assign.apply(this, arguments);
}

function __rest(s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
}

function __decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}

function __param(paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
}

function __metadata(metadataKey, metadataValue) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(metadataKey, metadataValue);
}

function __awaiter(thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
}

function __generator(thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
}

function __createBinding(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}

function __exportStar(m, exports) {
    for (var p in m) if (p !== "default" && !exports.hasOwnProperty(p)) exports[p] = m[p];
}

function __values(o) {
    var s = typeof Symbol === "function" && Symbol.iterator, m = s && o[s], i = 0;
    if (m) return m.call(o);
    if (o && typeof o.length === "number") return {
        next: function () {
            if (o && i >= o.length) o = void 0;
            return { value: o && o[i++], done: !o };
        }
    };
    throw new TypeError(s ? "Object is not iterable." : "Symbol.iterator is not defined.");
}

function __read(o, n) {
    var m = typeof Symbol === "function" && o[Symbol.iterator];
    if (!m) return o;
    var i = m.call(o), r, ar = [], e;
    try {
        while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
    }
    catch (error) { e = { error: error }; }
    finally {
        try {
            if (r && !r.done && (m = i["return"])) m.call(i);
        }
        finally { if (e) throw e.error; }
    }
    return ar;
}

function __spread() {
    for (var ar = [], i = 0; i < arguments.length; i++)
        ar = ar.concat(__read(arguments[i]));
    return ar;
}

function __spreadArrays() {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
            r[k] = a[j];
    return r;
};

function __await(v) {
    return this instanceof __await ? (this.v = v, this) : new __await(v);
}

function __asyncGenerator(thisArg, _arguments, generator) {
    if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
    var g = generator.apply(thisArg, _arguments || []), i, q = [];
    return i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i;
    function verb(n) { if (g[n]) i[n] = function (v) { return new Promise(function (a, b) { q.push([n, v, a, b]) > 1 || resume(n, v); }); }; }
    function resume(n, v) { try { step(g[n](v)); } catch (e) { settle(q[0][3], e); } }
    function step(r) { r.value instanceof __await ? Promise.resolve(r.value.v).then(fulfill, reject) : settle(q[0][2], r); }
    function fulfill(value) { resume("next", value); }
    function reject(value) { resume("throw", value); }
    function settle(f, v) { if (f(v), q.shift(), q.length) resume(q[0][0], q[0][1]); }
}

function __asyncDelegator(o) {
    var i, p;
    return i = {}, verb("next"), verb("throw", function (e) { throw e; }), verb("return"), i[Symbol.iterator] = function () { return this; }, i;
    function verb(n, f) { i[n] = o[n] ? function (v) { return (p = !p) ? { value: __await(o[n](v)), done: n === "return" } : f ? f(v) : v; } : f; }
}

function __asyncValues(o) {
    if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
    var m = o[Symbol.asyncIterator], i;
    return m ? m.call(o) : (o = typeof __values === "function" ? __values(o) : o[Symbol.iterator](), i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i);
    function verb(n) { i[n] = o[n] && function (v) { return new Promise(function (resolve, reject) { v = o[n](v), settle(resolve, reject, v.done, v.value); }); }; }
    function settle(resolve, reject, d, v) { Promise.resolve(v).then(function(v) { resolve({ value: v, done: d }); }, reject); }
}

function __makeTemplateObject(cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
};

function __importStar(mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result.default = mod;
    return result;
}

function __importDefault(mod) {
    return (mod && mod.__esModule) ? mod : { default: mod };
}

function __classPrivateFieldGet(receiver, privateMap) {
    if (!privateMap.has(receiver)) {
        throw new TypeError("attempted to get private field on non-instance");
    }
    return privateMap.get(receiver);
}

function __classPrivateFieldSet(receiver, privateMap, value) {
    if (!privateMap.has(receiver)) {
        throw new TypeError("attempted to set private field on non-instance");
    }
    privateMap.set(receiver, value);
    return value;
}


/***/ }),

/***/ "../../node_modules/exenv-es6/dist/can-use-dom.js":
/*!********************************************************!*\
  !*** ../../node_modules/exenv-es6/dist/can-use-dom.js ***!
  \********************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "canUseDOM": () => (/* binding */ canUseDOM)
/* harmony export */ });
/**
 * Checks if the DOM is available to access and use
 */
function canUseDOM() {
    return !!(typeof window !== "undefined" && window.document && window.document.createElement);
}


/***/ }),

/***/ "../../packages/utilities/fast-colors/dist/color-blending.js":
/*!*******************************************************************!*\
  !*** ../../packages/utilities/fast-colors/dist/color-blending.js ***!
  \*******************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "ColorBlendMode": () => (/* binding */ ColorBlendMode),
/* harmony export */   "blend": () => (/* binding */ blend),
/* harmony export */   "blendBurn": () => (/* binding */ blendBurn),
/* harmony export */   "blendBurnChannel": () => (/* binding */ blendBurnChannel),
/* harmony export */   "blendColor": () => (/* binding */ blendColor),
/* harmony export */   "blendDarken": () => (/* binding */ blendDarken),
/* harmony export */   "blendDarkenChannel": () => (/* binding */ blendDarkenChannel),
/* harmony export */   "blendDodge": () => (/* binding */ blendDodge),
/* harmony export */   "blendDodgeChannel": () => (/* binding */ blendDodgeChannel),
/* harmony export */   "blendLighten": () => (/* binding */ blendLighten),
/* harmony export */   "blendLightenChannel": () => (/* binding */ blendLightenChannel),
/* harmony export */   "blendMultiply": () => (/* binding */ blendMultiply),
/* harmony export */   "blendMultiplyChannel": () => (/* binding */ blendMultiplyChannel),
/* harmony export */   "blendOverlay": () => (/* binding */ blendOverlay),
/* harmony export */   "blendOverlayChannel": () => (/* binding */ blendOverlayChannel),
/* harmony export */   "blendScreen": () => (/* binding */ blendScreen),
/* harmony export */   "blendScreenChannel": () => (/* binding */ blendScreenChannel),
/* harmony export */   "computeAlphaBlend": () => (/* binding */ computeAlphaBlend),
/* harmony export */   "darkenViaLAB": () => (/* binding */ darkenViaLAB),
/* harmony export */   "desaturateViaLCH": () => (/* binding */ desaturateViaLCH),
/* harmony export */   "lightenViaLAB": () => (/* binding */ lightenViaLAB),
/* harmony export */   "saturateViaLCH": () => (/* binding */ saturateViaLCH)
/* harmony export */ });
/* harmony import */ var _color_converters_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./color-converters.js */ "../../packages/utilities/fast-colors/dist/color-converters.js");
/* harmony import */ var _color_hsl_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./color-hsl.js */ "../../packages/utilities/fast-colors/dist/color-hsl.js");
/* harmony import */ var _color_lab_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./color-lab.js */ "../../packages/utilities/fast-colors/dist/color-lab.js");
/* harmony import */ var _color_lch_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./color-lch.js */ "../../packages/utilities/fast-colors/dist/color-lch.js");
/* harmony import */ var _color_rgba_64_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./color-rgba-64.js */ "../../packages/utilities/fast-colors/dist/color-rgba-64.js");
/* harmony import */ var _math_utilities_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./math-utilities.js */ "../../packages/utilities/fast-colors/dist/math-utilities.js");






/**
 * Saturate a color using LCH color space
 *
 * @remarks
 * The alpha channel of the input is ignored
 *
 * @public
 */
function saturateViaLCH(input, saturation, saturationConstant = 18) {
    const lch = (0,_color_converters_js__WEBPACK_IMPORTED_MODULE_0__.rgbToLCH)(input);
    let sat = lch.c + saturation * saturationConstant;
    if (sat < 0) {
        sat = 0;
    }
    return (0,_color_converters_js__WEBPACK_IMPORTED_MODULE_0__.lchToRGB)(new _color_lch_js__WEBPACK_IMPORTED_MODULE_1__.ColorLCH(lch.l, sat, lch.h));
}
/**
 * De-saturate a color using LCH color space
 *
 * @remarks
 * The alpha channel of the input is ignored
 *
 * @public
 */
function desaturateViaLCH(input, saturation, saturationConstant = 18) {
    return saturateViaLCH(input, -1 * saturation, saturationConstant);
}
/**
 * Darken a color using LAB color space
 *
 * @remarks
 * The alpha channel of the input is ignored
 *
 * @public
 */
function darkenViaLAB(input, amount, darkenConstant = 18) {
    const lab = (0,_color_converters_js__WEBPACK_IMPORTED_MODULE_0__.rgbToLAB)(input);
    const darkened = lab.l - amount * darkenConstant;
    return (0,_color_converters_js__WEBPACK_IMPORTED_MODULE_0__.labToRGB)(new _color_lab_js__WEBPACK_IMPORTED_MODULE_2__.ColorLAB(darkened, lab.a, lab.b));
}
/**
 * Lighten a color using LAB color space
 *
 * @remarks
 * The alpha channel of the input is ignored
 *
 * @public
 */
function lightenViaLAB(input, amount, darkenConstant = 18) {
    return darkenViaLAB(input, -1 * amount, darkenConstant);
}
/**
 * @public
 */
function blendBurnChannel(bottom, top) {
    if (top === 0.0) {
        // Despite the discontinuity, other sources seem to use 0.0 here instead of 1
        return 0.0;
    }
    return 1.0 - (1.0 - bottom) / top;
}
/**
 * Blends two colors with the burn mode
 *
 * @remarks
 * The alpha channel of the input is ignored
 *
 * @public
 */
function blendBurn(bottom, top) {
    return new _color_rgba_64_js__WEBPACK_IMPORTED_MODULE_3__.ColorRGBA64(blendBurnChannel(bottom.r, top.r), blendBurnChannel(bottom.g, top.g), blendBurnChannel(bottom.b, top.b), 1);
}
/**
 * Blends two colors
 *
 * @remarks
 * The alpha channel of the input is ignored
 *
 * @public
 */
function blendColor(bottom, top) {
    const bottomHSL = (0,_color_converters_js__WEBPACK_IMPORTED_MODULE_0__.rgbToHSL)(bottom);
    const topHSL = (0,_color_converters_js__WEBPACK_IMPORTED_MODULE_0__.rgbToHSL)(top);
    if (topHSL.s === 0) {
        return new _color_rgba_64_js__WEBPACK_IMPORTED_MODULE_3__.ColorRGBA64(bottomHSL.l, bottomHSL.l, bottomHSL.l, 1);
    }
    return (0,_color_converters_js__WEBPACK_IMPORTED_MODULE_0__.hslToRGB)(new _color_hsl_js__WEBPACK_IMPORTED_MODULE_4__.ColorHSL(topHSL.h, topHSL.s, bottomHSL.l));
}
/**
 * @public
 */
function blendDarkenChannel(bottom, top) {
    return Math.min(bottom, top);
}
/**
 * Blends two colors with the darken mode
 *
 * @remarks
 * The alpha channel of the input is ignored
 *
 * @public
 */
function blendDarken(bottom, top) {
    return new _color_rgba_64_js__WEBPACK_IMPORTED_MODULE_3__.ColorRGBA64(blendDarkenChannel(bottom.r, top.r), blendDarkenChannel(bottom.g, top.g), blendDarkenChannel(bottom.b, top.b), 1);
}
/**
 * @public
 */
function blendDodgeChannel(bottom, top) {
    if (top >= 1.0) {
        return 1.0;
    }
    const retVal = bottom / (1.0 - top);
    if (retVal >= 1.0) {
        return 1.0;
    }
    return retVal;
}
/**
 * Blends two colors with the dodge mode
 *
 * @remarks
 * The alpha channel of the input is ignored
 *
 * @public
 */
function blendDodge(bottom, top) {
    return new _color_rgba_64_js__WEBPACK_IMPORTED_MODULE_3__.ColorRGBA64(blendDodgeChannel(bottom.r, top.r), blendDodgeChannel(bottom.g, top.g), blendDodgeChannel(bottom.b, top.b), 1);
}
/**
 * @public
 */
function blendLightenChannel(bottom, top) {
    return Math.max(bottom, top);
}
/**
 * Blends two colors with the lighten mode
 *
 * @remarks
 * The alpha channel of the input is ignored
 *
 * @public
 */
function blendLighten(bottom, top) {
    return new _color_rgba_64_js__WEBPACK_IMPORTED_MODULE_3__.ColorRGBA64(blendLightenChannel(bottom.r, top.r), blendLightenChannel(bottom.g, top.g), blendLightenChannel(bottom.b, top.b), 1);
}
/**
 * @public
 */
function blendMultiplyChannel(bottom, top) {
    return bottom * top;
}
/**
 * Blends two colors with the multiply mode
 *
 * @remarks
 * The alpha channel of the input is ignored
 *
 * @public
 */
function blendMultiply(bottom, top) {
    return new _color_rgba_64_js__WEBPACK_IMPORTED_MODULE_3__.ColorRGBA64(blendMultiplyChannel(bottom.r, top.r), blendMultiplyChannel(bottom.g, top.g), blendMultiplyChannel(bottom.b, top.b), 1);
}
/**
 * @public
 */
function blendOverlayChannel(bottom, top) {
    if (bottom < 0.5) {
        return (0,_math_utilities_js__WEBPACK_IMPORTED_MODULE_5__.clamp)(2.0 * top * bottom, 0, 1);
    }
    return (0,_math_utilities_js__WEBPACK_IMPORTED_MODULE_5__.clamp)(1.0 - 2.0 * (1.0 - top) * (1.0 - bottom), 0, 1);
}
/**
 * Blends two colors with the overlay mode
 *
 * @remarks
 * The alpha channel of the input is ignored
 *
 * @public
 */
function blendOverlay(bottom, top) {
    return new _color_rgba_64_js__WEBPACK_IMPORTED_MODULE_3__.ColorRGBA64(blendOverlayChannel(bottom.r, top.r), blendOverlayChannel(bottom.g, top.g), blendOverlayChannel(bottom.b, top.b), 1);
}
/**
 * @public
 */
function blendScreenChannel(bottom, top) {
    return 1.0 - (1.0 - top) * (1.0 - bottom);
}
/**
 * Blends two colors with the screen mode
 *
 * @remarks
 * The alpha channel of the input is ignored
 *
 * @public
 */
function blendScreen(bottom, top) {
    return new _color_rgba_64_js__WEBPACK_IMPORTED_MODULE_3__.ColorRGBA64(blendScreenChannel(bottom.r, top.r), blendScreenChannel(bottom.g, top.g), blendScreenChannel(bottom.b, top.b), 1);
}
/**
 * Color blend modes.
 * @public
 */
var ColorBlendMode;
(function (ColorBlendMode) {
    ColorBlendMode[ColorBlendMode["Burn"] = 0] = "Burn";
    ColorBlendMode[ColorBlendMode["Color"] = 1] = "Color";
    ColorBlendMode[ColorBlendMode["Darken"] = 2] = "Darken";
    ColorBlendMode[ColorBlendMode["Dodge"] = 3] = "Dodge";
    ColorBlendMode[ColorBlendMode["Lighten"] = 4] = "Lighten";
    ColorBlendMode[ColorBlendMode["Multiply"] = 5] = "Multiply";
    ColorBlendMode[ColorBlendMode["Overlay"] = 6] = "Overlay";
    ColorBlendMode[ColorBlendMode["Screen"] = 7] = "Screen";
})(ColorBlendMode || (ColorBlendMode = {}));
/**
 * Blend two colors.
 *
 * @remarks
 * The alpha channel of the input is ignored
 *
 * @public
 */
function blend(mode, bottom, top) {
    switch (mode) {
        case ColorBlendMode.Burn:
            return blendBurn(bottom, top);
        case ColorBlendMode.Color:
            return blendColor(bottom, top);
        case ColorBlendMode.Darken:
            return blendDarken(bottom, top);
        case ColorBlendMode.Dodge:
            return blendDodge(bottom, top);
        case ColorBlendMode.Lighten:
            return blendLighten(bottom, top);
        case ColorBlendMode.Multiply:
            return blendMultiply(bottom, top);
        case ColorBlendMode.Overlay:
            return blendOverlay(bottom, top);
        case ColorBlendMode.Screen:
            return blendScreen(bottom, top);
        default:
            throw new Error("Unknown blend mode");
    }
}
/**
 * Alpha channel of bottom is ignored
 * The returned color always has an alpha channel of 1
 * Different programs (eg: paint.net, photoshop) will give different answers than this occasionally but within +/- 1/255 in each channel. Just depends on the details of how they round off decimals
 *
 * @public
 */
function computeAlphaBlend(bottom, top) {
    if (top.a >= 1) {
        return top;
    }
    else if (top.a <= 0) {
        return new _color_rgba_64_js__WEBPACK_IMPORTED_MODULE_3__.ColorRGBA64(bottom.r, bottom.g, bottom.b, 1);
    }
    const r = top.a * top.r + (1 - top.a) * bottom.r;
    const g = top.a * top.g + (1 - top.a) * bottom.g;
    const b = top.a * top.b + (1 - top.a) * bottom.b;
    return new _color_rgba_64_js__WEBPACK_IMPORTED_MODULE_3__.ColorRGBA64(r, g, b, 1);
}


/***/ }),

/***/ "../../packages/utilities/fast-colors/dist/color-converters.js":
/*!*********************************************************************!*\
  !*** ../../packages/utilities/fast-colors/dist/color-converters.js ***!
  \*********************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "calculateOverlayColor": () => (/* binding */ calculateOverlayColor),
/* harmony export */   "contrastRatio": () => (/* binding */ contrastRatio),
/* harmony export */   "hslToRGB": () => (/* binding */ hslToRGB),
/* harmony export */   "hsvToRGB": () => (/* binding */ hsvToRGB),
/* harmony export */   "labToLCH": () => (/* binding */ labToLCH),
/* harmony export */   "labToRGB": () => (/* binding */ labToRGB),
/* harmony export */   "labToXYZ": () => (/* binding */ labToXYZ),
/* harmony export */   "lchToLAB": () => (/* binding */ lchToLAB),
/* harmony export */   "lchToRGB": () => (/* binding */ lchToRGB),
/* harmony export */   "rgbToHSL": () => (/* binding */ rgbToHSL),
/* harmony export */   "rgbToHSV": () => (/* binding */ rgbToHSV),
/* harmony export */   "rgbToLAB": () => (/* binding */ rgbToLAB),
/* harmony export */   "rgbToLCH": () => (/* binding */ rgbToLCH),
/* harmony export */   "rgbToLinearLuminance": () => (/* binding */ rgbToLinearLuminance),
/* harmony export */   "rgbToRelativeLuminance": () => (/* binding */ rgbToRelativeLuminance),
/* harmony export */   "rgbToTemperature": () => (/* binding */ rgbToTemperature),
/* harmony export */   "rgbToXYZ": () => (/* binding */ rgbToXYZ),
/* harmony export */   "temperatureToRGB": () => (/* binding */ temperatureToRGB),
/* harmony export */   "xyzToLAB": () => (/* binding */ xyzToLAB),
/* harmony export */   "xyzToRGB": () => (/* binding */ xyzToRGB)
/* harmony export */ });
/* harmony import */ var _color_hsl_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./color-hsl.js */ "../../packages/utilities/fast-colors/dist/color-hsl.js");
/* harmony import */ var _color_hsv_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./color-hsv.js */ "../../packages/utilities/fast-colors/dist/color-hsv.js");
/* harmony import */ var _color_lab_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./color-lab.js */ "../../packages/utilities/fast-colors/dist/color-lab.js");
/* harmony import */ var _color_lch_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./color-lch.js */ "../../packages/utilities/fast-colors/dist/color-lch.js");
/* harmony import */ var _color_rgba_64_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./color-rgba-64.js */ "../../packages/utilities/fast-colors/dist/color-rgba-64.js");
/* harmony import */ var _color_xyz_js__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./color-xyz.js */ "../../packages/utilities/fast-colors/dist/color-xyz.js");
/* harmony import */ var _math_utilities_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./math-utilities.js */ "../../packages/utilities/fast-colors/dist/math-utilities.js");







// All hue values are in degrees rather than radians or normalized
// All conversions use the D65 2 degree white point for XYZ
// Info on conversions and constants used can be found in the following:
// https://en.wikipedia.org/wiki/CIELAB_color_space
// https://en.wikipedia.org/wiki/Illuminant_D65
// https://ninedegreesbelow.com/photography/xyz-rgb.html
// http://user.engineering.uiowa.edu/~aip/Misc/ColorFAQ.html
// https://web.stanford.edu/~sujason/ColorBalancing/adaptation.html
// http://brucelindbloom.com/index.html
/**
 * Get the luminance of a color in the linear RGB space.
 * This is not the same as the relative luminance in the sRGB space for WCAG contrast calculations. Use rgbToRelativeLuminance instead.
 * @param rgb - The input color
 *
 * @public
 */
function rgbToLinearLuminance(rgb) {
    return rgb.r * 0.2126 + rgb.g * 0.7152 + rgb.b * 0.0722;
}
/**
 * Get the relative luminance of a color.
 * Adjusts the color to sRGB space, which is necessary for the WCAG contrast spec.
 * The alpha channel of the input is ignored.
 * @param rgb - The input color
 *
 * @public
 */
function rgbToRelativeLuminance(rgb) {
    function luminanceHelper(i) {
        if (i <= 0.03928) {
            return i / 12.92;
        }
        return Math.pow((i + 0.055) / 1.055, 2.4);
    }
    return rgbToLinearLuminance(new _color_rgba_64_js__WEBPACK_IMPORTED_MODULE_0__.ColorRGBA64(luminanceHelper(rgb.r), luminanceHelper(rgb.g), luminanceHelper(rgb.b), 1));
}
const calculateContrastRatio = (a, b) => (a + 0.05) / (b + 0.05);
/**
 * Calculate the contrast ratio between two colors. Uses the formula described by {@link https://www.w3.org/TR/WCAG20-TECHS/G17.html | WCAG 2.0}.
 *
 * @remarks
 * The alpha channel of the input is ignored
 *
 * @public
 */
function contrastRatio(a, b) {
    const luminanceA = rgbToRelativeLuminance(a);
    const luminanceB = rgbToRelativeLuminance(b);
    return luminanceA > luminanceB
        ? calculateContrastRatio(luminanceA, luminanceB)
        : calculateContrastRatio(luminanceB, luminanceA);
}
function calcChannelOverlay(match, background, overlay) {
    if (overlay - background === 0) {
        return 0;
    }
    else {
        return (match - background) / (overlay - background);
    }
}
function calcRgbOverlay(rgbMatch, rgbBackground, rgbOverlay) {
    const rChannel = calcChannelOverlay(rgbMatch.r, rgbBackground.r, rgbOverlay.r);
    const gChannel = calcChannelOverlay(rgbMatch.g, rgbBackground.g, rgbOverlay.g);
    const bChannel = calcChannelOverlay(rgbMatch.b, rgbBackground.b, rgbOverlay.b);
    return (rChannel + gChannel + bChannel) / 3;
}
/**
 * Calculate an overlay color that uses rgba (rgb + alpha) that matches the appearance of a given solid color when placed on the same background
 * @param rgbMatch - The solid color the overlay should match in appearance when placed over the rgbBackground
 * @param rgbBackground - The background on which the overlay rests
 * @param rgbOverlay - The rgb color of the overlay. Typically this is either pure white or pure black and when not provided will be determined automatically. This color will be used in the returned output
 * @returns The rgba (rgb + alpha) color of the overlay
 *
 * @public
 */
function calculateOverlayColor(rgbMatch, rgbBackground, rgbOverlay = null) {
    let alpha = 0;
    let overlay = rgbOverlay;
    if (overlay !== null) {
        alpha = calcRgbOverlay(rgbMatch, rgbBackground, overlay);
    }
    else {
        overlay = new _color_rgba_64_js__WEBPACK_IMPORTED_MODULE_0__.ColorRGBA64(0, 0, 0, 1);
        alpha = calcRgbOverlay(rgbMatch, rgbBackground, overlay);
        if (alpha <= 0) {
            overlay = new _color_rgba_64_js__WEBPACK_IMPORTED_MODULE_0__.ColorRGBA64(1, 1, 1, 1);
            alpha = calcRgbOverlay(rgbMatch, rgbBackground, overlay);
        }
    }
    alpha = Math.round(alpha * 1000) / 1000;
    return new _color_rgba_64_js__WEBPACK_IMPORTED_MODULE_0__.ColorRGBA64(overlay.r, overlay.g, overlay.b, alpha);
}
/**
 * Converts a {@link @microsoft/fast-colors#ColorRGBA64} to a {@link @microsoft/fast-colors#ColorHSL}
 * @param rgb - the rgb color to convert
 *
 * @remarks
 * The alpha channel of the input is ignored
 *
 * @public
 */
function rgbToHSL(rgb) {
    const max = Math.max(rgb.r, rgb.g, rgb.b);
    const min = Math.min(rgb.r, rgb.g, rgb.b);
    const delta = max - min;
    let hue = 0;
    if (delta !== 0) {
        if (max === rgb.r) {
            hue = 60 * (((rgb.g - rgb.b) / delta) % 6);
        }
        else if (max === rgb.g) {
            hue = 60 * ((rgb.b - rgb.r) / delta + 2);
        }
        else {
            hue = 60 * ((rgb.r - rgb.g) / delta + 4);
        }
    }
    if (hue < 0) {
        hue += 360;
    }
    const lum = (max + min) / 2;
    let sat = 0;
    if (delta !== 0) {
        sat = delta / (1 - Math.abs(2 * lum - 1));
    }
    return new _color_hsl_js__WEBPACK_IMPORTED_MODULE_1__.ColorHSL(hue, sat, lum);
}
/**
 * Converts a {@link @microsoft/fast-colors#ColorHSL} to a {@link @microsoft/fast-colors#ColorRGBA64}
 * @param hsl - the hsl color to convert
 * @param alpha - the alpha value
 *
 * @public
 */
function hslToRGB(hsl, alpha = 1) {
    const c = (1 - Math.abs(2 * hsl.l - 1)) * hsl.s;
    const x = c * (1 - Math.abs(((hsl.h / 60) % 2) - 1));
    const m = hsl.l - c / 2;
    let r = 0;
    let g = 0;
    let b = 0;
    if (hsl.h < 60) {
        r = c;
        g = x;
        b = 0;
    }
    else if (hsl.h < 120) {
        r = x;
        g = c;
        b = 0;
    }
    else if (hsl.h < 180) {
        r = 0;
        g = c;
        b = x;
    }
    else if (hsl.h < 240) {
        r = 0;
        g = x;
        b = c;
    }
    else if (hsl.h < 300) {
        r = x;
        g = 0;
        b = c;
    }
    else if (hsl.h < 360) {
        r = c;
        g = 0;
        b = x;
    }
    return new _color_rgba_64_js__WEBPACK_IMPORTED_MODULE_0__.ColorRGBA64(r + m, g + m, b + m, alpha);
}
/**
 * Converts a {@link @microsoft/fast-colors#ColorRGBA64} to a {@link @microsoft/fast-colors#ColorHSV}
 * @param rgb - the rgb color to convert
 *
 * @remarks
 * The alpha channel of the input is ignored
 *
 * @public
 */
function rgbToHSV(rgb) {
    const max = Math.max(rgb.r, rgb.g, rgb.b);
    const min = Math.min(rgb.r, rgb.g, rgb.b);
    const delta = max - min;
    let hue = 0;
    if (delta !== 0) {
        if (max === rgb.r) {
            hue = 60 * (((rgb.g - rgb.b) / delta) % 6);
        }
        else if (max === rgb.g) {
            hue = 60 * ((rgb.b - rgb.r) / delta + 2);
        }
        else {
            hue = 60 * ((rgb.r - rgb.g) / delta + 4);
        }
    }
    if (hue < 0) {
        hue += 360;
    }
    let sat = 0;
    if (max !== 0) {
        sat = delta / max;
    }
    return new _color_hsv_js__WEBPACK_IMPORTED_MODULE_2__.ColorHSV(hue, sat, max);
}
/**
 * Converts a {@link @microsoft/fast-colors#ColorHSV} to a {@link @microsoft/fast-colors#ColorRGBA64}
 * @param hsv - the hsv color to convert
 * @param alpha - the alpha value
 *
 * @public
 */
function hsvToRGB(hsv, alpha = 1) {
    const c = hsv.s * hsv.v;
    const x = c * (1 - Math.abs(((hsv.h / 60) % 2) - 1));
    const m = hsv.v - c;
    let r = 0;
    let g = 0;
    let b = 0;
    if (hsv.h < 60) {
        r = c;
        g = x;
        b = 0;
    }
    else if (hsv.h < 120) {
        r = x;
        g = c;
        b = 0;
    }
    else if (hsv.h < 180) {
        r = 0;
        g = c;
        b = x;
    }
    else if (hsv.h < 240) {
        r = 0;
        g = x;
        b = c;
    }
    else if (hsv.h < 300) {
        r = x;
        g = 0;
        b = c;
    }
    else if (hsv.h < 360) {
        r = c;
        g = 0;
        b = x;
    }
    return new _color_rgba_64_js__WEBPACK_IMPORTED_MODULE_0__.ColorRGBA64(r + m, g + m, b + m, alpha);
}
/**
 * Converts a {@link @microsoft/fast-colors#ColorLCH} to a {@link @microsoft/fast-colors#ColorLAB}
 * @param lch - the lch color to convert
 *
 * @public
 */
function lchToLAB(lch) {
    let a = 0;
    let b = 0;
    if (lch.h !== 0) {
        a = Math.cos((0,_math_utilities_js__WEBPACK_IMPORTED_MODULE_3__.degreesToRadians)(lch.h)) * lch.c;
        b = Math.sin((0,_math_utilities_js__WEBPACK_IMPORTED_MODULE_3__.degreesToRadians)(lch.h)) * lch.c;
    }
    return new _color_lab_js__WEBPACK_IMPORTED_MODULE_4__.ColorLAB(lch.l, a, b);
}
/**
 * Converts a {@link @microsoft/fast-colors#ColorLAB} to a {@link @microsoft/fast-colors#ColorLCH}
 * @param lab - the lab color to convert
 *
 * @remarks
 * The discontinuity in the C parameter at 0 means that floating point errors will often result in values near 0 giving unpredictable results.
 * EG: 0.0000001 gives a very different result than -0.0000001
 * In cases where both a and b are very near zero this function will return an LCH color with an H of 0
 * More info about the atan2 function: {@link https://en.wikipedia.org/wiki/Atan2}
 * @public
 */
function labToLCH(lab) {
    let h = 0;
    // Because of the discontinuity at 0 if a number is very close to 0 - often due to floating point errors - then
    // it gives unexpected results. EG: 0.000000000001 gives a different result than 0. So just avoid any number
    // that has both a and b very close to zero and lump it in with the h = 0 case.
    if (Math.abs(lab.b) > 0.001 || Math.abs(lab.a) > 0.001) {
        h = (0,_math_utilities_js__WEBPACK_IMPORTED_MODULE_3__.radiansToDegrees)(Math.atan2(lab.b, lab.a));
    }
    if (h < 0) {
        h += 360;
    }
    const c = Math.sqrt(lab.a * lab.a + lab.b * lab.b);
    return new _color_lch_js__WEBPACK_IMPORTED_MODULE_5__.ColorLCH(lab.l, c, h);
}
/**
 * Converts a {@link @microsoft/fast-colors#ColorLAB} to a {@link @microsoft/fast-colors#ColorXYZ}
 * @param lab - the lab color to convert
 *
 * @public
 */
function labToXYZ(lab) {
    const fy = (lab.l + 16) / 116;
    const fx = fy + lab.a / 500;
    const fz = fy - lab.b / 200;
    const xcubed = Math.pow(fx, 3);
    const ycubed = Math.pow(fy, 3);
    const zcubed = Math.pow(fz, 3);
    let x = 0;
    if (xcubed > _color_lab_js__WEBPACK_IMPORTED_MODULE_4__.ColorLAB.epsilon) {
        x = xcubed;
    }
    else {
        x = (116 * fx - 16) / _color_lab_js__WEBPACK_IMPORTED_MODULE_4__.ColorLAB.kappa;
    }
    let y = 0;
    if (lab.l > _color_lab_js__WEBPACK_IMPORTED_MODULE_4__.ColorLAB.epsilon * _color_lab_js__WEBPACK_IMPORTED_MODULE_4__.ColorLAB.kappa) {
        y = ycubed;
    }
    else {
        y = lab.l / _color_lab_js__WEBPACK_IMPORTED_MODULE_4__.ColorLAB.kappa;
    }
    let z = 0;
    if (zcubed > _color_lab_js__WEBPACK_IMPORTED_MODULE_4__.ColorLAB.epsilon) {
        z = zcubed;
    }
    else {
        z = (116 * fz - 16) / _color_lab_js__WEBPACK_IMPORTED_MODULE_4__.ColorLAB.kappa;
    }
    x = _color_xyz_js__WEBPACK_IMPORTED_MODULE_6__.ColorXYZ.whitePoint.x * x;
    y = _color_xyz_js__WEBPACK_IMPORTED_MODULE_6__.ColorXYZ.whitePoint.y * y;
    z = _color_xyz_js__WEBPACK_IMPORTED_MODULE_6__.ColorXYZ.whitePoint.z * z;
    return new _color_xyz_js__WEBPACK_IMPORTED_MODULE_6__.ColorXYZ(x, y, z);
}
/**
 * Converts a {@link @microsoft/fast-colors#ColorXYZ} to a {@link @microsoft/fast-colors#ColorLAB}
 * @param xyz - the xyz color to convert
 *
 * @public
 */
function xyzToLAB(xyz) {
    function xyzToLABHelper(i) {
        if (i > _color_lab_js__WEBPACK_IMPORTED_MODULE_4__.ColorLAB.epsilon) {
            return Math.pow(i, 1 / 3);
        }
        return (_color_lab_js__WEBPACK_IMPORTED_MODULE_4__.ColorLAB.kappa * i + 16) / 116;
    }
    const x = xyzToLABHelper(xyz.x / _color_xyz_js__WEBPACK_IMPORTED_MODULE_6__.ColorXYZ.whitePoint.x);
    const y = xyzToLABHelper(xyz.y / _color_xyz_js__WEBPACK_IMPORTED_MODULE_6__.ColorXYZ.whitePoint.y);
    const z = xyzToLABHelper(xyz.z / _color_xyz_js__WEBPACK_IMPORTED_MODULE_6__.ColorXYZ.whitePoint.z);
    const l = 116 * y - 16;
    const a = 500 * (x - y);
    const b = 200 * (y - z);
    return new _color_lab_js__WEBPACK_IMPORTED_MODULE_4__.ColorLAB(l, a, b);
}
/**
 * Converts a {@link @microsoft/fast-colors#ColorRGBA64} to a {@link @microsoft/fast-colors#ColorXYZ}
 * @param rgb - the rgb color to convert
 *
 * @remarks
 * The alpha channel of the input is ignored
 * @public
 */
function rgbToXYZ(rgb) {
    function rgbToXYZHelper(i) {
        if (i <= 0.04045) {
            return i / 12.92;
        }
        return Math.pow((i + 0.055) / 1.055, 2.4);
    }
    const r = rgbToXYZHelper(rgb.r);
    const g = rgbToXYZHelper(rgb.g);
    const b = rgbToXYZHelper(rgb.b);
    const x = r * 0.4124564 + g * 0.3575761 + b * 0.1804375;
    const y = r * 0.2126729 + g * 0.7151522 + b * 0.072175;
    const z = r * 0.0193339 + g * 0.119192 + b * 0.9503041;
    return new _color_xyz_js__WEBPACK_IMPORTED_MODULE_6__.ColorXYZ(x, y, z);
}
/**
 * Converts a {@link @microsoft/fast-colors#ColorXYZ} to a {@link @microsoft/fast-colors#ColorRGBA64}
 * @param xyz - the xyz color to convert
 * @param alpha - the alpha value
 *
 * @remarks
 * Note that the xyz color space is significantly larger than sRGB. As such, this can return colors rgb values greater than 1 or less than 0
 * @public
 */
function xyzToRGB(xyz, alpha = 1) {
    function xyzToRGBHelper(i) {
        if (i <= 0.0031308) {
            return i * 12.92;
        }
        return 1.055 * Math.pow(i, 1 / 2.4) - 0.055;
    }
    const r = xyzToRGBHelper(xyz.x * 3.2404542 - xyz.y * 1.5371385 - xyz.z * 0.4985314);
    const g = xyzToRGBHelper(xyz.x * -0.969266 + xyz.y * 1.8760108 + xyz.z * 0.041556);
    const b = xyzToRGBHelper(xyz.x * 0.0556434 - xyz.y * 0.2040259 + xyz.z * 1.0572252);
    return new _color_rgba_64_js__WEBPACK_IMPORTED_MODULE_0__.ColorRGBA64(r, g, b, alpha);
}
/**
 * Converts a {@link @microsoft/fast-colors#ColorRGBA64} to a {@link @microsoft/fast-colors#ColorLAB}
 * @param rgb - the rgb color to convert
 *
 * @remarks
 * The alpha channel of the input is ignored
 *
 * @public
 */
function rgbToLAB(rgb) {
    return xyzToLAB(rgbToXYZ(rgb));
}
/**
 * Converts a {@link @microsoft/fast-colors#ColorLAB} to a {@link @microsoft/fast-colors#ColorRGBA64}
 * @param lab - the LAB color to convert
 * @param alpha - the alpha value
 *
 * @remarks
 * Note that the xyz color space (which the conversion from LAB uses) is significantly larger than sRGB. As such, this can return colors rgb values greater than 1 or less than 0
 *
 * @public
 */
function labToRGB(lab, alpha = 1) {
    return xyzToRGB(labToXYZ(lab), alpha);
}
/**
 * Convert a {@link @microsoft/fast-colors#ColorRGBA64} to a {@link @microsoft/fast-colors#ColorLCH}
 *
 * @param rgb - the rgb color to convert
 *
 * @remarks
 * The alpha channel of the input is ignored
 *
 * @public
 */
function rgbToLCH(rgb) {
    return labToLCH(rgbToLAB(rgb));
}
/**
 * Convert a {@link @microsoft/fast-colors#ColorLCH} to a {@link @microsoft/fast-colors#ColorRGBA64}
 * @param lch - the LCH color to convert
 * @param alpha - the alpha value
 *
 * @public
 */
function lchToRGB(lch, alpha = 1) {
    return labToRGB(lchToLAB(lch), alpha);
}
/**
 * Converts a color temperature to a {@link @microsoft/fast-colors#ColorRGBA64}
 * @param tempKelvin - the temperature to convert
 * @param alpha - the alpha value
 *
 * @public
 */
function temperatureToRGB(tempKelvin, alpha = 1) {
    // The constants I could find assumed a decimal range of [0,255] for each channel. Just going to put a /255.0 at the end
    let r = 0;
    let g = 0;
    let b = 0;
    if (tempKelvin <= 1000) {
        tempKelvin = 1000;
    }
    else if (tempKelvin >= 40000) {
        tempKelvin = 40000;
    }
    if (tempKelvin < 6600.0) {
        r = 255.0;
        g = tempKelvin / 100.0 - 2.0;
        g =
            -155.25485562709179 -
                0.44596950469579133 * g +
                104.49216199393888 * Math.log(g);
    }
    else {
        r = tempKelvin / 100.0 - 55.0;
        r = 351.97690566805693 + 0.114206453784165 * r - 40.25366309332127 * Math.log(r);
        g = tempKelvin / 100.0 - 50.0;
        g = 325.4494125711974 + 0.07943456536662342 * g - 28.0852963507957 * Math.log(g);
    }
    if (tempKelvin >= 6600.0) {
        b = 255.0;
    }
    else if (tempKelvin < 2000.0) {
        b = 0.0;
    }
    else {
        b = tempKelvin / 100.0 - 10;
        b =
            -254.76935184120902 +
                0.8274096064007395 * b +
                115.67994401066147 * Math.log(b);
    }
    return new _color_rgba_64_js__WEBPACK_IMPORTED_MODULE_0__.ColorRGBA64(r / 255, g / 255, b / 255, alpha);
}
/**
 * Convert a rgb color to a color temperature
 * @param rgb - the color to convert
 *
 * @remarks
 * The alpha channel of the input is ignored
 *
 * @public
 */
function rgbToTemperature(rgb) {
    let t = 0;
    let min = 1000;
    let max = 40000;
    while (max - min > 0.4) {
        t = (max + min) / 2.0;
        const testColor = temperatureToRGB(t);
        if (testColor.b / testColor.r >= rgb.b / rgb.r) {
            max = t;
        }
        else {
            min = t;
        }
    }
    return Math.round(t);
}


/***/ }),

/***/ "../../packages/utilities/fast-colors/dist/color-hsl.js":
/*!**************************************************************!*\
  !*** ../../packages/utilities/fast-colors/dist/color-hsl.js ***!
  \**************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "ColorHSL": () => (/* binding */ ColorHSL)
/* harmony export */ });
/* harmony import */ var _math_utilities_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./math-utilities.js */ "../../packages/utilities/fast-colors/dist/math-utilities.js");

/**
 * This uses Hue values in "degree" format. So expect a range of [0,360]. Some other implementations instead uses radians or a normalized Hue with range [0,1]. Be aware of this when checking values or using other libraries.
 *
 * @public
 */
class ColorHSL {
    constructor(hue, sat, lum) {
        this.h = hue;
        this.s = sat;
        this.l = lum;
    }
    /**
     * Construct a {@link ColorHSL} from a config object.
     */
    static fromObject(data) {
        if (data && !isNaN(data.h) && !isNaN(data.s) && !isNaN(data.l)) {
            return new ColorHSL(data.h, data.s, data.l);
        }
        return null;
    }
    /**
     * Determines if a color is equal to another
     * @param rhs - the value to compare
     */
    equalValue(rhs) {
        return this.h === rhs.h && this.s === rhs.s && this.l === rhs.l;
    }
    /**
     * Returns a new {@link ColorHSL} rounded to the provided precision
     * @param precision - the precision to round to
     */
    roundToPrecision(precision) {
        return new ColorHSL((0,_math_utilities_js__WEBPACK_IMPORTED_MODULE_0__.roundToPrecisionSmall)(this.h, precision), (0,_math_utilities_js__WEBPACK_IMPORTED_MODULE_0__.roundToPrecisionSmall)(this.s, precision), (0,_math_utilities_js__WEBPACK_IMPORTED_MODULE_0__.roundToPrecisionSmall)(this.l, precision));
    }
    /**
     * Returns the {@link ColorHSL} formatted as an object.
     */
    toObject() {
        return { h: this.h, s: this.s, l: this.l };
    }
}


/***/ }),

/***/ "../../packages/utilities/fast-colors/dist/color-hsv.js":
/*!**************************************************************!*\
  !*** ../../packages/utilities/fast-colors/dist/color-hsv.js ***!
  \**************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "ColorHSV": () => (/* binding */ ColorHSV)
/* harmony export */ });
/* harmony import */ var _math_utilities_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./math-utilities.js */ "../../packages/utilities/fast-colors/dist/math-utilities.js");

/**
 * This uses Hue values in "degree" format. So expect a range of [0,360]. Some other implementations instead uses radians or a normalized Hue with range [0,1]. Be aware of this when checking values or using other libraries.
 *
 * @public
 */
class ColorHSV {
    constructor(hue, sat, val) {
        this.h = hue;
        this.s = sat;
        this.v = val;
    }
    /**
     * Construct a {@link ColorHSV} from a config object.
     */
    static fromObject(data) {
        if (data && !isNaN(data.h) && !isNaN(data.s) && !isNaN(data.v)) {
            return new ColorHSV(data.h, data.s, data.v);
        }
        return null;
    }
    /**
     * Determines if a color is equal to another
     * @param rhs - the value to compare
     */
    equalValue(rhs) {
        return this.h === rhs.h && this.s === rhs.s && this.v === rhs.v;
    }
    /**
     * Returns a new {@link ColorHSV} rounded to the provided precision
     * @param precision - the precision to round to
     */
    roundToPrecision(precision) {
        return new ColorHSV((0,_math_utilities_js__WEBPACK_IMPORTED_MODULE_0__.roundToPrecisionSmall)(this.h, precision), (0,_math_utilities_js__WEBPACK_IMPORTED_MODULE_0__.roundToPrecisionSmall)(this.s, precision), (0,_math_utilities_js__WEBPACK_IMPORTED_MODULE_0__.roundToPrecisionSmall)(this.v, precision));
    }
    /**
     * Returns the {@link ColorHSV} formatted as an object.
     */
    toObject() {
        return { h: this.h, s: this.s, v: this.v };
    }
}


/***/ }),

/***/ "../../packages/utilities/fast-colors/dist/color-interpolation.js":
/*!************************************************************************!*\
  !*** ../../packages/utilities/fast-colors/dist/color-interpolation.js ***!
  \************************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "ColorInterpolationSpace": () => (/* binding */ ColorInterpolationSpace),
/* harmony export */   "interpolateByColorSpace": () => (/* binding */ interpolateByColorSpace),
/* harmony export */   "interpolateHSL": () => (/* binding */ interpolateHSL),
/* harmony export */   "interpolateHSV": () => (/* binding */ interpolateHSV),
/* harmony export */   "interpolateLAB": () => (/* binding */ interpolateLAB),
/* harmony export */   "interpolateLCH": () => (/* binding */ interpolateLCH),
/* harmony export */   "interpolateRGB": () => (/* binding */ interpolateRGB),
/* harmony export */   "interpolateXYZ": () => (/* binding */ interpolateXYZ)
/* harmony export */ });
/* harmony import */ var _color_converters_js__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./color-converters.js */ "../../packages/utilities/fast-colors/dist/color-converters.js");
/* harmony import */ var _color_hsl_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./color-hsl.js */ "../../packages/utilities/fast-colors/dist/color-hsl.js");
/* harmony import */ var _color_hsv_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./color-hsv.js */ "../../packages/utilities/fast-colors/dist/color-hsv.js");
/* harmony import */ var _color_lab_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./color-lab.js */ "../../packages/utilities/fast-colors/dist/color-lab.js");
/* harmony import */ var _color_lch_js__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./color-lch.js */ "../../packages/utilities/fast-colors/dist/color-lch.js");
/* harmony import */ var _color_rgba_64_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./color-rgba-64.js */ "../../packages/utilities/fast-colors/dist/color-rgba-64.js");
/* harmony import */ var _color_xyz_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./color-xyz.js */ "../../packages/utilities/fast-colors/dist/color-xyz.js");
/* harmony import */ var _math_utilities_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./math-utilities.js */ "../../packages/utilities/fast-colors/dist/math-utilities.js");








/**
 * Interpolate by RGB color space
 *
 * @public
 */
function interpolateRGB(position, left, right) {
    if (isNaN(position) || position <= 0) {
        return left;
    }
    else if (position >= 1) {
        return right;
    }
    return new _color_rgba_64_js__WEBPACK_IMPORTED_MODULE_0__.ColorRGBA64((0,_math_utilities_js__WEBPACK_IMPORTED_MODULE_1__.lerp)(position, left.r, right.r), (0,_math_utilities_js__WEBPACK_IMPORTED_MODULE_1__.lerp)(position, left.g, right.g), (0,_math_utilities_js__WEBPACK_IMPORTED_MODULE_1__.lerp)(position, left.b, right.b), (0,_math_utilities_js__WEBPACK_IMPORTED_MODULE_1__.lerp)(position, left.a, right.a));
}
/**
 * Interpolate by HSL color space
 *
 * @public
 */
function interpolateHSL(position, left, right) {
    if (isNaN(position) || position <= 0) {
        return left;
    }
    else if (position >= 1) {
        return right;
    }
    return new _color_hsl_js__WEBPACK_IMPORTED_MODULE_2__.ColorHSL((0,_math_utilities_js__WEBPACK_IMPORTED_MODULE_1__.lerpAnglesInDegrees)(position, left.h, right.h), (0,_math_utilities_js__WEBPACK_IMPORTED_MODULE_1__.lerp)(position, left.s, right.s), (0,_math_utilities_js__WEBPACK_IMPORTED_MODULE_1__.lerp)(position, left.l, right.l));
}
/**
 * Interpolate by HSV color space
 *
 * @public
 */
function interpolateHSV(position, left, right) {
    if (isNaN(position) || position <= 0) {
        return left;
    }
    else if (position >= 1) {
        return right;
    }
    return new _color_hsv_js__WEBPACK_IMPORTED_MODULE_3__.ColorHSV((0,_math_utilities_js__WEBPACK_IMPORTED_MODULE_1__.lerpAnglesInDegrees)(position, left.h, right.h), (0,_math_utilities_js__WEBPACK_IMPORTED_MODULE_1__.lerp)(position, left.s, right.s), (0,_math_utilities_js__WEBPACK_IMPORTED_MODULE_1__.lerp)(position, left.v, right.v));
}
/**
 * Interpolate by XYZ color space
 *
 * @public
 */
function interpolateXYZ(position, left, right) {
    if (isNaN(position) || position <= 0) {
        return left;
    }
    else if (position >= 1) {
        return right;
    }
    return new _color_xyz_js__WEBPACK_IMPORTED_MODULE_4__.ColorXYZ((0,_math_utilities_js__WEBPACK_IMPORTED_MODULE_1__.lerp)(position, left.x, right.x), (0,_math_utilities_js__WEBPACK_IMPORTED_MODULE_1__.lerp)(position, left.y, right.y), (0,_math_utilities_js__WEBPACK_IMPORTED_MODULE_1__.lerp)(position, left.z, right.z));
}
/**
 * Interpolate by LAB color space
 *
 * @public
 */
function interpolateLAB(position, left, right) {
    if (isNaN(position) || position <= 0) {
        return left;
    }
    else if (position >= 1) {
        return right;
    }
    return new _color_lab_js__WEBPACK_IMPORTED_MODULE_5__.ColorLAB((0,_math_utilities_js__WEBPACK_IMPORTED_MODULE_1__.lerp)(position, left.l, right.l), (0,_math_utilities_js__WEBPACK_IMPORTED_MODULE_1__.lerp)(position, left.a, right.a), (0,_math_utilities_js__WEBPACK_IMPORTED_MODULE_1__.lerp)(position, left.b, right.b));
}
/**
 * Interpolate by LCH color space
 *
 * @public
 */
function interpolateLCH(position, left, right) {
    if (isNaN(position) || position <= 0) {
        return left;
    }
    else if (position >= 1) {
        return right;
    }
    return new _color_lch_js__WEBPACK_IMPORTED_MODULE_6__.ColorLCH((0,_math_utilities_js__WEBPACK_IMPORTED_MODULE_1__.lerp)(position, left.l, right.l), (0,_math_utilities_js__WEBPACK_IMPORTED_MODULE_1__.lerp)(position, left.c, right.c), (0,_math_utilities_js__WEBPACK_IMPORTED_MODULE_1__.lerpAnglesInDegrees)(position, left.h, right.h));
}
/**
 * Color interpolation spaces
 *
 * @public
 */
var ColorInterpolationSpace;
(function (ColorInterpolationSpace) {
    ColorInterpolationSpace[ColorInterpolationSpace["RGB"] = 0] = "RGB";
    ColorInterpolationSpace[ColorInterpolationSpace["HSL"] = 1] = "HSL";
    ColorInterpolationSpace[ColorInterpolationSpace["HSV"] = 2] = "HSV";
    ColorInterpolationSpace[ColorInterpolationSpace["XYZ"] = 3] = "XYZ";
    ColorInterpolationSpace[ColorInterpolationSpace["LAB"] = 4] = "LAB";
    ColorInterpolationSpace[ColorInterpolationSpace["LCH"] = 5] = "LCH";
})(ColorInterpolationSpace || (ColorInterpolationSpace = {}));
/**
 * Interpolate by color space
 *
 * @public
 */
function interpolateByColorSpace(position, space, left, right) {
    if (isNaN(position) || position <= 0) {
        return left;
    }
    else if (position >= 1) {
        return right;
    }
    switch (space) {
        case ColorInterpolationSpace.HSL:
            return (0,_color_converters_js__WEBPACK_IMPORTED_MODULE_7__.hslToRGB)(interpolateHSL(position, (0,_color_converters_js__WEBPACK_IMPORTED_MODULE_7__.rgbToHSL)(left), (0,_color_converters_js__WEBPACK_IMPORTED_MODULE_7__.rgbToHSL)(right)));
        case ColorInterpolationSpace.HSV:
            return (0,_color_converters_js__WEBPACK_IMPORTED_MODULE_7__.hsvToRGB)(interpolateHSV(position, (0,_color_converters_js__WEBPACK_IMPORTED_MODULE_7__.rgbToHSV)(left), (0,_color_converters_js__WEBPACK_IMPORTED_MODULE_7__.rgbToHSV)(right)));
        case ColorInterpolationSpace.XYZ:
            return (0,_color_converters_js__WEBPACK_IMPORTED_MODULE_7__.xyzToRGB)(interpolateXYZ(position, (0,_color_converters_js__WEBPACK_IMPORTED_MODULE_7__.rgbToXYZ)(left), (0,_color_converters_js__WEBPACK_IMPORTED_MODULE_7__.rgbToXYZ)(right)));
        case ColorInterpolationSpace.LAB:
            return (0,_color_converters_js__WEBPACK_IMPORTED_MODULE_7__.labToRGB)(interpolateLAB(position, (0,_color_converters_js__WEBPACK_IMPORTED_MODULE_7__.rgbToLAB)(left), (0,_color_converters_js__WEBPACK_IMPORTED_MODULE_7__.rgbToLAB)(right)));
        case ColorInterpolationSpace.LCH:
            return (0,_color_converters_js__WEBPACK_IMPORTED_MODULE_7__.lchToRGB)(interpolateLCH(position, (0,_color_converters_js__WEBPACK_IMPORTED_MODULE_7__.rgbToLCH)(left), (0,_color_converters_js__WEBPACK_IMPORTED_MODULE_7__.rgbToLCH)(right)));
        default:
            return interpolateRGB(position, left, right);
    }
}


/***/ }),

/***/ "../../packages/utilities/fast-colors/dist/color-lab.js":
/*!**************************************************************!*\
  !*** ../../packages/utilities/fast-colors/dist/color-lab.js ***!
  \**************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "ColorLAB": () => (/* binding */ ColorLAB)
/* harmony export */ });
/* harmony import */ var _math_utilities_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./math-utilities.js */ "../../packages/utilities/fast-colors/dist/math-utilities.js");

/**
 * {@link https://en.wikipedia.org/wiki/CIELAB_color_space | CIELAB color space}
 * This implementation uses the D65 constants for 2 degrees. That determines the constants used for the pure white point of the XYZ space of 0.95047, 1.0, 1.08883.
 * {@link https://en.wikipedia.org/wiki/Illuminant_D65}
 * These constants determine how the XYZ, LCH and LAB colors convert to/from RGB.
 *
 * @public
 */
class ColorLAB {
    constructor(l, a, b) {
        this.l = l;
        this.a = a;
        this.b = b;
    }
    /**
     * Construct a {@link ColorLAB} from a config object.
     */
    static fromObject(data) {
        if (data && !isNaN(data.l) && !isNaN(data.a) && !isNaN(data.b)) {
            return new ColorLAB(data.l, data.a, data.b);
        }
        return null;
    }
    /**
     * Determines if a color is equal to another
     * @param rhs - the value to compare
     */
    equalValue(rhs) {
        return this.l === rhs.l && this.a === rhs.a && this.b === rhs.b;
    }
    /**
     * Returns a new {@link ColorLAB} rounded to the provided precision
     * @param precision - the precision to round to
     */
    roundToPrecision(precision) {
        return new ColorLAB((0,_math_utilities_js__WEBPACK_IMPORTED_MODULE_0__.roundToPrecisionSmall)(this.l, precision), (0,_math_utilities_js__WEBPACK_IMPORTED_MODULE_0__.roundToPrecisionSmall)(this.a, precision), (0,_math_utilities_js__WEBPACK_IMPORTED_MODULE_0__.roundToPrecisionSmall)(this.b, precision));
    }
    /**
     * Returns the {@link ColorLAB} formatted as an object.
     */
    toObject() {
        return { l: this.l, a: this.a, b: this.b };
    }
}
ColorLAB.epsilon = 216 / 24389;
ColorLAB.kappa = 24389 / 27;


/***/ }),

/***/ "../../packages/utilities/fast-colors/dist/color-lch.js":
/*!**************************************************************!*\
  !*** ../../packages/utilities/fast-colors/dist/color-lch.js ***!
  \**************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "ColorLCH": () => (/* binding */ ColorLCH)
/* harmony export */ });
/* harmony import */ var _math_utilities_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./math-utilities.js */ "../../packages/utilities/fast-colors/dist/math-utilities.js");

/**
 *
 * {@link https://en.wikipedia.org/wiki/CIELAB_color_space | CIELCH color space}
 *
 * This is a cylindrical representation of the CIELAB space useful for saturation operations
 * This uses Hue values in "degree" format. So expect a range of [0,360]. Some other implementations instead uses radians or a normalized Hue with range [0,1]. Be aware of this when checking values or using other libraries.
 * This implementation uses the D65 constants for 2 degrees. That determines the constants used for the pure white point of the XYZ space of 0.95047, 1.0, 1.08883.
 * {@link https://en.wikipedia.org/wiki/Illuminant_D65}
 * These constants determine how the XYZ, LCH and LAB colors convert to/from RGB.
 *
 * @public
 */
class ColorLCH {
    constructor(l, c, h) {
        this.l = l;
        this.c = c;
        this.h = h;
    }
    /**
     * Construct a {@link ColorLCH} from a config object.
     * @param data - the config object
     */
    static fromObject(data) {
        if (data && !isNaN(data.l) && !isNaN(data.c) && !isNaN(data.h)) {
            return new ColorLCH(data.l, data.c, data.h);
        }
        return null;
    }
    /**
     * Determines if one color is equal to another.
     * @param rhs - the color to compare
     */
    equalValue(rhs) {
        return this.l === rhs.l && this.c === rhs.c && this.h === rhs.h;
    }
    /**
     * Returns a new {@link ColorLCH} rounded to the provided precision
     * @param precision - the precision to round to
     */
    roundToPrecision(precision) {
        return new ColorLCH((0,_math_utilities_js__WEBPACK_IMPORTED_MODULE_0__.roundToPrecisionSmall)(this.l, precision), (0,_math_utilities_js__WEBPACK_IMPORTED_MODULE_0__.roundToPrecisionSmall)(this.c, precision), (0,_math_utilities_js__WEBPACK_IMPORTED_MODULE_0__.roundToPrecisionSmall)(this.h, precision));
    }
    /**
     * Converts the {@link ColorLCH} to a config object.
     */
    toObject() {
        return { l: this.l, c: this.c, h: this.h };
    }
}


/***/ }),

/***/ "../../packages/utilities/fast-colors/dist/color-palette.js":
/*!******************************************************************!*\
  !*** ../../packages/utilities/fast-colors/dist/color-palette.js ***!
  \******************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "ColorPalette": () => (/* binding */ ColorPalette),
/* harmony export */   "centeredRescale": () => (/* binding */ centeredRescale),
/* harmony export */   "defaultCenteredRescaleConfig": () => (/* binding */ defaultCenteredRescaleConfig),
/* harmony export */   "generateOffCenterPalette": () => (/* binding */ generateOffCenterPalette),
/* harmony export */   "generateScaledPalettes": () => (/* binding */ generateScaledPalettes),
/* harmony export */   "matchLightnessIndex": () => (/* binding */ matchLightnessIndex),
/* harmony export */   "rescale": () => (/* binding */ rescale)
/* harmony export */ });
/* harmony import */ var _color_blending_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./color-blending.js */ "../../packages/utilities/fast-colors/dist/color-blending.js");
/* harmony import */ var _color_converters_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./color-converters.js */ "../../packages/utilities/fast-colors/dist/color-converters.js");
/* harmony import */ var _color_interpolation_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./color-interpolation.js */ "../../packages/utilities/fast-colors/dist/color-interpolation.js");
/* harmony import */ var _color_rgba_64_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./color-rgba-64.js */ "../../packages/utilities/fast-colors/dist/color-rgba-64.js");
/* harmony import */ var _color_scale_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./color-scale.js */ "../../packages/utilities/fast-colors/dist/color-scale.js");
/* harmony import */ var _parse_color_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./parse-color.js */ "../../packages/utilities/fast-colors/dist/parse-color.js");






/**
 * Generates a color palette
 * @public
 */
class ColorPalette {
    constructor(config) {
        this.config = Object.assign({}, ColorPalette.defaultPaletteConfig, config);
        this.palette = [];
        this.updatePaletteColors();
    }
    updatePaletteGenerationValues(newConfig) {
        let changed = false;
        for (const key in newConfig) {
            if (this.config[key]) {
                if (this.config[key].equalValue) {
                    if (!this.config[key].equalValue(newConfig[key])) {
                        this.config[key] = newConfig[key];
                        changed = true;
                    }
                }
                else {
                    if (newConfig[key] !== this.config[key]) {
                        this.config[key] = newConfig[key];
                        changed = true;
                    }
                }
            }
        }
        if (changed) {
            this.updatePaletteColors();
        }
        return changed;
    }
    updatePaletteColors() {
        const scale = this.generatePaletteColorScale();
        for (let i = 0; i < this.config.steps; i++) {
            this.palette[i] = scale.getColor(i / (this.config.steps - 1), this.config.interpolationMode);
        }
    }
    generatePaletteColorScale() {
        // Even when config.baseScalePosition is specified, using 0.5 for the baseColor
        // in the baseScale gives better results. Otherwise very off-center palettes
        // tend to go completely grey at the end furthest from the specified base color.
        const baseColorHSL = (0,_color_converters_js__WEBPACK_IMPORTED_MODULE_0__.rgbToHSL)(this.config.baseColor);
        const baseScale = new _color_scale_js__WEBPACK_IMPORTED_MODULE_1__.ColorScale([
            { position: 0, color: this.config.scaleColorLight },
            { position: 0.5, color: this.config.baseColor },
            { position: 1, color: this.config.scaleColorDark },
        ]);
        const trimmedScale = baseScale.trim(this.config.clipLight, 1 - this.config.clipDark);
        const trimmedLight = trimmedScale.getColor(0);
        const trimmedDark = trimmedScale.getColor(1);
        let adjustedLight = trimmedLight;
        let adjustedDark = trimmedDark;
        if (baseColorHSL.s >= this.config.saturationAdjustmentCutoff) {
            adjustedLight = (0,_color_blending_js__WEBPACK_IMPORTED_MODULE_2__.saturateViaLCH)(adjustedLight, this.config.saturationLight);
            adjustedDark = (0,_color_blending_js__WEBPACK_IMPORTED_MODULE_2__.saturateViaLCH)(adjustedDark, this.config.saturationDark);
        }
        if (this.config.multiplyLight !== 0) {
            const multiply = (0,_color_blending_js__WEBPACK_IMPORTED_MODULE_2__.blendMultiply)(this.config.baseColor, adjustedLight);
            adjustedLight = (0,_color_interpolation_js__WEBPACK_IMPORTED_MODULE_3__.interpolateByColorSpace)(this.config.multiplyLight, this.config.interpolationMode, adjustedLight, multiply);
        }
        if (this.config.multiplyDark !== 0) {
            const multiply = (0,_color_blending_js__WEBPACK_IMPORTED_MODULE_2__.blendMultiply)(this.config.baseColor, adjustedDark);
            adjustedDark = (0,_color_interpolation_js__WEBPACK_IMPORTED_MODULE_3__.interpolateByColorSpace)(this.config.multiplyDark, this.config.interpolationMode, adjustedDark, multiply);
        }
        if (this.config.overlayLight !== 0) {
            const overlay = (0,_color_blending_js__WEBPACK_IMPORTED_MODULE_2__.blendOverlay)(this.config.baseColor, adjustedLight);
            adjustedLight = (0,_color_interpolation_js__WEBPACK_IMPORTED_MODULE_3__.interpolateByColorSpace)(this.config.overlayLight, this.config.interpolationMode, adjustedLight, overlay);
        }
        if (this.config.overlayDark !== 0) {
            const overlay = (0,_color_blending_js__WEBPACK_IMPORTED_MODULE_2__.blendOverlay)(this.config.baseColor, adjustedDark);
            adjustedDark = (0,_color_interpolation_js__WEBPACK_IMPORTED_MODULE_3__.interpolateByColorSpace)(this.config.overlayDark, this.config.interpolationMode, adjustedDark, overlay);
        }
        if (this.config.baseScalePosition) {
            if (this.config.baseScalePosition <= 0) {
                return new _color_scale_js__WEBPACK_IMPORTED_MODULE_1__.ColorScale([
                    { position: 0, color: this.config.baseColor },
                    { position: 1, color: adjustedDark.clamp() },
                ]);
            }
            else if (this.config.baseScalePosition >= 1) {
                return new _color_scale_js__WEBPACK_IMPORTED_MODULE_1__.ColorScale([
                    { position: 0, color: adjustedLight.clamp() },
                    { position: 1, color: this.config.baseColor },
                ]);
            }
            return new _color_scale_js__WEBPACK_IMPORTED_MODULE_1__.ColorScale([
                { position: 0, color: adjustedLight.clamp() },
                {
                    position: this.config.baseScalePosition,
                    color: this.config.baseColor,
                },
                { position: 1, color: adjustedDark.clamp() },
            ]);
        }
        return new _color_scale_js__WEBPACK_IMPORTED_MODULE_1__.ColorScale([
            { position: 0, color: adjustedLight.clamp() },
            { position: 0.5, color: this.config.baseColor },
            { position: 1, color: adjustedDark.clamp() },
        ]);
    }
}
ColorPalette.defaultPaletteConfig = {
    baseColor: (0,_parse_color_js__WEBPACK_IMPORTED_MODULE_4__.parseColorHexRGB)("#808080"),
    steps: 11,
    interpolationMode: _color_interpolation_js__WEBPACK_IMPORTED_MODULE_3__.ColorInterpolationSpace.RGB,
    scaleColorLight: new _color_rgba_64_js__WEBPACK_IMPORTED_MODULE_5__.ColorRGBA64(1, 1, 1, 1),
    scaleColorDark: new _color_rgba_64_js__WEBPACK_IMPORTED_MODULE_5__.ColorRGBA64(0, 0, 0, 1),
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
};
ColorPalette.greyscalePaletteConfig = {
    baseColor: (0,_parse_color_js__WEBPACK_IMPORTED_MODULE_4__.parseColorHexRGB)("#808080"),
    steps: 11,
    interpolationMode: _color_interpolation_js__WEBPACK_IMPORTED_MODULE_3__.ColorInterpolationSpace.RGB,
    scaleColorLight: new _color_rgba_64_js__WEBPACK_IMPORTED_MODULE_5__.ColorRGBA64(1, 1, 1, 1),
    scaleColorDark: new _color_rgba_64_js__WEBPACK_IMPORTED_MODULE_5__.ColorRGBA64(0, 0, 0, 1),
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
};
/**
 * Takes the input color and compares it to each color in the reference array to find the index with the closest Lightness value in HSL color space
 * @public
 */
function matchLightnessIndex(input, reference) {
    const hsl = (0,_color_converters_js__WEBPACK_IMPORTED_MODULE_0__.rgbToHSL)(input);
    let bestFitValue = Number.MAX_VALUE;
    let bestFitIndex = 0;
    for (let i = 0; i < reference.length; i++) {
        const ihsl = (0,_color_converters_js__WEBPACK_IMPORTED_MODULE_0__.rgbToHSL)(reference[i]);
        const fitValue = Math.abs(ihsl.l - hsl.l);
        if (fitValue < bestFitValue) {
            bestFitValue = fitValue;
            bestFitIndex = i;
        }
    }
    return bestFitIndex;
}
/**
 * Generates a greyscale palette using greyscaleConfig. The Lightness (in HSL) of the input color is then compared to the greyscale palette to determine how far off center the input color should be placed. The output palette is then generated with outputSteps number of steps using colorConfig.
 * @public
 */
function generateOffCenterPalette(input, outputSteps, greyscaleConfig = ColorPalette.greyscalePaletteConfig, colorConfig = ColorPalette.defaultPaletteConfig) {
    const greyscale = new ColorPalette(Object.assign(Object.assign({}, greyscaleConfig), { steps: outputSteps }));
    const scaleIndex = matchLightnessIndex(input, greyscale.palette);
    return new ColorPalette(Object.assign(Object.assign({}, colorConfig), { steps: outputSteps, baseColor: input, baseScalePosition: scaleIndex / (outputSteps - 1) }));
}
/**
 * Take the input array of colors and extrapolates them to a larger palette of size targetSize. If preserveInputColors is false the input colors are evenly distributed into the output. Otherwise, the positions of the input colors are adjusted from a perfectly even distribution in order to ensure that the exact color values appearing in the input array also appear in the output array. The larger targetSize is compared to input.length the smaller those adjustments will be.
 *
 * @public
 */
function rescale(input, targetSize, preserveInputColors) {
    if (input.length <= 1 || targetSize <= 1) {
        throw new Error("The input array and targetSize must both be greater than 1");
    }
    if (preserveInputColors && targetSize <= input.length) {
        throw new Error("If preserveInputColors is true then targetSize must be greater than the length of the input array");
    }
    const stops = new Array(input.length);
    if (preserveInputColors) {
        for (let i = 0; i < input.length; i++) {
            const p = i / (input.length - 1);
            let bestFitValue = 2;
            let bestFitIndex = 0;
            for (let j = 0; j < targetSize; j++) {
                const fitValue = Math.abs(j / (targetSize - 1) - p);
                if (fitValue < bestFitValue) {
                    bestFitValue = fitValue;
                    bestFitIndex = j;
                }
                if (fitValue === 0) {
                    break;
                }
            }
            stops[i] = {
                color: input[i],
                position: bestFitIndex / (targetSize - 1),
            };
        }
    }
    else {
        for (let i = 0; i < stops.length; i++) {
            stops[i] = { color: input[i], position: i / (input.length - 1) };
        }
    }
    const scale = new _color_scale_js__WEBPACK_IMPORTED_MODULE_1__.ColorScale(stops);
    const retVal = new Array(targetSize);
    for (let i = 0; i < targetSize; i++) {
        retVal[i] = scale.getColor(i / (targetSize - 1));
    }
    return retVal;
}
/**
 * @public
 */
const defaultCenteredRescaleConfig = {
    targetSize: 63,
    spacing: 4,
    scaleColorLight: ColorPalette.defaultPaletteConfig.scaleColorLight,
    scaleColorDark: ColorPalette.defaultPaletteConfig.scaleColorDark,
};
/**
 * Takes an input array of colors and extrapolates them to a larger palette. The mapping first takes the input array and extrapolates between each color so that they are separated by spacing-1 slots. Then it adds to either end enough new colors to make up the desired targetSize. All output color slots between the defined stops are interpolated.
 * @example
 * For an input array with length 5, a targetSize of 17 and spacing of 3 the output would be:
 *  0: scaleColorLight
 *  1:
 *  2: input 0
 *  3:
 *  4:
 *  5: input 1
 *  6:
 *  7:
 *  8: input 2
 *  9:
 * 10:
 * 11: input 3
 * 12:
 * 13:
 * 14: input 4
 * 15:
 * 16: scaleColorDark
 *
 * @public
 */
function centeredRescale(input, config = defaultCenteredRescaleConfig) {
    if (input.length === 0) {
        return [];
    }
    const offset = Math.floor((config.targetSize - ((input.length - 1) * config.spacing + 1)) / 2);
    if (offset < 0) {
        throw new Error("(targetSize - ((input.length - 1) * spacing + 1)) / 2 must be >= 0");
    }
    const stops = new Array(input.length + 2);
    stops[0] = { position: 0, color: config.scaleColorLight };
    stops[stops.length - 1] = {
        position: 1,
        color: config.scaleColorDark,
    };
    for (let i = 0; i < input.length; i++) {
        stops[i + 1] = {
            color: input[i],
            position: (i * config.spacing + offset) / (config.targetSize - 1),
        };
    }
    const scale = new _color_scale_js__WEBPACK_IMPORTED_MODULE_1__.ColorScale(stops);
    const retVal = new Array(config.targetSize);
    for (let i = 0; i < config.targetSize; i++) {
        retVal[i] = scale.getColor(i / (config.targetSize - 1));
    }
    return retVal;
}
/**
 * Generates two palettes of length shortPaletteLength and longPaletteLength from a base color. The base color is compared to the default greyscale palette to determine where it should be placed. The short palette is then fed into centeredRescale to create the long palette. The colors in the short palette are always contained within the long.
 * @public
 */
function generateScaledPalettes(input, shortPaletteLength = 11, config = defaultCenteredRescaleConfig) {
    const shortPalette = generateOffCenterPalette(input, shortPaletteLength);
    const longPalette = centeredRescale(shortPalette.palette, config);
    return { short: shortPalette.palette, long: longPalette };
}


/***/ }),

/***/ "../../packages/utilities/fast-colors/dist/color-rgba-64.js":
/*!******************************************************************!*\
  !*** ../../packages/utilities/fast-colors/dist/color-rgba-64.js ***!
  \******************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "ColorRGBA64": () => (/* binding */ ColorRGBA64)
/* harmony export */ });
/* harmony import */ var _math_utilities_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./math-utilities.js */ "../../packages/utilities/fast-colors/dist/math-utilities.js");

/**
 * A RGBA color with 64 bit channels.
 *
 * @example
 * ```ts
 * new ColorRGBA64(1, 0, 0, 1) // red
 * ```
 * @public
 */
class ColorRGBA64 {
    /**
     *
     * @param red - the red value
     * @param green - the green value
     * @param blue - the blue value
     * @param alpha - the alpha value
     */
    constructor(red, green, blue, alpha) {
        this.r = red;
        this.g = green;
        this.b = blue;
        this.a = typeof alpha === "number" && !isNaN(alpha) ? alpha : 1;
    }
    /**
     * Construct a {@link ColorRGBA64} from a {@link ColorRGBA64Config}
     * @param data - the config object
     */
    static fromObject(data) {
        return data && !isNaN(data.r) && !isNaN(data.g) && !isNaN(data.b)
            ? new ColorRGBA64(data.r, data.g, data.b, data.a)
            : null;
    }
    /**
     * Determines if one color is equal to another.
     * @param rhs - the color to compare
     */
    equalValue(rhs) {
        return (this.r === rhs.r && this.g === rhs.g && this.b === rhs.b && this.a === rhs.a);
    }
    /**
     * Returns the color formatted as a string; #RRGGBB
     */
    toStringHexRGB() {
        return "#" + [this.r, this.g, this.b].map(this.formatHexValue).join("");
    }
    /**
     * Returns the color formatted as a string; #RRGGBBAA
     */
    toStringHexRGBA() {
        return this.toStringHexRGB() + this.formatHexValue(this.a);
    }
    /**
     * Returns the color formatted as a string; #AARRGGBB
     */
    toStringHexARGB() {
        return "#" + [this.a, this.r, this.g, this.b].map(this.formatHexValue).join("");
    }
    /**
     * Returns the color formatted as a string; "rgb(0xRR, 0xGG, 0xBB)"
     */
    toStringWebRGB() {
        return `rgb(${Math.round((0,_math_utilities_js__WEBPACK_IMPORTED_MODULE_0__.denormalize)(this.r, 0.0, 255.0))},${Math.round((0,_math_utilities_js__WEBPACK_IMPORTED_MODULE_0__.denormalize)(this.g, 0.0, 255.0))},${Math.round((0,_math_utilities_js__WEBPACK_IMPORTED_MODULE_0__.denormalize)(this.b, 0.0, 255.0))})`;
    }
    /**
     * Returns the color formatted as a string; "rgba(0xRR, 0xGG, 0xBB, a)"
     * @remarks
     * Note that this follows the convention of putting alpha in the range [0.0,1.0] while the other three channels are [0,255]
     */
    toStringWebRGBA() {
        return `rgba(${Math.round((0,_math_utilities_js__WEBPACK_IMPORTED_MODULE_0__.denormalize)(this.r, 0.0, 255.0))},${Math.round((0,_math_utilities_js__WEBPACK_IMPORTED_MODULE_0__.denormalize)(this.g, 0.0, 255.0))},${Math.round((0,_math_utilities_js__WEBPACK_IMPORTED_MODULE_0__.denormalize)(this.b, 0.0, 255.0))},${(0,_math_utilities_js__WEBPACK_IMPORTED_MODULE_0__.clamp)(this.a, 0, 1)})`;
    }
    /**
     * Returns a new {@link ColorRGBA64} rounded to the provided precision
     * @param precision - the precision to round to
     */
    roundToPrecision(precision) {
        return new ColorRGBA64((0,_math_utilities_js__WEBPACK_IMPORTED_MODULE_0__.roundToPrecisionSmall)(this.r, precision), (0,_math_utilities_js__WEBPACK_IMPORTED_MODULE_0__.roundToPrecisionSmall)(this.g, precision), (0,_math_utilities_js__WEBPACK_IMPORTED_MODULE_0__.roundToPrecisionSmall)(this.b, precision), (0,_math_utilities_js__WEBPACK_IMPORTED_MODULE_0__.roundToPrecisionSmall)(this.a, precision));
    }
    /**
     * Returns a new {@link ColorRGBA64} with channel values clamped between 0 and 1.
     */
    clamp() {
        return new ColorRGBA64((0,_math_utilities_js__WEBPACK_IMPORTED_MODULE_0__.clamp)(this.r, 0, 1), (0,_math_utilities_js__WEBPACK_IMPORTED_MODULE_0__.clamp)(this.g, 0, 1), (0,_math_utilities_js__WEBPACK_IMPORTED_MODULE_0__.clamp)(this.b, 0, 1), (0,_math_utilities_js__WEBPACK_IMPORTED_MODULE_0__.clamp)(this.a, 0, 1));
    }
    /**
     * Converts the {@link ColorRGBA64} to a {@link ColorRGBA64Config}.
     */
    toObject() {
        return { r: this.r, g: this.g, b: this.b, a: this.a };
    }
    formatHexValue(value) {
        return (0,_math_utilities_js__WEBPACK_IMPORTED_MODULE_0__.getHexStringForByte)((0,_math_utilities_js__WEBPACK_IMPORTED_MODULE_0__.denormalize)(value, 0.0, 255.0));
    }
}


/***/ }),

/***/ "../../packages/utilities/fast-colors/dist/color-scale.js":
/*!****************************************************************!*\
  !*** ../../packages/utilities/fast-colors/dist/color-scale.js ***!
  \****************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "ColorScale": () => (/* binding */ ColorScale)
/* harmony export */ });
/* harmony import */ var _color_converters_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./color-converters.js */ "../../packages/utilities/fast-colors/dist/color-converters.js");
/* harmony import */ var _color_interpolation_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./color-interpolation.js */ "../../packages/utilities/fast-colors/dist/color-interpolation.js");


/**
 * A color scale created from linear stops
 * @public
 */
class ColorScale {
    constructor(stops) {
        if (stops == null || stops.length === 0) {
            throw new Error("The stops argument must be non-empty");
        }
        else {
            this.stops = this.sortColorScaleStops(stops);
        }
    }
    static createBalancedColorScale(colors) {
        if (colors == null || colors.length === 0) {
            throw new Error("The colors argument must be non-empty");
        }
        const stops = new Array(colors.length);
        for (let i = 0; i < colors.length; i++) {
            // Special case first and last in order to avoid floating point jaggies
            if (i === 0) {
                stops[i] = { color: colors[i], position: 0 };
            }
            else if (i === colors.length - 1) {
                stops[i] = { color: colors[i], position: 1 };
            }
            else {
                stops[i] = {
                    color: colors[i],
                    position: i * (1 / (colors.length - 1)),
                };
            }
        }
        return new ColorScale(stops);
    }
    getColor(position, interpolationMode = _color_interpolation_js__WEBPACK_IMPORTED_MODULE_0__.ColorInterpolationSpace.RGB) {
        if (this.stops.length === 1) {
            return this.stops[0].color;
        }
        else if (position <= 0) {
            return this.stops[0].color;
        }
        else if (position >= 1) {
            return this.stops[this.stops.length - 1].color;
        }
        let lowerIndex = 0;
        for (let i = 0; i < this.stops.length; i++) {
            if (this.stops[i].position <= position) {
                lowerIndex = i;
            }
        }
        let upperIndex = lowerIndex + 1;
        if (upperIndex >= this.stops.length) {
            upperIndex = this.stops.length - 1;
        }
        const scalePosition = (position - this.stops[lowerIndex].position) *
            (1.0 / (this.stops[upperIndex].position - this.stops[lowerIndex].position));
        return (0,_color_interpolation_js__WEBPACK_IMPORTED_MODULE_0__.interpolateByColorSpace)(scalePosition, interpolationMode, this.stops[lowerIndex].color, this.stops[upperIndex].color);
    }
    trim(lowerBound, upperBound, interpolationMode = _color_interpolation_js__WEBPACK_IMPORTED_MODULE_0__.ColorInterpolationSpace.RGB) {
        if (lowerBound < 0 || upperBound > 1 || upperBound < lowerBound) {
            throw new Error("Invalid bounds");
        }
        if (lowerBound === upperBound) {
            return new ColorScale([
                { color: this.getColor(lowerBound, interpolationMode), position: 0 },
            ]);
        }
        const containedStops = [];
        for (let i = 0; i < this.stops.length; i++) {
            if (this.stops[i].position >= lowerBound &&
                this.stops[i].position <= upperBound) {
                containedStops.push(this.stops[i]);
            }
        }
        if (containedStops.length === 0) {
            return new ColorScale([
                { color: this.getColor(lowerBound), position: lowerBound },
                { color: this.getColor(upperBound), position: upperBound },
            ]);
        }
        if (containedStops[0].position !== lowerBound) {
            containedStops.unshift({
                color: this.getColor(lowerBound),
                position: lowerBound,
            });
        }
        if (containedStops[containedStops.length - 1].position !== upperBound) {
            containedStops.push({
                color: this.getColor(upperBound),
                position: upperBound,
            });
        }
        const range = upperBound - lowerBound;
        const finalStops = new Array(containedStops.length);
        for (let i = 0; i < containedStops.length; i++) {
            finalStops[i] = {
                color: containedStops[i].color,
                position: (containedStops[i].position - lowerBound) / range,
            };
        }
        return new ColorScale(finalStops);
    }
    findNextColor(position, contrast, searchDown = false, interpolationMode = _color_interpolation_js__WEBPACK_IMPORTED_MODULE_0__.ColorInterpolationSpace.RGB, contrastErrorMargin = 0.005, maxSearchIterations = 32) {
        if (isNaN(position) || position <= 0) {
            position = 0;
        }
        else if (position >= 1) {
            position = 1;
        }
        const startingColor = this.getColor(position, interpolationMode);
        const finalPosition = searchDown ? 0 : 1;
        const finalColor = this.getColor(finalPosition, interpolationMode);
        const finalContrast = (0,_color_converters_js__WEBPACK_IMPORTED_MODULE_1__.contrastRatio)(startingColor, finalColor);
        if (finalContrast <= contrast) {
            return finalPosition;
        }
        let testRangeMin = searchDown ? 0 : position;
        let testRangeMax = searchDown ? position : 0;
        let mid = finalPosition;
        let iterations = 0;
        while (iterations <= maxSearchIterations) {
            mid = Math.abs(testRangeMax - testRangeMin) / 2 + testRangeMin;
            const midColor = this.getColor(mid, interpolationMode);
            const midContrast = (0,_color_converters_js__WEBPACK_IMPORTED_MODULE_1__.contrastRatio)(startingColor, midColor);
            if (Math.abs(midContrast - contrast) <= contrastErrorMargin) {
                return mid;
            }
            else if (midContrast > contrast) {
                if (searchDown) {
                    testRangeMin = mid;
                }
                else {
                    testRangeMax = mid;
                }
            }
            else {
                if (searchDown) {
                    testRangeMax = mid;
                }
                else {
                    testRangeMin = mid;
                }
            }
            iterations++;
        }
        return mid;
    }
    clone() {
        const newStops = new Array(this.stops.length);
        for (let i = 0; i < newStops.length; i++) {
            newStops[i] = {
                color: this.stops[i].color,
                position: this.stops[i].position,
            };
        }
        return new ColorScale(newStops);
    }
    sortColorScaleStops(stops) {
        return stops.sort((a, b) => {
            const A = a.position;
            const B = b.position;
            if (A < B) {
                return -1;
            }
            else if (A > B) {
                return 1;
            }
            else {
                return 0;
            }
        });
    }
}


/***/ }),

/***/ "../../packages/utilities/fast-colors/dist/color-xyz.js":
/*!**************************************************************!*\
  !*** ../../packages/utilities/fast-colors/dist/color-xyz.js ***!
  \**************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "ColorXYZ": () => (/* binding */ ColorXYZ)
/* harmony export */ });
/* harmony import */ var _math_utilities_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./math-utilities.js */ "../../packages/utilities/fast-colors/dist/math-utilities.js");

/**
 * {@link https://en.wikipedia.org/wiki/CIE_1931_color_space | XYZ color space}
 *
 * This implementation uses the D65 constants for 2 degrees. That determines the constants used for the pure white point of the XYZ space of 0.95047, 1.0, 1.08883.
 * {@link https://en.wikipedia.org/wiki/Illuminant_D65}
 * These constants determine how the XYZ, LCH and LAB colors convert to/from RGB.
 *
 * @public
 */
class ColorXYZ {
    constructor(x, y, z) {
        this.x = x;
        this.y = y;
        this.z = z;
    }
    /**
     * Construct a {@link ColorXYZ} from a config object.
     */
    static fromObject(data) {
        if (data && !isNaN(data.x) && !isNaN(data.y) && !isNaN(data.z)) {
            return new ColorXYZ(data.x, data.y, data.z);
        }
        return null;
    }
    /**
     * Determines if a color is equal to another
     * @param rhs - the value to compare
     */
    equalValue(rhs) {
        return this.x === rhs.x && this.y === rhs.y && this.z === rhs.z;
    }
    /**
     * Returns a new {@link ColorXYZ} rounded to the provided precision
     * @param precision - the precision to round to
     */
    roundToPrecision(precision) {
        return new ColorXYZ((0,_math_utilities_js__WEBPACK_IMPORTED_MODULE_0__.roundToPrecisionSmall)(this.x, precision), (0,_math_utilities_js__WEBPACK_IMPORTED_MODULE_0__.roundToPrecisionSmall)(this.y, precision), (0,_math_utilities_js__WEBPACK_IMPORTED_MODULE_0__.roundToPrecisionSmall)(this.z, precision));
    }
    /**
     * Returns the {@link ColorXYZ} formatted as an object.
     */
    toObject() {
        return { x: this.x, y: this.y, z: this.z };
    }
}
/**
 * D65 2 degree white point
 */
ColorXYZ.whitePoint = new ColorXYZ(0.95047, 1.0, 1.08883);


/***/ }),

/***/ "../../packages/utilities/fast-colors/dist/component-state-color-palette.js":
/*!**********************************************************************************!*\
  !*** ../../packages/utilities/fast-colors/dist/component-state-color-palette.js ***!
  \**********************************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "ComponentStateColorPalette": () => (/* binding */ ComponentStateColorPalette)
/* harmony export */ });
/* harmony import */ var _color_rgba_64_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./color-rgba-64.js */ "../../packages/utilities/fast-colors/dist/color-rgba-64.js");
/* harmony import */ var _color_palette_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./color-palette.js */ "../../packages/utilities/fast-colors/dist/color-palette.js");
/* harmony import */ var _color_converters_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./color-converters.js */ "../../packages/utilities/fast-colors/dist/color-converters.js");
/* harmony import */ var _color_scale_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./color-scale.js */ "../../packages/utilities/fast-colors/dist/color-scale.js");
/* harmony import */ var _color_hsl_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./color-hsl.js */ "../../packages/utilities/fast-colors/dist/color-hsl.js");
/* harmony import */ var _color_interpolation_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./color-interpolation.js */ "../../packages/utilities/fast-colors/dist/color-interpolation.js");
/* harmony import */ var _parse_color_js__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./parse-color.js */ "../../packages/utilities/fast-colors/dist/parse-color.js");







/**
 * Creates a color palette for UI components
 * @public
 */
class ComponentStateColorPalette {
    constructor(config) {
        this.palette = [];
        this.config = Object.assign({}, ComponentStateColorPalette.defaultPaletteConfig, config);
        this.regenPalettes();
    }
    regenPalettes() {
        let steps = this.config.steps;
        if (isNaN(steps) || steps < 3) {
            steps = 3;
        }
        // This palette is tuned to go as dark as differences between the levels can be perceived according to tests
        // on numerous monitors in different conditions. Stay linear from white until this first cutoff.
        const darkLum = 0.14;
        // In the dark compression, this is the last luminance value before full black.
        const darkestLum = 0.06;
        // The Color for the luminance value above, placed on the ramp at it's normal position, so darker colors after
        // it can be compressed.
        const darkLumColor = new _color_rgba_64_js__WEBPACK_IMPORTED_MODULE_0__.ColorRGBA64(darkLum, darkLum, darkLum, 1);
        // The number of steps in the ramp that has been tuned for default use. This coincides with the size of the
        // default ramp, but the palette could be generated with fewer steps to increase final contrast. This number
        // should however stay the same.
        const stepsForLuminanceRamp = 94;
        // Create the reference, dark-compressed, grey palette, like:
        // F------------------------------------------------------------------------------------[dark]------[darkest]0
        //                                                                                      |--compressed area--|
        const r = new _color_palette_js__WEBPACK_IMPORTED_MODULE_1__.ColorPalette(Object.assign(Object.assign({}, _color_palette_js__WEBPACK_IMPORTED_MODULE_1__.ColorPalette.greyscalePaletteConfig), { baseColor: darkLumColor, baseScalePosition: ((1 - darkLum) * 100) / stepsForLuminanceRamp, steps }));
        const referencePalette = r.palette;
        // Find the requested base color on the adjusted luminance reference ramp.
        // There is no _right_ way to desaturate a color, and both methods we've tested have value, so average them out.
        const baseColorLum1 = (0,_color_converters_js__WEBPACK_IMPORTED_MODULE_2__.rgbToLinearLuminance)(this.config.baseColor);
        const baseColorLum2 = (0,_color_converters_js__WEBPACK_IMPORTED_MODULE_2__.rgbToHSL)(this.config.baseColor).l;
        const baseColorLum = (baseColorLum1 + baseColorLum2) / 2;
        const baseColorRefIndex = this.matchRelativeLuminanceIndex(baseColorLum, referencePalette);
        const baseColorPercent = baseColorRefIndex / (steps - 1);
        // Find the luminance location for the dark cutoff.
        const darkRefIndex = this.matchRelativeLuminanceIndex(darkLum, referencePalette);
        const darkPercent = darkRefIndex / (steps - 1);
        // Issue https://github.com/microsoft/fast/issues/1904
        // Creating a color from H, S, and a known L value is not the inverse of getting the relative
        // luminace as above. Need to derive a relative luminance version of the color to better match on the dark end.
        // Find the dark cutoff and darkest variations of the requested base color.
        const baseColorHSL = (0,_color_converters_js__WEBPACK_IMPORTED_MODULE_2__.rgbToHSL)(this.config.baseColor);
        const darkBaseColor = (0,_color_converters_js__WEBPACK_IMPORTED_MODULE_2__.hslToRGB)(_color_hsl_js__WEBPACK_IMPORTED_MODULE_3__.ColorHSL.fromObject({
            h: baseColorHSL.h,
            s: baseColorHSL.s,
            l: darkLum,
        }));
        const darkestBaseColor = (0,_color_converters_js__WEBPACK_IMPORTED_MODULE_2__.hslToRGB)(_color_hsl_js__WEBPACK_IMPORTED_MODULE_3__.ColorHSL.fromObject({
            h: baseColorHSL.h,
            s: baseColorHSL.s,
            l: darkestLum,
        }));
        // Create the gradient stops, including the base color and anchor colors for the dark end compression.
        const fullColorScaleStops = new Array(5);
        fullColorScaleStops[0] = {
            position: 0,
            color: new _color_rgba_64_js__WEBPACK_IMPORTED_MODULE_0__.ColorRGBA64(1, 1, 1, 1),
        };
        fullColorScaleStops[1] = {
            position: baseColorPercent,
            color: this.config.baseColor,
        };
        fullColorScaleStops[2] = {
            position: darkPercent,
            color: darkBaseColor,
        };
        fullColorScaleStops[3] = {
            position: 0.99,
            color: darkestBaseColor,
        };
        fullColorScaleStops[4] = {
            position: 1,
            color: new _color_rgba_64_js__WEBPACK_IMPORTED_MODULE_0__.ColorRGBA64(0, 0, 0, 1),
        };
        const scale = new _color_scale_js__WEBPACK_IMPORTED_MODULE_4__.ColorScale(fullColorScaleStops);
        // Create the palette.
        this.palette = new Array(steps);
        for (let i = 0; i < steps; i++) {
            const c = scale.getColor(i / (steps - 1), _color_interpolation_js__WEBPACK_IMPORTED_MODULE_5__.ColorInterpolationSpace.RGB);
            this.palette[i] = c;
        }
    }
    matchRelativeLuminanceIndex(input, reference) {
        let bestFitValue = Number.MAX_VALUE;
        let bestFitIndex = 0;
        let i = 0;
        const referenceLength = reference.length;
        for (; i < referenceLength; i++) {
            const fitValue = Math.abs((0,_color_converters_js__WEBPACK_IMPORTED_MODULE_2__.rgbToLinearLuminance)(reference[i]) - input);
            if (fitValue < bestFitValue) {
                bestFitValue = fitValue;
                bestFitIndex = i;
            }
        }
        return bestFitIndex;
    }
}
ComponentStateColorPalette.defaultPaletteConfig = {
    baseColor: (0,_parse_color_js__WEBPACK_IMPORTED_MODULE_6__.parseColorHexRGB)("#808080"),
    steps: 94,
};


/***/ }),

/***/ "../../packages/utilities/fast-colors/dist/math-utilities.js":
/*!*******************************************************************!*\
  !*** ../../packages/utilities/fast-colors/dist/math-utilities.js ***!
  \*******************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "clamp": () => (/* binding */ clamp),
/* harmony export */   "degreesToRadians": () => (/* binding */ degreesToRadians),
/* harmony export */   "denormalize": () => (/* binding */ denormalize),
/* harmony export */   "getHexStringForByte": () => (/* binding */ getHexStringForByte),
/* harmony export */   "lerp": () => (/* binding */ lerp),
/* harmony export */   "lerpAnglesInDegrees": () => (/* binding */ lerpAnglesInDegrees),
/* harmony export */   "lerpAnglesInRadians": () => (/* binding */ lerpAnglesInRadians),
/* harmony export */   "normalize": () => (/* binding */ normalize),
/* harmony export */   "radiansToDegrees": () => (/* binding */ radiansToDegrees),
/* harmony export */   "roundToPrecisionSmall": () => (/* binding */ roundToPrecisionSmall)
/* harmony export */ });
/**
 * Ensures that an input number does not exceed a max value and is not less than a min value.
 * @param i - the number to clamp
 * @param min - the maximum (inclusive) value
 * @param max - the minimum (inclusive) value
 * @public
 */
function clamp(i, min, max) {
    if (isNaN(i) || i <= min) {
        return min;
    }
    else if (i >= max) {
        return max;
    }
    return i;
}
/**
 * Scales an input to a number between 0 and 1
 * @param i - a number between min and max
 * @param min - the max value
 * @param max - the min value
 * @public
 */
function normalize(i, min, max) {
    if (isNaN(i) || i <= min) {
        return 0.0;
    }
    else if (i >= max) {
        return 1.0;
    }
    return i / (max - min);
}
/**
 * Scales a number between 0 and 1
 * @param i - the number to denormalize
 * @param min - the min value
 * @param max - the max value
 * @public
 */
function denormalize(i, min, max) {
    if (isNaN(i)) {
        return min;
    }
    return min + i * (max - min);
}
/**
 * Converts degrees to radians.
 * @param i - degrees
 * @public
 */
function degreesToRadians(i) {
    return i * (Math.PI / 180.0);
}
/**
 * Converts radians to degrees.
 * @param i - radians
 * @public
 */
function radiansToDegrees(i) {
    return i * (180.0 / Math.PI);
}
/**
 * Converts a number between 0 and 255 to a hex string.
 * @param i - the number to convert to a hex string
 * @public
 */
function getHexStringForByte(i) {
    const s = Math.round(clamp(i, 0.0, 255.0)).toString(16);
    if (s.length === 1) {
        return "0" + s;
    }
    return s;
}
/**
 * Linearly interpolate
 * @public
 */
function lerp(i, min, max) {
    if (isNaN(i) || i <= 0.0) {
        return min;
    }
    else if (i >= 1.0) {
        return max;
    }
    return min + i * (max - min);
}
/**
 * Linearly interpolate angles in degrees
 * @public
 */
function lerpAnglesInDegrees(i, min, max) {
    if (i <= 0.0) {
        return min % 360.0;
    }
    else if (i >= 1.0) {
        return max % 360.0;
    }
    const a = (min - max + 360.0) % 360.0;
    const b = (max - min + 360.0) % 360.0;
    if (a <= b) {
        return (min - a * i + 360.0) % 360.0;
    }
    return (min + a * i + 360.0) % 360.0;
}
const TwoPI = Math.PI * 2;
/**
 * Linearly interpolate angles in radians
 * @public
 */
function lerpAnglesInRadians(i, min, max) {
    if (isNaN(i) || i <= 0.0) {
        return min % TwoPI;
    }
    else if (i >= 1.0) {
        return max % TwoPI;
    }
    const a = (min - max + TwoPI) % TwoPI;
    const b = (max - min + TwoPI) % TwoPI;
    if (a <= b) {
        return (min - a * i + TwoPI) % TwoPI;
    }
    return (min + a * i + TwoPI) % TwoPI;
}
/**
 *
 * Will return infinity if i*10^(precision) overflows number
 * note that floating point rounding rules come into play here
 * so values that end up rounding on a .5 round to the nearest
 * even not always up so 2.5 rounds to 2
 * @param i - the number to round
 * @param precision - the precision to round to
 *
 * @public
 */
function roundToPrecisionSmall(i, precision) {
    const factor = Math.pow(10, precision);
    return Math.round(i * factor) / factor;
}


/***/ }),

/***/ "../../packages/utilities/fast-colors/dist/named-colors.js":
/*!*****************************************************************!*\
  !*** ../../packages/utilities/fast-colors/dist/named-colors.js ***!
  \*****************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "namedColorsConfigs": () => (/* binding */ namedColorsConfigs)
/* harmony export */ });
const namedColorsConfigs = {
    aliceblue: {
        r: 0.941176,
        g: 0.972549,
        b: 1,
    },
    antiquewhite: {
        r: 0.980392,
        g: 0.921569,
        b: 0.843137,
    },
    aqua: {
        r: 0,
        g: 1,
        b: 1,
    },
    aquamarine: {
        r: 0.498039,
        g: 1,
        b: 0.831373,
    },
    azure: {
        r: 0.941176,
        g: 1,
        b: 1,
    },
    beige: {
        r: 0.960784,
        g: 0.960784,
        b: 0.862745,
    },
    bisque: {
        r: 1,
        g: 0.894118,
        b: 0.768627,
    },
    black: {
        r: 0,
        g: 0,
        b: 0,
    },
    blanchedalmond: {
        r: 1,
        g: 0.921569,
        b: 0.803922,
    },
    blue: {
        r: 0,
        g: 0,
        b: 1,
    },
    blueviolet: {
        r: 0.541176,
        g: 0.168627,
        b: 0.886275,
    },
    brown: {
        r: 0.647059,
        g: 0.164706,
        b: 0.164706,
    },
    burlywood: {
        r: 0.870588,
        g: 0.721569,
        b: 0.529412,
    },
    cadetblue: {
        r: 0.372549,
        g: 0.619608,
        b: 0.627451,
    },
    chartreuse: {
        r: 0.498039,
        g: 1,
        b: 0,
    },
    chocolate: {
        r: 0.823529,
        g: 0.411765,
        b: 0.117647,
    },
    coral: {
        r: 1,
        g: 0.498039,
        b: 0.313725,
    },
    cornflowerblue: {
        r: 0.392157,
        g: 0.584314,
        b: 0.929412,
    },
    cornsilk: {
        r: 1,
        g: 0.972549,
        b: 0.862745,
    },
    crimson: {
        r: 0.862745,
        g: 0.078431,
        b: 0.235294,
    },
    cyan: {
        r: 0,
        g: 1,
        b: 1,
    },
    darkblue: {
        r: 0,
        g: 0,
        b: 0.545098,
    },
    darkcyan: {
        r: 0,
        g: 0.545098,
        b: 0.545098,
    },
    darkgoldenrod: {
        r: 0.721569,
        g: 0.52549,
        b: 0.043137,
    },
    darkgray: {
        r: 0.662745,
        g: 0.662745,
        b: 0.662745,
    },
    darkgreen: {
        r: 0,
        g: 0.392157,
        b: 0,
    },
    darkgrey: {
        r: 0.662745,
        g: 0.662745,
        b: 0.662745,
    },
    darkkhaki: {
        r: 0.741176,
        g: 0.717647,
        b: 0.419608,
    },
    darkmagenta: {
        r: 0.545098,
        g: 0,
        b: 0.545098,
    },
    darkolivegreen: {
        r: 0.333333,
        g: 0.419608,
        b: 0.184314,
    },
    darkorange: {
        r: 1,
        g: 0.54902,
        b: 0,
    },
    darkorchid: {
        r: 0.6,
        g: 0.196078,
        b: 0.8,
    },
    darkred: {
        r: 0.545098,
        g: 0,
        b: 0,
    },
    darksalmon: {
        r: 0.913725,
        g: 0.588235,
        b: 0.478431,
    },
    darkseagreen: {
        r: 0.560784,
        g: 0.737255,
        b: 0.560784,
    },
    darkslateblue: {
        r: 0.282353,
        g: 0.239216,
        b: 0.545098,
    },
    darkslategray: {
        r: 0.184314,
        g: 0.309804,
        b: 0.309804,
    },
    darkslategrey: {
        r: 0.184314,
        g: 0.309804,
        b: 0.309804,
    },
    darkturquoise: {
        r: 0,
        g: 0.807843,
        b: 0.819608,
    },
    darkviolet: {
        r: 0.580392,
        g: 0,
        b: 0.827451,
    },
    deeppink: {
        r: 1,
        g: 0.078431,
        b: 0.576471,
    },
    deepskyblue: {
        r: 0,
        g: 0.74902,
        b: 1,
    },
    dimgray: {
        r: 0.411765,
        g: 0.411765,
        b: 0.411765,
    },
    dimgrey: {
        r: 0.411765,
        g: 0.411765,
        b: 0.411765,
    },
    dodgerblue: {
        r: 0.117647,
        g: 0.564706,
        b: 1,
    },
    firebrick: {
        r: 0.698039,
        g: 0.133333,
        b: 0.133333,
    },
    floralwhite: {
        r: 1,
        g: 0.980392,
        b: 0.941176,
    },
    forestgreen: {
        r: 0.133333,
        g: 0.545098,
        b: 0.133333,
    },
    fuchsia: {
        r: 1,
        g: 0,
        b: 1,
    },
    gainsboro: {
        r: 0.862745,
        g: 0.862745,
        b: 0.862745,
    },
    ghostwhite: {
        r: 0.972549,
        g: 0.972549,
        b: 1,
    },
    gold: {
        r: 1,
        g: 0.843137,
        b: 0,
    },
    goldenrod: {
        r: 0.854902,
        g: 0.647059,
        b: 0.12549,
    },
    gray: {
        r: 0.501961,
        g: 0.501961,
        b: 0.501961,
    },
    green: {
        r: 0,
        g: 0.501961,
        b: 0,
    },
    greenyellow: {
        r: 0.678431,
        g: 1,
        b: 0.184314,
    },
    grey: {
        r: 0.501961,
        g: 0.501961,
        b: 0.501961,
    },
    honeydew: {
        r: 0.941176,
        g: 1,
        b: 0.941176,
    },
    hotpink: {
        r: 1,
        g: 0.411765,
        b: 0.705882,
    },
    indianred: {
        r: 0.803922,
        g: 0.360784,
        b: 0.360784,
    },
    indigo: {
        r: 0.294118,
        g: 0,
        b: 0.509804,
    },
    ivory: {
        r: 1,
        g: 1,
        b: 0.941176,
    },
    khaki: {
        r: 0.941176,
        g: 0.901961,
        b: 0.54902,
    },
    lavender: {
        r: 0.901961,
        g: 0.901961,
        b: 0.980392,
    },
    lavenderblush: {
        r: 1,
        g: 0.941176,
        b: 0.960784,
    },
    lawngreen: {
        r: 0.486275,
        g: 0.988235,
        b: 0,
    },
    lemonchiffon: {
        r: 1,
        g: 0.980392,
        b: 0.803922,
    },
    lightblue: {
        r: 0.678431,
        g: 0.847059,
        b: 0.901961,
    },
    lightcoral: {
        r: 0.941176,
        g: 0.501961,
        b: 0.501961,
    },
    lightcyan: {
        r: 0.878431,
        g: 1,
        b: 1,
    },
    lightgoldenrodyellow: {
        r: 0.980392,
        g: 0.980392,
        b: 0.823529,
    },
    lightgray: {
        r: 0.827451,
        g: 0.827451,
        b: 0.827451,
    },
    lightgreen: {
        r: 0.564706,
        g: 0.933333,
        b: 0.564706,
    },
    lightgrey: {
        r: 0.827451,
        g: 0.827451,
        b: 0.827451,
    },
    lightpink: {
        r: 1,
        g: 0.713725,
        b: 0.756863,
    },
    lightsalmon: {
        r: 1,
        g: 0.627451,
        b: 0.478431,
    },
    lightseagreen: {
        r: 0.12549,
        g: 0.698039,
        b: 0.666667,
    },
    lightskyblue: {
        r: 0.529412,
        g: 0.807843,
        b: 0.980392,
    },
    lightslategray: {
        r: 0.466667,
        g: 0.533333,
        b: 0.6,
    },
    lightslategrey: {
        r: 0.466667,
        g: 0.533333,
        b: 0.6,
    },
    lightsteelblue: {
        r: 0.690196,
        g: 0.768627,
        b: 0.870588,
    },
    lightyellow: {
        r: 1,
        g: 1,
        b: 0.878431,
    },
    lime: {
        r: 0,
        g: 1,
        b: 0,
    },
    limegreen: {
        r: 0.196078,
        g: 0.803922,
        b: 0.196078,
    },
    linen: {
        r: 0.980392,
        g: 0.941176,
        b: 0.901961,
    },
    magenta: {
        r: 1,
        g: 0,
        b: 1,
    },
    maroon: {
        r: 0.501961,
        g: 0,
        b: 0,
    },
    mediumaquamarine: {
        r: 0.4,
        g: 0.803922,
        b: 0.666667,
    },
    mediumblue: {
        r: 0,
        g: 0,
        b: 0.803922,
    },
    mediumorchid: {
        r: 0.729412,
        g: 0.333333,
        b: 0.827451,
    },
    mediumpurple: {
        r: 0.576471,
        g: 0.439216,
        b: 0.858824,
    },
    mediumseagreen: {
        r: 0.235294,
        g: 0.701961,
        b: 0.443137,
    },
    mediumslateblue: {
        r: 0.482353,
        g: 0.407843,
        b: 0.933333,
    },
    mediumspringgreen: {
        r: 0,
        g: 0.980392,
        b: 0.603922,
    },
    mediumturquoise: {
        r: 0.282353,
        g: 0.819608,
        b: 0.8,
    },
    mediumvioletred: {
        r: 0.780392,
        g: 0.082353,
        b: 0.521569,
    },
    midnightblue: {
        r: 0.098039,
        g: 0.098039,
        b: 0.439216,
    },
    mintcream: {
        r: 0.960784,
        g: 1,
        b: 0.980392,
    },
    mistyrose: {
        r: 1,
        g: 0.894118,
        b: 0.882353,
    },
    moccasin: {
        r: 1,
        g: 0.894118,
        b: 0.709804,
    },
    navajowhite: {
        r: 1,
        g: 0.870588,
        b: 0.678431,
    },
    navy: {
        r: 0,
        g: 0,
        b: 0.501961,
    },
    oldlace: {
        r: 0.992157,
        g: 0.960784,
        b: 0.901961,
    },
    olive: {
        r: 0.501961,
        g: 0.501961,
        b: 0,
    },
    olivedrab: {
        r: 0.419608,
        g: 0.556863,
        b: 0.137255,
    },
    orange: {
        r: 1,
        g: 0.647059,
        b: 0,
    },
    orangered: {
        r: 1,
        g: 0.270588,
        b: 0,
    },
    orchid: {
        r: 0.854902,
        g: 0.439216,
        b: 0.839216,
    },
    palegoldenrod: {
        r: 0.933333,
        g: 0.909804,
        b: 0.666667,
    },
    palegreen: {
        r: 0.596078,
        g: 0.984314,
        b: 0.596078,
    },
    paleturquoise: {
        r: 0.686275,
        g: 0.933333,
        b: 0.933333,
    },
    palevioletred: {
        r: 0.858824,
        g: 0.439216,
        b: 0.576471,
    },
    papayawhip: {
        r: 1,
        g: 0.937255,
        b: 0.835294,
    },
    peachpuff: {
        r: 1,
        g: 0.854902,
        b: 0.72549,
    },
    peru: {
        r: 0.803922,
        g: 0.521569,
        b: 0.247059,
    },
    pink: {
        r: 1,
        g: 0.752941,
        b: 0.796078,
    },
    plum: {
        r: 0.866667,
        g: 0.627451,
        b: 0.866667,
    },
    powderblue: {
        r: 0.690196,
        g: 0.878431,
        b: 0.901961,
    },
    purple: {
        r: 0.501961,
        g: 0,
        b: 0.501961,
    },
    red: {
        r: 1,
        g: 0,
        b: 0,
    },
    rosybrown: {
        r: 0.737255,
        g: 0.560784,
        b: 0.560784,
    },
    royalblue: {
        r: 0.254902,
        g: 0.411765,
        b: 0.882353,
    },
    saddlebrown: {
        r: 0.545098,
        g: 0.270588,
        b: 0.07451,
    },
    salmon: {
        r: 0.980392,
        g: 0.501961,
        b: 0.447059,
    },
    sandybrown: {
        r: 0.956863,
        g: 0.643137,
        b: 0.376471,
    },
    seagreen: {
        r: 0.180392,
        g: 0.545098,
        b: 0.341176,
    },
    seashell: {
        r: 1,
        g: 0.960784,
        b: 0.933333,
    },
    sienna: {
        r: 0.627451,
        g: 0.321569,
        b: 0.176471,
    },
    silver: {
        r: 0.752941,
        g: 0.752941,
        b: 0.752941,
    },
    skyblue: {
        r: 0.529412,
        g: 0.807843,
        b: 0.921569,
    },
    slateblue: {
        r: 0.415686,
        g: 0.352941,
        b: 0.803922,
    },
    slategray: {
        r: 0.439216,
        g: 0.501961,
        b: 0.564706,
    },
    slategrey: {
        r: 0.439216,
        g: 0.501961,
        b: 0.564706,
    },
    snow: {
        r: 1,
        g: 0.980392,
        b: 0.980392,
    },
    springgreen: {
        r: 0,
        g: 1,
        b: 0.498039,
    },
    steelblue: {
        r: 0.27451,
        g: 0.509804,
        b: 0.705882,
    },
    tan: {
        r: 0.823529,
        g: 0.705882,
        b: 0.54902,
    },
    teal: {
        r: 0,
        g: 0.501961,
        b: 0.501961,
    },
    thistle: {
        r: 0.847059,
        g: 0.74902,
        b: 0.847059,
    },
    tomato: {
        r: 1,
        g: 0.388235,
        b: 0.278431,
    },
    transparent: {
        r: 0,
        g: 0,
        b: 0,
        a: 0,
    },
    turquoise: {
        r: 0.25098,
        g: 0.878431,
        b: 0.815686,
    },
    violet: {
        r: 0.933333,
        g: 0.509804,
        b: 0.933333,
    },
    wheat: {
        r: 0.960784,
        g: 0.870588,
        b: 0.701961,
    },
    white: {
        r: 1,
        g: 1,
        b: 1,
    },
    whitesmoke: {
        r: 0.960784,
        g: 0.960784,
        b: 0.960784,
    },
    yellow: {
        r: 1,
        g: 1,
        b: 0,
    },
    yellowgreen: {
        r: 0.603922,
        g: 0.803922,
        b: 0.196078,
    },
};


/***/ }),

/***/ "../../packages/utilities/fast-colors/dist/parse-color.js":
/*!****************************************************************!*\
  !*** ../../packages/utilities/fast-colors/dist/parse-color.js ***!
  \****************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "isColorNamed": () => (/* binding */ isColorNamed),
/* harmony export */   "isColorStringHexARGB": () => (/* binding */ isColorStringHexARGB),
/* harmony export */   "isColorStringHexRGB": () => (/* binding */ isColorStringHexRGB),
/* harmony export */   "isColorStringHexRGBA": () => (/* binding */ isColorStringHexRGBA),
/* harmony export */   "isColorStringWebRGB": () => (/* binding */ isColorStringWebRGB),
/* harmony export */   "isColorStringWebRGBA": () => (/* binding */ isColorStringWebRGBA),
/* harmony export */   "parseColor": () => (/* binding */ parseColor),
/* harmony export */   "parseColorHexARGB": () => (/* binding */ parseColorHexARGB),
/* harmony export */   "parseColorHexRGB": () => (/* binding */ parseColorHexRGB),
/* harmony export */   "parseColorHexRGBA": () => (/* binding */ parseColorHexRGBA),
/* harmony export */   "parseColorNamed": () => (/* binding */ parseColorNamed),
/* harmony export */   "parseColorWebRGB": () => (/* binding */ parseColorWebRGB),
/* harmony export */   "parseColorWebRGBA": () => (/* binding */ parseColorWebRGBA)
/* harmony export */ });
/* harmony import */ var _color_rgba_64_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./color-rgba-64.js */ "../../packages/utilities/fast-colors/dist/color-rgba-64.js");
/* harmony import */ var _math_utilities_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./math-utilities.js */ "../../packages/utilities/fast-colors/dist/math-utilities.js");
/* harmony import */ var _named_colors_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./named-colors.js */ "../../packages/utilities/fast-colors/dist/named-colors.js");



// Matches rgb(R, G, B) where R, G, and B are integers [0 - 255]
const webRGBRegex = /^rgb\(\s*((?:(?:25[0-5]|2[0-4]\d|1\d\d|\d{1,2})\s*,\s*){2}(?:25[0-5]|2[0-4]\d|1\d\d|\d{1,2})\s*)\)$/i;
// Matches rgb(R, G, B, A) where R, G, and B are integers [0 - 255] and A is [0-1] floating
const webRGBARegex = /^rgba\(\s*((?:(?:25[0-5]|2[0-4]\d|1\d\d|\d{1,2})\s*,\s*){3}(?:0|1|0?\.\d*)\s*)\)$/i;
// Matches #RGB and #RRGGBB, where R, G, and B are [0-9] or [A-F]
const hexRGBRegex = /^#((?:[0-9a-f]{6}|[0-9a-f]{3}))$/i;
// Matches #RGB and #RRGGBBAA, where R, G, B, and A are [0-9] or [A-F]
const hexRGBARegex = /^#((?:[0-9a-f]{8}|[0-9a-f]{4}))$/i;
/**
 * Test if a color matches #RRGGBB or #RGB
 * @public
 */
function isColorStringHexRGB(raw) {
    return hexRGBRegex.test(raw);
}
/**
 * Test if a color matches #AARRGGBB or #ARGB
 * @public
 */
function isColorStringHexARGB(raw) {
    return hexRGBARegex.test(raw);
}
/**
 * Test if a color matches #RRGGBBAA or #RGBA
 * @public
 */
function isColorStringHexRGBA(raw) {
    return isColorStringHexARGB(raw); // No way to differentiate these two formats, so just use the same test
}
/**
 * Test if a color matches rgb(rr, gg, bb)
 * @public
 */
function isColorStringWebRGB(raw) {
    return webRGBRegex.test(raw);
}
/**
 * Test if a color matches rgba(rr, gg, bb, aa)
 *
 * @public
 */
function isColorStringWebRGBA(raw) {
    return webRGBARegex.test(raw);
}
/**
 * Tests whether a color is in {@link @microsoft/fast-colors#NamedColors}.
 * @param raw - the color name to test
 * @public
 */
function isColorNamed(raw) {
    return _named_colors_js__WEBPACK_IMPORTED_MODULE_0__.namedColorsConfigs.hasOwnProperty(raw);
}
/**
 * Converts a hexadecimal color string to a {@link @microsoft/fast-colors#ColorRGBA64}.
 * @param raw - a color string in the form of "#RRGGBB" or "#RGB"
 * @example
 * ```ts
 * parseColorHexRGBA("#FF0000");
 * parseColorHexRGBA("#F00");
 * ```
 * @public
 */
function parseColorHexRGB(raw) {
    const result = hexRGBRegex.exec(raw);
    if (result === null) {
        return null;
    }
    let digits = result[1];
    if (digits.length === 3) {
        const r = digits.charAt(0);
        const g = digits.charAt(1);
        const b = digits.charAt(2);
        digits = r.concat(r, g, g, b, b);
    }
    const rawInt = parseInt(digits, 16);
    if (isNaN(rawInt)) {
        return null;
    }
    // Note the use of >>> rather than >> as we want JS to manipulate these as unsigned numbers
    return new _color_rgba_64_js__WEBPACK_IMPORTED_MODULE_1__.ColorRGBA64((0,_math_utilities_js__WEBPACK_IMPORTED_MODULE_2__.normalize)((rawInt & 0xff0000) >>> 16, 0, 255), (0,_math_utilities_js__WEBPACK_IMPORTED_MODULE_2__.normalize)((rawInt & 0x00ff00) >>> 8, 0, 255), (0,_math_utilities_js__WEBPACK_IMPORTED_MODULE_2__.normalize)(rawInt & 0x0000ff, 0, 255), 1);
}
/**
 * Converts a hexadecimal color string to a {@link @microsoft/fast-colors#ColorRGBA64}.
 * @param raw - a color string in the form of "#AARRGGBB" or "#ARGB"
 * @example
 * ```ts
 * parseColorHexRGBA("#AAFF0000");
 * parseColorHexRGBA("#AF00");
 * ```
 * @public
 */
function parseColorHexARGB(raw) {
    const result = hexRGBARegex.exec(raw);
    if (result === null) {
        return null;
    }
    let digits = result[1];
    if (digits.length === 4) {
        const a = digits.charAt(0);
        const r = digits.charAt(1);
        const g = digits.charAt(2);
        const b = digits.charAt(3);
        digits = a.concat(a, r, r, g, g, b, b);
    }
    const rawInt = parseInt(digits, 16);
    if (isNaN(rawInt)) {
        return null;
    }
    // Note the use of >>> rather than >> as we want JS to manipulate these as unsigned numbers
    return new _color_rgba_64_js__WEBPACK_IMPORTED_MODULE_1__.ColorRGBA64((0,_math_utilities_js__WEBPACK_IMPORTED_MODULE_2__.normalize)((rawInt & 0x00ff0000) >>> 16, 0, 255), (0,_math_utilities_js__WEBPACK_IMPORTED_MODULE_2__.normalize)((rawInt & 0x0000ff00) >>> 8, 0, 255), (0,_math_utilities_js__WEBPACK_IMPORTED_MODULE_2__.normalize)(rawInt & 0x000000ff, 0, 255), (0,_math_utilities_js__WEBPACK_IMPORTED_MODULE_2__.normalize)((rawInt & 0xff000000) >>> 24, 0, 255));
}
/**
 * Converts a hexadecimal color string to a {@link @microsoft/fast-colors#ColorRGBA64}.
 * @param raw - a color string in the form of "#RRGGBBAA" or "#RGBA"
 * @example
 * ```ts
 * parseColorHexRGBA("#FF0000AA");
 * parseColorHexRGBA("#F00A");
 * ```
 * @public
 */
function parseColorHexRGBA(raw) {
    const result = hexRGBARegex.exec(raw);
    if (result === null) {
        return null;
    }
    let digits = result[1];
    if (digits.length === 4) {
        const r = digits.charAt(0);
        const g = digits.charAt(1);
        const b = digits.charAt(2);
        const a = digits.charAt(3);
        digits = r.concat(r, g, g, b, b, a, a);
    }
    const rawInt = parseInt(digits, 16);
    if (isNaN(rawInt)) {
        return null;
    }
    // Note the use of >>> rather than >> as we want JS to manipulate these as unsigned numbers
    return new _color_rgba_64_js__WEBPACK_IMPORTED_MODULE_1__.ColorRGBA64((0,_math_utilities_js__WEBPACK_IMPORTED_MODULE_2__.normalize)((rawInt & 0xff000000) >>> 24, 0, 255), (0,_math_utilities_js__WEBPACK_IMPORTED_MODULE_2__.normalize)((rawInt & 0x00ff0000) >>> 16, 0, 255), (0,_math_utilities_js__WEBPACK_IMPORTED_MODULE_2__.normalize)((rawInt & 0x0000ff00) >>> 8, 0, 255), (0,_math_utilities_js__WEBPACK_IMPORTED_MODULE_2__.normalize)(rawInt & 0x000000ff, 0, 255));
}
/**
 * Converts a rgb color string to a {@link @microsoft/fast-colors#ColorRGBA64}.
 * @param raw - a color string format "rgba(RR,GG,BB)" where RR,GG,BB are [0,255]
 * @example
 * ```ts
 * parseColorWebRGB("rgba(255, 0, 0");
 * ```
 * @public
 */
function parseColorWebRGB(raw) {
    const result = webRGBRegex.exec(raw);
    if (result === null) {
        return null;
    }
    const split = result[1].split(",");
    return new _color_rgba_64_js__WEBPACK_IMPORTED_MODULE_1__.ColorRGBA64((0,_math_utilities_js__WEBPACK_IMPORTED_MODULE_2__.normalize)(Number(split[0]), 0, 255), (0,_math_utilities_js__WEBPACK_IMPORTED_MODULE_2__.normalize)(Number(split[1]), 0, 255), (0,_math_utilities_js__WEBPACK_IMPORTED_MODULE_2__.normalize)(Number(split[2]), 0, 255), 1);
}
/**
 * Converts a rgba color string to a {@link @microsoft/fast-colors#ColorRGBA64}.
 * @param raw - a color string format "rgba(RR,GG,BB,a)" where RR,GG,BB are [0,255] and a is [0,1]
 * @example
 * ```ts
 * parseColorWebRGBA("rgba(255, 0, 0, 1");
 * ```
 * @public
 */
function parseColorWebRGBA(raw) {
    const result = webRGBARegex.exec(raw);
    if (result === null) {
        return null;
    }
    const split = result[1].split(",");
    if (split.length === 4) {
        return new _color_rgba_64_js__WEBPACK_IMPORTED_MODULE_1__.ColorRGBA64((0,_math_utilities_js__WEBPACK_IMPORTED_MODULE_2__.normalize)(Number(split[0]), 0, 255), (0,_math_utilities_js__WEBPACK_IMPORTED_MODULE_2__.normalize)(Number(split[1]), 0, 255), (0,_math_utilities_js__WEBPACK_IMPORTED_MODULE_2__.normalize)(Number(split[2]), 0, 255), Number(split[3]));
    }
    return null;
}
/**
 * Converts a named color to a {@link @microsoft/fast-colors#ColorRGBA64}.
 * @param raw - a {@link https://www.w3schools.com/colors/colors_names.asp | CSS color name}.
 * @example
 * ```ts
 * parseColorNamed("red");
 * ```
 * @public
 */
function parseColorNamed(raw) {
    // const rawLower: typeof raw =  raw.toLowerCase() : raw.toString();
    const config = _named_colors_js__WEBPACK_IMPORTED_MODULE_0__.namedColorsConfigs[raw.toLowerCase()];
    return config
        ? new _color_rgba_64_js__WEBPACK_IMPORTED_MODULE_1__.ColorRGBA64(config.r, config.g, config.b, config.hasOwnProperty("a") ? config.a : void 0)
        : null;
}
/**
 *
  Expects any of the following and attempts to determine which is being used
 * #RRGGBB, #AARRGGBB, rgb(RR,GG,BB) rgba(RR,GG,BB,a),
 * or any of the {@link https://www.w3schools.com/colors/colors_names.asp | CSS color names}.
 * @param raw - the color string to parse
 * @public
 */
function parseColor(raw) {
    const rawLower = raw.toLowerCase();
    return isColorStringHexRGB(rawLower)
        ? parseColorHexRGB(rawLower)
        : isColorStringHexRGBA(rawLower)
            ? parseColorHexARGB(rawLower)
            : isColorStringWebRGB(rawLower)
                ? parseColorWebRGB(rawLower)
                : isColorStringWebRGBA(rawLower)
                    ? parseColorWebRGBA(rawLower)
                    : isColorNamed(rawLower)
                        ? parseColorNamed(rawLower)
                        : null;
}


/***/ }),

/***/ "./node_modules/@microsoft/fast-components/dist/esm/anchor/anchor.styles.js":
/*!**********************************************************************************!*\
  !*** ./node_modules/@microsoft/fast-components/dist/esm/anchor/anchor.styles.js ***!
  \**********************************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "anchorStyles": () => (/* binding */ anchorStyles)
/* harmony export */ });
/* harmony import */ var _microsoft_fast_element__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @microsoft/fast-element */ "./node_modules/@microsoft/fast-element/dist/esm/styles/css.js");
/* harmony import */ var _styles_index_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../styles/index.js */ "./node_modules/@microsoft/fast-components/dist/esm/styles/patterns/button.js");
/* harmony import */ var _utilities_behaviors_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../utilities/behaviors.js */ "./node_modules/@microsoft/fast-components/dist/esm/utilities/behaviors.js");



/**
 * Styles for Anchor
 * @public
 */
const anchorStyles = (context, definition) => _microsoft_fast_element__WEBPACK_IMPORTED_MODULE_0__.css `
        ${_styles_index_js__WEBPACK_IMPORTED_MODULE_1__.BaseButtonStyles}
    `.withBehaviors(
        (0,_utilities_behaviors_js__WEBPACK_IMPORTED_MODULE_2__.appearanceBehavior)("accent", _styles_index_js__WEBPACK_IMPORTED_MODULE_1__.AccentButtonStyles),
       // (0,_utilities_behaviors_js__WEBPACK_IMPORTED_MODULE_2__.appearanceBehavior)("hypertext", _styles_index_js__WEBPACK_IMPORTED_MODULE_1__.HypertextStyles), (0,_utilities_behaviors_js__WEBPACK_IMPORTED_MODULE_2__.appearanceBehavior)("lightweight", _styles_index_js__WEBPACK_IMPORTED_MODULE_1__.LightweightButtonStyles), (0,_utilities_behaviors_js__WEBPACK_IMPORTED_MODULE_2__.appearanceBehavior)("outline", _styles_index_js__WEBPACK_IMPORTED_MODULE_1__.OutlineButtonStyles), (0,_utilities_behaviors_js__WEBPACK_IMPORTED_MODULE_2__.appearanceBehavior)("stealth", _styles_index_js__WEBPACK_IMPORTED_MODULE_1__.StealthButtonStyles)
        );


/***/ }),

/***/ "./node_modules/@microsoft/fast-components/dist/esm/anchor/index.js":
/*!**************************************************************************!*\
  !*** ./node_modules/@microsoft/fast-components/dist/esm/anchor/index.js ***!
  \**************************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "Anchor": () => (/* binding */ Anchor),
/* harmony export */   "anchorStyles": () => (/* reexport safe */ _anchor_styles_js__WEBPACK_IMPORTED_MODULE_4__.anchorStyles),
/* harmony export */   "fastAnchor": () => (/* binding */ fastAnchor)
/* harmony export */ });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! tslib */ "./node_modules/tslib/tslib.es6.js");
/* harmony import */ var _microsoft_fast_element__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @microsoft/fast-element */ "./node_modules/@microsoft/fast-element/dist/esm/components/attributes.js");
/* harmony import */ var _microsoft_fast_foundation__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @microsoft/fast-foundation */ "./node_modules/@microsoft/fast-foundation/dist/esm/anchor/anchor.js");
/* harmony import */ var _microsoft_fast_foundation__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @microsoft/fast-foundation */ "./node_modules/@microsoft/fast-foundation/dist/esm/anchor/anchor.template.js");
/* harmony import */ var _anchor_styles_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./anchor.styles.js */ "./node_modules/@microsoft/fast-components/dist/esm/anchor/anchor.styles.js");




/**
 * Base class for Anchor
 * @public
 */
class Anchor extends _microsoft_fast_foundation__WEBPACK_IMPORTED_MODULE_0__.Anchor {
    appearanceChanged(oldValue, newValue) {
        if (this.$fastController.isConnected) {
            this.classList.remove(oldValue);
            this.classList.add(newValue);
        }
    }
    connectedCallback() {
        super.connectedCallback();
        if (!this.appearance) {
            this.appearance = "neutral";
        }
    }
    /**
     * Applies 'icon-only' class when there is only an SVG in the default slot
     *
     * @internal
     *
     */
    defaultSlottedContentChanged(oldValue, newValue) {
        const slottedElements = this.defaultSlottedContent.filter(x => x.nodeType === Node.ELEMENT_NODE);
        if (slottedElements.length === 1 && slottedElements[0] instanceof SVGElement) {
            this.control.classList.add("icon-only");
        }
        else {
            this.control.classList.remove("icon-only");
        }
    }
}
(0,tslib__WEBPACK_IMPORTED_MODULE_1__.__decorate)([
    _microsoft_fast_element__WEBPACK_IMPORTED_MODULE_2__.attr
], Anchor.prototype, "appearance", void 0);
/**
 * A function that returns a {@link @microsoft/fast-foundation#Anchor} registration for configuring the component with a DesignSystem.
 * Implements {@link @microsoft/fast-foundation#anchorTemplate}
 *
 *
 * @public
 * @remarks
 * Generates HTML Element: `<fast-anchor>`
 *
 * {@link https://developer.mozilla.org/en-US/docs/Web/API/ShadowRoot/delegatesFocus | delegatesFocus}
 */
const fastAnchor = Anchor.compose({
    baseName: "anchor",
    baseClass: _microsoft_fast_foundation__WEBPACK_IMPORTED_MODULE_0__.Anchor,
    template: _microsoft_fast_foundation__WEBPACK_IMPORTED_MODULE_3__.anchorTemplate,
    styles: _anchor_styles_js__WEBPACK_IMPORTED_MODULE_4__.anchorStyles,
    shadowOptions: {
        delegatesFocus: true,
    },
});



/***/ }),

/***/ "./node_modules/@microsoft/fast-components/dist/esm/color/palette.js":
/*!***************************************************************************!*\
  !*** ./node_modules/@microsoft/fast-components/dist/esm/color/palette.js ***!
  \***************************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "PaletteRGB": () => (/* binding */ PaletteRGB)
/* harmony export */ });
/* harmony import */ var _microsoft_fast_colors__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @microsoft/fast-colors */ "../../packages/utilities/fast-colors/dist/math-utilities.js");
/* harmony import */ var _microsoft_fast_colors__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! @microsoft/fast-colors */ "../../packages/utilities/fast-colors/dist/component-state-color-palette.js");
/* harmony import */ var _microsoft_fast_colors__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! @microsoft/fast-colors */ "../../packages/utilities/fast-colors/dist/color-rgba-64.js");
/* harmony import */ var _microsoft_fast_colors__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! @microsoft/fast-colors */ "../../packages/utilities/fast-colors/dist/parse-color.js");
/* harmony import */ var _swatch_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./swatch.js */ "./node_modules/@microsoft/fast-components/dist/esm/color/swatch.js");
/* harmony import */ var _utilities_binary_search_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./utilities/binary-search.js */ "./node_modules/@microsoft/fast-components/dist/esm/color/utilities/binary-search.js");
/* harmony import */ var _utilities_direction_by_is_dark_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./utilities/direction-by-is-dark.js */ "./node_modules/@microsoft/fast-components/dist/esm/color/utilities/direction-by-is-dark.js");
/* harmony import */ var _utilities_relative_luminance_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./utilities/relative-luminance.js */ "./node_modules/@microsoft/fast-components/dist/esm/color/utilities/relative-luminance.js");





function create(rOrSource, g, b) {
    if (typeof rOrSource === "number") {
        /* eslint-disable-next-line @typescript-eslint/no-non-null-assertion */
        return PaletteRGB.from(_swatch_js__WEBPACK_IMPORTED_MODULE_0__.SwatchRGB.create(rOrSource, g, b));
    }
    else {
        return PaletteRGB.from(rOrSource);
    }
}
function from(source) {
    return (0,_swatch_js__WEBPACK_IMPORTED_MODULE_0__.isSwatchRGB)(source)
        ? PaletteRGBImpl.from(source)
        : PaletteRGBImpl.from(_swatch_js__WEBPACK_IMPORTED_MODULE_0__.SwatchRGB.create(source.r, source.g, source.b));
}
/** @public */
const PaletteRGB = Object.freeze({
    create,
    from,
});
/**
 * A {@link Palette} representing RGB swatch values.
 * @public
 */
class PaletteRGBImpl {
    /**
     *
     * @param source - The source color for the palette
     * @param swatches - All swatches in the palette
     */
    constructor(source, swatches) {
        this.closestIndexCache = new Map();
        this.source = source;
        this.swatches = swatches;
        this.reversedSwatches = Object.freeze([...this.swatches].reverse());
        this.lastIndex = this.swatches.length - 1;
    }
    /**
     * {@inheritdoc Palette.colorContrast}
     */
    colorContrast(reference, contrastTarget, initialSearchIndex, direction) {
        if (initialSearchIndex === undefined) {
            initialSearchIndex = this.closestIndexOf(reference);
        }
        let source = this.swatches;
        const endSearchIndex = this.lastIndex;
        let startSearchIndex = initialSearchIndex;
        if (direction === undefined) {
            direction = (0,_utilities_direction_by_is_dark_js__WEBPACK_IMPORTED_MODULE_1__.directionByIsDark)(reference);
        }
        const condition = (value) => (0,_utilities_relative_luminance_js__WEBPACK_IMPORTED_MODULE_2__.contrast)(reference, value) >= contrastTarget;
        if (direction === -1) {
            source = this.reversedSwatches;
            startSearchIndex = endSearchIndex - startSearchIndex;
        }
        return (0,_utilities_binary_search_js__WEBPACK_IMPORTED_MODULE_3__.binarySearch)(source, condition, startSearchIndex, endSearchIndex);
    }
    /**
     * {@inheritdoc Palette.get}
     */
    get(index) {
        return this.swatches[index] || this.swatches[(0,_microsoft_fast_colors__WEBPACK_IMPORTED_MODULE_4__.clamp)(index, 0, this.lastIndex)];
    }
    /**
     * {@inheritdoc Palette.closestIndexOf}
     */
    closestIndexOf(reference) {
        if (this.closestIndexCache.has(reference.relativeLuminance)) {
            /* eslint-disable-next-line @typescript-eslint/no-non-null-assertion */
            return this.closestIndexCache.get(reference.relativeLuminance);
        }
        let index = this.swatches.indexOf(reference);
        if (index !== -1) {
            this.closestIndexCache.set(reference.relativeLuminance, index);
            return index;
        }
        const closest = this.swatches.reduce((previous, next) => Math.abs(next.relativeLuminance - reference.relativeLuminance) <
            Math.abs(previous.relativeLuminance - reference.relativeLuminance)
            ? next
            : previous);
        index = this.swatches.indexOf(closest);
        this.closestIndexCache.set(reference.relativeLuminance, index);
        return index;
    }
    /**
     * Create a color palette from a provided swatch
     * @param source - The source swatch to create a palette from
     * @returns
     */
    static from(source) {
        return new PaletteRGBImpl(source, Object.freeze(new _microsoft_fast_colors__WEBPACK_IMPORTED_MODULE_5__.ComponentStateColorPalette({
            /* eslint-disable-next-line @typescript-eslint/no-non-null-assertion */
            baseColor: _microsoft_fast_colors__WEBPACK_IMPORTED_MODULE_6__.ColorRGBA64.fromObject(source),
        }).palette.map(x => {
            /* eslint-disable-next-line @typescript-eslint/no-non-null-assertion */
            const _x = (0,_microsoft_fast_colors__WEBPACK_IMPORTED_MODULE_7__.parseColorHexRGB)(x.toStringHexRGB());
            return _swatch_js__WEBPACK_IMPORTED_MODULE_0__.SwatchRGB.create(_x.r, _x.g, _x.b);
        })));
    }
}


/***/ }),

/***/ "./node_modules/@microsoft/fast-components/dist/esm/color/recipes/accent-fill.js":
/*!***************************************************************************************!*\
  !*** ./node_modules/@microsoft/fast-components/dist/esm/color/recipes/accent-fill.js ***!
  \***************************************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "accentFill": () => (/* binding */ accentFill)
/* harmony export */ });
/**
 * @internal
 */
function accentFill(palette, neutralPalette, reference, hoverDelta, activeDelta, focusDelta, neutralFillRestDelta, neutralFillHoverDelta, neutralFillActiveDelta) {
    const accent = palette.source;
    const referenceIndex = neutralPalette.closestIndexOf(reference);
    const swapThreshold = Math.max(neutralFillRestDelta, neutralFillHoverDelta, neutralFillActiveDelta);
    const direction = referenceIndex >= swapThreshold ? -1 : 1;
    const accentIndex = palette.closestIndexOf(accent);
    const hoverIndex = accentIndex;
    const restIndex = hoverIndex + direction * -1 * hoverDelta;
    const activeIndex = restIndex + direction * activeDelta;
    const focusIndex = restIndex + direction * focusDelta;
    return {
        rest: palette.get(restIndex),
        hover: palette.get(hoverIndex),
        active: palette.get(activeIndex),
        focus: palette.get(focusIndex),
    };
}


/***/ }),

/***/ "./node_modules/@microsoft/fast-components/dist/esm/color/recipes/accent-foreground.js":
/*!*********************************************************************************************!*\
  !*** ./node_modules/@microsoft/fast-components/dist/esm/color/recipes/accent-foreground.js ***!
  \*********************************************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "accentForeground": () => (/* binding */ accentForeground)
/* harmony export */ });
/* harmony import */ var _utilities_direction_by_is_dark_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../utilities/direction-by-is-dark.js */ "./node_modules/@microsoft/fast-components/dist/esm/color/utilities/direction-by-is-dark.js");

/**
 * @internal
 */
function accentForeground(palette, reference, contrastTarget, restDelta, hoverDelta, activeDelta, focusDelta) {
    const accent = palette.source;
    const accentIndex = palette.closestIndexOf(accent);
    const direction = (0,_utilities_direction_by_is_dark_js__WEBPACK_IMPORTED_MODULE_0__.directionByIsDark)(reference);
    const startIndex = accentIndex +
        (direction === 1
            ? Math.min(restDelta, hoverDelta)
            : Math.max(direction * restDelta, direction * hoverDelta));
    const accessibleSwatch = palette.colorContrast(reference, contrastTarget, startIndex, direction);
    const accessibleIndex1 = palette.closestIndexOf(accessibleSwatch);
    const accessibleIndex2 = accessibleIndex1 + direction * Math.abs(restDelta - hoverDelta);
    const indexOneIsRestState = direction === 1
        ? restDelta < hoverDelta
        : direction * restDelta > direction * hoverDelta;
    let restIndex;
    let hoverIndex;
    if (indexOneIsRestState) {
        restIndex = accessibleIndex1;
        hoverIndex = accessibleIndex2;
    }
    else {
        restIndex = accessibleIndex2;
        hoverIndex = accessibleIndex1;
    }
    return {
        rest: palette.get(restIndex),
        hover: palette.get(hoverIndex),
        active: palette.get(restIndex + direction * activeDelta),
        focus: palette.get(restIndex + direction * focusDelta),
    };
}


/***/ }),

/***/ "./node_modules/@microsoft/fast-components/dist/esm/color/recipes/focus-stroke.js":
/*!****************************************************************************************!*\
  !*** ./node_modules/@microsoft/fast-components/dist/esm/color/recipes/focus-stroke.js ***!
  \****************************************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "focusStrokeInner": () => (/* binding */ focusStrokeInner),
/* harmony export */   "focusStrokeOuter": () => (/* binding */ focusStrokeOuter)
/* harmony export */ });
/* harmony import */ var _utilities_direction_by_is_dark_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../utilities/direction-by-is-dark.js */ "./node_modules/@microsoft/fast-components/dist/esm/color/utilities/direction-by-is-dark.js");

/** @internal */
function focusStrokeOuter(palette, reference) {
    return palette.colorContrast(reference, 3.5);
}
/** @internal */
function focusStrokeInner(palette, reference, focusColor) {
    return palette.colorContrast(focusColor, 3.5, palette.closestIndexOf(palette.source), ((0,_utilities_direction_by_is_dark_js__WEBPACK_IMPORTED_MODULE_0__.directionByIsDark)(reference) * -1));
}


/***/ }),

/***/ "./node_modules/@microsoft/fast-components/dist/esm/color/recipes/foreground-on-accent.js":
/*!************************************************************************************************!*\
  !*** ./node_modules/@microsoft/fast-components/dist/esm/color/recipes/foreground-on-accent.js ***!
  \************************************************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "foregroundOnAccent": () => (/* binding */ foregroundOnAccent)
/* harmony export */ });
/* harmony import */ var _utilities_color_constants_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../utilities/color-constants.js */ "./node_modules/@microsoft/fast-components/dist/esm/color/utilities/color-constants.js");

/**
 * @internal
 */
function foregroundOnAccent(reference, contrastTarget) {
    return reference.contrast(_utilities_color_constants_js__WEBPACK_IMPORTED_MODULE_0__.white) >= contrastTarget ? _utilities_color_constants_js__WEBPACK_IMPORTED_MODULE_0__.white : _utilities_color_constants_js__WEBPACK_IMPORTED_MODULE_0__.black;
}


/***/ }),

/***/ "./node_modules/@microsoft/fast-components/dist/esm/color/recipes/neutral-fill-contrast.js":
/*!*************************************************************************************************!*\
  !*** ./node_modules/@microsoft/fast-components/dist/esm/color/recipes/neutral-fill-contrast.js ***!
  \*************************************************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "neutralFillContrast": () => (/* binding */ neutralFillContrast)
/* harmony export */ });
/* harmony import */ var _utilities_direction_by_is_dark_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../utilities/direction-by-is-dark.js */ "./node_modules/@microsoft/fast-components/dist/esm/color/utilities/direction-by-is-dark.js");

/**
 * @internal
 */
function neutralFillContrast(palette, reference, restDelta, hoverDelta, activeDelta, focusDelta) {
    const direction = (0,_utilities_direction_by_is_dark_js__WEBPACK_IMPORTED_MODULE_0__.directionByIsDark)(reference);
    const accessibleIndex = palette.closestIndexOf(palette.colorContrast(reference, 4.5));
    const accessibleIndex2 = accessibleIndex + direction * Math.abs(restDelta - hoverDelta);
    const indexOneIsRest = direction === 1
        ? restDelta < hoverDelta
        : direction * restDelta > direction * hoverDelta;
    let restIndex;
    let hoverIndex;
    if (indexOneIsRest) {
        restIndex = accessibleIndex;
        hoverIndex = accessibleIndex2;
    }
    else {
        restIndex = accessibleIndex2;
        hoverIndex = accessibleIndex;
    }
    return {
        rest: palette.get(restIndex),
        hover: palette.get(hoverIndex),
        active: palette.get(restIndex + direction * activeDelta),
        focus: palette.get(restIndex + direction * focusDelta),
    };
}


/***/ }),

/***/ "./node_modules/@microsoft/fast-components/dist/esm/color/recipes/neutral-fill-input.js":
/*!**********************************************************************************************!*\
  !*** ./node_modules/@microsoft/fast-components/dist/esm/color/recipes/neutral-fill-input.js ***!
  \**********************************************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "neutralFillInput": () => (/* binding */ neutralFillInput)
/* harmony export */ });
/* harmony import */ var _utilities_direction_by_is_dark_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../utilities/direction-by-is-dark.js */ "./node_modules/@microsoft/fast-components/dist/esm/color/utilities/direction-by-is-dark.js");

/**
 * @internal
 */
function neutralFillInput(palette, reference, restDelta, hoverDelta, activeDelta, focusDelta) {
    const direction = (0,_utilities_direction_by_is_dark_js__WEBPACK_IMPORTED_MODULE_0__.directionByIsDark)(reference);
    const referenceIndex = palette.closestIndexOf(reference);
    return {
        rest: palette.get(referenceIndex - direction * restDelta),
        hover: palette.get(referenceIndex - direction * hoverDelta),
        active: palette.get(referenceIndex - direction * activeDelta),
        focus: palette.get(referenceIndex - direction * focusDelta),
    };
}


/***/ }),

/***/ "./node_modules/@microsoft/fast-components/dist/esm/color/recipes/neutral-fill-layer.js":
/*!**********************************************************************************************!*\
  !*** ./node_modules/@microsoft/fast-components/dist/esm/color/recipes/neutral-fill-layer.js ***!
  \**********************************************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "neutralFillLayer": () => (/* binding */ neutralFillLayer)
/* harmony export */ });
/**
 * @internal
 */
function neutralFillLayer(palette, reference, delta) {
    const referenceIndex = palette.closestIndexOf(reference);
    return palette.get(referenceIndex - (referenceIndex < delta ? delta * -1 : delta));
}


/***/ }),

/***/ "./node_modules/@microsoft/fast-components/dist/esm/color/recipes/neutral-fill-stealth.js":
/*!************************************************************************************************!*\
  !*** ./node_modules/@microsoft/fast-components/dist/esm/color/recipes/neutral-fill-stealth.js ***!
  \************************************************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "neutralFillStealth": () => (/* binding */ neutralFillStealth)
/* harmony export */ });
/**
 * @internal
 */
function neutralFillStealth(palette, reference, restDelta, hoverDelta, activeDelta, focusDelta, fillRestDelta, fillHoverDelta, fillActiveDelta, fillFocusDelta) {
    const swapThreshold = Math.max(restDelta, hoverDelta, activeDelta, focusDelta, fillRestDelta, fillHoverDelta, fillActiveDelta, fillFocusDelta);
    const referenceIndex = palette.closestIndexOf(reference);
    const direction = referenceIndex >= swapThreshold ? -1 : 1;
    return {
        rest: palette.get(referenceIndex + direction * restDelta),
        hover: palette.get(referenceIndex + direction * hoverDelta),
        active: palette.get(referenceIndex + direction * activeDelta),
        focus: palette.get(referenceIndex + direction * focusDelta),
    };
}


/***/ }),

/***/ "./node_modules/@microsoft/fast-components/dist/esm/color/recipes/neutral-fill.js":
/*!****************************************************************************************!*\
  !*** ./node_modules/@microsoft/fast-components/dist/esm/color/recipes/neutral-fill.js ***!
  \****************************************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "neutralFill": () => (/* binding */ neutralFill)
/* harmony export */ });
/**
 *
 * @param palette - The palette to operate on
 * @param reference - The reference color to calculate a color for
 * @param delta - The offset from the reference's location
 * @param threshold - Determines if a lighter or darker color than the reference will be picked.
 * @returns
 *
 * @internal
 */
function neutralFill(palette, reference, restDelta, hoverDelta, activeDelta, focusDelta) {
    const referenceIndex = palette.closestIndexOf(reference);
    const threshold = Math.max(restDelta, hoverDelta, activeDelta, focusDelta);
    const direction = referenceIndex >= threshold ? -1 : 1;
    return {
        rest: palette.get(referenceIndex + direction * restDelta),
        hover: palette.get(referenceIndex + direction * hoverDelta),
        active: palette.get(referenceIndex + direction * activeDelta),
        focus: palette.get(referenceIndex + direction * focusDelta),
    };
}


/***/ }),

/***/ "./node_modules/@microsoft/fast-components/dist/esm/color/recipes/neutral-foreground-hint.js":
/*!***************************************************************************************************!*\
  !*** ./node_modules/@microsoft/fast-components/dist/esm/color/recipes/neutral-foreground-hint.js ***!
  \***************************************************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "neutralForegroundHint": () => (/* binding */ neutralForegroundHint)
/* harmony export */ });
/**
 * The neutralForegroundHint color recipe
 * @param palette - The palette to operate on
 * @param reference - The reference color
 *
 * @internal
 */
function neutralForegroundHint(palette, reference) {
    return palette.colorContrast(reference, 4.5);
}


/***/ }),

/***/ "./node_modules/@microsoft/fast-components/dist/esm/color/recipes/neutral-foreground.js":
/*!**********************************************************************************************!*\
  !*** ./node_modules/@microsoft/fast-components/dist/esm/color/recipes/neutral-foreground.js ***!
  \**********************************************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "neutralForeground": () => (/* binding */ neutralForeground)
/* harmony export */ });
/**
 * @internal
 */
function neutralForeground(palette, reference) {
    return palette.colorContrast(reference, 14);
}


/***/ }),

/***/ "./node_modules/@microsoft/fast-components/dist/esm/color/recipes/neutral-layer-1.js":
/*!*******************************************************************************************!*\
  !*** ./node_modules/@microsoft/fast-components/dist/esm/color/recipes/neutral-layer-1.js ***!
  \*******************************************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "neutralLayer1": () => (/* binding */ neutralLayer1)
/* harmony export */ });
/* harmony import */ var _utilities_base_layer_luminance_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../utilities/base-layer-luminance.js */ "./node_modules/@microsoft/fast-components/dist/esm/color/utilities/base-layer-luminance.js");

function neutralLayer1(palette, baseLayerLuminance) {
    return palette.get(palette.closestIndexOf((0,_utilities_base_layer_luminance_js__WEBPACK_IMPORTED_MODULE_0__.baseLayerLuminanceSwatch)(baseLayerLuminance)));
}


/***/ }),

/***/ "./node_modules/@microsoft/fast-components/dist/esm/color/recipes/neutral-layer-2.js":
/*!*******************************************************************************************!*\
  !*** ./node_modules/@microsoft/fast-components/dist/esm/color/recipes/neutral-layer-2.js ***!
  \*******************************************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "neutralLayer2": () => (/* binding */ neutralLayer2),
/* harmony export */   "neutralLayer2Index": () => (/* binding */ neutralLayer2Index)
/* harmony export */ });
/* harmony import */ var _utilities_base_layer_luminance_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../utilities/base-layer-luminance.js */ "./node_modules/@microsoft/fast-components/dist/esm/color/utilities/base-layer-luminance.js");

/**
 * @internal
 */
function neutralLayer2Index(palette, luminance, layerDelta, fillRestDelta, fillHoverDelta, fillActiveDelta) {
    return Math.max(palette.closestIndexOf((0,_utilities_base_layer_luminance_js__WEBPACK_IMPORTED_MODULE_0__.baseLayerLuminanceSwatch)(luminance)) + layerDelta, fillRestDelta, fillHoverDelta, fillActiveDelta);
}
/**
 * @internal
 */
function neutralLayer2(palette, luminance, layerDelta, fillRestDelta, fillHoverDelta, fillActiveDelta) {
    return palette.get(neutralLayer2Index(palette, luminance, layerDelta, fillRestDelta, fillHoverDelta, fillActiveDelta));
}


/***/ }),

/***/ "./node_modules/@microsoft/fast-components/dist/esm/color/recipes/neutral-layer-3.js":
/*!*******************************************************************************************!*\
  !*** ./node_modules/@microsoft/fast-components/dist/esm/color/recipes/neutral-layer-3.js ***!
  \*******************************************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "neutralLayer3": () => (/* binding */ neutralLayer3)
/* harmony export */ });
/* harmony import */ var _neutral_layer_2_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./neutral-layer-2.js */ "./node_modules/@microsoft/fast-components/dist/esm/color/recipes/neutral-layer-2.js");

/**
 * @internal
 */
function neutralLayer3(palette, luminance, layerDelta, fillRestDelta, fillHoverDelta, fillActiveDelta) {
    return palette.get((0,_neutral_layer_2_js__WEBPACK_IMPORTED_MODULE_0__.neutralLayer2Index)(palette, luminance, layerDelta, fillRestDelta, fillHoverDelta, fillActiveDelta) + layerDelta);
}


/***/ }),

/***/ "./node_modules/@microsoft/fast-components/dist/esm/color/recipes/neutral-layer-4.js":
/*!*******************************************************************************************!*\
  !*** ./node_modules/@microsoft/fast-components/dist/esm/color/recipes/neutral-layer-4.js ***!
  \*******************************************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "neutralLayer4": () => (/* binding */ neutralLayer4)
/* harmony export */ });
/* harmony import */ var _neutral_layer_2_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./neutral-layer-2.js */ "./node_modules/@microsoft/fast-components/dist/esm/color/recipes/neutral-layer-2.js");

/**
 * @internal
 */
function neutralLayer4(palette, luminance, layerDelta, fillRestDelta, fillHoverDelta, fillActiveDelta) {
    return palette.get((0,_neutral_layer_2_js__WEBPACK_IMPORTED_MODULE_0__.neutralLayer2Index)(palette, luminance, layerDelta, fillRestDelta, fillHoverDelta, fillActiveDelta) +
        layerDelta * 2);
}


/***/ }),

/***/ "./node_modules/@microsoft/fast-components/dist/esm/color/recipes/neutral-layer-card-container.js":
/*!********************************************************************************************************!*\
  !*** ./node_modules/@microsoft/fast-components/dist/esm/color/recipes/neutral-layer-card-container.js ***!
  \********************************************************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "neutralLayerCardContainer": () => (/* binding */ neutralLayerCardContainer)
/* harmony export */ });
/* harmony import */ var _utilities_base_layer_luminance_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../utilities/base-layer-luminance.js */ "./node_modules/@microsoft/fast-components/dist/esm/color/utilities/base-layer-luminance.js");

/**
 * @internal
 */
function neutralLayerCardContainer(palette, relativeLuminance, layerDelta) {
    return palette.get(palette.closestIndexOf((0,_utilities_base_layer_luminance_js__WEBPACK_IMPORTED_MODULE_0__.baseLayerLuminanceSwatch)(relativeLuminance)) + layerDelta);
}


/***/ }),

/***/ "./node_modules/@microsoft/fast-components/dist/esm/color/recipes/neutral-layer-floating.js":
/*!**************************************************************************************************!*\
  !*** ./node_modules/@microsoft/fast-components/dist/esm/color/recipes/neutral-layer-floating.js ***!
  \**************************************************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "neutralLayerFloating": () => (/* binding */ neutralLayerFloating)
/* harmony export */ });
/* harmony import */ var _utilities_base_layer_luminance_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../utilities/base-layer-luminance.js */ "./node_modules/@microsoft/fast-components/dist/esm/color/utilities/base-layer-luminance.js");

/**
 * @internal
 */
function neutralLayerFloating(palette, relativeLuminance, layerDelta) {
    const cardIndex = palette.closestIndexOf((0,_utilities_base_layer_luminance_js__WEBPACK_IMPORTED_MODULE_0__.baseLayerLuminanceSwatch)(relativeLuminance)) - layerDelta;
    return palette.get(cardIndex - layerDelta);
}


/***/ }),

/***/ "./node_modules/@microsoft/fast-components/dist/esm/color/recipes/neutral-stroke-divider.js":
/*!**************************************************************************************************!*\
  !*** ./node_modules/@microsoft/fast-components/dist/esm/color/recipes/neutral-stroke-divider.js ***!
  \**************************************************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "neutralStrokeDivider": () => (/* binding */ neutralStrokeDivider)
/* harmony export */ });
/* harmony import */ var _utilities_direction_by_is_dark_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../utilities/direction-by-is-dark.js */ "./node_modules/@microsoft/fast-components/dist/esm/color/utilities/direction-by-is-dark.js");

/**
 * The neutralStrokeDivider color recipe
 * @param palette - The palette to operate on
 * @param reference - The reference color
 * @param delta - The offset from the reference
 *
 * @internal
 */
function neutralStrokeDivider(palette, reference, delta) {
    return palette.get(palette.closestIndexOf(reference) + (0,_utilities_direction_by_is_dark_js__WEBPACK_IMPORTED_MODULE_0__.directionByIsDark)(reference) * delta);
}


/***/ }),

/***/ "./node_modules/@microsoft/fast-components/dist/esm/color/recipes/neutral-stroke.js":
/*!******************************************************************************************!*\
  !*** ./node_modules/@microsoft/fast-components/dist/esm/color/recipes/neutral-stroke.js ***!
  \******************************************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "neutralStroke": () => (/* binding */ neutralStroke)
/* harmony export */ });
/* harmony import */ var _utilities_direction_by_is_dark_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../utilities/direction-by-is-dark.js */ "./node_modules/@microsoft/fast-components/dist/esm/color/utilities/direction-by-is-dark.js");

/**
 * @internal
 */
function neutralStroke(palette, reference, restDelta, hoverDelta, activeDelta, focusDelta) {
    const referenceIndex = palette.closestIndexOf(reference);
    const direction = (0,_utilities_direction_by_is_dark_js__WEBPACK_IMPORTED_MODULE_0__.directionByIsDark)(reference);
    const restIndex = referenceIndex + direction * restDelta;
    const hoverIndex = restIndex + direction * (hoverDelta - restDelta);
    const activeIndex = restIndex + direction * (activeDelta - restDelta);
    const focusIndex = restIndex + direction * (focusDelta - restDelta);
    return {
        rest: palette.get(restIndex),
        hover: palette.get(hoverIndex),
        active: palette.get(activeIndex),
        focus: palette.get(focusIndex),
    };
}


/***/ }),

/***/ "./node_modules/@microsoft/fast-components/dist/esm/color/swatch.js":
/*!**************************************************************************!*\
  !*** ./node_modules/@microsoft/fast-components/dist/esm/color/swatch.js ***!
  \**************************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "SwatchRGB": () => (/* binding */ SwatchRGB),
/* harmony export */   "isSwatchRGB": () => (/* binding */ isSwatchRGB)
/* harmony export */ });
/* harmony import */ var _microsoft_fast_colors__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @microsoft/fast-colors */ "../../packages/utilities/fast-colors/dist/color-rgba-64.js");
/* harmony import */ var _microsoft_fast_colors__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @microsoft/fast-colors */ "../../packages/utilities/fast-colors/dist/color-converters.js");
/* harmony import */ var _utilities_relative_luminance_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./utilities/relative-luminance.js */ "./node_modules/@microsoft/fast-components/dist/esm/color/utilities/relative-luminance.js");


/** @public */
const SwatchRGB = Object.freeze({
    create(r, g, b) {
        return new SwatchRGBImpl(r, g, b);
    },
    from(obj) {
        return new SwatchRGBImpl(obj.r, obj.g, obj.b);
    },
});
/**
 * Runtime test for an objects conformance with the SwatchRGB interface.
 * @internal
 */
function isSwatchRGB(value) {
    const test = {
        r: 0,
        g: 0,
        b: 0,
        toColorString: () => "",
        contrast: () => 0,
        relativeLuminance: 0,
    };
    for (const key in test) {
        if (typeof test[key] !== typeof value[key]) {
            return false;
        }
    }
    return true;
}
/**
 * A RGB implementation of {@link Swatch}
 * @internal
 */
class SwatchRGBImpl extends _microsoft_fast_colors__WEBPACK_IMPORTED_MODULE_0__.ColorRGBA64 {
    /**
     *
     * @param red - Red channel expressed as a number between 0 and 1
     * @param green - Green channel expressed as a number between 0 and 1
     * @param blue - Blue channel expressed as a number between 0 and 1
     */
    constructor(red, green, blue) {
        super(red, green, blue, 1);
        this.toColorString = this.toStringHexRGB;
        this.contrast = _utilities_relative_luminance_js__WEBPACK_IMPORTED_MODULE_1__.contrast.bind(null, this);
        this.createCSS = this.toColorString;
        this.relativeLuminance = (0,_microsoft_fast_colors__WEBPACK_IMPORTED_MODULE_2__.rgbToRelativeLuminance)(this);
    }
    static fromObject(obj) {
        return new SwatchRGBImpl(obj.r, obj.g, obj.b);
    }
}


/***/ }),

/***/ "./node_modules/@microsoft/fast-components/dist/esm/color/utilities/base-layer-luminance.js":
/*!**************************************************************************************************!*\
  !*** ./node_modules/@microsoft/fast-components/dist/esm/color/utilities/base-layer-luminance.js ***!
  \**************************************************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "StandardLuminance": () => (/* binding */ StandardLuminance),
/* harmony export */   "baseLayerLuminanceSwatch": () => (/* binding */ baseLayerLuminanceSwatch)
/* harmony export */ });
/* harmony import */ var _swatch_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../swatch.js */ "./node_modules/@microsoft/fast-components/dist/esm/color/swatch.js");

function baseLayerLuminanceSwatch(luminance) {
    return _swatch_js__WEBPACK_IMPORTED_MODULE_0__.SwatchRGB.create(luminance, luminance, luminance);
}
/**
 * Recommended values for light and dark mode for {@link @microsoft/fast-components#baseLayerLuminance}.
 *
 * @public
 */
var StandardLuminance;
(function (StandardLuminance) {
    StandardLuminance[StandardLuminance["LightMode"] = 1] = "LightMode";
    StandardLuminance[StandardLuminance["DarkMode"] = 0.23] = "DarkMode";
})(StandardLuminance || (StandardLuminance = {}));


/***/ }),

/***/ "./node_modules/@microsoft/fast-components/dist/esm/color/utilities/binary-search.js":
/*!*******************************************************************************************!*\
  !*** ./node_modules/@microsoft/fast-components/dist/esm/color/utilities/binary-search.js ***!
  \*******************************************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "binarySearch": () => (/* binding */ binarySearch)
/* harmony export */ });
/**
 * @internal
 */
function binarySearch(valuesToSearch, searchCondition, startIndex = 0, endIndex = valuesToSearch.length - 1) {
    if (endIndex === startIndex) {
        return valuesToSearch[startIndex];
    }
    const middleIndex = Math.floor((endIndex - startIndex) / 2) + startIndex;
    // Check to see if this passes on the item in the center of the array
    // if it does check the previous values
    return searchCondition(valuesToSearch[middleIndex])
        ? binarySearch(valuesToSearch, searchCondition, startIndex, middleIndex // include this index because it passed the search condition
        )
        : binarySearch(valuesToSearch, searchCondition, middleIndex + 1, // exclude this index because it failed the search condition
        endIndex);
}


/***/ }),

/***/ "./node_modules/@microsoft/fast-components/dist/esm/color/utilities/color-constants.js":
/*!*********************************************************************************************!*\
  !*** ./node_modules/@microsoft/fast-components/dist/esm/color/utilities/color-constants.js ***!
  \*********************************************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "accentBase": () => (/* binding */ accentBase),
/* harmony export */   "black": () => (/* binding */ black),
/* harmony export */   "middleGrey": () => (/* binding */ middleGrey),
/* harmony export */   "white": () => (/* binding */ white)
/* harmony export */ });
/* harmony import */ var _microsoft_fast_colors__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @microsoft/fast-colors */ "../../packages/utilities/fast-colors/dist/parse-color.js");
/* harmony import */ var _swatch_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../swatch.js */ "./node_modules/@microsoft/fast-components/dist/esm/color/swatch.js");


/**
 * @internal
 */
const white = _swatch_js__WEBPACK_IMPORTED_MODULE_0__.SwatchRGB.create(1, 1, 1);
/**
 * @internal
 */
const black = _swatch_js__WEBPACK_IMPORTED_MODULE_0__.SwatchRGB.create(0, 0, 0);
/**
 * @internal
 */
/* eslint-disable-next-line @typescript-eslint/no-non-null-assertion */
const middleGrey = _swatch_js__WEBPACK_IMPORTED_MODULE_0__.SwatchRGB.from((0,_microsoft_fast_colors__WEBPACK_IMPORTED_MODULE_1__.parseColorHexRGB)("#808080"));
/**
 * @internal
 */
/* eslint-disable-next-line @typescript-eslint/no-non-null-assertion */
const accentBase = _swatch_js__WEBPACK_IMPORTED_MODULE_0__.SwatchRGB.from((0,_microsoft_fast_colors__WEBPACK_IMPORTED_MODULE_1__.parseColorHexRGB)("#DA1A5F"));


/***/ }),

/***/ "./node_modules/@microsoft/fast-components/dist/esm/color/utilities/direction-by-is-dark.js":
/*!**************************************************************************************************!*\
  !*** ./node_modules/@microsoft/fast-components/dist/esm/color/utilities/direction-by-is-dark.js ***!
  \**************************************************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "directionByIsDark": () => (/* binding */ directionByIsDark)
/* harmony export */ });
/* harmony import */ var _is_dark_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./is-dark.js */ "./node_modules/@microsoft/fast-components/dist/esm/color/utilities/is-dark.js");

/**
 * @internal
 */
function directionByIsDark(color) {
    return (0,_is_dark_js__WEBPACK_IMPORTED_MODULE_0__.isDark)(color) ? -1 : 1;
}


/***/ }),

/***/ "./node_modules/@microsoft/fast-components/dist/esm/color/utilities/is-dark.js":
/*!*************************************************************************************!*\
  !*** ./node_modules/@microsoft/fast-components/dist/esm/color/utilities/is-dark.js ***!
  \*************************************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "isDark": () => (/* binding */ isDark)
/* harmony export */ });
/*
 * A color is in "dark" if there is more contrast between #000000 and a reference
 * color than #FFFFFF and the reference color. That threshold can be expressed as a relative luminance
 * using the contrast formula as (1 + 0.5) / (R + 0.05) === (R + 0.05) / (0 + 0.05),
 * which reduces to the following, where 'R' is the relative luminance of the reference color
 */
const target = (-0.1 + Math.sqrt(0.21)) / 2;
/**
 * Determines if a color should be considered Dark Mode
 * @param color - The color to check to mode of
 * @returns boolean
 *
 * @public
 */
function isDark(color) {
    return color.relativeLuminance <= target;
}


/***/ }),

/***/ "./node_modules/@microsoft/fast-components/dist/esm/color/utilities/relative-luminance.js":
/*!************************************************************************************************!*\
  !*** ./node_modules/@microsoft/fast-components/dist/esm/color/utilities/relative-luminance.js ***!
  \************************************************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "contrast": () => (/* binding */ contrast)
/* harmony export */ });
/**
 * @internal
 */
function contrast(a, b) {
    const L1 = a.relativeLuminance > b.relativeLuminance ? a : b;
    const L2 = a.relativeLuminance > b.relativeLuminance ? b : a;
    return (L1.relativeLuminance + 0.05) / (L2.relativeLuminance + 0.05);
}


/***/ }),

/***/ "./node_modules/@microsoft/fast-components/dist/esm/design-tokens.js":
/*!***************************************************************************!*\
  !*** ./node_modules/@microsoft/fast-components/dist/esm/design-tokens.js ***!
  \***************************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "accentColor": () => (/* binding */ accentColor),
/* harmony export */   "accentFillActive": () => (/* binding */ accentFillActive),
/* harmony export */   "accentFillActiveDelta": () => (/* binding */ accentFillActiveDelta),
/* harmony export */   "accentFillFocus": () => (/* binding */ accentFillFocus),
/* harmony export */   "accentFillFocusDelta": () => (/* binding */ accentFillFocusDelta),
/* harmony export */   "accentFillHover": () => (/* binding */ accentFillHover),
/* harmony export */   "accentFillHoverDelta": () => (/* binding */ accentFillHoverDelta),
/* harmony export */   "accentFillRecipe": () => (/* binding */ accentFillRecipe),
/* harmony export */   "accentFillRest": () => (/* binding */ accentFillRest),
/* harmony export */   "accentFillRestDelta": () => (/* binding */ accentFillRestDelta),
/* harmony export */   "accentForegroundActive": () => (/* binding */ accentForegroundActive),
/* harmony export */   "accentForegroundActiveDelta": () => (/* binding */ accentForegroundActiveDelta),
/* harmony export */   "accentForegroundFocus": () => (/* binding */ accentForegroundFocus),
/* harmony export */   "accentForegroundFocusDelta": () => (/* binding */ accentForegroundFocusDelta),
/* harmony export */   "accentForegroundHover": () => (/* binding */ accentForegroundHover),
/* harmony export */   "accentForegroundHoverDelta": () => (/* binding */ accentForegroundHoverDelta),
/* harmony export */   "accentForegroundRecipe": () => (/* binding */ accentForegroundRecipe),
/* harmony export */   "accentForegroundRest": () => (/* binding */ accentForegroundRest),
/* harmony export */   "accentForegroundRestDelta": () => (/* binding */ accentForegroundRestDelta),
/* harmony export */   "accentPalette": () => (/* binding */ accentPalette),
/* harmony export */   "baseHeightMultiplier": () => (/* binding */ baseHeightMultiplier),
/* harmony export */   "baseHorizontalSpacingMultiplier": () => (/* binding */ baseHorizontalSpacingMultiplier),
/* harmony export */   "baseLayerLuminance": () => (/* binding */ baseLayerLuminance),
/* harmony export */   "bodyFont": () => (/* binding */ bodyFont),
/* harmony export */   "controlCornerRadius": () => (/* binding */ controlCornerRadius),
/* harmony export */   "density": () => (/* binding */ density),
/* harmony export */   "designUnit": () => (/* binding */ designUnit),
/* harmony export */   "direction": () => (/* binding */ direction),
/* harmony export */   "disabledOpacity": () => (/* binding */ disabledOpacity),
/* harmony export */   "fillColor": () => (/* binding */ fillColor),
/* harmony export */   "focusStrokeInner": () => (/* binding */ focusStrokeInner),
/* harmony export */   "focusStrokeInnerRecipe": () => (/* binding */ focusStrokeInnerRecipe),
/* harmony export */   "focusStrokeOuter": () => (/* binding */ focusStrokeOuter),
/* harmony export */   "focusStrokeOuterRecipe": () => (/* binding */ focusStrokeOuterRecipe),
/* harmony export */   "focusStrokeWidth": () => (/* binding */ focusStrokeWidth),
/* harmony export */   "foregroundOnAccentActive": () => (/* binding */ foregroundOnAccentActive),
/* harmony export */   "foregroundOnAccentActiveLarge": () => (/* binding */ foregroundOnAccentActiveLarge),
/* harmony export */   "foregroundOnAccentFocus": () => (/* binding */ foregroundOnAccentFocus),
/* harmony export */   "foregroundOnAccentFocusLarge": () => (/* binding */ foregroundOnAccentFocusLarge),
/* harmony export */   "foregroundOnAccentHover": () => (/* binding */ foregroundOnAccentHover),
/* harmony export */   "foregroundOnAccentHoverLarge": () => (/* binding */ foregroundOnAccentHoverLarge),
/* harmony export */   "foregroundOnAccentLargeRecipe": () => (/* binding */ foregroundOnAccentLargeRecipe),
/* harmony export */   "foregroundOnAccentRecipe": () => (/* binding */ foregroundOnAccentRecipe),
/* harmony export */   "foregroundOnAccentRest": () => (/* binding */ foregroundOnAccentRest),
/* harmony export */   "foregroundOnAccentRestLarge": () => (/* binding */ foregroundOnAccentRestLarge),
/* harmony export */   "heightNumberAsToken": () => (/* binding */ heightNumberAsToken),
/* harmony export */   "neutralColor": () => (/* binding */ neutralColor),
/* harmony export */   "neutralFillActive": () => (/* binding */ neutralFillActive),
/* harmony export */   "neutralFillActiveDelta": () => (/* binding */ neutralFillActiveDelta),
/* harmony export */   "neutralFillFocus": () => (/* binding */ neutralFillFocus),
/* harmony export */   "neutralFillFocusDelta": () => (/* binding */ neutralFillFocusDelta),
/* harmony export */   "neutralFillHover": () => (/* binding */ neutralFillHover),
/* harmony export */   "neutralFillHoverDelta": () => (/* binding */ neutralFillHoverDelta),
/* harmony export */   "neutralFillInputActive": () => (/* binding */ neutralFillInputActive),
/* harmony export */   "neutralFillInputActiveDelta": () => (/* binding */ neutralFillInputActiveDelta),
/* harmony export */   "neutralFillInputFocus": () => (/* binding */ neutralFillInputFocus),
/* harmony export */   "neutralFillInputFocusDelta": () => (/* binding */ neutralFillInputFocusDelta),
/* harmony export */   "neutralFillInputHover": () => (/* binding */ neutralFillInputHover),
/* harmony export */   "neutralFillInputHoverDelta": () => (/* binding */ neutralFillInputHoverDelta),
/* harmony export */   "neutralFillInputRecipe": () => (/* binding */ neutralFillInputRecipe),
/* harmony export */   "neutralFillInputRest": () => (/* binding */ neutralFillInputRest),
/* harmony export */   "neutralFillInputRestDelta": () => (/* binding */ neutralFillInputRestDelta),
/* harmony export */   "neutralFillLayerRecipe": () => (/* binding */ neutralFillLayerRecipe),
/* harmony export */   "neutralFillLayerRest": () => (/* binding */ neutralFillLayerRest),
/* harmony export */   "neutralFillLayerRestDelta": () => (/* binding */ neutralFillLayerRestDelta),
/* harmony export */   "neutralFillRecipe": () => (/* binding */ neutralFillRecipe),
/* harmony export */   "neutralFillRest": () => (/* binding */ neutralFillRest),
/* harmony export */   "neutralFillRestDelta": () => (/* binding */ neutralFillRestDelta),
/* harmony export */   "neutralFillStealthActive": () => (/* binding */ neutralFillStealthActive),
/* harmony export */   "neutralFillStealthActiveDelta": () => (/* binding */ neutralFillStealthActiveDelta),
/* harmony export */   "neutralFillStealthFocus": () => (/* binding */ neutralFillStealthFocus),
/* harmony export */   "neutralFillStealthFocusDelta": () => (/* binding */ neutralFillStealthFocusDelta),
/* harmony export */   "neutralFillStealthHover": () => (/* binding */ neutralFillStealthHover),
/* harmony export */   "neutralFillStealthHoverDelta": () => (/* binding */ neutralFillStealthHoverDelta),
/* harmony export */   "neutralFillStealthRecipe": () => (/* binding */ neutralFillStealthRecipe),
/* harmony export */   "neutralFillStealthRest": () => (/* binding */ neutralFillStealthRest),
/* harmony export */   "neutralFillStealthRestDelta": () => (/* binding */ neutralFillStealthRestDelta),
/* harmony export */   "neutralFillStrongActive": () => (/* binding */ neutralFillStrongActive),
/* harmony export */   "neutralFillStrongActiveDelta": () => (/* binding */ neutralFillStrongActiveDelta),
/* harmony export */   "neutralFillStrongFocus": () => (/* binding */ neutralFillStrongFocus),
/* harmony export */   "neutralFillStrongFocusDelta": () => (/* binding */ neutralFillStrongFocusDelta),
/* harmony export */   "neutralFillStrongHover": () => (/* binding */ neutralFillStrongHover),
/* harmony export */   "neutralFillStrongHoverDelta": () => (/* binding */ neutralFillStrongHoverDelta),
/* harmony export */   "neutralFillStrongRecipe": () => (/* binding */ neutralFillStrongRecipe),
/* harmony export */   "neutralFillStrongRest": () => (/* binding */ neutralFillStrongRest),
/* harmony export */   "neutralFillStrongRestDelta": () => (/* binding */ neutralFillStrongRestDelta),
/* harmony export */   "neutralForegroundHint": () => (/* binding */ neutralForegroundHint),
/* harmony export */   "neutralForegroundHintRecipe": () => (/* binding */ neutralForegroundHintRecipe),
/* harmony export */   "neutralForegroundRecipe": () => (/* binding */ neutralForegroundRecipe),
/* harmony export */   "neutralForegroundRest": () => (/* binding */ neutralForegroundRest),
/* harmony export */   "neutralLayer1": () => (/* binding */ neutralLayer1),
/* harmony export */   "neutralLayer1Recipe": () => (/* binding */ neutralLayer1Recipe),
/* harmony export */   "neutralLayer2": () => (/* binding */ neutralLayer2),
/* harmony export */   "neutralLayer2Recipe": () => (/* binding */ neutralLayer2Recipe),
/* harmony export */   "neutralLayer3": () => (/* binding */ neutralLayer3),
/* harmony export */   "neutralLayer3Recipe": () => (/* binding */ neutralLayer3Recipe),
/* harmony export */   "neutralLayer4": () => (/* binding */ neutralLayer4),
/* harmony export */   "neutralLayer4Recipe": () => (/* binding */ neutralLayer4Recipe),
/* harmony export */   "neutralLayerCardContainer": () => (/* binding */ neutralLayerCardContainer),
/* harmony export */   "neutralLayerCardContainerRecipe": () => (/* binding */ neutralLayerCardContainerRecipe),
/* harmony export */   "neutralLayerFloating": () => (/* binding */ neutralLayerFloating),
/* harmony export */   "neutralLayerFloatingRecipe": () => (/* binding */ neutralLayerFloatingRecipe),
/* harmony export */   "neutralPalette": () => (/* binding */ neutralPalette),
/* harmony export */   "neutralStrokeActive": () => (/* binding */ neutralStrokeActive),
/* harmony export */   "neutralStrokeActiveDelta": () => (/* binding */ neutralStrokeActiveDelta),
/* harmony export */   "neutralStrokeDividerRecipe": () => (/* binding */ neutralStrokeDividerRecipe),
/* harmony export */   "neutralStrokeDividerRest": () => (/* binding */ neutralStrokeDividerRest),
/* harmony export */   "neutralStrokeDividerRestDelta": () => (/* binding */ neutralStrokeDividerRestDelta),
/* harmony export */   "neutralStrokeFocus": () => (/* binding */ neutralStrokeFocus),
/* harmony export */   "neutralStrokeFocusDelta": () => (/* binding */ neutralStrokeFocusDelta),
/* harmony export */   "neutralStrokeHover": () => (/* binding */ neutralStrokeHover),
/* harmony export */   "neutralStrokeHoverDelta": () => (/* binding */ neutralStrokeHoverDelta),
/* harmony export */   "neutralStrokeRecipe": () => (/* binding */ neutralStrokeRecipe),
/* harmony export */   "neutralStrokeRest": () => (/* binding */ neutralStrokeRest),
/* harmony export */   "neutralStrokeRestDelta": () => (/* binding */ neutralStrokeRestDelta),
/* harmony export */   "strokeWidth": () => (/* binding */ strokeWidth),
/* harmony export */   "typeRampBaseFontSize": () => (/* binding */ typeRampBaseFontSize),
/* harmony export */   "typeRampBaseLineHeight": () => (/* binding */ typeRampBaseLineHeight),
/* harmony export */   "typeRampMinus1FontSize": () => (/* binding */ typeRampMinus1FontSize),
/* harmony export */   "typeRampMinus1LineHeight": () => (/* binding */ typeRampMinus1LineHeight),
/* harmony export */   "typeRampMinus2FontSize": () => (/* binding */ typeRampMinus2FontSize),
/* harmony export */   "typeRampMinus2LineHeight": () => (/* binding */ typeRampMinus2LineHeight),
/* harmony export */   "typeRampPlus1FontSize": () => (/* binding */ typeRampPlus1FontSize),
/* harmony export */   "typeRampPlus1LineHeight": () => (/* binding */ typeRampPlus1LineHeight),
/* harmony export */   "typeRampPlus2FontSize": () => (/* binding */ typeRampPlus2FontSize),
/* harmony export */   "typeRampPlus2LineHeight": () => (/* binding */ typeRampPlus2LineHeight),
/* harmony export */   "typeRampPlus3FontSize": () => (/* binding */ typeRampPlus3FontSize),
/* harmony export */   "typeRampPlus3LineHeight": () => (/* binding */ typeRampPlus3LineHeight),
/* harmony export */   "typeRampPlus4FontSize": () => (/* binding */ typeRampPlus4FontSize),
/* harmony export */   "typeRampPlus4LineHeight": () => (/* binding */ typeRampPlus4LineHeight),
/* harmony export */   "typeRampPlus5FontSize": () => (/* binding */ typeRampPlus5FontSize),
/* harmony export */   "typeRampPlus5LineHeight": () => (/* binding */ typeRampPlus5LineHeight),
/* harmony export */   "typeRampPlus6FontSize": () => (/* binding */ typeRampPlus6FontSize),
/* harmony export */   "typeRampPlus6LineHeight": () => (/* binding */ typeRampPlus6LineHeight)
/* harmony export */ });
/* harmony import */ var _microsoft_fast_foundation__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @microsoft/fast-foundation */ "./node_modules/@microsoft/fast-foundation/dist/esm/design-token/design-token.js");
/* harmony import */ var _microsoft_fast_web_utilities__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @microsoft/fast-web-utilities */ "./node_modules/@microsoft/fast-components/node_modules/@microsoft/fast-web-utilities/dist/localization.js");
/* harmony import */ var _color_palette_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./color/palette.js */ "./node_modules/@microsoft/fast-components/dist/esm/color/palette.js");
/* harmony import */ var _color_recipes_accent_fill_js__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! ./color/recipes/accent-fill.js */ "./node_modules/@microsoft/fast-components/dist/esm/color/recipes/accent-fill.js");
/* harmony import */ var _color_recipes_accent_foreground_js__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__(/*! ./color/recipes/accent-foreground.js */ "./node_modules/@microsoft/fast-components/dist/esm/color/recipes/accent-foreground.js");
/* harmony import */ var _color_recipes_foreground_on_accent_js__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! ./color/recipes/foreground-on-accent.js */ "./node_modules/@microsoft/fast-components/dist/esm/color/recipes/foreground-on-accent.js");
/* harmony import */ var _color_recipes_neutral_fill_js__WEBPACK_IMPORTED_MODULE_14__ = __webpack_require__(/*! ./color/recipes/neutral-fill.js */ "./node_modules/@microsoft/fast-components/dist/esm/color/recipes/neutral-fill.js");
/* harmony import */ var _color_recipes_neutral_fill_input_js__WEBPACK_IMPORTED_MODULE_15__ = __webpack_require__(/*! ./color/recipes/neutral-fill-input.js */ "./node_modules/@microsoft/fast-components/dist/esm/color/recipes/neutral-fill-input.js");
/* harmony import */ var _color_recipes_neutral_fill_layer_js__WEBPACK_IMPORTED_MODULE_18__ = __webpack_require__(/*! ./color/recipes/neutral-fill-layer.js */ "./node_modules/@microsoft/fast-components/dist/esm/color/recipes/neutral-fill-layer.js");
/* harmony import */ var _color_recipes_neutral_fill_stealth_js__WEBPACK_IMPORTED_MODULE_16__ = __webpack_require__(/*! ./color/recipes/neutral-fill-stealth.js */ "./node_modules/@microsoft/fast-components/dist/esm/color/recipes/neutral-fill-stealth.js");
/* harmony import */ var _color_recipes_neutral_fill_contrast_js__WEBPACK_IMPORTED_MODULE_17__ = __webpack_require__(/*! ./color/recipes/neutral-fill-contrast.js */ "./node_modules/@microsoft/fast-components/dist/esm/color/recipes/neutral-fill-contrast.js");
/* harmony import */ var _color_recipes_focus_stroke_js__WEBPACK_IMPORTED_MODULE_19__ = __webpack_require__(/*! ./color/recipes/focus-stroke.js */ "./node_modules/@microsoft/fast-components/dist/esm/color/recipes/focus-stroke.js");
/* harmony import */ var _color_recipes_neutral_foreground_js__WEBPACK_IMPORTED_MODULE_21__ = __webpack_require__(/*! ./color/recipes/neutral-foreground.js */ "./node_modules/@microsoft/fast-components/dist/esm/color/recipes/neutral-foreground.js");
/* harmony import */ var _color_recipes_neutral_foreground_hint_js__WEBPACK_IMPORTED_MODULE_20__ = __webpack_require__(/*! ./color/recipes/neutral-foreground-hint.js */ "./node_modules/@microsoft/fast-components/dist/esm/color/recipes/neutral-foreground-hint.js");
/* harmony import */ var _color_recipes_neutral_layer_card_container_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./color/recipes/neutral-layer-card-container.js */ "./node_modules/@microsoft/fast-components/dist/esm/color/recipes/neutral-layer-card-container.js");
/* harmony import */ var _color_recipes_neutral_layer_floating_js__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./color/recipes/neutral-layer-floating.js */ "./node_modules/@microsoft/fast-components/dist/esm/color/recipes/neutral-layer-floating.js");
/* harmony import */ var _color_recipes_neutral_layer_1_js__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./color/recipes/neutral-layer-1.js */ "./node_modules/@microsoft/fast-components/dist/esm/color/recipes/neutral-layer-1.js");
/* harmony import */ var _color_recipes_neutral_layer_2_js__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ./color/recipes/neutral-layer-2.js */ "./node_modules/@microsoft/fast-components/dist/esm/color/recipes/neutral-layer-2.js");
/* harmony import */ var _color_recipes_neutral_layer_3_js__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ./color/recipes/neutral-layer-3.js */ "./node_modules/@microsoft/fast-components/dist/esm/color/recipes/neutral-layer-3.js");
/* harmony import */ var _color_recipes_neutral_layer_4_js__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! ./color/recipes/neutral-layer-4.js */ "./node_modules/@microsoft/fast-components/dist/esm/color/recipes/neutral-layer-4.js");
/* harmony import */ var _color_recipes_neutral_stroke_js__WEBPACK_IMPORTED_MODULE_22__ = __webpack_require__(/*! ./color/recipes/neutral-stroke.js */ "./node_modules/@microsoft/fast-components/dist/esm/color/recipes/neutral-stroke.js");
/* harmony import */ var _color_recipes_neutral_stroke_divider_js__WEBPACK_IMPORTED_MODULE_23__ = __webpack_require__(/*! ./color/recipes/neutral-stroke-divider.js */ "./node_modules/@microsoft/fast-components/dist/esm/color/recipes/neutral-stroke-divider.js");
/* harmony import */ var _color_utilities_base_layer_luminance_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./color/utilities/base-layer-luminance.js */ "./node_modules/@microsoft/fast-components/dist/esm/color/utilities/base-layer-luminance.js");
/* harmony import */ var _color_utilities_color_constants_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./color/utilities/color-constants.js */ "./node_modules/@microsoft/fast-components/dist/esm/color/utilities/color-constants.js");
























const { create } = _microsoft_fast_foundation__WEBPACK_IMPORTED_MODULE_0__.DesignToken;
function createNonCss(name) {
    return _microsoft_fast_foundation__WEBPACK_IMPORTED_MODULE_0__.DesignToken.create({ name, cssCustomPropertyName: null });
}
// General tokens
/** @public */
const bodyFont = create("body-font").withDefault('aktiv-grotesk, "Segoe UI", Arial, Helvetica, sans-serif');
/** @public */
const baseHeightMultiplier = create("base-height-multiplier").withDefault(10);
/** @public */
const baseHorizontalSpacingMultiplier = create("base-horizontal-spacing-multiplier").withDefault(3);
/** @public */
const baseLayerLuminance = create("base-layer-luminance").withDefault(_color_utilities_base_layer_luminance_js__WEBPACK_IMPORTED_MODULE_1__.StandardLuminance.DarkMode);
/** @public */
const controlCornerRadius = create("control-corner-radius").withDefault(4);
/** @public */
const density = create("density").withDefault(0);
/** @public */
const designUnit = create("design-unit").withDefault(4);
/** @public */
const direction = create("direction").withDefault(_microsoft_fast_web_utilities__WEBPACK_IMPORTED_MODULE_2__.Direction.ltr);
/** @public */
const disabledOpacity = create("disabled-opacity").withDefault(0.3);
/** @public */
const strokeWidth = create("stroke-width").withDefault(1);
/** @public */
const focusStrokeWidth = create("focus-stroke-width").withDefault(2);
// Typography values
/** @public */
const typeRampBaseFontSize = create("type-ramp-base-font-size").withDefault("14px");
/** @public */
const typeRampBaseLineHeight = create("type-ramp-base-line-height").withDefault("20px");
/** @public */
const typeRampMinus1FontSize = create("type-ramp-minus-1-font-size").withDefault("12px");
/** @public */
const typeRampMinus1LineHeight = create("type-ramp-minus-1-line-height").withDefault("16px");
/** @public */
const typeRampMinus2FontSize = create("type-ramp-minus-2-font-size").withDefault("10px");
/** @public */
const typeRampMinus2LineHeight = create("type-ramp-minus-2-line-height").withDefault("16px");
/** @public */
const typeRampPlus1FontSize = create("type-ramp-plus-1-font-size").withDefault("16px");
/** @public */
const typeRampPlus1LineHeight = create("type-ramp-plus-1-line-height").withDefault("24px");
/** @public */
const typeRampPlus2FontSize = create("type-ramp-plus-2-font-size").withDefault("20px");
/** @public */
const typeRampPlus2LineHeight = create("type-ramp-plus-2-line-height").withDefault("28px");
/** @public */
const typeRampPlus3FontSize = create("type-ramp-plus-3-font-size").withDefault("28px");
/** @public */
const typeRampPlus3LineHeight = create("type-ramp-plus-3-line-height").withDefault("36px");
/** @public */
const typeRampPlus4FontSize = create("type-ramp-plus-4-font-size").withDefault("34px");
/** @public */
const typeRampPlus4LineHeight = create("type-ramp-plus-4-line-height").withDefault("44px");
/** @public */
const typeRampPlus5FontSize = create("type-ramp-plus-5-font-size").withDefault("46px");
/** @public */
const typeRampPlus5LineHeight = create("type-ramp-plus-5-line-height").withDefault("56px");
/** @public */
const typeRampPlus6FontSize = create("type-ramp-plus-6-font-size").withDefault("60px");
/** @public */
const typeRampPlus6LineHeight = create("type-ramp-plus-6-line-height").withDefault("72px");
// Color recipe values
/** @public */
const accentFillRestDelta = createNonCss("accent-fill-rest-delta").withDefault(0);
/** @public */
const accentFillHoverDelta = createNonCss("accent-fill-hover-delta").withDefault(4);
/** @public */
const accentFillActiveDelta = createNonCss("accent-fill-active-delta").withDefault(-5);
/** @public */
const accentFillFocusDelta = createNonCss("accent-fill-focus-delta").withDefault(0);
/** @public */
const accentForegroundRestDelta = createNonCss("accent-foreground-rest-delta").withDefault(0);
/** @public */
const accentForegroundHoverDelta = createNonCss("accent-foreground-hover-delta").withDefault(6);
/** @public */
const accentForegroundActiveDelta = createNonCss("accent-foreground-active-delta").withDefault(-4);
/** @public */
const accentForegroundFocusDelta = createNonCss("accent-foreground-focus-delta").withDefault(0);
/** @public */
const neutralFillRestDelta = createNonCss("neutral-fill-rest-delta").withDefault(7);
/** @public */
const neutralFillHoverDelta = createNonCss("neutral-fill-hover-delta").withDefault(10);
/** @public */
const neutralFillActiveDelta = createNonCss("neutral-fill-active-delta").withDefault(5);
/** @public */
const neutralFillFocusDelta = createNonCss("neutral-fill-focus-delta").withDefault(0);
/** @public */
const neutralFillInputRestDelta = createNonCss("neutral-fill-input-rest-delta").withDefault(0);
/** @public */
const neutralFillInputHoverDelta = createNonCss("neutral-fill-input-hover-delta").withDefault(0);
/** @public */
const neutralFillInputActiveDelta = createNonCss("neutral-fill-input-active-delta").withDefault(0);
/** @public */
const neutralFillInputFocusDelta = createNonCss("neutral-fill-input-focus-delta").withDefault(0);
/** @public */
const neutralFillStealthRestDelta = createNonCss("neutral-fill-stealth-rest-delta").withDefault(0);
/** @public */
const neutralFillStealthHoverDelta = createNonCss("neutral-fill-stealth-hover-delta").withDefault(5);
/** @public */
const neutralFillStealthActiveDelta = createNonCss("neutral-fill-stealth-active-delta").withDefault(3);
/** @public */
const neutralFillStealthFocusDelta = createNonCss("neutral-fill-stealth-focus-delta").withDefault(0);
/** @public */
const neutralFillStrongRestDelta = createNonCss("neutral-fill-strong-rest-delta").withDefault(0);
/** @public */
const neutralFillStrongHoverDelta = createNonCss("neutral-fill-strong-hover-delta").withDefault(8);
/** @public */
const neutralFillStrongActiveDelta = createNonCss("neutral-fill-strong-active-delta").withDefault(-5);
/** @public */
const neutralFillStrongFocusDelta = createNonCss("neutral-fill-strong-focus-delta").withDefault(0);
/** @public */
const neutralFillLayerRestDelta = createNonCss("neutral-fill-layer-rest-delta").withDefault(3);
/** @public */
const neutralStrokeRestDelta = createNonCss("neutral-stroke-rest-delta").withDefault(25);
/** @public */
const neutralStrokeHoverDelta = createNonCss("neutral-stroke-hover-delta").withDefault(40);
/** @public */
const neutralStrokeActiveDelta = createNonCss("neutral-stroke-active-delta").withDefault(16);
/** @public */
const neutralStrokeFocusDelta = createNonCss("neutral-stroke-focus-delta").withDefault(25);
/** @public */
const neutralStrokeDividerRestDelta = createNonCss("neutral-stroke-divider-rest-delta").withDefault(8);
// Color recipes
/** @public */
const neutralColor = create("neutral-color").withDefault(_color_utilities_color_constants_js__WEBPACK_IMPORTED_MODULE_3__.middleGrey);
/** @public */
const neutralPalette = createNonCss("neutral-palette").withDefault((element) => _color_palette_js__WEBPACK_IMPORTED_MODULE_4__.PaletteRGB.from(neutralColor.getValueFor(element)));
/** @public */
const accentColor = create("accent-color").withDefault(_color_utilities_color_constants_js__WEBPACK_IMPORTED_MODULE_3__.accentBase);
/** @public */
const accentPalette = createNonCss("accent-palette").withDefault((element) => _color_palette_js__WEBPACK_IMPORTED_MODULE_4__.PaletteRGB.from(accentColor.getValueFor(element)));
// Neutral Layer Card Container
/** @public */
const neutralLayerCardContainerRecipe = createNonCss("neutral-layer-card-container-recipe").withDefault({
    evaluate: (element) => (0,_color_recipes_neutral_layer_card_container_js__WEBPACK_IMPORTED_MODULE_5__.neutralLayerCardContainer)(neutralPalette.getValueFor(element), baseLayerLuminance.getValueFor(element), neutralFillLayerRestDelta.getValueFor(element)),
});
/** @public */
const neutralLayerCardContainer = create("neutral-layer-card-container").withDefault((element) => neutralLayerCardContainerRecipe.getValueFor(element).evaluate(element));
// Neutral Layer Floating
/** @public */
const neutralLayerFloatingRecipe = createNonCss("neutral-layer-floating-recipe").withDefault({
    evaluate: (element) => (0,_color_recipes_neutral_layer_floating_js__WEBPACK_IMPORTED_MODULE_6__.neutralLayerFloating)(neutralPalette.getValueFor(element), baseLayerLuminance.getValueFor(element), neutralFillLayerRestDelta.getValueFor(element)),
});
/** @public */
const neutralLayerFloating = create("neutral-layer-floating").withDefault((element) => neutralLayerFloatingRecipe.getValueFor(element).evaluate(element));
// Neutral Layer 1
/** @public */
const neutralLayer1Recipe = createNonCss("neutral-layer-1-recipe").withDefault({
    evaluate: (element) => (0,_color_recipes_neutral_layer_1_js__WEBPACK_IMPORTED_MODULE_7__.neutralLayer1)(neutralPalette.getValueFor(element), baseLayerLuminance.getValueFor(element)),
});
/** @public */
const neutralLayer1 = create("neutral-layer-1").withDefault((element) => neutralLayer1Recipe.getValueFor(element).evaluate(element));
// Neutral Layer 2
/** @public */
const neutralLayer2Recipe = createNonCss("neutral-layer-2-recipe").withDefault({
    evaluate: (element) => (0,_color_recipes_neutral_layer_2_js__WEBPACK_IMPORTED_MODULE_8__.neutralLayer2)(neutralPalette.getValueFor(element), baseLayerLuminance.getValueFor(element), neutralFillLayerRestDelta.getValueFor(element), neutralFillRestDelta.getValueFor(element), neutralFillHoverDelta.getValueFor(element), neutralFillActiveDelta.getValueFor(element)),
});
/** @public */
const neutralLayer2 = create("neutral-layer-2").withDefault((element) => neutralLayer2Recipe.getValueFor(element).evaluate(element));
// Neutral Layer 3
/** @public */
const neutralLayer3Recipe = createNonCss("neutral-layer-3-recipe").withDefault({
    evaluate: (element) => (0,_color_recipes_neutral_layer_3_js__WEBPACK_IMPORTED_MODULE_9__.neutralLayer3)(neutralPalette.getValueFor(element), baseLayerLuminance.getValueFor(element), neutralFillLayerRestDelta.getValueFor(element), neutralFillRestDelta.getValueFor(element), neutralFillHoverDelta.getValueFor(element), neutralFillActiveDelta.getValueFor(element)),
});
/** @public */
const neutralLayer3 = create("neutral-layer-3").withDefault((element) => neutralLayer3Recipe.getValueFor(element).evaluate(element));
// Neutral Layer 4
/** @public */
const neutralLayer4Recipe = createNonCss("neutral-layer-4-recipe").withDefault({
    evaluate: (element) => (0,_color_recipes_neutral_layer_4_js__WEBPACK_IMPORTED_MODULE_10__.neutralLayer4)(neutralPalette.getValueFor(element), baseLayerLuminance.getValueFor(element), neutralFillLayerRestDelta.getValueFor(element), neutralFillRestDelta.getValueFor(element), neutralFillHoverDelta.getValueFor(element), neutralFillActiveDelta.getValueFor(element)),
});
/** @public */
const neutralLayer4 = create("neutral-layer-4").withDefault((element) => neutralLayer4Recipe.getValueFor(element).evaluate(element));
/** @public */
const fillColor = create("fill-color").withDefault(element => neutralLayer1.getValueFor(element));
var ContrastTarget;
(function (ContrastTarget) {
    ContrastTarget[ContrastTarget["normal"] = 4.5] = "normal";
    ContrastTarget[ContrastTarget["large"] = 7] = "large";
})(ContrastTarget || (ContrastTarget = {}));
// Accent Fill
/** @public */
const accentFillRecipe = create({
    name: "accent-fill-recipe",
    cssCustomPropertyName: null,
}).withDefault({
    evaluate: (element, reference) => (0,_color_recipes_accent_fill_js__WEBPACK_IMPORTED_MODULE_11__.accentFill)(accentPalette.getValueFor(element), neutralPalette.getValueFor(element), reference || fillColor.getValueFor(element), accentFillHoverDelta.getValueFor(element), accentFillActiveDelta.getValueFor(element), accentFillFocusDelta.getValueFor(element), neutralFillRestDelta.getValueFor(element), neutralFillHoverDelta.getValueFor(element), neutralFillActiveDelta.getValueFor(element)),
});
/** @public */
const accentFillRest = create("accent-fill-rest").withDefault((element) => {
    return accentFillRecipe.getValueFor(element).evaluate(element).rest;
});
/** @public */
const accentFillHover = create("accent-fill-hover").withDefault((element) => {
    return accentFillRecipe.getValueFor(element).evaluate(element).hover;
});
/** @public */
const accentFillActive = create("accent-fill-active").withDefault((element) => {
    return accentFillRecipe.getValueFor(element).evaluate(element).active;
});
/** @public */
const accentFillFocus = create("accent-fill-focus").withDefault((element) => {
    return accentFillRecipe.getValueFor(element).evaluate(element).focus;
});
// Foreground On Accent
const foregroundOnAccentByContrast = (contrast) => (element, reference) => {
    return (0,_color_recipes_foreground_on_accent_js__WEBPACK_IMPORTED_MODULE_12__.foregroundOnAccent)(reference || accentFillRest.getValueFor(element), contrast);
};
/** @public */
const foregroundOnAccentRecipe = createNonCss("foreground-on-accent-recipe").withDefault({
    evaluate: (element, reference) => foregroundOnAccentByContrast(ContrastTarget.normal)(element, reference),
});
/** @public */
const foregroundOnAccentRest = create("foreground-on-accent-rest").withDefault((element) => foregroundOnAccentRecipe
    .getValueFor(element)
    .evaluate(element, accentFillRest.getValueFor(element)));
/** @public */
const foregroundOnAccentHover = create("foreground-on-accent-hover").withDefault((element) => foregroundOnAccentRecipe
    .getValueFor(element)
    .evaluate(element, accentFillHover.getValueFor(element)));
/** @public */
const foregroundOnAccentActive = create("foreground-on-accent-active").withDefault((element) => foregroundOnAccentRecipe
    .getValueFor(element)
    .evaluate(element, accentFillActive.getValueFor(element)));
/** @public */
const foregroundOnAccentFocus = create("foreground-on-accent-focus").withDefault((element) => foregroundOnAccentRecipe
    .getValueFor(element)
    .evaluate(element, accentFillFocus.getValueFor(element)));
/** @public */
const foregroundOnAccentLargeRecipe = createNonCss("foreground-on-accent-large-recipe").withDefault({
    evaluate: (element, reference) => foregroundOnAccentByContrast(ContrastTarget.large)(element, reference),
});
/** @public */
const foregroundOnAccentRestLarge = create("foreground-on-accent-rest-large").withDefault((element) => foregroundOnAccentLargeRecipe
    .getValueFor(element)
    .evaluate(element, accentFillRest.getValueFor(element)));
/** @public */
const foregroundOnAccentHoverLarge = create("foreground-on-accent-hover-large").withDefault((element) => foregroundOnAccentLargeRecipe
    .getValueFor(element)
    .evaluate(element, accentFillHover.getValueFor(element)));
/** @public */
const foregroundOnAccentActiveLarge = create("foreground-on-accent-active-large").withDefault((element) => foregroundOnAccentLargeRecipe
    .getValueFor(element)
    .evaluate(element, accentFillActive.getValueFor(element)));
/** @public */
const foregroundOnAccentFocusLarge = create("foreground-on-accent-focus-large").withDefault((element) => foregroundOnAccentLargeRecipe
    .getValueFor(element)
    .evaluate(element, accentFillFocus.getValueFor(element)));
// Accent Foreground
const accentForegroundByContrast = (contrast) => (element, reference) => (0,_color_recipes_accent_foreground_js__WEBPACK_IMPORTED_MODULE_13__.accentForeground)(accentPalette.getValueFor(element), reference || fillColor.getValueFor(element), contrast, accentForegroundRestDelta.getValueFor(element), accentForegroundHoverDelta.getValueFor(element), accentForegroundActiveDelta.getValueFor(element), accentForegroundFocusDelta.getValueFor(element));
/** @public */
const accentForegroundRecipe = create({
    name: "accent-foreground-recipe",
    cssCustomPropertyName: null,
}).withDefault({
    evaluate: (element, reference) => accentForegroundByContrast(ContrastTarget.normal)(element, reference),
});
/** @public */
const accentForegroundRest = create("accent-foreground-rest").withDefault((element) => accentForegroundRecipe.getValueFor(element).evaluate(element).rest);
/** @public */
const accentForegroundHover = create("accent-foreground-hover").withDefault((element) => accentForegroundRecipe.getValueFor(element).evaluate(element).hover);
/** @public */
const accentForegroundActive = create("accent-foreground-active").withDefault((element) => accentForegroundRecipe.getValueFor(element).evaluate(element).active);
/** @public */
const accentForegroundFocus = create("accent-foreground-focus").withDefault((element) => accentForegroundRecipe.getValueFor(element).evaluate(element).focus);
// Neutral Fill
/** @public */
const neutralFillRecipe = create({
    name: "neutral-fill-recipe",
    cssCustomPropertyName: null,
}).withDefault({
    evaluate: (element, reference) => (0,_color_recipes_neutral_fill_js__WEBPACK_IMPORTED_MODULE_14__.neutralFill)(neutralPalette.getValueFor(element), reference || fillColor.getValueFor(element), neutralFillRestDelta.getValueFor(element), neutralFillHoverDelta.getValueFor(element), neutralFillActiveDelta.getValueFor(element), neutralFillFocusDelta.getValueFor(element)),
});
/** @public */
const neutralFillRest = create("neutral-fill-rest").withDefault((element) => neutralFillRecipe.getValueFor(element).evaluate(element).rest);
/** @public */
const neutralFillHover = create("neutral-fill-hover").withDefault((element) => neutralFillRecipe.getValueFor(element).evaluate(element).hover);
/** @public */
const neutralFillActive = create("neutral-fill-active").withDefault((element) => neutralFillRecipe.getValueFor(element).evaluate(element).active);
/** @public */
const neutralFillFocus = create("neutral-fill-focus").withDefault((element) => neutralFillRecipe.getValueFor(element).evaluate(element).focus);
// Neutral Fill Input
/** @public */
const neutralFillInputRecipe = create({
    name: "neutral-fill-input-recipe",
    cssCustomPropertyName: null,
}).withDefault({
    evaluate: (element, reference) => (0,_color_recipes_neutral_fill_input_js__WEBPACK_IMPORTED_MODULE_15__.neutralFillInput)(neutralPalette.getValueFor(element), reference || fillColor.getValueFor(element), neutralFillInputRestDelta.getValueFor(element), neutralFillInputHoverDelta.getValueFor(element), neutralFillInputActiveDelta.getValueFor(element), neutralFillInputFocusDelta.getValueFor(element)),
});
/** @public */
const neutralFillInputRest = create("neutral-fill-input-rest").withDefault((element) => neutralFillInputRecipe.getValueFor(element).evaluate(element).rest);
/** @public */
const neutralFillInputHover = create("neutral-fill-input-hover").withDefault((element) => neutralFillInputRecipe.getValueFor(element).evaluate(element).hover);
/** @public */
const neutralFillInputActive = create("neutral-fill-input-active").withDefault((element) => neutralFillInputRecipe.getValueFor(element).evaluate(element).active);
/** @public */
const neutralFillInputFocus = create("neutral-fill-input-focus").withDefault((element) => neutralFillInputRecipe.getValueFor(element).evaluate(element).focus);
// Neutral Fill Stealth
/** @public */
const neutralFillStealthRecipe = create({
    name: "neutral-fill-stealth-recipe",
    cssCustomPropertyName: null,
}).withDefault({
    evaluate: (element, reference) => (0,_color_recipes_neutral_fill_stealth_js__WEBPACK_IMPORTED_MODULE_16__.neutralFillStealth)(neutralPalette.getValueFor(element), reference || fillColor.getValueFor(element), neutralFillStealthRestDelta.getValueFor(element), neutralFillStealthHoverDelta.getValueFor(element), neutralFillStealthActiveDelta.getValueFor(element), neutralFillStealthFocusDelta.getValueFor(element), neutralFillRestDelta.getValueFor(element), neutralFillHoverDelta.getValueFor(element), neutralFillActiveDelta.getValueFor(element), neutralFillFocusDelta.getValueFor(element)),
});
/** @public */
const neutralFillStealthRest = create("neutral-fill-stealth-rest").withDefault((element) => neutralFillStealthRecipe.getValueFor(element).evaluate(element).rest);
/** @public */
const neutralFillStealthHover = create("neutral-fill-stealth-hover").withDefault((element) => neutralFillStealthRecipe.getValueFor(element).evaluate(element).hover);
/** @public */
const neutralFillStealthActive = create("neutral-fill-stealth-active").withDefault((element) => neutralFillStealthRecipe.getValueFor(element).evaluate(element).active);
/** @public */
const neutralFillStealthFocus = create("neutral-fill-stealth-focus").withDefault((element) => neutralFillStealthRecipe.getValueFor(element).evaluate(element).focus);
// Neutral Fill Strong
/** @public */
const neutralFillStrongRecipe = create({
    name: "neutral-fill-strong-recipe",
    cssCustomPropertyName: null,
}).withDefault({
    evaluate: (element, reference) => (0,_color_recipes_neutral_fill_contrast_js__WEBPACK_IMPORTED_MODULE_17__.neutralFillContrast)(neutralPalette.getValueFor(element), reference || fillColor.getValueFor(element), neutralFillStrongRestDelta.getValueFor(element), neutralFillStrongHoverDelta.getValueFor(element), neutralFillStrongActiveDelta.getValueFor(element), neutralFillStrongFocusDelta.getValueFor(element)),
});
/** @public */
const neutralFillStrongRest = create("neutral-fill-strong-rest").withDefault((element) => neutralFillStrongRecipe.getValueFor(element).evaluate(element).rest);
/** @public */
const neutralFillStrongHover = create("neutral-fill-strong-hover").withDefault((element) => neutralFillStrongRecipe.getValueFor(element).evaluate(element).hover);
/** @public */
const neutralFillStrongActive = create("neutral-fill-strong-active").withDefault((element) => neutralFillStrongRecipe.getValueFor(element).evaluate(element).active);
/** @public */
const neutralFillStrongFocus = create("neutral-fill-strong-focus").withDefault((element) => neutralFillStrongRecipe.getValueFor(element).evaluate(element).focus);
// Neutral Fill Layer
/** @public */
const neutralFillLayerRecipe = createNonCss("neutral-fill-layer-recipe").withDefault({
    evaluate: (element, reference) => (0,_color_recipes_neutral_fill_layer_js__WEBPACK_IMPORTED_MODULE_18__.neutralFillLayer)(neutralPalette.getValueFor(element), reference || fillColor.getValueFor(element), neutralFillLayerRestDelta.getValueFor(element)),
});
/** @public */
const neutralFillLayerRest = create("neutral-fill-layer-rest").withDefault((element) => neutralFillLayerRecipe.getValueFor(element).evaluate(element));
// Focus Stroke Outer
/** @public */
const focusStrokeOuterRecipe = createNonCss("focus-stroke-outer-recipe").withDefault({
    evaluate: (element) => (0,_color_recipes_focus_stroke_js__WEBPACK_IMPORTED_MODULE_19__.focusStrokeOuter)(neutralPalette.getValueFor(element), fillColor.getValueFor(element)),
});
/** @public */
const focusStrokeOuter = create("focus-stroke-outer").withDefault((element) => focusStrokeOuterRecipe.getValueFor(element).evaluate(element));
// Focus Stroke Inner
/** @public */
const focusStrokeInnerRecipe = createNonCss("focus-stroke-inner-recipe").withDefault({
    evaluate: (element) => (0,_color_recipes_focus_stroke_js__WEBPACK_IMPORTED_MODULE_19__.focusStrokeInner)(accentPalette.getValueFor(element), fillColor.getValueFor(element), focusStrokeOuter.getValueFor(element)),
});
/** @public */
const focusStrokeInner = create("focus-stroke-inner").withDefault((element) => focusStrokeInnerRecipe.getValueFor(element).evaluate(element));
// Neutral Foreground Hint
/** @public */
const neutralForegroundHintRecipe = createNonCss("neutral-foreground-hint-recipe").withDefault({
    evaluate: (element) => (0,_color_recipes_neutral_foreground_hint_js__WEBPACK_IMPORTED_MODULE_20__.neutralForegroundHint)(neutralPalette.getValueFor(element), fillColor.getValueFor(element)),
});
/** @public */
const neutralForegroundHint = create("neutral-foreground-hint").withDefault((element) => neutralForegroundHintRecipe.getValueFor(element).evaluate(element));
// Neutral Foreground
/** @public */
const neutralForegroundRecipe = createNonCss("neutral-foreground-recipe").withDefault({
    evaluate: (element) => (0,_color_recipes_neutral_foreground_js__WEBPACK_IMPORTED_MODULE_21__.neutralForeground)(neutralPalette.getValueFor(element), fillColor.getValueFor(element)),
});
/** @public */
const neutralForegroundRest = create("neutral-foreground-rest").withDefault((element) => neutralForegroundRecipe.getValueFor(element).evaluate(element));
// Neutral Stroke
/** @public */
const neutralStrokeRecipe = create({
    name: "neutral-stroke-recipe",
    cssCustomPropertyName: null,
}).withDefault({
    evaluate: (element) => {
        return (0,_color_recipes_neutral_stroke_js__WEBPACK_IMPORTED_MODULE_22__.neutralStroke)(neutralPalette.getValueFor(element), fillColor.getValueFor(element), neutralStrokeRestDelta.getValueFor(element), neutralStrokeHoverDelta.getValueFor(element), neutralStrokeActiveDelta.getValueFor(element), neutralStrokeFocusDelta.getValueFor(element));
    },
});
/** @public */
const neutralStrokeRest = create("neutral-stroke-rest").withDefault((element) => neutralStrokeRecipe.getValueFor(element).evaluate(element).rest);
/** @public */
const neutralStrokeHover = create("neutral-stroke-hover").withDefault((element) => neutralStrokeRecipe.getValueFor(element).evaluate(element).hover);
/** @public */
const neutralStrokeActive = create("neutral-stroke-active").withDefault((element) => neutralStrokeRecipe.getValueFor(element).evaluate(element).active);
/** @public */
const neutralStrokeFocus = create("neutral-stroke-focus").withDefault((element) => neutralStrokeRecipe.getValueFor(element).evaluate(element).focus);
// Neutral Stroke Divider
/** @public */
const neutralStrokeDividerRecipe = createNonCss("neutral-stroke-divider-recipe").withDefault({
    evaluate: (element, reference) => (0,_color_recipes_neutral_stroke_divider_js__WEBPACK_IMPORTED_MODULE_23__.neutralStrokeDivider)(neutralPalette.getValueFor(element), reference || fillColor.getValueFor(element), neutralStrokeDividerRestDelta.getValueFor(element)),
});
/** @public */
const neutralStrokeDividerRest = create("neutral-stroke-divider-rest").withDefault(element => neutralStrokeDividerRecipe.getValueFor(element).evaluate(element));
/**
 * The control height formula expressed as a design token.
 * This token does not provide a CSS custom property.
 *
 * @public
 */
const heightNumberAsToken = _microsoft_fast_foundation__WEBPACK_IMPORTED_MODULE_0__.DesignToken.create({
    name: "height-number",
    cssCustomPropertyName: null,
}).withDefault(target => (baseHeightMultiplier.getValueFor(target) + density.getValueFor(target)) *
    designUnit.getValueFor(target));


/***/ }),

/***/ "./node_modules/@microsoft/fast-components/dist/esm/fast-design-system.js":
/*!********************************************************************************!*\
  !*** ./node_modules/@microsoft/fast-components/dist/esm/fast-design-system.js ***!
  \********************************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "provideFASTDesignSystem": () => (/* binding */ provideFASTDesignSystem)
/* harmony export */ });
/* harmony import */ var _microsoft_fast_foundation__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @microsoft/fast-foundation */ "./node_modules/@microsoft/fast-foundation/dist/esm/design-system/design-system.js");

/**
 * Provides a design system for the specified element either by returning one that was
 * already created for that element or creating one.
 * @param element - The element to root the design system at. By default, this is the body.
 * @returns A FAST Design System
 * @public
 */
function provideFASTDesignSystem(element) {
    return _microsoft_fast_foundation__WEBPACK_IMPORTED_MODULE_0__.DesignSystem.getOrCreate(element).withPrefix("fast");
}


/***/ }),

/***/ "./node_modules/@microsoft/fast-components/dist/esm/styles/patterns/button.js":
/*!************************************************************************************!*\
  !*** ./node_modules/@microsoft/fast-components/dist/esm/styles/patterns/button.js ***!
  \************************************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "AccentButtonStyles": () => (/* binding */ AccentButtonStyles),
/* harmony export */   "BaseButtonStyles": () => (/* binding */ BaseButtonStyles),
/* harmony export */   "HypertextStyles": () => (/* binding */ HypertextStyles),
/* harmony export */   "LightweightButtonStyles": () => (/* binding */ LightweightButtonStyles),
/* harmony export */   "OutlineButtonStyles": () => (/* binding */ OutlineButtonStyles),
/* harmony export */   "StealthButtonStyles": () => (/* binding */ StealthButtonStyles)
/* harmony export */ });
/* harmony import */ var _microsoft_fast_element__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @microsoft/fast-element */ "./node_modules/@microsoft/fast-element/dist/esm/styles/css.js");
/* harmony import */ var _microsoft_fast_foundation__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @microsoft/fast-foundation */ "./node_modules/@microsoft/fast-foundation/dist/esm/utilities/style/display.js");
/* harmony import */ var _microsoft_fast_foundation__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @microsoft/fast-foundation */ "./node_modules/@microsoft/fast-foundation/dist/esm/utilities/style/focus.js");
/* harmony import */ var _microsoft_fast_foundation__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! @microsoft/fast-foundation */ "./node_modules/@microsoft/fast-foundation/dist/esm/utilities/match-media-stylesheet-behavior.js");
/* harmony import */ var _microsoft_fast_web_utilities__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! @microsoft/fast-web-utilities */ "./node_modules/@microsoft/fast-components/node_modules/@microsoft/fast-web-utilities/dist/system-colors.js");
/* harmony import */ var _size_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../size.js */ "./node_modules/@microsoft/fast-components/dist/esm/styles/size.js");
/* harmony import */ var _design_tokens_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../design-tokens.js */ "./node_modules/@microsoft/fast-components/dist/esm/design-tokens.js");





/**
 * @internal
 */
const BaseButtonStyles = _microsoft_fast_element__WEBPACK_IMPORTED_MODULE_0__.css `
    ${(0,_microsoft_fast_foundation__WEBPACK_IMPORTED_MODULE_1__.display)("inline-flex")} :host {
        font-family: ${_design_tokens_js__WEBPACK_IMPORTED_MODULE_2__.bodyFont};
        outline: none;
        font-size: ${_design_tokens_js__WEBPACK_IMPORTED_MODULE_2__.typeRampBaseFontSize};
        line-height: ${_design_tokens_js__WEBPACK_IMPORTED_MODULE_2__.typeRampBaseLineHeight};
        height: calc(${_size_js__WEBPACK_IMPORTED_MODULE_3__.heightNumber} * 1px);
        min-width: calc(${_size_js__WEBPACK_IMPORTED_MODULE_3__.heightNumber} * 1px);
        background-color: ${_design_tokens_js__WEBPACK_IMPORTED_MODULE_2__.neutralFillRest};
        color: ${_design_tokens_js__WEBPACK_IMPORTED_MODULE_2__.neutralForegroundRest};
        border-radius: calc(${_design_tokens_js__WEBPACK_IMPORTED_MODULE_2__.controlCornerRadius} * 1px);
        fill: currentcolor;
        cursor: pointer;
    }

    .control {
        background: transparent;
        height: inherit;
        flex-grow: 1;
        box-sizing: border-box;
        display: inline-flex;
        justify-content: center;
        align-items: baseline;
        padding: 0 calc((10 + (${_design_tokens_js__WEBPACK_IMPORTED_MODULE_2__.designUnit} * 2 * ${_design_tokens_js__WEBPACK_IMPORTED_MODULE_2__.density})) * 1px);
        white-space: nowrap;
        outline: none;
        text-decoration: none;
        border: calc(${_design_tokens_js__WEBPACK_IMPORTED_MODULE_2__.strokeWidth} * 1px) solid transparent;
        color: inherit;
        border-radius: inherit;
        fill: inherit;
        cursor: inherit;
        font-weight: inherit;
        font-family: inherit;
        font-size: inherit;
        line-height: inherit;
    }

    :host(:hover) {
        background-color: ${_design_tokens_js__WEBPACK_IMPORTED_MODULE_2__.neutralFillHover};
    }

    :host(:active) {
        background-color: ${_design_tokens_js__WEBPACK_IMPORTED_MODULE_2__.neutralFillActive};
    }

    .control:${_microsoft_fast_foundation__WEBPACK_IMPORTED_MODULE_4__.focusVisible} {
        border-color: ${_design_tokens_js__WEBPACK_IMPORTED_MODULE_2__.focusStrokeOuter};
        box-shadow: 0 0 0 calc((${_design_tokens_js__WEBPACK_IMPORTED_MODULE_2__.focusStrokeWidth} - ${_design_tokens_js__WEBPACK_IMPORTED_MODULE_2__.strokeWidth}) * 1px) ${_design_tokens_js__WEBPACK_IMPORTED_MODULE_2__.focusStrokeOuter} inset;
    }

    .control::-moz-focus-inner {
        border: 0;
    }

    .start,
    .content,
    .end {
        align-self: center;
    }

    .start,
    .end {
        display: flex;
    }

    .control.icon-only {
        padding: 0;
        line-height: 0;
    }

    ::slotted(svg) {
        ${
/* Glyph size and margin-left is temporary -
replace when adaptive typography is figured out */ ""} width: 16px;
        height: 16px;
        pointer-events: none;
    }

    .start {
        margin-inline-end: 11px;
    }

    .end {
        margin-inline-start: 11px;
    }
`.withBehaviors((0,_microsoft_fast_foundation__WEBPACK_IMPORTED_MODULE_5__.forcedColorsStylesheetBehavior)(_microsoft_fast_element__WEBPACK_IMPORTED_MODULE_0__.css `
            :host .control {
              background-color: ${_microsoft_fast_web_utilities__WEBPACK_IMPORTED_MODULE_6__.SystemColors.ButtonFace};
              border-color: ${_microsoft_fast_web_utilities__WEBPACK_IMPORTED_MODULE_6__.SystemColors.ButtonText};
              color: ${_microsoft_fast_web_utilities__WEBPACK_IMPORTED_MODULE_6__.SystemColors.ButtonText};
              fill: currentColor;
            }

            :host(:hover) .control {
              forced-color-adjust: none;
              background-color: ${_microsoft_fast_web_utilities__WEBPACK_IMPORTED_MODULE_6__.SystemColors.Highlight};
              color: ${_microsoft_fast_web_utilities__WEBPACK_IMPORTED_MODULE_6__.SystemColors.HighlightText};
            }

            .control:${_microsoft_fast_foundation__WEBPACK_IMPORTED_MODULE_4__.focusVisible} {
              forced-color-adjust: none;
              background-color: ${_microsoft_fast_web_utilities__WEBPACK_IMPORTED_MODULE_6__.SystemColors.Highlight};
              border-color: ${_microsoft_fast_web_utilities__WEBPACK_IMPORTED_MODULE_6__.SystemColors.ButtonText};
              box-shadow: 0 0 0 calc((${_design_tokens_js__WEBPACK_IMPORTED_MODULE_2__.focusStrokeWidth} - ${_design_tokens_js__WEBPACK_IMPORTED_MODULE_2__.strokeWidth}) * 1px) ${_microsoft_fast_web_utilities__WEBPACK_IMPORTED_MODULE_6__.SystemColors.ButtonText} inset;
              color: ${_microsoft_fast_web_utilities__WEBPACK_IMPORTED_MODULE_6__.SystemColors.HighlightText};
            }

            .control:hover,
            :host([appearance="outline"]) .control:hover {
              border-color: ${_microsoft_fast_web_utilities__WEBPACK_IMPORTED_MODULE_6__.SystemColors.ButtonText};
            }

            :host([href]) .control {
                border-color: ${_microsoft_fast_web_utilities__WEBPACK_IMPORTED_MODULE_6__.SystemColors.LinkText};
                color: ${_microsoft_fast_web_utilities__WEBPACK_IMPORTED_MODULE_6__.SystemColors.LinkText};
            }

            :host([href]) .control:hover,
            :host([href]) .control:${_microsoft_fast_foundation__WEBPACK_IMPORTED_MODULE_4__.focusVisible}{
              forced-color-adjust: none;
              background: ${_microsoft_fast_web_utilities__WEBPACK_IMPORTED_MODULE_6__.SystemColors.ButtonFace};
              border-color: ${_microsoft_fast_web_utilities__WEBPACK_IMPORTED_MODULE_6__.SystemColors.LinkText};
              box-shadow: 0 0 0 1px ${_microsoft_fast_web_utilities__WEBPACK_IMPORTED_MODULE_6__.SystemColors.LinkText} inset;
              color: ${_microsoft_fast_web_utilities__WEBPACK_IMPORTED_MODULE_6__.SystemColors.LinkText};
              fill: currentColor;
            }
        `));
/**
 * @internal
 */
const AccentButtonStyles = _microsoft_fast_element__WEBPACK_IMPORTED_MODULE_0__.css `
    :host([appearance="accent"]) {
        background: ${_design_tokens_js__WEBPACK_IMPORTED_MODULE_2__.accentFillRest};
        color: ${_design_tokens_js__WEBPACK_IMPORTED_MODULE_2__.foregroundOnAccentRest};
    }

    :host([appearance="accent"]:hover) {
        background: ${_design_tokens_js__WEBPACK_IMPORTED_MODULE_2__.accentFillHover};
        color: ${_design_tokens_js__WEBPACK_IMPORTED_MODULE_2__.foregroundOnAccentHover};
    }

    :host([appearance="accent"]:active) .control:active {
        background: ${_design_tokens_js__WEBPACK_IMPORTED_MODULE_2__.accentFillActive};
        color: ${_design_tokens_js__WEBPACK_IMPORTED_MODULE_2__.foregroundOnAccentActive};
    }

    :host([appearance="accent"]) .control:${_microsoft_fast_foundation__WEBPACK_IMPORTED_MODULE_4__.focusVisible} {
        box-shadow: 0 0 0 calc((${_design_tokens_js__WEBPACK_IMPORTED_MODULE_2__.focusStrokeWidth} - ${_design_tokens_js__WEBPACK_IMPORTED_MODULE_2__.strokeWidth}) * 1px) ${_design_tokens_js__WEBPACK_IMPORTED_MODULE_2__.focusStrokeOuter} inset,
            0 0 0 calc((${_design_tokens_js__WEBPACK_IMPORTED_MODULE_2__.focusStrokeWidth} + ${_design_tokens_js__WEBPACK_IMPORTED_MODULE_2__.strokeWidth}) * 1px) ${_design_tokens_js__WEBPACK_IMPORTED_MODULE_2__.focusStrokeInner} inset;
    }
`;
/**
 * @internal
 */
const HypertextStyles = _microsoft_fast_element__WEBPACK_IMPORTED_MODULE_0__.css `
    :host([appearance="hypertext"]) {
        font-size: inherit;
        line-height: inherit;
        height: auto;
        min-width: 0;
        background: transparent;
    }

    :host([appearance="hypertext"]) .control {
        display: inline;
        padding: 0;
        border: none;
        box-shadow: none;
        border-radius: 0;
        line-height: 1;
    }

    :host a.control:not(:link) {
        background-color: transparent;
        cursor: default;
    }
    :host([appearance="hypertext"]) .control:link,
    :host([appearance="hypertext"]) .control:visited {
        background: transparent;
        color: ${_design_tokens_js__WEBPACK_IMPORTED_MODULE_2__.accentForegroundRest};
        border-bottom: calc(${_design_tokens_js__WEBPACK_IMPORTED_MODULE_2__.strokeWidth} * 1px) solid ${_design_tokens_js__WEBPACK_IMPORTED_MODULE_2__.accentForegroundRest};
    }

    :host([appearance="hypertext"]:hover),
    :host([appearance="hypertext"]) .control:hover {
        background: transparent;
        border-bottom-color: ${_design_tokens_js__WEBPACK_IMPORTED_MODULE_2__.accentForegroundHover};
    }

    :host([appearance="hypertext"]:active),
    :host([appearance="hypertext"]) .control:active {
        background: transparent;
        border-bottom-color: ${_design_tokens_js__WEBPACK_IMPORTED_MODULE_2__.accentForegroundActive};
    }

    :host([appearance="hypertext"]) .control:${_microsoft_fast_foundation__WEBPACK_IMPORTED_MODULE_4__.focusVisible} {
        border-bottom: calc(${_design_tokens_js__WEBPACK_IMPORTED_MODULE_2__.focusStrokeWidth} * 1px) solid ${_design_tokens_js__WEBPACK_IMPORTED_MODULE_2__.focusStrokeOuter};
        margin-bottom: calc(calc(${_design_tokens_js__WEBPACK_IMPORTED_MODULE_2__.strokeWidth} - ${_design_tokens_js__WEBPACK_IMPORTED_MODULE_2__.focusStrokeWidth}) * 1px);
    }
`.withBehaviors((0,_microsoft_fast_foundation__WEBPACK_IMPORTED_MODULE_5__.forcedColorsStylesheetBehavior)(_microsoft_fast_element__WEBPACK_IMPORTED_MODULE_0__.css `
            :host([appearance="hypertext"]:hover) {
                background-color: ${_microsoft_fast_web_utilities__WEBPACK_IMPORTED_MODULE_6__.SystemColors.ButtonFace};
                color: ${_microsoft_fast_web_utilities__WEBPACK_IMPORTED_MODULE_6__.SystemColors.ButtonText};
            }
            :host([appearance="hypertext"][href]) .control:hover,
            :host([appearance="hypertext"][href]) .control:active,
            :host([appearance="hypertext"][href]) .control:${_microsoft_fast_foundation__WEBPACK_IMPORTED_MODULE_4__.focusVisible} {
                color: ${_microsoft_fast_web_utilities__WEBPACK_IMPORTED_MODULE_6__.SystemColors.LinkText};
                border-bottom-color: ${_microsoft_fast_web_utilities__WEBPACK_IMPORTED_MODULE_6__.SystemColors.LinkText};
                box-shadow: none;
            }
        `));
/**
 * @internal
 */
const LightweightButtonStyles = _microsoft_fast_element__WEBPACK_IMPORTED_MODULE_0__.css `
    :host([appearance="lightweight"]) {
        background: transparent;
        color: ${_design_tokens_js__WEBPACK_IMPORTED_MODULE_2__.accentForegroundRest};
    }

    :host([appearance="lightweight"]) .control {
        padding: 0;
        height: initial;
        border: none;
        box-shadow: none;
        border-radius: 0;
    }

    :host([appearance="lightweight"]:hover) {
        background: transparent;
        color: ${_design_tokens_js__WEBPACK_IMPORTED_MODULE_2__.accentForegroundHover};
    }

    :host([appearance="lightweight"]:active) {
        background: transparent;
        color: ${_design_tokens_js__WEBPACK_IMPORTED_MODULE_2__.accentForegroundActive};
    }

    :host([appearance="lightweight"]) .content {
        position: relative;
    }

    :host([appearance="lightweight"]) .content::before {
        content: "";
        display: block;
        height: calc(${_design_tokens_js__WEBPACK_IMPORTED_MODULE_2__.strokeWidth} * 1px);
        position: absolute;
        top: calc(1em + 4px);
        width: 100%;
    }

    :host([appearance="lightweight"]:hover) .content::before {
        background: ${_design_tokens_js__WEBPACK_IMPORTED_MODULE_2__.accentForegroundHover};
    }

    :host([appearance="lightweight"]:active) .content::before {
        background: ${_design_tokens_js__WEBPACK_IMPORTED_MODULE_2__.accentForegroundActive};
    }

    :host([appearance="lightweight"]) .control:${_microsoft_fast_foundation__WEBPACK_IMPORTED_MODULE_4__.focusVisible} .content::before {
        background: ${_design_tokens_js__WEBPACK_IMPORTED_MODULE_2__.neutralForegroundRest};
        height: calc(${_design_tokens_js__WEBPACK_IMPORTED_MODULE_2__.focusStrokeWidth} * 1px);
    }
`.withBehaviors((0,_microsoft_fast_foundation__WEBPACK_IMPORTED_MODULE_5__.forcedColorsStylesheetBehavior)(_microsoft_fast_element__WEBPACK_IMPORTED_MODULE_0__.css `
            :host([appearance="lightweight"]) .control:hover,
            :host([appearance="lightweight"]) .control:${_microsoft_fast_foundation__WEBPACK_IMPORTED_MODULE_4__.focusVisible} {
                forced-color-adjust: none;
                background: ${_microsoft_fast_web_utilities__WEBPACK_IMPORTED_MODULE_6__.SystemColors.ButtonFace};
                color: ${_microsoft_fast_web_utilities__WEBPACK_IMPORTED_MODULE_6__.SystemColors.Highlight};
            }
            :host([appearance="lightweight"]) .control:hover .content::before,
            :host([appearance="lightweight"]) .control:${_microsoft_fast_foundation__WEBPACK_IMPORTED_MODULE_4__.focusVisible} .content::before {
                background: ${_microsoft_fast_web_utilities__WEBPACK_IMPORTED_MODULE_6__.SystemColors.Highlight};
            }

            :host([appearance="lightweight"][href]) .control:hover,
            :host([appearance="lightweight"][href]) .control:${_microsoft_fast_foundation__WEBPACK_IMPORTED_MODULE_4__.focusVisible} {
                background: ${_microsoft_fast_web_utilities__WEBPACK_IMPORTED_MODULE_6__.SystemColors.ButtonFace};
                box-shadow: none;
                color: ${_microsoft_fast_web_utilities__WEBPACK_IMPORTED_MODULE_6__.SystemColors.LinkText};
            }

            :host([appearance="lightweight"][href]) .control:hover .content::before,
            :host([appearance="lightweight"][href]) .control:${_microsoft_fast_foundation__WEBPACK_IMPORTED_MODULE_4__.focusVisible} .content::before {
                background: ${_microsoft_fast_web_utilities__WEBPACK_IMPORTED_MODULE_6__.SystemColors.LinkText};
            }
        `));
/**
 * @internal
 */
const OutlineButtonStyles = _microsoft_fast_element__WEBPACK_IMPORTED_MODULE_0__.css `
    :host([appearance="outline"]) {
        background: transparent;
        border-color: ${_design_tokens_js__WEBPACK_IMPORTED_MODULE_2__.accentFillRest};
    }

    :host([appearance="outline"]:hover) {
        border-color: ${_design_tokens_js__WEBPACK_IMPORTED_MODULE_2__.accentFillHover};
    }

    :host([appearance="outline"]:active) {
        border-color: ${_design_tokens_js__WEBPACK_IMPORTED_MODULE_2__.accentFillActive};
    }

    :host([appearance="outline"]) .control {
        border-color: inherit;
    }

    :host([appearance="outline"]) .control:${_microsoft_fast_foundation__WEBPACK_IMPORTED_MODULE_4__.focusVisible} {
        box-shadow: 0 0 0 calc((${_design_tokens_js__WEBPACK_IMPORTED_MODULE_2__.focusStrokeWidth} - ${_design_tokens_js__WEBPACK_IMPORTED_MODULE_2__.strokeWidth}) * 1px) ${_design_tokens_js__WEBPACK_IMPORTED_MODULE_2__.focusStrokeOuter} inset;
        border-color: ${_design_tokens_js__WEBPACK_IMPORTED_MODULE_2__.focusStrokeOuter};
    }
`.withBehaviors((0,_microsoft_fast_foundation__WEBPACK_IMPORTED_MODULE_5__.forcedColorsStylesheetBehavior)(_microsoft_fast_element__WEBPACK_IMPORTED_MODULE_0__.css `
            :host([appearance="outline"]) .control {
                border-color: ${_microsoft_fast_web_utilities__WEBPACK_IMPORTED_MODULE_6__.SystemColors.ButtonText};
            }
            :host([appearance="outline"]) .control:${_microsoft_fast_foundation__WEBPACK_IMPORTED_MODULE_4__.focusVisible} {
              forced-color-adjust: none;
              background-color: ${_microsoft_fast_web_utilities__WEBPACK_IMPORTED_MODULE_6__.SystemColors.Highlight};
              border-color: ${_microsoft_fast_web_utilities__WEBPACK_IMPORTED_MODULE_6__.SystemColors.ButtonText};
              box-shadow: 0 0 0 calc((${_design_tokens_js__WEBPACK_IMPORTED_MODULE_2__.focusStrokeWidth} - ${_design_tokens_js__WEBPACK_IMPORTED_MODULE_2__.strokeWidth}) * 1px) ${_microsoft_fast_web_utilities__WEBPACK_IMPORTED_MODULE_6__.SystemColors.ButtonText} inset;
              color: ${_microsoft_fast_web_utilities__WEBPACK_IMPORTED_MODULE_6__.SystemColors.HighlightText};
              fill: currentColor;
            }
            :host([appearance="outline"][href]) .control {
                background: ${_microsoft_fast_web_utilities__WEBPACK_IMPORTED_MODULE_6__.SystemColors.ButtonFace};
                border-color: ${_microsoft_fast_web_utilities__WEBPACK_IMPORTED_MODULE_6__.SystemColors.LinkText};
                color: ${_microsoft_fast_web_utilities__WEBPACK_IMPORTED_MODULE_6__.SystemColors.LinkText};
                fill: currentColor;
            }
            :host([appearance="outline"][href]) .control:hover,
            :host([appearance="outline"][href]) .control:${_microsoft_fast_foundation__WEBPACK_IMPORTED_MODULE_4__.focusVisible} {
              forced-color-adjust: none;
              border-color: ${_microsoft_fast_web_utilities__WEBPACK_IMPORTED_MODULE_6__.SystemColors.LinkText};
              box-shadow: 0 0 0 1px ${_microsoft_fast_web_utilities__WEBPACK_IMPORTED_MODULE_6__.SystemColors.LinkText} inset;
            }
        `));
/**
 * @internal
 */
const StealthButtonStyles = _microsoft_fast_element__WEBPACK_IMPORTED_MODULE_0__.css `
    :host([appearance="stealth"]) {
        background: ${_design_tokens_js__WEBPACK_IMPORTED_MODULE_2__.neutralFillStealthRest};
    }

    :host([appearance="stealth"]:hover) {
        background: ${_design_tokens_js__WEBPACK_IMPORTED_MODULE_2__.neutralFillStealthHover};
    }

    :host([appearance="stealth"]:active) {
        background: ${_design_tokens_js__WEBPACK_IMPORTED_MODULE_2__.neutralFillStealthActive};
    }
`.withBehaviors((0,_microsoft_fast_foundation__WEBPACK_IMPORTED_MODULE_5__.forcedColorsStylesheetBehavior)(_microsoft_fast_element__WEBPACK_IMPORTED_MODULE_0__.css `
            :host([appearance="stealth"]),
            :host([appearance="stealth"]) .control {
                forced-color-adjust: none;
                background: ${_microsoft_fast_web_utilities__WEBPACK_IMPORTED_MODULE_6__.SystemColors.ButtonFace};
                border-color: transparent;
                color: ${_microsoft_fast_web_utilities__WEBPACK_IMPORTED_MODULE_6__.SystemColors.ButtonText};
                fill: currentColor;
            }

            :host([appearance="stealth"]:hover) .control {
                background: ${_microsoft_fast_web_utilities__WEBPACK_IMPORTED_MODULE_6__.SystemColors.Highlight};
                border-color: ${_microsoft_fast_web_utilities__WEBPACK_IMPORTED_MODULE_6__.SystemColors.Highlight};
                color: ${_microsoft_fast_web_utilities__WEBPACK_IMPORTED_MODULE_6__.SystemColors.HighlightText};
                fill: currentColor;
            }

            :host([appearance="stealth"]:${_microsoft_fast_foundation__WEBPACK_IMPORTED_MODULE_4__.focusVisible}) .control {
                background: ${_microsoft_fast_web_utilities__WEBPACK_IMPORTED_MODULE_6__.SystemColors.Highlight};
                box-shadow: 0 0 0 1px ${_microsoft_fast_web_utilities__WEBPACK_IMPORTED_MODULE_6__.SystemColors.Highlight};
                color: ${_microsoft_fast_web_utilities__WEBPACK_IMPORTED_MODULE_6__.SystemColors.HighlightText};
                fill: currentColor;
            }

            :host([appearance="stealth"][href]) .control {
                color: ${_microsoft_fast_web_utilities__WEBPACK_IMPORTED_MODULE_6__.SystemColors.LinkText};
            }

            :host([appearance="stealth"][href]:hover) .control,
            :host([appearance="stealth"][href]:${_microsoft_fast_foundation__WEBPACK_IMPORTED_MODULE_4__.focusVisible}) .control {
                background: ${_microsoft_fast_web_utilities__WEBPACK_IMPORTED_MODULE_6__.SystemColors.LinkText};
                border-color: ${_microsoft_fast_web_utilities__WEBPACK_IMPORTED_MODULE_6__.SystemColors.LinkText};
                color: ${_microsoft_fast_web_utilities__WEBPACK_IMPORTED_MODULE_6__.SystemColors.HighlightText};
                fill: currentColor;
            }

            :host([appearance="stealth"][href]:${_microsoft_fast_foundation__WEBPACK_IMPORTED_MODULE_4__.focusVisible}) .control {
                forced-color-adjust: none;
                box-shadow: 0 0 0 1px ${_microsoft_fast_web_utilities__WEBPACK_IMPORTED_MODULE_6__.SystemColors.LinkText};
            }
        `));


/***/ }),

/***/ "./node_modules/@microsoft/fast-components/dist/esm/styles/size.js":
/*!*************************************************************************!*\
  !*** ./node_modules/@microsoft/fast-components/dist/esm/styles/size.js ***!
  \*************************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "heightNumber": () => (/* binding */ heightNumber)
/* harmony export */ });
/* harmony import */ var _microsoft_fast_element__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @microsoft/fast-element */ "./node_modules/@microsoft/fast-element/dist/esm/styles/css.js");
/* harmony import */ var _design_tokens_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../design-tokens.js */ "./node_modules/@microsoft/fast-components/dist/esm/design-tokens.js");


/**
 * A formula to retrieve the control height.
 * Use this as the value of any CSS property that
 * accepts a pixel size.
 */
const heightNumber = _microsoft_fast_element__WEBPACK_IMPORTED_MODULE_0__.cssPartial `(${_design_tokens_js__WEBPACK_IMPORTED_MODULE_1__.baseHeightMultiplier} + ${_design_tokens_js__WEBPACK_IMPORTED_MODULE_1__.density}) * ${_design_tokens_js__WEBPACK_IMPORTED_MODULE_1__.designUnit}`;


/***/ }),

/***/ "./node_modules/@microsoft/fast-components/dist/esm/utilities/behaviors.js":
/*!*********************************************************************************!*\
  !*** ./node_modules/@microsoft/fast-components/dist/esm/utilities/behaviors.js ***!
  \*********************************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "appearanceBehavior": () => (/* binding */ appearanceBehavior)
/* harmony export */ });
/* harmony import */ var _microsoft_fast_foundation__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @microsoft/fast-foundation */ "./node_modules/@microsoft/fast-foundation/dist/esm/utilities/property-stylesheet-behavior.js");

/**
 * Behavior that will conditionally apply a stylesheet based on the elements
 * appearance property
 *
 * @param value - The value of the appearance property
 * @param styles - The styles to be applied when condition matches
 *
 * @public
 */
function appearanceBehavior(value, styles) {
    return new _microsoft_fast_foundation__WEBPACK_IMPORTED_MODULE_0__.PropertyStyleSheetBehavior("appearance", value, styles);
}


/***/ }),

/***/ "./node_modules/@microsoft/fast-components/node_modules/@microsoft/fast-web-utilities/dist/localization.js":
/*!*****************************************************************************************************************!*\
  !*** ./node_modules/@microsoft/fast-components/node_modules/@microsoft/fast-web-utilities/dist/localization.js ***!
  \*****************************************************************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "Direction": () => (/* binding */ Direction)
/* harmony export */ });
/**
 * Expose ltr and rtl strings
 */
var Direction;
(function (Direction) {
    Direction["ltr"] = "ltr";
    Direction["rtl"] = "rtl";
})(Direction || (Direction = {}));


/***/ }),

/***/ "./node_modules/@microsoft/fast-components/node_modules/@microsoft/fast-web-utilities/dist/system-colors.js":
/*!******************************************************************************************************************!*\
  !*** ./node_modules/@microsoft/fast-components/node_modules/@microsoft/fast-web-utilities/dist/system-colors.js ***!
  \******************************************************************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "SystemColors": () => (/* binding */ SystemColors)
/* harmony export */ });
/**
 * Define system colors for use in CSS stylesheets.
 *
 * https://drafts.csswg.org/css-color/#css-system-colors
 */
var SystemColors;
(function (SystemColors) {
    SystemColors["Canvas"] = "Canvas";
    SystemColors["CanvasText"] = "CanvasText";
    SystemColors["LinkText"] = "LinkText";
    SystemColors["VisitedText"] = "VisitedText";
    SystemColors["ActiveText"] = "ActiveText";
    SystemColors["ButtonFace"] = "ButtonFace";
    SystemColors["ButtonText"] = "ButtonText";
    SystemColors["Field"] = "Field";
    SystemColors["FieldText"] = "FieldText";
    SystemColors["Highlight"] = "Highlight";
    SystemColors["HighlightText"] = "HighlightText";
    SystemColors["GrayText"] = "GrayText";
})(SystemColors || (SystemColors = {}));


/***/ }),

/***/ "./node_modules/@microsoft/fast-element/dist/esm/components/attributes.js":
/*!********************************************************************************!*\
  !*** ./node_modules/@microsoft/fast-element/dist/esm/components/attributes.js ***!
  \********************************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "AttributeDefinition": () => (/* binding */ AttributeDefinition),
/* harmony export */   "attr": () => (/* binding */ attr),
/* harmony export */   "booleanConverter": () => (/* binding */ booleanConverter),
/* harmony export */   "nullableNumberConverter": () => (/* binding */ nullableNumberConverter)
/* harmony export */ });
/* harmony import */ var _observation_observable_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../observation/observable.js */ "./node_modules/@microsoft/fast-element/dist/esm/observation/observable.js");
/* harmony import */ var _dom_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../dom.js */ "./node_modules/@microsoft/fast-element/dist/esm/dom.js");


/**
 * A {@link ValueConverter} that converts to and from `boolean` values.
 * @remarks
 * Used automatically when the `boolean` {@link AttributeMode} is selected.
 * @public
 */
const booleanConverter = {
    toView(value) {
        return value ? "true" : "false";
    },
    fromView(value) {
        if (value === null ||
            value === void 0 ||
            value === "false" ||
            value === false ||
            value === 0) {
            return false;
        }
        return true;
    },
};
/**
 * A {@link ValueConverter} that converts to and from `number` values.
 * @remarks
 * This converter allows for nullable numbers, returning `null` if the
 * input was `null`, `undefined`, or `NaN`.
 * @public
 */
const nullableNumberConverter = {
    toView(value) {
        if (value === null || value === undefined) {
            return null;
        }
        const number = value * 1;
        return isNaN(number) ? null : number.toString();
    },
    fromView(value) {
        if (value === null || value === undefined) {
            return null;
        }
        const number = value * 1;
        return isNaN(number) ? null : number;
    },
};
/**
 * An implementation of {@link Accessor} that supports reactivity,
 * change callbacks, attribute reflection, and type conversion for
 * custom elements.
 * @public
 */
class AttributeDefinition {
    /**
     * Creates an instance of AttributeDefinition.
     * @param Owner - The class constructor that owns this attribute.
     * @param name - The name of the property associated with the attribute.
     * @param attribute - The name of the attribute in HTML.
     * @param mode - The {@link AttributeMode} that describes the behavior of this attribute.
     * @param converter - A {@link ValueConverter} that integrates with the property getter/setter
     * to convert values to and from a DOM string.
     */
    constructor(Owner, name, attribute = name.toLowerCase(), mode = "reflect", converter) {
        this.guards = new Set();
        this.Owner = Owner;
        this.name = name;
        this.attribute = attribute;
        this.mode = mode;
        this.converter = converter;
        this.fieldName = `_${name}`;
        this.callbackName = `${name}Changed`;
        this.hasCallback = this.callbackName in Owner.prototype;
        if (mode === "boolean" && converter === void 0) {
            this.converter = booleanConverter;
        }
    }
    /**
     * Sets the value of the attribute/property on the source element.
     * @param source - The source element to access.
     * @param value - The value to set the attribute/property to.
     */
    setValue(source, newValue) {
        const oldValue = source[this.fieldName];
        const converter = this.converter;
        if (converter !== void 0) {
            newValue = converter.fromView(newValue);
        }
        if (oldValue !== newValue) {
            source[this.fieldName] = newValue;
            this.tryReflectToAttribute(source);
            if (this.hasCallback) {
                source[this.callbackName](oldValue, newValue);
            }
            source.$fastController.notify(this.name);
        }
    }
    /**
     * Gets the value of the attribute/property on the source element.
     * @param source - The source element to access.
     */
    getValue(source) {
        _observation_observable_js__WEBPACK_IMPORTED_MODULE_0__.Observable.track(source, this.name);
        return source[this.fieldName];
    }
    /** @internal */
    onAttributeChangedCallback(element, value) {
        if (this.guards.has(element)) {
            return;
        }
        this.guards.add(element);
        this.setValue(element, value);
        this.guards.delete(element);
    }
    tryReflectToAttribute(element) {
        const mode = this.mode;
        const guards = this.guards;
        if (guards.has(element) || mode === "fromView") {
            return;
        }
        _dom_js__WEBPACK_IMPORTED_MODULE_1__.DOM.queueUpdate(() => {
            guards.add(element);
            const latestValue = element[this.fieldName];
            switch (mode) {
                case "reflect":
                    const converter = this.converter;
                    _dom_js__WEBPACK_IMPORTED_MODULE_1__.DOM.setAttribute(element, this.attribute, converter !== void 0 ? converter.toView(latestValue) : latestValue);
                    break;
                case "boolean":
                    _dom_js__WEBPACK_IMPORTED_MODULE_1__.DOM.setBooleanAttribute(element, this.attribute, latestValue);
                    break;
            }
            guards.delete(element);
        });
    }
    /**
     * Collects all attribute definitions associated with the owner.
     * @param Owner - The class constructor to collect attribute for.
     * @param attributeLists - Any existing attributes to collect and merge with those associated with the owner.
     * @internal
     */
    static collect(Owner, ...attributeLists) {
        const attributes = [];
        attributeLists.push(Owner.attributes);
        for (let i = 0, ii = attributeLists.length; i < ii; ++i) {
            const list = attributeLists[i];
            if (list === void 0) {
                continue;
            }
            for (let j = 0, jj = list.length; j < jj; ++j) {
                const config = list[j];
                if (typeof config === "string") {
                    attributes.push(new AttributeDefinition(Owner, config));
                }
                else {
                    attributes.push(new AttributeDefinition(Owner, config.property, config.attribute, config.mode, config.converter));
                }
            }
        }
        return attributes;
    }
}
function attr(configOrTarget, prop) {
    let config;
    function decorator($target, $prop) {
        if (arguments.length > 1) {
            // Non invocation:
            // - @attr
            // Invocation with or w/o opts:
            // - @attr()
            // - @attr({...opts})
            config.property = $prop;
        }
        const attributes = $target.constructor.attributes ||
            ($target.constructor.attributes = []);
        attributes.push(config);
    }
    if (arguments.length > 1) {
        // Non invocation:
        // - @attr
        config = {};
        decorator(configOrTarget, prop);
        return;
    }
    // Invocation with or w/o opts:
    // - @attr()
    // - @attr({...opts})
    config = configOrTarget === void 0 ? {} : configOrTarget;
    return decorator;
}


/***/ }),

/***/ "./node_modules/@microsoft/fast-element/dist/esm/components/controller.js":
/*!********************************************************************************!*\
  !*** ./node_modules/@microsoft/fast-element/dist/esm/components/controller.js ***!
  \********************************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "Controller": () => (/* binding */ Controller)
/* harmony export */ });
/* harmony import */ var _dom_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../dom.js */ "./node_modules/@microsoft/fast-element/dist/esm/dom.js");
/* harmony import */ var _observation_notifier_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../observation/notifier.js */ "./node_modules/@microsoft/fast-element/dist/esm/observation/notifier.js");
/* harmony import */ var _observation_observable_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../observation/observable.js */ "./node_modules/@microsoft/fast-element/dist/esm/observation/observable.js");
/* harmony import */ var _fast_definitions_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./fast-definitions.js */ "./node_modules/@microsoft/fast-element/dist/esm/components/fast-definitions.js");




const shadowRoots = new WeakMap();
const defaultEventOptions = {
    bubbles: true,
    composed: true,
    cancelable: true,
};
function getShadowRoot(element) {
    return element.shadowRoot || shadowRoots.get(element) || null;
}
/**
 * Controls the lifecycle and rendering of a `FASTElement`.
 * @public
 */
class Controller extends _observation_notifier_js__WEBPACK_IMPORTED_MODULE_0__.PropertyChangeNotifier {
    /**
     * Creates a Controller to control the specified element.
     * @param element - The element to be controlled by this controller.
     * @param definition - The element definition metadata that instructs this
     * controller in how to handle rendering and other platform integrations.
     * @internal
     */
    constructor(element, definition) {
        super(element);
        this.boundObservables = null;
        this.behaviors = null;
        this.needsInitialization = true;
        this._template = null;
        this._styles = null;
        this._isConnected = false;
        /**
         * This allows Observable.getNotifier(...) to return the Controller
         * when the notifier for the Controller itself is being requested. The
         * result is that the Observable system does not need to create a separate
         * instance of Notifier for observables on the Controller. The component and
         * the controller will now share the same notifier, removing one-object construct
         * per web component instance.
         */
        this.$fastController = this;
        /**
         * The view associated with the custom element.
         * @remarks
         * If `null` then the element is managing its own rendering.
         */
        this.view = null;
        this.element = element;
        this.definition = definition;
        const shadowOptions = definition.shadowOptions;
        if (shadowOptions !== void 0) {
            const shadowRoot = element.attachShadow(shadowOptions);
            if (shadowOptions.mode === "closed") {
                shadowRoots.set(element, shadowRoot);
            }
        }
        // Capture any observable values that were set by the binding engine before
        // the browser upgraded the element. Then delete the property since it will
        // shadow the getter/setter that is required to make the observable operate.
        // Later, in the connect callback, we'll re-apply the values.
        const accessors = _observation_observable_js__WEBPACK_IMPORTED_MODULE_1__.Observable.getAccessors(element);
        if (accessors.length > 0) {
            const boundObservables = (this.boundObservables = Object.create(null));
            for (let i = 0, ii = accessors.length; i < ii; ++i) {
                const propertyName = accessors[i].name;
                const value = element[propertyName];
                if (value !== void 0) {
                    delete element[propertyName];
                    boundObservables[propertyName] = value;
                }
            }
        }
    }
    /**
     * Indicates whether or not the custom element has been
     * connected to the document.
     */
    get isConnected() {
        _observation_observable_js__WEBPACK_IMPORTED_MODULE_1__.Observable.track(this, "isConnected");
        return this._isConnected;
    }
    setIsConnected(value) {
        this._isConnected = value;
        _observation_observable_js__WEBPACK_IMPORTED_MODULE_1__.Observable.notify(this, "isConnected");
    }
    /**
     * Gets/sets the template used to render the component.
     * @remarks
     * This value can only be accurately read after connect but can be set at any time.
     */
    get template() {
        return this._template;
    }
    set template(value) {
        if (this._template === value) {
            return;
        }
        this._template = value;
        if (!this.needsInitialization) {
            this.renderTemplate(value);
        }
    }
    /**
     * Gets/sets the primary styles used for the component.
     * @remarks
     * This value can only be accurately read after connect but can be set at any time.
     */
    get styles() {
        return this._styles;
    }
    set styles(value) {
        if (this._styles === value) {
            return;
        }
        if (this._styles !== null) {
            this.removeStyles(this._styles);
        }
        this._styles = value;
        if (!this.needsInitialization && value !== null) {
            this.addStyles(value);
        }
    }
    /**
     * Adds styles to this element. Providing an HTMLStyleElement will attach the element instance to the shadowRoot.
     * @param styles - The styles to add.
     */
    addStyles(styles) {
        const target = getShadowRoot(this.element) ||
            this.element.getRootNode();
        if (styles instanceof HTMLStyleElement) {
            target.append(styles);
        }
        else if (!styles.isAttachedTo(target)) {
            const sourceBehaviors = styles.behaviors;
            styles.addStylesTo(target);
            if (sourceBehaviors !== null) {
                this.addBehaviors(sourceBehaviors);
            }
        }
    }
    /**
     * Removes styles from this element. Providing an HTMLStyleElement will detach the element instance from the shadowRoot.
     * @param styles - the styles to remove.
     */
    removeStyles(styles) {
        const target = getShadowRoot(this.element) ||
            this.element.getRootNode();
        if (styles instanceof HTMLStyleElement) {
            target.removeChild(styles);
        }
        else if (styles.isAttachedTo(target)) {
            const sourceBehaviors = styles.behaviors;
            styles.removeStylesFrom(target);
            if (sourceBehaviors !== null) {
                this.removeBehaviors(sourceBehaviors);
            }
        }
    }
    /**
     * Adds behaviors to this element.
     * @param behaviors - The behaviors to add.
     */
    addBehaviors(behaviors) {
        const targetBehaviors = this.behaviors || (this.behaviors = new Map());
        const length = behaviors.length;
        const behaviorsToBind = [];
        for (let i = 0; i < length; ++i) {
            const behavior = behaviors[i];
            if (targetBehaviors.has(behavior)) {
                targetBehaviors.set(behavior, targetBehaviors.get(behavior) + 1);
            }
            else {
                targetBehaviors.set(behavior, 1);
                behaviorsToBind.push(behavior);
            }
        }
        if (this._isConnected) {
            const element = this.element;
            for (let i = 0; i < behaviorsToBind.length; ++i) {
                behaviorsToBind[i].bind(element, _observation_observable_js__WEBPACK_IMPORTED_MODULE_1__.defaultExecutionContext);
            }
        }
    }
    /**
     * Removes behaviors from this element.
     * @param behaviors - The behaviors to remove.
     * @param force - Forces unbinding of behaviors.
     */
    removeBehaviors(behaviors, force = false) {
        const targetBehaviors = this.behaviors;
        if (targetBehaviors === null) {
            return;
        }
        const length = behaviors.length;
        const behaviorsToUnbind = [];
        for (let i = 0; i < length; ++i) {
            const behavior = behaviors[i];
            if (targetBehaviors.has(behavior)) {
                const count = targetBehaviors.get(behavior) - 1;
                count === 0 || force
                    ? targetBehaviors.delete(behavior) && behaviorsToUnbind.push(behavior)
                    : targetBehaviors.set(behavior, count);
            }
        }
        if (this._isConnected) {
            const element = this.element;
            for (let i = 0; i < behaviorsToUnbind.length; ++i) {
                behaviorsToUnbind[i].unbind(element);
            }
        }
    }
    /**
     * Runs connected lifecycle behavior on the associated element.
     */
    onConnectedCallback() {
        if (this._isConnected) {
            return;
        }
        const element = this.element;
        if (this.needsInitialization) {
            this.finishInitialization();
        }
        else if (this.view !== null) {
            this.view.bind(element, _observation_observable_js__WEBPACK_IMPORTED_MODULE_1__.defaultExecutionContext);
        }
        const behaviors = this.behaviors;
        if (behaviors !== null) {
            for (const [behavior] of behaviors) {
                behavior.bind(element, _observation_observable_js__WEBPACK_IMPORTED_MODULE_1__.defaultExecutionContext);
            }
        }
        this.setIsConnected(true);
    }
    /**
     * Runs disconnected lifecycle behavior on the associated element.
     */
    onDisconnectedCallback() {
        if (!this._isConnected) {
            return;
        }
        this.setIsConnected(false);
        const view = this.view;
        if (view !== null) {
            view.unbind();
        }
        const behaviors = this.behaviors;
        if (behaviors !== null) {
            const element = this.element;
            for (const [behavior] of behaviors) {
                behavior.unbind(element);
            }
        }
    }
    /**
     * Runs the attribute changed callback for the associated element.
     * @param name - The name of the attribute that changed.
     * @param oldValue - The previous value of the attribute.
     * @param newValue - The new value of the attribute.
     */
    onAttributeChangedCallback(name, oldValue, newValue) {
        const attrDef = this.definition.attributeLookup[name];
        if (attrDef !== void 0) {
            attrDef.onAttributeChangedCallback(this.element, newValue);
        }
    }
    /**
     * Emits a custom HTML event.
     * @param type - The type name of the event.
     * @param detail - The event detail object to send with the event.
     * @param options - The event options. By default bubbles and composed.
     * @remarks
     * Only emits events if connected.
     */
    emit(type, detail, options) {
        if (this._isConnected) {
            return this.element.dispatchEvent(new CustomEvent(type, Object.assign(Object.assign({ detail }, defaultEventOptions), options)));
        }
        return false;
    }
    finishInitialization() {
        const element = this.element;
        const boundObservables = this.boundObservables;
        // If we have any observables that were bound, re-apply their values.
        if (boundObservables !== null) {
            const propertyNames = Object.keys(boundObservables);
            for (let i = 0, ii = propertyNames.length; i < ii; ++i) {
                const propertyName = propertyNames[i];
                element[propertyName] = boundObservables[propertyName];
            }
            this.boundObservables = null;
        }
        const definition = this.definition;
        // 1. Template overrides take top precedence.
        if (this._template === null) {
            if (this.element.resolveTemplate) {
                // 2. Allow for element instance overrides next.
                this._template = this.element.resolveTemplate();
            }
            else if (definition.template) {
                // 3. Default to the static definition.
                this._template = definition.template || null;
            }
        }
        // If we have a template after the above process, render it.
        // If there's no template, then the element author has opted into
        // custom rendering and they will managed the shadow root's content themselves.
        if (this._template !== null) {
            this.renderTemplate(this._template);
        }
        // 1. Styles overrides take top precedence.
        if (this._styles === null) {
            if (this.element.resolveStyles) {
                // 2. Allow for element instance overrides next.
                this._styles = this.element.resolveStyles();
            }
            else if (definition.styles) {
                // 3. Default to the static definition.
                this._styles = definition.styles || null;
            }
        }
        // If we have styles after the above process, add them.
        if (this._styles !== null) {
            this.addStyles(this._styles);
        }
        this.needsInitialization = false;
    }
    renderTemplate(template) {
        const element = this.element;
        // When getting the host to render to, we start by looking
        // up the shadow root. If there isn't one, then that means
        // we're doing a Light DOM render to the element's direct children.
        const host = getShadowRoot(element) || element;
        if (this.view !== null) {
            // If there's already a view, we need to unbind and remove through dispose.
            this.view.dispose();
            this.view = null;
        }
        else if (!this.needsInitialization) {
            // If there was previous custom rendering, we need to clear out the host.
            _dom_js__WEBPACK_IMPORTED_MODULE_2__.DOM.removeChildNodes(host);
        }
        if (template) {
            // If a new template was provided, render it.
            this.view = template.render(element, host, element);
        }
    }
    /**
     * Locates or creates a controller for the specified element.
     * @param element - The element to return the controller for.
     * @remarks
     * The specified element must have a {@link FASTElementDefinition}
     * registered either through the use of the {@link customElement}
     * decorator or a call to `FASTElement.define`.
     */
    static forCustomElement(element) {
        const controller = element.$fastController;
        if (controller !== void 0) {
            return controller;
        }
        const definition = _fast_definitions_js__WEBPACK_IMPORTED_MODULE_3__.FASTElementDefinition.forType(element.constructor);
        if (definition === void 0) {
            throw new Error("Missing FASTElement definition.");
        }
        return (element.$fastController = new Controller(element, definition));
    }
}


/***/ }),

/***/ "./node_modules/@microsoft/fast-element/dist/esm/components/fast-definitions.js":
/*!**************************************************************************************!*\
  !*** ./node_modules/@microsoft/fast-element/dist/esm/components/fast-definitions.js ***!
  \**************************************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "FASTElementDefinition": () => (/* binding */ FASTElementDefinition)
/* harmony export */ });
/* harmony import */ var _platform_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../platform.js */ "./node_modules/@microsoft/fast-element/dist/esm/platform.js");
/* harmony import */ var _observation_observable_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../observation/observable.js */ "./node_modules/@microsoft/fast-element/dist/esm/observation/observable.js");
/* harmony import */ var _styles_element_styles_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../styles/element-styles.js */ "./node_modules/@microsoft/fast-element/dist/esm/styles/element-styles.js");
/* harmony import */ var _attributes_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./attributes.js */ "./node_modules/@microsoft/fast-element/dist/esm/components/attributes.js");




const defaultShadowOptions = { mode: "open" };
const defaultElementOptions = {};
const fastRegistry = _platform_js__WEBPACK_IMPORTED_MODULE_0__.FAST.getById(4 /* elementRegistry */, () => {
    const typeToDefinition = new Map();
    return Object.freeze({
        register(definition) {
            if (typeToDefinition.has(definition.type)) {
                return false;
            }
            typeToDefinition.set(definition.type, definition);
            return true;
        },
        getByType(key) {
            return typeToDefinition.get(key);
        },
    });
});
/**
 * Defines metadata for a FASTElement.
 * @public
 */
class FASTElementDefinition {
    /**
     * Creates an instance of FASTElementDefinition.
     * @param type - The type this definition is being created for.
     * @param nameOrConfig - The name of the element to define or a config object
     * that describes the element to define.
     */
    constructor(type, nameOrConfig = type.definition) {
        if (typeof nameOrConfig === "string") {
            nameOrConfig = { name: nameOrConfig };
        }
        this.type = type;
        this.name = nameOrConfig.name;
        this.template = nameOrConfig.template;
        const attributes = _attributes_js__WEBPACK_IMPORTED_MODULE_1__.AttributeDefinition.collect(type, nameOrConfig.attributes);
        const observedAttributes = new Array(attributes.length);
        const propertyLookup = {};
        const attributeLookup = {};
        for (let i = 0, ii = attributes.length; i < ii; ++i) {
            const current = attributes[i];
            observedAttributes[i] = current.attribute;
            propertyLookup[current.name] = current;
            attributeLookup[current.attribute] = current;
        }
        this.attributes = attributes;
        this.observedAttributes = observedAttributes;
        this.propertyLookup = propertyLookup;
        this.attributeLookup = attributeLookup;
        this.shadowOptions =
            nameOrConfig.shadowOptions === void 0
                ? defaultShadowOptions
                : nameOrConfig.shadowOptions === null
                    ? void 0
                    : Object.assign(Object.assign({}, defaultShadowOptions), nameOrConfig.shadowOptions);
        this.elementOptions =
            nameOrConfig.elementOptions === void 0
                ? defaultElementOptions
                : Object.assign(Object.assign({}, defaultElementOptions), nameOrConfig.elementOptions);
        this.styles =
            nameOrConfig.styles === void 0
                ? void 0
                : Array.isArray(nameOrConfig.styles)
                    ? _styles_element_styles_js__WEBPACK_IMPORTED_MODULE_2__.ElementStyles.create(nameOrConfig.styles)
                    : nameOrConfig.styles instanceof _styles_element_styles_js__WEBPACK_IMPORTED_MODULE_2__.ElementStyles
                        ? nameOrConfig.styles
                        : _styles_element_styles_js__WEBPACK_IMPORTED_MODULE_2__.ElementStyles.create([nameOrConfig.styles]);
    }
    /**
     * Indicates if this element has been defined in at least one registry.
     */
    get isDefined() {
        return !!fastRegistry.getByType(this.type);
    }
    /**
     * Defines a custom element based on this definition.
     * @param registry - The element registry to define the element in.
     */
    define(registry = customElements) {
        const type = this.type;
        if (fastRegistry.register(this)) {
            const attributes = this.attributes;
            const proto = type.prototype;
            for (let i = 0, ii = attributes.length; i < ii; ++i) {
                _observation_observable_js__WEBPACK_IMPORTED_MODULE_3__.Observable.defineProperty(proto, attributes[i]);
            }
            Reflect.defineProperty(type, "observedAttributes", {
                value: this.observedAttributes,
                enumerable: true,
            });
        }
        if (!registry.get(this.name)) {
            registry.define(this.name, type, this.elementOptions);
        }
        return this;
    }
}
/**
 * Gets the element definition associated with the specified type.
 * @param type - The custom element type to retrieve the definition for.
 */
FASTElementDefinition.forType = fastRegistry.getByType;


/***/ }),

/***/ "./node_modules/@microsoft/fast-element/dist/esm/components/fast-element.js":
/*!**********************************************************************************!*\
  !*** ./node_modules/@microsoft/fast-element/dist/esm/components/fast-element.js ***!
  \**********************************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "FASTElement": () => (/* binding */ FASTElement),
/* harmony export */   "customElement": () => (/* binding */ customElement)
/* harmony export */ });
/* harmony import */ var _controller_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./controller.js */ "./node_modules/@microsoft/fast-element/dist/esm/components/controller.js");
/* harmony import */ var _fast_definitions_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./fast-definitions.js */ "./node_modules/@microsoft/fast-element/dist/esm/components/fast-definitions.js");


/* eslint-disable-next-line @typescript-eslint/explicit-function-return-type */
function createFASTElement(BaseType) {
    return class extends BaseType {
        constructor() {
            /* eslint-disable-next-line */
            super();
            _controller_js__WEBPACK_IMPORTED_MODULE_0__.Controller.forCustomElement(this);
        }
        $emit(type, detail, options) {
            return this.$fastController.emit(type, detail, options);
        }
        connectedCallback() {
            this.$fastController.onConnectedCallback();
        }
        disconnectedCallback() {
            this.$fastController.onDisconnectedCallback();
        }
        attributeChangedCallback(name, oldValue, newValue) {
            this.$fastController.onAttributeChangedCallback(name, oldValue, newValue);
        }
    };
}
/**
 * A minimal base class for FASTElements that also provides
 * static helpers for working with FASTElements.
 * @public
 */
const FASTElement = Object.assign(createFASTElement(HTMLElement), {
    /**
     * Creates a new FASTElement base class inherited from the
     * provided base type.
     * @param BaseType - The base element type to inherit from.
     */
    from(BaseType) {
        return createFASTElement(BaseType);
    },
    /**
     * Defines a platform custom element based on the provided type and definition.
     * @param type - The custom element type to define.
     * @param nameOrDef - The name of the element to define or a definition object
     * that describes the element to define.
     */
    define(type, nameOrDef) {
        return new _fast_definitions_js__WEBPACK_IMPORTED_MODULE_1__.FASTElementDefinition(type, nameOrDef).define().type;
    },
});
/**
 * Decorator: Defines a platform custom element based on `FASTElement`.
 * @param nameOrDef - The name of the element to define or a definition object
 * that describes the element to define.
 * @public
 */
function customElement(nameOrDef) {
    /* eslint-disable-next-line @typescript-eslint/explicit-function-return-type */
    return function (type) {
        new _fast_definitions_js__WEBPACK_IMPORTED_MODULE_1__.FASTElementDefinition(type, nameOrDef).define();
    };
}


/***/ }),

/***/ "./node_modules/@microsoft/fast-element/dist/esm/dom.js":
/*!**************************************************************!*\
  !*** ./node_modules/@microsoft/fast-element/dist/esm/dom.js ***!
  \**************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "DOM": () => (/* binding */ DOM),
/* harmony export */   "_interpolationEnd": () => (/* binding */ _interpolationEnd),
/* harmony export */   "_interpolationStart": () => (/* binding */ _interpolationStart)
/* harmony export */ });
/* harmony import */ var _platform_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./platform.js */ "./node_modules/@microsoft/fast-element/dist/esm/platform.js");

const updateQueue = _platform_js__WEBPACK_IMPORTED_MODULE_0__.$global.FAST.getById(1 /* updateQueue */, () => {
    const tasks = [];
    const pendingErrors = [];
    function throwFirstError() {
        if (pendingErrors.length) {
            throw pendingErrors.shift();
        }
    }
    function tryRunTask(task) {
        try {
            task.call();
        }
        catch (error) {
            pendingErrors.push(error);
            setTimeout(throwFirstError, 0);
        }
    }
    function process() {
        const capacity = 1024;
        let index = 0;
        while (index < tasks.length) {
            tryRunTask(tasks[index]);
            index++;
            // Prevent leaking memory for long chains of recursive calls to `DOM.queueUpdate`.
            // If we call `DOM.queueUpdate` within a task scheduled by `DOM.queueUpdate`, the queue will
            // grow, but to avoid an O(n) walk for every task we execute, we don't
            // shift tasks off the queue after they have been executed.
            // Instead, we periodically shift 1024 tasks off the queue.
            if (index > capacity) {
                // Manually shift all values starting at the index back to the
                // beginning of the queue.
                for (let scan = 0, newLength = tasks.length - index; scan < newLength; scan++) {
                    tasks[scan] = tasks[scan + index];
                }
                tasks.length -= index;
                index = 0;
            }
        }
        tasks.length = 0;
    }
    function enqueue(callable) {
        if (tasks.length < 1) {
            _platform_js__WEBPACK_IMPORTED_MODULE_0__.$global.requestAnimationFrame(process);
        }
        tasks.push(callable);
    }
    return Object.freeze({
        enqueue,
        process,
    });
});
/* eslint-disable */
const fastHTMLPolicy = _platform_js__WEBPACK_IMPORTED_MODULE_0__.$global.trustedTypes.createPolicy("fast-html", {
    createHTML: html => html,
});
/* eslint-enable */
let htmlPolicy = fastHTMLPolicy;
const marker = `fast-${Math.random().toString(36).substring(2, 8)}`;
/** @internal */
const _interpolationStart = `${marker}{`;
/** @internal */
const _interpolationEnd = `}${marker}`;
/**
 * Common DOM APIs.
 * @public
 */
const DOM = Object.freeze({
    /**
     * Indicates whether the DOM supports the adoptedStyleSheets feature.
     */
    supportsAdoptedStyleSheets: Array.isArray(document.adoptedStyleSheets) &&
        "replace" in CSSStyleSheet.prototype,
    /**
     * Sets the HTML trusted types policy used by the templating engine.
     * @param policy - The policy to set for HTML.
     * @remarks
     * This API can only be called once, for security reasons. It should be
     * called by the application developer at the start of their program.
     */
    setHTMLPolicy(policy) {
        if (htmlPolicy !== fastHTMLPolicy) {
            throw new Error("The HTML policy can only be set once.");
        }
        htmlPolicy = policy;
    },
    /**
     * Turns a string into trusted HTML using the configured trusted types policy.
     * @param html - The string to turn into trusted HTML.
     * @remarks
     * Used internally by the template engine when creating templates
     * and setting innerHTML.
     */
    createHTML(html) {
        return htmlPolicy.createHTML(html);
    },
    /**
     * Determines if the provided node is a template marker used by the runtime.
     * @param node - The node to test.
     */
    isMarker(node) {
        return node && node.nodeType === 8 && node.data.startsWith(marker);
    },
    /**
     * Given a marker node, extract the {@link HTMLDirective} index from the placeholder.
     * @param node - The marker node to extract the index from.
     */
    extractDirectiveIndexFromMarker(node) {
        return parseInt(node.data.replace(`${marker}:`, ""));
    },
    /**
     * Creates a placeholder string suitable for marking out a location *within*
     * an attribute value or HTML content.
     * @param index - The directive index to create the placeholder for.
     * @remarks
     * Used internally by binding directives.
     */
    createInterpolationPlaceholder(index) {
        return `${_interpolationStart}${index}${_interpolationEnd}`;
    },
    /**
     * Creates a placeholder that manifests itself as an attribute on an
     * element.
     * @param attributeName - The name of the custom attribute.
     * @param index - The directive index to create the placeholder for.
     * @remarks
     * Used internally by attribute directives such as `ref`, `slotted`, and `children`.
     */
    createCustomAttributePlaceholder(attributeName, index) {
        return `${attributeName}="${this.createInterpolationPlaceholder(index)}"`;
    },
    /**
     * Creates a placeholder that manifests itself as a marker within the DOM structure.
     * @param index - The directive index to create the placeholder for.
     * @remarks
     * Used internally by structural directives such as `repeat`.
     */
    createBlockPlaceholder(index) {
        return `<!--${marker}:${index}-->`;
    },
    /**
     * Schedules DOM update work in the next async batch.
     * @param callable - The callable function or object to queue.
     */
    queueUpdate: updateQueue.enqueue,
    /**
     * Immediately processes all work previously scheduled
     * through queueUpdate.
     * @remarks
     * This also forces nextUpdate promises
     * to resolve.
     */
    processUpdates: updateQueue.process,
    /**
     * Resolves with the next DOM update.
     */
    nextUpdate() {
        return new Promise(updateQueue.enqueue);
    },
    /**
     * Sets an attribute value on an element.
     * @param element - The element to set the attribute value on.
     * @param attributeName - The attribute name to set.
     * @param value - The value of the attribute to set.
     * @remarks
     * If the value is `null` or `undefined`, the attribute is removed, otherwise
     * it is set to the provided value using the standard `setAttribute` API.
     */
    setAttribute(element, attributeName, value) {
        if (value === null || value === undefined) {
            element.removeAttribute(attributeName);
        }
        else {
            element.setAttribute(attributeName, value);
        }
    },
    /**
     * Sets a boolean attribute value.
     * @param element - The element to set the boolean attribute value on.
     * @param attributeName - The attribute name to set.
     * @param value - The value of the attribute to set.
     * @remarks
     * If the value is true, the attribute is added; otherwise it is removed.
     */
    setBooleanAttribute(element, attributeName, value) {
        value
            ? element.setAttribute(attributeName, "")
            : element.removeAttribute(attributeName);
    },
    /**
     * Removes all the child nodes of the provided parent node.
     * @param parent - The node to remove the children from.
     */
    removeChildNodes(parent) {
        for (let child = parent.firstChild; child !== null; child = parent.firstChild) {
            parent.removeChild(child);
        }
    },
    /**
     * Creates a TreeWalker configured to walk a template fragment.
     * @param fragment - The fragment to walk.
     */
    createTemplateWalker(fragment) {
        return document.createTreeWalker(fragment, 133, // element, text, comment
        null, false);
    },
});


/***/ }),

/***/ "./node_modules/@microsoft/fast-element/dist/esm/observation/notifier.js":
/*!*******************************************************************************!*\
  !*** ./node_modules/@microsoft/fast-element/dist/esm/observation/notifier.js ***!
  \*******************************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "PropertyChangeNotifier": () => (/* binding */ PropertyChangeNotifier),
/* harmony export */   "SubscriberSet": () => (/* binding */ SubscriberSet)
/* harmony export */ });
/**
 * An implementation of {@link Notifier} that efficiently keeps track of
 * subscribers interested in a specific change notification on an
 * observable source.
 *
 * @remarks
 * This set is optimized for the most common scenario of 1 or 2 subscribers.
 * With this in mind, it can store a subscriber in an internal field, allowing it to avoid Array#push operations.
 * If the set ever exceeds two subscribers, it upgrades to an array automatically.
 * @public
 */
class SubscriberSet {
    /**
     * Creates an instance of SubscriberSet for the specified source.
     * @param source - The object source that subscribers will receive notifications from.
     * @param initialSubscriber - An initial subscriber to changes.
     */
    constructor(source, initialSubscriber) {
        this.sub1 = void 0;
        this.sub2 = void 0;
        this.spillover = void 0;
        this.source = source;
        this.sub1 = initialSubscriber;
    }
    /**
     * Checks whether the provided subscriber has been added to this set.
     * @param subscriber - The subscriber to test for inclusion in this set.
     */
    has(subscriber) {
        return this.spillover === void 0
            ? this.sub1 === subscriber || this.sub2 === subscriber
            : this.spillover.indexOf(subscriber) !== -1;
    }
    /**
     * Subscribes to notification of changes in an object's state.
     * @param subscriber - The object that is subscribing for change notification.
     */
    subscribe(subscriber) {
        const spillover = this.spillover;
        if (spillover === void 0) {
            if (this.has(subscriber)) {
                return;
            }
            if (this.sub1 === void 0) {
                this.sub1 = subscriber;
                return;
            }
            if (this.sub2 === void 0) {
                this.sub2 = subscriber;
                return;
            }
            this.spillover = [this.sub1, this.sub2, subscriber];
            this.sub1 = void 0;
            this.sub2 = void 0;
        }
        else {
            const index = spillover.indexOf(subscriber);
            if (index === -1) {
                spillover.push(subscriber);
            }
        }
    }
    /**
     * Unsubscribes from notification of changes in an object's state.
     * @param subscriber - The object that is unsubscribing from change notification.
     */
    unsubscribe(subscriber) {
        const spillover = this.spillover;
        if (spillover === void 0) {
            if (this.sub1 === subscriber) {
                this.sub1 = void 0;
            }
            else if (this.sub2 === subscriber) {
                this.sub2 = void 0;
            }
        }
        else {
            const index = spillover.indexOf(subscriber);
            if (index !== -1) {
                spillover.splice(index, 1);
            }
        }
    }
    /**
     * Notifies all subscribers.
     * @param args - Data passed along to subscribers during notification.
     */
    notify(args) {
        const spillover = this.spillover;
        const source = this.source;
        if (spillover === void 0) {
            const sub1 = this.sub1;
            const sub2 = this.sub2;
            if (sub1 !== void 0) {
                sub1.handleChange(source, args);
            }
            if (sub2 !== void 0) {
                sub2.handleChange(source, args);
            }
        }
        else {
            for (let i = 0, ii = spillover.length; i < ii; ++i) {
                spillover[i].handleChange(source, args);
            }
        }
    }
}
/**
 * An implementation of Notifier that allows subscribers to be notified
 * of individual property changes on an object.
 * @public
 */
class PropertyChangeNotifier {
    /**
     * Creates an instance of PropertyChangeNotifier for the specified source.
     * @param source - The object source that subscribers will receive notifications from.
     */
    constructor(source) {
        this.subscribers = {};
        this.sourceSubscribers = null;
        this.source = source;
    }
    /**
     * Notifies all subscribers, based on the specified property.
     * @param propertyName - The property name, passed along to subscribers during notification.
     */
    notify(propertyName) {
        var _a;
        const subscribers = this.subscribers[propertyName];
        if (subscribers !== void 0) {
            subscribers.notify(propertyName);
        }
        (_a = this.sourceSubscribers) === null || _a === void 0 ? void 0 : _a.notify(propertyName);
    }
    /**
     * Subscribes to notification of changes in an object's state.
     * @param subscriber - The object that is subscribing for change notification.
     * @param propertyToWatch - The name of the property that the subscriber is interested in watching for changes.
     */
    subscribe(subscriber, propertyToWatch) {
        var _a;
        if (propertyToWatch) {
            let subscribers = this.subscribers[propertyToWatch];
            if (subscribers === void 0) {
                this.subscribers[propertyToWatch] = subscribers = new SubscriberSet(this.source);
            }
            subscribers.subscribe(subscriber);
        }
        else {
            this.sourceSubscribers =
                (_a = this.sourceSubscribers) !== null && _a !== void 0 ? _a : new SubscriberSet(this.source);
            this.sourceSubscribers.subscribe(subscriber);
        }
    }
    /**
     * Unsubscribes from notification of changes in an object's state.
     * @param subscriber - The object that is unsubscribing from change notification.
     * @param propertyToUnwatch - The name of the property that the subscriber is no longer interested in watching.
     */
    unsubscribe(subscriber, propertyToUnwatch) {
        var _a;
        if (propertyToUnwatch) {
            const subscribers = this.subscribers[propertyToUnwatch];
            if (subscribers !== void 0) {
                subscribers.unsubscribe(subscriber);
            }
        }
        else {
            (_a = this.sourceSubscribers) === null || _a === void 0 ? void 0 : _a.unsubscribe(subscriber);
        }
    }
}


/***/ }),

/***/ "./node_modules/@microsoft/fast-element/dist/esm/observation/observable.js":
/*!*********************************************************************************!*\
  !*** ./node_modules/@microsoft/fast-element/dist/esm/observation/observable.js ***!
  \*********************************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "ExecutionContext": () => (/* binding */ ExecutionContext),
/* harmony export */   "Observable": () => (/* binding */ Observable),
/* harmony export */   "defaultExecutionContext": () => (/* binding */ defaultExecutionContext),
/* harmony export */   "observable": () => (/* binding */ observable),
/* harmony export */   "volatile": () => (/* binding */ volatile)
/* harmony export */ });
/* harmony import */ var _dom_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../dom.js */ "./node_modules/@microsoft/fast-element/dist/esm/dom.js");
/* harmony import */ var _platform_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../platform.js */ "./node_modules/@microsoft/fast-element/dist/esm/platform.js");
/* harmony import */ var _notifier_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./notifier.js */ "./node_modules/@microsoft/fast-element/dist/esm/observation/notifier.js");



/**
 * Common Observable APIs.
 * @public
 */
const Observable = _platform_js__WEBPACK_IMPORTED_MODULE_0__.FAST.getById(2 /* observable */, () => {
    const volatileRegex = /(:|&&|\|\||if)/;
    const notifierLookup = new WeakMap();
    const accessorLookup = new WeakMap();
    const queueUpdate = _dom_js__WEBPACK_IMPORTED_MODULE_1__.DOM.queueUpdate;
    let watcher = void 0;
    let createArrayObserver = (array) => {
        throw new Error("Must call enableArrayObservation before observing arrays.");
    };
    function getNotifier(source) {
        let found = source.$fastController || notifierLookup.get(source);
        if (found === void 0) {
            if (Array.isArray(source)) {
                found = createArrayObserver(source);
            }
            else {
                notifierLookup.set(source, (found = new _notifier_js__WEBPACK_IMPORTED_MODULE_2__.PropertyChangeNotifier(source)));
            }
        }
        return found;
    }
    function getAccessors(target) {
        let accessors = accessorLookup.get(target);
        if (accessors === void 0) {
            let currentTarget = Reflect.getPrototypeOf(target);
            while (accessors === void 0 && currentTarget !== null) {
                accessors = accessorLookup.get(currentTarget);
                currentTarget = Reflect.getPrototypeOf(currentTarget);
            }
            if (accessors === void 0) {
                accessors = [];
            }
            else {
                accessors = accessors.slice(0);
            }
            accessorLookup.set(target, accessors);
        }
        return accessors;
    }
    class DefaultObservableAccessor {
        constructor(name) {
            this.name = name;
            this.field = `_${name}`;
            this.callback = `${name}Changed`;
        }
        getValue(source) {
            if (watcher !== void 0) {
                watcher.watch(source, this.name);
            }
            return source[this.field];
        }
        setValue(source, newValue) {
            const field = this.field;
            const oldValue = source[field];
            if (oldValue !== newValue) {
                source[field] = newValue;
                const callback = source[this.callback];
                if (typeof callback === "function") {
                    callback.call(source, oldValue, newValue);
                }
                getNotifier(source).notify(this.name);
            }
        }
    }
    class BindingObserverImplementation extends _notifier_js__WEBPACK_IMPORTED_MODULE_2__.SubscriberSet {
        constructor(binding, initialSubscriber, isVolatileBinding = false) {
            super(binding, initialSubscriber);
            this.binding = binding;
            this.isVolatileBinding = isVolatileBinding;
            this.needsRefresh = true;
            this.needsQueue = true;
            this.first = this;
            this.last = null;
            this.propertySource = void 0;
            this.propertyName = void 0;
            this.notifier = void 0;
            this.next = void 0;
        }
        observe(source, context) {
            if (this.needsRefresh && this.last !== null) {
                this.disconnect();
            }
            const previousWatcher = watcher;
            watcher = this.needsRefresh ? this : void 0;
            this.needsRefresh = this.isVolatileBinding;
            const result = this.binding(source, context);
            watcher = previousWatcher;
            return result;
        }
        disconnect() {
            if (this.last !== null) {
                let current = this.first;
                while (current !== void 0) {
                    current.notifier.unsubscribe(this, current.propertyName);
                    current = current.next;
                }
                this.last = null;
                this.needsRefresh = this.needsQueue = true;
            }
        }
        watch(propertySource, propertyName) {
            const prev = this.last;
            const notifier = getNotifier(propertySource);
            const current = prev === null ? this.first : {};
            current.propertySource = propertySource;
            current.propertyName = propertyName;
            current.notifier = notifier;
            notifier.subscribe(this, propertyName);
            if (prev !== null) {
                if (!this.needsRefresh) {
                    // Declaring the variable prior to assignment below circumvents
                    // a bug in Angular's optimization process causing infinite recursion
                    // of this watch() method. Details https://github.com/microsoft/fast/issues/4969
                    let prevValue;
                    watcher = void 0;
                    /* eslint-disable-next-line */
                    prevValue = prev.propertySource[prev.propertyName];
                    /* eslint-disable-next-line @typescript-eslint/no-this-alias */
                    watcher = this;
                    if (propertySource === prevValue) {
                        this.needsRefresh = true;
                    }
                }
                prev.next = current;
            }
            this.last = current;
        }
        handleChange() {
            if (this.needsQueue) {
                this.needsQueue = false;
                queueUpdate(this);
            }
        }
        call() {
            if (this.last !== null) {
                this.needsQueue = true;
                this.notify(this);
            }
        }
        records() {
            let next = this.first;
            return {
                next: () => {
                    const current = next;
                    if (current === undefined) {
                        return { value: void 0, done: true };
                    }
                    else {
                        next = next.next;
                        return {
                            value: current,
                            done: false,
                        };
                    }
                },
                [Symbol.iterator]: function () {
                    return this;
                },
            };
        }
    }
    return Object.freeze({
        /**
         * @internal
         * @param factory - The factory used to create array observers.
         */
        setArrayObserverFactory(factory) {
            createArrayObserver = factory;
        },
        /**
         * Gets a notifier for an object or Array.
         * @param source - The object or Array to get the notifier for.
         */
        getNotifier,
        /**
         * Records a property change for a source object.
         * @param source - The object to record the change against.
         * @param propertyName - The property to track as changed.
         */
        track(source, propertyName) {
            if (watcher !== void 0) {
                watcher.watch(source, propertyName);
            }
        },
        /**
         * Notifies watchers that the currently executing property getter or function is volatile
         * with respect to its observable dependencies.
         */
        trackVolatile() {
            if (watcher !== void 0) {
                watcher.needsRefresh = true;
            }
        },
        /**
         * Notifies subscribers of a source object of changes.
         * @param source - the object to notify of changes.
         * @param args - The change args to pass to subscribers.
         */
        notify(source, args) {
            getNotifier(source).notify(args);
        },
        /**
         * Defines an observable property on an object or prototype.
         * @param target - The target object to define the observable on.
         * @param nameOrAccessor - The name of the property to define as observable;
         * or a custom accessor that specifies the property name and accessor implementation.
         */
        defineProperty(target, nameOrAccessor) {
            if (typeof nameOrAccessor === "string") {
                nameOrAccessor = new DefaultObservableAccessor(nameOrAccessor);
            }
            getAccessors(target).push(nameOrAccessor);
            Reflect.defineProperty(target, nameOrAccessor.name, {
                enumerable: true,
                get: function () {
                    return nameOrAccessor.getValue(this);
                },
                set: function (newValue) {
                    nameOrAccessor.setValue(this, newValue);
                },
            });
        },
        /**
         * Finds all the observable accessors defined on the target,
         * including its prototype chain.
         * @param target - The target object to search for accessor on.
         */
        getAccessors,
        /**
         * Creates a {@link BindingObserver} that can watch the
         * provided {@link Binding} for changes.
         * @param binding - The binding to observe.
         * @param initialSubscriber - An initial subscriber to changes in the binding value.
         * @param isVolatileBinding - Indicates whether the binding's dependency list must be re-evaluated on every value evaluation.
         */
        binding(binding, initialSubscriber, isVolatileBinding = this.isVolatileBinding(binding)) {
            return new BindingObserverImplementation(binding, initialSubscriber, isVolatileBinding);
        },
        /**
         * Determines whether a binding expression is volatile and needs to have its dependency list re-evaluated
         * on every evaluation of the value.
         * @param binding - The binding to inspect.
         */
        isVolatileBinding(binding) {
            return volatileRegex.test(binding.toString());
        },
    });
});
/**
 * Decorator: Defines an observable property on the target.
 * @param target - The target to define the observable on.
 * @param nameOrAccessor - The property name or accessor to define the observable as.
 * @public
 */
function observable(target, nameOrAccessor) {
    Observable.defineProperty(target, nameOrAccessor);
}
/**
 * Decorator: Marks a property getter as having volatile observable dependencies.
 * @param target - The target that the property is defined on.
 * @param name - The property name.
 * @param name - The existing descriptor.
 * @public
 */
function volatile(target, name, descriptor) {
    return Object.assign({}, descriptor, {
        get: function () {
            Observable.trackVolatile();
            return descriptor.get.apply(this);
        },
    });
}
const contextEvent = _platform_js__WEBPACK_IMPORTED_MODULE_0__.FAST.getById(3 /* contextEvent */, () => {
    let current = null;
    return {
        get() {
            return current;
        },
        set(event) {
            current = event;
        },
    };
});
/**
 * Provides additional contextual information available to behaviors and expressions.
 * @public
 */
class ExecutionContext {
    constructor() {
        /**
         * The index of the current item within a repeat context.
         */
        this.index = 0;
        /**
         * The length of the current collection within a repeat context.
         */
        this.length = 0;
        /**
         * The parent data object within a repeat context.
         */
        this.parent = null;
        /**
         * The parent execution context when in nested context scenarios.
         */
        this.parentContext = null;
    }
    /**
     * The current event within an event handler.
     */
    get event() {
        return contextEvent.get();
    }
    /**
     * Indicates whether the current item within a repeat context
     * has an even index.
     */
    get isEven() {
        return this.index % 2 === 0;
    }
    /**
     * Indicates whether the current item within a repeat context
     * has an odd index.
     */
    get isOdd() {
        return this.index % 2 !== 0;
    }
    /**
     * Indicates whether the current item within a repeat context
     * is the first item in the collection.
     */
    get isFirst() {
        return this.index === 0;
    }
    /**
     * Indicates whether the current item within a repeat context
     * is somewhere in the middle of the collection.
     */
    get isInMiddle() {
        return !this.isFirst && !this.isLast;
    }
    /**
     * Indicates whether the current item within a repeat context
     * is the last item in the collection.
     */
    get isLast() {
        return this.index === this.length - 1;
    }
    /**
     * Sets the event for the current execution context.
     * @param event - The event to set.
     * @internal
     */
    static setEvent(event) {
        contextEvent.set(event);
    }
}
Observable.defineProperty(ExecutionContext.prototype, "index");
Observable.defineProperty(ExecutionContext.prototype, "length");
/**
 * The default execution context used in binding expressions.
 * @public
 */
const defaultExecutionContext = Object.seal(new ExecutionContext());


/***/ }),

/***/ "./node_modules/@microsoft/fast-element/dist/esm/platform.js":
/*!*******************************************************************!*\
  !*** ./node_modules/@microsoft/fast-element/dist/esm/platform.js ***!
  \*******************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "$global": () => (/* binding */ $global),
/* harmony export */   "FAST": () => (/* binding */ FAST),
/* harmony export */   "emptyArray": () => (/* binding */ emptyArray)
/* harmony export */ });
/**
 * A reference to globalThis, with support
 * for browsers that don't yet support the spec.
 * @public
 */
const $global = (function () {
    if (typeof globalThis !== "undefined") {
        // We're running in a modern environment.
        return globalThis;
    }
    if (typeof global !== "undefined") {
        // We're running in NodeJS
        return global;
    }
    if (typeof self !== "undefined") {
        // We're running in a worker.
        return self;
    }
    if (typeof window !== "undefined") {
        // We're running in the browser's main thread.
        return window;
    }
    try {
        // Hopefully we never get here...
        // Not all environments allow eval and Function. Use only as a last resort:
        // eslint-disable-next-line no-new-func
        return new Function("return this")();
    }
    catch (_a) {
        // If all fails, give up and create an object.
        // eslint-disable-next-line @typescript-eslint/consistent-type-assertions
        return {};
    }
})();
// API-only Polyfill for trustedTypes
if ($global.trustedTypes === void 0) {
    $global.trustedTypes = { createPolicy: (n, r) => r };
}
const propConfig = {
    configurable: false,
    enumerable: false,
    writable: false,
};
if ($global.FAST === void 0) {
    Reflect.defineProperty($global, "FAST", Object.assign({ value: Object.create(null) }, propConfig));
}
/**
 * The FAST global.
 * @internal
 */
const FAST = $global.FAST;
if (FAST.getById === void 0) {
    const storage = Object.create(null);
    Reflect.defineProperty(FAST, "getById", Object.assign({ value(id, initialize) {
            let found = storage[id];
            if (found === void 0) {
                found = initialize ? (storage[id] = initialize()) : null;
            }
            return found;
        } }, propConfig));
}
/**
 * A readonly, empty array.
 * @remarks
 * Typically returned by APIs that return arrays when there are
 * no actual items to return.
 * @internal
 */
const emptyArray = Object.freeze([]);


/***/ }),

/***/ "./node_modules/@microsoft/fast-element/dist/esm/styles/css-directive.js":
/*!*******************************************************************************!*\
  !*** ./node_modules/@microsoft/fast-element/dist/esm/styles/css-directive.js ***!
  \*******************************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "CSSDirective": () => (/* binding */ CSSDirective)
/* harmony export */ });
/**
 * Directive for use in {@link css}.
 *
 * @public
 */
class CSSDirective {
    /**
     * Creates a CSS fragment to interpolate into the CSS document.
     * @returns - the string to interpolate into CSS
     */
    createCSS() {
        return "";
    }
    /**
     * Creates a behavior to bind to the host element.
     * @returns - the behavior to bind to the host element, or undefined.
     */
    createBehavior() {
        return undefined;
    }
}


/***/ }),

/***/ "./node_modules/@microsoft/fast-element/dist/esm/styles/css.js":
/*!*********************************************************************!*\
  !*** ./node_modules/@microsoft/fast-element/dist/esm/styles/css.js ***!
  \*********************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "css": () => (/* binding */ css),
/* harmony export */   "cssPartial": () => (/* binding */ cssPartial)
/* harmony export */ });
/* harmony import */ var _css_directive_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./css-directive.js */ "./node_modules/@microsoft/fast-element/dist/esm/styles/css-directive.js");
/* harmony import */ var _element_styles_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./element-styles.js */ "./node_modules/@microsoft/fast-element/dist/esm/styles/element-styles.js");


function collectStyles(strings, values) {
    const styles = [];
    let cssString = "";
    const behaviors = [];
    for (let i = 0, ii = strings.length - 1; i < ii; ++i) {
        cssString += strings[i];
        let value = values[i];
        if (value instanceof _css_directive_js__WEBPACK_IMPORTED_MODULE_0__.CSSDirective) {
            const behavior = value.createBehavior();
            value = value.createCSS();
            if (behavior) {
                behaviors.push(behavior);
            }
        }
        if (value instanceof _element_styles_js__WEBPACK_IMPORTED_MODULE_1__.ElementStyles || value instanceof CSSStyleSheet) {
            if (cssString.trim() !== "") {
                styles.push(cssString);
                cssString = "";
            }
            styles.push(value);
        }
        else {
            cssString += value;
        }
    }
    cssString += strings[strings.length - 1];
    if (cssString.trim() !== "") {
        styles.push(cssString);
    }
    return {
        styles,
        behaviors,
    };
}
/**
 * Transforms a template literal string into styles.
 * @param strings - The string fragments that are interpolated with the values.
 * @param values - The values that are interpolated with the string fragments.
 * @remarks
 * The css helper supports interpolation of strings and ElementStyle instances.
 * @public
 */
function css(strings, ...values) {
    const { styles, behaviors } = collectStyles(strings, values);
    const elementStyles = _element_styles_js__WEBPACK_IMPORTED_MODULE_1__.ElementStyles.create(styles);
    if (behaviors.length) {
        elementStyles.withBehaviors(...behaviors);
    }
    return elementStyles;
}
class CSSPartial extends _css_directive_js__WEBPACK_IMPORTED_MODULE_0__.CSSDirective {
    constructor(styles, behaviors) {
        super();
        this.behaviors = behaviors;
        this.css = "";
        const stylesheets = styles.reduce((accumulated, current) => {
            if (typeof current === "string") {
                this.css += current;
            }
            else {
                accumulated.push(current);
            }
            return accumulated;
        }, []);
        if (stylesheets.length) {
            this.styles = _element_styles_js__WEBPACK_IMPORTED_MODULE_1__.ElementStyles.create(stylesheets);
        }
    }
    createBehavior() {
        return this;
    }
    createCSS() {
        return this.css;
    }
    bind(el) {
        if (this.styles) {
            el.$fastController.addStyles(this.styles);
        }
        if (this.behaviors.length) {
            el.$fastController.addBehaviors(this.behaviors);
        }
    }
    unbind(el) {
        if (this.styles) {
            el.$fastController.removeStyles(this.styles);
        }
        if (this.behaviors.length) {
            el.$fastController.removeBehaviors(this.behaviors);
        }
    }
}
/**
 * Transforms a template literal string into partial CSS.
 * @param strings - The string fragments that are interpolated with the values.
 * @param values - The values that are interpolated with the string fragments.
 * @public
 */
function cssPartial(strings, ...values) {
    const { styles, behaviors } = collectStyles(strings, values);
    return new CSSPartial(styles, behaviors);
}


/***/ }),

/***/ "./node_modules/@microsoft/fast-element/dist/esm/styles/element-styles.js":
/*!********************************************************************************!*\
  !*** ./node_modules/@microsoft/fast-element/dist/esm/styles/element-styles.js ***!
  \********************************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "AdoptedStyleSheetsStyles": () => (/* binding */ AdoptedStyleSheetsStyles),
/* harmony export */   "ElementStyles": () => (/* binding */ ElementStyles),
/* harmony export */   "StyleElementStyles": () => (/* binding */ StyleElementStyles)
/* harmony export */ });
/* harmony import */ var _dom_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../dom.js */ "./node_modules/@microsoft/fast-element/dist/esm/dom.js");

/**
 * Represents styles that can be applied to a custom element.
 * @public
 */
class ElementStyles {
    constructor() {
        this.targets = new WeakSet();
    }
    /** @internal */
    addStylesTo(target) {
        this.targets.add(target);
    }
    /** @internal */
    removeStylesFrom(target) {
        this.targets.delete(target);
    }
    /** @internal */
    isAttachedTo(target) {
        return this.targets.has(target);
    }
    /**
     * Associates behaviors with this set of styles.
     * @param behaviors - The behaviors to associate.
     */
    withBehaviors(...behaviors) {
        this.behaviors =
            this.behaviors === null ? behaviors : this.behaviors.concat(behaviors);
        return this;
    }
}
/**
 * Create ElementStyles from ComposableStyles.
 */
ElementStyles.create = (() => {
    if (_dom_js__WEBPACK_IMPORTED_MODULE_0__.DOM.supportsAdoptedStyleSheets) {
        const styleSheetCache = new Map();
        return (styles) =>
        // eslint-disable-next-line @typescript-eslint/no-use-before-define
        new AdoptedStyleSheetsStyles(styles, styleSheetCache);
    }
    // eslint-disable-next-line @typescript-eslint/no-use-before-define
    return (styles) => new StyleElementStyles(styles);
})();
function reduceStyles(styles) {
    return styles
        .map((x) => x instanceof ElementStyles ? reduceStyles(x.styles) : [x])
        .reduce((prev, curr) => prev.concat(curr), []);
}
function reduceBehaviors(styles) {
    return styles
        .map((x) => (x instanceof ElementStyles ? x.behaviors : null))
        .reduce((prev, curr) => {
        if (curr === null) {
            return prev;
        }
        if (prev === null) {
            prev = [];
        }
        return prev.concat(curr);
    }, null);
}
/**
 * https://wicg.github.io/construct-stylesheets/
 * https://developers.google.com/web/updates/2019/02/constructable-stylesheets
 *
 * @internal
 */
class AdoptedStyleSheetsStyles extends ElementStyles {
    constructor(styles, styleSheetCache) {
        super();
        this.styles = styles;
        this.styleSheetCache = styleSheetCache;
        this._styleSheets = void 0;
        this.behaviors = reduceBehaviors(styles);
    }
    get styleSheets() {
        if (this._styleSheets === void 0) {
            const styles = this.styles;
            const styleSheetCache = this.styleSheetCache;
            this._styleSheets = reduceStyles(styles).map((x) => {
                if (x instanceof CSSStyleSheet) {
                    return x;
                }
                let sheet = styleSheetCache.get(x);
                if (sheet === void 0) {
                    sheet = new CSSStyleSheet();
                    sheet.replaceSync(x);
                    styleSheetCache.set(x, sheet);
                }
                return sheet;
            });
        }
        return this._styleSheets;
    }
    addStylesTo(target) {
        console.log("adding styles: initial length", target.adoptedStyleSheets.length);
        target.adoptedStyleSheets = [...target.adoptedStyleSheets, ...this.styleSheets];
        super.addStylesTo(target);
        console.log("adding styles: after length", target.adoptedStyleSheets.length);
    }
    removeStylesFrom(target) {
        console.log("removing styles: initial length", target.adoptedStyleSheets.length);
        const sourceSheets = this.styleSheets;
        target.adoptedStyleSheets = target.adoptedStyleSheets.filter((x) => sourceSheets.indexOf(x) === -1);
        super.removeStylesFrom(target);
        console.log("removing styles: after length", target.adoptedStyleSheets.length);
    }
}
let styleClassId = 0;
function getNextStyleClass() {
    return `fast-style-class-${++styleClassId}`;
}
/**
 * @internal
 */
class StyleElementStyles extends ElementStyles {
    constructor(styles) {
        super();
        this.styles = styles;
        this.behaviors = null;
        this.behaviors = reduceBehaviors(styles);
        this.styleSheets = reduceStyles(styles);
        this.styleClass = getNextStyleClass();
    }
    addStylesTo(target) {
        const styleSheets = this.styleSheets;
        const styleClass = this.styleClass;
        target = this.normalizeTarget(target);
        for (let i = 0; i < styleSheets.length; i++) {
            const element = document.createElement("style");
            element.innerHTML = styleSheets[i];
            element.className = styleClass;
            target.append(element);
        }
        super.addStylesTo(target);
    }
    removeStylesFrom(target) {
        target = this.normalizeTarget(target);
        const styles = target.querySelectorAll(`.${this.styleClass}`);
        for (let i = 0, ii = styles.length; i < ii; ++i) {
            target.removeChild(styles[i]);
        }
        super.removeStylesFrom(target);
    }
    isAttachedTo(target) {
        return super.isAttachedTo(this.normalizeTarget(target));
    }
    normalizeTarget(target) {
        return target === document ? document.body : target;
    }
}


/***/ }),

/***/ "./node_modules/@microsoft/fast-element/dist/esm/templating/binding.js":
/*!*****************************************************************************!*\
  !*** ./node_modules/@microsoft/fast-element/dist/esm/templating/binding.js ***!
  \*****************************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "BindingBehavior": () => (/* binding */ BindingBehavior),
/* harmony export */   "HTMLBindingDirective": () => (/* binding */ HTMLBindingDirective)
/* harmony export */ });
/* harmony import */ var _dom_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../dom.js */ "./node_modules/@microsoft/fast-element/dist/esm/dom.js");
/* harmony import */ var _observation_observable_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../observation/observable.js */ "./node_modules/@microsoft/fast-element/dist/esm/observation/observable.js");
/* harmony import */ var _html_directive_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./html-directive.js */ "./node_modules/@microsoft/fast-element/dist/esm/templating/html-directive.js");



function normalBind(source, context) {
    this.source = source;
    this.context = context;
    if (this.bindingObserver === null) {
        this.bindingObserver = _observation_observable_js__WEBPACK_IMPORTED_MODULE_0__.Observable.binding(this.binding, this, this.isBindingVolatile);
    }
    this.updateTarget(this.bindingObserver.observe(source, context));
}
function triggerBind(source, context) {
    this.source = source;
    this.context = context;
    this.target.addEventListener(this.targetName, this);
}
function normalUnbind() {
    this.bindingObserver.disconnect();
    this.source = null;
    this.context = null;
}
function contentUnbind() {
    this.bindingObserver.disconnect();
    this.source = null;
    this.context = null;
    const view = this.target.$fastView;
    if (view !== void 0 && view.isComposed) {
        view.unbind();
        view.needsBindOnly = true;
    }
}
function triggerUnbind() {
    this.target.removeEventListener(this.targetName, this);
    this.source = null;
    this.context = null;
}
function updateAttributeTarget(value) {
    _dom_js__WEBPACK_IMPORTED_MODULE_1__.DOM.setAttribute(this.target, this.targetName, value);
}
function updateBooleanAttributeTarget(value) {
    _dom_js__WEBPACK_IMPORTED_MODULE_1__.DOM.setBooleanAttribute(this.target, this.targetName, value);
}
function updateContentTarget(value) {
    // If there's no actual value, then this equates to the
    // empty string for the purposes of content bindings.
    if (value === null || value === undefined) {
        value = "";
    }
    // If the value has a "create" method, then it's a template-like.
    if (value.create) {
        this.target.textContent = "";
        let view = this.target.$fastView;
        // If there's no previous view that we might be able to
        // reuse then create a new view from the template.
        if (view === void 0) {
            view = value.create();
        }
        else {
            // If there is a previous view, but it wasn't created
            // from the same template as the new value, then we
            // need to remove the old view if it's still in the DOM
            // and create a new view from the template.
            if (this.target.$fastTemplate !== value) {
                if (view.isComposed) {
                    view.remove();
                    view.unbind();
                }
                view = value.create();
            }
        }
        // It's possible that the value is the same as the previous template
        // and that there's actually no need to compose it.
        if (!view.isComposed) {
            view.isComposed = true;
            view.bind(this.source, this.context);
            view.insertBefore(this.target);
            this.target.$fastView = view;
            this.target.$fastTemplate = value;
        }
        else if (view.needsBindOnly) {
            view.needsBindOnly = false;
            view.bind(this.source, this.context);
        }
    }
    else {
        const view = this.target.$fastView;
        // If there is a view and it's currently composed into
        // the DOM, then we need to remove it.
        if (view !== void 0 && view.isComposed) {
            view.isComposed = false;
            view.remove();
            if (view.needsBindOnly) {
                view.needsBindOnly = false;
            }
            else {
                view.unbind();
            }
        }
        this.target.textContent = value;
    }
}
function updatePropertyTarget(value) {
    this.target[this.targetName] = value;
}
function updateClassTarget(value) {
    const classVersions = this.classVersions || Object.create(null);
    const target = this.target;
    let version = this.version || 0;
    // Add the classes, tracking the version at which they were added.
    if (value !== null && value !== undefined && value.length) {
        const names = value.split(/\s+/);
        for (let i = 0, ii = names.length; i < ii; ++i) {
            const currentName = names[i];
            if (currentName === "") {
                continue;
            }
            classVersions[currentName] = version;
            target.classList.add(currentName);
        }
    }
    this.classVersions = classVersions;
    this.version = version + 1;
    // If this is the first call to add classes, there's no need to remove old ones.
    if (version === 0) {
        return;
    }
    // Remove classes from the previous version.
    version -= 1;
    for (const name in classVersions) {
        if (classVersions[name] === version) {
            target.classList.remove(name);
        }
    }
}
/**
 * A directive that configures data binding to element content and attributes.
 * @public
 */
class HTMLBindingDirective extends _html_directive_js__WEBPACK_IMPORTED_MODULE_2__.TargetedHTMLDirective {
    /**
     * Creates an instance of BindingDirective.
     * @param binding - A binding that returns the data used to update the DOM.
     */
    constructor(binding) {
        super();
        this.binding = binding;
        this.bind = normalBind;
        this.unbind = normalUnbind;
        this.updateTarget = updateAttributeTarget;
        this.isBindingVolatile = _observation_observable_js__WEBPACK_IMPORTED_MODULE_0__.Observable.isVolatileBinding(this.binding);
    }
    /**
     * Gets/sets the name of the attribute or property that this
     * binding is targeting.
     */
    get targetName() {
        return this.originalTargetName;
    }
    set targetName(value) {
        this.originalTargetName = value;
        if (value === void 0) {
            return;
        }
        switch (value[0]) {
            case ":":
                this.cleanedTargetName = value.substr(1);
                this.updateTarget = updatePropertyTarget;
                if (this.cleanedTargetName === "innerHTML") {
                    const binding = this.binding;
                    this.binding = (s, c) => _dom_js__WEBPACK_IMPORTED_MODULE_1__.DOM.createHTML(binding(s, c));
                }
                break;
            case "?":
                this.cleanedTargetName = value.substr(1);
                this.updateTarget = updateBooleanAttributeTarget;
                break;
            case "@":
                this.cleanedTargetName = value.substr(1);
                this.bind = triggerBind;
                this.unbind = triggerUnbind;
                break;
            default:
                this.cleanedTargetName = value;
                if (value === "class") {
                    this.updateTarget = updateClassTarget;
                }
                break;
        }
    }
    /**
     * Makes this binding target the content of an element rather than
     * a particular attribute or property.
     */
    targetAtContent() {
        this.updateTarget = updateContentTarget;
        this.unbind = contentUnbind;
    }
    /**
     * Creates the runtime BindingBehavior instance based on the configuration
     * information stored in the BindingDirective.
     * @param target - The target node that the binding behavior should attach to.
     */
    createBehavior(target) {
        /* eslint-disable-next-line @typescript-eslint/no-use-before-define */
        return new BindingBehavior(target, this.binding, this.isBindingVolatile, this.bind, this.unbind, this.updateTarget, this.cleanedTargetName);
    }
}
/**
 * A behavior that updates content and attributes based on a configured
 * BindingDirective.
 * @public
 */
class BindingBehavior {
    /**
     * Creates an instance of BindingBehavior.
     * @param target - The target of the data updates.
     * @param binding - The binding that returns the latest value for an update.
     * @param isBindingVolatile - Indicates whether the binding has volatile dependencies.
     * @param bind - The operation to perform during binding.
     * @param unbind - The operation to perform during unbinding.
     * @param updateTarget - The operation to perform when updating.
     * @param targetName - The name of the target attribute or property to update.
     */
    constructor(target, binding, isBindingVolatile, bind, unbind, updateTarget, targetName) {
        /** @internal */
        this.source = null;
        /** @internal */
        this.context = null;
        /** @internal */
        this.bindingObserver = null;
        this.target = target;
        this.binding = binding;
        this.isBindingVolatile = isBindingVolatile;
        this.bind = bind;
        this.unbind = unbind;
        this.updateTarget = updateTarget;
        this.targetName = targetName;
    }
    /** @internal */
    handleChange() {
        this.updateTarget(this.bindingObserver.observe(this.source, this.context));
    }
    /** @internal */
    handleEvent(event) {
        _observation_observable_js__WEBPACK_IMPORTED_MODULE_0__.ExecutionContext.setEvent(event);
        const result = this.binding(this.source, this.context);
        _observation_observable_js__WEBPACK_IMPORTED_MODULE_0__.ExecutionContext.setEvent(null);
        if (result !== true) {
            event.preventDefault();
        }
    }
}


/***/ }),

/***/ "./node_modules/@microsoft/fast-element/dist/esm/templating/compiler.js":
/*!******************************************************************************!*\
  !*** ./node_modules/@microsoft/fast-element/dist/esm/templating/compiler.js ***!
  \******************************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "compileTemplate": () => (/* binding */ compileTemplate)
/* harmony export */ });
/* harmony import */ var _dom_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../dom.js */ "./node_modules/@microsoft/fast-element/dist/esm/dom.js");
/* harmony import */ var _binding_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./binding.js */ "./node_modules/@microsoft/fast-element/dist/esm/templating/binding.js");


let sharedContext = null;
class CompilationContext {
    addFactory(factory) {
        factory.targetIndex = this.targetIndex;
        this.behaviorFactories.push(factory);
    }
    captureContentBinding(directive) {
        directive.targetAtContent();
        this.addFactory(directive);
    }
    reset() {
        this.behaviorFactories = [];
        this.targetIndex = -1;
    }
    release() {
        /* eslint-disable-next-line @typescript-eslint/no-this-alias */
        sharedContext = this;
    }
    static borrow(directives) {
        const shareable = sharedContext || new CompilationContext();
        shareable.directives = directives;
        shareable.reset();
        sharedContext = null;
        return shareable;
    }
}
function createAggregateBinding(parts) {
    if (parts.length === 1) {
        return parts[0];
    }
    let targetName;
    const partCount = parts.length;
    const finalParts = parts.map((x) => {
        if (typeof x === "string") {
            return () => x;
        }
        targetName = x.targetName || targetName;
        return x.binding;
    });
    const binding = (scope, context) => {
        let output = "";
        for (let i = 0; i < partCount; ++i) {
            output += finalParts[i](scope, context);
        }
        return output;
    };
    const directive = new _binding_js__WEBPACK_IMPORTED_MODULE_0__.HTMLBindingDirective(binding);
    directive.targetName = targetName;
    return directive;
}
const interpolationEndLength = _dom_js__WEBPACK_IMPORTED_MODULE_1__._interpolationEnd.length;
function parseContent(context, value) {
    const valueParts = value.split(_dom_js__WEBPACK_IMPORTED_MODULE_1__._interpolationStart);
    if (valueParts.length === 1) {
        return null;
    }
    const bindingParts = [];
    for (let i = 0, ii = valueParts.length; i < ii; ++i) {
        const current = valueParts[i];
        const index = current.indexOf(_dom_js__WEBPACK_IMPORTED_MODULE_1__._interpolationEnd);
        let literal;
        if (index === -1) {
            literal = current;
        }
        else {
            const directiveIndex = parseInt(current.substring(0, index));
            bindingParts.push(context.directives[directiveIndex]);
            literal = current.substring(index + interpolationEndLength);
        }
        if (literal !== "") {
            bindingParts.push(literal);
        }
    }
    return bindingParts;
}
function compileAttributes(context, node, includeBasicValues = false) {
    const attributes = node.attributes;
    for (let i = 0, ii = attributes.length; i < ii; ++i) {
        const attr = attributes[i];
        const attrValue = attr.value;
        const parseResult = parseContent(context, attrValue);
        let result = null;
        if (parseResult === null) {
            if (includeBasicValues) {
                result = new _binding_js__WEBPACK_IMPORTED_MODULE_0__.HTMLBindingDirective(() => attrValue);
                result.targetName = attr.name;
            }
        }
        else {
            result = createAggregateBinding(parseResult);
        }
        if (result !== null) {
            node.removeAttributeNode(attr);
            i--;
            ii--;
            context.addFactory(result);
        }
    }
}
function compileContent(context, node, walker) {
    const parseResult = parseContent(context, node.textContent);
    if (parseResult !== null) {
        let lastNode = node;
        for (let i = 0, ii = parseResult.length; i < ii; ++i) {
            const currentPart = parseResult[i];
            const currentNode = i === 0
                ? node
                : lastNode.parentNode.insertBefore(document.createTextNode(""), lastNode.nextSibling);
            if (typeof currentPart === "string") {
                currentNode.textContent = currentPart;
            }
            else {
                currentNode.textContent = " ";
                context.captureContentBinding(currentPart);
            }
            lastNode = currentNode;
            context.targetIndex++;
            if (currentNode !== node) {
                walker.nextNode();
            }
        }
        context.targetIndex--;
    }
}
/**
 * Compiles a template and associated directives into a raw compilation
 * result which include a cloneable DocumentFragment and factories capable
 * of attaching runtime behavior to nodes within the fragment.
 * @param template - The template to compile.
 * @param directives - The directives referenced by the template.
 * @remarks
 * The template that is provided for compilation is altered in-place
 * and cannot be compiled again. If the original template must be preserved,
 * it is recommended that you clone the original and pass the clone to this API.
 * @public
 */
function compileTemplate(template, directives) {
    const fragment = template.content;
    // https://bugs.chromium.org/p/chromium/issues/detail?id=1111864
    document.adoptNode(fragment);
    const context = CompilationContext.borrow(directives);
    compileAttributes(context, template, true);
    const hostBehaviorFactories = context.behaviorFactories;
    context.reset();
    const walker = _dom_js__WEBPACK_IMPORTED_MODULE_1__.DOM.createTemplateWalker(fragment);
    let node;
    while ((node = walker.nextNode())) {
        context.targetIndex++;
        switch (node.nodeType) {
            case 1: // element node
                compileAttributes(context, node);
                break;
            case 3: // text node
                compileContent(context, node, walker);
                break;
            case 8: // comment
                if (_dom_js__WEBPACK_IMPORTED_MODULE_1__.DOM.isMarker(node)) {
                    context.addFactory(directives[_dom_js__WEBPACK_IMPORTED_MODULE_1__.DOM.extractDirectiveIndexFromMarker(node)]);
                }
        }
    }
    let targetOffset = 0;
    if (
    // If the first node in a fragment is a marker, that means it's an unstable first node,
    // because something like a when, repeat, etc. could add nodes before the marker.
    // To mitigate this, we insert a stable first node. However, if we insert a node,
    // that will alter the result of the TreeWalker. So, we also need to offset the target index.
    _dom_js__WEBPACK_IMPORTED_MODULE_1__.DOM.isMarker(fragment.firstChild) ||
        // Or if there is only one node and a directive, it means the template's content
        // is *only* the directive. In that case, HTMLView.dispose() misses any nodes inserted by
        // the directive. Inserting a new node ensures proper disposal of nodes added by the directive.
        (fragment.childNodes.length === 1 && directives.length)) {
        fragment.insertBefore(document.createComment(""), fragment.firstChild);
        targetOffset = -1;
    }
    const viewBehaviorFactories = context.behaviorFactories;
    context.release();
    return {
        fragment,
        viewBehaviorFactories,
        hostBehaviorFactories,
        targetOffset,
    };
}


/***/ }),

/***/ "./node_modules/@microsoft/fast-element/dist/esm/templating/html-directive.js":
/*!************************************************************************************!*\
  !*** ./node_modules/@microsoft/fast-element/dist/esm/templating/html-directive.js ***!
  \************************************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "AttachedBehaviorHTMLDirective": () => (/* binding */ AttachedBehaviorHTMLDirective),
/* harmony export */   "HTMLDirective": () => (/* binding */ HTMLDirective),
/* harmony export */   "TargetedHTMLDirective": () => (/* binding */ TargetedHTMLDirective)
/* harmony export */ });
/* harmony import */ var _dom_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../dom.js */ "./node_modules/@microsoft/fast-element/dist/esm/dom.js");

/**
 * Instructs the template engine to apply behavior to a node.
 * @public
 */
class HTMLDirective {
    constructor() {
        /**
         * The index of the DOM node to which the created behavior will apply.
         */
        this.targetIndex = 0;
    }
}
/**
 * A {@link HTMLDirective} that targets a named attribute or property on a node.
 * @public
 */
class TargetedHTMLDirective extends HTMLDirective {
    constructor() {
        super(...arguments);
        /**
         * Creates a placeholder string based on the directive's index within the template.
         * @param index - The index of the directive within the template.
         */
        this.createPlaceholder = _dom_js__WEBPACK_IMPORTED_MODULE_0__.DOM.createInterpolationPlaceholder;
    }
}
/**
 * A directive that attaches special behavior to an element via a custom attribute.
 * @public
 */
class AttachedBehaviorHTMLDirective extends HTMLDirective {
    /**
     *
     * @param name - The name of the behavior; used as a custom attribute on the element.
     * @param behavior - The behavior to instantiate and attach to the element.
     * @param options - Options to pass to the behavior during creation.
     */
    constructor(name, behavior, options) {
        super();
        this.name = name;
        this.behavior = behavior;
        this.options = options;
    }
    /**
     * Creates a placeholder string based on the directive's index within the template.
     * @param index - The index of the directive within the template.
     * @remarks
     * Creates a custom attribute placeholder.
     */
    createPlaceholder(index) {
        return _dom_js__WEBPACK_IMPORTED_MODULE_0__.DOM.createCustomAttributePlaceholder(this.name, index);
    }
    /**
     * Creates a behavior for the provided target node.
     * @param target - The node instance to create the behavior for.
     * @remarks
     * Creates an instance of the `behavior` type this directive was constructed with
     * and passes the target and options to that `behavior`'s constructor.
     */
    createBehavior(target) {
        return new this.behavior(target, this.options);
    }
}


/***/ }),

/***/ "./node_modules/@microsoft/fast-element/dist/esm/templating/node-observation.js":
/*!**************************************************************************************!*\
  !*** ./node_modules/@microsoft/fast-element/dist/esm/templating/node-observation.js ***!
  \**************************************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "NodeObservationBehavior": () => (/* binding */ NodeObservationBehavior),
/* harmony export */   "elements": () => (/* binding */ elements)
/* harmony export */ });
/* harmony import */ var _observation_observable_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../observation/observable.js */ "./node_modules/@microsoft/fast-element/dist/esm/observation/observable.js");
/* harmony import */ var _platform_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../platform.js */ "./node_modules/@microsoft/fast-element/dist/esm/platform.js");


/**
 * Creates a function that can be used to filter a Node array, selecting only elements.
 * @param selector - An optional selector to restrict the filter to.
 * @public
 */
function elements(selector) {
    if (selector) {
        return function (value, index, array) {
            return value.nodeType === 1 && value.matches(selector);
        };
    }
    return function (value, index, array) {
        return value.nodeType === 1;
    };
}
/**
 * A base class for node observation.
 * @internal
 */
class NodeObservationBehavior {
    /**
     * Creates an instance of NodeObservationBehavior.
     * @param target - The target to assign the nodes property on.
     * @param options - The options to use in configuring node observation.
     */
    constructor(target, options) {
        this.target = target;
        this.options = options;
        this.source = null;
    }
    /**
     * Bind this behavior to the source.
     * @param source - The source to bind to.
     * @param context - The execution context that the binding is operating within.
     */
    bind(source) {
        const name = this.options.property;
        this.shouldUpdate = _observation_observable_js__WEBPACK_IMPORTED_MODULE_0__.Observable.getAccessors(source).some((x) => x.name === name);
        this.source = source;
        this.updateTarget(this.computeNodes());
        if (this.shouldUpdate) {
            this.observe();
        }
    }
    /**
     * Unbinds this behavior from the source.
     * @param source - The source to unbind from.
     */
    unbind() {
        this.updateTarget(_platform_js__WEBPACK_IMPORTED_MODULE_1__.emptyArray);
        this.source = null;
        if (this.shouldUpdate) {
            this.disconnect();
        }
    }
    /** @internal */
    handleEvent() {
        this.updateTarget(this.computeNodes());
    }
    computeNodes() {
        let nodes = this.getNodes();
        if (this.options.filter !== void 0) {
            nodes = nodes.filter(this.options.filter);
        }
        return nodes;
    }
    updateTarget(value) {
        this.source[this.options.property] = value;
    }
}


/***/ }),

/***/ "./node_modules/@microsoft/fast-element/dist/esm/templating/ref.js":
/*!*************************************************************************!*\
  !*** ./node_modules/@microsoft/fast-element/dist/esm/templating/ref.js ***!
  \*************************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "RefBehavior": () => (/* binding */ RefBehavior),
/* harmony export */   "ref": () => (/* binding */ ref)
/* harmony export */ });
/* harmony import */ var _html_directive_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./html-directive.js */ "./node_modules/@microsoft/fast-element/dist/esm/templating/html-directive.js");

/**
 * The runtime behavior for template references.
 * @public
 */
class RefBehavior {
    /**
     * Creates an instance of RefBehavior.
     * @param target - The element to reference.
     * @param propertyName - The name of the property to assign the reference to.
     */
    constructor(target, propertyName) {
        this.target = target;
        this.propertyName = propertyName;
    }
    /**
     * Bind this behavior to the source.
     * @param source - The source to bind to.
     * @param context - The execution context that the binding is operating within.
     */
    bind(source) {
        source[this.propertyName] = this.target;
    }
    /**
     * Unbinds this behavior from the source.
     * @param source - The source to unbind from.
     */
    /* eslint-disable-next-line @typescript-eslint/no-empty-function */
    unbind() { }
}
/**
 * A directive that observes the updates a property with a reference to the element.
 * @param propertyName - The name of the property to assign the reference to.
 * @public
 */
function ref(propertyName) {
    return new _html_directive_js__WEBPACK_IMPORTED_MODULE_0__.AttachedBehaviorHTMLDirective("fast-ref", RefBehavior, propertyName);
}


/***/ }),

/***/ "./node_modules/@microsoft/fast-element/dist/esm/templating/slotted.js":
/*!*****************************************************************************!*\
  !*** ./node_modules/@microsoft/fast-element/dist/esm/templating/slotted.js ***!
  \*****************************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "SlottedBehavior": () => (/* binding */ SlottedBehavior),
/* harmony export */   "slotted": () => (/* binding */ slotted)
/* harmony export */ });
/* harmony import */ var _html_directive_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./html-directive.js */ "./node_modules/@microsoft/fast-element/dist/esm/templating/html-directive.js");
/* harmony import */ var _node_observation_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./node-observation.js */ "./node_modules/@microsoft/fast-element/dist/esm/templating/node-observation.js");


/**
 * The runtime behavior for slotted node observation.
 * @public
 */
class SlottedBehavior extends _node_observation_js__WEBPACK_IMPORTED_MODULE_0__.NodeObservationBehavior {
    /**
     * Creates an instance of SlottedBehavior.
     * @param target - The slot element target to observe.
     * @param options - The options to use when observing the slot.
     */
    constructor(target, options) {
        super(target, options);
    }
    /**
     * Begins observation of the nodes.
     */
    observe() {
        this.target.addEventListener("slotchange", this);
    }
    /**
     * Disconnects observation of the nodes.
     */
    disconnect() {
        this.target.removeEventListener("slotchange", this);
    }
    /**
     * Retrieves the nodes that should be assigned to the target.
     */
    getNodes() {
        return this.target.assignedNodes(this.options);
    }
}
/**
 * A directive that observes the `assignedNodes()` of a slot and updates a property
 * whenever they change.
 * @param propertyOrOptions - The options used to configure slotted node observation.
 * @public
 */
function slotted(propertyOrOptions) {
    if (typeof propertyOrOptions === "string") {
        propertyOrOptions = { property: propertyOrOptions };
    }
    return new _html_directive_js__WEBPACK_IMPORTED_MODULE_1__.AttachedBehaviorHTMLDirective("fast-slotted", SlottedBehavior, propertyOrOptions);
}


/***/ }),

/***/ "./node_modules/@microsoft/fast-element/dist/esm/templating/template.js":
/*!******************************************************************************!*\
  !*** ./node_modules/@microsoft/fast-element/dist/esm/templating/template.js ***!
  \******************************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "ViewTemplate": () => (/* binding */ ViewTemplate),
/* harmony export */   "html": () => (/* binding */ html)
/* harmony export */ });
/* harmony import */ var _dom_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../dom.js */ "./node_modules/@microsoft/fast-element/dist/esm/dom.js");
/* harmony import */ var _observation_observable_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../observation/observable.js */ "./node_modules/@microsoft/fast-element/dist/esm/observation/observable.js");
/* harmony import */ var _compiler_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./compiler.js */ "./node_modules/@microsoft/fast-element/dist/esm/templating/compiler.js");
/* harmony import */ var _view_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./view.js */ "./node_modules/@microsoft/fast-element/dist/esm/templating/view.js");
/* harmony import */ var _html_directive_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./html-directive.js */ "./node_modules/@microsoft/fast-element/dist/esm/templating/html-directive.js");
/* harmony import */ var _binding_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./binding.js */ "./node_modules/@microsoft/fast-element/dist/esm/templating/binding.js");






/**
 * A template capable of creating HTMLView instances or rendering directly to DOM.
 * @public
 */
/* eslint-disable-next-line @typescript-eslint/no-unused-vars */
class ViewTemplate {
    /**
     * Creates an instance of ViewTemplate.
     * @param html - The html representing what this template will instantiate, including placeholders for directives.
     * @param directives - The directives that will be connected to placeholders in the html.
     */
    constructor(html, directives) {
        this.behaviorCount = 0;
        this.hasHostBehaviors = false;
        this.fragment = null;
        this.targetOffset = 0;
        this.viewBehaviorFactories = null;
        this.hostBehaviorFactories = null;
        this.html = html;
        this.directives = directives;
    }
    /**
     * Creates an HTMLView instance based on this template definition.
     * @param hostBindingTarget - The element that host behaviors will be bound to.
     */
    create(hostBindingTarget) {
        if (this.fragment === null) {
            let template;
            const html = this.html;
            if (typeof html === "string") {
                template = document.createElement("template");
                template.innerHTML = _dom_js__WEBPACK_IMPORTED_MODULE_0__.DOM.createHTML(html);
                const fec = template.content.firstElementChild;
                if (fec !== null && fec.tagName === "TEMPLATE") {
                    template = fec;
                }
            }
            else {
                template = html;
            }
            const result = (0,_compiler_js__WEBPACK_IMPORTED_MODULE_1__.compileTemplate)(template, this.directives);
            this.fragment = result.fragment;
            this.viewBehaviorFactories = result.viewBehaviorFactories;
            this.hostBehaviorFactories = result.hostBehaviorFactories;
            this.targetOffset = result.targetOffset;
            this.behaviorCount =
                this.viewBehaviorFactories.length + this.hostBehaviorFactories.length;
            this.hasHostBehaviors = this.hostBehaviorFactories.length > 0;
        }
        const fragment = this.fragment.cloneNode(true);
        const viewFactories = this.viewBehaviorFactories;
        const behaviors = new Array(this.behaviorCount);
        const walker = _dom_js__WEBPACK_IMPORTED_MODULE_0__.DOM.createTemplateWalker(fragment);
        let behaviorIndex = 0;
        let targetIndex = this.targetOffset;
        let node = walker.nextNode();
        for (let ii = viewFactories.length; behaviorIndex < ii; ++behaviorIndex) {
            const factory = viewFactories[behaviorIndex];
            const factoryIndex = factory.targetIndex;
            while (node !== null) {
                if (targetIndex === factoryIndex) {
                    behaviors[behaviorIndex] = factory.createBehavior(node);
                    break;
                }
                else {
                    node = walker.nextNode();
                    targetIndex++;
                }
            }
        }
        if (this.hasHostBehaviors) {
            const hostFactories = this.hostBehaviorFactories;
            for (let i = 0, ii = hostFactories.length; i < ii; ++i, ++behaviorIndex) {
                behaviors[behaviorIndex] = hostFactories[i].createBehavior(hostBindingTarget);
            }
        }
        return new _view_js__WEBPACK_IMPORTED_MODULE_2__.HTMLView(fragment, behaviors);
    }
    /**
     * Creates an HTMLView from this template, binds it to the source, and then appends it to the host.
     * @param source - The data source to bind the template to.
     * @param host - The Element where the template will be rendered.
     * @param hostBindingTarget - An HTML element to target the host bindings at if different from the
     * host that the template is being attached to.
     */
    render(source, host, hostBindingTarget) {
        if (typeof host === "string") {
            host = document.getElementById(host);
        }
        if (hostBindingTarget === void 0) {
            hostBindingTarget = host;
        }
        const view = this.create(hostBindingTarget);
        view.bind(source, _observation_observable_js__WEBPACK_IMPORTED_MODULE_3__.defaultExecutionContext);
        view.appendTo(host);
        return view;
    }
}
// Much thanks to LitHTML for working this out!
const lastAttributeNameRegex =
/* eslint-disable-next-line no-control-regex */
/([ \x09\x0a\x0c\x0d])([^\0-\x1F\x7F-\x9F "'>=/]+)([ \x09\x0a\x0c\x0d]*=[ \x09\x0a\x0c\x0d]*(?:[^ \x09\x0a\x0c\x0d"'`<>=]*|"[^"]*|'[^']*))$/;
/**
 * Transforms a template literal string into a renderable ViewTemplate.
 * @param strings - The string fragments that are interpolated with the values.
 * @param values - The values that are interpolated with the string fragments.
 * @remarks
 * The html helper supports interpolation of strings, numbers, binding expressions,
 * other template instances, and Directive instances.
 * @public
 */
function html(strings, ...values) {
    const directives = [];
    let html = "";
    for (let i = 0, ii = strings.length - 1; i < ii; ++i) {
        const currentString = strings[i];
        let value = values[i];
        html += currentString;
        if (value instanceof ViewTemplate) {
            const template = value;
            value = () => template;
        }
        if (typeof value === "function") {
            value = new _binding_js__WEBPACK_IMPORTED_MODULE_4__.HTMLBindingDirective(value);
        }
        if (value instanceof _html_directive_js__WEBPACK_IMPORTED_MODULE_5__.TargetedHTMLDirective) {
            const match = lastAttributeNameRegex.exec(currentString);
            if (match !== null) {
                value.targetName = match[2];
            }
        }
        if (value instanceof _html_directive_js__WEBPACK_IMPORTED_MODULE_5__.HTMLDirective) {
            // Since not all values are directives, we can't use i
            // as the index for the placeholder. Instead, we need to
            // use directives.length to get the next index.
            html += value.createPlaceholder(directives.length);
            directives.push(value);
        }
        else {
            html += value;
        }
    }
    html += strings[strings.length - 1];
    return new ViewTemplate(html, directives);
}


/***/ }),

/***/ "./node_modules/@microsoft/fast-element/dist/esm/templating/view.js":
/*!**************************************************************************!*\
  !*** ./node_modules/@microsoft/fast-element/dist/esm/templating/view.js ***!
  \**************************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "HTMLView": () => (/* binding */ HTMLView)
/* harmony export */ });
// A singleton Range instance used to efficiently remove ranges of DOM nodes.
// See the implementation of HTMLView below for further details.
const range = document.createRange();
/**
 * The standard View implementation, which also implements ElementView and SyntheticView.
 * @public
 */
class HTMLView {
    /**
     * Constructs an instance of HTMLView.
     * @param fragment - The html fragment that contains the nodes for this view.
     * @param behaviors - The behaviors to be applied to this view.
     */
    constructor(fragment, behaviors) {
        this.fragment = fragment;
        this.behaviors = behaviors;
        /**
         * The data that the view is bound to.
         */
        this.source = null;
        /**
         * The execution context the view is running within.
         */
        this.context = null;
        this.firstChild = fragment.firstChild;
        this.lastChild = fragment.lastChild;
    }
    /**
     * Appends the view's DOM nodes to the referenced node.
     * @param node - The parent node to append the view's DOM nodes to.
     */
    appendTo(node) {
        node.appendChild(this.fragment);
    }
    /**
     * Inserts the view's DOM nodes before the referenced node.
     * @param node - The node to insert the view's DOM before.
     */
    insertBefore(node) {
        if (this.fragment.hasChildNodes()) {
            node.parentNode.insertBefore(this.fragment, node);
        }
        else {
            const parentNode = node.parentNode;
            const end = this.lastChild;
            let current = this.firstChild;
            let next;
            while (current !== end) {
                next = current.nextSibling;
                parentNode.insertBefore(current, node);
                current = next;
            }
            parentNode.insertBefore(end, node);
        }
    }
    /**
     * Removes the view's DOM nodes.
     * The nodes are not disposed and the view can later be re-inserted.
     */
    remove() {
        const fragment = this.fragment;
        const end = this.lastChild;
        let current = this.firstChild;
        let next;
        while (current !== end) {
            next = current.nextSibling;
            fragment.appendChild(current);
            current = next;
        }
        fragment.appendChild(end);
    }
    /**
     * Removes the view and unbinds its behaviors, disposing of DOM nodes afterward.
     * Once a view has been disposed, it cannot be inserted or bound again.
     */
    dispose() {
        const parent = this.firstChild.parentNode;
        const end = this.lastChild;
        let current = this.firstChild;
        let next;
        while (current !== end) {
            next = current.nextSibling;
            parent.removeChild(current);
            current = next;
        }
        parent.removeChild(end);
        const behaviors = this.behaviors;
        const oldSource = this.source;
        for (let i = 0, ii = behaviors.length; i < ii; ++i) {
            behaviors[i].unbind(oldSource);
        }
    }
    /**
     * Binds a view's behaviors to its binding source.
     * @param source - The binding source for the view's binding behaviors.
     * @param context - The execution context to run the behaviors within.
     */
    bind(source, context) {
        const behaviors = this.behaviors;
        if (this.source === source) {
            return;
        }
        else if (this.source !== null) {
            const oldSource = this.source;
            this.source = source;
            this.context = context;
            for (let i = 0, ii = behaviors.length; i < ii; ++i) {
                const current = behaviors[i];
                current.unbind(oldSource);
                current.bind(source, context);
            }
        }
        else {
            this.source = source;
            this.context = context;
            for (let i = 0, ii = behaviors.length; i < ii; ++i) {
                behaviors[i].bind(source, context);
            }
        }
    }
    /**
     * Unbinds a view's behaviors from its binding source.
     */
    unbind() {
        if (this.source === null) {
            return;
        }
        const behaviors = this.behaviors;
        const oldSource = this.source;
        for (let i = 0, ii = behaviors.length; i < ii; ++i) {
            behaviors[i].unbind(oldSource);
        }
        this.source = null;
    }
    /**
     * Efficiently disposes of a contiguous range of synthetic view instances.
     * @param views - A contiguous range of views to be disposed.
     */
    static disposeContiguousBatch(views) {
        if (views.length === 0) {
            return;
        }
        range.setStartBefore(views[0].firstChild);
        range.setEndAfter(views[views.length - 1].lastChild);
        range.deleteContents();
        for (let i = 0, ii = views.length; i < ii; ++i) {
            const view = views[i];
            const behaviors = view.behaviors;
            const oldSource = view.source;
            for (let j = 0, jj = behaviors.length; j < jj; ++j) {
                behaviors[j].unbind(oldSource);
            }
        }
    }
}


/***/ }),

/***/ "./node_modules/@microsoft/fast-foundation/dist/esm/anchor/anchor.js":
/*!***************************************************************************!*\
  !*** ./node_modules/@microsoft/fast-foundation/dist/esm/anchor/anchor.js ***!
  \***************************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "Anchor": () => (/* binding */ Anchor),
/* harmony export */   "DelegatesARIALink": () => (/* binding */ DelegatesARIALink)
/* harmony export */ });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! tslib */ "./node_modules/tslib/tslib.es6.js");
/* harmony import */ var _microsoft_fast_element__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @microsoft/fast-element */ "./node_modules/@microsoft/fast-element/dist/esm/components/attributes.js");
/* harmony import */ var _microsoft_fast_element__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @microsoft/fast-element */ "./node_modules/@microsoft/fast-element/dist/esm/observation/observable.js");
/* harmony import */ var _foundation_element_foundation_element_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../foundation-element/foundation-element.js */ "./node_modules/@microsoft/fast-foundation/dist/esm/foundation-element/foundation-element.js");
/* harmony import */ var _patterns_index_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../patterns/index.js */ "./node_modules/@microsoft/fast-foundation/dist/esm/patterns/aria-global.js");
/* harmony import */ var _patterns_index_js__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../patterns/index.js */ "./node_modules/@microsoft/fast-foundation/dist/esm/patterns/start-end.js");
/* harmony import */ var _utilities_apply_mixins_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../utilities/apply-mixins.js */ "./node_modules/@microsoft/fast-foundation/dist/esm/utilities/apply-mixins.js");





/**
 * An Anchor Custom HTML Element.
 * Based largely on the {@link https://developer.mozilla.org/en-US/docs/Web/HTML/Element/a | <a> element }.
 *
 * @slot start - Content which can be provided before the anchor content
 * @slot end - Content which can be provided after the anchor content
 * @slot - The default slot for anchor content
 * @csspart control - The anchor element
 * @csspart content - The element wrapping anchor content
 *
 * @public
 */
class Anchor extends _foundation_element_foundation_element_js__WEBPACK_IMPORTED_MODULE_0__.FoundationElement {
    constructor() {
        super(...arguments);
        /**
         * Overrides the focus call for where delegatesFocus is unsupported.
         * This check works for Chrome, Edge Chromium, FireFox, and Safari
         * Relevant PR on the Firefox browser: https://phabricator.services.mozilla.com/D123858
         */
        this.handleUnsupportedDelegatesFocus = () => {
            var _a;
            // Check to see if delegatesFocus is supported
            if (window.ShadowRoot &&
                !window.ShadowRoot.prototype.hasOwnProperty("delegatesFocus") &&
                ((_a = this.$fastController.definition.shadowOptions) === null || _a === void 0 ? void 0 : _a.delegatesFocus)) {
                this.focus = () => {
                    this.control.focus();
                };
            }
        };
    }
    /**
     * @internal
     */
    connectedCallback() {
        console.log("Anchor connecting");
        super.connectedCallback();
        this.handleUnsupportedDelegatesFocus();
        console.log("Anchor connected");
    }
}
(0,tslib__WEBPACK_IMPORTED_MODULE_1__.__decorate)([
    _microsoft_fast_element__WEBPACK_IMPORTED_MODULE_2__.attr
], Anchor.prototype, "download", void 0);
(0,tslib__WEBPACK_IMPORTED_MODULE_1__.__decorate)([
    _microsoft_fast_element__WEBPACK_IMPORTED_MODULE_2__.attr
], Anchor.prototype, "href", void 0);
(0,tslib__WEBPACK_IMPORTED_MODULE_1__.__decorate)([
    _microsoft_fast_element__WEBPACK_IMPORTED_MODULE_2__.attr
], Anchor.prototype, "hreflang", void 0);
(0,tslib__WEBPACK_IMPORTED_MODULE_1__.__decorate)([
    _microsoft_fast_element__WEBPACK_IMPORTED_MODULE_2__.attr
], Anchor.prototype, "ping", void 0);
(0,tslib__WEBPACK_IMPORTED_MODULE_1__.__decorate)([
    _microsoft_fast_element__WEBPACK_IMPORTED_MODULE_2__.attr
], Anchor.prototype, "referrerpolicy", void 0);
(0,tslib__WEBPACK_IMPORTED_MODULE_1__.__decorate)([
    _microsoft_fast_element__WEBPACK_IMPORTED_MODULE_2__.attr
], Anchor.prototype, "rel", void 0);
(0,tslib__WEBPACK_IMPORTED_MODULE_1__.__decorate)([
    _microsoft_fast_element__WEBPACK_IMPORTED_MODULE_2__.attr
], Anchor.prototype, "target", void 0);
(0,tslib__WEBPACK_IMPORTED_MODULE_1__.__decorate)([
    _microsoft_fast_element__WEBPACK_IMPORTED_MODULE_2__.attr
], Anchor.prototype, "type", void 0);
(0,tslib__WEBPACK_IMPORTED_MODULE_1__.__decorate)([
    _microsoft_fast_element__WEBPACK_IMPORTED_MODULE_3__.observable
], Anchor.prototype, "defaultSlottedContent", void 0);
/**
 * Includes ARIA states and properties relating to the ARIA link role
 *
 * @public
 */
class DelegatesARIALink {
}
(0,tslib__WEBPACK_IMPORTED_MODULE_1__.__decorate)([
    (0,_microsoft_fast_element__WEBPACK_IMPORTED_MODULE_2__.attr)({ attribute: "aria-expanded" })
], DelegatesARIALink.prototype, "ariaExpanded", void 0);
(0,_utilities_apply_mixins_js__WEBPACK_IMPORTED_MODULE_4__.applyMixins)(DelegatesARIALink, _patterns_index_js__WEBPACK_IMPORTED_MODULE_5__.ARIAGlobalStatesAndProperties);
(0,_utilities_apply_mixins_js__WEBPACK_IMPORTED_MODULE_4__.applyMixins)(Anchor, _patterns_index_js__WEBPACK_IMPORTED_MODULE_6__.StartEnd, DelegatesARIALink);


/***/ }),

/***/ "./node_modules/@microsoft/fast-foundation/dist/esm/anchor/anchor.template.js":
/*!************************************************************************************!*\
  !*** ./node_modules/@microsoft/fast-foundation/dist/esm/anchor/anchor.template.js ***!
  \************************************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "anchorTemplate": () => (/* binding */ anchorTemplate)
/* harmony export */ });
/* harmony import */ var _microsoft_fast_element__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @microsoft/fast-element */ "./node_modules/@microsoft/fast-element/dist/esm/templating/template.js");
/* harmony import */ var _microsoft_fast_element__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @microsoft/fast-element */ "./node_modules/@microsoft/fast-element/dist/esm/templating/ref.js");
/* harmony import */ var _microsoft_fast_element__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @microsoft/fast-element */ "./node_modules/@microsoft/fast-element/dist/esm/templating/slotted.js");
/* harmony import */ var _patterns_start_end_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../patterns/start-end.js */ "./node_modules/@microsoft/fast-foundation/dist/esm/patterns/start-end.js");


/**
 * The template for the {@link @microsoft/fast-foundation#(Anchor:class)} component.
 * @public
 */
const anchorTemplate = (context, definition) => _microsoft_fast_element__WEBPACK_IMPORTED_MODULE_0__.html `
    <a
        class="control"
        part="control"
        download="${x => x.download}"
        href="${x => x.href}"
        hreflang="${x => x.hreflang}"
        ping="${x => x.ping}"
        referrerpolicy="${x => x.referrerpolicy}"
        rel="${x => x.rel}"
        target="${x => x.target}"
        type="${x => x.type}"
        aria-atomic="${x => x.ariaAtomic}"
        aria-busy="${x => x.ariaBusy}"
        aria-controls="${x => x.ariaControls}"
        aria-current="${x => x.ariaCurrent}"
        aria-describedby="${x => x.ariaDescribedby}"
        aria-details="${x => x.ariaDetails}"
        aria-disabled="${x => x.ariaDisabled}"
        aria-errormessage="${x => x.ariaErrormessage}"
        aria-expanded="${x => x.ariaExpanded}"
        aria-flowto="${x => x.ariaFlowto}"
        aria-haspopup="${x => x.ariaHaspopup}"
        aria-hidden="${x => x.ariaHidden}"
        aria-invalid="${x => x.ariaInvalid}"
        aria-keyshortcuts="${x => x.ariaKeyshortcuts}"
        aria-label="${x => x.ariaLabel}"
        aria-labelledby="${x => x.ariaLabelledby}"
        aria-live="${x => x.ariaLive}"
        aria-owns="${x => x.ariaOwns}"
        aria-relevant="${x => x.ariaRelevant}"
        aria-roledescription="${x => x.ariaRoledescription}"
        ${(0,_microsoft_fast_element__WEBPACK_IMPORTED_MODULE_1__.ref)("control")}
    >
        ${(0,_patterns_start_end_js__WEBPACK_IMPORTED_MODULE_2__.startSlotTemplate)(context, definition)}
        <span class="content" part="content">
            <slot ${(0,_microsoft_fast_element__WEBPACK_IMPORTED_MODULE_3__.slotted)("defaultSlottedContent")}></slot>
        </span>
        ${(0,_patterns_start_end_js__WEBPACK_IMPORTED_MODULE_2__.endSlotTemplate)(context, definition)}
    </a>
`;


/***/ }),

/***/ "./node_modules/@microsoft/fast-foundation/dist/esm/design-system/component-presentation.js":
/*!**************************************************************************************************!*\
  !*** ./node_modules/@microsoft/fast-foundation/dist/esm/design-system/component-presentation.js ***!
  \**************************************************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "ComponentPresentation": () => (/* binding */ ComponentPresentation),
/* harmony export */   "DefaultComponentPresentation": () => (/* binding */ DefaultComponentPresentation)
/* harmony export */ });
/* harmony import */ var _microsoft_fast_element__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @microsoft/fast-element */ "./node_modules/@microsoft/fast-element/dist/esm/styles/element-styles.js");
/* harmony import */ var _di_di_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../di/di.js */ "./node_modules/@microsoft/fast-foundation/dist/esm/di/di.js");


function presentationKeyFromTag(tagName) {
    return `${tagName.toLowerCase()}:presentation`;
}
const presentationRegistry = new Map();
/**
 * An API gateway to component presentation features.
 * @public
 */
const ComponentPresentation = Object.freeze({
    /**
     * Defines a component presentation for an element.
     * @param tagName - The element name to define the presentation for.
     * @param presentation - The presentation that will be applied to matching elements.
     * @param container - The dependency injection container to register the configuration in.
     * @public
     */
    define(tagName, presentation, container) {
        const key = presentationKeyFromTag(tagName);
        const existing = presentationRegistry.get(key);
        if (existing === void 0) {
            presentationRegistry.set(key, presentation);
        }
        else {
            // false indicates that we have more than one presentation
            // registered for a tagName and we must resolve through DI
            presentationRegistry.set(key, false);
        }
        container.register(_di_di_js__WEBPACK_IMPORTED_MODULE_0__.Registration.instance(key, presentation));
    },
    /**
     * Finds a component presentation for the specified element name,
     * searching the DOM hierarchy starting from the provided element.
     * @param tagName - The name of the element to locate the presentation for.
     * @param element - The element to begin the search from.
     * @returns The component presentation or null if none is found.
     * @public
     */
    forTag(tagName, element) {
        const key = presentationKeyFromTag(tagName);
        const existing = presentationRegistry.get(key);
        if (existing === false) {
            const container = _di_di_js__WEBPACK_IMPORTED_MODULE_0__.DI.findResponsibleContainer(element);
            return container.get(key);
        }
        return existing || null;
    },
});
/**
 * The default implementation of ComponentPresentation, used by FoundationElement.
 * @public
 */
class DefaultComponentPresentation {
    /**
     * Creates an instance of DefaultComponentPresentation.
     * @param template - The template to apply to the element.
     * @param styles - The styles to apply to the element.
     * @public
     */
    constructor(template, styles) {
        this.template = template || null;
        this.styles =
            styles === void 0
                ? null
                : Array.isArray(styles)
                    ? _microsoft_fast_element__WEBPACK_IMPORTED_MODULE_1__.ElementStyles.create(styles)
                    : styles instanceof _microsoft_fast_element__WEBPACK_IMPORTED_MODULE_1__.ElementStyles
                        ? styles
                        : _microsoft_fast_element__WEBPACK_IMPORTED_MODULE_1__.ElementStyles.create([styles]);
    }
    /**
     * Applies the presentation details to the specified element.
     * @param element - The element to apply the presentation details to.
     * @public
     */
    applyTo(element) {
        const controller = element.$fastController;
        if (controller.template === null) {
            controller.template = this.template;
        }
        if (controller.styles === null) {
            controller.styles = this.styles;
        }
    }
}


/***/ }),

/***/ "./node_modules/@microsoft/fast-foundation/dist/esm/design-system/design-system.js":
/*!*****************************************************************************************!*\
  !*** ./node_modules/@microsoft/fast-foundation/dist/esm/design-system/design-system.js ***!
  \*****************************************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "DesignSystem": () => (/* binding */ DesignSystem),
/* harmony export */   "ElementDisambiguation": () => (/* binding */ ElementDisambiguation)
/* harmony export */ });
/* harmony import */ var _microsoft_fast_element__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @microsoft/fast-element */ "./node_modules/@microsoft/fast-element/dist/esm/components/fast-definitions.js");
/* harmony import */ var _foundation_element_foundation_element_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../foundation-element/foundation-element.js */ "./node_modules/@microsoft/fast-foundation/dist/esm/foundation-element/foundation-element.js");
/* harmony import */ var _di_di_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../di/di.js */ "./node_modules/@microsoft/fast-foundation/dist/esm/di/di.js");
/* harmony import */ var _design_token_design_token_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../design-token/design-token.js */ "./node_modules/@microsoft/fast-foundation/dist/esm/design-token/design-token.js");
/* harmony import */ var _component_presentation_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./component-presentation.js */ "./node_modules/@microsoft/fast-foundation/dist/esm/design-system/component-presentation.js");





/* eslint-disable @typescript-eslint/no-non-null-assertion */
/**
 * Indicates what to do with an ambiguous (duplicate) element.
 * @public
 */
const ElementDisambiguation = Object.freeze({
    /**
     * Skip defining the element but still call the provided callback passed
     * to DesignSystemRegistrationContext.tryDefineElement
     */
    definitionCallbackOnly: null,
    /**
     * Ignore the duplicate element entirely.
     */
    ignoreDuplicate: Symbol(),
});
const elementTypesByTag = new Map();
const elementTagsByType = new Map();
let rootDesignSystem = null;
const designSystemKey = _di_di_js__WEBPACK_IMPORTED_MODULE_0__.DI.createInterface(x => x.cachedCallback(handler => {
    if (rootDesignSystem === null) {
        rootDesignSystem = new DefaultDesignSystem(null, handler);
    }
    return rootDesignSystem;
}));
/**
 * An API gateway to design system features.
 * @public
 */
const DesignSystem = Object.freeze({
    /**
     * Returns the HTML element name that the type is defined as.
     * @param type - The type to lookup.
     * @public
     */
    tagFor(type) {
        return elementTagsByType.get(type);
    },
    /**
     * Searches the DOM hierarchy for the design system that is responsible
     * for the provided element.
     * @param element - The element to locate the design system for.
     * @returns The located design system.
     * @public
     */
    responsibleFor(element) {
        const owned = element.$$designSystem$$;
        if (owned) {
            return owned;
        }
        const container = _di_di_js__WEBPACK_IMPORTED_MODULE_0__.DI.findResponsibleContainer(element);
        return container.get(designSystemKey);
    },
    /**
     * Gets the DesignSystem if one is explicitly defined on the provided element;
     * otherwise creates a design system defined directly on the element.
     * @param element - The element to get or create a design system for.
     * @returns The design system.
     * @public
     */
    getOrCreate(node) {
        if (!node) {
            if (rootDesignSystem === null) {
                rootDesignSystem = _di_di_js__WEBPACK_IMPORTED_MODULE_0__.DI.getOrCreateDOMContainer().get(designSystemKey);
            }
            return rootDesignSystem;
        }
        const owned = node.$$designSystem$$;
        if (owned) {
            return owned;
        }
        const container = _di_di_js__WEBPACK_IMPORTED_MODULE_0__.DI.getOrCreateDOMContainer(node);
        if (container.has(designSystemKey, false)) {
            return container.get(designSystemKey);
        }
        else {
            const system = new DefaultDesignSystem(node, container);
            container.register(_di_di_js__WEBPACK_IMPORTED_MODULE_0__.Registration.instance(designSystemKey, system));
            return system;
        }
    },
});
function extractTryDefineElementParams(params, elementDefinitionType, elementDefinitionCallback) {
    if (typeof params === "string") {
        return {
            name: params,
            type: elementDefinitionType,
            callback: elementDefinitionCallback,
        };
    }
    else {
        return params;
    }
}
class DefaultDesignSystem {
    constructor(owner, container) {
        this.owner = owner;
        this.container = container;
        this.designTokensInitialized = false;
        this.prefix = "fast";
        this.shadowRootMode = undefined;
        this.disambiguate = () => ElementDisambiguation.definitionCallbackOnly;
        if (owner !== null) {
            owner.$$designSystem$$ = this;
        }
    }
    withPrefix(prefix) {
        this.prefix = prefix;
        return this;
    }
    withShadowRootMode(mode) {
        this.shadowRootMode = mode;
        return this;
    }
    withElementDisambiguation(callback) {
        this.disambiguate = callback;
        return this;
    }
    withDesignTokenRoot(root) {
        this.designTokenRoot = root;
        return this;
    }
    register(...registrations) {
        const container = this.container;
        const elementDefinitionEntries = [];
        const disambiguate = this.disambiguate;
        const shadowRootMode = this.shadowRootMode;
        const context = {
            elementPrefix: this.prefix,
            tryDefineElement(params, elementDefinitionType, elementDefinitionCallback) {
                const extractedParams = extractTryDefineElementParams(params, elementDefinitionType, elementDefinitionCallback);
                const { name, callback, baseClass } = extractedParams;
                let { type } = extractedParams;
                let elementName = name;
                let typeFoundByName = elementTypesByTag.get(elementName);
                let needsDefine = true;
                while (typeFoundByName) {
                    const result = disambiguate(elementName, type, typeFoundByName);
                    switch (result) {
                        case ElementDisambiguation.ignoreDuplicate:
                            return;
                        case ElementDisambiguation.definitionCallbackOnly:
                            needsDefine = false;
                            typeFoundByName = void 0;
                            break;
                        default:
                            elementName = result;
                            typeFoundByName = elementTypesByTag.get(elementName);
                            break;
                    }
                }
                if (needsDefine) {
                    if (elementTagsByType.has(type) || type === _foundation_element_foundation_element_js__WEBPACK_IMPORTED_MODULE_1__.FoundationElement) {
                        type = class extends type {
                        };
                    }
                    elementTypesByTag.set(elementName, type);
                    elementTagsByType.set(type, elementName);
                    if (baseClass) {
                        elementTagsByType.set(baseClass, elementName);
                    }
                }
                elementDefinitionEntries.push(new ElementDefinitionEntry(container, elementName, type, shadowRootMode, callback, needsDefine));
            },
        };
        if (!this.designTokensInitialized) {
            this.designTokensInitialized = true;
            if (this.designTokenRoot !== null) {
                _design_token_design_token_js__WEBPACK_IMPORTED_MODULE_2__.DesignToken.registerRoot(this.designTokenRoot);
            }
        }
        container.registerWithContext(context, ...registrations);
        for (const entry of elementDefinitionEntries) {
            entry.callback(entry);
            if (entry.willDefine && entry.definition !== null) {
                entry.definition.define();
            }
        }
        return this;
    }
}
class ElementDefinitionEntry {
    constructor(container, name, type, shadowRootMode, callback, willDefine) {
        this.container = container;
        this.name = name;
        this.type = type;
        this.shadowRootMode = shadowRootMode;
        this.callback = callback;
        this.willDefine = willDefine;
        this.definition = null;
    }
    definePresentation(presentation) {
        _component_presentation_js__WEBPACK_IMPORTED_MODULE_3__.ComponentPresentation.define(this.name, presentation, this.container);
    }
    defineElement(definition) {
        this.definition = new _microsoft_fast_element__WEBPACK_IMPORTED_MODULE_4__.FASTElementDefinition(this.type, Object.assign(Object.assign({}, definition), { name: this.name }));
    }
    tagFor(type) {
        return DesignSystem.tagFor(type);
    }
}
/* eslint-enable @typescript-eslint/no-non-null-assertion */


/***/ }),

/***/ "./node_modules/@microsoft/fast-foundation/dist/esm/design-token/custom-property-manager.js":
/*!**************************************************************************************************!*\
  !*** ./node_modules/@microsoft/fast-foundation/dist/esm/design-token/custom-property-manager.js ***!
  \**************************************************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "PropertyTargetManager": () => (/* binding */ PropertyTargetManager),
/* harmony export */   "RootStyleSheetTarget": () => (/* binding */ RootStyleSheetTarget),
/* harmony export */   "defaultElement": () => (/* binding */ defaultElement)
/* harmony export */ });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! tslib */ "./node_modules/tslib/tslib.es6.js");
/* harmony import */ var _microsoft_fast_element__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @microsoft/fast-element */ "./node_modules/@microsoft/fast-element/dist/esm/components/fast-element.js");
/* harmony import */ var _microsoft_fast_element__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @microsoft/fast-element */ "./node_modules/@microsoft/fast-element/dist/esm/dom.js");
/* harmony import */ var _microsoft_fast_element__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @microsoft/fast-element */ "./node_modules/@microsoft/fast-element/dist/esm/styles/element-styles.js");
/* harmony import */ var _microsoft_fast_element__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @microsoft/fast-element */ "./node_modules/@microsoft/fast-element/dist/esm/observation/observable.js");


const defaultElement = document.createElement("div");
function isFastElement(element) {
    return element instanceof _microsoft_fast_element__WEBPACK_IMPORTED_MODULE_0__.FASTElement;
}
class QueuedStyleSheetTarget {
    setProperty(name, value) {
        _microsoft_fast_element__WEBPACK_IMPORTED_MODULE_1__.DOM.queueUpdate(() => this.target.setProperty(name, value));
    }
    removeProperty(name) {
        _microsoft_fast_element__WEBPACK_IMPORTED_MODULE_1__.DOM.queueUpdate(() => this.target.removeProperty(name));
    }
}
/**
 * Handles setting properties for a FASTElement using Constructable Stylesheets
 */
class ConstructableStyleSheetTarget extends QueuedStyleSheetTarget {
    constructor(source) {
        super();
        const sheet = new CSSStyleSheet();
        this.target = sheet.cssRules[sheet.insertRule(":host{}")].style;
        source.$fastController.addStyles(_microsoft_fast_element__WEBPACK_IMPORTED_MODULE_2__.ElementStyles.create([sheet]));
    }
}
class DocumentStyleSheetTarget extends QueuedStyleSheetTarget {
    constructor() {
        super();
        const sheet = new CSSStyleSheet();
        this.target = sheet.cssRules[sheet.insertRule(":root{}")].style;
        document.adoptedStyleSheets = [
            ...document.adoptedStyleSheets,
            sheet,
        ];
    }
}
class HeadStyleElementStyleSheetTarget extends QueuedStyleSheetTarget {
    constructor() {
        super();
        this.style = document.createElement("style");
        document.head.appendChild(this.style);
        const { sheet } = this.style;
        // Because the HTMLStyleElement has been appended,
        // there shouldn't exist a case where `sheet` is null,
        // but if-check it just in case.
        if (sheet) {
            // https://github.com/jsdom/jsdom uses https://github.com/NV/CSSOM for it's CSSOM implementation,
            // which implements the DOM Level 2 spec for CSSStyleSheet where insertRule() requires an index argument.
            const index = sheet.insertRule(":root{}", sheet.cssRules.length);
            this.target = sheet.cssRules[index].style;
        }
    }
}
/**
 * Handles setting properties for a FASTElement using an HTMLStyleElement
 */
class StyleElementStyleSheetTarget {
    constructor(target) {
        this.store = new Map();
        this.target = null;
        const controller = target.$fastController;
        this.style = document.createElement("style");
        controller.addStyles(this.style);
        _microsoft_fast_element__WEBPACK_IMPORTED_MODULE_3__.Observable.getNotifier(controller).subscribe(this, "isConnected");
        this.handleChange(controller, "isConnected");
    }
    targetChanged() {
        if (this.target !== null) {
            for (const [key, value] of this.store.entries()) {
                this.target.setProperty(key, value);
            }
        }
    }
    setProperty(name, value) {
        this.store.set(name, value);
        _microsoft_fast_element__WEBPACK_IMPORTED_MODULE_1__.DOM.queueUpdate(() => {
            if (this.target !== null) {
                this.target.setProperty(name, value);
            }
        });
    }
    removeProperty(name) {
        this.store.delete(name);
        _microsoft_fast_element__WEBPACK_IMPORTED_MODULE_1__.DOM.queueUpdate(() => {
            if (this.target !== null) {
                this.target.removeProperty(name);
            }
        });
    }
    handleChange(source, key) {
        // HTMLStyleElement.sheet is null if the element isn't connected to the DOM,
        // so this method reacts to changes in DOM connection for the element hosting
        // the HTMLStyleElement.
        //
        // All rules applied via the CSSOM also get cleared when the element disconnects,
        // so we need to add a new rule each time and populate it with the stored properties
        const { sheet } = this.style;
        if (sheet) {
            // Safari will throw if we try to use the return result of insertRule()
            // to index the rule inline, so store as a const prior to indexing.
            // https://github.com/jsdom/jsdom uses https://github.com/NV/CSSOM for it's CSSOM implementation,
            // which implements the DOM Level 2 spec for CSSStyleSheet where insertRule() requires an index argument.
            const index = sheet.insertRule(":host{}", sheet.cssRules.length);
            this.target = sheet.cssRules[index].style;
        }
        else {
            this.target = null;
        }
    }
}
(0,tslib__WEBPACK_IMPORTED_MODULE_4__.__decorate)([
    _microsoft_fast_element__WEBPACK_IMPORTED_MODULE_3__.observable
], StyleElementStyleSheetTarget.prototype, "target", void 0);
/**
 * Handles setting properties for a normal HTMLElement
 */
class ElementStyleSheetTarget {
    constructor(source) {
        this.target = source.style;
    }
    setProperty(name, value) {
        _microsoft_fast_element__WEBPACK_IMPORTED_MODULE_1__.DOM.queueUpdate(() => this.target.setProperty(name, value));
    }
    removeProperty(name) {
        _microsoft_fast_element__WEBPACK_IMPORTED_MODULE_1__.DOM.queueUpdate(() => this.target.removeProperty(name));
    }
}
/**
 * Controls emission for default values. This control is capable
 * of emitting to multiple {@link PropertyTarget | PropertyTargets},
 * and only emits if it has at least one root.
 *
 * @internal
 */
class RootStyleSheetTarget {
    setProperty(name, value) {
        RootStyleSheetTarget.properties[name] = value;
        for (const target of RootStyleSheetTarget.roots.values()) {
            PropertyTargetManager.getOrCreate(RootStyleSheetTarget.normalizeRoot(target)).setProperty(name, value);
        }
    }
    removeProperty(name) {
        delete RootStyleSheetTarget.properties[name];
        for (const target of RootStyleSheetTarget.roots.values()) {
            PropertyTargetManager.getOrCreate(RootStyleSheetTarget.normalizeRoot(target)).removeProperty(name);
        }
    }
    static registerRoot(root) {
        const { roots } = RootStyleSheetTarget;
        if (!roots.has(root)) {
            roots.add(root);
            const target = PropertyTargetManager.getOrCreate(this.normalizeRoot(root));
            for (const key in RootStyleSheetTarget.properties) {
                target.setProperty(key, RootStyleSheetTarget.properties[key]);
            }
        }
    }
    static unregisterRoot(root) {
        const { roots } = RootStyleSheetTarget;
        if (roots.has(root)) {
            roots.delete(root);
            const target = PropertyTargetManager.getOrCreate(RootStyleSheetTarget.normalizeRoot(root));
            for (const key in RootStyleSheetTarget.properties) {
                target.removeProperty(key);
            }
        }
    }
    /**
     * Returns the document when provided the default element,
     * otherwise is a no-op
     * @param root - the root to normalize
     */
    static normalizeRoot(root) {
        return root === defaultElement ? document : root;
    }
}
RootStyleSheetTarget.roots = new Set();
RootStyleSheetTarget.properties = {};
// Caches PropertyTarget instances
const propertyTargetCache = new WeakMap();
// Use Constructable StyleSheets for FAST elements when supported, otherwise use
// HTMLStyleElement instances
const propertyTargetCtor = _microsoft_fast_element__WEBPACK_IMPORTED_MODULE_1__.DOM.supportsAdoptedStyleSheets
    ? ConstructableStyleSheetTarget
    : StyleElementStyleSheetTarget;
/**
 * Manages creation and caching of PropertyTarget instances.
 *
 * @internal
 */
const PropertyTargetManager = Object.freeze({
    getOrCreate(source) {
        if (propertyTargetCache.has(source)) {
            /* eslint-disable-next-line @typescript-eslint/no-non-null-assertion */
            return propertyTargetCache.get(source);
        }
        let target;
        if (source === defaultElement) {
            target = new RootStyleSheetTarget();
        }
        else if (source instanceof Document) {
            target = _microsoft_fast_element__WEBPACK_IMPORTED_MODULE_1__.DOM.supportsAdoptedStyleSheets
                ? new DocumentStyleSheetTarget()
                : new HeadStyleElementStyleSheetTarget();
        }
        else if (isFastElement(source)) {
            target = new propertyTargetCtor(source);
        }
        else {
            target = new ElementStyleSheetTarget(source);
        }
        propertyTargetCache.set(source, target);
        return target;
    },
});


/***/ }),

/***/ "./node_modules/@microsoft/fast-foundation/dist/esm/design-token/design-token.js":
/*!***************************************************************************************!*\
  !*** ./node_modules/@microsoft/fast-foundation/dist/esm/design-token/design-token.js ***!
  \***************************************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "DesignToken": () => (/* binding */ DesignToken)
/* harmony export */ });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! tslib */ "./node_modules/tslib/tslib.es6.js");
/* harmony import */ var _microsoft_fast_element__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @microsoft/fast-element */ "./node_modules/@microsoft/fast-element/dist/esm/styles/css-directive.js");
/* harmony import */ var _microsoft_fast_element__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @microsoft/fast-element */ "./node_modules/@microsoft/fast-element/dist/esm/observation/observable.js");
/* harmony import */ var _microsoft_fast_element__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @microsoft/fast-element */ "./node_modules/@microsoft/fast-element/dist/esm/components/fast-element.js");
/* harmony import */ var _utilities_composed_parent_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../utilities/composed-parent.js */ "./node_modules/@microsoft/fast-foundation/dist/esm/utilities/composed-parent.js");
/* harmony import */ var _utilities_composed_contains_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../utilities/composed-contains.js */ "./node_modules/@microsoft/fast-foundation/dist/esm/utilities/composed-contains.js");
/* harmony import */ var _custom_property_manager_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./custom-property-manager.js */ "./node_modules/@microsoft/fast-foundation/dist/esm/design-token/custom-property-manager.js");






/**
 * Implementation of {@link (DesignToken:interface)}
 */
class DesignTokenImpl extends _microsoft_fast_element__WEBPACK_IMPORTED_MODULE_0__.CSSDirective {
    constructor(configuration) {
        super();
        this.subscribers = new WeakMap();
        this._appliedTo = new Set();
        this.name = configuration.name;
        if (configuration.cssCustomPropertyName !== null) {
            this.cssCustomProperty = `--${configuration.cssCustomPropertyName}`;
            this.cssVar = `var(${this.cssCustomProperty})`;
        }
        this.id = DesignTokenImpl.uniqueId();
        DesignTokenImpl.tokensById.set(this.id, this);
    }
    get appliedTo() {
        return [...this._appliedTo];
    }
    static from(nameOrConfig) {
        return new DesignTokenImpl({
            name: typeof nameOrConfig === "string" ? nameOrConfig : nameOrConfig.name,
            cssCustomPropertyName: typeof nameOrConfig === "string"
                ? nameOrConfig
                : nameOrConfig.cssCustomPropertyName === void 0
                    ? nameOrConfig.name
                    : nameOrConfig.cssCustomPropertyName,
        });
    }
    static isCSSDesignToken(token) {
        return typeof token.cssCustomProperty === "string";
    }
    static isDerivedDesignTokenValue(value) {
        return typeof value === "function";
    }
    /**
     * Gets a token by ID. Returns undefined if the token was not found.
     * @param id - The ID of the token
     * @returns
     */
    static getTokenById(id) {
        return DesignTokenImpl.tokensById.get(id);
    }
    getOrCreateSubscriberSet(target = this) {
        return (this.subscribers.get(target) ||
            (this.subscribers.set(target, new Set()) && this.subscribers.get(target)));
    }
    createCSS() {
        return this.cssVar || "";
    }
    getValueFor(element) {
        const value = DesignTokenNode.getOrCreate(element).get(this);
        if (value !== undefined) {
            return value;
        }
        throw new Error(`Value could not be retrieved for token named "${this.name}". Ensure the value is set for ${element} or an ancestor of ${element}.`);
    }
    setValueFor(element, value) {
        this._appliedTo.add(element);
        if (value instanceof DesignTokenImpl) {
            value = this.alias(value);
        }
        DesignTokenNode.getOrCreate(element).set(this, value);
        return this;
    }
    deleteValueFor(element) {
        this._appliedTo.delete(element);
        if (DesignTokenNode.existsFor(element)) {
            DesignTokenNode.getOrCreate(element).delete(this);
        }
        return this;
    }
    withDefault(value) {
        this.setValueFor(_custom_property_manager_js__WEBPACK_IMPORTED_MODULE_1__.defaultElement, value);
        return this;
    }
    subscribe(subscriber, target) {
        const subscriberSet = this.getOrCreateSubscriberSet(target);
        if (target && !DesignTokenNode.existsFor(target)) {
            DesignTokenNode.getOrCreate(target);
        }
        if (!subscriberSet.has(subscriber)) {
            subscriberSet.add(subscriber);
        }
    }
    unsubscribe(subscriber, target) {
        const list = this.subscribers.get(target || this);
        if (list && list.has(subscriber)) {
            list.delete(subscriber);
        }
    }
    /**
     * Notifies subscribers that the value for an element has changed.
     * @param element - The element to emit a notification for
     */
    notify(element) {
        const record = Object.freeze({ token: this, target: element });
        if (this.subscribers.has(this)) {
            this.subscribers.get(this).forEach(sub => sub.handleChange(record));
        }
        if (this.subscribers.has(element)) {
            this.subscribers.get(element).forEach(sub => sub.handleChange(record));
        }
    }
    /**
     * Alias the token to the provided token.
     * @param token - the token to alias to
     */
    alias(token) {
        return ((target) => token.getValueFor(target));
    }
}
DesignTokenImpl.uniqueId = (() => {
    let id = 0;
    return () => {
        id++;
        return id.toString(16);
    };
})();
/**
 * Token storage by token ID
 */
DesignTokenImpl.tokensById = new Map();
class CustomPropertyReflector {
    startReflection(token, target) {
        token.subscribe(this, target);
        this.handleChange({ token, target });
    }
    stopReflection(token, target) {
        token.unsubscribe(this, target);
        this.remove(token, target);
    }
    handleChange(record) {
        const { token, target } = record;
        this.add(token, target);
    }
    add(token, target) {
        _custom_property_manager_js__WEBPACK_IMPORTED_MODULE_1__.PropertyTargetManager.getOrCreate(target).setProperty(token.cssCustomProperty, this.resolveCSSValue(DesignTokenNode.getOrCreate(target).get(token)));
    }
    remove(token, target) {
        _custom_property_manager_js__WEBPACK_IMPORTED_MODULE_1__.PropertyTargetManager.getOrCreate(target).removeProperty(token.cssCustomProperty);
    }
    resolveCSSValue(value) {
        return value && typeof value.createCSS === "function" ? value.createCSS() : value;
    }
}
/**
 * A light wrapper around BindingObserver to handle value caching and
 * token notification
 */
class DesignTokenBindingObserver {
    constructor(source, token, node) {
        this.source = source;
        this.token = token;
        this.node = node;
        this.dependencies = new Set();
        this.observer = _microsoft_fast_element__WEBPACK_IMPORTED_MODULE_2__.Observable.binding(source, this, false);
        // This is a little bit hacky because it's using internal APIs of BindingObserverImpl.
        // BindingObserverImpl queues updates to batch it's notifications which doesn't work for this
        // scenario because the DesignToken.getValueFor API is not async. Without this, using DesignToken.getValueFor()
        // after DesignToken.setValueFor() when setting a dependency of the value being retrieved can return a stale
        // value. Assigning .handleChange to .call forces immediate invocation of this classes handleChange() method,
        // allowing resolution of values synchronously.
        // TODO: https://github.com/microsoft/fast/issues/5110
        this.observer.handleChange = this.observer.call;
        this.handleChange();
    }
    disconnect() {
        this.observer.disconnect();
    }
    /**
     * @internal
     */
    handleChange() {
        this.node.store.set(this.token, this.observer.observe(this.node.target, _microsoft_fast_element__WEBPACK_IMPORTED_MODULE_2__.defaultExecutionContext));
    }
}
/**
 * Stores resolved token/value pairs and notifies on changes
 */
class Store {
    constructor() {
        this.values = new Map();
    }
    set(token, value) {
        if (this.values.get(token) !== value) {
            this.values.set(token, value);
            _microsoft_fast_element__WEBPACK_IMPORTED_MODULE_2__.Observable.getNotifier(this).notify(token.id);
        }
    }
    get(token) {
        _microsoft_fast_element__WEBPACK_IMPORTED_MODULE_2__.Observable.track(this, token.id);
        return this.values.get(token);
    }
    delete(token) {
        this.values.delete(token);
    }
    all() {
        return this.values.entries();
    }
}
const nodeCache = new WeakMap();
const childToParent = new WeakMap();
/**
 * A node responsible for setting and getting token values,
 * emitting values to CSS custom properties, and maintaining
 * inheritance structures.
 */
class DesignTokenNode {
    constructor(target) {
        this.target = target;
        /**
         * Stores all resolved token values for a node
         */
        this.store = new Store();
        /**
         * All children assigned to the node
         */
        this.children = [];
        /**
         * All values explicitly assigned to the node in their raw form
         */
        this.assignedValues = new Map();
        /**
         * Tokens currently being reflected to CSS custom properties
         */
        this.reflecting = new Set();
        /**
         * Binding observers for assigned and inherited derived values.
         */
        this.bindingObservers = new Map();
        /**
         * Emits notifications to token when token values
         * change the DesignTokenNode
         */
        this.tokenValueChangeHandler = {
            handleChange: (source, arg) => {
                const token = DesignTokenImpl.getTokenById(arg);
                if (token) {
                    // Notify any token subscribers
                    token.notify(this.target);
                    if (DesignTokenImpl.isCSSDesignToken(token)) {
                        const parent = this.parent;
                        const reflecting = this.isReflecting(token);
                        if (parent) {
                            const parentValue = parent.get(token);
                            const sourceValue = source.get(token);
                            if (parentValue !== sourceValue && !reflecting) {
                                this.reflectToCSS(token);
                            }
                            else if (parentValue === sourceValue && reflecting) {
                                this.stopReflectToCSS(token);
                            }
                        }
                        else if (!reflecting) {
                            this.reflectToCSS(token);
                        }
                    }
                }
            },
        };
        nodeCache.set(target, this);
        // Map store change notifications to token change notifications
        _microsoft_fast_element__WEBPACK_IMPORTED_MODULE_2__.Observable.getNotifier(this.store).subscribe(this.tokenValueChangeHandler);
        if (target instanceof _microsoft_fast_element__WEBPACK_IMPORTED_MODULE_3__.FASTElement) {
            target.$fastController.addBehaviors([this]);
        }
        else if (target.isConnected) {
            this.bind();
        }
    }
    /**
     * Returns a DesignTokenNode for an element.
     * Creates a new instance if one does not already exist for a node,
     * otherwise returns the cached instance
     *
     * @param target - The HTML element to retrieve a DesignTokenNode for
     */
    static getOrCreate(target) {
        return nodeCache.get(target) || new DesignTokenNode(target);
    }
    /**
     * Determines if a DesignTokenNode has been created for a target
     * @param target - The element to test
     */
    static existsFor(target) {
        return nodeCache.has(target);
    }
    /**
     * Searches for and return the nearest parent DesignTokenNode.
     * Null is returned if no node is found or the node provided is for a default element.
     */
    static findParent(node) {
        if (!(_custom_property_manager_js__WEBPACK_IMPORTED_MODULE_1__.defaultElement === node.target)) {
            let parent = (0,_utilities_composed_parent_js__WEBPACK_IMPORTED_MODULE_4__.composedParent)(node.target);
            while (parent !== null) {
                if (nodeCache.has(parent)) {
                    return nodeCache.get(parent);
                }
                parent = (0,_utilities_composed_parent_js__WEBPACK_IMPORTED_MODULE_4__.composedParent)(parent);
            }
            return DesignTokenNode.getOrCreate(_custom_property_manager_js__WEBPACK_IMPORTED_MODULE_1__.defaultElement);
        }
        return null;
    }
    /**
     * Finds the closest node with a value explicitly assigned for a token, otherwise null.
     * @param token - The token to look for
     * @param start - The node to start looking for value assignment
     * @returns
     */
    static findClosestAssignedNode(token, start) {
        let current = start;
        do {
            if (current.has(token)) {
                return current;
            }
            current = current.parent
                ? current.parent
                : current.target !== _custom_property_manager_js__WEBPACK_IMPORTED_MODULE_1__.defaultElement
                    ? DesignTokenNode.getOrCreate(_custom_property_manager_js__WEBPACK_IMPORTED_MODULE_1__.defaultElement)
                    : null;
        } while (current !== null);
        return null;
    }
    /**
     * The parent DesignTokenNode, or null.
     */
    get parent() {
        return childToParent.get(this) || null;
    }
    /**
     * Checks if a token has been assigned an explicit value the node.
     * @param token - the token to check.
     */
    has(token) {
        return this.assignedValues.has(token);
    }
    /**
     * Gets the value of a token for a node
     * @param token - The token to retrieve the value for
     * @returns
     */
    get(token) {
        const value = this.store.get(token);
        if (value !== undefined) {
            return value;
        }
        const raw = this.getRaw(token);
        if (raw !== undefined) {
            this.hydrate(token, raw);
            return this.get(token);
        }
    }
    /**
     * Retrieves the raw assigned value of a token from the nearest assigned node.
     * @param token - The token to retrieve a raw value for
     * @returns
     */
    getRaw(token) {
        var _a;
        if (this.assignedValues.has(token)) {
            return this.assignedValues.get(token);
        }
        return (_a = DesignTokenNode.findClosestAssignedNode(token, this)) === null || _a === void 0 ? void 0 : _a.getRaw(token);
    }
    /**
     * Sets a token to a value for a node
     * @param token - The token to set
     * @param value - The value to set the token to
     */
    set(token, value) {
        if (DesignTokenImpl.isDerivedDesignTokenValue(this.assignedValues.get(token))) {
            this.tearDownBindingObserver(token);
        }
        this.assignedValues.set(token, value);
        if (DesignTokenImpl.isDerivedDesignTokenValue(value)) {
            this.setupBindingObserver(token, value);
        }
        else {
            this.store.set(token, value);
        }
    }
    /**
     * Deletes a token value for the node.
     * @param token - The token to delete the value for
     */
    delete(token) {
        this.assignedValues.delete(token);
        this.tearDownBindingObserver(token);
        const upstream = this.getRaw(token);
        if (upstream) {
            this.hydrate(token, upstream);
        }
        else {
            this.store.delete(token);
        }
    }
    /**
     * Invoked when the DesignTokenNode.target is attached to the document
     */
    bind() {
        const parent = DesignTokenNode.findParent(this);
        if (parent) {
            parent.appendChild(this);
        }
        for (const key of this.assignedValues.keys()) {
            key.notify(this.target);
        }
    }
    /**
     * Invoked when the DesignTokenNode.target is detached from the document
     */
    unbind() {
        if (this.parent) {
            const parent = childToParent.get(this);
            parent.removeChild(this);
        }
    }
    /**
     * Appends a child to a parent DesignTokenNode.
     * @param child - The child to append to the node
     */
    appendChild(child) {
        if (child.parent) {
            childToParent.get(child).removeChild(child);
        }
        const reParent = this.children.filter(x => child.contains(x));
        childToParent.set(child, this);
        this.children.push(child);
        reParent.forEach(x => child.appendChild(x));
        _microsoft_fast_element__WEBPACK_IMPORTED_MODULE_2__.Observable.getNotifier(this.store).subscribe(child);
        // How can we not notify *every* subscriber?
        for (const [token, value] of this.store.all()) {
            child.hydrate(token, this.bindingObservers.has(token) ? this.getRaw(token) : value);
        }
    }
    /**
     * Removes a child from a node.
     * @param child - The child to remove.
     */
    removeChild(child) {
        const childIndex = this.children.indexOf(child);
        if (childIndex !== -1) {
            this.children.splice(childIndex, 1);
        }
        _microsoft_fast_element__WEBPACK_IMPORTED_MODULE_2__.Observable.getNotifier(this.store).unsubscribe(child);
        return child.parent === this ? childToParent.delete(child) : false;
    }
    /**
     * Tests whether a provided node is contained by
     * the calling node.
     * @param test - The node to test
     */
    contains(test) {
        return (0,_utilities_composed_contains_js__WEBPACK_IMPORTED_MODULE_5__.composedContains)(this.target, test.target);
    }
    /**
     * Instructs the node to reflect a design token for the provided token.
     * @param token - The design token to reflect
     */
    reflectToCSS(token) {
        if (!this.isReflecting(token)) {
            this.reflecting.add(token);
            DesignTokenNode.cssCustomPropertyReflector.startReflection(token, this.target);
        }
    }
    /**
     * Stops reflecting a DesignToken to CSS
     * @param token - The design token to stop reflecting
     */
    stopReflectToCSS(token) {
        if (this.isReflecting(token)) {
            this.reflecting.delete(token);
            DesignTokenNode.cssCustomPropertyReflector.stopReflection(token, this.target);
        }
    }
    /**
     * Determines if a token is being reflected to CSS for a node.
     * @param token - The token to check for reflection
     * @returns
     */
    isReflecting(token) {
        return this.reflecting.has(token);
    }
    /**
     * Handle changes to upstream tokens
     * @param source - The parent DesignTokenNode
     * @param property - The token ID that changed
     */
    handleChange(source, property) {
        const token = DesignTokenImpl.getTokenById(property);
        if (!token) {
            return;
        }
        this.hydrate(token, this.getRaw(token));
    }
    /**
     * Hydrates a token with a DesignTokenValue, making retrieval available.
     * @param token - The token to hydrate
     * @param value - The value to hydrate
     */
    hydrate(token, value) {
        if (!this.has(token)) {
            const observer = this.bindingObservers.get(token);
            if (DesignTokenImpl.isDerivedDesignTokenValue(value)) {
                if (observer) {
                    // If the binding source doesn't match, we need
                    // to update the binding
                    if (observer.source !== value) {
                        this.tearDownBindingObserver(token);
                        this.setupBindingObserver(token, value);
                    }
                }
                else {
                    this.setupBindingObserver(token, value);
                }
            }
            else {
                if (observer) {
                    this.tearDownBindingObserver(token);
                }
                this.store.set(token, value);
            }
        }
    }
    /**
     * Sets up a binding observer for a derived token value that notifies token
     * subscribers on change.
     *
     * @param token - The token to notify when the binding updates
     * @param source - The binding source
     */
    setupBindingObserver(token, source) {
        const binding = new DesignTokenBindingObserver(source, token, this);
        this.bindingObservers.set(token, binding);
        return binding;
    }
    /**
     * Tear down a binding observer for a token.
     */
    tearDownBindingObserver(token) {
        if (this.bindingObservers.has(token)) {
            this.bindingObservers.get(token).disconnect();
            this.bindingObservers.delete(token);
            return true;
        }
        return false;
    }
}
/**
 * Responsible for reflecting tokens to CSS custom properties
 */
DesignTokenNode.cssCustomPropertyReflector = new CustomPropertyReflector();
(0,tslib__WEBPACK_IMPORTED_MODULE_6__.__decorate)([
    _microsoft_fast_element__WEBPACK_IMPORTED_MODULE_2__.observable
], DesignTokenNode.prototype, "children", void 0);
function create(nameOrConfig) {
    return DesignTokenImpl.from(nameOrConfig);
}
/* eslint-enable @typescript-eslint/no-unused-vars */
/**
 * Factory object for creating {@link (DesignToken:interface)} instances.
 * @public
 */
const DesignToken = Object.freeze({
    create,
    /**
     * Informs DesignToken that an HTMLElement for which tokens have
     * been set has been connected to the document.
     *
     * The browser does not provide a reliable mechanism to observe an HTMLElement's connectedness
     * in all scenarios, so invoking this method manually is necessary when:
     *
     * 1. Token values are set for an HTMLElement.
     * 2. The HTMLElement does not inherit from FASTElement.
     * 3. The HTMLElement is not connected to the document when token values are set.
     *
     * @param element - The element to notify
     * @returns - true if notification was successful, otherwise false.
     */
    notifyConnection(element) {
        if (!element.isConnected || !DesignTokenNode.existsFor(element)) {
            return false;
        }
        DesignTokenNode.getOrCreate(element).bind();
        return true;
    },
    /**
     * Informs DesignToken that an HTMLElement for which tokens have
     * been set has been disconnected to the document.
     *
     * The browser does not provide a reliable mechanism to observe an HTMLElement's connectedness
     * in all scenarios, so invoking this method manually is necessary when:
     *
     * 1. Token values are set for an HTMLElement.
     * 2. The HTMLElement does not inherit from FASTElement.
     *
     * @param element - The element to notify
     * @returns - true if notification was successful, otherwise false.
     */
    notifyDisconnection(element) {
        if (element.isConnected || !DesignTokenNode.existsFor(element)) {
            return false;
        }
        DesignTokenNode.getOrCreate(element).unbind();
        return true;
    },
    /**
     * Registers and element or document as a DesignToken root.
     * {@link CSSDesignToken | CSSDesignTokens} with default values assigned via
     * {@link (DesignToken:interface).withDefault} will emit CSS custom properties to all
     * registered roots.
     * @param target - The root to register
     */
    registerRoot(target = _custom_property_manager_js__WEBPACK_IMPORTED_MODULE_1__.defaultElement) {
        _custom_property_manager_js__WEBPACK_IMPORTED_MODULE_1__.RootStyleSheetTarget.registerRoot(target);
    },
    /**
     * Unregister an element or document as a DesignToken root.
     * @param target - The root to deregister
     */
    unregisterRoot(target = _custom_property_manager_js__WEBPACK_IMPORTED_MODULE_1__.defaultElement) {
        _custom_property_manager_js__WEBPACK_IMPORTED_MODULE_1__.RootStyleSheetTarget.unregisterRoot(target);
    },
});
/* eslint-enable @typescript-eslint/no-non-null-assertion */


/***/ }),

/***/ "./node_modules/@microsoft/fast-foundation/dist/esm/di/di.js":
/*!*******************************************************************!*\
  !*** ./node_modules/@microsoft/fast-foundation/dist/esm/di/di.js ***!
  \*******************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "Container": () => (/* binding */ Container),
/* harmony export */   "ContainerConfiguration": () => (/* binding */ ContainerConfiguration),
/* harmony export */   "ContainerImpl": () => (/* binding */ ContainerImpl),
/* harmony export */   "DI": () => (/* binding */ DI),
/* harmony export */   "DefaultResolver": () => (/* binding */ DefaultResolver),
/* harmony export */   "FactoryImpl": () => (/* binding */ FactoryImpl),
/* harmony export */   "Registration": () => (/* binding */ Registration),
/* harmony export */   "ResolverBuilder": () => (/* binding */ ResolverBuilder),
/* harmony export */   "ResolverImpl": () => (/* binding */ ResolverImpl),
/* harmony export */   "ServiceLocator": () => (/* binding */ ServiceLocator),
/* harmony export */   "all": () => (/* binding */ all),
/* harmony export */   "ignore": () => (/* binding */ ignore),
/* harmony export */   "inject": () => (/* binding */ inject),
/* harmony export */   "lazy": () => (/* binding */ lazy),
/* harmony export */   "newInstanceForScope": () => (/* binding */ newInstanceForScope),
/* harmony export */   "newInstanceOf": () => (/* binding */ newInstanceOf),
/* harmony export */   "optional": () => (/* binding */ optional),
/* harmony export */   "singleton": () => (/* binding */ singleton),
/* harmony export */   "transient": () => (/* binding */ transient),
/* harmony export */   "validateKey": () => (/* binding */ validateKey)
/* harmony export */ });
/* harmony import */ var _microsoft_fast_element__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @microsoft/fast-element */ "./node_modules/@microsoft/fast-element/dist/esm/components/fast-element.js");
/* harmony import */ var _microsoft_fast_element__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @microsoft/fast-element */ "./node_modules/@microsoft/fast-element/dist/esm/platform.js");
/**
 * Big thanks to https://github.com/fkleuver and the https://github.com/aurelia/aurelia project
 * for the bulk of this code and many of the associated tests.
 */

// Tiny polyfill for TypeScript's Reflect metadata API.
const metadataByTarget = new Map();
if (!("metadata" in Reflect)) {
    Reflect.metadata = function (key, value) {
        return function (target) {
            Reflect.defineMetadata(key, value, target);
        };
    };
    Reflect.defineMetadata = function (key, value, target) {
        let metadata = metadataByTarget.get(target);
        if (metadata === void 0) {
            metadataByTarget.set(target, (metadata = new Map()));
        }
        metadata.set(key, value);
    };
    Reflect.getOwnMetadata = function (key, target) {
        const metadata = metadataByTarget.get(target);
        if (metadata !== void 0) {
            return metadata.get(key);
        }
        return void 0;
    };
}
/**
 * A utility class used that constructs and registers resolvers for a dependency
 * injection container. Supports a standard set of object lifetimes.
 * @public
 */
class ResolverBuilder {
    /**
     *
     * @param container - The container to create resolvers for.
     * @param key - The key to register resolvers under.
     */
    constructor(container, key) {
        this.container = container;
        this.key = key;
    }
    /**
     * Creates a resolver for an existing object instance.
     * @param value - The instance to resolve.
     * @returns The resolver.
     */
    instance(value) {
        return this.registerResolver(0 /* instance */, value);
    }
    /**
     * Creates a resolver that enforces a singleton lifetime.
     * @param value - The type to create and cache the singleton for.
     * @returns The resolver.
     */
    singleton(value) {
        return this.registerResolver(1 /* singleton */, value);
    }
    /**
     * Creates a resolver that creates a new instance for every dependency request.
     * @param value - The type to create instances of.
     * @returns - The resolver.
     */
    transient(value) {
        return this.registerResolver(2 /* transient */, value);
    }
    /**
     * Creates a resolver that invokes a callback function for every dependency resolution
     * request, allowing custom logic to return the dependency.
     * @param value - The callback to call during resolution.
     * @returns The resolver.
     */
    callback(value) {
        return this.registerResolver(3 /* callback */, value);
    }
    /**
     * Creates a resolver that invokes a callback function the first time that a dependency
     * resolution is requested. The returned value is then cached and provided for all
     * subsequent requests.
     * @param value - The callback to call during the first resolution.
     * @returns The resolver.
     */
    cachedCallback(value) {
        return this.registerResolver(3 /* callback */, cacheCallbackResult(value));
    }
    /**
     * Aliases the current key to a different key.
     * @param destinationKey - The key to point the alias to.
     * @returns The resolver.
     */
    aliasTo(destinationKey) {
        return this.registerResolver(5 /* alias */, destinationKey);
    }
    registerResolver(strategy, state) {
        const { container, key } = this;
        /* eslint-disable-next-line @typescript-eslint/no-non-null-assertion */
        this.container = this.key = (void 0);
        return container.registerResolver(key, new ResolverImpl(key, strategy, state));
    }
}
function cloneArrayWithPossibleProps(source) {
    const clone = source.slice();
    const keys = Object.keys(source);
    const len = keys.length;
    let key;
    for (let i = 0; i < len; ++i) {
        key = keys[i];
        if (!isArrayIndex(key)) {
            clone[key] = source[key];
        }
    }
    return clone;
}
/**
 * A set of default resolvers useful in configuring a container.
 * @public
 */
const DefaultResolver = Object.freeze({
    /**
     * Disables auto-registration and throws for all un-registered dependencies.
     * @param key - The key to create the resolver for.
     */
    none(key) {
        throw Error(`${key.toString()} not registered, did you forget to add @singleton()?`);
    },
    /**
     * Provides default singleton resolution behavior during auto-registration.
     * @param key - The key to create the resolver for.
     * @returns The resolver.
     */
    singleton(key) {
        return new ResolverImpl(key, 1 /* singleton */, key);
    },
    /**
     * Provides default transient resolution behavior during auto-registration.
     * @param key - The key to create the resolver for.
     * @returns The resolver.
     */
    transient(key) {
        return new ResolverImpl(key, 2 /* transient */, key);
    },
});
/**
 * Configuration for a dependency injection container.
 * @public
 */
const ContainerConfiguration = Object.freeze({
    /**
     * The default configuration used when creating a DOM-disconnected container.
     * @remarks
     * The default creates a root container, with no parent container. It does not handle
     * owner requests and it uses singleton resolution behavior for auto-registration.
     */
    default: Object.freeze({
        parentLocator: () => null,
        responsibleForOwnerRequests: false,
        defaultResolver: DefaultResolver.singleton,
    }),
});
const dependencyLookup = new Map();
function getParamTypes(key) {
    return (Type) => {
        return Reflect.getOwnMetadata(key, Type);
    };
}
let rootDOMContainer = null;
/**
 * The gateway to dependency injection APIs.
 * @public
 */
const DI = Object.freeze({
    /**
     * Creates a new dependency injection container.
     * @param config - The configuration for the container.
     * @returns A newly created dependency injection container.
     */
    createContainer(config) {
        return new ContainerImpl(null, Object.assign({}, ContainerConfiguration.default, config));
    },
    /**
     * Finds the dependency injection container responsible for providing dependencies
     * to the specified node.
     * @param node - The node to find the responsible container for.
     * @returns The container responsible for providing dependencies to the node.
     * @remarks
     * This will be the same as the parent container if the specified node
     * does not itself host a container configured with responsibleForOwnerRequests.
     */
    findResponsibleContainer(node) {
        const owned = node.$$container$$;
        if (owned && owned.responsibleForOwnerRequests) {
            return owned;
        }
        return DI.findParentContainer(node);
    },
    /**
     * Find the dependency injection container up the DOM tree from this node.
     * @param node - The node to find the parent container for.
     * @returns The parent container of this node.
     * @remarks
     * This will be the same as the responsible container if the specified node
     * does not itself host a container configured with responsibleForOwnerRequests.
     */
    findParentContainer(node) {
        const event = new CustomEvent(DILocateParentEventType, {
            bubbles: true,
            composed: true,
            cancelable: true,
            detail: { container: void 0 },
        });
        node.dispatchEvent(event);
        return event.detail.container || DI.getOrCreateDOMContainer();
    },
    /**
     * Returns a dependency injection container if one is explicitly owned by the specified
     * node. If one is not owned, then a new container is created and assigned to the node.
     * @param node - The node to find or create the container for.
     * @param config - The configuration for the container if one needs to be created.
     * @returns The located or created container.
     * @remarks
     * This API does not search for a responsible or parent container. It looks only for a container
     * directly defined on the specified node and creates one at that location if one does not
     * already exist.
     */
    getOrCreateDOMContainer(node, config) {
        if (!node) {
            return (rootDOMContainer ||
                (rootDOMContainer = new ContainerImpl(null, Object.assign({}, ContainerConfiguration.default, config, {
                    parentLocator: () => null,
                }))));
        }
        return (node.$$container$$ ||
            new ContainerImpl(node, Object.assign({}, ContainerConfiguration.default, config, {
                parentLocator: DI.findParentContainer,
            })));
    },
    /**
     * Gets the "design:paramtypes" metadata for the specified type.
     * @param Type - The type to get the metadata for.
     * @returns The metadata array or undefined if no metadata is found.
     */
    getDesignParamtypes: getParamTypes("design:paramtypes"),
    /**
     * Gets the "di:paramtypes" metadata for the specified type.
     * @param Type - The type to get the metadata for.
     * @returns The metadata array or undefined if no metadata is found.
     */
    getAnnotationParamtypes: getParamTypes("di:paramtypes"),
    /**
     *
     * @param Type - Gets the "di:paramtypes" metadata for the specified type. If none is found,
     * an empty metadata array is created and added.
     * @returns The metadata array.
     */
    getOrCreateAnnotationParamTypes(Type) {
        let annotationParamtypes = this.getAnnotationParamtypes(Type);
        if (annotationParamtypes === void 0) {
            Reflect.defineMetadata("di:paramtypes", (annotationParamtypes = []), Type);
        }
        return annotationParamtypes;
    },
    /**
     * Gets the dependency keys representing what is needed to instantiate the specified type.
     * @param Type - The type to get the dependencies for.
     * @returns An array of dependency keys.
     */
    getDependencies(Type) {
        // Note: Every detail of this getDependencies method is pretty deliberate at the moment, and probably not yet 100% tested from every possible angle,
        // so be careful with making changes here as it can have a huge impact on complex end user apps.
        // Preferably, only make changes to the dependency resolution process via a RFC.
        let dependencies = dependencyLookup.get(Type);
        if (dependencies === void 0) {
            // Type.length is the number of constructor parameters. If this is 0, it could mean the class has an empty constructor
            // but it could also mean the class has no constructor at all (in which case it inherits the constructor from the prototype).
            // Non-zero constructor length + no paramtypes means emitDecoratorMetadata is off, or the class has no decorator.
            // We're not doing anything with the above right now, but it's good to keep in mind for any future issues.
            const inject = Type.inject;
            if (inject === void 0) {
                // design:paramtypes is set by tsc when emitDecoratorMetadata is enabled.
                const designParamtypes = DI.getDesignParamtypes(Type);
                // di:paramtypes is set by the parameter decorator from DI.createInterface or by @inject
                const annotationParamtypes = DI.getAnnotationParamtypes(Type);
                if (designParamtypes === void 0) {
                    if (annotationParamtypes === void 0) {
                        // Only go up the prototype if neither static inject nor any of the paramtypes is defined, as
                        // there is no sound way to merge a type's deps with its prototype's deps
                        const Proto = Object.getPrototypeOf(Type);
                        if (typeof Proto === "function" && Proto !== Function.prototype) {
                            dependencies = cloneArrayWithPossibleProps(DI.getDependencies(Proto));
                        }
                        else {
                            dependencies = [];
                        }
                    }
                    else {
                        // No design:paramtypes so just use the di:paramtypes
                        dependencies = cloneArrayWithPossibleProps(annotationParamtypes);
                    }
                }
                else if (annotationParamtypes === void 0) {
                    // No di:paramtypes so just use the design:paramtypes
                    dependencies = cloneArrayWithPossibleProps(designParamtypes);
                }
                else {
                    // We've got both, so merge them (in case of conflict on same index, di:paramtypes take precedence)
                    dependencies = cloneArrayWithPossibleProps(designParamtypes);
                    let len = annotationParamtypes.length;
                    let auAnnotationParamtype;
                    for (let i = 0; i < len; ++i) {
                        auAnnotationParamtype = annotationParamtypes[i];
                        if (auAnnotationParamtype !== void 0) {
                            dependencies[i] = auAnnotationParamtype;
                        }
                    }
                    const keys = Object.keys(annotationParamtypes);
                    len = keys.length;
                    let key;
                    for (let i = 0; i < len; ++i) {
                        key = keys[i];
                        if (!isArrayIndex(key)) {
                            dependencies[key] = annotationParamtypes[key];
                        }
                    }
                }
            }
            else {
                // Ignore paramtypes if we have static inject
                dependencies = cloneArrayWithPossibleProps(inject);
            }
            dependencyLookup.set(Type, dependencies);
        }
        return dependencies;
    },
    /**
     * Defines a property on a web component class. The value of this property will
     * be resolved from the dependency injection container responsible for the element
     * instance, based on where it is connected in the DOM.
     * @param target - The target to define the property on.
     * @param propertyName - The name of the property to define.
     * @param key - The dependency injection key.
     * @param respectConnection - Indicates whether or not to update the property value if the
     * hosting component is disconnected and then re-connected at a different location in the DOM.
     * @remarks
     * The respectConnection option is only applicable to elements that descend from FASTElement.
     */
    defineProperty(target, propertyName, key, respectConnection = false) {
        const diPropertyKey = `$di_${propertyName}`;
        Reflect.defineProperty(target, propertyName, {
            get: function () {
                let value = this[diPropertyKey];
                if (value === void 0) {
                    const container = this instanceof HTMLElement
                        ? DI.findResponsibleContainer(this)
                        : DI.getOrCreateDOMContainer();
                    value = container.get(key);
                    this[diPropertyKey] = value;
                    if (respectConnection && this instanceof _microsoft_fast_element__WEBPACK_IMPORTED_MODULE_0__.FASTElement) {
                        const notifier = this.$fastController;
                        const handleChange = () => {
                            const newContainer = DI.findResponsibleContainer(this);
                            const newValue = newContainer.get(key);
                            const oldValue = this[diPropertyKey];
                            if (newValue !== oldValue) {
                                this[diPropertyKey] = value;
                                notifier.notify(propertyName);
                            }
                        };
                        notifier.subscribe({ handleChange }, "isConnected");
                    }
                }
                return value;
            },
        });
    },
    /**
     * Creates a dependency injection key.
     * @param nameConfigOrCallback - A friendly name for the key or a lambda that configures a
     * default resolution for the dependency.
     * @param configuror - If a friendly name was provided for the first parameter, then an optional
     * lambda that configures a default resolution for the dependency can be provided second.
     * @returns The created key.
     * @remarks
     * The created key can be used as a property decorator or constructor parameter decorator,
     * in addition to its standard use in an inject array or through direct container APIs.
     */
    createInterface(nameConfigOrCallback, configuror) {
        const configure = typeof nameConfigOrCallback === "function"
            ? nameConfigOrCallback
            : configuror;
        const friendlyName = typeof nameConfigOrCallback === "string"
            ? nameConfigOrCallback
            : nameConfigOrCallback && "friendlyName" in nameConfigOrCallback
                ? nameConfigOrCallback.friendlyName || defaultFriendlyName
                : defaultFriendlyName;
        const respectConnection = typeof nameConfigOrCallback === "string"
            ? false
            : nameConfigOrCallback && "respectConnection" in nameConfigOrCallback
                ? nameConfigOrCallback.respectConnection || false
                : false;
        const Interface = function (target, property, index) {
            if (target == null || new.target !== undefined) {
                throw new Error(`No registration for interface: '${Interface.friendlyName}'`);
            }
            if (property) {
                DI.defineProperty(target, property, Interface, respectConnection);
            }
            else {
                const annotationParamtypes = DI.getOrCreateAnnotationParamTypes(target);
                annotationParamtypes[index] = Interface;
            }
        };
        Interface.$isInterface = true;
        Interface.friendlyName = friendlyName == null ? "(anonymous)" : friendlyName;
        if (configure != null) {
            Interface.register = function (container, key) {
                return configure(new ResolverBuilder(container, key !== null && key !== void 0 ? key : Interface));
            };
        }
        Interface.toString = function toString() {
            return `InterfaceSymbol<${Interface.friendlyName}>`;
        };
        return Interface;
    },
    /**
     * A decorator that specifies what to inject into its target.
     * @param dependencies - The dependencies to inject.
     * @returns The decorator to be applied to the target class.
     * @remarks
     * The decorator can be used to decorate a class, listing all of the classes dependencies.
     * Or it can be used to decorate a constructor paramter, indicating what to inject for that
     * parameter.
     * Or it can be used for a web component property, indicating what that property should resolve to.
     */
    inject(...dependencies) {
        return function (target, key, descriptor) {
            if (typeof descriptor === "number") {
                // It's a parameter decorator.
                const annotationParamtypes = DI.getOrCreateAnnotationParamTypes(target);
                const dep = dependencies[0];
                if (dep !== void 0) {
                    annotationParamtypes[descriptor] = dep;
                }
            }
            else if (key) {
                DI.defineProperty(target, key, dependencies[0]);
            }
            else {
                const annotationParamtypes = descriptor
                    ? DI.getOrCreateAnnotationParamTypes(descriptor.value)
                    : DI.getOrCreateAnnotationParamTypes(target);
                let dep;
                for (let i = 0; i < dependencies.length; ++i) {
                    dep = dependencies[i];
                    if (dep !== void 0) {
                        annotationParamtypes[i] = dep;
                    }
                }
            }
        };
    },
    /**
     * Registers the `target` class as a transient dependency; each time the dependency is resolved
     * a new instance will be created.
     *
     * @param target - The class / constructor function to register as transient.
     * @returns The same class, with a static `register` method that takes a container and returns the appropriate resolver.
     *
     * @example
     * On an existing class
     * ```ts
     * class Foo { }
     * DI.transient(Foo);
     * ```
     *
     * @example
     * Inline declaration
     *
     * ```ts
     * const Foo = DI.transient(class { });
     * // Foo is now strongly typed with register
     * Foo.register(container);
     * ```
     *
     * @public
     */
    transient(target) {
        target.register = function register(container) {
            const registration = Registration.transient(target, target);
            return registration.register(container);
        };
        target.registerInRequestor = false;
        return target;
    },
    /**
     * Registers the `target` class as a singleton dependency; the class will only be created once. Each
     * consecutive time the dependency is resolved, the same instance will be returned.
     *
     * @param target - The class / constructor function to register as a singleton.
     * @returns The same class, with a static `register` method that takes a container and returns the appropriate resolver.
     * @example
     * On an existing class
     * ```ts
     * class Foo { }
     * DI.singleton(Foo);
     * ```
     *
     * @example
     * Inline declaration
     * ```ts
     * const Foo = DI.singleton(class { });
     * // Foo is now strongly typed with register
     * Foo.register(container);
     * ```
     *
     * @public
     */
    singleton(target, options = defaultSingletonOptions) {
        target.register = function register(container) {
            const registration = Registration.singleton(target, target);
            return registration.register(container);
        };
        target.registerInRequestor = options.scoped;
        return target;
    },
});
/**
 * The interface key that resolves the dependency injection container itself.
 * @public
 */
const Container = DI.createInterface("Container");
/**
 * The interface key that resolves the service locator itself.
 * @public
 */
const ServiceLocator = Container;
function createResolver(getter) {
    return function (key) {
        const resolver = function (target, property, descriptor) {
            DI.inject(resolver)(target, property, descriptor);
        };
        resolver.$isResolver = true;
        resolver.resolve = function (handler, requestor) {
            return getter(key, handler, requestor);
        };
        return resolver;
    };
}
/**
 * A decorator that specifies what to inject into its target.
 * @param dependencies - The dependencies to inject.
 * @returns The decorator to be applied to the target class.
 * @remarks
 * The decorator can be used to decorate a class, listing all of the classes dependencies.
 * Or it can be used to decorate a constructor paramter, indicating what to inject for that
 * parameter.
 * Or it can be used for a web component property, indicating what that property should resolve to.
 *
 * @public
 */
const inject = DI.inject;
function transientDecorator(target) {
    return DI.transient(target);
}
function transient(target) {
    return target == null ? transientDecorator : transientDecorator(target);
}
const defaultSingletonOptions = { scoped: false };
function singletonDecorator(target) {
    return DI.singleton(target);
}
/**
 * @public
 */
function singleton(targetOrOptions) {
    if (typeof targetOrOptions === "function") {
        return DI.singleton(targetOrOptions);
    }
    return function ($target) {
        return DI.singleton($target, targetOrOptions);
    };
}
function createAllResolver(getter) {
    return function (key, searchAncestors) {
        searchAncestors = !!searchAncestors;
        const resolver = function (target, property, descriptor) {
            DI.inject(resolver)(target, property, descriptor);
        };
        resolver.$isResolver = true;
        resolver.resolve = function (handler, requestor) {
            /* eslint-disable-next-line @typescript-eslint/no-non-null-assertion */
            return getter(key, handler, requestor, searchAncestors);
        };
        return resolver;
    };
}
/**
 * A decorator and DI resolver that will resolve an array of all dependencies
 * registered with the specified key.
 * @param key - The key to resolve all dependencies for.
 * @param searchAncestors - [optional] Indicates whether to search ancestor containers.
 * @public
 */
const all = createAllResolver((key, handler, requestor, searchAncestors) => requestor.getAll(key, searchAncestors));
/**
 * A decorator that lazily injects a dependency depending on whether the `Key` is present at the time of function call.
 *
 * @example
 * You need to make your argument a function that returns the type, for example
 * ```ts
 * class Foo {
 *   constructor( @lazy('random') public random: () => number )
 * }
 * const foo = container.get(Foo); // instanceof Foo
 * foo.random(); // throws
 * ```
 * would throw an exception because you haven't registered `'random'` before calling the method.
 * @example
 * This, would give you a new 'Math.random()' number each time.
 * ```ts
 * class Foo {
 *   constructor( @lazy('random') public random: () => random )
 * }
 * container.register(Registration.callback('random', Math.random ));
 * container.get(Foo).random(); // some random number
 * container.get(Foo).random(); // another random number
 * ```
 *
 * `@lazy` does not manage the lifecycle of the underlying key. If you want a singleton, you have to register as a
 * `singleton`, `transient` would also behave as you would expect, providing you a new instance each time.
 *
 * @param key - The key to lazily resolve.
 * see {@link DI.createInterface} on interactions with interfaces
 *
 * @public
 */
const lazy = createResolver((key, handler, requestor) => {
    return () => requestor.get(key);
});
/**
 * A decorator that allows you to optionally inject a dependency depending on whether the [[`Key`]] is present, for example:
 * @example
 * ```ts
 * class Foo {
 *   constructor( @inject('mystring') public str: string = 'somestring' )
 * }
 * container.get(Foo); // throws
 * ```
 * would fail
 *
 * @example
 * ```ts
 * class Foo {
 *   constructor( @optional('mystring') public str: string = 'somestring' )
 * }
 * container.get(Foo).str // somestring
 * ```
 * if you use it without a default it will inject `undefined`, so remember to mark your input type as
 * possibly `undefined`!
 *
 * @param key - The key to optionally resolve.
 * see {@link DI.createInterface} on interactions with interfaces
 *
 * @public
 */
const optional = createResolver((key, handler, requestor) => {
    if (requestor.has(key, true)) {
        return requestor.get(key);
    }
    else {
        return undefined;
    }
});
/**
 * A decorator that tells the container not to try to inject a dependency.
 *
 * @public
 */
function ignore(target, property, descriptor) {
    DI.inject(ignore)(target, property, descriptor);
}
// Hack: casting below used to prevent TS from generate a namespace which can't be commented
// and results in documentation validation errors.
ignore.$isResolver = true;
ignore.resolve = () => undefined;
/**
 * A decorator that indicates that a new instance should be injected scoped to the
 * container that requested the instance.
 * @param key - The dependency key for the new instance.
 * @remarks
 * This creates a resolver with an instance strategy pointing to the new instance, effectively
 * making this a singleton, scoped to the container or DOM's subtree.
 *
 * @public
 */
const newInstanceForScope = createResolver((key, handler, requestor) => {
    const instance = createNewInstance(key, handler);
    const resolver = new ResolverImpl(key, 0 /* instance */, instance);
    requestor.registerResolver(key, resolver);
    return instance;
});
/**
 * A decorator that indicates that a new instance should be injected.
 * @param key - The dependency key for the new instance.
 * @remarks
 * The instance is not internally cached with a resolver as newInstanceForScope does.
 *
 * @public
 */
const newInstanceOf = createResolver((key, handler, _requestor) => createNewInstance(key, handler));
function createNewInstance(key, handler) {
    /* eslint-disable-next-line @typescript-eslint/no-non-null-assertion */
    return handler.getFactory(key).construct(handler);
}
/** @internal */
class ResolverImpl {
    constructor(key, strategy, state) {
        this.key = key;
        this.strategy = strategy;
        this.state = state;
        this.resolving = false;
    }
    get $isResolver() {
        return true;
    }
    register(container) {
        return container.registerResolver(this.key, this);
    }
    resolve(handler, requestor) {
        switch (this.strategy) {
            case 0 /* instance */:
                return this.state;
            case 1 /* singleton */: {
                if (this.resolving) {
                    throw new Error(`Cyclic dependency found: ${this.state.name}`);
                }
                this.resolving = true;
                this.state = handler
                    .getFactory(this.state)
                    .construct(requestor);
                this.strategy = 0 /* instance */;
                this.resolving = false;
                return this.state;
            }
            case 2 /* transient */: {
                // Always create transients from the requesting container
                const factory = handler.getFactory(this.state);
                if (factory === null) {
                    throw new Error(`Resolver for ${String(this.key)} returned a null factory`);
                }
                return factory.construct(requestor);
            }
            case 3 /* callback */:
                return this.state(handler, requestor, this);
            case 4 /* array */:
                return this.state[0].resolve(handler, requestor);
            case 5 /* alias */:
                return requestor.get(this.state);
            default:
                throw new Error(`Invalid resolver strategy specified: ${this.strategy}.`);
        }
    }
    getFactory(container) {
        var _a, _b, _c;
        switch (this.strategy) {
            case 1 /* singleton */:
            case 2 /* transient */:
                return container.getFactory(this.state);
            case 5 /* alias */:
                return (_c = (_b = (_a = container.getResolver(this.state)) === null || _a === void 0 ? void 0 : _a.getFactory) === null || _b === void 0 ? void 0 : _b.call(_a, container)) !== null && _c !== void 0 ? _c : null;
            default:
                return null;
        }
    }
}
function containerGetKey(d) {
    return this.get(d);
}
function transformInstance(inst, transform) {
    return transform(inst);
}
/** @internal */
class FactoryImpl {
    constructor(Type, dependencies) {
        this.Type = Type;
        this.dependencies = dependencies;
        this.transformers = null;
    }
    construct(container, dynamicDependencies) {
        let instance;
        if (dynamicDependencies === void 0) {
            instance = new this.Type(...this.dependencies.map(containerGetKey, container));
        }
        else {
            instance = new this.Type(...this.dependencies.map(containerGetKey, container), ...dynamicDependencies);
        }
        if (this.transformers == null) {
            return instance;
        }
        return this.transformers.reduce(transformInstance, instance);
    }
    registerTransformer(transformer) {
        (this.transformers || (this.transformers = [])).push(transformer);
    }
}
const containerResolver = {
    $isResolver: true,
    resolve(handler, requestor) {
        return requestor;
    },
};
function isRegistry(obj) {
    return typeof obj.register === "function";
}
function isSelfRegistry(obj) {
    return isRegistry(obj) && typeof obj.registerInRequestor === "boolean";
}
function isRegisterInRequester(obj) {
    return isSelfRegistry(obj) && obj.registerInRequestor;
}
function isClass(obj) {
    return obj.prototype !== void 0;
}
const InstrinsicTypeNames = new Set([
    "Array",
    "ArrayBuffer",
    "Boolean",
    "DataView",
    "Date",
    "Error",
    "EvalError",
    "Float32Array",
    "Float64Array",
    "Function",
    "Int8Array",
    "Int16Array",
    "Int32Array",
    "Map",
    "Number",
    "Object",
    "Promise",
    "RangeError",
    "ReferenceError",
    "RegExp",
    "Set",
    "SharedArrayBuffer",
    "String",
    "SyntaxError",
    "TypeError",
    "Uint8Array",
    "Uint8ClampedArray",
    "Uint16Array",
    "Uint32Array",
    "URIError",
    "WeakMap",
    "WeakSet",
]);
const DILocateParentEventType = "__DI_LOCATE_PARENT__";
const factories = new Map();
/**
 * @internal
 */
class ContainerImpl {
    constructor(owner, config) {
        this.owner = owner;
        this.config = config;
        this._parent = void 0;
        this.registerDepth = 0;
        this.context = null;
        if (owner !== null) {
            owner.$$container$$ = this;
        }
        this.resolvers = new Map();
        this.resolvers.set(Container, containerResolver);
        if (owner instanceof Node) {
            owner.addEventListener(DILocateParentEventType, (e) => {
                if (e.composedPath()[0] !== this.owner) {
                    e.detail.container = this;
                    e.stopImmediatePropagation();
                }
            });
        }
    }
    get parent() {
        if (this._parent === void 0) {
            this._parent = this.config.parentLocator(this.owner);
        }
        return this._parent;
    }
    get depth() {
        return this.parent === null ? 0 : this.parent.depth + 1;
    }
    get responsibleForOwnerRequests() {
        return this.config.responsibleForOwnerRequests;
    }
    registerWithContext(context, ...params) {
        this.context = context;
        this.register(...params);
        this.context = null;
        return this;
    }
    register(...params) {
        if (++this.registerDepth === 100) {
            throw new Error("Unable to autoregister dependency");
            // Most likely cause is trying to register a plain object that does not have a
            // register method and is not a class constructor
        }
        let current;
        let keys;
        let value;
        let j;
        let jj;
        const context = this.context;
        for (let i = 0, ii = params.length; i < ii; ++i) {
            current = params[i];
            if (!isObject(current)) {
                continue;
            }
            if (isRegistry(current)) {
                current.register(this, context);
            }
            else if (isClass(current)) {
                Registration.singleton(current, current).register(this);
            }
            else {
                keys = Object.keys(current);
                j = 0;
                jj = keys.length;
                for (; j < jj; ++j) {
                    value = current[keys[j]];
                    if (!isObject(value)) {
                        continue;
                    }
                    // note: we could remove this if-branch and call this.register directly
                    // - the extra check is just a perf tweak to create fewer unnecessary arrays by the spread operator
                    if (isRegistry(value)) {
                        value.register(this, context);
                    }
                    else {
                        this.register(value);
                    }
                }
            }
        }
        --this.registerDepth;
        return this;
    }
    registerResolver(key, resolver) {
        validateKey(key);
        const resolvers = this.resolvers;
        const result = resolvers.get(key);
        if (result == null) {
            resolvers.set(key, resolver);
        }
        else if (result instanceof ResolverImpl &&
            result.strategy === 4 /* array */) {
            result.state.push(resolver);
        }
        else {
            resolvers.set(key, new ResolverImpl(key, 4 /* array */, [result, resolver]));
        }
        return resolver;
    }
    registerTransformer(key, transformer) {
        const resolver = this.getResolver(key);
        if (resolver == null) {
            return false;
        }
        if (resolver.getFactory) {
            const factory = resolver.getFactory(this);
            if (factory == null) {
                return false;
            }
            // This type cast is a bit of a hacky one, necessary due to the duplicity of IResolverLike.
            // Problem is that that interface's type arg can be of type Key, but the getFactory method only works on
            // type Constructable. So the return type of that optional method has this additional constraint, which
            // seems to confuse the type checker.
            factory.registerTransformer(transformer);
            return true;
        }
        return false;
    }
    getResolver(key, autoRegister = true) {
        validateKey(key);
        if (key.resolve !== void 0) {
            return key;
        }
        /* eslint-disable-next-line @typescript-eslint/no-this-alias */
        let current = this;
        let resolver;
        while (current != null) {
            resolver = current.resolvers.get(key);
            if (resolver == null) {
                if (current.parent == null) {
                    const handler = isRegisterInRequester(key)
                        ? this
                        : current;
                    return autoRegister ? this.jitRegister(key, handler) : null;
                }
                current = current.parent;
            }
            else {
                return resolver;
            }
        }
        return null;
    }
    has(key, searchAncestors = false) {
        return this.resolvers.has(key)
            ? true
            : searchAncestors && this.parent != null
                ? this.parent.has(key, true)
                : false;
    }
    get(key) {
        validateKey(key);
        if (key.$isResolver) {
            return key.resolve(this, this);
        }
        /* eslint-disable-next-line @typescript-eslint/no-this-alias */
        let current = this;
        let resolver;
        while (current != null) {
            resolver = current.resolvers.get(key);
            if (resolver == null) {
                if (current.parent == null) {
                    const handler = isRegisterInRequester(key)
                        ? this
                        : current;
                    resolver = this.jitRegister(key, handler);
                    return resolver.resolve(current, this);
                }
                current = current.parent;
            }
            else {
                return resolver.resolve(current, this);
            }
        }
        throw new Error(`Unable to resolve key: ${key}`);
    }
    getAll(key, searchAncestors = false) {
        validateKey(key);
        /* eslint-disable-next-line @typescript-eslint/no-this-alias */
        const requestor = this;
        let current = requestor;
        let resolver;
        if (searchAncestors) {
            let resolutions = _microsoft_fast_element__WEBPACK_IMPORTED_MODULE_1__.emptyArray;
            while (current != null) {
                resolver = current.resolvers.get(key);
                if (resolver != null) {
                    resolutions = resolutions.concat(
                    /* eslint-disable-next-line @typescript-eslint/no-non-null-assertion */
                    buildAllResponse(resolver, current, requestor));
                }
                current = current.parent;
            }
            return resolutions;
        }
        else {
            while (current != null) {
                resolver = current.resolvers.get(key);
                if (resolver == null) {
                    current = current.parent;
                    if (current == null) {
                        return _microsoft_fast_element__WEBPACK_IMPORTED_MODULE_1__.emptyArray;
                    }
                }
                else {
                    return buildAllResponse(resolver, current, requestor);
                }
            }
        }
        return _microsoft_fast_element__WEBPACK_IMPORTED_MODULE_1__.emptyArray;
    }
    getFactory(Type) {
        let factory = factories.get(Type);
        if (factory === void 0) {
            if (isNativeFunction(Type)) {
                throw new Error(`${Type.name} is a native function and therefore cannot be safely constructed by DI. If this is intentional, please use a callback or cachedCallback resolver.`);
            }
            factories.set(Type, (factory = new FactoryImpl(Type, DI.getDependencies(Type))));
        }
        return factory;
    }
    registerFactory(key, factory) {
        factories.set(key, factory);
    }
    createChild(config) {
        return new ContainerImpl(null, Object.assign({}, this.config, config, { parentLocator: () => this }));
    }
    jitRegister(keyAsValue, handler) {
        if (typeof keyAsValue !== "function") {
            throw new Error(`Attempted to jitRegister something that is not a constructor: '${keyAsValue}'. Did you forget to register this dependency?`);
        }
        if (InstrinsicTypeNames.has(keyAsValue.name)) {
            throw new Error(`Attempted to jitRegister an intrinsic type: ${keyAsValue.name}. Did you forget to add @inject(Key)`);
        }
        if (isRegistry(keyAsValue)) {
            const registrationResolver = keyAsValue.register(handler);
            if (!(registrationResolver instanceof Object) ||
                registrationResolver.resolve == null) {
                const newResolver = handler.resolvers.get(keyAsValue);
                if (newResolver != void 0) {
                    return newResolver;
                }
                throw new Error("A valid resolver was not returned from the static register method");
            }
            return registrationResolver;
        }
        else if (keyAsValue.$isInterface) {
            throw new Error(`Attempted to jitRegister an interface: ${keyAsValue.friendlyName}`);
        }
        else {
            const resolver = this.config.defaultResolver(keyAsValue, handler);
            handler.resolvers.set(keyAsValue, resolver);
            return resolver;
        }
    }
}
const cache = new WeakMap();
function cacheCallbackResult(fun) {
    return function (handler, requestor, resolver) {
        if (cache.has(resolver)) {
            return cache.get(resolver);
        }
        const t = fun(handler, requestor, resolver);
        cache.set(resolver, t);
        return t;
    };
}
/**
 * You can use the resulting Registration of any of the factory methods
 * to register with the container.
 *
 * @example
 * ```
 * class Foo {}
 * const container = DI.createContainer();
 * container.register(Registration.instance(Foo, new Foo()));
 * container.get(Foo);
 * ```
 *
 * @public
 */
const Registration = Object.freeze({
    /**
     * Allows you to pass an instance.
     * Every time you request this {@link Key} you will get this instance back.
     *
     * @example
     * ```
     * Registration.instance(Foo, new Foo()));
     * ```
     *
     * @param key - The key to register the instance under.
     * @param value - The instance to return when the key is requested.
     */
    instance(key, value) {
        return new ResolverImpl(key, 0 /* instance */, value);
    },
    /**
     * Creates an instance from the class.
     * Every time you request this {@link Key} you will get the same one back.
     *
     * @example
     * ```
     * Registration.singleton(Foo, Foo);
     * ```
     *
     * @param key - The key to register the singleton under.
     * @param value - The class to instantiate as a singleton when first requested.
     */
    singleton(key, value) {
        return new ResolverImpl(key, 1 /* singleton */, value);
    },
    /**
     * Creates an instance from a class.
     * Every time you request this {@link Key} you will get a new instance.
     *
     * @example
     * ```
     * Registration.instance(Foo, Foo);
     * ```
     *
     * @param key - The key to register the instance type under.
     * @param value - The class to instantiate each time the key is requested.
     */
    transient(key, value) {
        return new ResolverImpl(key, 2 /* transient */, value);
    },
    /**
     * Delegates to a callback function to provide the dependency.
     * Every time you request this {@link Key} the callback will be invoked to provide
     * the dependency.
     *
     * @example
     * ```
     * Registration.callback(Foo, () => new Foo());
     * Registration.callback(Bar, (c: Container) => new Bar(c.get(Foo)));
     * ```
     *
     * @param key - The key to register the callback for.
     * @param callback - The function that is expected to return the dependency.
     */
    callback(key, callback) {
        return new ResolverImpl(key, 3 /* callback */, callback);
    },
    /**
     * Delegates to a callback function to provide the dependency and then caches the
     * dependency for future requests.
     *
     * @example
     * ```
     * Registration.cachedCallback(Foo, () => new Foo());
     * Registration.cachedCallback(Bar, (c: Container) => new Bar(c.get(Foo)));
     * ```
     *
     * @param key - The key to register the callback for.
     * @param callback - The function that is expected to return the dependency.
     * @remarks
     * If you pass the same Registration to another container, the same cached value will be used.
     * Should all references to the resolver returned be removed, the cache will expire.
     */
    cachedCallback(key, callback) {
        return new ResolverImpl(key, 3 /* callback */, cacheCallbackResult(callback));
    },
    /**
     * Creates an alternate {@link Key} to retrieve an instance by.
     *
     * @example
     * ```
     * Register.singleton(Foo, Foo)
     * Register.aliasTo(Foo, MyFoos);
     *
     * container.getAll(MyFoos) // contains an instance of Foo
     * ```
     *
     * @param originalKey - The original key that has been registered.
     * @param aliasKey - The alias to the original key.
     */
    aliasTo(originalKey, aliasKey) {
        return new ResolverImpl(aliasKey, 5 /* alias */, originalKey);
    },
});
/** @internal */
function validateKey(key) {
    if (key === null || key === void 0) {
        throw new Error("key/value cannot be null or undefined. Are you trying to inject/register something that doesn't exist with DI?");
    }
}
function buildAllResponse(resolver, handler, requestor) {
    if (resolver instanceof ResolverImpl &&
        resolver.strategy === 4 /* array */) {
        const state = resolver.state;
        let i = state.length;
        const results = new Array(i);
        while (i--) {
            results[i] = state[i].resolve(handler, requestor);
        }
        return results;
    }
    return [resolver.resolve(handler, requestor)];
}
const defaultFriendlyName = "(anonymous)";
function isObject(value) {
    return (typeof value === "object" && value !== null) || typeof value === "function";
}
/**
 * Determine whether the value is a native function.
 *
 * @param fn - The function to check.
 * @returns `true` is the function is a native function, otherwise `false`
 */
const isNativeFunction = (function () {
    const lookup = new WeakMap();
    let isNative = false;
    let sourceText = "";
    let i = 0;
    return function (fn) {
        isNative = lookup.get(fn);
        if (isNative === void 0) {
            sourceText = fn.toString();
            i = sourceText.length;
            // http://www.ecma-international.org/ecma-262/#prod-NativeFunction
            isNative =
                // 29 is the length of 'function () { [native code] }' which is the smallest length of a native function string
                i >= 29 &&
                    // 100 seems to be a safe upper bound of the max length of a native function. In Chrome and FF it's 56, in Edge it's 61.
                    i <= 100 &&
                    // This whole heuristic *could* be tricked by a comment. Do we need to care about that?
                    sourceText.charCodeAt(i - 1) === 0x7d && // }
                    // TODO: the spec is a little vague about the precise constraints, so we do need to test this across various browsers to make sure just one whitespace is a safe assumption.
                    sourceText.charCodeAt(i - 2) <= 0x20 && // whitespace
                    sourceText.charCodeAt(i - 3) === 0x5d && // ]
                    sourceText.charCodeAt(i - 4) === 0x65 && // e
                    sourceText.charCodeAt(i - 5) === 0x64 && // d
                    sourceText.charCodeAt(i - 6) === 0x6f && // o
                    sourceText.charCodeAt(i - 7) === 0x63 && // c
                    sourceText.charCodeAt(i - 8) === 0x20 && //
                    sourceText.charCodeAt(i - 9) === 0x65 && // e
                    sourceText.charCodeAt(i - 10) === 0x76 && // v
                    sourceText.charCodeAt(i - 11) === 0x69 && // i
                    sourceText.charCodeAt(i - 12) === 0x74 && // t
                    sourceText.charCodeAt(i - 13) === 0x61 && // a
                    sourceText.charCodeAt(i - 14) === 0x6e && // n
                    sourceText.charCodeAt(i - 15) === 0x58; // [
            lookup.set(fn, isNative);
        }
        return isNative;
    };
})();
const isNumericLookup = {};
function isArrayIndex(value) {
    switch (typeof value) {
        case "number":
            return value >= 0 && (value | 0) === value;
        case "string": {
            const result = isNumericLookup[value];
            if (result !== void 0) {
                return result;
            }
            const length = value.length;
            if (length === 0) {
                return (isNumericLookup[value] = false);
            }
            let ch = 0;
            for (let i = 0; i < length; ++i) {
                ch = value.charCodeAt(i);
                if ((i === 0 && ch === 0x30 && length > 1) /* must not start with 0 */ ||
                    ch < 0x30 /* 0 */ ||
                    ch > 0x39 /* 9 */) {
                    return (isNumericLookup[value] = false);
                }
            }
            return (isNumericLookup[value] = true);
        }
        default:
            return false;
    }
}


/***/ }),

/***/ "./node_modules/@microsoft/fast-foundation/dist/esm/foundation-element/foundation-element.js":
/*!***************************************************************************************************!*\
  !*** ./node_modules/@microsoft/fast-foundation/dist/esm/foundation-element/foundation-element.js ***!
  \***************************************************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "FoundationElement": () => (/* binding */ FoundationElement),
/* harmony export */   "FoundationElementRegistry": () => (/* binding */ FoundationElementRegistry)
/* harmony export */ });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! tslib */ "./node_modules/tslib/tslib.es6.js");
/* harmony import */ var _microsoft_fast_element__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @microsoft/fast-element */ "./node_modules/@microsoft/fast-element/dist/esm/components/fast-element.js");
/* harmony import */ var _microsoft_fast_element__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @microsoft/fast-element */ "./node_modules/@microsoft/fast-element/dist/esm/observation/observable.js");
/* harmony import */ var _design_system_component_presentation_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../design-system/component-presentation.js */ "./node_modules/@microsoft/fast-foundation/dist/esm/design-system/component-presentation.js");



/**
 * Defines a foundation element class that:
 * 1. Connects the element to its ComponentPresentation
 * 2. Allows resolving the element template from the instance or ComponentPresentation
 * 3. Allows resolving the element styles from the instance or ComponentPresentation
 *
 * @public
 */
class FoundationElement extends _microsoft_fast_element__WEBPACK_IMPORTED_MODULE_0__.FASTElement {
    constructor() {
        super(...arguments);
        this._presentation = void 0;
    }
    /**
     * A property which resolves the ComponentPresentation instance
     * for the current component.
     * @public
     */
    get $presentation() {
        if (this._presentation === void 0) {
            this._presentation = _design_system_component_presentation_js__WEBPACK_IMPORTED_MODULE_1__.ComponentPresentation.forTag(this.tagName, this);
        }
        return this._presentation;
    }
    templateChanged() {
        if (this.template !== undefined) {
            this.$fastController.template = this.template;
        }
    }
    stylesChanged() {
        if (this.styles !== undefined) {
            this.$fastController.styles = this.styles;
        }
    }
    /**
     * The connected callback for this FASTElement.
     * @remarks
     * This method is invoked by the platform whenever this FoundationElement
     * becomes connected to the document.
     * @public
     */
    connectedCallback() {
        if (this.$presentation !== null) {
            this.$presentation.applyTo(this);
        }
        super.connectedCallback();
    }
    /**
     * Defines an element registry function with a set of element definition defaults.
     * @param elementDefinition - The definition of the element to create the registry
     * function for.
     * @public
     */
    static compose(elementDefinition) {
        return (overrideDefinition = {}) => new FoundationElementRegistry(this === FoundationElement
            ? class extends FoundationElement {
            }
            : this, elementDefinition, overrideDefinition);
    }
}
(0,tslib__WEBPACK_IMPORTED_MODULE_2__.__decorate)([
    _microsoft_fast_element__WEBPACK_IMPORTED_MODULE_3__.observable
], FoundationElement.prototype, "template", void 0);
(0,tslib__WEBPACK_IMPORTED_MODULE_2__.__decorate)([
    _microsoft_fast_element__WEBPACK_IMPORTED_MODULE_3__.observable
], FoundationElement.prototype, "styles", void 0);
function resolveOption(option, context, definition) {
    if (typeof option === "function") {
        return option(context, definition);
    }
    return option;
}
/**
 * Registry capable of defining presentation properties for a DOM Container hierarchy.
 *
 * @internal
 */
/* eslint-disable @typescript-eslint/no-unused-vars */
class FoundationElementRegistry {
    constructor(type, elementDefinition, overrideDefinition) {
        this.type = type;
        this.elementDefinition = elementDefinition;
        this.overrideDefinition = overrideDefinition;
        this.definition = Object.assign(Object.assign({}, this.elementDefinition), this.overrideDefinition);
    }
    register(container, context) {
        const definition = this.definition;
        const overrideDefinition = this.overrideDefinition;
        const prefix = definition.prefix || context.elementPrefix;
        const name = `${prefix}-${definition.baseName}`;
        context.tryDefineElement({
            name,
            type: this.type,
            baseClass: this.elementDefinition.baseClass,
            callback: x => {
                const presentation = new _design_system_component_presentation_js__WEBPACK_IMPORTED_MODULE_1__.DefaultComponentPresentation(resolveOption(definition.template, x, definition), resolveOption(definition.styles, x, definition));
                x.definePresentation(presentation);
                let shadowOptions = resolveOption(definition.shadowOptions, x, definition);
                if (x.shadowRootMode) {
                    // If the design system has overridden the shadow root mode, we need special handling.
                    if (shadowOptions) {
                        // If there are shadow options present in the definition, then
                        // either the component itself has specified an option or the
                        // registry function has overridden it.
                        if (!overrideDefinition.shadowOptions) {
                            // There were shadow options provided by the component and not overridden by
                            // the registry.
                            shadowOptions.mode = x.shadowRootMode;
                        }
                    }
                    else if (shadowOptions !== null) {
                        // If the component author did not provide shadow options,
                        // and did not null them out (light dom opt-in) then they
                        // were relying on the FASTElement default. So, if the
                        // design system provides a mode, we need to create the options
                        // to override the default.
                        shadowOptions = { mode: x.shadowRootMode };
                    }
                }
                x.defineElement({
                    elementOptions: resolveOption(definition.elementOptions, x, definition),
                    shadowOptions,
                    attributes: resolveOption(definition.attributes, x, definition),
                });
            },
        });
    }
}
/* eslint-enable @typescript-eslint/no-unused-vars */


/***/ }),

/***/ "./node_modules/@microsoft/fast-foundation/dist/esm/patterns/aria-global.js":
/*!**********************************************************************************!*\
  !*** ./node_modules/@microsoft/fast-foundation/dist/esm/patterns/aria-global.js ***!
  \**********************************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "ARIAGlobalStatesAndProperties": () => (/* binding */ ARIAGlobalStatesAndProperties)
/* harmony export */ });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tslib */ "./node_modules/tslib/tslib.es6.js");
/* harmony import */ var _microsoft_fast_element__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @microsoft/fast-element */ "./node_modules/@microsoft/fast-element/dist/esm/components/attributes.js");


/**
 * Some states and properties are applicable to all host language elements regardless of whether a role is applied.
 * The following global states and properties are supported by all roles and by all base markup elements.
 * {@link https://www.w3.org/TR/wai-aria-1.1/#global_states}
 *
 * This is intended to be used as a mixin. Be sure you extend FASTElement.
 *
 * @public
 */
class ARIAGlobalStatesAndProperties {
}
(0,tslib__WEBPACK_IMPORTED_MODULE_0__.__decorate)([
    (0,_microsoft_fast_element__WEBPACK_IMPORTED_MODULE_1__.attr)({ attribute: "aria-atomic" })
], ARIAGlobalStatesAndProperties.prototype, "ariaAtomic", void 0);
(0,tslib__WEBPACK_IMPORTED_MODULE_0__.__decorate)([
    (0,_microsoft_fast_element__WEBPACK_IMPORTED_MODULE_1__.attr)({ attribute: "aria-busy" })
], ARIAGlobalStatesAndProperties.prototype, "ariaBusy", void 0);
(0,tslib__WEBPACK_IMPORTED_MODULE_0__.__decorate)([
    (0,_microsoft_fast_element__WEBPACK_IMPORTED_MODULE_1__.attr)({ attribute: "aria-controls" })
], ARIAGlobalStatesAndProperties.prototype, "ariaControls", void 0);
(0,tslib__WEBPACK_IMPORTED_MODULE_0__.__decorate)([
    (0,_microsoft_fast_element__WEBPACK_IMPORTED_MODULE_1__.attr)({ attribute: "aria-current" })
], ARIAGlobalStatesAndProperties.prototype, "ariaCurrent", void 0);
(0,tslib__WEBPACK_IMPORTED_MODULE_0__.__decorate)([
    (0,_microsoft_fast_element__WEBPACK_IMPORTED_MODULE_1__.attr)({ attribute: "aria-describedby" })
], ARIAGlobalStatesAndProperties.prototype, "ariaDescribedby", void 0);
(0,tslib__WEBPACK_IMPORTED_MODULE_0__.__decorate)([
    (0,_microsoft_fast_element__WEBPACK_IMPORTED_MODULE_1__.attr)({ attribute: "aria-details" })
], ARIAGlobalStatesAndProperties.prototype, "ariaDetails", void 0);
(0,tslib__WEBPACK_IMPORTED_MODULE_0__.__decorate)([
    (0,_microsoft_fast_element__WEBPACK_IMPORTED_MODULE_1__.attr)({ attribute: "aria-disabled" })
], ARIAGlobalStatesAndProperties.prototype, "ariaDisabled", void 0);
(0,tslib__WEBPACK_IMPORTED_MODULE_0__.__decorate)([
    (0,_microsoft_fast_element__WEBPACK_IMPORTED_MODULE_1__.attr)({ attribute: "aria-errormessage" })
], ARIAGlobalStatesAndProperties.prototype, "ariaErrormessage", void 0);
(0,tslib__WEBPACK_IMPORTED_MODULE_0__.__decorate)([
    (0,_microsoft_fast_element__WEBPACK_IMPORTED_MODULE_1__.attr)({ attribute: "aria-flowto" })
], ARIAGlobalStatesAndProperties.prototype, "ariaFlowto", void 0);
(0,tslib__WEBPACK_IMPORTED_MODULE_0__.__decorate)([
    (0,_microsoft_fast_element__WEBPACK_IMPORTED_MODULE_1__.attr)({ attribute: "aria-haspopup" })
], ARIAGlobalStatesAndProperties.prototype, "ariaHaspopup", void 0);
(0,tslib__WEBPACK_IMPORTED_MODULE_0__.__decorate)([
    (0,_microsoft_fast_element__WEBPACK_IMPORTED_MODULE_1__.attr)({ attribute: "aria-hidden" })
], ARIAGlobalStatesAndProperties.prototype, "ariaHidden", void 0);
(0,tslib__WEBPACK_IMPORTED_MODULE_0__.__decorate)([
    (0,_microsoft_fast_element__WEBPACK_IMPORTED_MODULE_1__.attr)({ attribute: "aria-invalid" })
], ARIAGlobalStatesAndProperties.prototype, "ariaInvalid", void 0);
(0,tslib__WEBPACK_IMPORTED_MODULE_0__.__decorate)([
    (0,_microsoft_fast_element__WEBPACK_IMPORTED_MODULE_1__.attr)({ attribute: "aria-keyshortcuts" })
], ARIAGlobalStatesAndProperties.prototype, "ariaKeyshortcuts", void 0);
(0,tslib__WEBPACK_IMPORTED_MODULE_0__.__decorate)([
    (0,_microsoft_fast_element__WEBPACK_IMPORTED_MODULE_1__.attr)({ attribute: "aria-label" })
], ARIAGlobalStatesAndProperties.prototype, "ariaLabel", void 0);
(0,tslib__WEBPACK_IMPORTED_MODULE_0__.__decorate)([
    (0,_microsoft_fast_element__WEBPACK_IMPORTED_MODULE_1__.attr)({ attribute: "aria-labelledby" })
], ARIAGlobalStatesAndProperties.prototype, "ariaLabelledby", void 0);
(0,tslib__WEBPACK_IMPORTED_MODULE_0__.__decorate)([
    (0,_microsoft_fast_element__WEBPACK_IMPORTED_MODULE_1__.attr)({ attribute: "aria-live" })
], ARIAGlobalStatesAndProperties.prototype, "ariaLive", void 0);
(0,tslib__WEBPACK_IMPORTED_MODULE_0__.__decorate)([
    (0,_microsoft_fast_element__WEBPACK_IMPORTED_MODULE_1__.attr)({ attribute: "aria-owns" })
], ARIAGlobalStatesAndProperties.prototype, "ariaOwns", void 0);
(0,tslib__WEBPACK_IMPORTED_MODULE_0__.__decorate)([
    (0,_microsoft_fast_element__WEBPACK_IMPORTED_MODULE_1__.attr)({ attribute: "aria-relevant" })
], ARIAGlobalStatesAndProperties.prototype, "ariaRelevant", void 0);
(0,tslib__WEBPACK_IMPORTED_MODULE_0__.__decorate)([
    (0,_microsoft_fast_element__WEBPACK_IMPORTED_MODULE_1__.attr)({ attribute: "aria-roledescription" })
], ARIAGlobalStatesAndProperties.prototype, "ariaRoledescription", void 0);


/***/ }),

/***/ "./node_modules/@microsoft/fast-foundation/dist/esm/patterns/start-end.js":
/*!********************************************************************************!*\
  !*** ./node_modules/@microsoft/fast-foundation/dist/esm/patterns/start-end.js ***!
  \********************************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "StartEnd": () => (/* binding */ StartEnd),
/* harmony export */   "endSlotTemplate": () => (/* binding */ endSlotTemplate),
/* harmony export */   "endTemplate": () => (/* binding */ endTemplate),
/* harmony export */   "startSlotTemplate": () => (/* binding */ startSlotTemplate),
/* harmony export */   "startTemplate": () => (/* binding */ startTemplate)
/* harmony export */ });
/* harmony import */ var _microsoft_fast_element__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @microsoft/fast-element */ "./node_modules/@microsoft/fast-element/dist/esm/templating/template.js");
/* harmony import */ var _microsoft_fast_element__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @microsoft/fast-element */ "./node_modules/@microsoft/fast-element/dist/esm/templating/ref.js");

/**
 * A mixin class implementing start and end elements.
 * These are generally used to decorate text elements with icons or other visual indicators.
 * @public
 */
class StartEnd {
    handleStartContentChange() {
        this.startContainer.classList.toggle("start", this.start.assignedNodes().length > 0);
    }
    handleEndContentChange() {
        this.endContainer.classList.toggle("end", this.end.assignedNodes().length > 0);
    }
}
/**
 * The template for the end element.
 * For use with {@link StartEnd}
 *
 * @public
 */
const endSlotTemplate = (context, definition) => _microsoft_fast_element__WEBPACK_IMPORTED_MODULE_0__.html `
    <span
        part="end"
        ${(0,_microsoft_fast_element__WEBPACK_IMPORTED_MODULE_1__.ref)("endContainer")}
        class=${x => (definition.end ? "end" : void 0)}
    >
        <slot name="end" ${(0,_microsoft_fast_element__WEBPACK_IMPORTED_MODULE_1__.ref)("end")} @slotchange="${x => x.handleEndContentChange()}">
            ${definition.end || ""}
        </slot>
    </span>
`;
/**
 * The template for the start element.
 * For use with {@link StartEnd}
 *
 * @public
 */
const startSlotTemplate = (context, definition) => _microsoft_fast_element__WEBPACK_IMPORTED_MODULE_0__.html `
    <span
        part="start"
        ${(0,_microsoft_fast_element__WEBPACK_IMPORTED_MODULE_1__.ref)("startContainer")}
        class="${x => (definition.start ? "start" : void 0)}"
    >
        <slot
            name="start"
            ${(0,_microsoft_fast_element__WEBPACK_IMPORTED_MODULE_1__.ref)("start")}
            @slotchange="${x => x.handleStartContentChange()}"
        >
            ${definition.start || ""}
        </slot>
    </span>
`;
/**
 * The template for the end element.
 * For use with {@link StartEnd}
 *
 * @public
 * @deprecated - use endSlotTemplate
 */
const endTemplate = _microsoft_fast_element__WEBPACK_IMPORTED_MODULE_0__.html `
    <span part="end" ${(0,_microsoft_fast_element__WEBPACK_IMPORTED_MODULE_1__.ref)("endContainer")}>
        <slot
            name="end"
            ${(0,_microsoft_fast_element__WEBPACK_IMPORTED_MODULE_1__.ref)("end")}
            @slotchange="${x => x.handleEndContentChange()}"
        ></slot>
    </span>
`;
/**
 * The template for the start element.
 * For use with {@link StartEnd}
 *
 * @public
 * @deprecated - use startSlotTemplate
 */
const startTemplate = _microsoft_fast_element__WEBPACK_IMPORTED_MODULE_0__.html `
    <span part="start" ${(0,_microsoft_fast_element__WEBPACK_IMPORTED_MODULE_1__.ref)("startContainer")}>
        <slot
            name="start"
            ${(0,_microsoft_fast_element__WEBPACK_IMPORTED_MODULE_1__.ref)("start")}
            @slotchange="${x => x.handleStartContentChange()}"
        ></slot>
    </span>
`;


/***/ }),

/***/ "./node_modules/@microsoft/fast-foundation/dist/esm/utilities/apply-mixins.js":
/*!************************************************************************************!*\
  !*** ./node_modules/@microsoft/fast-foundation/dist/esm/utilities/apply-mixins.js ***!
  \************************************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "applyMixins": () => (/* binding */ applyMixins)
/* harmony export */ });
/**
 * Apply mixins to a constructor.
 * Sourced from {@link https://www.typescriptlang.org/docs/handbook/mixins.html | TypeScript Documentation }.
 * @public
 */
function applyMixins(derivedCtor, ...baseCtors) {
    baseCtors.forEach(baseCtor => {
        Object.getOwnPropertyNames(baseCtor.prototype).forEach(name => {
            if (name !== "constructor") {
                Object.defineProperty(derivedCtor.prototype, name,
                /* eslint-disable-next-line @typescript-eslint/no-non-null-assertion */
                Object.getOwnPropertyDescriptor(baseCtor.prototype, name));
            }
        });
        if (baseCtor.attributes) {
            const existing = derivedCtor.attributes || [];
            derivedCtor.attributes = existing.concat(baseCtor.attributes);
        }
    });
}


/***/ }),

/***/ "./node_modules/@microsoft/fast-foundation/dist/esm/utilities/composed-contains.js":
/*!*****************************************************************************************!*\
  !*** ./node_modules/@microsoft/fast-foundation/dist/esm/utilities/composed-contains.js ***!
  \*****************************************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "composedContains": () => (/* binding */ composedContains)
/* harmony export */ });
/* harmony import */ var _composed_parent_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./composed-parent.js */ "./node_modules/@microsoft/fast-foundation/dist/esm/utilities/composed-parent.js");

/**
 * Determines if the reference element contains the test element in a "composed" DOM tree that
 * ignores shadow DOM boundaries.
 *
 * Returns true of the test element is a descendent of the reference, or exist in
 * a shadow DOM that is a logical descendent of the reference. Otherwise returns false.
 * @param reference - The element to test for containment against.
 * @param test - The element being tested for containment.
 *
 * @public
 */
function composedContains(reference, test) {
    let current = test;
    while (current !== null) {
        if (current === reference) {
            return true;
        }
        current = (0,_composed_parent_js__WEBPACK_IMPORTED_MODULE_0__.composedParent)(current);
    }
    return false;
}


/***/ }),

/***/ "./node_modules/@microsoft/fast-foundation/dist/esm/utilities/composed-parent.js":
/*!***************************************************************************************!*\
  !*** ./node_modules/@microsoft/fast-foundation/dist/esm/utilities/composed-parent.js ***!
  \***************************************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "composedParent": () => (/* binding */ composedParent)
/* harmony export */ });
/**
 * Retrieves the "composed parent" element of a node, ignoring DOM tree boundaries.
 * When the parent of a node is a shadow-root, it will return the host
 * element of the shadow root. Otherwise it will return the parent node or null if
 * no parent node exists.
 * @param element - The element for which to retrieve the composed parent
 *
 * @public
 */
function composedParent(element) {
    const parentNode = element.parentElement;
    if (parentNode) {
        return parentNode;
    }
    else {
        const rootNode = element.getRootNode();
        if (rootNode.host instanceof HTMLElement) {
            // this is shadow-root
            return rootNode.host;
        }
    }
    return null;
}


/***/ }),

/***/ "./node_modules/@microsoft/fast-foundation/dist/esm/utilities/match-media-stylesheet-behavior.js":
/*!*******************************************************************************************************!*\
  !*** ./node_modules/@microsoft/fast-foundation/dist/esm/utilities/match-media-stylesheet-behavior.js ***!
  \*******************************************************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "MatchMediaBehavior": () => (/* binding */ MatchMediaBehavior),
/* harmony export */   "MatchMediaStyleSheetBehavior": () => (/* binding */ MatchMediaStyleSheetBehavior),
/* harmony export */   "darkModeStylesheetBehavior": () => (/* binding */ darkModeStylesheetBehavior),
/* harmony export */   "forcedColorsStylesheetBehavior": () => (/* binding */ forcedColorsStylesheetBehavior),
/* harmony export */   "lightModeStylesheetBehavior": () => (/* binding */ lightModeStylesheetBehavior)
/* harmony export */ });
/**
 * An abstract behavior to react to media queries. Implementations should implement
 * the `constructListener` method to perform some action based on media query changes.
 *
 * @public
 */
class MatchMediaBehavior {
    /**
     *
     * @param query - The media query to operate from.
     */
    constructor(query) {
        /**
         * The behavior needs to operate on element instances but elements might share a behavior instance.
         * To ensure proper attachment / detachment per instance, we construct a listener for
         * each bind invocation and cache the listeners by element reference.
         */
        this.listenerCache = new WeakMap();
        this.query = query;
    }
    /**
     * Binds the behavior to the element.
     * @param source - The element for which the behavior is bound.
     */
    bind(source) {
        const { query } = this;
        const listener = this.constructListener(source);
        // Invoke immediately to add if the query currently matches
        listener.bind(query)();
        query.addListener(listener);
        this.listenerCache.set(source, listener);
    }
    /**
     * Unbinds the behavior from the element.
     * @param source - The element for which the behavior is unbinding.
     */
    unbind(source) {
        const listener = this.listenerCache.get(source);
        if (listener) {
            this.query.removeListener(listener);
            this.listenerCache.delete(source);
        }
    }
}
/**
 * A behavior to add or remove a stylesheet from an element based on a media query. The behavior ensures that
 * styles are applied while the a query matches the environment and that styles are not applied if the query does
 * not match the environment.
 *
 * @public
 */
class MatchMediaStyleSheetBehavior extends MatchMediaBehavior {
    /**
     * Constructs a {@link MatchMediaStyleSheetBehavior} instance.
     * @param query - The media query to operate from.
     * @param styles - The styles to coordinate with the query.
     */
    constructor(query, styles) {
        super(query);
        this.styles = styles;
    }
    /**
     * Defines a function to construct {@link MatchMediaStyleSheetBehavior | MatchMediaStyleSheetBehaviors} for
     * a provided query.
     * @param query - The media query to operate from.
     *
     * @public
     * @example
     *
     * ```ts
     * import { css } from "@microsoft/fast-element";
     * import { MatchMediaStyleSheetBehavior } from "@microsoft/fast-foundation";
     *
     * const landscapeBehavior = MatchMediaStyleSheetBehavior.with(
     *   window.matchMedia("(orientation: landscape)")
     * );
     * const styles = css`
     *   :host {
     *     width: 200px;
     *     height: 400px;
     *   }
     * `
     * .withBehaviors(landscapeBehavior(css`
     *   :host {
     *     width: 400px;
     *     height: 200px;
     *   }
     * `))
     * ```
     */
    static with(query) {
        return (styles) => {
            return new MatchMediaStyleSheetBehavior(query, styles);
        };
    }
    /**
     * Constructs a match-media listener for a provided element.
     * @param source - the element for which to attach or detach styles.
     * @internal
     */
    constructListener(source) {
        let attached = false;
        const styles = this.styles;
        return function listener() {
            const { matches } = this;
            if (matches && !attached) {
                source.$fastController.addStyles(styles);
                attached = matches;
            }
            else if (!matches && attached) {
                source.$fastController.removeStyles(styles);
                attached = matches;
            }
        };
    }
    /**
     * Unbinds the behavior from the element.
     * @param source - The element for which the behavior is unbinding.
     * @internal
     */
    unbind(source) {
        super.unbind(source);
        source.$fastController.removeStyles(this.styles);
    }
}
/**
 * This can be used to construct a behavior to apply a forced-colors only stylesheet.
 * @public
 */
const forcedColorsStylesheetBehavior = MatchMediaStyleSheetBehavior.with(window.matchMedia("(forced-colors)"));
/**
 * This can be used to construct a behavior to apply a prefers color scheme: dark only stylesheet.
 * @public
 */
const darkModeStylesheetBehavior = MatchMediaStyleSheetBehavior.with(window.matchMedia("(prefers-color-scheme: dark)"));
/**
 * This can be used to construct a behavior to apply a prefers color scheme: light only stylesheet.
 * @public
 */
const lightModeStylesheetBehavior = MatchMediaStyleSheetBehavior.with(window.matchMedia("(prefers-color-scheme: light)"));


/***/ }),

/***/ "./node_modules/@microsoft/fast-foundation/dist/esm/utilities/property-stylesheet-behavior.js":
/*!****************************************************************************************************!*\
  !*** ./node_modules/@microsoft/fast-foundation/dist/esm/utilities/property-stylesheet-behavior.js ***!
  \****************************************************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "PropertyStyleSheetBehavior": () => (/* binding */ PropertyStyleSheetBehavior)
/* harmony export */ });
/* harmony import */ var _microsoft_fast_element__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @microsoft/fast-element */ "./node_modules/@microsoft/fast-element/dist/esm/observation/observable.js");

/**
 * A behavior to add or remove a stylesheet from an element based on a property. The behavior ensures that
 * styles are applied while the property matches and that styles are not applied if the property does
 * not match.
 *
 * @public
 */
class PropertyStyleSheetBehavior {
    /**
     * Constructs a {@link PropertyStyleSheetBehavior} instance.
     * @param propertyName - The property name to operate from.
     * @param value - The property value to operate from.
     * @param styles - The styles to coordinate with the property.
     */
    constructor(propertyName, value, styles) {
        this.propertyName = propertyName;
        this.value = value;
        this.styles = styles;
    }
    /**
     * Binds the behavior to the element.
     * @param elementInstance - The element for which the property is applied.
     */
    bind(elementInstance) {
        _microsoft_fast_element__WEBPACK_IMPORTED_MODULE_0__.Observable.getNotifier(elementInstance).subscribe(this, this.propertyName);
        this.handleChange(elementInstance, this.propertyName);
    }
    /**
     * Unbinds the behavior from the element.
     * @param source - The element for which the behavior is unbinding.
     * @internal
     */
    unbind(source) {
        _microsoft_fast_element__WEBPACK_IMPORTED_MODULE_0__.Observable.getNotifier(source).unsubscribe(this, this.propertyName);
        source.$fastController.removeStyles(this.styles);
    }
    /**
     * Change event for the provided element.
     * @param source - the element for which to attach or detach styles.
     * @param key - the key to lookup to know if the element already has the styles
     * @internal
     */
    handleChange(source, key) {
        if (source[key] === this.value) {
            source.$fastController.addStyles(this.styles);
        }
        else {
            source.$fastController.removeStyles(this.styles);
        }
    }
}


/***/ }),

/***/ "./node_modules/@microsoft/fast-foundation/dist/esm/utilities/style/display.js":
/*!*************************************************************************************!*\
  !*** ./node_modules/@microsoft/fast-foundation/dist/esm/utilities/style/display.js ***!
  \*************************************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "display": () => (/* binding */ display),
/* harmony export */   "hidden": () => (/* binding */ hidden)
/* harmony export */ });
/**
 * A CSS fragment to set `display: none;` when the host is hidden using the [hidden] attribute.
 * @public
 */
const hidden = `:host([hidden]){display:none}`;
/**
 * Applies a CSS display property.
 * Also adds CSS rules to not display the element when the [hidden] attribute is applied to the element.
 * @param display - The CSS display property value
 * @public
 */
function display(displayValue) {
    return `${hidden}:host{display:${displayValue}}`;
}


/***/ }),

/***/ "./node_modules/@microsoft/fast-foundation/dist/esm/utilities/style/focus.js":
/*!***********************************************************************************!*\
  !*** ./node_modules/@microsoft/fast-foundation/dist/esm/utilities/style/focus.js ***!
  \***********************************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "focusVisible": () => (/* binding */ focusVisible)
/* harmony export */ });
/* harmony import */ var _microsoft_fast_web_utilities__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @microsoft/fast-web-utilities */ "./node_modules/@microsoft/fast-foundation/node_modules/@microsoft/fast-web-utilities/dist/dom.js");

/**
 * The string representing the focus selector to be used. Value
 * will be "focus-visible" when https://drafts.csswg.org/selectors-4/#the-focus-visible-pseudo
 * is supported and "focus" when it is not.
 *
 * @public
 */
const focusVisible = (0,_microsoft_fast_web_utilities__WEBPACK_IMPORTED_MODULE_0__.canUseFocusVisible)() ? "focus-visible" : "focus";


/***/ }),

/***/ "./node_modules/@microsoft/fast-foundation/node_modules/@microsoft/fast-web-utilities/dist/dom.js":
/*!********************************************************************************************************!*\
  !*** ./node_modules/@microsoft/fast-foundation/node_modules/@microsoft/fast-web-utilities/dist/dom.js ***!
  \********************************************************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "canUseCssGrid": () => (/* binding */ canUseCssGrid),
/* harmony export */   "canUseFocusVisible": () => (/* binding */ canUseFocusVisible),
/* harmony export */   "canUseForcedColors": () => (/* binding */ canUseForcedColors),
/* harmony export */   "canUsedForcedColors": () => (/* binding */ canUsedForcedColors),
/* harmony export */   "getDisplayedNodes": () => (/* binding */ getDisplayedNodes),
/* harmony export */   "getKeyCode": () => (/* binding */ getKeyCode),
/* harmony export */   "isHTMLElement": () => (/* binding */ isHTMLElement),
/* harmony export */   "resetDocumentCache": () => (/* binding */ resetDocumentCache)
/* harmony export */ });
/* harmony import */ var exenv_es6__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! exenv-es6 */ "../../node_modules/exenv-es6/dist/can-use-dom.js");

/**
 * A test that ensures that all arguments are HTML Elements
 */
function isHTMLElement(...args) {
    return args.every((arg) => arg instanceof HTMLElement);
}
/**
 * Returns all displayed elements inside of a root node that match a provided selector
 */
function getDisplayedNodes(rootNode, selector) {
    if (!rootNode || !selector || !isHTMLElement(rootNode)) {
        return;
    }
    const nodes = Array.from(rootNode.querySelectorAll(selector));
    // offsetParent will be null if the element isn't currently displayed,
    // so this will allow us to operate only on visible nodes
    return nodes.filter((node) => node.offsetParent !== null);
}
/**
 * Gets the numeric key code associated with a keyboard event. This method is for use with DOM level 3 events
 * that still use the deprecated keyCode property.
 */
function getKeyCode(event) {
    return event === null ? null : event.which || event.keyCode || event.charCode;
}
/**
 * Returns the nonce used in the page, if any.
 *
 * Based on https://github.com/cssinjs/jss/blob/master/packages/jss/src/DomRenderer.js
 */
function getNonce() {
    const node = document.querySelector('meta[property="csp-nonce"]');
    if (node) {
        return node.getAttribute("content");
    }
    else {
        return null;
    }
}
/**
 * Test if the document supports :focus-visible
 */
let _canUseFocusVisible;
function canUseFocusVisible() {
    if (typeof _canUseFocusVisible === "boolean") {
        return _canUseFocusVisible;
    }
    if (!(0,exenv_es6__WEBPACK_IMPORTED_MODULE_0__.canUseDOM)()) {
        _canUseFocusVisible = false;
        return _canUseFocusVisible;
    }
    // Check to see if the document supports the focus-visible element
    const styleElement = document.createElement("style");
    // If nonces are present on the page, use it when creating the style element
    // to test focus-visible support.
    const styleNonce = getNonce();
    if (styleNonce !== null) {
        styleElement.setAttribute("nonce", styleNonce);
    }
    document.head.appendChild(styleElement);
    try {
        styleElement.sheet.insertRule("foo:focus-visible {color:inherit}", 0);
        _canUseFocusVisible = true;
    }
    catch (e) {
        _canUseFocusVisible = false;
    }
    finally {
        document.head.removeChild(styleElement);
    }
    return _canUseFocusVisible;
}
let _canUseCssGrid;
function canUseCssGrid() {
    if (typeof _canUseCssGrid === "boolean") {
        return _canUseCssGrid;
    }
    try {
        _canUseCssGrid = CSS.supports("display", "grid");
    }
    catch (_a) {
        _canUseCssGrid = false;
    }
    return _canUseCssGrid;
}
function canUseForcedColors() {
    return ((0,exenv_es6__WEBPACK_IMPORTED_MODULE_0__.canUseDOM)() &&
        (window.matchMedia("(forced-colors: none)").matches ||
            window.matchMedia("(forced-colors: active)").matches));
}
function resetDocumentCache() {
    _canUseCssGrid = undefined;
    _canUseFocusVisible = undefined;
}
/**
 * @deprecated Use 'canUseForcedColors' instead
 */
const canUsedForcedColors = canUseForcedColors;


/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/************************************************************************/
/******/ 	/* webpack/runtime/compat get default export */
/******/ 	(() => {
/******/ 		// getDefaultExport function for compatibility with non-harmony modules
/******/ 		__webpack_require__.n = (module) => {
/******/ 			var getter = module && module.__esModule ?
/******/ 				() => (module['default']) :
/******/ 				() => (module);
/******/ 			__webpack_require__.d(getter, { a: getter });
/******/ 			return getter;
/******/ 		};
/******/ 	})();
/******/
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/
/************************************************************************/
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be in strict mode.
(() => {
"use strict";
/*!**************************!*\
  !*** ./src/app/index.ts ***!
  \**************************/
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _microsoft_fast_components__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @microsoft/fast-components */ "./node_modules/@microsoft/fast-components/dist/esm/fast-design-system.js");
/* harmony import */ var _microsoft_fast_components__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @microsoft/fast-components */ "./node_modules/@microsoft/fast-components/dist/esm/anchor/index.js");
/* harmony import */ var _css_style_css__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./css/style.css */ "./src/app/css/style.css");
/* harmony import */ var _css_style_css__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_css_style_css__WEBPACK_IMPORTED_MODULE_0__);


(0,_microsoft_fast_components__WEBPACK_IMPORTED_MODULE_1__.provideFASTDesignSystem)().register([(0,_microsoft_fast_components__WEBPACK_IMPORTED_MODULE_2__.fastAnchor)()]);
// baseLayerLuminance.setValueFor(document.body, 0.09);
// export * from "./components";

})();

/******/ })()
;
