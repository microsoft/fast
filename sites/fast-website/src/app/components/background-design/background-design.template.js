import { html, ref } from "@microsoft/fast-element";
export const BackgroundDesignTemplate = html`
    <template>
        <div class="background-image ${x => (x.faded ? "is-faded" : "")}">
            <canvas ${ref("canvas")}></canvas>
        </div>
    </template>
`;
