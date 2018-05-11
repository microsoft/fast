import * as React from "react";
import { Route, Switch, withRouter } from "react-router-dom";
import { RouteComponentProps } from "react-router";
import { IDevSiteDesignSystem } from "../design-system";
import manageJss, { ComponentStyles, IJSSManagerProps, IManagedClasses } from "@microsoft/fast-jss-manager-react";

/**
 * Describes the possible views for a component
 */
export enum ComponentViewTypes {
    examples,
    detail
}

export interface IComponentViewManagedClasses {
    componentView: string;
}

const style: ComponentStyles<IComponentViewManagedClasses, IDevSiteDesignSystem> = {
    componentView: {
        overflow: "auto",
        flexGrow: "1",
        width: "100%",
        display: "grid",
        gridTemplateColumns: "1fr 1fr 1fr",
    }
};

class ComponentView extends React.Component<RouteComponentProps<{}> & IManagedClasses<IComponentViewManagedClasses>, {}> {
    public render(): React.ReactElement<HTMLDivElement> {
        return (
            <div className={this.props.managedClasses.componentView}>
                <Switch>
                    <Route path="/" exact={true} component={null} />
                    <Route
                        path={this.props.match.url}
                        exact={true}
                        component={this.renderDetailPage}
                    />
                    <Route
                        path={this.props.match.url + `/${ComponentViewTypes[ComponentViewTypes.examples]}`}
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

export default manageJss(style)(withRouter(ComponentView));
