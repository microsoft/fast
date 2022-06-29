import {
    ElementViewTemplate,
    html,
    ref,
    ViewTemplate,
    when,
} from "@microsoft/fast-element";
import { tagFor, TemplateElementDependency } from "../patterns/tag-for.js";
import type { FASTPicker } from "./picker.js";

function defaultListItemTemplate(options: PickerOptions): ViewTemplate {
    const pickerListItemTag: string = tagFor(options.pickerListItem);
    return html`
    <${pickerListItemTag}
        value="${x => x}"
        :contentsTemplate="${(x, c) => c.parent.listItemContentsTemplate}"
    >
    </${pickerListItemTag}>
    `;
}

function defaultMenuOptionTemplate(options: PickerOptions): ViewTemplate {
    const pickerMenuOptionTag: string = tagFor(options.pickerMenuOption);
    return html`
    <${pickerMenuOptionTag}
        value="${x => x}"
        :contentsTemplate="${(x, c) => c.parent.menuOptionContentsTemplate}"
    >
    </${pickerMenuOptionTag}>
    `;
}

/**
 * Picker configuration options
 * @public
 */
export type PickerOptions = {
    anchoredRegion: TemplateElementDependency;
    pickerMenu: TemplateElementDependency;
    pickerMenuOption: TemplateElementDependency;
    pickerList: TemplateElementDependency;
    pickerListItem: TemplateElementDependency;
    progressRing: TemplateElementDependency;
};

/**
 * The template for the List Picker component.
 * @public
 */
export function pickerTemplate(options: PickerOptions): ElementViewTemplate<FASTPicker> {
    const anchoredRegionTag: string = tagFor(options.anchoredRegion);
    const pickerMenuTag: string = tagFor(options.pickerMenu);
    const pickerListTag: string = tagFor(options.pickerList);
    const progressRingTag: string = tagFor(options.progressRing);

    return html<FASTPicker>`
        <template
            :selectedListTag="${() => pickerListTag}"
            :menuTag="${() => pickerMenuTag}"
            :defaultListItemTemplate="${defaultListItemTemplate(options)}"
            :defaultMenuOptionTemplate="${defaultMenuOptionTemplate(options)}"
            @focusin="${(x, c) => x.handleFocusIn(c.event as FocusEvent)}"
            @focusout="${(x, c) => x.handleFocusOut(c.event as FocusEvent)}"
            @keydown="${(x, c) => x.handleKeyDown(c.event as KeyboardEvent)}"
            @pickeriteminvoked="${(x, c) => x.handleItemInvoke(c.event as Event)}"
            @pickeroptioninvoked="${(x, c) => x.handleOptionInvoke(c.event as Event)}"
        >
            <slot name="list-region"></slot>

            ${when(
                x => x.flyoutOpen,
                html<FASTPicker>`
                <${anchoredRegionTag}
                    class="region"
                    part="region"
                    auto-update-mode="${x => x.menuConfig.autoUpdateMode}"
                    fixed-placement="${x => x.menuConfig.fixedPlacement}"
                    vertical-positioning-mode="${x =>
                        x.menuConfig.verticalPositioningMode}"
                    vertical-default-position="${x =>
                        x.menuConfig.verticalDefaultPosition}"
                    vertical-scaling="${x => x.menuConfig.verticalScaling}"
                    vertical-inset="${x => x.menuConfig.verticalInset}"
                    vertical-viewport-lock="${x => x.menuConfig.verticalViewportLock}"
                    horizontal-positioning-mode="${x =>
                        x.menuConfig.horizontalPositioningMode}"
                    horizontal-default-position="${x =>
                        x.menuConfig.horizontalDefaultPosition}"
                    horizontal-scaling="${x => x.menuConfig.horizontalScaling}"
                    horizontal-inset="${x => x.menuConfig.horizontalInset}"
                    horizontal-viewport-lock="${x => x.menuConfig.horizontalViewportLock}"
                    @loaded="${(x, c) => x.handleRegionLoaded(c.event as Event)}"
                    ${ref("region")}
                >
                    ${when(
                        x => !x.showNoOptions && !x.showLoading,
                        html<FASTPicker>`
                            <slot name="menu-region"></slot>
                        `
                    )}
                    ${when(
                        x => x.showNoOptions && !x.showLoading,
                        html<FASTPicker>`
                            <div class="no-options-display" part="no-options-display">
                                <slot name="no-options-region">
                                    ${x => x.noSuggestionsText}
                                </slot>
                            </div>
                        `
                    )}
                    ${when(
                        x => x.showLoading,
                        html<FASTPicker>`
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
}
