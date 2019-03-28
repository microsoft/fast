import React from "react";
import Foundation, { HandledProps } from "@microsoft/fast-components-foundation-react";
import {
    SliderLabelHandledProps,
    SliderLabelProps,
    SliderLabelUnhandledProps,
} from "./slider-label.props";
import {
    SliderContext,
    SliderContextType,
    SliderTrackItem as BaseSliderTrackItem,
    SliderTrackItemAnchor,
} from "@microsoft/fast-components-react-base";
import { get } from "lodash-es";
import { DisplayNamePrefix } from "../utilities";

class SliderLabel extends Foundation<
    SliderLabelHandledProps,
    SliderLabelUnhandledProps,
    {}
> {
    public static displayName: string = `${DisplayNamePrefix}SliderLabel`;
    public static contextType: React.Context<SliderContextType> = SliderContext;

    public static defaultProps: Partial<SliderLabelProps> = {
        showTickmark: true,
    };

    protected handledProps: HandledProps<SliderLabelHandledProps> = {
        showTickmark: void 0,
        label: void 0,
        valuePositionBinding: void 0,
        managedClasses: void 0,
    };

    public render(): React.ReactNode {
        return (
            <BaseSliderTrackItem
                {...this.unhandledProps()}
                minValuePositionBinding={this.props.valuePositionBinding}
                maxValuePositionBinding={this.props.valuePositionBinding}
                managedClasses={{
                    sliderTrackItem: get(this.props.managedClasses, "sliderLabel", ""),
                    sliderTrackItem__orientationHorizontal: get(
                        this.props.managedClasses,
                        "sliderLabel__orientationHorizontal",
                        ""
                    ),
                    sliderTrackItem__orientationVertical: get(
                        this.props.managedClasses,
                        "sliderLabel__orientationVertical",
                        ""
                    ),
                }}
            >
                <div className={this.generatePositioningPanelClassNames()}>
                    {this.renderLabel()}
                    {this.renderTickmark()}
                    {this.props.children}
                </div>
            </BaseSliderTrackItem>
        );
    }

    /**
     * Create class-names
     */
    private generatePositioningPanelClassNames(): string {
        let classNames: string = get(
            this.props,
            "managedClasses.sliderLabel_positioningPanel",
            ""
        );

        if (this.props.valuePositionBinding === SliderTrackItemAnchor.totalRangeMax) {
            classNames = `${classNames} ${get(
                this.props,
                "managedClasses.sliderLabel__positionMax",
                ""
            )}`;
        } else if (
            this.props.valuePositionBinding === SliderTrackItemAnchor.totalRangeMin
        ) {
            classNames = `${classNames} ${get(
                this.props,
                "managedClasses.sliderLabel__positionMin",
                ""
            )}`;
        }

        if ((this.context as SliderContextType).sliderDirection === "rtl") {
            classNames = `${classNames} ${get(
                this.props,
                "managedClasses.sliderLabel__rtl",
                ""
            )}`;
        }

        return classNames;
    }

    private renderLabel = (): React.ReactNode => {
        if (this.props.label === undefined) {
            return null;
        }
        return (
            <span className={get(this.props.managedClasses, "sliderLabel_label", "")}>
                {this.props.label}
            </span>
        );
    };

    private renderTickmark = (): React.ReactNode => {
        if (!this.props.showTickmark) {
            return;
        }
        return (
            <div className={get(this.props.managedClasses, "sliderLabel_tickMark", "")} />
        );
    };
}

SliderLabel.contextType = SliderContext;
export default SliderLabel;
export * from "./slider-label.props";
