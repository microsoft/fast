import * as React from "react";
import manageJss, { IManagedClasses, ComponentStyles } from "@microsoft/fast-jss-manager-react";
import {IDevSiteDesignSystem} from "../design-system";

/* tslint:disable-next-line */
interface ICanvasHeaderProps { }

export interface IShellCanvasManagedClasses {
    shell__canvas: string;
}

const style: ComponentStyles<IShellCanvasManagedClasses, IDevSiteDesignSystem> = {
    shell__canvas: {
        display: "inline-block",
        background: (config: IDevSiteDesignSystem): string => {
            return config.backgroundColor;
        },
        flexGrow: "2"
    }
};

class ShellCanvas extends React.Component<ICanvasHeaderProps & IManagedClasses<IShellCanvasManagedClasses>, {}> {

    public render(): JSX.Element {
        return (
            <div className={this.props.managedClasses.shell__canvas}>
                {this.props.children}
            </div>
        );
    }
}

export { ICanvasHeaderProps };
export default manageJss(style)(ShellCanvas);
