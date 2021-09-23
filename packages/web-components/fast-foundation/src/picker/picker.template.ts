import { html, ref, ViewTemplate, when } from "@microsoft/fast-element";
import { AnchoredRegion } from "../anchored-region";
import type { Picker } from "./picker";
import { PickerMenu } from "./picker-menu";
import { PickerMenuOption } from "./picker-menu-option";
import { PickerList } from "./picker-list";
import { PickerListItem } from "./picker-list-item";

function createDefaultListItemTemplate(context): ViewTemplate {
    const pickerListItemTag: string = context.tagFor(PickerListItem);
    return html`
    <${pickerListItemTag}
        value="${x => x}"
        :contentsTemplate="${(x, c) => c.parent.listItemContentsTemplate}"
    >
    </${pickerListItemTag}>
    `;
}

function createDefaultMenuOptionTemplate(context): ViewTemplate {
    const pickerMenuOptionTag: string = context.tagFor(PickerMenuOption);
    return html`
    <${pickerMenuOptionTag}
        value="${x => x}"
        :contentsTemplate="${(x, c) => c.parent.menuOptionContentsTemplate}"
    >
    </${pickerMenuOptionTag}>
    `;
}

/**
 * The template for the List Picker component.
 * @public
 */
export const pickerTemplate: (context, definition) => ViewTemplate<Picker> = (
    context,
    definition
) => {
    const anchoredRegionTag: string = context.tagFor(AnchoredRegion);
    const pickerMenuTag: string = context.tagFor(PickerMenu);
    const pickerListTag: string = context.tagFor(PickerList);
    const progressRingTag: string = context.tagFor(PickerList);
    const defaultListItemTemplate: ViewTemplate = createDefaultListItemTemplate(context);
    const defaultMenuOptionTemplate: ViewTemplate = createDefaultMenuOptionTemplate(
        context
    );
    return html<Picker>`
        <template
            :selectedListTag="${() => pickerListTag}"
            :menuTag="${() => pickerMenuTag}"
            :defaultListItemTemplate="${defaultListItemTemplate}"
            :defaultMenuOptionTemplate="${defaultMenuOptionTemplate}"
            @focusin="${(x, c) => x.handleFocusIn(c.event as FocusEvent)}"
            @focusout="${(x, c) => x.handleFocusOut(c.event as FocusEvent)}"
            @keydown="${(x, c) => x.handleKeyDown(c.event as KeyboardEvent)}"
            @pickeriteminvoked="${(x, c) => x.handleItemInvoke(c.event as Event)}"
            @pickeroptioninvoked="${(x, c) => x.handleOptionInvoke(c.event as Event)}"
        >
            <slot name="list-region"></slot>

            ${when(
                x => x.flyoutOpen,
                html<Picker>`
                <${anchoredRegionTag}
                    class="region"
                    auto-update-mode="auto"
                    fixed-placement="true"
                    vertical-positioning-mode="locktodefault"
                    vertical-default-position="bottom"
                    vertical-scaling="content"
                    vertical-inset="false"
                    horizontal-positioning-mode="locktodefault"
                    horizontal-default-position="right"
                    horizontal-scaling="anchor"
                    horizontal-inset="true"
                    @loaded="${(x, c) => x.handleRegionLoaded(c.event as Event)}"
                    ${ref("region")}
                >
                    ${when(
                        x => !x.showNoOptions && !x.showLoading,
                        html<Picker>`
                            <slot name="menu-region"></slot>
                        `
                    )}
                    ${when(
                        x => x.showNoOptions && !x.showLoading,
                        html<Picker>`
                            <div class="no-options-display" part="no-options-display">
                                <slot name="no-options-region">
                                    ${x => x.noSuggestionsText}
                                </slot>
                            </div>
                        `
                    )}
                    ${when(
                        x => x.showLoading,
                        html<Picker>`
                            <div class="loading-display" part="loading-display">
                                <slot name="loading-region">
                                    <${progressRingTag}
                                        part="loading-progress"
                                        class="loading-progress
                                        slot="loading-region"
                                    ></${progressRingTag}>
                                        ${x => x.loadingText}
                                </slot>
                            </div>
                        `
                    )}
                </${anchoredRegionTag}>
            `
            )}
        </template>
    `;
};
