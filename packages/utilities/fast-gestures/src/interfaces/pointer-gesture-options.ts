import { PointerCoordinateType } from "../pointer-coordinate-type";
import { PointerTranslationDirection } from "../pointer-translation-direction";

export interface PointerGestureOptions {
    swipeThresholdX?: number;
    swipeThresholdY?: number;
    swipeVelocityThreshold?: number;
    pinchDistanceThreshold?: number;
    pressThreshold?: number;
    touchMoveThreshold?: number;
    mouseMoveThreshold?: number;
    isHoverEnabled?: boolean;
    isMultiTouchEnabled?: boolean;
    singleTapTime?: number;
    doubleTapTimeout?: number;
    longPressDuration?: number;
    rotationAngleThreshold?: number;
    translationDirection?: PointerTranslationDirection;
    coordinateType?: PointerCoordinateType;
    shouldSetFocusOnActiveElement?: boolean;
}
