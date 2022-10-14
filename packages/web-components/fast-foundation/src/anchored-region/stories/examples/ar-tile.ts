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

export function registerARTile() {
    ARTiles.define({
        name: "ar-tile",
        template: arTileTemplate(),
        styles: arTileStyles,
    });
}

/**
 *
 *
 * @public
 */
export class ARTile extends FASTElement {
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
export function arTileTemplate<T extends ARTile>(): ElementViewTemplate<T> {
    return html<T>`
        <template></template>
    `;
}

export const arTileStyles = css`
    :host {
        display: block;
    }
`;
