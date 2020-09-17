import { html } from "@microsoft/fast-element";
import { Disclosure } from "./disclosure";

/**
 * The template for the {@link @microsoft/fast-foundation#Disclosure} component.
 * @public
 */
export const DisclosureTemplate = html<Disclosure>`
    <template>
        <slot name="invoker"></slot>
        <slot name="content"></slot>
    </template>
`;
