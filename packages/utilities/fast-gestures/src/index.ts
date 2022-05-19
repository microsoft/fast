export {
    Disposable as IDisposable,
    DefaultDisposable as Disposable,
} from "./base/lifecycle.js";
export { PointerGestureInfo as IPointerGestureInfo } from "./interfaces/pointer-gesture-info.js";
export { PointerGestureOptions as IPointerGestureOptions } from "./interfaces/pointer-gesture-options.js";
export { PointerInfo as IPointerInfo } from "./interfaces/pointer-info.js";
export { PointerInfoInternal as IPointerInfoInternal } from "./interfaces/pointer-info-internal.js";
export { PointerGesture } from "./pointer-gesture.js";
export { PointerGestureFeature } from "./pointer-gesture-feature.js";
export { PointerTarget } from "./pointer-target.js";
export { PointerCoordinateType } from "./pointer-coordinate-type.js";
export { PointerTranslationDirection } from "./pointer-translation-direction.js";
export { PointerRotationDirection } from "./pointer-rotation-direction.js";
export * from "./pointer-gesture-handler.js";
