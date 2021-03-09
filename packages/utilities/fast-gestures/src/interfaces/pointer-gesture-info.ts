import { PointerTarget } from "../pointer-target";
import { IPointerInfo } from "./pointer-info";

export interface IPointerGestureInfo {
  pointerInfo: IPointerInfo;
  target?: PointerTarget;
}
