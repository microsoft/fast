import React from "react";
import Foundation, { HandledProps } from "@microsoft/fast-components-foundation-react";
import { get } from "lodash-es";
import { SliderTrackItemClassNameContract } from "@microsoft/fast-components-class-name-contracts-base";
import {
    SliderTrackItemAnchor,
    SliderTrackItemHandledProps,
    SliderTrackItemProps,
    SliderTrackItemUnhandledProps,
} from "./slider-track-item.props";
import { SliderOrientation } from "../slider/slider.props";
import { SliderContext, SliderContextType } from "../slider/slider-context";
import { DisplayNamePrefix } from "../utilities";

class SliderTrackItem extends Foundation<
    SliderTrackItemHandledProps,
    SliderTrackItemUnhandledProps,
    {}
> {
    public static displayName: string = `${DisplayNamePrefix}SliderTrackItem`;

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
        let classNames: string = get(this.props, "managedClasses.sliderTrackItem", "");

        if (
            (this.context as SliderContextType).sliderOrientation ===
            SliderOrientation.vertical
        ) {
            classNames = `${classNames} ${get(
                this.props,
                "managedClasses.sliderTrackItem_vertical",
                ""
            )}`;
        } else {
            classNames = `${classNames} ${get(
                this.props,
                "managedClasses.sliderTrackItem_horizontal",
                ""
            )}`;
        }

        return super.generateClassNames(classNames);
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

        if (
            (this.context as SliderContextType).sliderOrientation ===
            SliderOrientation.vertical
        ) {
            return {
                top: `${100 - maxValue}%`,
                bottom: `${minValue}%`,
            };
        } else if ((this.context as SliderContextType).sliderDirection === "rtl") {
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
            typeof (this.context as SliderContextType).sliderValueAsPercent !==
                "function" ||
            (this.context as SliderContextType).sliderState === null
        ) {
            return undefined;
        }

        if (typeof anchor === "number") {
            return (this.context as SliderContextType).sliderValueAsPercent(anchor);
        }

        switch (anchor) {
            case SliderTrackItemAnchor.selectedRangeMax:
                return (this.context as SliderContextType).sliderValueAsPercent(
                    (this.context as SliderContextType).sliderState.upperValue
                );

            case SliderTrackItemAnchor.selectedRangeMin:
                return (this.context as SliderContextType).sliderValueAsPercent(
                    (this.context as SliderContextType).sliderState.lowerValue
                );

            case SliderTrackItemAnchor.totalRangeMax:
                return 100;

            case SliderTrackItemAnchor.totalRangeMin:
                return 0;

            case SliderTrackItemAnchor.constrainedRangeMax:
                return (this.context as SliderContextType).sliderConstrainedRange !== null
                    ? (this.context as SliderContextType).sliderValueAsPercent(
                          (this.context as SliderContextType).sliderConstrainedRange
                              .maxValue
                      )
                    : 100;

            case SliderTrackItemAnchor.constrainedRangeMin:
                return (this.context as SliderContextType).sliderConstrainedRange !== null
                    ? (this.context as SliderContextType).sliderValueAsPercent(
                          (this.context as SliderContextType).sliderConstrainedRange
                              .minValue
                      )
                    : 0;
        }
    };
}

SliderTrackItem.contextType = SliderContext;
export default SliderTrackItem;
export * from "./slider-track-item.props";
export { SliderTrackItemClassNameContract };
