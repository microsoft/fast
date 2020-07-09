import { html, ref, slotted } from "@microsoft/fast-element";
import { TextArea, TextAreaResize } from "./text-area";

/**
 * The template for the {@link @microsoft/fast-foundation#TextArea} component.
 * @public
 */
export const TextAreaTemplate = html<TextArea>`
    <template
        class="
            ${x => x.appearance}
            ${x => (x.readOnly ? "readonly" : "")}
            ${x => (x.resize !== TextAreaResize.none ? `resize-${x.resize}` : "")}"
    >
        <label
            part="label"
            for="control"
            class="${x =>
                x.defaultSlottedNodes && x.defaultSlottedNodes.length
                    ? "label"
                    : "label label__hidden"}"
        >
            <slot ${slotted("defaultSlottedNodes")}></slot>
        </label>
        <textarea
            part="control"
            class="control"
            id="control"
            ?autofocus="${x => x.autofocus}"
            cols="${x => x.cols}"
            ?disabled="${x => x.disabled}"
            form="${x => x.form}"
            list="${x => x.list}"
            maxlength="${x => x.maxlength}"
            minlength="${x => x.minlength}"
            name="${x => x.name}"
            placeholder="${x => x.placeholder}"
            ?readonly="${x => x.readOnly}"
            ?required="${x => x.required}"
            rows="${x => x.rows}"
            ?spellcheck="${x => x.spellcheck}"
            value="${x => x.value}"
            ariaAtomic="${x => x.ariaAtomic}"
            ariaBusy="${x => x.ariaBusy}"
            ariaControls="${x => x.ariaControls}"
            ariaCurrent="${x => x.ariaCurrent}"
            ariaDescribedBy="${x => x.ariaDescribedby}"
            ariaDetails="${x => x.ariaDetails}"
            ariaDisabled="${x => x.ariaDisabled}"
            ariaErrormessage="${x => x.ariaErrormessage}"
            ariaFlowto="${x => x.ariaDisabled}"
            ariaHaspopup="${x => x.ariaHaspopup}"
            ariaHidden="${x => x.ariaHidden}"
            ariaInvalid="${x => x.ariaInvalid}"
            ariaKeyshortcuts="${x => x.ariaKeyshortcuts}"
            ariaLabel="${x => x.ariaLabel}"
            ariaLabelledby="${x => x.ariaLabelledby}"
            ariaLive="${x => x.ariaLive}"
            ariaOwns="${x => x.ariaOwns}"
            ariaRelevant="${x => x.ariaRelevant}"
            ariaRoledescription="${x => x.ariaRoledescription}"
            @input="${x => x.handleTextInput()}"
            ${ref("textarea")}
        ></textarea>
    </template>
`;
