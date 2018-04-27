import * as React from "react";
import manageJss, { ComponentStyles, IJSSManagerProps, IManagedClasses } from "@microsoft/fast-jss-manager-react";
import { IDevSiteDesignSystem } from "../design-system";
import { ComponentView } from "../site";
import { Route, Switch, withRouter } from "react-router-dom";
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
            <div className={this.props.managedClasses.shell_canvas}>
                <Switch>
                    <Route path={this.props.match.url} exact={true} component={this.renderDetailPage} />
                    <Route
                        path={this.props.match.url + `/${ComponentView[ComponentView.examples]}`}
                        exact={true}
                        component={this.renderExamplesPage}
                    />
                </Switch>
            </div>
        );
    }

    private renderDetailPage = (): React.ReactElement<HTMLElement> => {
        return (
            <h1>Detail</h1>
        );
    }

    private renderExamplesPage = (): React.ReactNode => {
        return (
            <React.Fragment>
                {this.props.children}
            </React.Fragment>
        );
    }
}

export { ICanvasHeaderProps };
export default withRouter(manageJss(style)(ShellCanvas));
