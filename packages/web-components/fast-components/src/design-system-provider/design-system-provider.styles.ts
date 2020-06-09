import { css } from "@microsoft/fast-element";
import { CSSCustomPropertyBehavior, display } from "@microsoft/fast-foundation";
import { neutralForegroundRest } from "../color";

export const DesignSystemProviderStyles = css`
    ${display("block")};
`;

const beh = new CSSCustomPropertyBehavior(
    "neutral-foreground-rest",
    neutralForegroundRest,
    x => x as any
);

export const backgroundStyles = css`
    :host {
        background-color: var(--background-color);
    }
`;

export const colorStyles = css`
    :host {
        color: var(--neutral-foreground-rest);
    }
`.withBehaviors(beh);
