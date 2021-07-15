import { elements, html, slotted } from "@microsoft/fast-element";
/**
 * The template for the {@link @microsoft/fast-foundation#Breadcrumb} component.
 * @public
 */
export const breadcrumbTemplate = (context, definition) => html`
    <template role="navigation">
        <div role="list" class="list" part="list">
            <slot
                ${slotted({ property: "slottedBreadcrumbItems", filter: elements() })}
            ></slot>
        </div>
    </template>
`;
