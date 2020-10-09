import { css } from "@microsoft/fast-element";
import { accentForegroundRestBehavior } from "../styles/index";

export const DataGridHeaderStyles = css`
    :host {
        display: grid;
        border: 1px solid black;
        min-height: 40px;
        background: blue;
    }
`.withBehaviors(accentForegroundRestBehavior);
