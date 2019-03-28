import * as React from "react";
import * as ReactDOM from "react-dom";
import { get } from "lodash-es";
import Foundation, { HandledProps } from "@microsoft/fast-components-foundation-react";
import { KeyCodes } from "@microsoft/fast-web-utilities";
import {
    SliderHandledProps,
    SliderMode,
    SliderOrientation,
    SliderProps,
    SliderRange,
    SliderUnhandledProps,
} from "./slider.props";
import { SliderClassNameContract } from "@microsoft/fast-components-class-name-contracts-base";
import { DisplayNamePrefix } from "../utilities";
import { SliderContext, SliderContextType } from "./slider-context";
import SliderTrackItem, {
    SliderTrackItemAnchor,
    SliderTrackItemManagedClasses,
} from "../slider-track-item";

export enum SliderThumb {
    upperThumb = "upperThumb",
    lowerThumb = "lowerThumb",
}

export interface SliderState {
    upperValue: number;
    lowerValue: number;
    isDragging: boolean;
    dragValue: number;
    activeThumb: SliderThumb;
    isIncrementing: boolean;
}

class Slider extends Foundation<SliderHandledProps, SliderUnhandledProps, SliderState> {
    public static displayName: string = `${DisplayNamePrefix}Slider`;

    public static defaultProps: Partial<SliderProps> = {
        disabled: false,
        orientation: SliderOrientation.horizontal,
        mode: SliderMode.singleValue,
        range: {
            minValue: 0,
            maxValue: 100,
        },
        step: 1,
    };

    private static baseIncrementDelay: number = 250;
    private static minIncrementDelay: number = 20;
    private static incrementAcceleration: number = 50;

    protected handledProps: HandledProps<SliderHandledProps> = {
        disabled: void 0,
        managedClasses: void 0,
        orientation: void 0,
        mode: void 0,
        initialValue: void 0,
        range: void 0,
        pageStep: void 0,
        step: void 0,
        value: void 0,
        constrainedRange: void 0,
        onValueChange: void 0,
        name: void 0,
        form: void 0,
        thumb: void 0,
        labelledBy: void 0,
    };

    private rootElement: React.RefObject<HTMLDivElement> = React.createRef<
        HTMLDivElement
    >();

    private sliderTrackElement: React.RefObject<HTMLDivElement> = React.createRef<
        HTMLDivElement
    >();

    private rangeInPixels: number = -1;
    private barMinPixel: number = -1;
    private incrementDirection: number = 1;
    private incrementTimer: NodeJS.Timer;
    private lastIncrementDelay: number = Slider.baseIncrementDelay;
    private usePageStep: boolean = false;
    private direction: string = "ltr";

    /**
     * constructor
     */
    constructor(props: SliderProps) {
        super(props);

        let initialLowerValue: number = 0;
        let initialUpperValue: number = 0;

        if (this.props.value !== undefined) {
            initialLowerValue = this.valueAsRange(this.props.value).minValue;
            initialUpperValue = this.valueAsRange(this.props.value).maxValue;
        } else if (this.props.initialValue !== undefined) {
            initialLowerValue = this.valueAsRange(this.props.initialValue).minValue;
            initialUpperValue = this.valueAsRange(this.props.initialValue).maxValue;
        } else {
            switch (this.props.mode) {
                case SliderMode.singleValue:
                    initialLowerValue = this.contstrainToStep(
                        this.percentAsValue(50),
                        this.props.step
                    );
                    initialUpperValue = this.contstrainToStep(
                        this.percentAsValue(50),
                        this.props.step
                    );
                    break;
                case SliderMode.adjustBoth:
                    initialLowerValue = this.contstrainToStep(
                        this.percentAsValue(40),
                        this.props.step
                    );
                    initialUpperValue = this.contstrainToStep(
                        this.percentAsValue(60),
                        this.props.step
                    );
                    break;
                case SliderMode.adustLowerValue:
                    initialLowerValue = this.contstrainToStep(
                        this.percentAsValue(50),
                        this.props.step
                    );
                    initialUpperValue = this.props.range.maxValue;
                    break;
                case SliderMode.adustUpperValue:
                    initialLowerValue = this.props.range.minValue;
                    initialUpperValue = this.contstrainToStep(
                        this.percentAsValue(50),
                        this.props.step
                    );
                    break;
            }
        }

        this.state = {
            dragValue: -1,
            upperValue: initialUpperValue,
            lowerValue: initialLowerValue,
            activeThumb: null,
            isDragging: false,
            isIncrementing: false,
        };
    }

