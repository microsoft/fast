import { css, ElementViewTemplate, html, observable } from "@microsoft/fast-element";
import { keyEnter, keyFunction2 } from "@microsoft/fast-web-utilities";
import { FASTDataGridCell } from "../../../../index.js";
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
export class TileDispenser extends FASTDataGridCell {
    @observable
    public connectedTile: ARTile | undefined;

    @observable
    public active: boolean = false;

    public connectedCallback(): void {
        super.connectedCallback();
        this.$emit("dispenserconnected", { dispenser: this });
    }

    public disconnectedCallback(): void {
        super.disconnectedCallback();
        this.$emit("dispenserconnected", { dispenser: this });
    }

    public handleKeydown(e: KeyboardEvent): void {
        if (e.defaultPrevented) {
            return;
        }
        switch (e.key) {
            case keyEnter:
            case keyFunction2:
                e.preventDefault();
                this.$emit("dispenserinvoked", { dispenser: this });
                break;
        }
    }
}

/**
 * The template
 * @public
 */
export function tileDispenserTemplate<T extends TileDispenser>(): ElementViewTemplate<T> {
    return html<T>`
        <template class="${x => (x.active ? "active" : void 0)}">
            ${x => x.connectedTile?.tileData.title}
        </template>
    `;
}

export const tileDispenserStyles = css`
    :host {
        box-sizing: border-box;
    }
`;
