import {
    css,
    ElementViewTemplate,
    FASTElement,
    html,
    observable,
} from "@microsoft/fast-element";
import type { ARTile } from "./ar-tile.js";

export function registerTileDispenser() {
    TileDispenser.define({
        name: "tile-dispenser",
        template: tileDispenserTemplate(),
        styles: tileDispenserStyles,
    });
}

/**
 *
 *
 * @public
 */
export class TileDispenser extends FASTElement {
    @observable
    public connectedTile: ARTile | undefined;

    public connectedCallback(): void {
        super.connectedCallback();
    }

    public disconnectedCallback(): void {
        super.disconnectedCallback();
    }
}

/**
 * The template
 * @public
 */
export function tileDispenserTemplate<T extends TileDispenser>(): ElementViewTemplate<T> {
    return html<T>`
        <template></template>
    `;
}

export const tileDispenserStyles = css`
    :host {
        box-sizing: border-box;
    }
`;
