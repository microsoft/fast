import * as React from "react";
import * as ReactDOM from "react-dom";
import { get } from "lodash-es";
import Foundation, { HandledProps } from "../foundation";
import { IProgressHandledProps, IProgressManagedClasses, IProgressUnhandledProps } from "./progress.props";
import { IManagedClasses, IProgressClassNameContract } from "@microsoft/fast-components-class-name-contracts-base";

export enum ProgressType {
    determinate = "determinate",
    indeterminate = "indeterminate"
}

/* tslint:disable-next-line */
class Progress extends Foundation<IProgressHandledProps & IManagedClasses<IProgressClassNameContract>, React.HTMLAttributes<HTMLDivElement>, {}> {

    public static defaultProps: Partial<IProgressHandledProps> = {
        minValue: 0,
        maxValue: 100
    };

    protected handledProps: HandledProps<IProgressHandledProps & IManagedClasses<IProgressClassNameContract>> = {
        children: void 0,
        managedClasses: void 0,
        maxValue: void 0,
        minValue: void 0,
        value: void 0
    };

    /**
     * Renders the component
     */
    public render(): React.ReactElement<HTMLDivElement> {
        return (
            <div
                {...this.unhandledProps()}
                className={this.generateClassNames()}
                role="progressbar"
                aria-valuenow={this.props.value}
                aria-valuemin={this.props.minValue}
                aria-valuemax={this.props.maxValue}
            >
                {this.renderChildren()}
            </div>
        );
    }

    /**
     * Generates class names
     */
    protected generateClassNames(): string {
        return super.generateClassNames(get(this.props, "managedClasses.progress"));
    }

    /**
     * Renders children based on value prop
     */
    private renderChildren(): React.ReactNode {
        return this.props.value !== undefined
            ? this.withSlot(ProgressType.determinate)
            : this.withSlot(ProgressType.indeterminate);
    }
}

export default Progress;
export * from "./progress.props";
export { IProgressClassNameContract };
