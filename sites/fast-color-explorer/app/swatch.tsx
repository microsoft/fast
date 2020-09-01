import React from "react";
import manageJss, {
    ComponentStyleSheet,
    DesignSystemConsumer,
} from "@microsoft/fast-jss-manager-react";
import classnames from "classnames";
import {
    applyElevation,
    backgroundColor,
    DesignSystemResolver,
    designUnit,
    elevation,
    ElevationMultiplier,
    fontWeight,
    neutralForegroundHint,
    neutralForegroundRest,
    neutralOutlineRest,
} from "@microsoft/fast-components-styles-msft";
import { contrastRatio, parseColorHexRGB } from "@microsoft/fast-colors";
import {
    ColorRecipe,
    contrast,
} from "@microsoft/fast-components-styles-msft/dist/utilities/color/common";
import { format } from "@microsoft/fast-jss-utilities";
import { ColorsDesignSystem } from "./design-system";
import { ComponentTypes } from "./state";

export enum SwatchTypes {
    fill = "fill",
    foreground = "foreground",
    outline = "outline",
}

export interface SwatchClassNameContract {
    swatch: string;
    swatch_icon: string;
    swatch_recipeName: string;
    swatch_hexCode: string;
    swatch__foreground: string;
    swatch__fill: string;
    swatch__outline: string;
}

export interface SwatchManagedClasses {
    managedClasses: SwatchClassNameContract;
}

interface SwatchBaseProps extends SwatchManagedClasses {
    /**
     * The type of recipe the swatch represents
     */
    type: SwatchTypes;

    /**
     * Recipe name - we can't always pull this from the function name
     */
    recipeName: string;

    /**
     * The recipe to derive the fill color of the swatch
     */
    fillRecipe: DesignSystemResolver<string>;

    /**
     * The recipe to derive text over the control
     */
    foregroundRecipe: DesignSystemResolver<string>;

    /**
     * The recipe to derive the outline
     */
    outlineRecipe?: DesignSystemResolver<string>;
}

const swatchTwoStyles: ComponentStyleSheet<
    SwatchClassNameContract,
    ColorsDesignSystem
> = {
    swatch: {
        display: "grid",
        gridTemplateColumns: "auto 1fr auto",
        gridTemplateRows: "auto",
        alignItems: "center",
        width: "100%",
        padding: "4px 0",
        boxSizing: "border-box",
        color: neutralForegroundHint,
        fontSize: "12px",
        gridColumnGap: "16px",
        justifyItems: "start",
    },
    swatch_icon: {
        width: "20px",
        height: "20px",
        borderRadius: "2px",
        boxSizing: "border-box",
        ...applyElevation(4),
    },
    swatch_recipeName: {
        gridColumn: "2",
        gridRow: "1",
    },
    swatch_hexCode: {
        gridColumn: "3",
        gridRow: "1",
    },
    swatch__foreground: {
        "& $swatch_icon": {
            border: format<ColorsDesignSystem>("1px solid {0}", neutralOutlineRest),
            "&::before": {
                fontSize: "13px",
                content: "'A'",
                fontWeight: fontWeight.normal,
            },
        },
    },
    swatch__fill: {},
    swatch__outline: {},
};

type SwatchIconFactory = (
    className: string,
    recipe: ColorRecipe<string> | DesignSystemResolver<string>,
    textRecipe: ColorRecipe<string> | DesignSystemResolver<string>,
    outlineRecipe?: ColorRecipe<string> | DesignSystemResolver<string>
) => DesignSystemResolver<JSX.Element>;

function iconStyleOverrides(
    type: SwatchTypes
): (
    designSystem: ColorsDesignSystem,
    fillRecipe: ColorRecipe<string>,
    foregroundRecipe: ColorRecipe<string>,
    outlineRecipe?: ColorRecipe<string>
) => React.CSSProperties {
    return (
        designSystem: ColorsDesignSystem,
        fillRecipe: ColorRecipe<string>,
        foregroundRecipe: ColorRecipe<string>,
        outlineRecipe?: ColorRecipe<string>
    ): React.CSSProperties => {
        return type === SwatchTypes.outline
            ? {
                  border: `4px solid ${
                      typeof outlineRecipe === "function"
                          ? outlineRecipe(designSystem)
                          : fillRecipe(designSystem)
                  }`,
                  backgroundColor: fillRecipe(designSystem),
              }
            : type === SwatchTypes.foreground
            ? {
                  color: foregroundRecipe(designSystem),
                  background: fillRecipe(designSystem),
              }
            : { background: fillRecipe(designSystem) };
    };
}