    /**
     * React lifecycle methods
     */
    public componentWillUnmount(): void {
        this.suspendActiveOperations();
    }

    public componentDidUpdate(prevProps: SliderProps): void {
        if (prevProps.disabled !== this.props.disabled && this.props.disabled) {
            this.suspendActiveOperations();
        }

        if (
            prevProps.value !== this.props.value ||
            prevProps.constrainedRange !== this.props.constrainedRange ||
            prevProps.step !== this.props.step
        ) {
            this.suspendActiveOperations();
            this.updateValues(this.state.lowerValue, this.state.upperValue);
        }

        if (prevProps.mode !== this.props.mode) {
            this.suspendActiveOperations();

            switch (this.props.mode) {
                case SliderMode.adjustBoth:
                    break;

                case SliderMode.adustLowerValue:
                    this.updateValues(this.state.lowerValue, this.props.range.maxValue);
                    break;

                case SliderMode.adustUpperValue:
                    this.updateValues(this.props.range.minValue, this.state.upperValue);
                    break;

                case SliderMode.singleValue:
                    this.updateValues(this.state.upperValue, this.state.upperValue);
                    break;
            }
        }
    }

    /**
     * Renders the component
     */
    public render(): React.ReactElement<HTMLDivElement> {
        this.updateDirection();
        return (
            <div
                {...this.unhandledProps()}
                ref={this.rootElement}
                className={this.generateClassNames()}
            >
                <SliderContext.Provider
                    value={{
                        sliderOrientation: this.props.orientation,
                        sliderMode: this.props.mode,
                        sliderUpperValue: this.state.upperValue,
                        sliderLowerValue: this.state.lowerValue,
                        sliderConstrainedRange: this.props.constrainedRange,
                        sliderActiveThumb: this.state.activeThumb,
                        sliderIsDragging: this.state.isDragging,
                        sliderIsIncrementing: this.state.isIncrementing,
                        sliderValueAsPercent: this.valueAsPercent,
                        sliderDirection: this.direction,
                    }}
                >
                    <div
                        className={get(
                            this.props.managedClasses,
                            "slider_layoutPanel",
                            ""
                        )}
                        style={{
                            position: "relative",
                        }}
                    >
                        <div
                            className={get(
                                this.props.managedClasses,
                                "slider_barBack",
                                ""
                            )}
                            style={{
                                position: "absolute",
                            }}
                        />
                        <SliderTrackItem
                            className={get(
                                this.props.managedClasses,
                                "slider_barFront",
                                ""
                            )}
                            maxValuePositionBinding={
                                SliderTrackItemAnchor.selectedRangeMax
                            }
                            minValuePositionBinding={
                                SliderTrackItemAnchor.selectedRangeMin
                            }
                        />
                        <div
                            ref={this.sliderTrackElement}
                            onMouseDown={this.handleTrackMouseDown}
                            className={get(
                                this.props.managedClasses,
                                "slider_barTrack",
                                ""
                            )}
                            style={{
                                position: "absolute",
                            }}
                        />
                        {this.props.children}
                        {this.renderThumb(SliderThumb.upperThumb)}
                        {this.renderThumb(SliderThumb.lowerThumb)}
                    </div>
                    {this.renderHiddenInputElement()}
                </SliderContext.Provider>
            </div>
        );
    }

