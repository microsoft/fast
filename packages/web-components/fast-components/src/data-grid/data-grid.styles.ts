import { css } from "@microsoft/fast-element";
import { display } from "@microsoft/fast-foundation";
import { accentForegroundRestBehavior, heightNumber } from "../styles/index";

export const DataGridStyles = css`
:host {
    display: flex;
    flex-direction: column;
    border: 1px solid black;
}

.header {
    display: flex;
    flex-direction: row;
    height: 60px;
    background: orange;
}

.rows {
    display: flex;
    flex-direction: column;
    height: 60px;
    background: yellow;
}
`.withBehaviors(accentForegroundRestBehavior);
