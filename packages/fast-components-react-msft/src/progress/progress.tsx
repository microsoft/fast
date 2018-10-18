import * as React from "react";
import * as ReactDOM from "react-dom";
import { get } from "lodash-es";
import Foundation, { HandledProps } from "@microsoft/fast-components-foundation-react";
import { ProgressType } from "@microsoft/fast-components-react-base";
import {
    ProgressHandledProps,
    ProgressManagedClasses,
    ProgressProps,
    ProgressUnhandledProps,
} from "./progress.props";
import {
    ManagedClasses,
    ProgressClassNameContract,
} from "@microsoft/fast-components-class-name-contracts-msft";
import { Progress as BaseProgress } from "@microsoft/fast-components-react-base";

class Progress extends Foundation<ProgressHandledProps, ProgressUnhandledProps, {}> {
    public static defaultProps: Partial<ProgressProps> = {
        minValue: 0,
        maxValue: 100,
    };

    public static displayName: string = "Progress";

    private static indicatorDotCount: number = 5;

    protected handledProps: HandledProps<ProgressHandledProps> = {
        children: void 0,
        value: void 0,
        minValue: void 0,
        maxValue: void 0,
        managedClasses: void 0,
    };

    /**
     * Renders the component
     */
    public render(): React.ReactElement<HTMLDivElement> {
        return (
            <BaseProgress
                {...this.unhandledProps()}
                className={this.generateClassNames()}
                managedClasses={this.props.managedClasses}
                value={this.props.value}
                minValue={this.props.minValue}
                maxValue={this.props.maxValue}
            >
                <div
                    className={this.progressIndicatorClasses()}
                    slot={ProgressType.determinate}
                >
                    <div
                        className={get(
                            this.props,
                            "managedClasses.progress_valueIndicator"
                        )}
                        style={{ width: `${this.props.value}%` }}
                    />
                </div>
                <div
                    slot={ProgressType.indeterminate}
                    className={get(this.props, "managedClasses.progress_indicator")}
                >
                    {this.renderIndeterminateItems()}
                </div>
            </BaseProgress>
        );
    }

    private progressIndicatorClasses(): string {
        return [
            get(this.props, "managedClasses.progress_indicator"),
            get(this.props, "managedClasses.progress_indicator__determinate"),
        ].join(" ");
    }

    private renderIndeterminateItems(): JSX.Element[] {
        return new Array(Progress.indicatorDotCount)
            .fill(undefined)
            .map((item: undefined, index: number) => {
                let className: string = get(this.props, "managedClasses.progress_dot");
                className = `${className} ${get(
                    this.props,
                    `managedClasses.progress_dot__${index + 1}`
                )}`;

                return <span className={className} key={index} />;
            });
    }
}

export default Progress;
export * from "./progress.props";
export { ProgressClassNameContract };
