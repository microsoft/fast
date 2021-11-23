import {
    children,
    html,
    repeat,
    slotted,
    ViewTemplate,
    when,
} from "@microsoft/fast-element";
import type { ElementDefinitionContext } from "../design-system";
import type { FileSelect as File, FileOptions } from "./file";

/**
 * The default FAST File Template for a file-list
 *  @public
 */
export const defaultFileListTemplate = html<File>`
    <ul ${children("listItems")}>
        ${repeat(
            x => x.fileListBuffer,
            html`
                <li @click="${(x, c) => c.parent.removeItem(c.event)}">
                    ${when(
                        (x, c) => c.parent.preview,
                        html`
                            <img src="${x => x}" class="preview" />
                        `
                    )}
                    ${when(
                        (x, c) => !c.parent.preview,
                        html`
                            <fast-anchor appearance="hypertext">
                                ${x => x}
                            </fast-anchor>
                        `
                    )}
                </li>
            `
        )}
    </ul>
`;

/**
 * The default FAST File Template for a contol-element
 *  @public
 */
export const defaultControlElementTemplate = html<File>`
    <fast-button>Choose a file</fast-button>
`;

/**
 * The template for the {@link @microsoft/fast-foundation#(File:class)} component
 * @public
 */
export const fileTemplate: (
    context: ElementDefinitionContext,
    definition: FileOptions
) => ViewTemplate<File> = (
    context: ElementDefinitionContext,
    definition: FileOptions
) => {
    return html<File>`
        <template>
            <span part="file-selector-control">
                <slot
                    name="file-selector-control"
                    ${slotted("fileSelectorControl")}
                    @click="${x => x.handleClick()}"
                >
                    ${definition.controlElement || ""}
                </slot>
            </span>
            ${when(
                x => x.files,
                html<File>`
                    <span class="file-list" part="file-list">
                        <slot name="file-list">
                            ${definition.fileList || ""}
                        </slot>
                    </span>
                `
            )}
        </template>
    `;
};
