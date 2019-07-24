import React from "react";
import { get } from "lodash-es";
import Foundation, { HandledProps } from "@microsoft/fast-components-foundation-react";
import { ProgressType } from "@microsoft/fast-components-react-base";
import {
    ProgressHandledProps,
    ProgressProps,
    ProgressSize,
    ProgressUnhandledProps,
} from "./progress.props";
import { ProgressClassNameContract } from "@microsoft/fast-components-class-name-contracts-msft";
import { Progress as BaseProgress } from "@microsoft/fast-components-react-base";
import { DisplayNamePrefix } from "../utilities";
import { toPx } from "@microsoft/fast-jss-utilities";

class Progress extends Foundation<ProgressHandledProps, ProgressUnhandledProps, {}> {
    public static defaultProps: Partial<ProgressProps> = {
        minValue: 0,
        maxValue: 100,
        circular: false,
        size: ProgressSize.container,
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
        let className: string = get(this.props.managedClasses, "progress", "");

        if (this.props.circular) {
            className = get(this.props.managedClasses, "progress__circular", "");
        }

        return super.generateClassNames(className);
    }

    private generateCircularValueIndicatorClassNames(): string {
        let className: string = get(
            this.props.managedClasses,
            "progress_valueIndicator",
            ""
        );

        if (!this.props.value) {
            className = `${className} ${get(
                this.props.managedClasses,
                "progress_valueIndicator__indeterminate",
                ""
            )}`;
        }

        return className;
    }

    private generateSVGClassNames(): string {
        const className: string = this.props.size
            ? get(
                  this.props.managedClasses,
                  `progress_circularSVG__${this.props.size}`,
                  ""
              )
            : get(this.props.managedClasses, "progress_circularSVG__container", "");

        return className;
    }

    private progressIndicatorClasses(): string {
        return [
            get(this.props.managedClasses, "progress_indicator"),
            get(this.props.managedClasses, "progress_indicator__determinate"),
        ].join(" ");
    }

    private renderIndeterminateItems(): JSX.Element[] {
        return new Array(Progress.indicatorCount)
            .fill(undefined)
            .map((item: undefined, index: number) => {
                let className: string = get(this.props.managedClasses, "progress_dot");
                className = `${className} ${get(
                    this.props.managedClasses,
                    `progress_dot__${index + 1}`
                )}`;

                return <span className={className} key={index} />;
            });
    }

    private renderCircle(className: string, style?: React.CSSProperties): JSX.Element {
        return <circle className={className} style={style} cx="8px" cy="8px" r="7px" />;
    }

    private renderCircularBackground(): JSX.Element {
        return this.renderCircle(get(this.props.managedClasses, "progress_indicator"));
    }

    private renderProgress(): React.ReactFragment {
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
                    className={get(this.props.managedClasses, "progress_valueIndicator")}
                    style={{ width: `${this.props.value}%` }}
                />
            </div>,
            <div
                slot={ProgressType.indeterminate}
                className={get(this.props.managedClasses, "progress_indicator")}
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
