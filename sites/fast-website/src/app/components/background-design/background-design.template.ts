import { html } from "@microsoft/fast-element";
import BackgroundImage from "svg/background.png";
import { BackgroundDesign } from "./background-design";

export const BackgroundDesignTemplate = html<BackgroundDesign>`
    <template style="--blur-amount: ${x => x.blurAmount}">
        <slot name="background-image">
            <img src="${BackgroundImage}" style="width: 100%" />
        </slot>
    </template>
`;
