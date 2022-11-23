import {
    children,
    css,
    elements,
    ElementViewTemplate,
    FASTElement,
    html,
    observable,
} from "@microsoft/fast-element";
import { ColumnDefinition, FASTDataGrid } from "../../../../index.js";
import type { TileDispenser } from "./tile-dispenser.js";

export function registerHandPane() {
    HandPane.define({
        name: "hand-pane",
        template: handPaneTemplate(),
        styles: handPaneStyles,
    });
}

/**
 *
 *
 * @public
 */
export class HandPane extends FASTElement {
    @observable
    public tileDispensers: HTMLElement[] = [];

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
export function handPaneTemplate<T extends HandPane>(): ElementViewTemplate<T> {
    return html<T>`
        <template
            ${children({
                property: "tileDispensers",
                filter: elements("tile-dispenser"),
            })}
        >
            <slot></slot>
        </template>
    `;
}

export const handPaneStyles = css`
    :host {
        flex-wrap: wrap;
        display: flex;
    }
`;
