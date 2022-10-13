import { css } from "@microsoft/fast-element";
import { FASTAnchoredRegion } from "../anchored-region.js";
import { anchoredRegionTemplate } from "../anchored-region.template.js";
import { DraggableAnchor, draggableAnchorTemplate } from "./examples/draggable-anchor.js";
import {
    ARPositionDemo,
    arPositionDemoStyles,
    arPositionDemoTemplate,
} from "./examples/ar-position-demo.js";
import {
    ARMenuPatterns,
    arMenuPatternsStyles,
    arMenuPatternsTemplate,
} from "./examples/ar-menu-patterns.js";
import {
    ARLockIntoView,
    arLockIntoViewStyles,
    arLockIntoViewTemplate,
} from "./examples/ar-lockintoview.js";

const styles = css`
    :host {
        display: block;
    }
`;

FASTAnchoredRegion.define({
    name: "fast-anchored-region",
    template: anchoredRegionTemplate(),
    styles,
});

//components for examples
DraggableAnchor.define({
    name: "draggable-anchor",
    template: draggableAnchorTemplate(),
    styles,
});

ARPositionDemo.define({
    name: "ar-position-demo",
    template: arPositionDemoTemplate(),
    styles: arPositionDemoStyles,
});

ARMenuPatterns.define({
    name: "ar-menu-patterns",
    template: arMenuPatternsTemplate(),
    styles: arMenuPatternsStyles,
});

ARLockIntoView.define({
    name: "ar-lock-into-view",
    template: arLockIntoViewTemplate(),
    styles: arLockIntoViewStyles,
});
