import * as React from "react";
import { Route, Switch, withRouter } from "react-router-dom";
import { RouteComponentProps } from "react-router";

/**
 * Describes the possible views for a component
 */
export enum ComponentViewTypes {
    examples,
    detail
}

class ComponentView extends React.Component<RouteComponentProps<any>, {}> {
    public render(): React.ReactElement<HTMLDivElement> {
        return (
            <div>
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

export default withRouter(ComponentView);
