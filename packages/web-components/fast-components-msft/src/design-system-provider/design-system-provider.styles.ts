import { css } from "@microsoft/fast-element";
import { display } from "@microsoft/fast-foundation";
import { neutralForegroundRestBehavior } from "../styles";

export const DesignSystemProviderStyles = css`
    ${display("block")};
`;

export const backgroundStyles = css`
    :host {
        background-color: var(--background-color);
    }
`;

export const colorStyles = css`
    :host {
        color: var(--neutral-foreground-rest);
    }
`.withBehaviors(
    neutralForegroundRestBehavior // This likely won't work because the resolver won't find itself
);
