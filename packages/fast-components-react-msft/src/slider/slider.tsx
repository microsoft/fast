import React from "react";
import { get } from "lodash-es";
import Foundation, { HandledProps } from "@microsoft/fast-components-foundation-react";
import {
    SliderHandledProps,
    SliderManagedClasses,
    SliderProps,
    SliderUnhandledProps,
} from "./slider.props";
import {
    Slider as BaseSlider,
    SliderTrackItem,
} from "@microsoft/fast-components-react-base";
import { DisplayNamePrefix } from "../utilities";
import { DesignSystem } from "@microsoft/fast-components-styles-msft";
import { DesignSystemConsumer } from "@microsoft/fast-jss-manager-react";

class Slider extends Foundation<SliderHandledProps, SliderUnhandledProps, {}> {
    public static displayName: string = `${DisplayNamePrefix}Slider`;

    protected handledProps: HandledProps<SliderHandledProps> = {
        managedClasses: void 0,
    };

    /**
     * Renders the component
     */
    public render(): React.ReactElement<HTMLDivElement> {
        return (
            <DesignSystemConsumer>
                {(designSystem?: DesignSystem): JSX.Element => {
                    let designSystemDirection: string;
                    if (
                        designSystem !== undefined &&
                        designSystem.direction !== undefined
                    ) {
                        designSystemDirection = designSystem.direction;
                    }
                    return (
                        <BaseSlider
                            {...this.unhandledProps()}
                            dir={designSystemDirection || null}
                            managedClasses={this.props.managedClasses}
                        >
                            {this.props.children}
                        </BaseSlider>
                    );
                }}
            </DesignSystemConsumer>
        );
    }
}

export default Slider;
export * from "./slider.props";
