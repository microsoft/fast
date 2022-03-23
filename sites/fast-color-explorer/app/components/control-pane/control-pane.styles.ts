import {
    typeRampPlus1FontSize,
    typeRampPlus1LineHeight,
} from "@microsoft/fast-components";
import { css } from "@microsoft/fast-element";
import { display } from "@microsoft/fast-foundation";

export const controlPaneStyles = css`
    ${display("flex")} :host {
        flex: 0 1 auto;
        flex-direction: column;
        gap: 24px;
    }

    .title {
        font-size: ${typeRampPlus1FontSize};
        line-height: ${typeRampPlus1LineHeight};
    }
`;
