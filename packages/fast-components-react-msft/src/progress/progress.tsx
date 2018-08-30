import * as React from "react";
import * as ReactDOM from "react-dom";
import { get } from "lodash-es";
import { Foundation, HandledProps } from "@microsoft/fast-components-react-base";
import { IProgressManagedClasses, IProgressUnhandledProps, ProgressProps } from "./progress.props";
import { IManagedClasses, IMSFTProgressClassNameContract } from "@microsoft/fast-components-class-name-contracts-msft";
import { Progress as BaseProgress, ProgressType } from "@microsoft/fast-components-react-base";

/* tslint:disable-next-line */
class Progress extends Foundation<ProgressProps & IManagedClasses<IMSFTProgressClassNameContract>,  React.AllHTMLAttributes<HTMLElement>, {}> {
    public static defaultProps: Partial<ProgressProps> = {
        minValue: 0,
        maxValue: 100
    };

    protected handledProps: HandledProps<ProgressProps & IManagedClasses<IMSFTProgressClassNameContract>> = {
        children: void 0,
        value: void 0,
        minValue: void 0,
        maxValue: void 0,
        managedClasses: void 0,
    };

    /**
     * Renders the component
     */
    public render(): React.ReactElement<HTMLButtonElement | HTMLAnchorElement> {
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
                    className={this.props.managedClasses.progress_indicator__determinate}
                    slot={ProgressType.determinate}
                >
                    <div
                        className={this.props.managedClasses.progress_indicator__determinate_bar}
                        style={{width: `${this.props.value}%`}}
                    />
                </div>
                <div
                    slot={ProgressType.indeterminate}
                    className={this.props.managedClasses.progress_indicator__indeterminate}
                >
                    {this.renderProgressSpans(this.generateProgressSpans())}
                </div>
            </BaseProgress>
        );
    }

    public generateProgressSpans(): Array<{id: number}> {
        return [{id: 1}, {id: 2}, {id: 3}, {id: 4}, {id: 5}];
    }

    /**
     * Generate indeterminate spans
     */
    private renderProgressSpans(spanData: any[]): JSX.Element[] {
        return spanData.map((span: any, index: number) => {
            let className: string = this.props.managedClasses.progress_dot__base;
            className = `${className} ${this.props.managedClasses[`progress_dot__${span.id}`]}`;
            return (
                <span
                    className={className}
                    key={span.id}
                />
            );
        });
    }
}

export default Progress;
export * from "./progress.props";
export { IMSFTProgressClassNameContract };
