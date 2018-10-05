import * as React from "react";
import manageJss, { ComponentStyles, ManagedClasses, ManagedJSSProps } from "@microsoft/fast-jss-manager-react";
import { toPx } from "@microsoft/fast-jss-utilities";
import { DevSiteDesignSystem } from "../design-system";
import { Pane, Row, RowManagedClasses } from "@microsoft/fast-layouts-react";

class ShellHeader extends React.Component<{}, {}> {
    private rowStyles: Partial<ComponentStyles<RowManagedClasses, DevSiteDesignSystem>> = {
        row: {
            background: "#343434",
            alignItems: "center",
            color: (config: DevSiteDesignSystem): string => {
                return config.backgroundColor;
            },
            textAlign: "left",
            minHeight: toPx(34)
        }
    };

    public render(): JSX.Element {
        return (
            <Row jssStyleSheet={this.rowStyles}>
                {this.props.children}
            </Row>
        );
    }
}
export default ShellHeader;
