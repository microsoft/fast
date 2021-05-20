import { Emitter } from "./base/event";
import { DefaultDisposable, Disposable } from "./base/lifecycle";
import { Point } from "./base/point";
import { detectPointerGesture } from "./utilities/detect-pointer-gesture";
import { getCoordinateType } from "./utilities/get-coordinate-type";
import { getPinchDistance } from "./utilities/get-pinch-distance";
import { getRotationAngle } from "./utilities/get-rotation-angle";
import { getSwipeDirection } from "./utilities/get-swipe-direction";
import { PointerGestureInfo } from "./interfaces/pointer-gesture-info";
import { PointerGestureOptions } from "./interfaces/pointer-gesture-options";
import { PointerInfo } from "./interfaces/pointer-info";
import { PointerInfoInternal } from "./interfaces/pointer-info-internal";
import { PointerGesture } from "./pointer-gesture";
import { PointerTarget } from "./pointer-target";
import { PointerGestureFeature } from "./pointer-gesture-feature";
import { PointerCoordinateType } from "./pointer-coordinate-type";
import { PointerEventType } from "./pointer-event-type";
import { PointerInputType } from "./pointer-input-type";
import { PointerTranslationDirection } from "./pointer-translation-direction";
import { PointerRotationDirection } from "./pointer-rotation-direction";

/**
 * @public
 */
export type IPointerGestureConfig = Partial<Record<PointerGestureFeature, boolean>>;

/**
 * @public
 */
export type PointerGestureCallback = (
    pointerGestureInfo: PointerGestureInfo
) => void | null;

/**
 * @public
 */
export interface Pointer {
    pointerId: number;
    pointerInfo: PointerInfo;
}

const DOUBLE_TAP_TIMEOUT: number = 300;
const LONG_PRESS_DURATION: number = 900;
const MINIMUM_DISTANCE_TOLERANCE: number = 0.001;
const MOUSE_MOVE_THRESHOLD: number = 0.25;
const PINCH_DISTANCE_THRESHOLD: number = 5;
const PRESS_THRESHOLD: number = 8;
const ROTATE_ANGLE_THRESHOLD: number = 1.5;
const SINGLE_TAP_TIME: number = 200;
const SWIPE_DELTA_THRESHOLD: number = 60;
const SWIPE_VELOCITY_THRESHOLD: number = 20;
const TOUCH_MOVE_THRESHOLD: number = 5;

const DEFAULT_OPTIONS: PointerGestureOptions = {
    coordinateType: PointerCoordinateType.Page,
    isHoverEnabled: false,
    isMultiTouchEnabled: true,
    doubleTapTimeout: DOUBLE_TAP_TIMEOUT,
    longPressDuration: LONG_PRESS_DURATION,
    mouseMoveThreshold: MOUSE_MOVE_THRESHOLD,
    pinchDistanceThreshold: PINCH_DISTANCE_THRESHOLD,
    pressThreshold: PRESS_THRESHOLD,
    rotationAngleThreshold: ROTATE_ANGLE_THRESHOLD,
    singleTapTime: SINGLE_TAP_TIME,
    swipeThresholdX: SWIPE_DELTA_THRESHOLD,
    swipeThresholdY: SWIPE_DELTA_THRESHOLD,
    swipeVelocityThreshold: SWIPE_VELOCITY_THRESHOLD,
    touchMoveThreshold: TOUCH_MOVE_THRESHOLD,
    translationDirection: PointerTranslationDirection.Cardinal,
    shouldSetFocusOnActiveElement: false,
};

/**
 * Gesture detection using the PointerEvent API for device-agnostic cross-compatibility and enhanced functionality
 *
 * @public
 */
export class PointerGestureHandler extends DefaultDisposable implements Disposable {
    private options: PointerGestureOptions = DEFAULT_OPTIONS;
    private target: PointerTarget;
    private activePointer: PointerInfoInternal;
    private previousPosition: Point = { x: 0, y: 0 };
    private previousPointerType: string | undefined = undefined;
    private previousPanDirection: PointerGesture;
    private longPressRAFId: number = 0;
    private doubleTapTimerId: number = 0;
    private doubleTapIsWaiting: boolean = false;

