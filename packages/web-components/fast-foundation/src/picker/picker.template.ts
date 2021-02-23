import { html, ref, slotted, ViewTemplate, when } from "@microsoft/fast-element";
import { Picker } from "./picker";

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
                    class="region"
                    fixed-placement="true"
                    vertical-positioning-mode="dynamic"
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
