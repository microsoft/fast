/// <reference types="react" />
import Foundation, { HandledProps } from "@microsoft/fast-components-foundation-react";
import { RotateHandledProps, RotateUnhandledProps } from "./rotate.props";
export declare class Rotate extends Foundation<
    RotateHandledProps,
    RotateUnhandledProps,
    {}
> {
    static displayName: string;
    protected handledProps: HandledProps<RotateHandledProps>;
    render(): JSX.Element;
    private getInputClassName;
    private handleOrientationUpdate;
    private handleLandscapeClick;
    private handlePortraitClick;
}
