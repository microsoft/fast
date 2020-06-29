import { html } from "@microsoft/fast-element";
import { Wrapper } from "./wrapper";

/**
 * @public
 */
export const WrapperTemplate = html<Wrapper>`
    <div
        class="control ${x => (x.active ? "active" : "")} ${x =>
            x.preselect ? "preselect" : ""}"
        part="control"
        style="
            top: ${x => Math.round(x.y)}px;
            left: ${x => Math.round(x.x)}px;
            width: ${x => Math.round(x.width)}px;
            height: ${x => Math.round(x.height)}px;
        "
    >
        <div class="tick"></div>
        <div class="tick"></div>
        <div class="tick"></div>
        <div class="tick"></div>
        <div class="tick"></div>
        <div class="tick"></div>
        <div class="tick"></div>
        <div class="tick"></div>
    </div>
`;