    private handlers: Record<PointerGesture, Emitter<PointerGestureInfo>> = {
        [PointerGesture.General]: new Emitter<PointerGestureInfo>(),
        [PointerGesture.Start]: new Emitter<PointerGestureInfo>(),
        [PointerGesture.End]: new Emitter<PointerGestureInfo>(),
        [PointerGesture.MouseEnter]: new Emitter<PointerGestureInfo>(),
        [PointerGesture.MouseLeave]: new Emitter<PointerGestureInfo>(),
        [PointerGesture.MouseMove]: new Emitter<PointerGestureInfo>(),
        [PointerGesture.Drag]: new Emitter<PointerGestureInfo>(),
        [PointerGesture.Pan]: new Emitter<PointerGestureInfo>(),
        [PointerGesture.PanUp]: new Emitter<PointerGestureInfo>(),
        [PointerGesture.PanDown]: new Emitter<PointerGestureInfo>(),
        [PointerGesture.PanLeft]: new Emitter<PointerGestureInfo>(),
        [PointerGesture.PanRight]: new Emitter<PointerGestureInfo>(),
        [PointerGesture.PanUpRight]: new Emitter<PointerGestureInfo>(),
        [PointerGesture.PanUpLeft]: new Emitter<PointerGestureInfo>(),
        [PointerGesture.PanDownLeft]: new Emitter<PointerGestureInfo>(),
        [PointerGesture.PanDownRight]: new Emitter<PointerGestureInfo>(),
        [PointerGesture.Swipe]: new Emitter<PointerGestureInfo>(),
        [PointerGesture.SwipeUp]: new Emitter<PointerGestureInfo>(),
        [PointerGesture.SwipeRight]: new Emitter<PointerGestureInfo>(),
        [PointerGesture.SwipeDown]: new Emitter<PointerGestureInfo>(),
        [PointerGesture.SwipeLeft]: new Emitter<PointerGestureInfo>(),
        [PointerGesture.SwipeUpRight]: new Emitter<PointerGestureInfo>(),
        [PointerGesture.SwipeUpLeft]: new Emitter<PointerGestureInfo>(),
        [PointerGesture.SwipeDownRight]: new Emitter<PointerGestureInfo>(),
        [PointerGesture.SwipeDownLeft]: new Emitter<PointerGestureInfo>(),
        [PointerGesture.Tap]: new Emitter<PointerGestureInfo>(),
        [PointerGesture.DoubleTap]: new Emitter<PointerGestureInfo>(),
        [PointerGesture.LongPressProgress]: new Emitter<PointerGestureInfo>(),
        [PointerGesture.LongPressComplete]: new Emitter<PointerGestureInfo>(),
        [PointerGesture.Pinch]: new Emitter<PointerGestureInfo>(),
        [PointerGesture.PinchIn]: new Emitter<PointerGestureInfo>(),
        [PointerGesture.PinchOut]: new Emitter<PointerGestureInfo>(),
        [PointerGesture.Rotate]: new Emitter<PointerGestureInfo>(),
        [PointerGesture.RotateCounterClockwise]: new Emitter<PointerGestureInfo>(),
        [PointerGesture.RotateClockwise]: new Emitter<PointerGestureInfo>(),
    };

    private shouldDetectGesture: IPointerGestureConfig = {
        [PointerGestureFeature.Swipe]: false,
        [PointerGestureFeature.DoubleTap]: false,
        [PointerGestureFeature.LongPress]: false,
        [PointerGestureFeature.Pan]: false,
        [PointerGestureFeature.Pinch]: false,
        [PointerGestureFeature.Rotate]: false,
    };

    private _pointers: Map<number, PointerInfoInternal> = new Map();

    public get pointers(): Map<number, PointerInfoInternal> {
        return this._pointers;
    }

    public get pointersArray(): Pointer[] {
        return Array.from(this._pointers, ([pointerId, pointerInfo]: [number, PointerInfoInternal]) => ({
            pointerId,
            pointerInfo,
        }));
    }

