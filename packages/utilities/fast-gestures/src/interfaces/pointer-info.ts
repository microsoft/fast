import { PointerGesture } from "../pointer-gesture";
import { PointerRotationDirection } from "../pointer-rotation-direction";

export interface PointerInfo extends Partial<PointerEvent> {
    /**
     *  isDown: Indicates whether the finger or mouse button is currently down.
     */
    isDown: boolean;

    /**
     *  isLongPressComplete: Indicates a LongPress gesture has been completed
     */
    isLongPressComplete: boolean;

    /**
     * id: exposes the browser pointerId
     */
    id: number;

    /**
     * x: horizontal axis equivalent to pageX by default but
     * can be switched by changing the optional coordinateType parameter
     */
    x: number;

    /**
     * y: vertical axis equivalent to pageY by default but
     * can be switched by changing the optional coordinateType parameter
     */
    y: number;

    /**
     * screenX is PointerEvent.screenX
     */
    screenX: number;

    /**
     * screenY is PointerEvent.screenY
     */
    screenY: number;

    /**
     * offsetX is PointerEvent.offsetX
     */
    offsetX: number;

    /**
     * offsetY is PointerEvent.offsetY
     */
    offsetY: number;

    /**
     * xInitial is PointerEvent.xInitial
     */
    xInitial: number;

    /**
     * yInitial is PointerEvent.yInitial
     */
    yInitial: number;

    /**
     * screenXInitial: the initial value of PointerEvent.screenX on PointerGesture.Start
     */
    screenXInitial: number;

    /**
     * screenYInitial: the initial value of PointerEvent.screenY on PointerGesture.Start
     */
    screenYInitial: number;

    /**
     * xDelta: the difference between x and xInitial
     */
    xDelta: number;

    /**
     * yDelta: the difference between y and yInitial
     */
    yDelta: number;

    /**
     * screenXDelta: the difference between screenX and screenXInitial
     */
    screenXDelta: number;

    /**
     * screenYDelta: the difference between screenY and screenYInitial
     */
    screenYDelta: number;

    /**
     * xVelocity: xDelta by time
     */
    xVelocity: number;

    /**
     * yVelocity: yDelta by time
     */
    yVelocity: number;

    /**
     * lastUpdateTime is the PointerEvent.timestamp
     */
    lastUpdateTime: number;

    /**
     * initialPressTime is the performance.now() on start
     */
    initialPressTime: number;

    /**
     * longPressProgress: Number value from 0-1 indicating the progress of the long press gesture
     */
    longPressProgress: number;

    /**
     *  eventType: Indicates the current pointer event type in the gesture
     */
    eventType: string;

    /**
     *  gestureType: Indicates the last activated PointerGesture that has been detected
     */
    gestureType?: PointerGesture;

    /**
     *  pinchDistance: Indicates the value of the distance between a primary and secondary pointer
     */
    pinchDistance: number;

    /**
     * initialPinchDistance: Indicates the value of the initial distance between a primary and secondary pointer
     */
    initialPinchDistance: number;

    /**
     *  rotationDirection: Indicates the clockwise or counter-clockwise direction of the rotation
     */
    rotationDirection: PointerRotationDirection;

    /**
     *  rotationAngle: Indicates the angle value in degrees between a primary and secondary pointer
     */
    rotationAngle: number;

    /**
     * initialRotationAngle: Indicates the initial angle value in degrees between a primary and secondary pointer
     */
    initialRotationAngle: number;

    /**
     *  width: Indicates the width of the pointer or PointerEvent.width
     */
    width: number;

    /**
     *  height: Indicates the height of the pointer or PointerEvent.height
     */
    height: number;

    /**
     *  tiltX: Indicates the horizontal tilt of a pointer of type pen or PointerEvent.tiltX
     */
    tiltX: number;

    /**
     *  tiltY: Indicates the horizontal tilt of a pointer of type pen or PointerEvent.tiltY
     */
    tiltY: number;

    /**
     *  twist: Indicates the horizontal twist of a pointer of type pen or PointerEvent.twist
     */
    twist: number;

    /**
     *  movementX: Indicates the difference between PointerEvent.screenX and the previous screenX or PointerEvent.movementX
     */
    movementX: number;

    /**
     *  movementY: Indicates the difference between PointerEvent.screenY and the previous screenY or PointerEvent.movementY
     */
    movementY: number;

    /**
     *  tangentialPressure is PointerEvent.tangentialPressure
     */
    tangentialPressure: number;
}