function formatContrast(
    message: string
): (
    a: ColorRecipe<string> | DesignSystemResolver<string>,
    b: ColorRecipe<string> | DesignSystemResolver<string>
) => DesignSystemResolver<string> {
    return (
        a: ColorRecipe<string>,
        b: ColorRecipe<string>
    ): DesignSystemResolver<string> => {
        return (designSystem: ColorsDesignSystem): string => {
            return format(message, (formatDesignSystem: ColorsDesignSystem): string => {
                return contrast(a(formatDesignSystem), b(formatDesignSystem)).toFixed(2);
            })(designSystem);
        };
    };
}

const formatBackgroundContrast: ReturnType<typeof formatContrast> = formatContrast(
    "BG contrast: {0} : 1"
);
const formatTextContrast: ReturnType<typeof formatContrast> = formatContrast(
    "Text contrast: {0} : 1"
);

function iconFactoryByType(type: SwatchTypes): SwatchIconFactory {
    return (
        className: string,
        fillRecipe: ColorRecipe<string>,
        foregroundRecipe: ColorRecipe<string>,
        outlineRecipe?: ColorRecipe<string>
    ): DesignSystemResolver<JSX.Element> => {
        return (designSystem: ColorsDesignSystem): JSX.Element => {
            const backgroundContrastMessage: string = formatBackgroundContrast(
                type === SwatchTypes.foreground
                    ? foregroundRecipe
                    : type === SwatchTypes.outline && typeof outlineRecipe === "function"
                    ? outlineRecipe
                    : fillRecipe,
                type === SwatchTypes.foreground || type === SwatchTypes.outline
                    ? fillRecipe
                    : backgroundColor
            )(designSystem);
            const tooltip: string =
                type === SwatchTypes.fill && typeof foregroundRecipe === "function"
                    ? backgroundContrastMessage.concat(
                          "\n",
                          formatTextContrast(fillRecipe, foregroundRecipe)(designSystem)
                      )
                    : backgroundContrastMessage;

            return (
                <div
                    className={className}
                    style={iconStyleOverrides(type)(
                        designSystem,
                        fillRecipe,
                        foregroundRecipe,
                        outlineRecipe
                    )}
                    title={tooltip}
                />
            );
        };
    };
}

function colorByType(
    type: SwatchTypes
): (
    fillRecipe: DesignSystemResolver<string>,
    foregroundRecipe: DesignSystemResolver<string>,
    outlineRecipe?: DesignSystemResolver<string>
) => DesignSystemResolver<string> {
    return (
        fillRecipe: DesignSystemResolver<string>,
        foregroundRecipe: DesignSystemResolver<string>,
        outlineRecipe?: DesignSystemResolver<string>
    ): DesignSystemResolver<string> => {
        return type === SwatchTypes.outline && typeof outlineRecipe === "function"
            ? outlineRecipe
            : type === SwatchTypes.foreground
            ? foregroundRecipe
            : fillRecipe;
    };
}

function SwatchBase(props: SwatchBaseProps): JSX.Element {
    const className: string = classnames(props.managedClasses.swatch, {
        [props.managedClasses.swatch__fill]: props.type === SwatchTypes.fill,
        [props.managedClasses.swatch__foreground]: props.type === SwatchTypes.foreground,
        [props.managedClasses.swatch__outline]: props.type === SwatchTypes.outline,
    });

    return (
        <div className={className}>
            <DesignSystemConsumer>
                {iconFactoryByType(props.type)(
                    props.managedClasses.swatch_icon,
                    props.fillRecipe,
                    props.foregroundRecipe,
                    props.outlineRecipe
                )}
            </DesignSystemConsumer>
            <code className={props.managedClasses.swatch_recipeName}>
                {props.recipeName}
            </code>
            <code className={props.managedClasses.swatch_hexCode}>
                <DesignSystemConsumer>
                    {colorByType(props.type)(
                        props.fillRecipe,
                        props.foregroundRecipe,
                        props.outlineRecipe /* TODO: fix */
                    )}
                </DesignSystemConsumer>
            </code>
        </div>
    );
}

const Swatch = manageJss(swatchTwoStyles)(SwatchBase);
type Swatch = InstanceType<typeof Swatch>;
export type SwatchProps = Omit<SwatchBaseProps, "managedClasses">;

export { Swatch };