    /**
     * Generates class names
     */
    protected generateClassNames(): string {
        let classNames: string = get(this.props, "managedClasses.slider", "");

        if (this.props.disabled) {
            classNames = `${classNames} ${get(
                this.props,
                "managedClasses.slider__disabled",
                ""
            )}`;
        }

        if (this.props.orientation === SliderOrientation.vertical) {
            classNames = `${classNames} ${get(
                this.props,
                "managedClasses.slider__orientationVertical",
                ""
            )}`;
        } else {
            classNames = `${classNames} ${get(
                this.props,
                "managedClasses.slider__orientationHorizontal",
                ""
            )}`;
        }

        if (this.direction === "rtl") {
            classNames = `${classNames} ${get(
                this.props,
                "managedClasses.slider__rtl",
                ""
            )}`;
        }

        switch (this.props.mode) {
            case SliderMode.singleValue:
                classNames = `${classNames} ${get(
                    this.props,
                    "managedClasses.slider__modeSingle",
                    ""
                )}`;
                break;

            case SliderMode.adustUpperValue:
                classNames = `${classNames} ${get(
                    this.props,
                    "managedClasses.slider__modeAdjustUpper",
                    ""
                )}`;
                break;

            case SliderMode.adustLowerValue:
                classNames = `${classNames} ${get(
                    this.props,
                    "managedClasses.slider__modeAdjustLower",
                    ""
                )}`;
                break;

            case SliderMode.adjustBoth:
                classNames = `${classNames} ${get(
                    this.props,
                    "managedClasses.slider__modeAdjustBoth",
                    ""
                )}`;
                break;
        }

        return super.generateClassNames(classNames);
    }

    /**
     *  Maps the default thumb managed classes to the appropriate slider managed classes
     */
    private getThumbManagedClasses = (
        thumb: SliderThumb
    ): SliderTrackItemManagedClasses => {
        const thumbBaseClass: string = get(this.props, "managedClasses.slider_thumb", "");
        return {
            managedClasses: {
                sliderTrackItem:
                    thumb === SliderThumb.upperThumb
                        ? get(this.props, "managedClasses.slider_thumb_upper", "").concat(
                              " ",
                              thumbBaseClass
                          )
                        : get(this.props, "managedClasses.slider_thumb_lower", "").concat(
                              " ",
                              thumbBaseClass
                          ),
                sliderTrackItem__orientationHorizontal: get(
                    this.props,
                    "managedClasses.slider_thumb__orientationHorizontal",
                    ""
                ),
                sliderTrackItem__orientationVertical: get(
                    this.props,
                    "managedClasses.slider_thumb__orientationVertical",
                    ""
                ),
            },
        };
    };

    /**
     *  Renders the appropriate thumb
     */
    private renderThumb(thumb: SliderThumb): React.ReactNode {
        if (
            (this.props.mode === SliderMode.adustLowerValue &&
                thumb === SliderThumb.upperThumb) ||
            (this.props.mode === SliderMode.adustUpperValue &&
                thumb === SliderThumb.lowerThumb) ||
            (this.props.mode === SliderMode.singleValue &&
                thumb === SliderThumb.lowerThumb)
        ) {
            return;
        }

        if (typeof this.props.thumb === "function") {
            return this.props.thumb(
                this.props,
                this.state,
                thumb === SliderThumb.upperThumb
                    ? this.handleUpperThumbMouseDown
                    : this.handleLowerThumbMouseDown,
                thumb === SliderThumb.upperThumb
                    ? this.handleUpperThumbKeyDown
                    : this.handleLowerThumbKeyDown,
                thumb
            );
        } else {
            return this.renderDefaultThumb(
                this.props,
                this.state,
                thumb === SliderThumb.upperThumb
                    ? this.handleUpperThumbMouseDown
                    : this.handleLowerThumbMouseDown,
                thumb === SliderThumb.upperThumb
                    ? this.handleUpperThumbKeyDown
                    : this.handleLowerThumbKeyDown,
                thumb
            );
        }
    }

    /**
     *  Renders the default thumb
     */
    private renderDefaultThumb(
        props: SliderProps,
        state: SliderState,
        mouseDownCallback: (event: React.MouseEvent) => void,
        keyDownCallback: (event: React.KeyboardEvent) => void,
        thumb: SliderThumb
    ): React.ReactNode {
        return (
            <SliderTrackItem
                {...this.getThumbManagedClasses(thumb)}
                minValuePositionBinding={
                    thumb === SliderThumb.lowerThumb
                        ? SliderTrackItemAnchor.selectedRangeMin
                        : undefined
                }
                maxValuePositionBinding={
                    thumb === SliderThumb.upperThumb
                        ? SliderTrackItemAnchor.selectedRangeMax
                        : undefined
                }
                draggable={false}
                tabIndex={0}
                onKeyDown={keyDownCallback}
                onMouseDown={mouseDownCallback}
                aria-valuemin={props.range.minValue}
                aria-valuemax={props.range.maxValue}
                aria-valuenow={
                    thumb === SliderThumb.lowerThumb ? state.lowerValue : state.upperValue
                }
                aria-labelledby={props.labelledBy || null}
            />
        );
    }

