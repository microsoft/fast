import * as React from "react";
import * as ReactDOM from "react-dom";
import { get } from "lodash-es";
import Foundation, { HandledProps } from "@microsoft/fast-components-foundation-react";
import { KeyCodes } from "@microsoft/fast-web-utilities";
import {
    SliderHandledProps,
    SliderOrientation,
    SliderProps,
    SliderUnhandledProps,
} from "./slider.props";
import {
    ManagedClasses,
    SliderClassNameContract,
} from "@microsoft/fast-components-class-name-contracts-base";
import { debug } from "util";

export interface SliderState {
    dragValue: number;
    dragValueAsPercent: number;
    value: number;
    valueAsPercent: number;
    isDragging: boolean;
    isIncrementing: boolean;
}

class Slider extends Foundation<SliderHandledProps, SliderUnhandledProps, SliderState> {
    public static displayName: string = "Slider";

    public static defaultProps: Partial<SliderProps> = {
        disabled: false,
        orientation: SliderOrientation.horizontal,
        initialValue: 0,
        min: 0,
        max: 100,
        step: 1,
        pageStep: 10,
    };

    private static baseIncrementDelay: number = 250;
    private static minIncrementDelay: number = 20;
    private static incrementAcceleration: number = 50;

    protected handledProps: HandledProps<SliderHandledProps> = {
        disabled: void 0,
        managedClasses: void 0,
        orientation: void 0,
        initialValue: void 0,
        min: void 0,
        max: void 0,
        pageStep: void 0,
        step: void 0,
        value: void 0,
        onValueChange: void 0,
        name: void 0,
        form: void 0,
        labelledBy: void 0,
    };

    private rootElement: React.RefObject<HTMLDivElement> = React.createRef<
        HTMLDivElement
    >();

    private layoutElement: React.RefObject<HTMLDivElement> = React.createRef<
        HTMLDivElement
    >();

    private rangeInPixels: number = -1;
    private barMinPixel: number = -1;
    private incrementDirection: number = 1;
    private incrementTimer: NodeJS.Timer;
    private lastIncrementDelay: number = Slider.baseIncrementDelay;
    private usePageStep: boolean = false;

    /**
     * constructor
     */
    constructor(props: SliderProps) {
        super(props);

        const value: number =
            this.props.value === undefined ? this.props.initialValue : this.props.value;

        this.state = {
            dragValue: -1,
            dragValueAsPercent: 0,
            value,
            valueAsPercent:
                ((value - this.props.min) / (this.props.max - this.props.min)) * 100,
            isDragging: false,
            isIncrementing: false,
        };
    }

    // public componentDidMount(): void {
    // }

    public componentWillUnmount(): void {
        this.stopDragging();
        this.stopIncrementing();
    }

    // public componentDidUpdate(prevProps: SliderProps): void {
    // }

