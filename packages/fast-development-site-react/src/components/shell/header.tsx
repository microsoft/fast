import * as React from "react";
import manageJss, { ComponentStyles, IJSSManagerProps, IManagedClasses } from "@microsoft/fast-jss-manager-react";
import { toPx } from "@microsoft/fast-jss-utilities";
import { IDevSiteDesignSystem } from "../design-system";

/* tslint:disable-next-line */
export interface IShellHeaderProps { }

export interface IShellHeaderManagedClasses {
    shellHeader: string;
}

const style: ComponentStyles<IShellHeaderManagedClasses, IDevSiteDesignSystem> = {
    shellHeader: {
        background: "#343434",
        color: (config: IDevSiteDesignSystem): string => {
            return config.backgroundColor;
        },
        textAlign: "left",
        padding: toPx(3),
        minHeight: toPx(24),
        overflow: "hidden"
    }
};

class ShellHeader extends React.Component<IShellHeaderProps & IManagedClasses<IShellHeaderManagedClasses>, {}> {

    public render(): JSX.Element {
        return (
            <div className={this.props.managedClasses.shellHeader}>
                {this.props.children}
            </div>
        );
    }
}
export default manageJss(style)(ShellHeader);
