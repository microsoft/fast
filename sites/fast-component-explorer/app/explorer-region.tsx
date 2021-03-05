import React from "react";
import Explorer from "./explorer";

class ExplorerRegion extends React.Component<{}, {}> {
    public render(): React.ReactNode {
        return (
            <fast-design-system-provider use-defaults>
                <Explorer {...this.props} />
            </fast-design-system-provider>
        );
    }
}

export default ExplorerRegion;
