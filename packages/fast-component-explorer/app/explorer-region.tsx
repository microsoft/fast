import React from "react";
import { DesignSystemProvider } from "@microsoft/fast-jss-manager-react";
import {
    DesignSystem,
    DesignSystemDefaults,
} from "@microsoft/fast-components-styles-msft";
import Explorer from "./explorer";

const creatorDesignSystem: DesignSystem = Object.assign({}, DesignSystemDefaults, {
    density: -2,
    backgroundColor:
        DesignSystemDefaults.neutralPalette[
            DesignSystemDefaults.neutralPalette.length - 1
        ],
});

class ExplorerRegion extends React.Component<{}, {}> {
    public render(): React.ReactNode {
        return (
            <DesignSystemProvider designSystem={creatorDesignSystem}>
                <Explorer {...this.props} />
            </DesignSystemProvider>
        );
    }
}

export default ExplorerRegion;
