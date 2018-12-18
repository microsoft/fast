import React from "react";
import Example from "../components/example";

class BasicPageViewerContent extends React.Component<{}, {}> {
    public render(): JSX.Element {
        return (
            <React.Fragment>
                <Example />
            </React.Fragment>
        );
    }
}

export default BasicPageViewerContent;
