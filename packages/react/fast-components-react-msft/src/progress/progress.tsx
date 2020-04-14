import { ProgressClassNameContract } from "@microsoft/fast-components-class-name-contracts-msft";
import Foundation, { HandledProps } from "@microsoft/fast-components-foundation-react";
import {
    Progress as BaseProgress,
    ProgressType,
} from "@microsoft/fast-components-react-base";
import { classNames } from "@microsoft/fast-web-utilities";
import React from "react";
import { DisplayNamePrefix } from "../utilities";
import {
    ProgressHandledProps,
    ProgressProps,
    ProgressSize,
    ProgressUnhandledProps,
} from "./progress.props";

class Progress extends Foundation<ProgressHandledProps, ProgressUnhandledProps, {}> {
    public static defaultProps: Partial<ProgressProps> = {
        minValue: 0,
        maxValue: 100,
        circular: false,
        paused: false,
        size: ProgressSize.container,
        managedClasses: {},
    };

    public static displayName: string = `${DisplayNamePrefix}Progress`;

    private static indicatorCount: number = 2;

    protected handledProps: HandledProps<ProgressHandledProps> = {
        children: void 0,
        value: void 0,
        minValue: void 0,
        maxValue: void 0,
        managedClasses: void 0,
        circular: void 0,
        paused: void 0,
        size: void 0,
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
                {this.renderProgress()}
            </BaseProgress>
        );
    }

    /**
     * Create class names
     */
    protected generateClassNames(): string {
        const {
            progress,
            progress__circular,
            progress__paused,
        }: Partial<ProgressClassNameContract> = this.props.managedClasses;

        return super.generateClassNames(
            classNames(
                progress,
                [progress__circular, this.props.circular],
                [progress__paused, this.props.paused]
            )
        );
    }

    private generateCircularValueIndicatorClassNames(): string {
        const {
            progress_valueIndicator,
            progress_valueIndicator__indeterminate,
        }: Partial<ProgressClassNameContract> = this.props.managedClasses;

        return classNames(progress_valueIndicator, [
            progress_valueIndicator__indeterminate,
            !this.props.value,
        ]);
    }

    private generateSVGClassNames(): string {
        return classNames(
            this.props.managedClasses[`progress_circularSVG__${this.props.size}`]
        );
    }

    private progressIndicatorClasses(): string {
        const {
            progress_indicator,
            progress_indicator__determinate,
        }: Partial<ProgressClassNameContract> = this.props.managedClasses;

        return classNames(progress_indicator, progress_indicator__determinate);
    }

    private renderIndeterminateItems(): JSX.Element[] {
        const managedClasses: Partial<ProgressClassNameContract> = this.props
            .managedClasses;
        const dotClass: string = managedClasses.progress_dot;
        return new Array(Progress.indicatorCount)
            .fill(undefined)
            .map((item: undefined, index: number) => {
                return (
                    <span
                        className={classNames(
                            dotClass,
                            managedClasses[`progress_dot__${index + 1}`]
                        )}
                        key={index}
                    />
                );
            });
    }

    private renderCircle(className: string, style?: React.CSSProperties): JSX.Element {
        return <circle className={className} style={style} cx="8px" cy="8px" r="7px" />;
    }

    private renderCircularBackground(): JSX.Element {
        return this.renderCircle(
            classNames(this.props.managedClasses.progress_indicator)
        );
    }

    private renderProgress(): React.ReactFragment {
        const {
            progress_valueIndicator,
            progress_indicator,
        }: Partial<ProgressClassNameContract> = this.props.managedClasses;

        if (this.props.circular) {
            const strokeValue: number = (44 * this.props.value) / 100;
            return [
                <div slot={ProgressType.determinate} key="0">
                    <svg className={this.generateSVGClassNames()} viewBox="0 0 16 16">
                        {this.renderCircularBackground()}
                        {this.renderCircle(
                            this.generateCircularValueIndicatorClassNames(),
                            { strokeDasharray: `${strokeValue}px 44px` }
                        )}
                    </svg>
                </div>,
                <div slot={ProgressType.indeterminate} key="1">
                    <svg className={this.generateSVGClassNames()} viewBox="0 0 16 16">
                        {this.renderCircularBackground()}
                        {this.renderCircle(
                            this.generateCircularValueIndicatorClassNames()
                        )}
                    </svg>
                </div>,
            ];
        }

        return [
            <div
                className={this.progressIndicatorClasses()}
                slot={ProgressType.determinate}
                key="0"
            >
                <div
                    className={classNames(progress_valueIndicator)}
                    style={{ width: `${this.props.value}%` }}
                />
            </div>,
            <div
                slot={ProgressType.indeterminate}
                className={classNames(progress_indicator)}
                key="1"
            >
                {this.renderIndeterminateItems()}
            </div>,
        ];
    }
}

export default Progress;
export * from "./progress.props";
export { ProgressClassNameContract };
