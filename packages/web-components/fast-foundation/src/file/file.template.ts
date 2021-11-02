import { html, slotted, ViewTemplate } from "@microsoft/fast-element";
// import { Button } from "../button";
import type { ElementDefinitionContext } from "../design-system";
import type { File, FileOptions } from "./file";

/**
 * The template for {@link @microsoft/fast-foundation#file}  component
 * @public
 */
export const fileTemplate: (
    context: ElementDefinitionContext,
    definition: FileOptions
) => ViewTemplate<File> = (
    context: ElementDefinitionContext,
    definition: FileOptions
) => {
    return html`
        <template>
            <div class="root" part="root">
                <span part="file-selector-button">
                    <slot
                        name="file-selector-button"
                        ${slotted("fileSelectorButton")}
                        @click="${x => x.handleClick()}"
                    >
                        ${definition.controlElement || ""}
                    </slot>
                </span>
                <span class="file-list" part="file-list">
                    <slot name="file-list">
                        ${definition.fileList || ""}
                    </slot>
                </span>
            </div>
        </template>
    `;
};
