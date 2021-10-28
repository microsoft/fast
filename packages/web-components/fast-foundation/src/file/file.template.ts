import { html, slotted, ViewTemplate } from "@microsoft/fast-element";
// import { Button } from "../button";
import type { ElementDefinitionContext } from "../design-system";
import type { File } from "./file";

/**
 * The template for {@link @microsoft/fast-foundation#file}  component
 * @public
 */
export const fileTemplate: (
    context: ElementDefinitionContext
) => ViewTemplate<File> = context => {
    return html`
        <template>
            <div class="root" part="root">
                <span part="file-selector-button">
                    <slot name="fileSelectorButton" ${slotted(
                        "fileSelectorButton"
                    )} @click="${x => x.handleClick()}">
                </span>
                <span class="label" part="label">
                    <slot name="label"></slot>
                </span>
                <span part="file-list">
                    <slot></slot>
                </span>
            </div>
        </template>
    `;
};
