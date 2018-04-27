import * as React from "react";
import manageJss, { ComponentStyles, IJSSManagerProps, IManagedClasses } from "@microsoft/fast-jss-manager-react";
import { toPx } from "@microsoft/fast-jss-utilities";
import { IDevSiteDesignSystem } from "../design-system";
import { withRouter } from "react-router-dom";
import { RouteComponentProps } from "react-router";
import { ComponentView } from "../site";

/* tslint:disable-next-line */
export interface IShellActionBarProps extends RouteComponentProps<any> {
    componentView: ComponentView;
}

export interface IShellActionBarManagedClasses {
    shellActionBar: string;
}

const style: ComponentStyles<IShellActionBarManagedClasses, IDevSiteDesignSystem> = {
    shellActionBar: {
        background: (config: IDevSiteDesignSystem): string => {
            return config.backgroundColor;
        },
        padding: (config: IDevSiteDesignSystem): string => {
            return toPx(config.navigationBarHeight / 4);
        },
        minHeight: (config: IDevSiteDesignSystem): string => {
            return toPx(config.navigationBarHeight / 2);
        }
    }
};

class ShellActionBar extends React.Component<IShellActionBarProps & IManagedClasses<IShellActionBarManagedClasses>, {}> {
    public render(): JSX.Element {
        return (
            <div className={this.props.managedClasses.shell_actionBar}>
                <button>View examples</button>
                <button>View detail</button>
            </div>
        );
    }
}

export default withRouter(manageJss(style)(ShellActionBar));
