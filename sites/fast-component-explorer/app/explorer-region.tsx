import React from "react";
import Explorer from "./explorer";

class ExplorerRegion extends React.Component<{}, {}> {
    public render(): React.ReactNode {
        return <Explorer {...this.props} />;
    }
}

export default ExplorerRegion;
