import { html, ref, slotted, ViewTemplate, when } from "@microsoft/fast-element";
import { Picker, PickerMenuPosition } from "./picker";

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
                        x.menuPosition === "dynamic" ? x.menuPosition : "locktodefault"}"
                    vertical-default-position="${x =>
                        x.menuPosition === "dynamic" ? null : x.menuPosition}"
                    vertical-scaling="fill"
                    vertical-inset="false"
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
