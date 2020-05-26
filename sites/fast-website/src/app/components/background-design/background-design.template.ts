import { html } from "@microsoft/fast-element";
import BackgroundImage from "svg/background.svg";
import { BackgroundDesign } from "./background-design";

export const BackgroundDesignTemplate = html<BackgroundDesign>`
    <template style="--blur-amount: ${x => x.blurAmount}">
        <slot name="background-image">
            ${BackgroundImage}
        </slot>
    </template>
`;