    /**
     * Renders a hidden input element which can interact with a
     * form hosting this component
     */
    private renderHiddenInputElement(): React.ReactNode {
        let formattedValue: string = "";

        switch (this.props.mode) {
            case SliderMode.adjustBoth:
                formattedValue =
                    "[" + this.state.lowerValue + "," + this.state.upperValue + "]";
                break;

            case SliderMode.adustUpperValue:
            case SliderMode.singleValue:
                formattedValue = `${this.state.upperValue}`;
                break;

            case SliderMode.adustLowerValue:
                formattedValue = `${this.state.lowerValue}`;
                break;
        }

        return (
            <input
                type="range"
                name={this.props.name || null}
                form={this.props.form || null}
                value={formattedValue}
                onChange={this.onInputValueChange}
                disabled={this.props.disabled || null}
                style={{
                    display: "none",
                }}
            />
        );
    }

    /**
     * This exists only to suppress a build warning
     */
    private onInputValueChange = (event: React.ChangeEvent): void => {
        return null;
    };

    /**
     * Handles track clicks
     */
    private handleTrackMouseDown = (event: React.MouseEvent): void => {
        if (
            this.props.disabled ||
            event.defaultPrevented ||
            this.state.isDragging ||
            this.state.isIncrementing
        ) {
            return;
        }
        event.preventDefault();
        this.updateDirection();
        this.updateSliderDimensions();
        const pixelCoordinate: number =
            this.props.orientation === SliderOrientation.vertical
                ? event.pageY
                : event.pageX;
        const newValue: number =
            (this.props.range.maxValue - this.props.range.minValue) *
                this.convertPixelToPercent(pixelCoordinate) +
            this.props.range.minValue;

        switch (this.props.mode) {
            case SliderMode.singleValue:
                this.updateValues(newValue, newValue);
                break;

            case SliderMode.adjustBoth:
                this.handleMultiThumbTrackClick(newValue);
                break;

            case SliderMode.adustLowerValue:
                this.updateValues(newValue, null);
                break;

            case SliderMode.adustUpperValue:
                this.updateValues(null, newValue);
                break;
        }
    };

    /**
     *  Handles track clicks when there are multiple thumbs
     */
    private handleMultiThumbTrackClick = (value: number): void => {
        if (value <= this.state.lowerValue) {
            this.updateValues(value, null);
        } else if (value >= this.state.upperValue) {
            this.updateValues(null, value);
        } else {
            // between values move the closest thumb to the click
            if (value - this.state.lowerValue < this.state.upperValue - value) {
                this.updateValues(value, null);
            } else {
                this.updateValues(null, value);
            }
        }
    };

    /**
     *  Updates the direction
     */
    private updateDirection = (): void => {
        if (this.rootElement.current === null) {
            return;
        }

        const closest: Element = this.rootElement.current.closest(`[dir]`);

        if (closest === null) {
            this.direction = "ltr";
            return;
        }

        const foundDir: string = closest.getAttribute("dir");

        if (foundDir === "ltr" || foundDir === "rtl") {
            this.direction = foundDir;
        }
    };

    /**
     * Measures the slider dimensions and stores them
     */
    private updateSliderDimensions = (): void => {
        if (this.sliderTrackElement.current === null) {
            return;
        }

        this.rangeInPixels =
            this.props.orientation === SliderOrientation.vertical
                ? this.sliderTrackElement.current.clientHeight
                : this.sliderTrackElement.current.clientWidth;
        this.barMinPixel =
            this.props.orientation === SliderOrientation.vertical
                ? this.sliderTrackElement.current.getBoundingClientRect().bottom
                : this.sliderTrackElement.current.getBoundingClientRect().left;
    };

