import React from "react";
import { get, omit, pick } from "lodash-es";
import Foundation, {
    FoundationProps,
    HandledProps,
} from "@microsoft/fast-components-foundation-react";
import {
    CSSComponent,
    CSSEditorHandledProps,
    CSSEditorUnhandledProps,
    CSSEditorValues,
} from "./editor.props";
import { CSSPosition, CSSPositionValues, Location, PositionValue } from "./position";
import { CSSSpacing, CSSSpacingValues, SpacingProperty } from "./spacing";
import { CSSWidth, CSSWidthValues } from "./width";
import { CSSHeight, CSSHeightValues } from "./height";
import { CSSColor, CSSColorValues } from "./color";
import { CSSBorder, CSSBorderValues } from "./border";
import { CSSBoxShadow, CSSBoxShadowValues } from "./box-shadow";
import { CSSBackground, CSSBackgroundValues } from "./background";
import { CSSBorderRadius, CSSBorderRadiusValues } from "./border-radius";

export default class CSSEditor extends Foundation<
    CSSEditorHandledProps,
    CSSEditorUnhandledProps,
    {}
> {
    public static displayName: string = "CSSEditor";

    protected handledProps: HandledProps<CSSEditorHandledProps> = {
        data: void 0,
        onChange: void 0,
        managedClasses: void 0,
    };

    private spacingPropertyNames: string[] = [
        SpacingProperty.marginBottom,
        SpacingProperty.marginLeft,
        SpacingProperty.marginRight,
        SpacingProperty.marginTop,
        SpacingProperty.paddingBottom,
        SpacingProperty.paddingLeft,
        SpacingProperty.paddingRight,
        SpacingProperty.paddingTop,
    ];

    private postionPropertyNames: string[] = [
        "position",
        Location.left,
        Location.right,
        Location.top,
        Location.bottom,
    ];

    private heightPropertyNames: string[] = ["height"];

    private widthPropertyNames: string[] = ["width"];

    private backgroundPropertyNames: string[] = ["background"];

    private colorPropertyNames: string[] = ["color"];

    private borderPropertyNames: string[] = ["borderColor", "borderStyle", "borderWidth"];

    private boxShadowPropertyNames: string[] = ["boxShadow"];

    private borderRadiusPropertyNames: string[] = [
        "borderRadius",
        "borderTopLeftRadius",
        "borderTopRightRadius",
        "borderBottomRightRadius",
        "borderBottomLeftRadius",
    ];

    public render(): React.ReactNode {
        return (
            <div className={this.props.managedClasses.cssEditor}>
                {this.renderPosition()}
            </div>
        );
    }

    private renderPosition(): React.ReactNode {
        return (
            <React.Fragment>
                <CSSSpacing
                    jssStyleSheet={{ cssSpacing: { marginBottom: "10px" } }}
                    data={this.getSpacingData()}
                    onChange={this.handleCSSUpdate(CSSComponent.spacing)}
                />
                <CSSPosition
                    data={this.getPositionData()}
                    onChange={this.handleCSSUpdate(CSSComponent.position)}
                />
                <CSSWidth
                    data={this.getWidthData()}
                    onChange={this.handleCSSUpdate(CSSComponent.width)}
                />
                <CSSHeight
                    data={this.getHeightData()}
                    onChange={this.handleCSSUpdate(CSSComponent.height)}
                />
                <CSSBackground
                    data={this.getBackgroundData()}
                    onChange={this.handleCSSUpdate(CSSComponent.background)}
                />
                <CSSColor
                    data={this.getColorData()}
                    onChange={this.handleCSSUpdate(CSSComponent.color)}
                />
                <CSSBorder
                    data={this.getBorderData()}
                    onChange={this.handleCSSUpdate(CSSComponent.border)}
                />
                <CSSBoxShadow
                    data={this.getBoxShadowData()}
                    onChange={this.handleCSSUpdate(CSSComponent.boxShadow)}
                />
                <CSSBorderRadius
                    data={this.getBorderRadiusData()}
                    onChange={this.handleCSSUpdate(CSSComponent.borderRadius)}
                />
            </React.Fragment>
        );
    }

    private getSpacingData(): CSSSpacingValues {
        const spacingData: CSSSpacingValues = pick(
            this.props.data,
            this.spacingPropertyNames
        );

        return spacingData;
    }

    private getPositionData(): CSSPositionValues {
        const positionData: CSSPositionValues = pick(
            this.props.data,
            this.postionPropertyNames
        );

        return positionData;
    }

    /**
     * Gets the height value
     */
    private getHeightData(): CSSHeightValues {
        return pick(this.props.data, this.heightPropertyNames);
    }

    /**
     * Gets the width value
     */
    private getWidthData(): CSSWidthValues {
        return pick(this.props.data, this.widthPropertyNames);
    }

    /**
     * Gets the color value
     */
    private getColorData(): CSSColorValues {
        return pick(this.props.data, this.colorPropertyNames);
    }

    /**
     * Gets the bac kground value
     */
    private getBackgroundData(): CSSBackgroundValues {
        return pick(this.props.data, this.backgroundPropertyNames);
    }

    /**
     * Gets the border value
     */
    private getBorderData(): CSSBorderValues {
        const borderData: CSSBorderValues = pick(
            this.props.data,
            this.borderPropertyNames
        );
        return borderData;
    }

    /**
     * Gets the box shadow value
     */
    private getBoxShadowData(): CSSBoxShadowValues {
        return pick(this.props.data, this.boxShadowPropertyNames);
    }

    /**
     * Gets the box shadow value
     */
    private getBorderRadiusData(): CSSBorderRadiusValues {
        return pick(this.props.data, this.borderRadiusPropertyNames);
    }

    private handleCSSUpdate = (
        component: CSSComponent
    ): (<D extends {}>(updatedComponentCSS: D) => void) => {
        return <D extends {}>(updatedComponentCSS: D): void => {
            if (typeof this.props.onChange === "function") {
                let updatedCSS: Partial<CSSEditorValues>;

                switch (component) {
                    case CSSComponent.spacing:
                        updatedCSS = omit(this.props.data, this.spacingPropertyNames);
                        break;
                    case CSSComponent.border:
                        updatedCSS = omit(this.props.data, this.borderPropertyNames);
                        break;
                    case CSSComponent.borderRadius:
                        updatedCSS = omit(
                            this.props.data,
                            this.borderRadiusPropertyNames
                        );
                        break;
                    case CSSComponent.boxShadow:
                        updatedCSS = omit(this.props.data, this.boxShadowPropertyNames);
                        break;
                    case CSSComponent.color:
                        updatedCSS = omit(this.props.data, this.colorPropertyNames);
                        break;
                    case CSSComponent.background:
                        updatedCSS = omit(this.props.data, this.backgroundPropertyNames);
                        break;
                    case CSSComponent.height:
                        updatedCSS = omit(this.props.data, this.heightPropertyNames);
                        break;
                    case CSSComponent.width:
                        updatedCSS = omit(this.props.data, this.widthPropertyNames);
                        break;
                    case CSSComponent.position:
                        updatedCSS = omit(this.props.data, this.postionPropertyNames);
                        break;
                }

                const reducedData: Partial<CSSEditorValues> = Object.keys(
                    updatedComponentCSS
                ).reduce(
                    (
                        filteredProperties: Partial<CSSEditorValues>,
                        key: string
                    ): Partial<CSSEditorValues> => {
                        const value: unknown = updatedComponentCSS[key];
                        return typeof value === "string" && value.trim().length
                            ? { ...filteredProperties, [key]: value }
                            : filteredProperties;
                    },
                    {}
                );

                this.props.onChange(Object.assign({}, updatedCSS, reducedData));
            }
        };
    };
}
