import React from "react";
import { get, isNil } from "lodash-es";
import Foundation, { HandledProps } from "@microsoft/fast-components-foundation-react";
import {
    keyCodeArrowDown,
    keyCodeArrowLeft,
    keyCodeArrowRight,
    keyCodeArrowUp,
    keyCodeEnd,
    keyCodeHome,
    keyCodePageDown,
    keyCodePageUp,
} from "@microsoft/fast-web-utilities";
import { SliderClassNameContract } from "@microsoft/fast-components-class-name-contracts-base";
import { classNames, Direction } from "@microsoft/fast-web-utilities";
import { DisplayNamePrefix } from "../utilities";
import SliderTrackItem, {
    SliderTrackItemAnchor,
    SliderTrackItemManagedClasses,
} from "../slider-track-item";
import { SliderContext, SliderContextType } from "./slider-context";
import {
    SliderHandledProps,
    SliderMode,
    SliderOrientation,
    SliderProps,
    SliderRange,
    SliderUnhandledProps,
} from "./slider.props";

export enum SliderThumb {
    upperThumb = "upperThumb",
    lowerThumb = "lowerThumb",
}

export interface SliderState {
    upperValue: number;
    lowerValue: number;
    isMouseDragging: boolean;
    isTouchDragging: boolean;
    dragValue: number;
    activeThumb: SliderThumb;
    isIncrementing: boolean;
    incrementDirection: number;
    usePageStep: boolean;
    direction: Direction | null;
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
        managedClasses: {},
    };

    private static baseIncrementDelay: number = 300;
    private static minIncrementDelay: number = 100;
    private static incrementAcceleration: number = 50;
    private static rolePropName: string = "role";
    private static DirectionAttributeName: string = "dir";

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
        minThumbLabel: void 0,
        maxThumbLabel: void 0,
        minThumbLabelledBy: void 0,
        maxThumbLabelledBy: void 0,
        minThumbDescribedBy: void 0,
        maxThumbDescribedBy: void 0,
        valuetextStringFormatter: void 0,
        displayValueConverter: void 0,
    };

    private rootElement: React.RefObject<HTMLDivElement> = React.createRef<
        HTMLDivElement
    >();

    private sliderTrackElement: React.RefObject<HTMLDivElement> = React.createRef<
        HTMLDivElement
    >();

    private rangeInPixels: number = 1;
    private barMinPixel: number = 0;
    private incrementTimer: NodeJS.Timer;
    private lastIncrementDelay: number = Slider.baseIncrementDelay;

    /**
     * constructor
     */
    constructor(props: SliderProps) {
        super(props);

        let initialValue: SliderRange = {
            minValue: this.props.range.minValue,
            maxValue: this.props.range.maxValue,
        };

        if (this.props.value !== undefined) {
            initialValue = this.getConstrainedValue(
                this.props.value,
                this.props.constrainedRange,
                this.props.step
            );
        } else if (this.props.initialValue !== undefined) {
            initialValue = this.getConstrainedValue(
                this.props.initialValue,
                this.props.constrainedRange,
                this.props.step
            );
        } else {
            let defaultValue: SliderRange = {
                minValue: 0,
                maxValue: 0,
            };
            switch (this.props.mode) {
                case SliderMode.singleValue:
                    defaultValue = {
                        minValue: this.percentAsValue(50),
                        maxValue: this.percentAsValue(50),
                    };
                    break;
                case SliderMode.adjustBoth:
                    defaultValue = {
                        minValue: this.percentAsValue(40),
                        maxValue: this.percentAsValue(60),
                    };
                    break;
                case SliderMode.adustLowerValue:
                    defaultValue = {
                        minValue: this.percentAsValue(50),
                        maxValue: this.props.range.maxValue,
                    };
                    break;
                case SliderMode.adustUpperValue:
                    defaultValue = {
                        minValue: this.props.range.minValue,
                        maxValue: this.percentAsValue(50),
                    };
                    break;
            }
            initialValue = this.getConstrainedValue(
                defaultValue,
                this.props.constrainedRange,
                this.props.step
            );
        }

        this.state = {
            dragValue: -1,
            upperValue: initialValue.maxValue,
            lowerValue: initialValue.minValue,
            activeThumb: null,
            isMouseDragging: false,
            isTouchDragging: false,
            isIncrementing: false,
            incrementDirection: 1,
            usePageStep: false,
            direction: null,
        };
    }

    /**
     * React lifecycle methods
     */
    public componentDidMount(): void {
        this.updateDirection();
    }

    public componentWillUnmount(): void {
        this.suspendActiveOperations();
    }

    public componentDidUpdate(prevProps: SliderProps): void {
        if (prevProps.disabled !== this.props.disabled && this.props.disabled) {
            this.suspendActiveOperations();
        }

        if (prevProps.value !== this.props.value && this.props.value !== undefined) {
            const newValue: SliderRange = this.getConstrainedValue(
                this.props.value,
                this.props.constrainedRange,
                this.props.step
            );
            this.setState({
                lowerValue: newValue.minValue,
                upperValue: newValue.maxValue,
            });
        } else if (
            prevProps.constrainedRange !== this.props.constrainedRange ||
            prevProps.step !== this.props.step
        ) {
            this.suspendActiveOperations();
            this.updateValues(this.state.lowerValue, this.state.upperValue);
        }

        if (prevProps.mode !== this.props.mode) {
            this.suspendActiveOperations();
            this.updateValuesForModeSwitch();
        }

        this.updateDirection();
    }

    /**
     * Renders the component
     */
    public render(): React.ReactElement<HTMLDivElement> {
        return (
            <div
                {...this.unhandledProps()}
                ref={this.rootElement}
                className={this.generateClassNames()}
            >
                {this.renderSliderInternals()}
            </div>
        );
    }

    /**
     * Generates class names
     */
    protected generateClassNames(): string {
        const {
            slider,
            slider__disabled,
            slider__dragging,
            slider__touchDragging,
            slider__incrementing,
            slider__vertical,
            slider__horizontal,
            slider__rtl,
            slider__modeSingle,
            slider__modeAdjustUpper,
            slider__modeAdjustLower,
            slider__modeAdjustBoth,
        }: SliderClassNameContract = this.props.managedClasses;
        const isVertical: boolean = this.props.orientation === SliderOrientation.vertical;

        return super.generateClassNames(
            classNames(
                slider,
                [slider__disabled, this.props.disabled],
                [
                    slider__dragging,
                    this.state.isMouseDragging || this.state.isTouchDragging,
                ],
                [slider__touchDragging, this.state.isTouchDragging],
                [slider__incrementing, this.state.isIncrementing],
                [slider__vertical, isVertical],
                [slider__horizontal, !isVertical],
                [slider__rtl, this.state.direction === Direction.rtl],
                [slider__modeSingle, this.props.mode === SliderMode.singleValue],
                [slider__modeAdjustUpper, this.props.mode === SliderMode.adustUpperValue],
                [slider__modeAdjustLower, this.props.mode === SliderMode.adustLowerValue],
                [slider__modeAdjustBoth, this.props.mode === SliderMode.adjustBoth]
            )
        );
    }

    /**
     * Renders the internals of the component
     */
    private renderSliderInternals = (): React.ReactNode => {
        return (
            <SliderContext.Provider
                value={{
                    sliderOrientation: this.props.orientation,
                    sliderMode: this.props.mode,
                    sliderState: this.state,
                    sliderConstrainedRange: this.props.constrainedRange,
                    sliderValueAsPercent: this.valueAsPercent,
                    sliderDirection: this.state.direction,
                }}
            >
                <div
                    className={classNames(this.props.managedClasses.slider_layoutRegion)}
                    style={{
                        // hide visuals until we have a direction to avoid flicker
                        opacity: this.state.direction === null ? 0 : undefined,
                        position: "relative",
                    }}
                >
                    <div
                        className={classNames(
                            this.props.managedClasses.slider_backgroundTrack
                        )}
                        style={{
                            position: "absolute",
                        }}
                    />
                    <SliderTrackItem
                        className={this.props.managedClasses.slider_foregroundTrack}
                        maxValuePositionBinding={SliderTrackItemAnchor.selectedRangeMax}
                        minValuePositionBinding={SliderTrackItemAnchor.selectedRangeMin}
                    />
                    <div
                        ref={this.sliderTrackElement}
                        onMouseDown={this.handleTrackMouseDown}
                        className={classNames(this.props.managedClasses.slider_track)}
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
        );
    };

    /**
     * Updates values when mode is switched in props
     */
    private updateValuesForModeSwitch = (): void => {
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
    };

    /**
     *  Constrains a value to be within the provided constraint range and step
     */
    private getConstrainedValue = (
        baseValue: SliderRange | number,
        constraint: SliderRange,
        step: number
    ): SliderRange => {
        if (constraint === null || constraint === undefined) {
            constraint = this.props.range;
        }

        const constrainedRange: SliderRange = {
            minValue: this.constrainToRange(
                this.constrainToStep(this.valueAsRange(baseValue).minValue, step),
                constraint
            ),
            maxValue: this.constrainToRange(
                this.constrainToStep(this.valueAsRange(baseValue).maxValue, step),
                constraint
            ),
        };

        return constrainedRange;
    };

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
                        ? get(
                              this.props,
                              "managedClasses.slider_thumb__upperValue",
                              ""
                          ).concat(" ", thumbBaseClass)
                        : get(
                              this.props,
                              "managedClasses.slider_thumb__lowerValue",
                              ""
                          ).concat(" ", thumbBaseClass),
                sliderTrackItem_horizontal: get(
                    this.props,
                    "managedClasses.slider_thumb__horizontal",
                    ""
                ),
                sliderTrackItem_vertical: get(
                    this.props,
                    "managedClasses.slider_thumb__vertical",
                    ""
                ),
            },
        };
    };

    /**
     *  Renders the appropriate thumb
     */
    private renderThumb(thumb: SliderThumb): React.ReactNode {
        if (!this.shouldRenderThumb(thumb)) {
            return;
        }

        const mouseDownCallback: (event: React.MouseEvent) => void =
            thumb === SliderThumb.upperThumb
                ? this.handleUpperThumbMouseDown
                : this.handleLowerThumbMouseDown;

        const keyDownCallback: (event: React.KeyboardEvent) => void =
            thumb === SliderThumb.upperThumb
                ? this.handleUpperThumbKeyDown
                : this.handleLowerThumbKeyDown;

        const touchStartCallback: (event: React.TouchEvent) => void =
            thumb === SliderThumb.upperThumb
                ? this.handleUpperThumbTouchStart
                : this.handleLowerThumbTouchStart;

        if (typeof this.props.thumb === "function") {
            return this.props.thumb(
                this.props,
                this.state,
                mouseDownCallback,
                keyDownCallback,
                thumb,
                touchStartCallback
            );
        } else {
            return this.renderDefaultThumb(
                this.props,
                this.state,
                mouseDownCallback,
                keyDownCallback,
                thumb,
                touchStartCallback
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
        thumb: SliderThumb,
        touchStartCallback: (event: React.TouchEvent) => void
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
                role="slider"
                tabIndex={props.disabled === true ? null : 0}
                onKeyDown={keyDownCallback}
                onMouseDown={mouseDownCallback}
                onTouchStart={touchStartCallback}
                aria-valuemin={
                    typeof props.displayValueConverter === "function"
                        ? props.displayValueConverter(props.range.minValue)
                        : props.range.minValue
                }
                aria-valuemax={
                    typeof props.displayValueConverter === "function"
                        ? props.displayValueConverter(props.range.maxValue)
                        : props.range.maxValue
                }
                aria-valuenow={
                    typeof props.displayValueConverter === "function"
                        ? props.displayValueConverter(
                              thumb === SliderThumb.lowerThumb
                                  ? state.lowerValue
                                  : state.upperValue
                          )
                        : thumb === SliderThumb.lowerThumb
                        ? state.lowerValue
                        : state.upperValue
                }
                aria-valuetext={
                    typeof props.valuetextStringFormatter === "function"
                        ? props.valuetextStringFormatter(props, state, thumb)
                        : null
                }
                aria-label={
                    thumb === SliderThumb.upperThumb
                        ? props.maxThumbLabel || null
                        : props.minThumbLabel || null
                }
                aria-labelledby={
                    thumb === SliderThumb.upperThumb
                        ? props.maxThumbLabelledBy || null
                        : props.minThumbLabelledBy || null
                }
                aria-describedby={
                    thumb === SliderThumb.upperThumb
                        ? props.maxThumbDescribedBy || null
                        : props.minThumbDescribedBy || null
                }
                aria-orientation={this.props.orientation}
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
                formattedValue = `[${this.state.lowerValue},${this.state.upperValue}]`;
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
    /* eslint-disable  @typescript-eslint/no-unused-vars */
    private onInputValueChange = (event: React.ChangeEvent): void => {
        return null;
    };

    /**
     *  Determines whether a particular thumb should render in the current mode
     */
    private shouldRenderThumb = (thumb: SliderThumb): boolean => {
        if (
            (this.props.mode === SliderMode.adustLowerValue &&
                thumb === SliderThumb.upperThumb) ||
            (this.props.mode === SliderMode.adustUpperValue &&
                thumb === SliderThumb.lowerThumb) ||
            (this.props.mode === SliderMode.singleValue &&
                thumb === SliderThumb.lowerThumb)
        ) {
            return false;
        }

        return true;
    };

    /**
     * Handles track clicks
     */
    private handleTrackMouseDown = (event: React.MouseEvent): void => {
        if (event.defaultPrevented || this.isBusyOrDisabled()) {
            return;
        }
        event.preventDefault();
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
     *  updates the direction in state if necessary
     */
    private updateDirection = (): void => {
        const newDirection: Direction = this.getDirection();
        if (newDirection !== this.state.direction) {
            this.suspendActiveOperations();
            this.setState({
                direction: newDirection,
            });
        }
    };

    /**
     *  gets the current direction
     */
    private getDirection = (): Direction | null => {
        if (this.rootElement.current === null) {
            return Direction.ltr;
        }

        const closest: Element = this.rootElement.current.closest(
            `[${Slider.DirectionAttributeName}]`
        );

        return closest === null ||
            closest.getAttribute(Slider.DirectionAttributeName) === Direction.ltr
            ? Direction.ltr
            : Direction.rtl;
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
        if (this.rangeInPixels === 0) {
            this.rangeInPixels = 1;
        }

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
        event.preventDefault();

        if (this.state.isIncrementing) {
            return;
        }

        this.updateSliderDimensions();

        window.addEventListener("keyup", this.handleWindowKeyUp);
        this.setState({
            usePageStep,
            activeThumb: thumb,
            isIncrementing: true,
            incrementDirection,
        });
        this.lastIncrementDelay = Slider.baseIncrementDelay;
        this.incrementTimer = setTimeout((): void => {
            this.incrementTimerExpired();
        }, 50);
    };

    /**
     * Increments the value by one step (or pageStep)
     * when step is set to 0 we increment based on the current pixel width
     * of the component
     */
    private incrementValue = (): void => {
        const step: number = this.state.usePageStep
            ? this.props.pageStep
            : this.props.step !== 0
            ? this.props.step
            : (this.props.range.maxValue - this.props.range.minValue) /
              this.rangeInPixels;

        let newValue: number =
            this.state.activeThumb === SliderThumb.upperThumb
                ? this.state.upperValue + step * this.state.incrementDirection
                : this.state.lowerValue + step * this.state.incrementDirection;

        if (
            this.props.mode === SliderMode.adjustBoth &&
            newValue > this.state.upperValue &&
            this.state.activeThumb !== SliderThumb.upperThumb
        ) {
            newValue = this.state.upperValue;
        } else if (
            this.props.mode === SliderMode.adjustBoth &&
            newValue < this.state.lowerValue &&
            this.state.activeThumb !== SliderThumb.lowerThumb
        ) {
            newValue = this.state.lowerValue;
        }

        if (this.state.activeThumb === SliderThumb.upperThumb) {
            this.updateValues(null, newValue);
        } else {
            this.updateValues(newValue, null);
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
            usePageStep: false,
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
            this.state.direction === Direction.rtl &&
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
        if (event.defaultPrevented || this.isBusyOrDisabled()) {
            event.preventDefault();
            return;
        }

        switch (event.keyCode) {
            case keyCodeArrowDown:
                this.startIncrementing(-1, false, thumb, event);
                break;
            case keyCodeArrowRight:
                this.startIncrementing(
                    this.state.direction === Direction.ltr ? 1 : -1,
                    false,
                    thumb,
                    event
                );
                break;
            case keyCodeArrowUp:
                this.startIncrementing(1, false, thumb, event);
                break;
            case keyCodeArrowLeft:
                this.startIncrementing(
                    this.state.direction === Direction.ltr ? -1 : 1,
                    false,
                    thumb,
                    event
                );
                break;
            case keyCodePageDown:
                if (this.props.pageStep !== undefined) {
                    this.startIncrementing(-1, true, thumb, event);
                }
                break;
            case keyCodePageUp:
                if (this.props.pageStep !== undefined) {
                    this.startIncrementing(1, true, thumb, event);
                }
                break;
            case keyCodeHome:
                this.setMinValue(thumb);
                break;

            case keyCodeEnd:
                this.setMaxValue(thumb);
                break;
        }
    };

    /**
     * sets the active thumb to its minimum value
     */
    private setMinValue = (thumb: SliderThumb): void => {
        const thumbRange: SliderRange = this.getConstrainedRange(true);

        if (thumb === SliderThumb.upperThumb) {
            this.updateValues(null, thumbRange.minValue);
        } else {
            this.updateValues(thumbRange.minValue, null);
        }
    };

    /**
     * sets the active thumb to it's maximum value
     */
    private setMaxValue = (thumb: SliderThumb): void => {
        const thumbRange: SliderRange = this.getConstrainedRange(true);

        if (thumb === SliderThumb.upperThumb) {
            this.updateValues(null, thumbRange.maxValue);
        } else {
            this.updateValues(thumbRange.maxValue, null);
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
        if (e.defaultPrevented || this.isBusyOrDisabled()) {
            return;
        }

        e.preventDefault();
        (e.target as HTMLElement).focus();
        window.addEventListener("mouseup", this.handleWindowMouseUp);
        window.addEventListener("mousemove", this.handleMouseMove);
        this.setState({
            isMouseDragging: true,
            activeThumb: thumb,
        });
        this.updateDragValue(this.getDragValue(e.nativeEvent, thumb), thumb);
    };

    /**
     *  Handle mouse moves during a thumb drag operation
     */
    private handleMouseMove = (event: MouseEvent): void => {
        if (this.props.disabled || event.defaultPrevented) {
            return;
        }
        this.updateDragValue(
            this.getDragValue(event, this.state.activeThumb),
            this.state.activeThumb
        );
    };

    /**
     *  Get dragvalue from mouse event or touch
     */
    private getDragValue = (event: MouseEvent | Touch, thumb: SliderThumb): number => {
        this.updateSliderDimensions();
        const pixelCoordinate: number =
            this.props.orientation === SliderOrientation.vertical
                ? event.clientY
                : event.clientX;
        const dragValue: number =
            (this.props.range.maxValue - this.props.range.minValue) *
                this.convertPixelToPercent(pixelCoordinate) +
            this.props.range.minValue;
        return dragValue;
    };

    /**
     * Handles touch dragging
     */
    private handleUpperThumbTouchStart = (e: React.TouchEvent): void => {
        this.handleThumbTouchStart(e, SliderThumb.upperThumb);
    };

    private handleLowerThumbTouchStart = (e: React.TouchEvent): void => {
        this.handleThumbTouchStart(e, SliderThumb.lowerThumb);
    };

    private handleThumbTouchStart = (e: React.TouchEvent, thumb: SliderThumb): void => {
        if (e.defaultPrevented || this.isBusyOrDisabled()) {
            return;
        }

        e.preventDefault();
        (e.target as HTMLElement).focus();
        window.addEventListener("touchend", this.handleTouchEnd);
        window.addEventListener("touchcancel", this.handleTouchEnd);
        window.addEventListener("touchmove", this.handleTouchMove);
        this.setState({
            isTouchDragging: true,
            activeThumb: thumb,
        });
        const thisTouch: Touch = e.nativeEvent.touches.item(0);
        this.updateDragValue(this.getDragValue(thisTouch, thumb), thumb);
    };

    /**
     *  Returns first valid touch found in a touch event
     */
    private getValidTouch = (event: TouchEvent): Touch | null => {
        if (isNil(this.rootElement.current)) {
            return null;
        }

        const touchCount: number = event.touches.length;

        for (let i: number = 0; i < touchCount; i++) {
            const thisTouch: Touch = event.touches.item(i);
            const touchElement: HTMLElement = thisTouch.target as HTMLElement;
            if (
                touchElement.attributes[Slider.rolePropName].value === "slider" &&
                touchElement.tabIndex === 0 &&
                this.rootElement.current.contains(touchElement)
            ) {
                return thisTouch;
            }
        }
        return null;
    };

    /**
     *  Handle touch moves during a thumb drag operation
     */
    private handleTouchMove = (event: TouchEvent): void => {
        if (this.props.disabled || event.defaultPrevented) {
            return;
        }
        const validTouch: Touch = this.getValidTouch(event);
        if (validTouch === null) {
            this.stopTouchDragging();
            return;
        }

        this.updateDragValue(
            this.getDragValue(validTouch, this.state.activeThumb),
            this.state.activeThumb
        );
    };

    /**
     * Handle touch end
     */
    private handleTouchEnd = (event: TouchEvent): void => {
        event.preventDefault();
        this.stopTouchDragging();
    };

    /**
     *  Updates the current drag value
     */
    private updateDragValue = (dragValue: number, thumb: SliderThumb): void => {
        const constrainedRange: SliderRange = this.getConstrainedRange(true);

        const newDragValue: number = this.constrainToRange(dragValue, constrainedRange);

        this.setState({
            dragValue: newDragValue,
        });

        if (thumb === SliderThumb.lowerThumb) {
            this.updateValues(newDragValue, null);
        } else {
            this.updateValues(null, newDragValue);
        }
    };

    /**
     *  Gets the range of values the active thumb is actually allowed to traverse
     */
    private getConstrainedRange = (
        constrainToOppositeEndOfSelection: boolean
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

        if (
            this.props.mode !== SliderMode.singleValue &&
            constrainToOppositeEndOfSelection
        ) {
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
     *  Apply value changes to state, only place this should happen outside of constructor and ComponentDidUpdate
     */
    private updateValues = (lowerValue: number, upperValue: number): void => {
        let newLowerValue: number = this.state.lowerValue;
        let newUpperValue: number = this.state.upperValue;

        if (lowerValue !== null) {
            newLowerValue = this.constrainToRange(
                this.constrainToStep(lowerValue, this.props.step),
                this.props.range
            );
        }

        if (upperValue !== null) {
            newUpperValue = this.constrainToRange(
                this.constrainToStep(upperValue, this.props.step),
                this.props.range
            );
        }

        if (
            this.state.upperValue === newUpperValue &&
            this.state.lowerValue === newLowerValue
        ) {
            return;
        }

        this.invokeValueChange(newLowerValue, newUpperValue);

        if (this.props.value === undefined) {
            this.setState({
                lowerValue:
                    this.props.mode === SliderMode.singleValue
                        ? newUpperValue
                        : newLowerValue,
                upperValue: newUpperValue,
            });
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
            case keyCodeArrowDown:
            case keyCodeArrowRight:
            case keyCodeArrowUp:
            case keyCodeArrowLeft:
            case keyCodePageDown:
            case keyCodePageUp:
                this.stopIncrementing();
                break;
        }
    };

    /**
     *  Ends a thumb drag operation
     */
    private stopDragging = (): void => {
        if (!this.state.isMouseDragging) {
            return;
        }
        window.removeEventListener("mouseup", this.handleWindowMouseUp);
        window.removeEventListener("mousemove", this.handleMouseMove);
        this.setState({
            isMouseDragging: false,
        });
    };

    /**
     *  Ends a thumb touch drag operation
     */
    private stopTouchDragging = (): void => {
        if (!this.state.isTouchDragging) {
            return;
        }
        window.removeEventListener("touchend", this.handleTouchEnd);
        window.removeEventListener("touchcancel", this.handleTouchEnd);
        window.removeEventListener("touchmove", this.handleTouchMove);
        this.setState({
            isTouchDragging: false,
        });
    };

    /**
     *  Ends active drag/increment operations
     */
    private suspendActiveOperations = (): void => {
        this.stopDragging();
        this.stopTouchDragging();
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
    private constrainToStep = (value: number, step: number): number => {
        // we remove then restore the slider range min value to
        // ensure that the remainder calculates correctly in case the minValue
        // is not based off 0, eg. range minValue 7.5, step 2.  Slider steps increment off
        // of the min value of the slider's range, not 0.
        let constrainedValue: number = value - this.props.range.minValue;
        const remainder: number = constrainedValue % step;
        constrainedValue =
            remainder >= step / 2 // check to see if this is over half a single step
                ? constrainedValue - remainder + step // if so add a step
                : constrainedValue - remainder;

        return constrainedValue + this.props.range.minValue;
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

    /**
     *  Checks if the component is busy with an active operation or disabled
     */
    private isBusyOrDisabled = (): boolean => {
        if (
            this.props.disabled ||
            this.state.isMouseDragging ||
            this.state.isIncrementing ||
            this.state.isTouchDragging
        ) {
            return true;
        }
        return false;
    };
}

export default Slider;
export * from "./slider.props";
export { SliderClassNameContract, SliderContext, SliderContextType };
