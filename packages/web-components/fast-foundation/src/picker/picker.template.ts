import { html, ref, ViewTemplate, when } from "@microsoft/fast-element";
import type { Picker } from "./picker";

/**
 * The template for the List Picker component.
 * @public
 */
export function createPickerTemplate(
    prefix: string,
    itemTemplate: ViewTemplate,
    optionTemplate: ViewTemplate
): ViewTemplate {
    return html<Picker>`
        <template
            :selectedlisttag=${`${prefix}-picker-list`}
            :pickermenutag=${`${prefix}-picker-menu`}
            :defaultItemTemplate=${itemTemplate}
            :defaultOptionTemplate=${optionTemplate}
            @focusin="${(x, c) => x.handleFocusIn(c.event as FocusEvent)}"
            @focusout="${(x, c) => x.handleFocusOut(c.event as FocusEvent)}"
            @keydown="${(x, c) => x.handleKeyDown(c.event as KeyboardEvent)}"
            @click="${(x, c) => x.handleClick(c.event as MouseEvent)}"
        >
            <slot name="list-region"></slot>

            ${when(
                x => x.flyoutOpen,
                html<Picker>`
                <${prefix}-anchored-region
                    class="region"
                    auto-update-mode="${x =>
                        x.menuConfig.autoUpdateMode !== undefined
                            ? x.menuConfig.autoUpdateMode
                            : "auto"}"
                    fixed-placement="${x =>
                        x.menuConfig.fixedPlacement !== undefined
                            ? x.menuConfig.fixedPlacement
                            : true}"
                    vertical-positioning-mode="${x =>
                        x.menuConfig.verticalPositioningMode}"
                    vertical-default-position="${x =>
                        x.menuConfig.verticalDefaultPosition}"
                    vertical-scaling="${x => x.menuConfig.verticalScaling}"
                    vertical-inset="${x => x.menuConfig.verticalInset}"
                    vertical-threshold="${x => x.menuConfig.verticalThreshold}"
                    horizontal-positioning-mode="${x =>
                        x.menuConfig.horizontalPositioningMode}"
                    horizontal-default-position="${x =>
                        x.menuConfig.horizontalDefaultPosition}"
                    horizontal-scaling="${x => x.menuConfig.horizontalScaling}"
                    horizontal-inset="${x => x.menuConfig.horizontalInset}"
                    horizontal-threshold="${x => x.menuConfig.horizontalThreshold}"
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
                                    <${prefix}-progress-ring
                                        part="loading-progress"
                                        class="loading-progress
                                        slot="loading-region"
                                    ></${prefix}-progress-ring>
                                    ${x => x.loadingText}
                                </slot>
                            </div>
                        `
                    )}
                </${prefix}-anchored-region>
            `
            )}
        </template>
    `;
}
