import { html, ref, when } from "@microsoft/fast-element";
import type { ViewTemplate } from "@microsoft/fast-element";
import type { FoundationElementTemplate } from "../foundation-element";
import { AnchoredRegion } from "../anchored-region";
import type { TextEditor } from "./text-editor";
import { TextEditorToolbar } from "./text-editor-toolbar";

/**
 * The template for the {@link @microsoft/fast-foundation#TextEditor} component.
 * @public
 */
export const textEditorTemplate: FoundationElementTemplate<ViewTemplate<TextEditor>> = (
    context,
    definition
) => {
    const anchoredRegionTag: string = context.tagFor(AnchoredRegion);
    const toolbarTag: string = context.tagFor(TextEditorToolbar);
    return html<TextEditor>`
        <template :toolbarTag="${() => toolbarTag}">
            <slot name="editor-region"></slot>
            ${when(
                x => x.showToolbar,
                html<TextEditor>`
                <${anchoredRegionTag}
                    class="region"
                    part="region"
                    auto-update-mode="${x => x.toolbarConfig.autoUpdateMode}"
                    fixed-placement="${x => x.toolbarConfig.fixedPlacement}"
                    vertical-positioning-mode="${x =>
                        x.toolbarConfig.verticalPositioningMode}"
                    vertical-default-position="${x =>
                        x.toolbarConfig.verticalDefaultPosition}"
                    vertical-scaling="${x => x.toolbarConfig.verticalScaling}"
                    vertical-inset="${x => x.toolbarConfig.verticalInset}"
                    vertical-viewport-lock="${x => x.toolbarConfig.verticalViewportLock}"
                    horizontal-positioning-mode="${x =>
                        x.toolbarConfig.horizontalPositioningMode}"
                    horizontal-default-position="${x =>
                        x.toolbarConfig.horizontalDefaultPosition}"
                    horizontal-scaling="${x => x.toolbarConfig.horizontalScaling}"
                    horizontal-inset="${x => x.toolbarConfig.horizontalInset}"
                    horizontal-viewport-lock="${x =>
                        x.toolbarConfig.horizontalViewportLock}"
                    @loaded="${(x, c) => x.handleRegionLoaded(c.event as Event)}"
                    ${ref("region")}
                >
                    <slot name="toolbar-region">
                    </slot>
                </${anchoredRegionTag}>
            `
            )}
        </template>
    `;
};
