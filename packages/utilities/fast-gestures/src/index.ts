export {
    Disposable as IDisposable,
    DefaultDisposable as Disposable,
} from "./base/lifecycle";
export { PointerGestureInfo as IPointerGestureInfo } from "./interfaces/pointer-gesture-info";
export { PointerGestureOptions as IPointerGestureOptions } from "./interfaces/pointer-gesture-options";
export { PointerInfo as IPointerInfo } from "./interfaces/pointer-info";
export { PointerInfoInternal as IPointerInfoInternal } from "./interfaces/pointer-info-internal";
export { PointerGesture } from "./pointer-gesture";
export { PointerGestureFeature } from "./pointer-gesture-feature";
export { PointerTarget } from "./pointer-target";
export { PointerCoordinateType } from "./pointer-coordinate-type";
export { PointerTranslationDirection } from "./pointer-translation-direction";
export { PointerRotationDirection } from "./pointer-rotation-direction";
export * from "./pointer-gesture-handler";
