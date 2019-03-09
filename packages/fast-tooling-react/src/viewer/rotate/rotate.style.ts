import {
    ComponentStyles,
    ComponentStyleSheet,
    CSSRules,
} from "@microsoft/fast-jss-manager";
import { RotateClassNameContract } from "./rotate.class-name-contract";
import { accent, applyInputBackplateStyle, background800 } from "../../style";

const landscape: string =
    "url(data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTYiIGhlaWdodD0iMTYiIHZpZXdCb3g9IjAgMCA1MCA1MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48Zz48cGF0aCBmaWxsPSJ3aGl0ZSIgZD0iTTUwIDQzLjc1VjMuMTI1SDBWNDMuNzVINTBaTTQ2Ljg3NSA0MC42MjVIMy4xMjVWNi4yNUg0Ni44NzVWNDAuNjI1Wk0xNS42MjUgMzQuMzc1SDYuMjVWMzcuNUgxNS42MjVWMzQuMzc1Wk00My43NSAzNC4zNzVIMzQuMzc1VjM3LjVINDMuNzVWMzQuMzc1WiI+PC9wYXRoPjwvZz48L3N2Zz4=) center no-repeat";
const portrait: string =
    "url(data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTYiIGhlaWdodD0iMTYiIHZpZXdCb3g9IjAgMCA1MCA1MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiA+PGc+PHBhdGggZmlsbD0id2hpdGUiIGQ9Ik00My43NSA1MFYwSDMuMTI1VjUwSDQzLjc1Wk00MC42MjUgNDYuODc1SDYuMjVWMy4xMjVINDAuNjI1VjQ2Ljg3NVpNMTguNzUgNDAuNjI1SDkuMzc1VjQzLjc1SDE4Ljc1VjQwLjYyNVpNMzcuNSA0MC42MjVIMjguMTI1VjQzLjc1SDM3LjVWNDAuNjI1WiI+PC9wYXRoPjwvZz48L3N2Zz4=) center no-repeat";

/* tslint:disable:max-line-length */
const styles: ComponentStyleSheet<RotateClassNameContract, {}> = {
    rotate: {
        display: "inline-block",
        verticalAlign: "text-bottom",
    },
    rotate_controlInputContainer: {
        height: "21px",
    },
    rotate_controlInput: {
        ...applyInputBackplateStyle(),
        "&:checked": {
            backgroundColor: accent,
        },
    },
    rotate_controlInput__disabled: {
        "&:hover": {
            cursor: "not-allowed",
        },
    },
    rotate_controlInput__landscape: {
        borderRadius: "2px 0px 0px 2px",
        background: landscape,
        backgroundColor: background800,
        "&$rotate_controlInput__disabled": {
            opacity: 0.3,
        },
    },
    rotate_controlInput__portrait: {
        borderRadius: "0px 2px 2px 0px",
        background: portrait,
        backgroundColor: background800,
        "&$rotate_controlInput__disabled": {
            opacity: 0.3,
        },
    },
};

export default styles;
