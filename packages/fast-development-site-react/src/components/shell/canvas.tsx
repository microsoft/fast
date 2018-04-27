import * as React from "react";
import manageJss, { ComponentStyles, IJSSManagerProps, IManagedClasses } from "@microsoft/fast-jss-manager-react";
import { IDevSiteDesignSystem } from "../design-system";
import { ComponentView } from "../site";
import { Route, withRouter } from "react-router-dom";
import { RouteComponentProps } from "react-router";

/* tslint:disable-next-line */
interface ICanvasHeaderProps extends RouteComponentProps<any> { }

export interface IShellCanvasManagedClasses {
    shellCanvas: string;
}

const style: ComponentStyles<IShellCanvasManagedClasses, IDevSiteDesignSystem> = {
    shellCanvas: {
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
            <div className={this.props.managedClasses.shellCanvas}>
                {this.props.children}
            </div>
        );
    }
}

export { ICanvasHeaderProps };
export default withRouter(manageJss(style)(ShellCanvas));
