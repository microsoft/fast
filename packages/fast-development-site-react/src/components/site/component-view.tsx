import React from "react";
import { Route, Switch, withRouter } from "react-router-dom";
import { RouteComponentProps } from "react-router";
import devSiteDesignSystemDefaults, { DevSiteDesignSystem } from "../design-system";
import { applyScrollbarStyle } from "../../utilities";
import manageJss, {
    ComponentStyles,
    ManagedClasses,
    ManagedJSSProps,
} from "@microsoft/fast-jss-manager-react";

/**
 * Describes the possible views for a component
 */
export enum ComponentViewTypes {
    examples,
    detail,
}

export interface ComponentViewManagedClasses {
    componentExampleView: string;
    componentDetailView: string;
}

export interface ComponentViewProps extends RouteComponentProps<{}> {
    viewType: ComponentViewTypes;
}

const style: ComponentStyles<ComponentViewManagedClasses, DevSiteDesignSystem> = {
    componentExampleView: {
        overflow: "auto",
        flexGrow: "1",
        width: "100%",
        display: "grid",
        gridTemplateColumns: "1fr 1fr 1fr",
        backgroundColor: (config: DevSiteDesignSystem): string => {
            return config.backgroundColor || devSiteDesignSystemDefaults.backgroundColor;
        },
        ...applyScrollbarStyle(),
    },
    componentDetailView: {
        overflow: "auto",
        flexGrow: "1",
        background: (config: DevSiteDesignSystem): string => {
            return config.background100 || devSiteDesignSystemDefaults.background100;
        },
        color: (config: DevSiteDesignSystem): string => {
            return config.foreground300 || devSiteDesignSystemDefaults.foreground300;
        },
        ...applyScrollbarStyle(),
    },
};

class ComponentView extends React.Component<
    ComponentViewProps & ManagedClasses<ComponentViewManagedClasses>,
    {}
> {
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
                        path={`${this.props.match.url}/${
                            ComponentViewTypes[ComponentViewTypes.examples]
                        }`}
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
        return <React.Fragment>{this.props.children}</React.Fragment>;
    };
}

export default manageJss(style)(withRouter(ComponentView));