    /**
     * Renders the component
     */
    public render(): React.ReactElement<HTMLDivElement> {
        return (
            <div
                {...this.unhandledProps()}
                ref={this.rootElement}
                className={this.generateClassNames()}
                style={{ height: "80px", background: "white" }}
            >
                <div
                    className={get(this.props.managedClasses, "slider_layoutPanel", "")}
                    style={{
                        position: "relative",
                        background: "blue",
                        height: "100%",
                        width: "100%",
                    }}
                    ref={this.layoutElement}
                >
                    <div
                        className={get(this.props.managedClasses, "slider_barBack", "")}
                        onMouseDown={this.handleTrackMouseDown}
                        style={{
                            position: "absolute",
                            top: "0",
                            left: "0",
                            height: "20px",
                            background: "yellow",
                            width: "100%",
                        }}
                    />
                    <div
                        className={get(this.props.managedClasses, "slider_barFront", "")}
                        onMouseDown={this.handleTrackMouseDown}
                        style={{
                            position: "absolute",
                            top: "0",
                            left: "0",
                            height: "10px",
                            background: "green",
                            width: `${
                                this.state.isDragging
                                    ? this.state.dragValueAsPercent
                                    : this.state.valueAsPercent
                            }%`,
                        }}
                    />
                    {this.props.children}
                    {this.renderThumb()}
                </div>
                {this.renderHiddenInputElement()}
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

        return super.generateClassNames(classNames);
    }

    private renderThumb(): React.ReactNode {
        if (typeof this.props.thumb === "function") {
            return this.props.thumb(
                this.props,
                this.state,
                this.handleThumbMouseDown,
                this.handleThumbKeydown
            );
        } else {
            return this.renderDefaultThumb(
                this.props,
                this.state,
                this.handleThumbMouseDown,
                this.handleThumbKeydown
            );
        }
    }

    private renderDefaultThumb(
        props: SliderProps,
        state: SliderState,
        mouseDownCallback: (event: React.MouseEvent) => void,
        keyDownCallback: (event: React.KeyboardEvent) => void
    ): React.ReactNode {
        return (
            <div
                className={get(this.props.managedClasses, "slider_thumb", "")}
                draggable={false}
                tabIndex={0}
                onKeyDown={keyDownCallback}
                onMouseDown={mouseDownCallback}
                aria-valuemin={props.min}
                aria-valuemax={props.max}
                aria-valuenow={state.value}
                aria-labelledby={props.labelledBy || null}
                style={{
                    position: "absolute",
                    top: "0",
                    left: "0",
                    width: "20px",
                    height: "20px",
                    background: "red",
                    marginLeft: `${
                        state.isDragging ? state.dragValueAsPercent : state.valueAsPercent
                    }%`,
                    transform: "translateX(-10px)",
                }}
            />
        );
    }

    /**
     * Renders a hidden input element which can interact with a
     * form hosting this component
     */
    private renderHiddenInputElement(): React.ReactNode {
        return (
            <input
                type="range"
                required={this.props.required || null}
                name={this.props.name || null}
                form={this.props.form || null}
                value={this.state.value}
                disabled={this.props.disabled || null}
                style={{
                    display: "none",
                }}
            />
        );
    }

    /**
     * Handles thumb clicks
     */
    private handleThumbMouseDown = (e: React.MouseEvent): void => {
        if (this.props.disabled || e.defaultPrevented) {
            return;
        }
        e.preventDefault();
        window.addEventListener("mouseup", this.handleWindowMouseUp);
        window.addEventListener("mousemove", this.handleMouseMove);
        this.updateSliderDimensions();
        this.setState({
            isDragging: true,
        });
    };

    /**
     * Handles track clicks
     */
    private handleTrackMouseDown = (event: React.MouseEvent): void => {
        if (this.props.disabled || event.defaultPrevented) {
            return;
        }
        event.preventDefault();
        this.updateSliderDimensions();
        const pixelCoordinate: number =
            this.props.orientation === SliderOrientation.horizontal
                ? event.pageX
                : event.pageY;
        const newValue: number =
            (this.props.max - this.props.min) *
                this.convertPixelToPercent(pixelCoordinate) +
            this.props.min;
        this.updateValue(newValue);
    };

    private updateSliderDimensions = (): void => {
        this.rangeInPixels = SliderOrientation.horizontal
            ? this.layoutElement.current.clientWidth
            : this.layoutElement.current.clientHeight;
        this.barMinPixel =
            this.props.orientation === SliderOrientation.horizontal
                ? this.layoutElement.current.getBoundingClientRect().left
                : this.layoutElement.current.getBoundingClientRect().top;
    };

    /**
     * Handles key events
     */
    private handleThumbKeydown = (e: React.KeyboardEvent<HTMLDivElement>): void => {
        if (this.props.disabled || e.defaultPrevented) {
            return;
        }

        switch (e.keyCode) {
            case KeyCodes.arrowDown:
            case KeyCodes.arrowRight:
                this.startIncrementing(1, false);
                break;
            case KeyCodes.arrowUp:
            case KeyCodes.arrowLeft:
                this.startIncrementing(-1, false);
                break;
            case KeyCodes.pageDown:
                if (this.props.pageStep !== undefined) {
                    this.startIncrementing(1, true);
                }
                break;
            case KeyCodes.pageUp:
                if (this.props.pageStep !== undefined) {
                    this.startIncrementing(-1, true);
                }
                break;
        }
    };

    private startIncrementing = (
        incrementDirection: number,
        usePageStep: boolean
    ): void => {
        if (this.state.isIncrementing) {
            return;
        }

        this.usePageStep = usePageStep;
        this.incrementDirection = incrementDirection;

        window.addEventListener("keyup", this.handleWindowKeyUp);
        this.setState({
            isIncrementing: true,
        });
        this.incrementValue();
        this.lastIncrementDelay = Slider.baseIncrementDelay;
        this.incrementTimer = setTimeout((): void => {
            this.incrementTimerExpired();
        }, this.lastIncrementDelay);
    };

    private incrementValue = (): void => {
        const step: number = this.usePageStep ? this.props.pageStep : this.props.step;
        this.updateValue(this.state.value + step * this.incrementDirection);
    };

    /**
     *
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

    private convertPixelToPercent = (pixelPos: number): number => {
        let pct: number = (pixelPos - this.barMinPixel) / this.rangeInPixels;

        if (pct < 0) {
            pct = 0;
        } else if (pct > 1) {
            pct = 1;
        }

        return pct;
    };

    /**
     *
     */
    private handleMouseMove = (event: MouseEvent): void => {
        const pixelCoordinate: number =
            this.props.orientation === SliderOrientation.horizontal
                ? event.pageX
                : event.pageY;
        const dragValue: number =
            (this.props.max - this.props.min) *
                this.convertPixelToPercent(pixelCoordinate) +
            this.props.min;
        this.updateValue(dragValue, dragValue);
    };

    private updateValue = (value: number, dragValue?: number): void => {
        let newValue: number = value;

        if (this.props.value !== undefined) {
            newValue = this.props.value;
        } else {
            newValue = this.constrainToRange(
                this.contstrainToStep(value, this.props.step),
                this.props.min,
                this.props.max
            );
        }

        let newDragValue: number = newValue;

        if (dragValue !== undefined) {
            newDragValue = this.constrainToRange(
                dragValue,
                this.props.min,
                this.props.max
            );
        }

        if (
            typeof this.props.onValueChange === "function" &&
            this.state.value !== newValue
        ) {
            this.props.onValueChange(newValue);
        }

        this.setState({
            dragValue: newDragValue,
            dragValueAsPercent: this.valueAsPercent(newDragValue),
            value: newValue,
            valueAsPercent: this.valueAsPercent(newValue),
        });
    };

    private constrainToRange = (value: number, min: number, max: number): number => {
        let newValue: number = value;
        if (newValue > max) {
            newValue = max;
        } else if (newValue < min) {
            newValue = min;
        }
        return newValue;
    };

    private contstrainToStep = (value: number, step: number): number => {
        if (step === 0) {
            return value;
        }

        return Math.floor(value / step) * step;
    };

    private valueAsPercent = (value: number): number => {
        return ((value - this.props.min) / (this.props.max - this.props.min)) * 100;
    };

    /**
     *
     */
    private handleWindowMouseUp = (event: MouseEvent): void => {
        this.stopDragging();
    };

    /**
     *
     */
    private handleWindowKeyUp = (event: MouseEvent): void => {
        this.stopIncrementing();
    };

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
}

export default Slider;
export * from "./slider.props";
export { SliderClassNameContract };
