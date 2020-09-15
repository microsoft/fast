import { css } from "@microsoft/fast-element";
import { display } from "@microsoft/fast-foundation";
import { accentForegroundRestBehavior, heightNumber } from "../styles/index";

export const DataGridHeaderStyles = css`
    :host {
        display: flex;
        flex-direction: rows;
        min-width: 40px;
        min-height: 40px;
        background: blue;
    }
`.withBehaviors(accentForegroundRestBehavior);
