import { create } from "./create.js";

/** @public */
export const designUnit = create<number>("design-unit").withDefault(4);

/** @public */
export const controlCornerRadius = create<number>("control-corner-radius").withDefault(4);

/** @public */
export const layerCornerRadius = create<number>("layer-corner-radius").withDefault(8);

/** @public */
export const strokeWidth = create<number>("stroke-width").withDefault(1);

/** @public */
export const focusStrokeWidth = create<number>("focus-stroke-width").withDefault(2);
