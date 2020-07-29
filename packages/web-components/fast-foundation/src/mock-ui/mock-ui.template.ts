import { html, ref, slotted } from "@microsoft/fast-element";
import { MockUi } from "./mock-ui";

export const MockUiTemplate = html<MockUi>`
    <div class="ui-host" part="ui-host">
        <slot name="ui-host"></slot>
        <div class="accessibility-root" part="accessibility-root">
            <slot ${slotted("mockElements")} name="mock-elements"></slot>
        </div>
    </div>
`;
