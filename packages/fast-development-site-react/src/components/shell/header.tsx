import * as React from "react";
import manageJss, { ComponentStyles, IJSSManagerProps, IManagedClasses } from "@microsoft/fast-jss-manager-react";
import { IDevSiteDesignSystem } from "../design-system";

/* tslint:disable-next-line */
export interface IShellHeaderProps { }

export interface IShellHeaderManagedClasses {
    shell__header: string;
}

const style: ComponentStyles<IShellHeaderManagedClasses, IDevSiteDesignSystem> = {
    shell__header: {
        background: (config: IDevSiteDesignSystem): string => {
            return config.brandColor;
        },
        color: (config: IDevSiteDesignSystem): string => {
            return config.backgroundColor;
        },
        textAlign: "left",
        padding: "3px",
        minHeight: "24px",
        overflow: "hidden"
    }
};

class ShellHeader extends React.Component<IShellHeaderProps & IManagedClasses<IShellHeaderManagedClasses>, {}> {

    public render(): JSX.Element {
        return (
            <div className={this.props.managedClasses.shell__header}>
                {this.props.children}
            </div>
        );
    }
}
export default manageJss(style)(ShellHeader);
