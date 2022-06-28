import { css } from "@microsoft/fast-element";
import { DesignSystem } from "../../design-system/design-system.js";
import { VirtualList } from "../virtual-list.js";
import { virtualListTemplate as template } from "../virtual-list.template.js";

const styles = () => css``;

DesignSystem.getOrCreate()
    .withPrefix("fast")
    .register(
        VirtualList.compose({
            baseName: "virtual-list",
            styles,
            template,
        })()
    );
