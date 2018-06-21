import * as React from "react";
import manageJss, { ComponentStyles, IJSSManagerProps, IManagedClasses } from "@microsoft/fast-jss-manager-react";
import { toPx } from "@microsoft/fast-jss-utilities";
import { IDevSiteDesignSystem } from "../design-system";
import { IRowManagedClasses, Pane, Row } from "@microsoft/fast-layouts-react";

class ShellHeader extends React.Component<{}, {}> {
    private rowStyles: ComponentStyles<IRowManagedClasses, IDevSiteDesignSystem> = {
        row: {
            background: "#343434",
            alignItems: "center",
            color: (config: IDevSiteDesignSystem): string => {
                return config.backgroundColor;
            },
            textAlign: "left",
            padding: toPx(3),
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
