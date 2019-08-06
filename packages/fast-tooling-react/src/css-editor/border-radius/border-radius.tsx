import React from "react";
import { get, pick } from "lodash-es";
import Foundation, {
    FoundationProps,
    HandledProps,
} from "@microsoft/fast-components-foundation-react";
import {
    BorderRadiusValue,
    CSSBorderRadiusHandledProps,
    CSSBorderRadiusProps,
    CSSBorderRadiusState,
    CSSBorderRadiusUnhandledProps,
    CSSBorderRadiusValues,
} from "./border-radius.props";

export default class CSSBorderRadius extends Foundation<
    CSSBorderRadiusHandledProps,
    CSSBorderRadiusUnhandledProps,
    CSSBorderRadiusState
> {
    public static displayName: string = "CSSBorderRadius";

    protected handledProps: HandledProps<CSSBorderRadiusHandledProps> = {
        data: void 0,
        onChange: void 0,
        managedClasses: void 0,
    };

    private parsedString: string[];

    constructor(props: CSSBorderRadiusProps) {
        super(props);

        this.state = {
            indvidualValues: false,
            hasFocus: void 0,
            topLeftValue: "0",
            topRightValue: "0",
            bottomRightValue: "0",
            bottomLeftValue: "0",
            data: this.props.data || void 0,
        };
    }

    public componentDidUpdate(prevProps: CSSBorderRadiusProps): void {
        if (prevProps.data !== this.props.data) {
            this.assignBorderRadiusValues();
        }
    }

    public render(): React.ReactNode {
        return (
            <div className={get(this.props, "managedClasses.cssBorderRadius")}>
                <label
                    className={get(this.props, "managedClasses.cssBorderRadius_label")}
                >
                    BorderRadius
                </label>
                <div
                    className={get(this.props, "managedClasses.cssBorderRadius_control")}
                >
                    {this.renderInputs()}
                    <button
                        className={this.generateToggleClassNames()}
                        onClick={this.toggleInputs}
                    >
                        {this.renderBorderRadiusGlyph()}
                    </button>
                </div>
            </div>
        );
    }

    private renderBorderRadiusGlyph(): React.ReactNode {
        return (
            <svg
                className={get(
                    this.props,
                    "managedClasses.cssBorderRadius_toggleButtonGlyph"
                )}
                width="14"
                height="14"
                viewBox="0 0 14 14"
                xmlns="http://www.w3.org/2000/svg"
            >
                <path
                    className={this.generatePathClassNames(
                        BorderRadiusValue.borderTopLeftRadius
                    )}
                    style={{ transformOrigin: "15% 16%" }}
                    d="M4 1C2.34315 1 1 2.34315 1 4V5H0V4C0 1.79086 1.79086 0 4 0H5V1H4Z"
                />
                <path
                    className={this.generatePathClassNames(
                        BorderRadiusValue.borderBottomLeftRadius
                    )}
                    style={{ transformOrigin: "15% 84%" }}
                    d="M1 10C1 11.6569 2.34315 13 4 13H5V14H4C1.79086 14 0 12.2091 0 10V9H1V10Z"
                />
                <path
                    className={this.generatePathClassNames(
                        BorderRadiusValue.borderBottomRightRadius
                    )}
                    style={{ transformOrigin: "85% 84%" }}
                    d="M10 13C11.6569 13 13 11.6569 13 10V9H14V10C14 12.2091 12.2091 14 10 14H9V13H10Z"
                />
                <path
                    className={this.generatePathClassNames(
                        BorderRadiusValue.borderTopRightRadius
                    )}
                    style={{ transformOrigin: "85% 16%" }}
                    d="M13 4C13 2.34315 11.6569 1 10 1H9V0H10C12.2091 0 14 1.79086 14 4V5H13V4Z"
                />
            </svg>
        );
    }

    private renderInputs(): React.ReactFragment {
        if (this.state.indvidualValues === true) {
            return (
                <React.Fragment>
                    {this.renderIndividualInputs(
                        BorderRadiusValue.borderTopLeftRadius,
                        this.state.topLeftValue
                    )}
                    {this.renderIndividualInputs(
                        BorderRadiusValue.borderTopRightRadius,
                        this.state.topRightValue
                    )}
                    {this.renderIndividualInputs(
                        BorderRadiusValue.borderBottomRightRadius,
                        this.state.bottomRightValue
                    )}
                    {this.renderIndividualInputs(
                        BorderRadiusValue.borderBottomLeftRadius,
                        this.state.bottomLeftValue
                    )}
                </React.Fragment>
            );
        }

        return (
            <input
                className={get(this.props, "managedClasses.cssBorderRadius_input")}
                type={"text"}
                value={get(this.props.data, "borderRadius", "")}
                onChange={this.handleBorderRadiusOnChange(BorderRadiusValue.borderRadius)}
            />
        );
    }

    private renderIndividualInputs(
        position: BorderRadiusValue,
        state: string
    ): React.ReactNode {
        const value: string = state === "0" ? "" : state
        return (
            <input
                className={get(
                    this.props,
                    "managedClasses.cssBorderRadius_individualInput"
                )}
                onFocus={this.handleInputOnFocus(position)}
                onBlur={this.handleInputBlur(position)}
                placeholder={"0"}
                type={"text"}
                value={value}
                onChange={this.handleBorderRadiusOnChange(position)}
            />
        );
    }

    private handleBorderRadiusOnChange(
        cssKey: BorderRadiusValue
    ): (e: React.ChangeEvent<HTMLInputElement>) => void {
        return (e: React.ChangeEvent<HTMLInputElement>): void => {
            const borderRadius: CSSBorderRadiusValues = pick(this.props.data, [
                BorderRadiusValue.borderRadius,
                BorderRadiusValue.borderBottomLeftRadius,
                BorderRadiusValue.borderBottomRightRadius,
                BorderRadiusValue.borderTopLeftRadius,
                BorderRadiusValue.borderTopRightRadius,
            ]);
            
            const validatedValue: string = e.target.value === "" ? "0" : e.target.value

            switch (cssKey) {
                case BorderRadiusValue.borderRadius:
                    borderRadius[cssKey] = e.target.value;
                    break;
                case BorderRadiusValue.borderBottomLeftRadius:
                    this.setState({
                        bottomLeftValue: e.target.value,
                    });
                    borderRadius.borderRadius = `${this.state.topLeftValue} ${
                        this.state.topRightValue
                    } ${this.state.bottomRightValue} ${validatedValue}`;
                    break;
                case BorderRadiusValue.borderBottomRightRadius:
                    this.setState({
                        bottomRightValue: e.target.value
                    });
                    borderRadius.borderRadius = `${this.state.topLeftValue} ${
                        this.state.topRightValue
                    } ${validatedValue} ${this.state.bottomLeftValue}`;
                    break;
                case BorderRadiusValue.borderTopLeftRadius:
                    this.setState({
                        topLeftValue: e.target.value,
                    });
                    borderRadius.borderRadius = `${validatedValue} ${
                        this.state.topRightValue
                    } ${this.state.bottomRightValue} ${this.state.bottomLeftValue}`;
                    break;
                case BorderRadiusValue.borderTopRightRadius:
                    this.setState({
                        topRightValue: e.target.value,
                    });
                    borderRadius.borderRadius = `${this.state.topLeftValue} ${validatedValue} ${this.state.bottomRightValue} ${
                        this.state.bottomLeftValue
                    }`;
                    break;
            }

                this.props.onChange(borderRadius);
        };
    }

    private toggleInputs = (): void => {
        this.setState({
            indvidualValues: !this.state.indvidualValues,
        });

    };

    private generateToggleClassNames(): string {
        let className: string = get(
            this.props,
            "managedClasses.cssBorderRadius_toggleButton"
        );

        if (this.state.indvidualValues) {
            className = `${className} ${get(
                this.props,
                "managedClasses.cssBorderRadius_toggleButton__selected"
            )}`;
        }

        return className;
    }

    private generatePathClassNames(cssKey: BorderRadiusValue): string {
        if (this.state.hasFocus === cssKey) {
            return get(
                this.props,
                "managedClasses.cssBorderRadius_toggleButtonGlyphPath__highlight"
            );
        }
    }

    private handleInputOnFocus(
        cssKey: BorderRadiusValue
    ): (e: React.ChangeEvent<HTMLInputElement>) => void {
        return (e: React.ChangeEvent<HTMLInputElement>): void => {
            switch (cssKey) {
                case BorderRadiusValue.borderBottomLeftRadius:
                    break;
                case BorderRadiusValue.borderBottomRightRadius:
                    break;
                case BorderRadiusValue.borderTopLeftRadius:
                    break;
                case BorderRadiusValue.borderTopRightRadius:
                    break;
            }

            this.setState({
                hasFocus: cssKey,
            });
        };
    }

    private assignBorderRadiusValues(): void {

        this.parsedString = get(this.props.data, "borderRadius", "").split(/[\s ]+/);

        if (this.parsedString.length === 1) {
            this.setState({
                topLeftValue: this.parsedString[0],
                topRightValue: this.parsedString[0],
                bottomRightValue: this.parsedString[0],
                bottomLeftValue: this.parsedString[0],
            });
        } else if (this.parsedString.length === 2) {
            this.setState({
                topLeftValue: this.parsedString[0],
                topRightValue: this.parsedString[1],
                bottomRightValue: this.parsedString[0],
                bottomLeftValue: this.parsedString[1],
            });
        } else if (this.parsedString.length === 3) {
            this.setState({
                topLeftValue: this.parsedString[0],
                topRightValue: this.parsedString[1],
                bottomRightValue: this.parsedString[2],
                bottomLeftValue: this.parsedString[1],
            });
        } else if (this.parsedString.length === 4) {
            this.setState({
                topLeftValue: this.parsedString[0],
                topRightValue: this.parsedString[1],
                bottomRightValue: this.parsedString[2],
                bottomLeftValue: this.parsedString[3],
            });
        }
    }

    private handleInputBlur(
        cssKey: BorderRadiusValue
    ): (e: React.ChangeEvent<HTMLInputElement>) => void {
        return (e: React.ChangeEvent<HTMLInputElement>): void => {
            let partialState: Partial<CSSBorderRadiusState>;
            switch (cssKey) {
                case BorderRadiusValue.borderBottomLeftRadius:
                    partialState = {bottomLeftValue: e.target.value === "" ? "0" : this.state.bottomLeftValue}
                    break;
                case BorderRadiusValue.borderBottomRightRadius:
                    partialState = {bottomRightValue: e.target.value === "" ? "0" : this.state.bottomRightValue}
                    break;
                case BorderRadiusValue.borderTopLeftRadius:
                    partialState = {topLeftValue: e.target.value === "" ? "0" : this.state.topLeftValue}
                    break;
                case BorderRadiusValue.borderTopRightRadius:
                    partialState = {topRightValue: e.target.value === "" ? "0" : this.state.topRightValue}
                    break;
            }

            this.setState({
                hasFocus: void 0,
                ...partialState
            });
        };
    }
}