    constructor(
        _target: Window | HTMLElement | null = window,
        options?: PointerGestureOptions
    ) {
        super();

        this.target = _target;
        this.options =
            options !== undefined ? { ...DEFAULT_OPTIONS, ...options } : DEFAULT_OPTIONS;
        this.target?.addEventListener(PointerEventType.Down, this.handlePointerStart, {
            passive: false,
        });
        this.target?.addEventListener(PointerEventType.Move, this.handlePointerMove, {
            passive: false,
        });
        this.target?.addEventListener(PointerEventType.Up, this.handlePointerEnd, {
            passive: false,
        });
        this.target?.addEventListener(PointerEventType.Cancel, this.handlePointerEnd, {
            passive: false,
        });

        if (this.options.isHoverEnabled) {
            this.target?.addEventListener(
                PointerEventType.Enter,
                this.handlePointerEnter,
                { passive: false }
            );
            this.target?.addEventListener(
                PointerEventType.Leave,
                this.handlePointerLeave,
                { passive: false }
            );
        }
    }

    private emit(
        type: PointerGesture,
        pointerInfo: PointerInfoInternal,
        shouldFireGeneralEvent: boolean = false
    ): void {
        if (shouldFireGeneralEvent) {
            this.handlers[PointerGesture.General].fire({
                pointerInfo,
                target: this.target,
            });
        }
        this.handlers[type].fire({ pointerInfo, target: this.target });
    }

    private isHtmlElement(obj: any): obj is HTMLElement {
        return obj.innerText !== undefined;
    }

    private isDown(e: PointerEvent): boolean {
        return (e.buttons & 1) > 0;
    }

    private addPointerInfo(e: PointerEvent): PointerInfoInternal {
        const { x, y }: Point = getCoordinateType(e, this.options.coordinateType!);
        const pointerInfo: PointerInfoInternal = {
            pointerType: e.pointerType,
            eventType: e.type,
            id: e.pointerId,
            isPrimary: e.isPrimary,
            isDown: this.isDown(e),
            initialPressTime: performance.now(),
            xInitial: x,
            yInitial: y,
            x,
            y,
            offsetX: e.offsetX,
            offsetY: e.offsetY,
            xDelta: 0,
            yDelta: 0,
            screenXInitial: e.screenX,
            screenYInitial: e.screenY,
            screenX: e.screenX,
            screenY: e.screenY,
            screenXDelta: 0,
            screenYDelta: 0,
            xVelocity: 0,
            yVelocity: 0,
            lastUpdateTime: e.timeStamp,
            longPressProgress: 0,
            isLongPressComplete: false,
            width: e.width,
            height: e.height,
            tiltX: e.tiltX,
            tiltY: e.tiltY,
            twist: e.twist,
            movementX: e.movementX,
            movementY: e.movementY,
            pinchDistance: 0,
            initialPinchDistance: 0,
            _previousPinchDistance: 0,
            rotationDirection: PointerRotationDirection.Null,
            rotationAngle: 0,
            initialRotationAngle: 0,
            _previousRotationAngle: 0,
            pressure: e.pressure,
            tangentialPressure: e.tangentialPressure,
        };

        if (
            pointerInfo.pointerType !== PointerInputType.Touch ||
            this.previousPointerType !== PointerInputType.Touch ||
            !this.options.isMultiTouchEnabled
        ) {
            this._pointers.clear();
        }

        this.previousPointerType = pointerInfo.pointerType;
        this._pointers.set(e.pointerId, pointerInfo);

        if (
            pointerInfo.pointerType === PointerInputType.Touch &&
            this.options.isMultiTouchEnabled &&
            this._pointers.size > 1
        ) {
            const values: IterableIterator<PointerInfoInternal> = this._pointers.values();
            const pointer1: PointerInfoInternal = values.next().value;
            const pointer2: PointerInfoInternal = values.next().value;

            const pointersDistance: number = getPinchDistance(
                pointer1.x,
                pointer1.y,
                pointer2.x,
                pointer2.y,
                MINIMUM_DISTANCE_TOLERANCE
            );

            pointer1.initialPinchDistance = pointersDistance;
            pointer2.initialPinchDistance = pointersDistance;

            const initialRotationAngle: number = Math.floor(
                (getRotationAngle(pointer1.x, pointer1.y, pointer2.x, pointer2.y) * 100) /
                    100
            );

            pointer1.initialRotationAngle = initialRotationAngle;
            pointer2.initialRotationAngle = initialRotationAngle;
        }

        return pointerInfo;
    }

