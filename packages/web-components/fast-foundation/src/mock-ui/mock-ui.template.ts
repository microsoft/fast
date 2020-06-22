import { html, ref, when } from "@microsoft/fast-element";
import { MockUi } from "./mock-ui";

export const MockUiTemplate = html<MockUi>`
    <div class="ui-host" part="ui-host">
        <slot></slot>
    </div>
`;
