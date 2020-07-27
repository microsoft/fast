import { html, slotted } from "@microsoft/fast-element";
import { MockUi } from "./mock-ui";

export const MockUiTemplate = html<MockUi>`
    <div class="ui-host" part="ui-host">
        <slot></slot>
        <slot ${slotted("mockElements")} name="mock-elements"></slot>
    </div>
`;