    private updatePointerInfo(e: PointerEvent): PointerInfoInternal {
        let pointer: PointerInfoInternal;

        if (this.options.isMultiTouchEnabled && this._pointers.has(e.pointerId)) {
            pointer = this._pointers.get(e.pointerId)!;

            const deltaT: number = e.timeStamp - pointer.lastUpdateTime;
            const { x, y }: Point = getCoordinateType(e, this.options.coordinateType!);

            pointer.x = x;
            pointer.y = y;
            pointer.offsetX = e.offsetX;
            pointer.offsetY = e.offsetY;
            pointer.xDelta = pointer.x - pointer.xInitial;
            pointer.yDelta = pointer.y - pointer.yInitial;
            pointer.screenX = e.screenX;
            pointer.screenY = e.screenY;
            pointer.screenXDelta = pointer.screenX - pointer.screenXInitial;
            pointer.screenYDelta = pointer.screenY - pointer.screenYInitial;
            pointer.lastUpdateTime = e.timeStamp;
            pointer.isDown = this.isDown(e);
            pointer.eventType = e.type;
            pointer.width = e.width;
            pointer.height = e.height;
            pointer.tiltX = e.tiltX;
            pointer.tiltY = e.tiltY;
            pointer.twist = e.twist;
            pointer.movementX = e.movementX;
            pointer.movementY = e.movementY;
            pointer.tangentialPressure = e.tangentialPressure;

            // Deal with floating point errors and divide by zero
            if (Math.abs(deltaT) <= 0.0001) {
                pointer.xVelocity = 0;
                pointer.yVelocity = 0;
            } else {
                pointer.xVelocity = pointer.xDelta / deltaT;
                pointer.yVelocity = pointer.yDelta / deltaT;
            }
        } else {
            pointer = this.addPointerInfo(e);
        }

        return pointer;
    }

    private updateMultiPointerGesture(
        multiPointer: PointerInfoInternal
    ): PointerInfoInternal {
        const values: IterableIterator<PointerInfoInternal> = this._pointers.values();
        const pointer1: PointerInfoInternal = values.next().value;
        const pointer2: PointerInfoInternal = values.next().value;
        const {
            rotationAngleThreshold,
            pinchDistanceThreshold,
        }: PointerGestureOptions = this.options;

        if (this.shouldDetectGesture[PointerGestureFeature.Rotate]) {
            const rotationAngle: number = getRotationAngle(
                pointer1.x,
                pointer1.y,
                pointer2.x,
                pointer2.y
            );
            const isRotationClockwise: boolean =
                rotationAngle >
                multiPointer._previousRotationAngle + rotationAngleThreshold!;
            const isRotationCounterClockwise: boolean =
                rotationAngle + rotationAngleThreshold! <
                multiPointer._previousRotationAngle;

            multiPointer.rotationAngle = Math.floor(rotationAngle * 100) / 100;

            if (
                Math.abs(
                    multiPointer._previousRotationAngle - multiPointer.rotationAngle
                ) >
                180 / Math.PI
            ) {
                multiPointer.rotationAngle -= 180 / Math.PI;
            }

            if (isRotationClockwise || isRotationCounterClockwise) {
                if (isRotationClockwise) {
                    multiPointer.gestureType = PointerGesture.RotateClockwise;
                    multiPointer.rotationDirection = PointerRotationDirection.Clockwise;
                    this.emit(PointerGesture.RotateClockwise, multiPointer);
                } else if (isRotationCounterClockwise) {
                    multiPointer.gestureType = PointerGesture.RotateCounterClockwise;
                    multiPointer.rotationDirection =
                        PointerRotationDirection.CounterClockwise;
                    this.emit(PointerGesture.RotateCounterClockwise, multiPointer);
                }

                this.emit(PointerGesture.Rotate, multiPointer);
            }

            multiPointer._previousRotationAngle = rotationAngle;
        }

        if (this.shouldDetectGesture[PointerGestureFeature.Pinch]) {
            const pointerDistance: number = getPinchDistance(
                pointer1.x,
                pointer1.y,
                pointer2.x,
                pointer2.y,
                MINIMUM_DISTANCE_TOLERANCE
            );

            multiPointer.pinchDistance = Math.round(pointerDistance * 100) / 100;

            const isPinchOut: boolean =
                pointerDistance >
                multiPointer._previousPinchDistance + pinchDistanceThreshold!;
            const isPinchIn: boolean =
                pointerDistance <
                multiPointer._previousPinchDistance - pinchDistanceThreshold!;

            if (isPinchOut || isPinchIn) {
                if (isPinchOut) {
                    multiPointer.gestureType = PointerGesture.PinchOut;
                    this.emit(PointerGesture.PinchOut, multiPointer);
                } else if (isPinchIn) {
                    multiPointer.gestureType = PointerGesture.PinchIn;
                    this.emit(PointerGesture.PinchIn, multiPointer);
                }

                this.emit(PointerGesture.Pinch, multiPointer);
            }

            multiPointer._previousPinchDistance = multiPointer.pinchDistance;
        }

        return multiPointer;
    }

