import { css } from "@microsoft/fast-element";
import { DesignSystem } from "../../design-system/design-system.js";
import { DataGrid } from "../data-grid.js";
import { dataGridTemplate } from "../data-grid.template.js";

const dataGridStyles = () => css`
    :host {
        display: block;
    }
`;

DesignSystem.getOrCreate(document.body)
    .withPrefix("fast")
    .register(
        DataGrid.compose({
            baseName: "data-grid",
            styles: dataGridStyles,
            template: dataGridTemplate,
        })()
    );
