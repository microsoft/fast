import { PointerGesture } from "../pointer-gesture";

export function getSwipeDirection(pointerGestureMove: PointerGesture): PointerGesture {
    switch (pointerGestureMove) {
        case PointerGesture.PanUp:
            return PointerGesture.SwipeUp;

        case PointerGesture.PanDown:
            return PointerGesture.SwipeDown;

        case PointerGesture.PanLeft:
            return PointerGesture.SwipeLeft;

        case PointerGesture.PanRight:
            return PointerGesture.SwipeRight;

        case PointerGesture.PanUpLeft:
            return PointerGesture.SwipeUpLeft;

        case PointerGesture.PanUpRight:
            return PointerGesture.SwipeUpRight;

        case PointerGesture.PanDownLeft:
            return PointerGesture.SwipeDownLeft;

        case PointerGesture.PanDownRight:
            return PointerGesture.SwipeDownRight;

        default:
            return PointerGesture.Swipe;
    }
}