    private handlePointerStart = (e: PointerEvent): void => {
        if ( this.isHtmlElement(this.target) && this.isHtmlElement(e.target)) {
            this.activePointer = this.updatePointerInfo(e);

            // If there is a primary pointer, ensure it's set as the active pointer
            if (this._pointers.size > 0 && !this.activePointer.isPrimary) {
                this.activePointer =
                    Array.from(this._pointers.values()).find(
                        (pointer: PointerInfoInternal): boolean | undefined =>
                            pointer.isPrimary
                    ) || this._pointers.values().next().value;
            }

            this.activePointer.gestureType = PointerGesture.Start;
            this.activePointer.initialPressTime = performance.now();
            this.activePointer.xInitial = this.activePointer.x;
            this.activePointer.yInitial = this.activePointer.y;
            this.activePointer.screenXInitial = e.screenX;
            this.activePointer.screenYInitial = e.screenY;

            if (this.shouldDetectGesture[PointerGestureFeature.LongPress]) {
                this.startLongPress();
            }

            if (this.options.shouldSetFocusOnActiveElement && this.target.tabIndex) {
                this.target.tabIndex = -1;
            }

            this.emit(PointerGesture.Start, this.activePointer, true);
        }
    };

    private handlePointerMove = (e: PointerEvent): void => {
        const isDrag: boolean =
            (e.pointerType === PointerInputType.Mouse && this.isDown(e)) ||
            e.pointerType === PointerInputType.Touch;

        if (
            isDrag || // Mouse/touch drag
            (e.pointerType === PointerInputType.Mouse && this.options.isHoverEnabled) || // Mouse hover
            (e.pointerType === PointerInputType.Pen && this.options.isHoverEnabled) || // Pen hover
            (e.pointerType === PointerInputType.Pen &&
                this.isDown(e) &&
                !this.options.isHoverEnabled) // Pen move
        ) {
            this.activePointer = this.updatePointerInfo(e);

            if (this.shouldDetectGesture[PointerGestureFeature.Pan]) {
                const panThreshold: number =
                    this.activePointer.pointerType === PointerInputType.Touch
                        ? this.options.touchMoveThreshold!
                        : this.options.mouseMoveThreshold!;

                if (
                    this.activePointer.x > this.previousPosition.x + panThreshold ||
                    this.activePointer.y > this.previousPosition.y + panThreshold ||
                    this.activePointer.x < this.previousPosition.x - panThreshold ||
                    this.activePointer.y < this.previousPosition.y - panThreshold
                ) {
                    this.activePointer.gestureType = detectPointerGesture(
                        this.activePointer.x - this.previousPosition.x,
                        this.activePointer.y - this.previousPosition.y,
                        this.options.translationDirection!
                    );

                    this.emit(PointerGesture.Pan, this.activePointer);
                    this.previousPanDirection = this.activePointer.gestureType;
                }

                this.previousPosition.x = this.activePointer.x;
                this.previousPosition.y = this.activePointer.y;
            }

            if (isDrag) {
                // Set target as the capture element to prevent other listeners to capture future pointer events.
                if (this.isHtmlElement(this.target)) {
                    this.target.setPointerCapture(this.activePointer.id);
                }

                // Stop detecting long press when dragging.
                if (this.shouldDetectGesture[PointerGestureFeature.LongPress]) {
                    this.stopLongPress();
                }

                if (this.options.isMultiTouchEnabled && this._pointers.size > 1) {
                    this.updateMultiPointerGesture(this.activePointer);

                    this.activePointer =
                        Array.from(this._pointers.values()).find(
                            (pointer: PointerInfoInternal): boolean | undefined =>
                                pointer.isPrimary
                        ) || this._pointers.values().next().value;
                }

                this.emit(PointerGesture.Drag, this.activePointer, true);
            } else {
                this.emit(PointerGesture.MouseMove, this.activePointer, true);
            }
        }
    };

