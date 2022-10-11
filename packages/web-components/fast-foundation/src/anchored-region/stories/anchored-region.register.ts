import { css } from "@microsoft/fast-element";
import { FASTAnchoredRegion } from "../anchored-region.js";
import { anchoredRegionTemplate } from "../anchored-region.template.js";
import { DraggableAnchor, draggableAnchorTemplate } from "./examples/draggable-anchor.js";
import {
    ARPositionDemo,
    arPositionDemoStyles,
    arPositionDemoTemplate,
} from "./examples/ar-position-demo.js";

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

//utility component for examples
ARPositionDemo.define({
    name: "ar-position-demo",
    template: arPositionDemoTemplate(),
    styles: arPositionDemoStyles,
});
