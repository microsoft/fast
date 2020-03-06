import { html, when } from "@microsoft/fast-element";
import { Checkbox } from "./checkbox";

/**
 * TODO: no tabindex attribute should exist for disabled or readonly instances.
 * Right now, clicking still brings focus because tabindex="-1" makes the div
 * focusabled,
 */
export const CheckboxTemplate = html<Checkbox>`
    <div
        part="checkbox"
        role="checkbox"
        class="checkbox"
        $aria-checked="${x => x.checked}"
        $aria-required="${x => x.required === ("" as any)}"
        $aria-disabled="${x => x.disabled}"
        aria-labelledby="checkbox-label"
        tabindex="${x =>
            x.disabled === ("" as any) || x.readOnly === ("" as any) ? -1 : 0}"
        id="checkbox"
    >
            <slot
                name="checked-indicator"
            >
                <svg
                    aria-hidden="true"
                    part="checked-indicator"
                    class="checked-indicator"
                    viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"
                >
                    <path
                        fill="inherit"
                        fill-rule="evenodd"
                        clip-rule="evenodd"
                        d="M8.143 12.6697L15.235 4.5L16.8 5.90363L8.23812 15.7667L3.80005 11.2556L5.27591 9.7555L8.143 12.6697Z"
                        />
                </svg>
            </slot>
            <slot
                name="indeterminate-indicator"
             >
                <div
                    part="indeterminate-indicator"
                    class="indeterminate-indicator"
                ></div>
             </slot>

    </div>
    ${when(
        x => x.childNodes.length,
        html`
        <label
            for="checkbox"
            id="checkbox-label"
            part="label"
            class="label"
        ><slot></slot></label>
    `
    )}
`;
