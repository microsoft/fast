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
import { parseCSSString } from "../../utilities/parse-css-string";

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

    constructor(props: CSSBorderRadiusProps) {
        super(props);

        this.state = {
            individualValues: false,
            hasFocus: void 0,
            data: this.props.data,
        };
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
                xmlns="https://www.w3.org/2000/svg"
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
        if (this.state.individualValues === true) {
            const parsedString: string[] = parseCSSString(
                get(this.props.data, "borderRadius", "")
            );
            return (
                <React.Fragment>
                    {this.renderIndividualInputs(
                        BorderRadiusValue.borderTopLeftRadius,
                        parsedString[0]
                    )}
                    {this.renderIndividualInputs(
                        BorderRadiusValue.borderTopRightRadius,
                        parsedString[1]
                    )}
                    {this.renderIndividualInputs(
                        BorderRadiusValue.borderBottomRightRadius,
                        parsedString[2]
                    )}
                    {this.renderIndividualInputs(
                        BorderRadiusValue.borderBottomLeftRadius,
                        parsedString[3]
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
        value: string
    ): React.ReactNode {
        const normalizedValue: string = value === "0" ? "" : value;
        return (
            <input
                className={get(
                    this.props,
                    "managedClasses.cssBorderRadius_individualInput"
                )}
                onFocus={this.handleInputOnFocus(position)}
                onBlur={this.handleInputBlur}
                placeholder={"0"}
                type={"text"}
                value={normalizedValue}
                onChange={this.handleBorderRadiusOnChange(position)}
            />
        );
    }

    private handleBorderRadiusOnChange(
        cssKey: BorderRadiusValue
    ): (e: React.ChangeEvent<HTMLInputElement>) => void {
        return (e: React.ChangeEvent<HTMLInputElement>): void => {
            const borderRadius: CSSBorderRadiusValues = pick(this.props.data, [
                "borderRadius",
            ]);

            const validatedValue: string = e.target.value === "" ? "0" : e.target.value;

            const parsedString: string[] = parseCSSString(
                get(this.props.data, "borderRadius", "")
            );
            switch (cssKey) {
                case BorderRadiusValue.borderRadius:
                    borderRadius.borderRadius = e.target.value;
                    break;
                case BorderRadiusValue.borderBottomLeftRadius:
                    borderRadius.borderRadius = `${parsedString[0]} ${parsedString[1]} ${parsedString[2]} ${validatedValue}`;
                    break;
                case BorderRadiusValue.borderBottomRightRadius:
                    borderRadius.borderRadius = `${parsedString[0]} ${parsedString[1]} ${validatedValue} ${parsedString[3]}`;
                    break;
                case BorderRadiusValue.borderTopLeftRadius:
                    borderRadius.borderRadius = `${validatedValue} ${parsedString[1]} ${parsedString[2]} ${parsedString[3]}`;
                    break;
                case BorderRadiusValue.borderTopRightRadius:
                    borderRadius.borderRadius = `${parsedString[0]} ${validatedValue} ${parsedString[2]} ${parsedString[3]}`;
                    break;
            }
            this.props.onChange(borderRadius);
        };
    }

    private toggleInputs = (): void => {
        this.setState({
            individualValues: !this.state.individualValues,
        });
    };

    private generateToggleClassNames(): string {
        let className: string = get(
            this.props,
            "managedClasses.cssBorderRadius_toggleButton"
        );

        if (this.state.individualValues) {
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
    ): (e: React.FocusEvent<HTMLInputElement>) => void {
        return (e: React.FocusEvent<HTMLInputElement>): void => {
            this.setState({
                hasFocus: cssKey,
            });
        };
    }

    private handleInputBlur = (e: React.FocusEvent<HTMLInputElement>): void => {
        this.setState({
            hasFocus: void 0,
        });
    };
}
