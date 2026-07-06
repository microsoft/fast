import { html, ViewTemplate } from "@microsoft/fast-element";
import { Button, FoundationElementTemplate } from "@microsoft/fast-foundation";
import type { DemoCard, DemoCardDefinitionOptions } from "./card";

/**
 * When creating components with FoundationElement.compose, the component definition
 * can provide either a template or a function that creates a template (shown below).
 * If a function is provided then the design system will provide the template function
 * with contextual information related to the design system, as well as the definition
 * configuration object provided by combining the base configuration with any customization
 * options provided by the developer. Together, these inputs enable customizing the template
 * for the component itself.
 *
 * Below, the context.tagFor helper is used to enable this card to be reusable with any
 * design system based Foundation Button. This could be fluent-button, fast-button, or
 * any custom button configured with the design system.
 *
 * Additionally, the definition object is used to allow the developer to specify custom
 * "like-button" slotted content. If supplied this will be used across all instances of this card,
 * overriding what was originally built-in.
 */
export const template: FoundationElementTemplate<
    ViewTemplate<DemoCard>,
    DemoCardDefinitionOptions
> = (context, definition) => {
    const buttonTag = context.tagFor(Button);

    return html`
        <div class="feature-image">
            <slot name="feature-media"></slot>
        </div>
        <div class="content">
            <slot name="attribution"></slot>
            <slot name="heading"></slot>
        </div>
        <div class="footer">
            <slot name="like-button">
                ${definition.likeButton || html`<${buttonTag}>Like</${buttonTag}>`}
            </slot>
        </div>
    `;
};
