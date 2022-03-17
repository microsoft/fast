import { PointerGesture } from "../pointer-gesture";
import { PointerTranslationDirection } from "../pointer-translation-direction";

function getCardinalPanDirection(directionIndex: number): PointerGesture {
    switch (directionIndex) {
        case 0:
            return PointerGesture.PanDown;
        case 1:
            return PointerGesture.PanLeft;
        case 2:
            return PointerGesture.PanUp;
        case 3:
            return PointerGesture.PanRight;
        default:
            return PointerGesture.Tap;
    }
}

function getOrdinalPanDirection(directionIndex: number): PointerGesture {
    switch (directionIndex) {
        case 0:
            return PointerGesture.PanDownRight;
        case 1:
            return PointerGesture.PanDown;
        case 2:
            return PointerGesture.PanDownLeft;
        case 3:
            return PointerGesture.PanLeft;
        case 4:
            return PointerGesture.PanUpLeft;
        case 5:
            return PointerGesture.PanUp;
        case 6:
            return PointerGesture.PanUpRight;
        case 7:
            return PointerGesture.PanRight;
        default:
            return PointerGesture.Tap;
    }
}

function getVerticalPanDirection(directionIndex: number): PointerGesture {
    switch (directionIndex) {
        case 0:
        case 1:
        case 2:
            return PointerGesture.PanDown;
        case 3:
            return PointerGesture.Pan;
        case 4:
        case 5:
        case 6:
            return PointerGesture.PanUp;
        case 7:
            return PointerGesture.Pan;
        default:
            return PointerGesture.Tap;
    }
}

function getHorizontalPanDirection(directionIndex: number): PointerGesture {
    switch (directionIndex) {
        case 0:
            return PointerGesture.PanRight;
        case 1:
            return PointerGesture.Pan;
        case 2:
        case 3:
        case 4:
            return PointerGesture.PanLeft;
        case 5:
            return PointerGesture.Pan;
        case 6:
        case 7:
            return PointerGesture.PanRight;
        default:
            return PointerGesture.Tap;
    }
}

function getVectorAngle(x: number, y: number): number {
    const offset: number = 22.5 * (Math.PI / 180);
    const angle: number = Math.atan2(y, x) - offset;

    return angle < 0 ? 2 * Math.PI + angle : angle;
}

export function detectPointerGesture(
    x: number,
    y: number,
    translationDirection: PointerTranslationDirection
): PointerGesture {
    const directionsLength: number =
        translationDirection === PointerTranslationDirection.Cardinal ? 4 : 8;
    const vectorAngle: number = getVectorAngle(x, y);
    const directionIndex: number = Math.floor(
        (vectorAngle / (2 * Math.PI)) * directionsLength
    );

    switch (translationDirection) {
        case PointerTranslationDirection.Ordinal:
            return getOrdinalPanDirection(directionIndex);

        case PointerTranslationDirection.Vertical:
            return getVerticalPanDirection(directionIndex);

        case PointerTranslationDirection.Horizontal:
            return getHorizontalPanDirection(directionIndex);

        default:
            return getCardinalPanDirection(directionIndex);
    }
}
