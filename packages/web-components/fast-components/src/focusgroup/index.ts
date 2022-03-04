import { Focusgroup, FocusgroupTemplate as template } from "@microsoft/fast-foundation";

/**
 * A function that regesiters the fast-focusgroup component
 */
export const fastFocusgroup = Focusgroup.compose({
    baseName: "focusgroup",
    template,
    shadowOptions: {
        mode: "open",
    },
});
