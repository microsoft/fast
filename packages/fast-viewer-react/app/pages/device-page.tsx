import React from "react";
import Viewer, {
    defaultDevices,
    Device,
    Display,
    Orientation,
    Rotate,
    SelectDevice,
} from "../../src";
import Links from "../components/links";

export interface PageState {
    height: number;
    width: number;
    activeDevice: Device;
    orientation: Orientation;
}

class BasicPage extends React.Component<{}, PageState> {
    constructor(props: {}) {
        super(props);

        this.state = {
            height: 800,
            width: 800,
            activeDevice: defaultDevices[0],
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
                        activeDeviceId={this.state.activeDevice.id}
                        jssStyleSheet={{
                            selectDevice: {
                                paddingRight: "10px",
                            },
                        }}
                    />
                    <Rotate
                        orientation={this.state.orientation}
                        onUpdateOrientation={this.handleOrientationUpdate}
                        landscapeDisabled={this.isRotateDisabled()}
                        portraitDisabled={this.isRotateDisabled()}
                    />
                </div>
                <Viewer
                    height={this.state.height}
                    width={this.state.width}
                    iframeSrc={"/device-content"}
                    responsive={this.state.activeDevice.display === Display.responsive}
                    onUpdateHeight={this.handleUpdatedHeight}
                    onUpdateWidth={this.handleUpdatedWidth}
                />
            </div>
        );
    }

    private isRotateDisabled(): boolean {
        return !!!this.state.activeDevice.width && !!!this.state.activeDevice.height;
    }

    private handleOrientationUpdate = (orientation: Orientation): void => {
        if (!this.isRotateDisabled()) {
            this.setState({
                orientation,
                width:
                    orientation === Orientation.portrait
                        ? this.state.activeDevice.width
                        : this.state.activeDevice.height,
                height:
                    orientation === Orientation.portrait
                        ? this.state.activeDevice.height
                        : this.state.activeDevice.width,
            });
        }
    };

    private handleDeviceUpdate = (deviceId: string): void => {
        const activeDevice: Device = defaultDevices.find((device: Device) => {
            return deviceId === device.id;
        });

        this.setState({
            activeDevice,
            orientation: Orientation.portrait,
            height: activeDevice.height ? activeDevice.height : this.state.height,
            width: activeDevice.width ? activeDevice.width : this.state.width,
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
