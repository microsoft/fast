import * as React from "react";
import Foundation, {
    FoundationProps,
    HandledProps,
} from "@microsoft/fast-components-foundation-react";
import { get } from "lodash-es";
import {
    CSSSpacingHandledProps,
    CSSSpacingState,
    CSSSpacingUnhandledProps,
    CSSSpacingValues,
    SpacingKey,
    SpacingType,
} from "./spacing.props";

export default class CSSSpacing extends Foundation<
    CSSSpacingHandledProps,
    CSSSpacingUnhandledProps,
    CSSSpacingState
> {
    public static displayName: string = "CSSSpacing";

    protected handledProps: HandledProps<CSSSpacingHandledProps> = {
        type: void 0,
        marginTop: void 0,
        marginBottom: void 0,
        marginLeft: void 0,
        marginRight: void 0,
        paddingTop: void 0,
        paddingBottom: void 0,
        paddingLeft: void 0,
        paddingRight: void 0,
        onSpacingTypeUpdate: void 0,
        onSpacingUpdate: void 0,
        managedClasses: void 0,
    };

    constructor(props: CSSSpacingHandledProps) {
        super(props);

        this.state = {
            activeType: this.props.type ? this.props.type : SpacingType.margin,
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
        if (nextProps.type !== this.props.type) {
            this.setState({
                activeType: nextProps.type,
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
                        isMargin ? SpacingKey.marginTop : SpacingKey.paddingTop
                    )}
                </div>
                <div className={this.props.managedClasses.cssSpacing_row}>
                    {this.renderInput(
                        isMargin ? SpacingKey.marginLeft : SpacingKey.paddingLeft
                    )}
                    {this.renderBase(isMargin ? SpacingType.margin : SpacingType.padding)}
                    {this.renderInput(
                        isMargin ? SpacingKey.marginRight : SpacingKey.paddingRight
                    )}
                </div>
                <div className={this.props.managedClasses.cssSpacing_row}>
                    {this.renderInput(
                        isMargin ? SpacingKey.marginBottom : SpacingKey.paddingBottom
                    )}
                </div>
            </React.Fragment>
        );
    }

    private renderInput(spacingKey: SpacingKey): React.ReactNode {
        return (
            <input
                type="text"
                className={this.props.managedClasses.cssSpacing_input}
                onChange={this.handleInputOnChange(spacingKey)}
                value={this.props[spacingKey] || ""}
            />
        );
    }

    private getTypeClassNames(type: SpacingType): string {
        let classes: string = get(this.props, "managedClasses.cssSpacing_type");

        classes += ` ${get(this.props, `managedClasses.cssSpacing_type__${type}`)}`;

        if (type === this.state.activeType) {
            classes += ` ${get(
                this.props,
                `managedClasses.cssSpacing_type__${type}__active`
            )}`;
        }

        if (type === this.state.hoverType) {
            classes += ` ${get(
                this.props,
                `managedClasses.cssSpacing_type__${type}__hover`
            )}`;
        }

        return classes;
    }

    private handleTypeClick(
        type: SpacingType
    ): (e: React.MouseEvent<HTMLDivElement>) => void {
        return (e: React.MouseEvent<HTMLDivElement>): void => {
            if (
                e.currentTarget === e.target &&
                typeof this.props.onSpacingTypeUpdate === "function"
            ) {
                this.props.onSpacingTypeUpdate(type);
            }
        };
    }

    private handleMouseOver(
        type?: SpacingType
    ): (e: React.MouseEvent<HTMLDivElement>) => void {
        return (e: React.MouseEvent<HTMLDivElement>): void => {
            if (type && e.currentTarget === e.target) {
                this.setState({
                    hoverType: type,
                });
            } else if (type === undefined) {
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
        cssKey: SpacingKey
    ): (e: React.ChangeEvent<HTMLInputElement>) => void {
        return (e: React.ChangeEvent<HTMLInputElement>): void => {
            const spacing: CSSSpacingValues = {};

            Object.keys(this.props).forEach(
                (key: string): void => {
                    if (
                        this.props[key] &&
                        key !== "type" &&
                        key !== "managedClasses" &&
                        typeof this.props[key] !== "function"
                    ) {
                        spacing[key] = this.props[key];
                    }
                }
            );

            spacing[cssKey] = e.target.value;

            this.props.onSpacingUpdate(spacing);
        };
    }
}
