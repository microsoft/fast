import { css } from "@microsoft/fast-element";
import { display } from "@microsoft/fast-foundation";
import { accentForegroundRestBehavior, heightNumber } from "../styles/index";

export const DataGridCellStyles = css`
:host {
    background: green;
}
`.withBehaviors(accentForegroundRestBehavior);
