import Foundation, { HandledProps } from "@microsoft/fast-components-foundation-react";
import {
    DesignSystem,
    DesignSystemDefaults,
    DesignSystemResolver,
    neutralLayerL1,
} from "@microsoft/fast-components-styles-msft";
import {
    DesignSystemConsumer,
    DesignSystemProvider,
} from "@microsoft/fast-jss-manager-react";
import { get, has, memoize } from "lodash-es";
import React from "react";
import { BackgroundHandledProps, BackgroundUnhandledProps } from "./background.props";

export default class Background extends Foundation<
    BackgroundHandledProps,
    BackgroundUnhandledProps,
    {}
> {
    public static defaultProps: Partial<
        Omit<BackgroundHandledProps, "value"> & { value: DesignSystemResolver<string> }
    > = {
        tag: "div",
        value: neutralLayerL1,
        drawBackground: true,
    };
    protected handledProps: HandledProps<Required<BackgroundHandledProps>> = {
        tag: void 0,
        value: void 0,
        drawBackground: void 0,
        designSystemMergingFunction: void 0,
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
                  Background.defaultProps.value(DesignSystemDefaults);

        const style: React.CSSProperties = Object.assign(
            {},
            this.props.style,
            this.props.drawBackground
                ? {
                      backgroundColor: color,
                  }
                : void 0
        );

        return (
            <DesignSystemProvider
                designSystem={this.getDesignSystemOverrides(color)}
                designSystemMergingFunction={this.props.designSystemMergingFunction}
            >
                {(this.tag && (
                    <this.tag {...this.unhandledProps()} style={style}>
                        {this.props.children}
                    </this.tag>
                )) ||
                    this.props.children}
            </DesignSystemProvider>
        );
    };

    private get tag(): any {
        return this.props.tag;
    }
}

export * from "./background.props";