    /**
     * Start timed incrementing from
     */
    private startIncrementing = (
        incrementDirection: number,
        usePageStep: boolean,
        thumb: SliderThumb,
        event: React.KeyboardEvent<HTMLDivElement>
    ): void => {
        if (this.state.isIncrementing) {
            return;
        }

        event.preventDefault();

        this.usePageStep = usePageStep;
        this.incrementDirection = incrementDirection;

        window.addEventListener("keyup", this.handleWindowKeyUp);
        this.setState({
            activeThumb: thumb,
            isIncrementing: true,
        });
        this.lastIncrementDelay = Slider.baseIncrementDelay;
        this.incrementTimer = setTimeout((): void => {
            this.incrementTimerExpired();
        }, 50);
    };

    /**
     * Increments the value by one step (or pageStep)
     */
    private incrementValue = (): void => {
        const step: number = this.usePageStep ? this.props.pageStep : this.props.step;
        if (this.state.activeThumb === SliderThumb.upperThumb) {
            this.updateValues(
                null,
                this.state.upperValue + step * this.incrementDirection
            );
        } else {
            this.updateValues(
                this.state.lowerValue + step * this.incrementDirection,
                null
            );
        }
    };

    /**
     *  Increment timer tick
     */
    private incrementTimerExpired = (): void => {
        clearTimeout(this.incrementTimer);
        this.incrementValue();
        this.lastIncrementDelay = this.lastIncrementDelay - Slider.incrementAcceleration;
        if (this.lastIncrementDelay < Slider.minIncrementDelay) {
            this.lastIncrementDelay = Slider.minIncrementDelay;
        }
        this.incrementTimer = setTimeout((): void => {
            this.incrementTimerExpired();
        }, this.lastIncrementDelay);
    };

    /**
     *  Stop incrementing
     */
    private stopIncrementing = (): void => {
        if (!this.state.isIncrementing) {
            return;
        }
        window.removeEventListener("keyup", this.handleWindowKeyUp);
        this.setState({
            isIncrementing: false,
        });
        clearTimeout(this.incrementTimer);
    };

    /**
     * Converts a pixel coordinate on the track to a percent of the track's range
     */
    private convertPixelToPercent = (pixelPos: number): number => {
        let pct: number = 0;

        if (this.props.orientation === SliderOrientation.vertical) {
            pct = (this.barMinPixel - pixelPos) / this.rangeInPixels;
        } else {
            pct = (pixelPos - this.barMinPixel) / this.rangeInPixels;
        }

        if (pct < 0) {
            pct = 0;
        } else if (pct > 1) {
            pct = 1;
        }

        if (
            this.direction === "rtl" &&
            this.props.orientation !== SliderOrientation.vertical
        ) {
            pct = 1 - pct;
        }

        return pct;
    };

    /**
     * Handles thumb key events
     */
    private handleUpperThumbKeyDown = (
        event: React.KeyboardEvent<HTMLDivElement>
    ): void => {
        this.handleThumbKeydown(event, SliderThumb.upperThumb);
    };

    private handleLowerThumbKeyDown = (
        event: React.KeyboardEvent<HTMLDivElement>
    ): void => {
        this.handleThumbKeydown(event, SliderThumb.lowerThumb);
    };

    private handleThumbKeydown = (
        event: React.KeyboardEvent<HTMLDivElement>,
        thumb: SliderThumb
    ): void => {
        if (
            this.props.disabled ||
            event.defaultPrevented ||
            this.state.isDragging ||
            this.state.isIncrementing
        ) {
            return;
        }
        this.updateDirection();

        switch (event.keyCode) {
            case KeyCodes.arrowDown:
                this.startIncrementing(1, false, thumb, event);
                break;
            case KeyCodes.arrowRight:
                this.startIncrementing(
                    this.direction === "ltr" ? 1 : -1,
                    false,
                    thumb,
                    event
                );
                break;
            case KeyCodes.arrowUp:
                this.startIncrementing(-1, false, thumb, event);
                break;
            case KeyCodes.arrowLeft:
                this.startIncrementing(
                    this.direction === "ltr" ? -1 : 1,
                    false,
                    thumb,
                    event
                );
                break;
            case KeyCodes.pageDown:
                if (this.props.pageStep !== undefined) {
                    this.startIncrementing(1, true, thumb, event);
                }
                break;
            case KeyCodes.pageUp:
                if (this.props.pageStep !== undefined) {
                    this.startIncrementing(-1, true, thumb, event);
                }
                break;
        }
    };

