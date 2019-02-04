import * as React from "react";
import Foundation, {
    FoundationProps,
    HandledProps,
} from "@microsoft/fast-components-foundation-react";
import { get, pick } from "lodash-es";
import {
    CSSSpacingHandledProps,
    CSSSpacingState,
    CSSSpacingUnhandledProps,
    CSSSpacingValues,
    SpacingProperty,
    SpacingType,
} from "./spacing.props";

export default class CSSSpacing extends Foundation<
    CSSSpacingHandledProps,
    CSSSpacingUnhandledProps,
    CSSSpacingState
> {
    public static displayName: string = "CSSSpacing";

    protected handledProps: HandledProps<CSSSpacingHandledProps> = {
        spacingType: void 0,
        marginTop: void 0,
        marginRight: void 0,
        marginBottom: void 0,
        marginLeft: void 0,
        paddingTop: void 0,
        paddingRight: void 0,
        paddingBottom: void 0,
        paddingLeft: void 0,
        onSpacingTypeUpdate: void 0,
        onSpacingUpdate: void 0,
        managedClasses: void 0,
    };

    constructor(props: CSSSpacingHandledProps) {
        super(props);

        this.state = {
            activeType: this.props.spacingType
                ? this.props.spacingType
                : SpacingType.margin,
            hoverType: void 0,
        };
    }

    public render(): React.ReactNode {
        return (
            <div className={this.props.managedClasses.cssSpacing}>
                {this.renderGrid()}
            </div>
        );
    }

    public componentWillReceiveProps(nextProps: CSSSpacingHandledProps): void {
        if (nextProps.spacingType !== this.props.spacingType) {
            this.setState({
                activeType: nextProps.spacingType,
            });
        }
    }

    private renderBase(activeType: SpacingType): React.ReactNode {
        return (
            <div>
                <div
                    className={this.getTypeClassNames(SpacingType.margin)}
                    onClick={this.handleTypeClick(SpacingType.margin)}
                    onMouseOver={this.handleMouseOver(SpacingType.margin)}
                    onMouseOut={this.handleMouseOut}
                >
                    <div
                        className={this.getTypeClassNames(SpacingType.padding)}
                        onClick={this.handleTypeClick(SpacingType.padding)}
                        onMouseOver={this.handleMouseOver(SpacingType.padding)}
                        onMouseOut={this.handleMouseOut}
                    >
                        <span
                            className={
                                this.props.managedClasses.cssSpacing_type_contentRegion
                            }
                            onMouseEnter={this.handleMouseOver()}
                        >
                            {activeType.toUpperCase()}
                        </span>
                    </div>
                </div>
            </div>
        );
    }

    private renderGrid(): React.ReactNode {
        const isMargin: boolean = this.state.activeType === SpacingType.margin;

        return (
            <React.Fragment>
                <div className={this.props.managedClasses.cssSpacing_row}>
                    {this.renderInput(
                        isMargin ? SpacingProperty.marginTop : SpacingProperty.paddingTop
                    )}
                </div>
                <div className={this.props.managedClasses.cssSpacing_row}>
                    {this.renderInput(
                        isMargin
                            ? SpacingProperty.marginLeft
                            : SpacingProperty.paddingLeft
                    )}
                    {this.renderBase(isMargin ? SpacingType.margin : SpacingType.padding)}
                    {this.renderInput(
                        isMargin
                            ? SpacingProperty.marginRight
                            : SpacingProperty.paddingRight
                    )}
                </div>
                <div className={this.props.managedClasses.cssSpacing_row}>
                    {this.renderInput(
                        isMargin
                            ? SpacingProperty.marginBottom
                            : SpacingProperty.paddingBottom
                    )}
                </div>
            </React.Fragment>
        );
    }

    private renderInput(spacingKey: SpacingProperty): React.ReactNode {
        return (
            <input
                type="text"
                className={this.props.managedClasses.cssSpacing_input}
                onChange={this.handleInputOnChange(spacingKey)}
                value={this.props[spacingKey] || ""}
            />
        );
    }

    private getTypeClassNames(spacingType: SpacingType): string {
        let classes: string = get(this.props, "managedClasses.cssSpacing_type");

        classes += ` ${get(
            this.props,
            `managedClasses.cssSpacing_type__${spacingType}`,
            ""
        )}`;

        if (spacingType === this.state.activeType) {
            classes += ` ${get(
                this.props,
                `managedClasses.cssSpacing_type__${spacingType}Active`,
                ""
            )}`;
        }

        if (spacingType === this.state.hoverType) {
            classes += ` ${get(
                this.props,
                `managedClasses.cssSpacing_type__${spacingType}Hover`,
                ""
            )}`;
        }

        return classes;
    }

    private handleTypeClick(
        spacingType: SpacingType
    ): (e: React.MouseEvent<HTMLDivElement>) => void {
        return (e: React.MouseEvent<HTMLDivElement>): void => {
            if (e.currentTarget === e.target) {
                if (typeof this.props.onSpacingTypeUpdate === "function") {
                    this.props.onSpacingTypeUpdate(spacingType);
                } else if (this.props.spacingType === undefined) {
                    this.setState({
                        activeType: spacingType,
                    });
                }
            }
        };
    }

    private handleMouseOver(
        spacingType?: SpacingType
    ): (e: React.MouseEvent<HTMLDivElement>) => void {
        return (e: React.MouseEvent<HTMLDivElement>): void => {
            if (spacingType && e.currentTarget === e.target) {
                this.setState({
                    hoverType: spacingType,
                });
            } else if (spacingType === undefined) {
                this.setState({
                    hoverType: void 0,
                });
            }
        };
    }

    private handleMouseOut = (e: React.MouseEvent<HTMLDivElement>): void => {
        if (e.currentTarget === e.target) {
            this.setState({
                hoverType: void 0,
            });
        }
    };

    private handleInputOnChange(
        cssKey: SpacingProperty
    ): (e: React.ChangeEvent<HTMLInputElement>) => void {
        return (e: React.ChangeEvent<HTMLInputElement>): void => {
            const spacing: CSSSpacingValues = pick(this.props, [
                SpacingProperty.marginBottom,
                SpacingProperty.marginTop,
                SpacingProperty.marginLeft,
                SpacingProperty.marginRight,
                SpacingProperty.paddingBottom,
                SpacingProperty.paddingTop,
                SpacingProperty.paddingLeft,
                SpacingProperty.paddingRight,
            ]);

            spacing[cssKey] = e.target.value;

            this.props.onSpacingUpdate(spacing);
        };
    }
}
