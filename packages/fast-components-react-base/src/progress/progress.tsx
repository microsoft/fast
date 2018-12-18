import React from "react";
import ReactDOM from "react-dom";
import { get } from "lodash-es";
import Foundation, { HandledProps } from "@microsoft/fast-components-foundation-react";
import {
    ProgressHandledProps,
    ProgressManagedClasses,
    ProgressProps,
    ProgressUnhandledProps,
} from "./progress.props";
import {
    ManagedClasses,
    ProgressClassNameContract,
} from "@microsoft/fast-components-class-name-contracts-base";

export enum ProgressType {
    determinate = "determinate",
    indeterminate = "indeterminate",
}

class Progress extends Foundation<ProgressHandledProps, ProgressUnhandledProps, {}> {
    public static defaultProps: Partial<ProgressProps> = {
        minValue: 0,
        maxValue: 100,
    };

    public static displayName: string = "Progress";

    protected handledProps: HandledProps<ProgressHandledProps> = {
        children: void 0,
        managedClasses: void 0,
        maxValue: void 0,
        minValue: void 0,
        value: void 0,
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
export { ProgressClassNameContract };
