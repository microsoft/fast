import { html, ref } from "@microsoft/fast-element";
import { BackgroundDesign } from "./background-design";

export const BackgroundDesignTemplate = html<BackgroundDesign>`
    <template>
        <div class="background-image ${x => (x.faded ? "is-faded" : "")}">
            <canvas ${ref("canvas")}></canvas>
        </div>
    </template>
`;
