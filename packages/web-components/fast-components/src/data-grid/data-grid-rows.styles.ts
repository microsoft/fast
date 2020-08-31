import { css } from "@microsoft/fast-element";
import { display } from "@microsoft/fast-foundation";
import { accentForegroundRestBehavior, heightNumber } from "../styles/index";

export const DataGridRowsStyles = css`
:host {;
    min-height: 40px;
    min-width: 40px;
    background: pink;
}
`.withBehaviors(accentForegroundRestBehavior);
