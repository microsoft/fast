import React from "react";
import Foundation, { HandledProps } from "@microsoft/fast-components-foundation-react";
import {
    DesignSystemConsumer,
    DesignSystemProvider,
} from "@microsoft/fast-jss-manager-react";
import {
    DesignSystem,
    DesignSystemDefaults,
    DesignSystemResolver,
    neutralFillCardRest,
} from "@microsoft/fast-components-styles-msft";
import {
    BackgroundHandledProps,
    BackgroundProps,
    BackgroundUnhandledProps,
    DarkModeBackgrounds,
    LightModeBackgrounds,
} from "./background.props";
import { get, has, memoize } from "lodash-es";

export default class Background extends Foundation<
    BackgroundHandledProps,
    BackgroundUnhandledProps,
    {}
> {
    public static defaultProps: Partial<BackgroundProps> = {
        tag: "div",
        value: LightModeBackgrounds.L1,
    };
    protected handledProps: HandledProps<Required<BackgroundHandledProps>> = {
        tag: void 0,
        value: void 0,
    };

    private getDesignSystemOverrides: (color: string) => Partial<DesignSystem> = memoize(
        (color: string): Partial<DesignSystem> => {
            return { backgroundColor: color };
        }
    );

    public render(): JSX.Element {
        return <DesignSystemConsumer>{this.withContext}</DesignSystemConsumer>;
    }

    private withContext = (designSystem: DesignSystem): JSX.Element => {
        const background: string | number | DesignSystemResolver<string> = this.props
            .value;
        const color: string =
            typeof background === "string"
                ? background
                : typeof background === "function"
                    ? background(designSystem)
                    : has(designSystem.neutralPalette, background)
                        ? get(designSystem.neutralPalette, background)
                        : DesignSystemDefaults.neutralPalette[background] ||
                          DesignSystemDefaults.neutralPalette[
                              Background.defaultProps.value as LightModeBackgrounds
                          ];

        const style: React.CSSProperties = Object.assign({}, this.props.style, {
            backgroundColor: color,
        });

        return (
            <DesignSystemProvider designSystem={this.getDesignSystemOverrides(color)}>
                <this.props.tag {...this.unhandledProps()} style={style}>
                    {this.props.children}
                </this.props.tag>
            </DesignSystemProvider>
        );
    };
}

export * from "./background.props";
