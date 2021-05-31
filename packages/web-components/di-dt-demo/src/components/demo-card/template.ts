import { Button } from "@microsoft/fast-components";
import { html, ViewTemplate } from "@microsoft/fast-element";
import { ElementDefinitionContext } from "@microsoft/fast-foundation";

export const template = (context: ElementDefinitionContext): ViewTemplate => {
    const buttonTag = context.tagFor(Button);
    return html`
        <img class="feature-image" src="https://via.placeholder.com/300x156">
        <div class="content">
            <slot name="heading"></slot>
        </div>
        <div class="footer">
            <${buttonTag}>Like</${buttonTag}>
        </div>
    `;
};
