import * as React from "react";
import Viewer, {
    defaultDevices,
    Display,
    Orientation,
    Rotate,
    SelectDevice,
} from "../../src";
import Links from "../components/links";

export interface PageState {
    height: number;
    width: number;
    activeDeviceIndex: number;
    orientation: Orientation;
}

class BasicPage extends React.Component<{}, PageState> {
    constructor(props: {}) {
        super(props);

        this.state = {
            height: 800,
            width: 800,
            activeDeviceIndex: 0,
            orientation: Orientation.portrait,
        };
    }

    public render(): JSX.Element {
        return (
            <div style={{ width: "100%", height: "calc(100vh - 200px)" }}>
                <Links />
                <div style={{ margin: "10px 0" }}>
                    <SelectDevice
                        devices={defaultDevices}
                        onUpdateDevice={this.handleDeviceUpdate}
                        activeIndex={this.state.activeDeviceIndex}
                        jssStyleSheet={{
                            selectDevice: {
                                paddingRight: "10px",
                            },
                        }}
                    />
                    <Rotate
                        orientation={this.state.orientation}
                        onUpdateOrientation={this.handleOrientationUpdate}
                    />
                </div>
                <Viewer
                    height={this.state.height}
                    width={this.state.width}
                    iframeSrc={"/device-content"}
                    responsive={
                        defaultDevices[this.state.activeDeviceIndex].display ===
                        Display.responsive
                    }
                    onUpdateHeight={this.handleUpdatedHeight}
                    onUpdateWidth={this.handleUpdatedWidth}
                />
            </div>
        );
    }

    private handleOrientationUpdate = (orientation: Orientation): void => {
        this.setState({
            orientation,
            width:
                orientation === Orientation.portrait
                    ? defaultDevices[this.state.activeDeviceIndex].width
                    : defaultDevices[this.state.activeDeviceIndex].height,
            height:
                orientation === Orientation.portrait
                    ? defaultDevices[this.state.activeDeviceIndex].height
                    : defaultDevices[this.state.activeDeviceIndex].width,
        });
    };

    private handleDeviceUpdate = (index: number): void => {
        this.setState({
            activeDeviceIndex: index,
            orientation: Orientation.portrait,
            height: defaultDevices[index].height
                ? defaultDevices[index].height
                : this.state.height,
            width: defaultDevices[index].width
                ? defaultDevices[index].width
                : this.state.width,
        });
    };

    private handleUpdatedHeight = (height: number): void => {
        this.setState({
            height,
        });
    };

    private handleUpdatedWidth = (width: number): void => {
        this.setState({
            width,
        });
    };
}

export default BasicPage;
