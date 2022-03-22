import { html, ref, when } from "@microsoft/fast-element";
import type { ViewTemplate } from "@microsoft/fast-element";
import type { FoundationElementTemplate } from "../foundation-element";
import { AnchoredRegion } from "../anchored-region";
import { Button } from "../button";
import { Toolbar } from "../toolbar";
import type { TextEditor } from "./text-editor";

/**
 * The template for the {@link @microsoft/fast-foundation#TextEditor} component.
 * @public
 */
export const textEditorTemplate: FoundationElementTemplate<ViewTemplate<TextEditor>> = (
    context,
    definition
) => {
    const anchoredRegionTag: string = context.tagFor(AnchoredRegion);
    const toolbarTag: string = context.tagFor(Toolbar);
    const buttonTag: string = context.tagFor(Button);
    return html<TextEditor>`
        <template>
            <slot></slot>
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
                <div class="toolbar-display" part="toolbar-display">
                    <slot name="toolbar-region">
                        <${toolbarTag}
                            class="toolbar"
                            part="toolbar"
                            slot="toolbar-region"
                        >
                            <${buttonTag}
                                @click="${(x, c) => x.toggleBold(c.event as Event)}"
                            >
                                Bold
                            </${buttonTag}>

                            <${buttonTag}
                                @click="${(x, c) => x.toggleItalic(c.event as Event)}"
                            >
                                Italic
                            </${buttonTag}>
                        </${toolbarTag}>
                    </slot>
                </div>
            </${anchoredRegionTag}>
        `
            )}
        </template>
    `;
};
