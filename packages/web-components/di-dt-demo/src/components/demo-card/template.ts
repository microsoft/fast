import { Button } from "@microsoft/fast-components";
import { html, ViewTemplate, when } from "@microsoft/fast-element";
import {
    ElementDefinitionContext,
    OverrideFoundationElementDefinition,
} from "@microsoft/fast-foundation";
import type { DemoCard, DemoCardDefinitionOptions } from "./demo-card";

export const template = (
    context: ElementDefinitionContext,
    definition: OverrideFoundationElementDefinition<DemoCardDefinitionOptions>
): ViewTemplate<DemoCard> => {
    const buttonTag = context.tagFor(Button);

    return html`
        <img class="feature-image" src="https://via.placeholder.com/300x156" />
        <div class="content">
            <slot name="heading"></slot>
        </div>
        <div class="footer">
            <slot name="like-button">
                ${when(() => definition.likeButton, definition.likeButton!)}
                ${when(
                    () => !definition.likeButton,
                    html`
                <${buttonTag}>Like</${buttonTag}>
                `
                )}
            </slot>
        </div>
    `;
};
