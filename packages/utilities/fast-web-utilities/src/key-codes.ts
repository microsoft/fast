/**
 * String values for use with KeyboardEvent.key
 */
export const keyAlt: "Alt" = "Alt" as const;
export const keyAltGraph: "AltGraph" = "AltGraph" as const;
export const keyCapsLock: "CapsLock" = "CapsLock" as const;
export const keyControl: "Control" = "Control" as const;
export const keyArrowDown: "ArrowDown" = "ArrowDown" as const;
export const keyArrowLeft: "ArrowLeft" = "ArrowLeft" as const;
export const keyArrowRight: "ArrowRight" = "ArrowRight" as const;
export const keyArrowUp: "ArrowUp" = "ArrowUp" as const;
export const keyBackspace: "Backspace" = "Backspace" as const;
export const keyDelete: "Delete" = "Delete" as const;
export const keyEnd: "End" = "End" as const;
export const keyEnter: "Enter" = "Enter" as const;
export const keyEscape: "Escape" = "Escape" as const;
export const keyHome: "Home" = "Home" as const;
export const keyFunction: "Fn" = "Fn" as const;
export const keyFunctionLock: "FnLock" = "FnLock" as const;
export const keyFunction2: "F2" = "F2" as const;
export const keyFunction3: "F3" = "F3" as const;
export const keyFunction4: "F4" = "F4" as const;
export const keyFunction5: "F5" = "F5" as const;
export const keyFunction6: "F6" = "F6" as const;
export const keyFunction7: "F7" = "F7" as const;
export const keyFunction8: "F8" = "F8" as const;
export const keyFunction9: "F9" = "F9" as const;
export const keyFunction10: "F10" = "F10" as const;
export const keyFunction11: "F11" = "F11" as const;
export const keyFunction12: "F12" = "F12" as const;
export const keyFunction13: "F13" = "F13" as const;
export const keyFunction14: "F14" = "F14" as const;
export const keyFunction15: "F15" = "F15" as const;
export const keyNumLock: "NumLock" = "NumLock" as const;
export const keyPageDown: "PageDown" = "PageDown" as const;
export const keyPageUp: "PageUp" = "PageUp" as const;
export const keyScrollLock: "ScrollLock" = "ScrollLock" as const;
export const keyShift: "Shift" = "Shift" as const;
export const keySpace: " " = " " as const;
export const keyTab: "Tab" = "Tab" as const;

export const ArrowKeys = {
    ArrowDown: keyArrowDown,
    ArrowLeft: keyArrowLeft,
    ArrowRight: keyArrowRight,
    ArrowUp: keyArrowUp,
} as const;

export type ArrowKeys = (typeof ArrowKeys)[keyof typeof ArrowKeys];
