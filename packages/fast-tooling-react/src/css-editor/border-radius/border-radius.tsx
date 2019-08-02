import React from "react";
import { get, pick } from "lodash-es";
import Foundation, {
    FoundationProps,
    HandledProps,
} from "@microsoft/fast-components-foundation-react";
import {
    CSSBorderRadiusHandledProps,
    CSSBorderRadiusProps,
    CSSBorderRadiusState,
    CSSBorderRadiusUnhandledProps,
    CSSBorderRadiusValues,
    BorderRadiusValue,
} from "./border-radius.props";
import { ActionToggle } from "@microsoft/fast-components-react-msft";

export default class CSSBorderRadius extends Foundation<
    CSSBorderRadiusHandledProps,
    CSSBorderRadiusUnhandledProps,
    CSSBorderRadiusState
> {
    public static displayName: string = "CSSBorderRadius";

    private parsedString: string[];
    private topLeftValue: string;
    private topRightValue: string;
    private bottomRightValue: string;
    private bottomLeftValue: string;

    protected handledProps: HandledProps<CSSBorderRadiusHandledProps> = {
        data: void 0,
        onChange: void 0,
        managedClasses: void 0,
    };

    constructor(props: CSSBorderRadiusProps) {
        super(props);

        this.state = {
            indvidualValues: false,
            hasFocus: void 0,
        };
    }

    public componentDidUpdate(
        prevProps: CSSBorderRadiusProps
    ): void {
        if (this.props !== prevProps) {
            this.assignBorderRadiusIndividualValues();
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
                    </button>
                </div>
            </div>
        );
    }

    private renderInputs(): React.ReactFragment {
        if (this.state.indvidualValues === true) {
            return (
                <React.Fragment>
                    <input
                        className={get(
                            this.props,
                            "managedClasses.cssBorderRadius_individualInput"
                        )}
                        onFocus={this.handleInputOnFocus(
                            BorderRadiusValue.borderTopLeftRadius
                        )}
                        onBlur={this.handleInputBlur}
                        placeholder={"0px"}
                        type={"text"}
                        value={this.topLeftValue}
                        onChange={this.handleBorderRadiusOnChange(
                            BorderRadiusValue.borderTopLeftRadius
                        )}
                    />
                    <input
                        className={get(
                            this.props,
                            "managedClasses.cssBorderRadius_individualInput"
                        )}
                        onFocus={this.handleInputOnFocus(
                            BorderRadiusValue.borderTopRightRadius
                        )}
                        onBlur={this.handleInputBlur}
                        placeholder={"0px"}
                        type={"text"}
                        value={this.topRightValue}
                        onChange={this.handleBorderRadiusOnChange(
                            BorderRadiusValue.borderTopRightRadius
                        )}
                    />
                    <input
                        className={get(
                            this.props,
                            "managedClasses.cssBorderRadius_individualInput"
                        )}
                        onFocus={this.handleInputOnFocus(
                            BorderRadiusValue.borderBottomRightRadius
                        )}
                        onBlur={this.handleInputBlur}
                        placeholder={"0px"}
                        type={"text"}
                        value={this.bottomRightValue}
                        onChange={this.handleBorderRadiusOnChange(
                            BorderRadiusValue.borderBottomRightRadius
                        )}
                    />
                    <input
                        className={get(
                            this.props,
                            "managedClasses.cssBorderRadius_individualInput"
                        )}
                        onFocus={this.handleInputOnFocus(
                            BorderRadiusValue.borderBottomLeftRadius
                        )}
                        onBlur={this.handleInputBlur}
                        placeholder={"0px"}
                        type={"text"}
                        value={this.bottomLeftValue}
                        onChange={this.handleBorderRadiusOnChange(
                            BorderRadiusValue.borderBottomLeftRadius
                        )}
                    />
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

            switch (cssKey) {
                case BorderRadiusValue.borderRadius:
                    borderRadius[cssKey] = e.target.value;
                    break;
                case BorderRadiusValue.borderBottomLeftRadius:
                    borderRadius[cssKey] = e.target.value;
                    break;
                case BorderRadiusValue.borderBottomRightRadius:
                    borderRadius[cssKey] = e.target.value;
                    break;
                case BorderRadiusValue.borderTopLeftRadius:
                    borderRadius[cssKey] = e.target.value;
                    break;
                case BorderRadiusValue.borderTopRightRadius:
                    borderRadius[cssKey] = e.target.value;
                    break;
            }

            this.props.onChange(borderRadius);
        };
    }

    private toggleInputs = (): void => {
        console.log("Toggle");
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
                case BorderRadiusValue.borderRadius:
                    break;
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

    private assignBorderRadiusIndividualValues() {
        if(this.props.data === undefined) {
            return
        }
        this.parsedString = get(this.props.data, "borderRadius", "").split(/[\s ]+/);
        console.log(this.parsedString.length)
        if(this.parsedString.length === 0) {
            return
        } else if(this.parsedString.length === 1) {
            this.topLeftValue = this.bottomRightValue = this.topRightValue = this.bottomLeftValue = this.parsedString[0];
        }
        else if(this.parsedString.length === 2) {
            this.topLeftValue = this.bottomRightValue = this.parsedString[0];
            this.topRightValue = this.bottomLeftValue = this.parsedString[1];
        } else if(this.parsedString.length === 3) {
            this.topLeftValue = this.parsedString[0];
            this.topRightValue = this.bottomLeftValue = this.parsedString[1];
            this.bottomRightValue = this.parsedString[2];
        } else {
            this.topLeftValue = this.parsedString[0];
            this.topRightValue = this.parsedString[1];
            this.bottomRightValue = this.parsedString[2];
            this.bottomLeftValue = this.parsedString[3];
        }
    }

    private handleInputBlur = (): void => {
        this.setState({
            hasFocus: void 0,
        });
    };
}
