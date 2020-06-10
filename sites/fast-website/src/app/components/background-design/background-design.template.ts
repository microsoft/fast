import { html } from "@microsoft/fast-element";
import { BackgroundDesign } from "./background-design";

export const BackgroundDesignTemplate = html<BackgroundDesign>`
    <template>
        <div class="background-image">
            <canvas id="wave-canvas"></canvas>
        </div>
    </template>
`;
