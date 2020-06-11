import { html, ref } from "@microsoft/fast-element";
import { BackgroundDesign } from "./background-design";

export const BackgroundDesignTemplate = html<BackgroundDesign>`
    <template>
        <div class="background-image">
            <canvas ${ref("canvas")}></canvas>
        </div>
    </template>
`;
