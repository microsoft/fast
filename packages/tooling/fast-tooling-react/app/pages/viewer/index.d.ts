import React from "react";
import { Device, Orientation } from "../../../src";
export interface PageState {
    height: number;
    width: number;
    activeDevice: Device;
    orientation: Orientation;
    inputValue: string;
}
declare class ViewerPage extends React.Component<{}, PageState> {
    constructor(props: {});
    render(): JSX.Element;
    private isRotateDisabled;
    private handleMessageSystem;
    private handleInputUpdate;
    private handleOrientationUpdate;
    private handleDeviceUpdate;
    private handleUpdatedHeight;
    private handleUpdatedWidth;
}
export default ViewerPage;
