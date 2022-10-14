import { css } from "@microsoft/fast-element";
import { FASTAnchoredRegion } from "../anchored-region.js";
import { anchoredRegionTemplate } from "../anchored-region.template.js";
import { registerDraggableAnchor } from "./examples/draggable-anchor.js";
import { registerAnchoredRegionPointer } from "./examples/anchored-region-pointer.js";
import { registerARPositionDemo } from "./examples/ar-position-demo.js";
import { registerARMenuPatterns } from "./examples/ar-menu-patterns.js";
import { registerARLockIntoView } from "./examples/ar-lockintoview.js";
import { registerARTiles } from "./examples/ar-tiles.js";

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
registerDraggableAnchor();
registerAnchoredRegionPointer();
registerARPositionDemo();
registerARMenuPatterns();
registerARLockIntoView();
registerARTiles();
