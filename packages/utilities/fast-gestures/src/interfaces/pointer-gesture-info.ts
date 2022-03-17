import { PointerTarget } from "../pointer-target";
import { PointerInfo } from "./pointer-info";

export interface PointerGestureInfo {
    pointerInfo: PointerInfo;
    target?: PointerTarget;
}
