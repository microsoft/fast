import {
    accentColorCSSProperty,
    controlWrapperStyle,
    L1CSSProperty,
    L3CSSProperty,
} from "../../style";
/**
 * Base64 encoded svgs
 */
export const lightTheme =
    "url(data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTQiIGhlaWdodD0iMTUiIHZpZXdCb3g9IjAgMCAxNCAxNSIgdmVyc2lvbj0iMS4xIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIj48ZyBpZD0iQ2FudmFzIiBmaWxsPSJub25lIj48ZyBpZD0iQSI+PHBhdGggZD0iTSAxMy45MTYgMjJMIDEwLjQ3ODUgMjJMIDkuNDgyNDIgMTguODg0OEwgNC41MDE5NSAxOC44ODQ4TCAzLjUxNTYyIDIyTCAwLjA5NzY1NjIgMjJMIDUuMTk1MzEgNy45OTYwOUwgOC45MzU1NSA3Ljk5NjA5TCAxMy45MTYgMjJaTSA4Ljc1OTc3IDE2LjQ2MjlMIDcuMjU1ODYgMTEuNzU1OUMgNy4xNDUxOCAxMS40MDQzIDcuMDY3MDYgMTAuOTg0NCA3LjAyMTQ4IDEwLjQ5NjFMIDYuOTQzMzYgMTAuNDk2MUMgNi45MTA4MSAxMC45MDYyIDYuODI5NDMgMTEuMzEzMiA2LjY5OTIyIDExLjcxNjhMIDUuMTc1NzggMTYuNDYyOUwgOC43NTk3NyAxNi40NjI5WiIgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoMCAtNykiIGZpbGw9ImJsYWNrIi8+PC9nPjwvZz48L3N2Zz4=) center no-repeat";
export const darkTheme =
    "url(data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTQiIGhlaWdodD0iMTUiIHZpZXdCb3g9IjAgMCAxNCAxNSIgdmVyc2lvbj0iMS4xIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIj48ZyBpZD0iQ2FudmFzIiBmaWxsPSJub25lIj48ZyBpZD0iQSI+PHBhdGggZD0iTSAxMy45MTYgMjJMIDEwLjQ3ODUgMjJMIDkuNDgyNDIgMTguODg0OEwgNC41MDE5NSAxOC44ODQ4TCAzLjUxNTYyIDIyTCAwLjA5NzY1NjIgMjJMIDUuMTk1MzEgNy45OTYwOUwgOC45MzU1NSA3Ljk5NjA5TCAxMy45MTYgMjJaTSA4Ljc1OTc3IDE2LjQ2MjlMIDcuMjU1ODYgMTEuNzU1OUMgNy4xNDUxOCAxMS40MDQzIDcuMDY3MDYgMTAuOTg0NCA3LjAyMTQ4IDEwLjQ5NjFMIDYuOTQzMzYgMTAuNDk2MUMgNi45MTA4MSAxMC45MDYyIDYuODI5NDMgMTEuMzEzMiA2LjY5OTIyIDExLjcxNjhMIDUuMTc1NzggMTYuNDYyOUwgOC43NTk3NyAxNi40NjI5WiIgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoMCAtNykiIGZpbGw9IndoaXRlIi8+PC9nPjwvZz48L3N2Zz4=) center no-repeat";
const styles = {
    themeControl: Object.assign({ display: "flex" }, controlWrapperStyle),
    themeControl__disabled: {},
    themeControl_input: {
        appearance: "none",
        height: "20px",
        width: "20px",
        margin: "0",
        borderRadius: "2px",
        "&:checked, &:focus": {
            outline: "none",
            "background-color": accentColorCSSProperty,
        },
    },
    themeControl_input__light: {
        background: lightTheme,
        "background-color": L1CSSProperty,
    },
    themeControl_input__dark: {
        background: darkTheme,
        "background-color": L3CSSProperty,
    },
};
export default styles;
