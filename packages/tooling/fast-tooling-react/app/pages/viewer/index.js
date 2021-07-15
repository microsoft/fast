import React from "react";
import { MessageSystem, MessageSystemType } from "@microsoft/fast-tooling";
import {
    defaultDevices,
    Display,
    Orientation,
    Rotate,
    SelectDevice,
    Viewer,
} from "../../../src";
let fastMessageSystem;
class ViewerPage extends React.Component {
    constructor(props) {
        super(props);
        this.handleMessageSystem = e => {
            if (e.data.type === MessageSystemType.custom) {
                this.setState({
                    inputValue: e.data.value,
                });
            }
        };
        this.handleInputUpdate = e => {
            fastMessageSystem.postMessage({
                type: MessageSystemType.custom,
                value: e.target.value,
            });
        };
        this.handleOrientationUpdate = orientation => {
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
        this.handleDeviceUpdate = deviceId => {
            const activeDevice = defaultDevices.find(device => {
                return deviceId === device.id;
            });
            this.setState({
                activeDevice,
                orientation: Orientation.portrait,
                height: activeDevice.height ? activeDevice.height : this.state.height,
                width: activeDevice.width ? activeDevice.width : this.state.width,
            });
        };
        this.handleUpdatedHeight = height => {
            this.setState({
                height,
            });
        };
        this.handleUpdatedWidth = width => {
            this.setState({
                width,
            });
        };
        if (window.Worker) {
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
    render() {
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
    isRotateDisabled() {
        return !!!this.state.activeDevice.width && !!!this.state.activeDevice.height;
    }
}
export default ViewerPage;
