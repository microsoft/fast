import React from "react";
import { ViewerContent } from "../../src";
import components from "../components";

class UpdatePropsViewerContent extends React.Component<{}, {}> {
    public render(): JSX.Element {
        return <ViewerContent components={components} />;
    }
}

export default UpdatePropsViewerContent;
