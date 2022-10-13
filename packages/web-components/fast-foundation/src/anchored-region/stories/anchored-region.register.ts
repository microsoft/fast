import { css } from "@microsoft/fast-element";
import { FASTAnchoredRegion } from "../anchored-region.js";
import { anchoredRegionTemplate } from "../anchored-region.template.js";
import {
    DraggableAnchor,
    draggableAnchorStyles,
    draggableAnchorTemplate,
} from "./examples/draggable-anchor.js";
import {
    AnchoredRegionPointer,
    anchoredRegionPointerStyles,
    anchoredRegionPointerTemplate,
} from "./examples/anchored-region-pointer.js";
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
        will-change: transform;
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
    styles: draggableAnchorStyles,
});

AnchoredRegionPointer.define({
    name: "anchored-region-pointer",
    template: anchoredRegionPointerTemplate(),
    styles: anchoredRegionPointerStyles,
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