    /**
     * Handles thumb clicks
     */
    private handleUpperThumbMouseDown = (e: React.MouseEvent): void => {
        this.handleThumbMouseDown(e, SliderThumb.upperThumb);
    };

    private handleLowerThumbMouseDown = (e: React.MouseEvent): void => {
        this.handleThumbMouseDown(e, SliderThumb.lowerThumb);
    };

    private handleThumbMouseDown = (e: React.MouseEvent, thumb: SliderThumb): void => {
        if (
            this.props.disabled ||
            e.defaultPrevented ||
            this.state.isDragging ||
            this.state.isIncrementing
        ) {
            return;
        }

        e.preventDefault();
        window.addEventListener("mouseup", this.handleWindowMouseUp);
        window.addEventListener("mousemove", this.handleMouseMove);
        this.setState({
            isDragging: true,
            activeThumb: thumb,
        });
    };

    /**
     *  Handle mouse moves during a thumb drag operation
     */
    private handleMouseMove = (event: MouseEvent): void => {
        if (this.props.disabled || event.defaultPrevented) {
            return;
        }
        this.updateDirection();
        this.updateSliderDimensions();
        const pixelCoordinate: number =
            this.props.orientation === SliderOrientation.vertical
                ? event.pageY
                : event.pageX;
        const dragValue: number =
            (this.props.range.maxValue - this.props.range.minValue) *
                this.convertPixelToPercent(pixelCoordinate) +
            this.props.range.minValue;
        this.updateDragValue(dragValue);
    };

    /**
     *  Updates the current drag value
     */
    private updateDragValue = (dragValue: number): void => {
        const constrainedRange: SliderRange = this.getConstrainedRange(true);

        const newDragValue: number = this.constrainToRange(dragValue, constrainedRange);

        this.setState({
            dragValue: newDragValue,
        });

        if (this.state.activeThumb === SliderThumb.lowerThumb) {
            this.updateValues(newDragValue, null);
        } else {
            this.updateValues(null, newDragValue);
        }
    };

    /**
     *  Gets the range of values the active thumb is actually allowed to traverse
     */
    private getConstrainedRange = (
        constrainToOppositeEndOfRange: boolean
    ): SliderRange => {
        let rangeMin: number = this.props.range.minValue;
        let rangeMax: number = this.props.range.maxValue;

        if (this.props.constrainedRange !== undefined) {
            rangeMin =
                this.props.constrainedRange.minValue > rangeMin
                    ? this.props.constrainedRange.minValue
                    : rangeMin;
            rangeMax =
                this.props.constrainedRange.maxValue < rangeMax
                    ? this.props.constrainedRange.maxValue
                    : rangeMin;
        }

        if (this.props.mode !== SliderMode.singleValue && constrainToOppositeEndOfRange) {
            if (this.state.activeThumb === SliderThumb.lowerThumb) {
                rangeMax = this.state.upperValue;
            } else {
                rangeMin = this.state.lowerValue;
            }
        }

        return {
            minValue: rangeMin,
            maxValue: rangeMax,
        };
    };

    /**
     *  Converts a single number value to a SliderRange based on current mode
     */
    private valueAsRange = (value: number | SliderRange): SliderRange => {
        if (typeof value === "number") {
            switch (this.props.mode) {
                case SliderMode.adjustBoth:
                case SliderMode.singleValue:
                    return {
                        minValue: value,
                        maxValue: value,
                    };
                case SliderMode.adustLowerValue:
                    return {
                        minValue: value,
                        maxValue: this.props.range.maxValue,
                    };
                case SliderMode.adustUpperValue:
                    return {
                        minValue: this.props.range.minValue,
                        maxValue: value,
                    };
            }
        } else if (typeof value === "object") {
            return value;
        }
    };

