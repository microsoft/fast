import * as React from "react";
import { toPx } from "@microsoft/fast-jss-utilities";
import { IDevSiteDesignSystem } from "../../src/components/design-system";
import manageJss, { ComponentStyles, IJSSManagerProps, IManagedClasses } from "@microsoft/fast-jss-manager-react";

/*tslint:disable:no-empty-interface*/
export interface IErrorBoundaryProps {}
/*tslint:disable:no-empty-interface*/

export interface IErrorBoundaryState {
    hasError: boolean;
    error: Error | null | undefined;
}

export interface IErrorBoundaryManagedClasses {
    errorBoundary: string;
    errorBoundary_error: string;
    errorBoundary_notification: string;
}

const styles: ComponentStyles<IErrorBoundaryManagedClasses, IDevSiteDesignSystem> = {
    errorBoundary: {
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        height: "100%"
    },
    errorBoundary_error: {
        fontSize: toPx(15),
        marginTop: "0",
        color: "red"
    },
    errorBoundary_notification: {
        fontSize: toPx(18),
        fontWeight: "700"
    }
};

class ErrorBoundary extends React.Component<IErrorBoundaryProps & IManagedClasses<IErrorBoundaryManagedClasses>, IErrorBoundaryState> {
    constructor(props: IErrorBoundaryProps & IManagedClasses<IErrorBoundaryManagedClasses>) {
        super(props);

        this.state = {
            hasError: false,
            error: void 0
        };
    }

    public componentDidCatch(error: Error | null | undefined, info: object): void {
        const MISSING_ERROR: string = "Error was swallowed during propagation.";

        this.setState({
            hasError: true,
            error: error || new Error(MISSING_ERROR)
        });
    }

    public render(): React.ReactNode | React.ReactNode[] {
        if (this.state.hasError && this.state.error) {
            return (
                <div className={this.props.managedClasses.errorBoundary}>
                    <p className={this.props.managedClasses.errorBoundary_notification}>Something went wrong.</p>
                    <p className={this.props.managedClasses.errorBoundary_error}>{`${this.state.error}`}</p>
                </div>
            );
        }

        return this.props.children;
    }
}

export default manageJss(styles)(ErrorBoundary);
