import { PointerTarget } from "../pointer-target.js";
import { PointerInfo } from "./pointer-info.js";

export interface PointerGestureInfo {
    pointerInfo: PointerInfo;
    target?: PointerTarget;
}
