import { ComponentStyles, CSSRules } from "@microsoft/fast-jss-manager";
import {
    accent,
    applyControl,
    applyControlWrapper,
    applyInputBackplateStyle,
    applyLabelStyle,
    applySoftRemove,
    applySoftRemoveInput,
    background300,
} from "../../style";
import { AlignClassNameContract } from "./align.props";

/* tslint:disable */
const topLight: string =
    "url(data:image/svg+xml;base64,PHN2ZyBpZD0iTGF5ZXJfMSIgZGF0YS1uYW1lPSJMYXllciAxIiBmaWxsPSJ3aGl0ZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB2aWV3Qm94PSIwIDAgMTYgMTYiPjx0aXRsZT52dDI8L3RpdGxlPjxwYXRoIGQ9Ik0xMS42MSw0LjU5di40Nkg0LjQxVjQuNTlabS01Ljg2LjkzaDEuOHY1LjkxSDUuNzVaTTYuMjEsMTFoLjkyVjZINi4yMVpNOC40Nyw1LjUyaDEuOFY5LjU4SDguNDdabS40NiwzLjY1aC45M1Y2SDguOTNaIi8+PC9zdmc+) center no-repeat";
const centerLight: string =
    "url(data:image/svg+xml;base64,PHN2ZyBpZD0iTGF5ZXJfMSIgZGF0YS1uYW1lPSJMYXllciAxIiBmaWxsPSJ3aGl0ZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB2aWV3Qm94PSIwIDAgMTYgMTYiPjx0aXRsZT52bTI8L3RpdGxlPjxwYXRoIGQ9Ik0xMi4xOSw4LjI0SDEwLjY0djIuMUg4LjU0VjguMjRINy40N3YzLjE3SDUuMzhWOC4yNEgzLjgzVjcuN0g1LjM4VjQuNTNINy40N1Y3LjdIOC41NFY1LjYxaDIuMVY3LjdoMS41NVpNNi45NCw1LjA3SDUuODZ2NS44SDYuOTRaTTEwLjEsNi4xNEg5VjkuODVIMTAuMVoiLz48L3N2Zz4=) center no-repeat";
const bottomLight: string =
    "url(data:image/svg+xml;base64,PHN2ZyBpZD0iTGF5ZXJfMSIgZmlsbD0id2hpdGUiIGRhdGEtbmFtZT0iTGF5ZXIgMSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB2aWV3Qm94PSIwIDAgMTYgMTYiPjx0aXRsZT52YjI8L3RpdGxlPjxwYXRoIGQ9Ik0xMS42MywxMXYuNDZINC4zN1YxMVptLTQuMDktLjQ3SDUuNzJWNC41Nkg3LjU0Wk03LjA3LDVINi4xNHY1aC45M1ptMy4yMSw1LjQ5SDguNDZWNi40MmgxLjgyWk05LjgxLDYuODRIOC44OHYzLjIxaC45M1oiLz48L3N2Zz4=) center no-repeat";
/* tslint:enable */

const styles: ComponentStyles<AlignClassNameContract, {}> = {
    align: {
        display: "flex",
        ...applyControlWrapper(),
    },
    align_control: {
        ...applyControl(),
    },
    align_controlLabel: {
        ...applyLabelStyle(),
    },
    align_controlInputContainer: {
        height: "20px",
    },
    align_controlInput__top: {
        ...applyInputBackplateStyle(),
        borderRadius: "2px 0px 0px 2px",
        background: topLight,
        "&:checked": {
            backgroundColor: accent,
        },
    },
    align_controlInput__center: {
        ...applyInputBackplateStyle(),
        borderRight: `1px solid ${background300}`,
        borderLeft: `1px solid ${background300}`,
        background: centerLight,
        "&:checked": {
            backgroundColor: accent,
        },
    },
    align_controlInput__bottom: {
        ...applyInputBackplateStyle(),
        borderRadius: "0px 2px 2px 0px",
        background: bottomLight,
        "&:checked": {
            backgroundColor: accent,
        },
    },
    align_softRemove: {
        ...applySoftRemove(),
    },
    align_softRemoveInput: {
        ...applySoftRemoveInput(),
    },
};

export default styles;