    /**
     *  Apply value changes, only place this should happen outside of constructor
     */
    private updateValues = (lowerValue: number, upperValue: number): void => {
        let newLowerValue: number = this.state.lowerValue;
        let newUpperValue: number = this.state.upperValue;

        if (this.props.value !== undefined) {
            newLowerValue = this.valueAsRange(this.props.value).minValue;
            newUpperValue = this.valueAsRange(this.props.value).maxValue;
        } else {
            if (lowerValue !== null) {
                newLowerValue = this.constrainToRange(
                    this.contstrainToStep(lowerValue, this.props.step),
                    {
                        minValue: this.props.range.minValue,
                        maxValue:
                            this.props.mode === SliderMode.adjustBoth
                                ? this.state.upperValue
                                : this.props.range.maxValue,
                    }
                );
            }

            if (upperValue !== null) {
                newUpperValue = this.constrainToRange(
                    this.contstrainToStep(upperValue, this.props.step),
                    {
                        minValue:
                            this.props.mode === SliderMode.adjustBoth
                                ? this.state.lowerValue
                                : this.props.range.minValue,
                        maxValue: this.props.range.maxValue,
                    }
                );
            }
        }

        if (
            this.state.upperValue !== newUpperValue ||
            this.state.lowerValue !== newLowerValue
        ) {
            this.setState({
                lowerValue:
                    this.props.mode === SliderMode.singleValue
                        ? newUpperValue
                        : newLowerValue,
                upperValue: newUpperValue,
            });

            this.invokeValueChange(newLowerValue, newUpperValue);
        }
    };

    /**
     *  Invokes the value change event and formats params based on current mode
     */
    private invokeValueChange = (lowerValue: number, upperValue: number): void => {
        if (typeof this.props.onValueChange === "function") {
            switch (this.props.mode) {
                case SliderMode.adjustBoth:
                    this.props.onValueChange({
                        minValue: lowerValue,
                        maxValue: upperValue,
                    });
                    break;

                case SliderMode.adustUpperValue:
                case SliderMode.singleValue:
                    this.props.onValueChange(upperValue);
                    break;

                case SliderMode.adustLowerValue:
                    this.props.onValueChange(lowerValue);
                    break;
            }
        }
    };

    /**
     * Handle a window mouse up during a drag operation
     */
    private handleWindowMouseUp = (event: MouseEvent): void => {
        this.stopDragging();
    };

    /**
     *  Handle window key up during an incrementing operation
     */
    private handleWindowKeyUp = (event: KeyboardEvent): void => {
        switch (event.keyCode) {
            case KeyCodes.arrowDown:
            case KeyCodes.arrowRight:
            case KeyCodes.arrowUp:
            case KeyCodes.arrowLeft:
            case KeyCodes.pageDown:
            case KeyCodes.pageUp:
                this.stopIncrementing();
                break;
        }
    };

    /**
     *  Ends a thumb drag operation
     */
    private stopDragging = (): void => {
        if (!this.state.isDragging) {
            return;
        }
        window.removeEventListener("mouseup", this.handleWindowMouseUp);
        window.removeEventListener("mousemove", this.handleMouseMove);
        this.setState({
            isDragging: false,
        });
    };

    /**
     *  Ends active drag/increment operations
     */
    private suspendActiveOperations = (): void => {
        this.stopDragging();
        this.stopIncrementing();
    };

    /**
     * Ensures a value falls within the provided range
     */
    private constrainToRange = (value: number, range: SliderRange): number => {
        let newValue: number = value;
        if (newValue > range.maxValue) {
            newValue = range.maxValue;
        } else if (newValue < range.minValue) {
            newValue = range.minValue;
        }
        return newValue;
    };

    /**
     * Ensures a value is an even multiple of the slider step increment
     */
    private contstrainToStep = (value: number, step: number): number => {
        if (step === 0) {
            return value;
        }

        return Math.floor(value / step) * step;
    };

    /**
     * Converts value to a percent of slider range
     */
    private valueAsPercent = (value: number): number => {
        return (
            ((value - this.props.range.minValue) /
                (this.props.range.maxValue - this.props.range.minValue)) *
            100
        );
    };

    /**
     *  Converts a percent value to the equivalent value on the bar range
     */
    private percentAsValue = (value: number): number => {
        return (
            ((this.props.range.maxValue - this.props.range.minValue) / 100) * value +
            this.props.range.minValue
        );
    };
}

export default Slider;
export * from "./slider.props";
export { SliderClassNameContract, SliderContext, SliderContextType };
