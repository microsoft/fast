import { html, ref, slotted, when } from "@microsoft/fast-element";
import { MockUi } from "./mock-ui";

export const MockUiTemplate = html<MockUi>`
    <div class="ui-host" part="ui-host">
        <div>
            <slot name="ui-host"></slot>
        </div>
        <div
            aria-label="${x => x.heading}"
            class="accessibility-root"
            part="accessibility-root"
            ${ref("accessibilityRoot")}
        >
            ${when(
                x => x.heading,
                html`
                    <h1>${x => x.heading}</h1>
                `
            )}
            <slot ${slotted("mockElements")} name="mock-elements"></slot>
        </div>
    </div>
`;
