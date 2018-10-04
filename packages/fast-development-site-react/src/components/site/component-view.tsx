import * as React from "react";
import { Route, Switch, withRouter } from "react-router-dom";
import { RouteComponentProps } from "react-router";
import { IDevSiteDesignSystem } from "../design-system";
import { toPx } from "@microsoft/fast-jss-utilities";
import manageJss, { ComponentStyles, ManagedJSSProps, IManagedClasses } from "@microsoft/fast-jss-manager-react";

/**
 * Describes the possible views for a component
 */
export enum ComponentViewTypes {
    examples,
    detail
}

export interface IComponentViewManagedClasses {
    componentExampleView: string;
    componentDetailView: string;
}

export interface IComponentViewProps extends RouteComponentProps<{}> {
    viewType: ComponentViewTypes;
}

const style: ComponentStyles<IComponentViewManagedClasses, IDevSiteDesignSystem> = {
    componentExampleView: {
        overflow: "auto",
        flexGrow: "1",
        width: "100%",
        display: "grid",
        gridTemplateColumns: "1fr 1fr 1fr",
    },
    componentDetailView: {
        overflow: "auto",
        flexGrow: "1"
    }
};

class ComponentView extends React.Component<IComponentViewProps & IManagedClasses<IComponentViewManagedClasses>, {}> {
    public render(): React.ReactElement<HTMLDivElement> {
        return (
            <div className={this.getClassName()}>
                <Switch>
                    <Route path="/" exact={true} component={null} />
                    <Route
                        path={this.props.match.url}
                        exact={true}
                        component={this.renderView}
                    />
                    <Route
                        path={`${this.props.match.url}/${ComponentViewTypes[ComponentViewTypes.examples]}`}
                        exact={true}
                        component={this.renderView}
                    />
                </Switch>
            </div>
        );
    }

    private getClassName(): string {
        return this.props.viewType === ComponentViewTypes.examples
            ? this.props.managedClasses.componentExampleView
            : this.props.managedClasses.componentDetailView;
    }

    private renderView = (): React.ReactElement<HTMLElement> => {
        return (
            <React.Fragment>
                {this.props.children}
            </React.Fragment>
        );
    }
}

export default manageJss(style)(withRouter(ComponentView));
