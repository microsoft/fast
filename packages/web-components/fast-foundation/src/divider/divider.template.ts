import { ElementViewTemplate, html } from "@microsoft/fast-element";
import { async } from "@microsoft/fast-element/async";
import type { FASTDivider } from "./divider.js";

/**
 * The template for the {@link @microsoft/fast-foundation#FASTDivider} component.
 * @public
 */
export function dividerTemplate<T extends FASTDivider>(): ElementViewTemplate<T> {
    return html<T>`
        <template role="${x => x.role}" aria-orientation="${x => x.orientation}">
            <p>
                ${async(
                    x => x.delayLoad(),
                    html`
                        <h1>Hello world</h1>
                    `
                )}
            </p>
        </template>
    `;
}
