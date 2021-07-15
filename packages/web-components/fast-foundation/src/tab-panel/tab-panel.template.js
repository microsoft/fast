import { html } from "@microsoft/fast-element";
/**
 * The template for the {@link @microsoft/fast-foundation#TabPanel} component.
 * @public
 */
export const tabPanelTemplate = (context, definition) => html`
    <template slot="tabpanel" role="tabpanel">
        <slot></slot>
    </template>
`;
