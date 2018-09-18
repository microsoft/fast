import * as React from "react";
import * as ReactDOM from "react-dom";
import { get } from "lodash-es";
import {
    Foundation,
    HandledProps,
    ProgressType
} from "@microsoft/fast-components-react-base";
import {
    IMSFTProgressHandledProps,
    IMSFTProgressManagedClasses,
    IMSFTProgressUnhandledProps,
    MSFTProgressProps
} from "./progress.props";
import { IManagedClasses, IMSFTProgressClassNameContract } from "@microsoft/fast-components-class-name-contracts-msft";
import { Progress as BaseProgress } from "@microsoft/fast-components-react-base";

/* tslint:disable-next-line */
class Progress extends Foundation<IMSFTProgressHandledProps & IManagedClasses<IMSFTProgressClassNameContract>,  IMSFTProgressUnhandledProps, {}> {

    public static defaultProps: Partial<IMSFTProgressHandledProps> = {
        minValue: 0,
        maxValue: 100
    };

    private static indicatorDotCount: number = 5;

    protected handledProps: HandledProps<IMSFTProgressHandledProps & IManagedClasses<IMSFTProgressClassNameContract>> = {
        children: void 0,
        value: void 0,
        minValue: void 0,
        maxValue: void 0,
        managedClasses: void 0
    };

    /**
     * Renders the component
     */
    public render(): React.ReactElement<HTMLDivElement> {
        /* tslint:disable-next-line */
        const className: string = `${this.props.managedClasses.progress_indicator} ${this.props.managedClasses.progress_indicator__determinate}`;

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
                    className={className}
                    slot={ProgressType.determinate}
                >
                    <div
                        className={this.props.managedClasses.progress_valueIndicator}
                        style={{width: `${this.props.value}%`}}
                    />
                </div>
                <div
                    slot={ProgressType.indeterminate}
                    className={this.props.managedClasses.progress_indicator}
                >
                    {this.renderIndeterminateItems()}
                </div>
            </BaseProgress>
        );
    }

    private renderIndeterminateItems(): JSX.Element[] {
        return new Array(Progress.indicatorDotCount).fill(undefined).map((item: undefined, index: number) => {
            let className: string = this.props.managedClasses.progress_dot;
            className = `${className} ${this.props.managedClasses[`progress_dot__${index + 1}`]}`;
            return (
                <span
                    className={className}
                    key={index}
                />
            );
        });
    }
}

export default Progress;
export * from "./progress.props";
export { IMSFTProgressClassNameContract };
