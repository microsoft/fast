/*
 * Key Code values
 * @deprecated - use individual keycode exports
 */
export enum KeyCodes {
    alt = 18,
    arrowDown = 40,
    arrowLeft = 37,
    arrowRight = 39,
    arrowUp = 38,
    back = 8,
    backSlash = 220,
    break = 19,
    capsLock = 20,
    closeBracket = 221,
    colon = 186,
    colon2 = 59, // Opera and Firefox
    comma = 188,
    ctrl = 17,
    delete = 46,
    end = 35,
    enter = 13,
    equals = 187,
    equals2 = 61, // Opera
    equals3 = 107, // Firefox
    escape = 27,
    forwardSlash = 191,
    function1 = 112,
    function10 = 121,
    function11 = 122,
    function12 = 123,
    function2 = 113,
    function3 = 114,
    function4 = 115,
    function5 = 116,
    function6 = 117,
    function7 = 118,
    function8 = 119,
    function9 = 120,
    home = 36,
    insert = 45,
    menu = 93,
    minus = 189,
    minus2 = 109, // Opera and Firefox
    numLock = 144,
    numPad0 = 96,
    numPad1 = 97,
    numPad2 = 98,
    numPad3 = 99,
    numPad4 = 100,
    numPad5 = 101,
    numPad6 = 102,
    numPad7 = 103,
    numPad8 = 104,
    numPad9 = 105,
    numPadDivide = 111,
    numPadDot = 110,
    numPadMinus = 109,
    numPadMultiply = 106,
    numPadPlus = 107,
    openBracket = 219,
    pageDown = 34,
    pageUp = 33,
    period = 190,
    print = 44,
    quote = 222,
    scrollLock = 145,
    shift = 16,
    space = 32,
    tab = 9,
    tilde = 192,
    windowsLeft = 91,
    windowsOpera = 219, // Opera
    windowsRight = 92,
}

export const keyCodeAlt: number = 18;
export const keyCodeArrowDown: number = 40;
export const keyCodeArrowLeft: number = 37;
export const keyCodeArrowRight: number = 39;
export const keyCodeArrowUp: number = 38;
export const keyCodeBack: number = 8;
export const keyCodeBackSlash: number = 220;
export const keyCodeBreak: number = 19;
export const keyCodeCapsLock: number = 20;
export const keyCodeCloseBracket: number = 221;
export const keyCodeColon: number = 186;
export const keyCodeColon2: number = 59; // Opera and Firefox
export const keyCodeComma: number = 188;
export const keyCodeCtrl: number = 17;
export const keyCodeDelete: number = 46;
export const keyCodeEnd: number = 35;
export const keyCodeEnter: number = 13;
export const keyCodeEquals: number = 187;
export const keyCodeEquals2: number = 61; // Opera
export const keyCodeEquals3: number = 107; // Firefox
export const keyCodeEscape: number = 27;
export const keyCodeForwardSlash: number = 191;
export const keyCodeFunction1: number = 112;
export const keyCodeFunction10: number = 121;
export const keyCodeFunction11: number = 122;
export const keyCodeFunction12: number = 123;
export const keyCodeFunction2: number = 113;
export const keyCodeFunction3: number = 114;
export const keyCodeFunction4: number = 115;
export const keyCodeFunction5: number = 116;
export const keyCodeFunction6: number = 117;
export const keyCodeFunction7: number = 118;
export const keyCodeFunction8: number = 119;
export const keyCodeFunction9: number = 120;
export const keyCodeHome: number = 36;
export const keyCodeInsert: number = 45;
export const keyCodeMenu: number = 93;
export const keyCodeMinus: number = 189;
export const keyCodeMinus2: number = 109; // Opera and Firefox
export const keyCodeNumLock: number = 144;
export const keyCodeNumPad0: number = 96;
export const keyCodeNumPad1: number = 97;
export const keyCodeNumPad2: number = 98;
export const keyCodeNumPad3: number = 99;
export const keyCodeNumPad4: number = 100;
export const keyCodeNumPad5: number = 101;
export const keyCodeNumPad6: number = 102;
export const keyCodeNumPad7: number = 103;
export const keyCodeNumPad8: number = 104;
export const keyCodeNumPad9: number = 105;
export const keyCodeNumPadDivide: number = 111;
export const keyCodeNumPadDot: number = 110;
export const keyCodeNumPadMinus: number = 109;
export const keyCodeNumPadMultiply: number = 106;
export const keyCodeNumPadPlus: number = 107;
export const keyCodeOpenBracket: number = 219;
export const keyCodePageDown: number = 34;
export const keyCodePageUp: number = 33;
export const keyCodePeriod: number = 190;
export const keyCodePrint: number = 44;
export const keyCodeQuote: number = 222;
export const keyCodeScrollLock: number = 145;
export const keyCodeShift: number = 16;
export const keyCodeSpace: number = 32;
export const keyCodeTab: number = 9;
export const keyCodeTilde: number = 192;
export const keyCodeWindowsLeft: number = 91;
export const keyCodeWindowsOpera: number = 219; // Opera
export const keyCodeWindowsRight: number = 92;

/**
 * String values for use with KeyboardEvent.key
 */
export const keyArrowDown: "ArrowDown" = "ArrowDown";
export const keyArrowLeft: "ArrowLeft" = "ArrowLeft";
export const keyArrowRight: "ArrowRight" = "ArrowRight";
export const keyArrowUp: "ArrowUp" = "ArrowUp";
export const keyEnter: "Enter" = "Enter";
export const keyEscape: "Escape" = "Escape";
export const keyHome: "Home" = "Home";
export const keyEnd: "End" = "End";
export const keySpace: " " = " ";
export const keyTab: "Tab" = "Tab";

export const ArrowKeys = {
    ArrowDown: keyArrowDown,
    ArrowLeft: keyArrowLeft,
    ArrowRight: keyArrowRight,
    ArrowUp: keyArrowUp,
} as const;

export type ArrowKeys = typeof ArrowKeys[keyof typeof ArrowKeys];
