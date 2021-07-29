import { html, slotted, ViewTemplate } from "@microsoft/fast-element";
import { ElementDefinitionContext } from "@microsoft/fast-foundation";
import { Button } from "@microsoft/fast-components";
import { File } from "./file";

/**
 * The template for the file component.
 * @public
 */
export const FileTemplate: (
    context: ElementDefinitionContext
) => ViewTemplate<File> = context => {
    return html`
        <template>
            <div class="root" part="root">
                <${context.tagFor(Button)} 
                    ?disabled="${x => x.disabled}"
                    @click="${x => x.handleClick()}"
                >
                    <slot></slot>
                </${context.tagFor(Button)}>
            </div>
            <slot name="action" ${slotted("action")}></slot>
        </template>
    `;
};
