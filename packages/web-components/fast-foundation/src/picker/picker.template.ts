import { html, ref, ViewTemplate, when } from "@microsoft/fast-element";
import type { Picker } from "./picker";

/**
 * The template for the List Picker component.
 * @public
 */
export function createPickerTemplate(
    prefix: string,
    subtype: string,
    itemTemplate: ViewTemplate,
    optionTemplate: ViewTemplate
): ViewTemplate {
    return html<Picker>`
        <template
            :selectedlisttag=${`${prefix}-${subtype}-picker-list`}
            :pickermenutag=${`${prefix}-${subtype}-picker-menu`}
            :defaultItemTemplate=${itemTemplate}
            :defaultOptionTemplate=${optionTemplate}
            @focusin="${(x, c) => x.handleFocusIn(c.event as FocusEvent)}"
            @focusout="${(x, c) => x.handleFocusOut(c.event as FocusEvent)}"
            @keydown="${(x, c) => x.handleKeyDown(c.event as KeyboardEvent)}"
        >
            <slot name="list-region"></slot>

            ${when(
                x => x.menuOpen,
                html<Picker>`
                <${prefix}-anchored-region
                    auto-update-mode="${x => x.autoUpdateMode}"
                    auto-update-interval="${x => x.autoUpdateInterval}"
                    class="region"
                    fixed-placement="${x => x.fixedPlacement}"
                    vertical-positioning-mode="${x =>
                        x.dynamicMenuPositioning ? "dynamic" : "locktodefault"}"
                    vertical-default-position="${x => x.menuPosition}"
                    vertical-scaling="fill"
                    vertical-inset="false"
                    vertical-threshold="300"
                    horizontal-positioning-mode="locktodefault"
                    horizontal-default-position="right"
                    horizontal-scaling="content"
                    horizontal-inset="true"
                    @loaded="${(x, c) => x.handleRegionLoaded(c.event as Event)}"
                    ${ref("region")}
                >
                    <slot
                        name="menu-region"
                    >
                    </slot>
                </${prefix}-anchored-region>
            `
            )}
        </template>
    `;
}
