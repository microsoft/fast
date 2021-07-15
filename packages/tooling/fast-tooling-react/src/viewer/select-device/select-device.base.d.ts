/// <reference types="react" />
import Foundation, { HandledProps } from "@microsoft/fast-components-foundation-react";
import { SelectDeviceProps } from "./select-device.props";
export declare class SelectDevice extends Foundation<SelectDeviceProps, {}, {}> {
    static displayName: string;
    protected handledProps: HandledProps<SelectDeviceProps>;
    render(): JSX.Element;
    private renderLabel;
    private renderOptions;
    private handleOnChange;
}
