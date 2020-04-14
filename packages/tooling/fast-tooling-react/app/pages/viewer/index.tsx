import React from "react";
import { MessageSystem, MessageSystemType } from "@microsoft/fast-tooling";
import {
    defaultDevices,
    Device,
    Display,
    Orientation,
    Rotate,
    SelectDevice,
    Viewer,
} from "../../../src";

export interface PageState {
    height: number;
    width: number;
    activeDevice: Device;
    orientation: Orientation;
    inputValue: string;
}

let fastMessageSystem: MessageSystem;

class ViewerPage extends React.Component<{}, PageState> {
    constructor(props: {}) {
        super(props);

        if ((window as any).Worker) {
            fastMessageSystem = new MessageSystem({
                webWorker: "message-system.js",
                dataDictionary: [
                    {
                        "": {
                            schemaId: "foo",
                            data: {},
                        },
                    },
                    "",
                ],
                schemaDictionary: {
                    foo: {
                        type: "object",
                        properties: {},
                    },
                },
            });
            fastMessageSystem.add({ onMessage: this.handleMessageSystem });
        }

        this.state = {
            height: 800,
            width: 800,
            activeDevice: defaultDevices[0],
            orientation: Orientation.portrait,
            inputValue: "",
        };
    }

    public render(): JSX.Element {
        return (
            <div style={{ width: "100%", height: "calc(100vh - 200px)" }}>
                <div style={{ margin: "10px 0" }}>
                    <input
                        type="text"
                        onChange={this.handleInputUpdate}
                        value={this.state.inputValue}
                    />
                    <br />
                    <br />
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
                    iframeSrc={"/viewer/content"}
                    responsive={this.state.activeDevice.display === Display.responsive}
                    onUpdateHeight={this.handleUpdatedHeight}
                    onUpdateWidth={this.handleUpdatedWidth}
                    messageSystem={fastMessageSystem}
                />
            </div>
        );
    }

    private isRotateDisabled(): boolean {
        return !!!this.state.activeDevice.width && !!!this.state.activeDevice.height;
    }

    private handleMessageSystem = (e: MessageEvent): void => {
        if (e.data.type === MessageSystemType.custom) {
            this.setState({
                inputValue: e.data.value,
            });
        }
    };

    private handleInputUpdate = (e: React.ChangeEvent<HTMLInputElement>): void => {
        fastMessageSystem.postMessage({
            type: MessageSystemType.custom,
            value: e.target.value,
        } as any);
    };

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

export default ViewerPage;
