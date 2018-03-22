import * as React from "react";
import manageJss, { IInjectedProps, ComponentStyles } from "@microsoft/fast-react-jss-manager";
import {IDevSiteDesignSystem} from "../design-system";

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
        textAlign: "center",
        padding: "12px",
        minHeight: "24px"
    }
};

class ShellHeader extends React.Component<IShellHeaderProps & IInjectedProps<IShellHeaderManagedClasses>, {}> {

    public render(): JSX.Element {
        return (
            <div className={this.props.managedClasses.shell__header}>
                {this.props.children}
            </div>
        );
    }
}
export default manageJss(style)(ShellHeader);
