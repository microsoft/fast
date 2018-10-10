import * as React from "react";
import Example from "../components/example";

class DevicePageViewerContent extends React.Component<{}, {}> {
    public render(): JSX.Element {
        return (
            <React.Fragment>
                <Example />
            </React.Fragment>
        );
    }
}

export default DevicePageViewerContent;
