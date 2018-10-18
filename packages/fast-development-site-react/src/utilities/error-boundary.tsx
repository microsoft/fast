import * as React from "react";
import { toPx } from "@microsoft/fast-jss-utilities";
import { DevSiteDesignSystem } from "../../src/components/design-system";
import manageJss, {
    ComponentStyles,
    ManagedClasses,
    ManagedJSSProps
} from "@microsoft/fast-jss-manager-react";

/* tslint:disable:no-empty-interface */
export interface ErrorBoundaryProps {}
/* tslint:enable:no-empty-interface */

export interface ErrorBoundaryState {
    hasError: boolean;
    error: Error | null | undefined;
}

export interface ErrorBoundaryManagedClasses {
    errorBoundary: string;
    errorBoundary_error: string;
    errorBoundary_notification: string;
}

const styles: ComponentStyles<ErrorBoundaryManagedClasses, DevSiteDesignSystem> = {
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

class ErrorBoundary extends React.Component<
    ErrorBoundaryProps & ManagedClasses<ErrorBoundaryManagedClasses>,
    ErrorBoundaryState
> {
    constructor(props: ErrorBoundaryProps & ManagedClasses<ErrorBoundaryManagedClasses>) {
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
                    <p className={this.props.managedClasses.errorBoundary_notification}>
                        Something went wrong.
                    </p>
                    <p className={this.props.managedClasses.errorBoundary_error}>{`${
                        this.state.error
                    }`}</p>
                </div>
            );
        }

        return this.props.children;
    }
}

export default manageJss(styles)(ErrorBoundary);
