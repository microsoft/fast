import React from "react";
import { get } from "lodash-es";
import Foundation, {
    HandledProps,
} from "@microsoft/fast-components-foundation-react";
import { BorderStyleValue, CSSBorderHandledProps, CSSBorderProps, CSSBorderState, CSSBorderUnhandledProps } from "./border.props";

export default class CSSBorder extends Foundation<
    CSSBorderHandledProps,
    CSSBorderUnhandledProps,
    CSSBorderState
> {

    public static displayName: string = "CSSBorder";

    protected handledProps: HandledProps<CSSBorderHandledProps> = {
        data: void 0,
        onChange: void 0,
        managedClasses: void 0,
    };

    constructor(props: CSSBorderProps) {
        super(props);

        this.state = {
            borderColor: get(this.props.data, "borderColor", ""),
            borderStyle: get(this.props.data, "borderStyle", BorderStyleValue.solid),
            borderWidth: get(this.props.data, "borderWidth", "")
        };
    }

    public componentDidUpdate(prevProps: CSSBorderProps, prevState: CSSBorderState): void {
        if (this.state !== prevState) {
            this.props.onChange({
                border: `${this.state.borderColor} ${this.state.borderStyle} ${this.state.borderWidth}`,
            });
        }
    }

    public render(): React.ReactNode {
        return (
            <div className={get(this.props, "managedClasses.cssBorder")}>
                <label className={get(this.props, "managedClasses.cssBorder_label")}>
                    Border
                </label>
                <div className={get(this.props, "managedClasses.cssBorder_control")}>
                    <div className={get(this.props, "managedClasses.cssBorder_colorInputRegion")} style={{background: this.state.borderColor}}>
                        <input
                            type={"color"}
                            style={{opacity: 0}}
                            value={this.state.borderColor}
                            onChange={this.handleBorderColorOnChange}
                        />
                    </div>
                    <span className={get(this.props, "managedClasses.cssBorder_selectControl")}>
                        <select
                            className={get(this.props, "managedClasses.cssBorder_select")}
                            onChange={this.handleBorderStyleOnChange}
                            value={this.state.borderStyle}
                        >
                            <option value={BorderStyleValue.dashed}>Dashed</option>
                            <option value={BorderStyleValue.dotted}>Dotted</option>
                            <option value={BorderStyleValue.double}>Double</option>
                            <option value={BorderStyleValue.groove}>Groove</option>
                            <option value={BorderStyleValue.hidden}>Hidden</option>
                            <option value={BorderStyleValue.inherit}>Inherit</option>
                            <option value={BorderStyleValue.initial}>Initial</option>
                            <option value={BorderStyleValue.inset}>Inset</option>
                            <option value={BorderStyleValue.none}>None</option>
                            <option value={BorderStyleValue.outset}>Outset</option>
                            <option value={BorderStyleValue.ridge}>Ridge</option>
                            <option value={BorderStyleValue.solid}>Solid</option>
                            <option value={BorderStyleValue.unset}>Unset</option>
                        </select>
                    </span>
                    <input
                        className={get(this.props, "managedClasses.cssBorder_input")}
                        type={"text"}
                        value={this.state.borderWidth}
                        onChange={this.handleBorderWidthOnChange}
                    />
                </div>
            </div>
        );
    }

    private handleBorderStyleOnChange = (e: React.ChangeEvent<HTMLSelectElement>): void => {
        this.setState({
            borderStyle: e.target.value as BorderStyleValue
        })
    };

    private handleBorderColorOnChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
        this.setState({
            borderColor: e.target.value.toUpperCase()
        })
    };

    private handleBorderWidthOnChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
        this.setState({
            borderWidth: e.target.value
        })
    };

}
