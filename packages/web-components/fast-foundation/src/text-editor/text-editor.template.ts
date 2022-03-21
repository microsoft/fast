import { html, ref, when } from "@microsoft/fast-element";
import type { ViewTemplate } from "@microsoft/fast-element";
import type { FoundationElementTemplate } from "../foundation-element";
import type { TextEditor } from "./text-editor";

/**
 * The template for the {@link @microsoft/fast-foundation#TextEditor} component.
 * @public
 */
export const textEditorTemplate: FoundationElementTemplate<ViewTemplate<TextEditor>> = (
    context,
    definition
) => html`
    <template>
        <slot></slot>
    </template>
`;