    private handlePointerEnd = (e: PointerEvent): void => {
        if (this.shouldDetectGesture[PointerGestureFeature.LongPress]) {
            this.stopLongPress();
        }

        this.activePointer = this.updatePointerInfo(e);
        this.activePointer.gestureType = PointerGesture.End;

        if (this.isHtmlElement(this.target)) {
            this.target.releasePointerCapture(this.activePointer.id);
        }

        if (this._pointers.size > 1) {
            this.updateMultiPointerGesture(this.activePointer);
        } else {
            // Check if a valid Swipe has been detected
            const isValidSwipe: boolean = this.shouldDetectGesture[
                PointerGestureFeature.Swipe
            ]
                ? ((Math.abs(this.activePointer.xDelta) > this.options.swipeThresholdX! &&
                      Math.abs(this.activePointer.xVelocity) >
                          this.options.swipeVelocityThreshold!) ||
                      (Math.abs(this.activePointer.yDelta) >
                          this.options.swipeThresholdY! &&
                          Math.abs(this.activePointer.yVelocity) >
                              this.options.swipeVelocityThreshold!)) &&
                  e.buttons === 0
                : false;

            // If Swipe is valid then get the Swipe Direction from previous Pan direction
            if (isValidSwipe) {
                this.activePointer.gestureType = getSwipeDirection(
                    this.previousPanDirection
                );

                this.emit(PointerGesture.Swipe, this.activePointer);
                this.emit(this.activePointer.gestureType, this.activePointer);
            }

            // If Double Tap detection is started
            else if (
                this.shouldDetectGesture[PointerGestureFeature.DoubleTap] &&
                this.doubleTapIsWaiting
            ) {
                clearTimeout(this.doubleTapTimerId);
                this.doubleTapIsWaiting = false;
                this.activePointer.gestureType = PointerGesture.DoubleTap;
                this.emit(PointerGesture.DoubleTap, this.activePointer);

                if (this.target && this.options.shouldSetFocusOnActiveElement) {
                    this.target.focus();
                }
            }

            // Otherwise
            else {
                // Reset Double Tap detection if required
                if (this.shouldDetectGesture[PointerGestureFeature.DoubleTap]) {
                    this.doubleTapIsWaiting = true;
                    this.doubleTapTimerId = window.setTimeout((): void => {
                        this.doubleTapIsWaiting = false;
                    }, this.options.doubleTapTimeout);
                }

                // If Long Press has been completed
                if (
                    this.shouldDetectGesture[PointerGestureFeature.LongPress] &&
                    this.activePointer.isLongPressComplete
                ) {
                    this.activePointer.gestureType = PointerGesture.LongPressComplete;
                }

                // If a single Tap has been detected
                else if (
                    this.activePointer.pointerType === PointerInputType.Touch &&
                    this.activePointer.lastUpdateTime -
                        this.activePointer.initialPressTime <
                        this.options.singleTapTime!
                ) {
                    this.activePointer.gestureType = PointerGesture.Tap;
                    this.emit(PointerGesture.Tap, this.activePointer);

                    if (this.target && this.options.shouldSetFocusOnActiveElement) {
                        this.target.focus();
                    }
                }
            }
        }

        if (e.pointerType !== PointerInputType.Mouse || !this.options.isHoverEnabled) {
            // If hover mode is on then this will be re-added as soon as the pointer moves
            this._pointers.delete(e.pointerId);
        }

        this.emit(PointerGesture.End, this.activePointer, true);

        this.previousPosition = { x: 0, y: 0 };
    };

    private handlePointerEnter = (e: PointerEvent): void => {
        // There's no fallback to Enter/Leave or Over/Out events in touch due to lack of support for hover in touch events.
        // handlePointerEnter and handlePointerLeave handlers are used for adapting to mouse specific experience.
        if (e.pointerType === PointerInputType.Touch) {
            return;
        }

        this.activePointer = this.updatePointerInfo(e);
        this.activePointer.gestureType = PointerGesture.MouseEnter;
        this.emit(PointerGesture.MouseEnter, this.activePointer, true);
    };

