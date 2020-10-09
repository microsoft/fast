import { css } from "@microsoft/fast-element";
import { accentForegroundRestBehavior } from "../styles/index";

export const DataGridHeaderCellStyles = css`
    :host {
        display: flex;
        min-height: 40px;
        min-width: 40px;
        background: grey;
    }
`.withBehaviors(accentForegroundRestBehavior);
