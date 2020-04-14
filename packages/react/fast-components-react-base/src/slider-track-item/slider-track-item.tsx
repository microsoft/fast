import { SliderTrackItemClassNameContract } from "@microsoft/fast-components-class-name-contracts-base";
import Foundation, { HandledProps } from "@microsoft/fast-components-foundation-react";
import { classNames } from "@microsoft/fast-web-utilities";
import React from "react";
import { SliderContext, SliderContextType } from "../slider/slider-context";
import { SliderThumb } from "../slider/slider";
import { SliderOrientation } from "../slider/slider.props";
import { DisplayNamePrefix } from "../utilities";
import {
    SliderTrackItemAnchor,
    SliderTrackItemHandledProps,
    SliderTrackItemProps,
    SliderTrackItemUnhandledProps,
} from "./slider-track-item.props";

class SliderTrackItem extends Foundation<
    SliderTrackItemHandledProps,
    SliderTrackItemUnhandledProps,
    {}
> {
    public static displayName: string = `${DisplayNamePrefix}SliderTrackItem`;

    public static defaultProps: Partial<SliderTrackItemProps> = {
        managedClasses: {},
    };

    public static contextType: React.Context<SliderContextType> = SliderContext;

    protected handledProps: HandledProps<SliderTrackItemHandledProps> = {
        maxValuePositionBinding: void 0,
        minValuePositionBinding: void 0,
        managedClasses: void 0,
    };

    /**
     * Renders the component
     */
    public render(): React.ReactElement<HTMLDivElement> {
        return (
            <div
                {...this.unhandledProps()}
                className={this.generateClassNames()}
                style={{
                    position: "absolute",
                    ...this.applyPositioningValues(),
                }}
            >
                {this.props.children}
            </div>
        );
    }

    /**
     * Create class-names
     */
    protected generateClassNames(): string {
        const {
            sliderTrackItem,
            sliderTrackItem_vertical,
            sliderTrackItem_horizontal,
        }: SliderTrackItemClassNameContract = this.props.managedClasses;
        const orientation: SliderOrientation =
            this.context.sliderOrientation || SliderOrientation.horizontal;

        return super.generateClassNames(
            classNames(
                sliderTrackItem,
                [sliderTrackItem_vertical, orientation === SliderOrientation.vertical],
                [sliderTrackItem_horizontal, orientation === SliderOrientation.horizontal]
            )
        );
    }

    /**
     * Gets the appropriate absolute positioning
     */
    private applyPositioningValues = (): any => {
        const minValue: number = this.getPositionAsPercent(
            this.props.minValuePositionBinding
        );
        const maxValue: number = this.getPositionAsPercent(
            this.props.maxValuePositionBinding
        );

        if (this.context.sliderOrientation === SliderOrientation.vertical) {
            return {
                top: `${100 - maxValue}%`,
                bottom: `${minValue}%`,
            };
        } else if (this.context.sliderDirection === "rtl") {
            return {
                left: maxValue !== undefined ? `${100 - maxValue}%` : undefined,
                right: minValue !== undefined ? `${minValue}%` : undefined,
            };
        } else {
            return {
                left: minValue !== undefined ? `${minValue}%` : undefined,
                right: maxValue !== undefined ? `${100 - maxValue}%` : undefined,
            };
        }
    };

    /**
     *  Returns a percent value to use for positioning based on the selected anchor type
     */
    private getPositionAsPercent = (anchor: SliderTrackItemAnchor | number): number => {
        if (
            anchor === undefined ||
            typeof this.context.sliderValueAsPercent !== "function" ||
            this.context.sliderState === null
        ) {
            return undefined;
        }

        if (typeof anchor === "number") {
            return this.context.sliderValueAsPercent(anchor);
        }

        switch (anchor) {
            case SliderTrackItemAnchor.selectedRangeMax:
                return this.context.sliderValueAsPercent(
                    (this.context.sliderState.isDragging ||
                        this.context.sliderState.isTouchDragging) &&
                        this.context.sliderState.activeThumb === SliderThumb.upperThumb
                        ? this.context.sliderState.dragValue
                        : this.context.sliderState.upperValue
                );

            case SliderTrackItemAnchor.selectedRangeMin:
                return this.context.sliderValueAsPercent(
                    (this.context.sliderState.isDragging ||
                        this.context.sliderState.isTouchDragging) &&
                        this.context.sliderState.activeThumb === SliderThumb.lowerThumb
                        ? this.context.sliderState.dragValue
                        : this.context.sliderState.lowerValue
                );

            case SliderTrackItemAnchor.totalRangeMax:
                return 100;

            case SliderTrackItemAnchor.totalRangeMin:
                return 0;

            case SliderTrackItemAnchor.constrainedRangeMax:
                return this.context.sliderConstrainedRange !== null
                    ? this.context.sliderValueAsPercent(
                          this.context.sliderConstrainedRange.maxValue
                      )
                    : 100;

            case SliderTrackItemAnchor.constrainedRangeMin:
                return this.context.sliderConstrainedRange !== null
                    ? this.context.sliderValueAsPercent(
                          this.context.sliderConstrainedRange.minValue
                      )
                    : 0;
        }
    };
}

SliderTrackItem.contextType = SliderContext;
export default SliderTrackItem;
export * from "./slider-track-item.props";
export { SliderTrackItemClassNameContract };
