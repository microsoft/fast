import { css } from "@microsoft/fast-element";
import { display } from "@microsoft/fast-foundation";
import { accentForegroundRestBehavior, heightNumber } from "../styles/index";

export const DataGridRowStyles = css`
:host {
    display: flex;
    flex-direction: row;
    border: 1px solid black;
    min-height: 40px;
    background: yellow;
}
`.withBehaviors(accentForegroundRestBehavior);
