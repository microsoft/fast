import {
    css,
    ElementViewTemplate,
    FASTElement,
    html,
    observable,
    ref,
} from "@microsoft/fast-element";
import type { FASTAnchoredRegion } from "../../anchored-region.js";
import type { DraggableAnchor } from "./draggable-anchor.js";

export function registerARTiles() {
    ARTiles.define({
        name: "ar-tiles",
        template: arTilesTemplate(),
        styles: arTilesStyles,
    });
}

/**
 *
 *
 * @public
 */
export class ARTiles extends FASTElement {
    @observable
    public items: object[];

    public connectedCallback(): void {
        super.connectedCallback();
    }

    public disconnectedCallback(): void {
        super.disconnectedCallback();
    }
}

const sectionDividerTemplate = html`
    <fast-divider style="margin:20px;"></fast-divider>
`;

/**
 * The template
 * @public
 */
export function arTilesTemplate<T extends ARTiles>(): ElementViewTemplate<T> {
    return html<T>`
        <template>
            <h1>
                Ranking
            </h1>
            ${sectionDividerTemplate} Blah ${sectionDividerTemplate}

            <div class="container>
                <slot></slot>
            </div>

        </template>
    `;
}

export const arTilesStyles = css`
    :host {
        display: block;
    }
`;
