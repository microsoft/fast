import Foundation, { HandledProps } from "@microsoft/fast-components-foundation-react";
import { Slider as BaseSlider } from "@microsoft/fast-components-react-base";
import { DesignSystem } from "@microsoft/fast-components-styles-msft";
import { DesignSystemConsumer } from "@microsoft/fast-jss-manager-react";
import React from "react";
import { DisplayNamePrefix } from "../utilities";
import { SliderHandledProps, SliderUnhandledProps } from "./slider.props";

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
