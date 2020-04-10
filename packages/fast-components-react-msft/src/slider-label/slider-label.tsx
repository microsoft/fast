import { SliderLabelClassNameContract } from "@microsoft/fast-components-class-name-contracts-msft";
import Foundation, { HandledProps } from "@microsoft/fast-components-foundation-react";
import {
    SliderTrackItem as BaseSliderTrackItem,
    SliderContext,
    SliderContextType,
    SliderTrackItemAnchor,
} from "@microsoft/fast-components-react-base";
import { classNames, Direction } from "@microsoft/fast-web-utilities";
import React from "react";
import { DisplayNamePrefix } from "../utilities";
import {
    SliderLabelHandledProps,
    SliderLabelProps,
    SliderLabelUnhandledProps,
} from "./slider-label.props";

class SliderLabel extends Foundation<
    SliderLabelHandledProps,
    SliderLabelUnhandledProps,
    {}
> {
    public static displayName: string = `${DisplayNamePrefix}SliderLabel`;
    public static contextType: React.Context<SliderContextType> = SliderContext;

    public static defaultProps: Partial<SliderLabelProps> = {
        showTickmark: true,
        managedClasses: {},
    };

    protected handledProps: HandledProps<SliderLabelHandledProps> = {
        showTickmark: void 0,
        label: void 0,
        valuePositionBinding: void 0,
        managedClasses: void 0,
    };

    public render(): React.ReactNode {
        const {
            sliderLabel,
            sliderLabel__horizontal,
            sliderLabel__vertical,
        }: Partial<SliderLabelClassNameContract> = this.props.managedClasses;
        return (
            <BaseSliderTrackItem
                {...this.unhandledProps()}
                minValuePositionBinding={this.props.valuePositionBinding}
                maxValuePositionBinding={this.props.valuePositionBinding}
                managedClasses={{
                    sliderTrackItem: sliderLabel,
                    sliderTrackItem_horizontal: sliderLabel__horizontal,
                    sliderTrackItem_vertical: sliderLabel__vertical,
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
        const {
            sliderLabel_positioningRegion,
            sliderLabel__positionMax,
            sliderLabel__positionMin,
            sliderLabel__rtl,
        }: Partial<SliderLabelClassNameContract> = this.props.managedClasses;
        const binding: SliderLabelProps["valuePositionBinding"] = this.props
            .valuePositionBinding;

        return classNames(
            sliderLabel_positioningRegion,
            [sliderLabel__positionMax, binding === SliderTrackItemAnchor.totalRangeMax],
            [sliderLabel__positionMin, binding === SliderTrackItemAnchor.totalRangeMin],
            [sliderLabel__rtl, this.context.sliderDirection === Direction.rtl]
        );
    }

    private renderLabel = (): React.ReactNode => {
        if (this.props.label === undefined) {
            return null;
        }
        return (
            <span className={classNames(this.props.managedClasses.sliderLabel_label)}>
                {this.props.label}
            </span>
        );
    };

    private renderTickmark = (): React.ReactNode => {
        if (!this.props.showTickmark) {
            return;
        }

        return (
            <div className={classNames(this.props.managedClasses.sliderLabel_tickMark)} />
        );
    };
}

SliderLabel.contextType = SliderContext;
export default SliderLabel;
export * from "./slider-label.props";