    private handlePointerLeave = (e: PointerEvent): void => {
        // There's no fallback to Enter/Leave or Over/Out events in touch due to lack of support for hover in touch events.
        // handlePointerEnter and handlePointerLeave handlers are used for adapting to mouse specific experience.
        if (e.pointerType === PointerInputType.Touch) {
            return;
        }

        this.activePointer = this.updatePointerInfo(e);
        this.activePointer.gestureType = PointerGesture.MouseLeave;
        this.emit(PointerGesture.MouseLeave, this.activePointer, true);
        this._pointers.delete(this.activePointer.id);
    };

    private startLongPress(): void {
        this.resetLongPress();
        this.longPressRAFId = window.requestAnimationFrame(this.handleLongPress);
    }

    private stopLongPress(): void {
        this.resetLongPress();
        window.cancelAnimationFrame(this.longPressRAFId);
    }

    private resetLongPress(): void {
        if (this.activePointer !== undefined) {
            this.activePointer.longPressProgress = 0;
            this.activePointer.isLongPressComplete = false;
        }
    }

    private handleLongPress = (raf: number): void => {
        // Note that because of fuzzing of timers, it is possible for this number to be negative without Math.max
        const currentLongPressTime: number = Math.max(
            0,
            raf - this.activePointer.initialPressTime
        );

        this.activePointer.longPressProgress =
            Math.round((currentLongPressTime / this.options.longPressDuration!) * 100) /
            100;

        if (this.activePointer.longPressProgress >= 1) {
            this.stopLongPress();
            this.activePointer.longPressProgress = 1;
            this.activePointer.isLongPressComplete = true;
            this.activePointer.gestureType = PointerGesture.LongPressComplete;
            this.emit(PointerGesture.LongPressComplete, this.activePointer, true);

            if (this.target && this.options.shouldSetFocusOnActiveElement) {
                this.target.focus();
            }
        } else {
            this.emit(PointerGesture.LongPressProgress, this.activePointer, true);
            this.longPressRAFId = window.requestAnimationFrame(this.handleLongPress);
        }
    };

    public dispose(): void {
        if (this.doubleTapTimerId !== undefined) {
            clearTimeout(this.doubleTapTimerId);
        }

        if (this.shouldDetectGesture[PointerGestureFeature.LongPress] !== undefined) {
            this.stopLongPress();
        }

        Object.keys(this.handlers).every((pointerGestureKey: string): void => {
            this.handlers[pointerGestureKey].dispose();
        });

        if (this.options.isHoverEnabled) {
            this.target?.removeEventListener(
                PointerEventType.Enter,
                this.handlePointerEnter,
                false
            );
            this.target?.removeEventListener(
                PointerEventType.Leave,
                this.handlePointerLeave,
                false
            );
        }

        this.target?.removeEventListener(
            PointerEventType.Down,
            this.handlePointerStart,
            false
        );
        this.target?.removeEventListener(
            PointerEventType.Move,
            this.handlePointerMove,
            false
        );
        this.target?.removeEventListener(
            PointerEventType.Up,
            this.handlePointerEnd,
            false
        );
        this.target?.removeEventListener(
            PointerEventType.Cancel,
            this.handlePointerEnd,
            false
        );

        super.dispose();
    }

    /**
     * Sets up a callback function that will be called when a specified gesture is detected on a target.
     *
     * @param gesture - The gesture type to listen for.
     * @param listener - The callback function that receives a notification when the specified gesture occurs.
     */
    public onGesture(
        gesture: PointerGesture,
        listener: (args: PointerGestureInfo) => any
    ): Disposable {
        if (gesture === PointerGesture.General) {
            // Activate detection of every available gesture event
            Object.keys(this.shouldDetectGesture).every(
                (gestureType: PointerGestureFeature) =>
                    (this.shouldDetectGesture[gestureType] = true)
            );
        } else {
            for (const gestureType of Object.keys(PointerGestureFeature)) {
                if (gesture.startsWith(gestureType.toLowerCase())) {
                    this.shouldDetectGesture[PointerGestureFeature[gestureType]] = true;
                }
            }
        }

        return this.handlers[gesture].event(listener);
    }
}
