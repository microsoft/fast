import {
    applyControl,
    applyInputBackplateStyle,
    applyInputContainerStyle,
    applyLabelStyle,
    applySoftRemove,
    applySoftRemoveInput,
    colors,
} from "../utilities/form-input.style";
import { ComponentStyles, CSSRules } from "@microsoft/fast-jss-manager";
import { FormItemAlignVerticalClassNameContract } from "../class-name-contracts/";

/* tslint:disable */
const topDark: string =
    "url(data:image/svg+xml;base64,PHN2ZyBpZD0iTGF5ZXJfMSIgZGF0YS1uYW1lPSJMYXllciAxIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAxNiAxNiI+PHRpdGxlPnZ0MjwvdGl0bGU+PHBhdGggZD0iTTExLjYxLDQuNTl2LjQ2SDQuNDFWNC41OVptLTUuODYuOTNoMS44djUuOTFINS43NVpNNi4yMSwxMWguOTJWNkg2LjIxWk04LjQ3LDUuNTJoMS44VjkuNThIOC40N1ptLjQ2LDMuNjVoLjkzVjZIOC45M1oiLz48L3N2Zz4=) center no-repeat";
const topLight: string =
    "url(data:image/svg+xml;base64,PHN2ZyBpZD0iTGF5ZXJfMSIgZGF0YS1uYW1lPSJMYXllciAxIiBmaWxsPSJ3aGl0ZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB2aWV3Qm94PSIwIDAgMTYgMTYiPjx0aXRsZT52dDI8L3RpdGxlPjxwYXRoIGQ9Ik0xMS42MSw0LjU5di40Nkg0LjQxVjQuNTlabS01Ljg2LjkzaDEuOHY1LjkxSDUuNzVaTTYuMjEsMTFoLjkyVjZINi4yMVpNOC40Nyw1LjUyaDEuOFY5LjU4SDguNDdabS40NiwzLjY1aC45M1Y2SDguOTNaIi8+PC9zdmc+) center no-repeat";
const centerDark: string =
    "url(data:image/svg+xml;base64,PHN2ZyBpZD0iTGF5ZXJfMSIgZGF0YS1uYW1lPSJMYXllciAxIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAxNiAxNiI+PHRpdGxlPnZtMjwvdGl0bGU+PHBhdGggZD0iTTEyLjE5LDguMjRIMTAuNjR2Mi4xSDguNTRWOC4yNEg3LjQ3djMuMTdINS4zOFY4LjI0SDMuODNWNy43SDUuMzhWNC41M0g3LjQ3VjcuN0g4LjU0VjUuNjFoMi4xVjcuN2gxLjU1Wk02Ljk0LDUuMDdINS44NnY1LjhINi45NFpNMTAuMSw2LjE0SDlWOS44NUgxMC4xWiIvPjwvc3ZnPg==) center no-repeat";
const centerLight: string =
    "url(data:image/svg+xml;base64,PHN2ZyBpZD0iTGF5ZXJfMSIgZGF0YS1uYW1lPSJMYXllciAxIiBmaWxsPSJ3aGl0ZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB2aWV3Qm94PSIwIDAgMTYgMTYiPjx0aXRsZT52bTI8L3RpdGxlPjxwYXRoIGQ9Ik0xMi4xOSw4LjI0SDEwLjY0djIuMUg4LjU0VjguMjRINy40N3YzLjE3SDUuMzhWOC4yNEgzLjgzVjcuN0g1LjM4VjQuNTNINy40N1Y3LjdIOC41NFY1LjYxaDIuMVY3LjdoMS41NVpNNi45NCw1LjA3SDUuODZ2NS44SDYuOTRaTTEwLjEsNi4xNEg5VjkuODVIMTAuMVoiLz48L3N2Zz4=) center no-repeat";
const bottomDark: string =
    "url(data:image/svg+xml;base64,PHN2ZyBpZD0iTGF5ZXJfMSIgZGF0YS1uYW1lPSJMYXllciAxIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAxNiAxNiI+PHRpdGxlPnZiMjwvdGl0bGU+PHBhdGggZD0iTTExLjYzLDExdi40Nkg0LjM3VjExWm0tNC4wOS0uNDdINS43MlY0LjU2SDcuNTRaTTcuMDcsNUg2LjE0djVoLjkzWm0zLjIxLDUuNDlIOC40NlY2LjQyaDEuODJaTTkuODEsNi44NEg4Ljg4djMuMjFoLjkzWiIvPjwvc3ZnPg==) center no-repeat";
const bottomLight: string =
    "url(data:image/svg+xml;base64,PHN2ZyBpZD0iTGF5ZXJfMSIgZmlsbD0id2hpdGUiIGRhdGEtbmFtZT0iTGF5ZXIgMSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB2aWV3Qm94PSIwIDAgMTYgMTYiPjx0aXRsZT52YjI8L3RpdGxlPjxwYXRoIGQ9Ik0xMS42MywxMXYuNDZINC4zN1YxMVptLTQuMDktLjQ3SDUuNzJWNC41Nkg3LjU0Wk03LjA3LDVINi4xNHY1aC45M1ptMy4yMSw1LjQ5SDguNDZWNi40MmgxLjgyWk05LjgxLDYuODRIOC44OHYzLjIxaC45M1oiLz48L3N2Zz4=) center no-repeat";
/* tslint:enable */

const styles: ComponentStyles<FormItemAlignVerticalClassNameContract, {}> = {
    formItemAlignVertical: {
        display: "block",
        position: "relative",
    },
    formItemAlignVertical_control: {
        ...applyControl(),
    },
    formItemAlignVertical_control_label: {
        ...applyLabelStyle(),
        display: "block",
        marginTop: "12px",
    },
    formItemAlignVertical_control_inputContainer: {
        ...applyInputContainerStyle(),
    },
    formItemAlignVertical_control_input__top: {
        ...applyInputBackplateStyle(),
        background: topDark,
        "&:checked": {
            background: topLight,
            backgroundColor: colors.pink,
        },
    },
    formItemAlignVertical_control_input__center: {
        ...applyInputBackplateStyle(),
        background: centerDark,
        "&:checked": {
            background: centerLight,
            backgroundColor: colors.pink,
        },
    },
    formItemAlignVertical_control_input__bottom: {
        ...applyInputBackplateStyle(),
        background: bottomDark,
        "&:checked": {
            background: bottomLight,
            backgroundColor: colors.pink,
        },
    },
    formItemAlignVertical_softRemove: {
        ...applySoftRemove(),
    },
    formItemAlignVertical_softRemove_input: {
        ...applySoftRemoveInput(),
    },
};

export default styles;
