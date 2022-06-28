import { css } from "@microsoft/fast-element";
import { DesignSystem } from "../../design-system/design-system.js";
import { VirtualListItem } from "../virtual-list-item.js";
import { virtualListItemTemplate as template } from "../virtual-list-item.template.js";

const styles = () => css``;

DesignSystem.getOrCreate()
    .withPrefix("fast")
    .register(
        VirtualListItem.compose({
            baseName: "virtual-list-item",
            styles,
            template,
        })()
    );
