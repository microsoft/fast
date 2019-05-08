import React from "react";
import manageJss, {
    ComponentStyleSheet,
    DesignSystemConsumer,
} from "@microsoft/fast-jss-manager-react";
import { Omit } from "utility-types";
import { ComponentTypes } from "./state";
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
import { ColorsDesignSystem } from "./design-system";
import { contrastRatio, parseColorHexRGB } from "@microsoft/fast-colors";
import {
    ColorRecipe,
    contrast,
} from "@microsoft/fast-components-styles-msft/dist/utilities/color/common";
import { format } from "@microsoft/fast-jss-utilities";

export enum SwatchStates {
    rest = "rest",
    hover = "hover",
    active = "active",
    disabled = "disabled",
    selected = "selected",
}

interface SwatchClassNameContract {
    swatch: string;
}

interface SwatchManagedClasses {
    managedClasses: SwatchClassNameContract;
}

interface SwatchProps extends SwatchManagedClasses {
    /**
     * The color of the swatch
     */
    color: string;

    /**
     * The background color that the swatch is relative to
     */
    backgroundColor: string;

    /**
     * The color of text against the swatch
     */
    textColor: string;

    /**
     * The type of component the swatch maps to
     */
    component?: ComponentTypes;

    /**
     * The UI state the swatch maps to
     */
    state?: SwatchStates;

    /**
     * Show contrast between color and background color
     */
    showBackgroundContrast?: boolean;

    /**
     * Show contrast between color and background color
     */
    showTextContrast?: boolean;
}

const styles: ComponentStyleSheet<SwatchClassNameContract, ColorsDesignSystem> = {
    swatch: {
        height: "36px",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        margin: "4px 0",
        transition: "background-color .05s ease-in",
        width: "180px",
        fontSize: "12px",
        borderRadius: "18px",
        boxShadow: (elevation(ElevationMultiplier.e2, "#000")(undefined as any) as any)
            .boxShadow,
    },
};

function SwatchBase(props: SwatchProps): JSX.Element {
    const showBackgroundContrast: boolean =
        props.showBackgroundContrast === false ? false : true;
    const showTextContrast: boolean = props.showTextContrast === false ? false : true;

    const backgroundContrast: string = contrastRatio(
        parseColorHexRGB(props.backgroundColor) as any,
        parseColorHexRGB(props.color) as any
    ).toFixed(2);
    const textContrast: string = contrastRatio(
        parseColorHexRGB(props.color) as any,
        parseColorHexRGB(props.textColor) as any
    ).toFixed(2);
    const id: string = `${props.component}-${props.state}`;
    const classNames: string = classnames(props.managedClasses.swatch);

    const backgroundContrastMessage: string = showBackgroundContrast
        ? `BG Contrast: ${backgroundContrast}:1`
        : "";

    const textContrastMessage: string = showTextContrast
        ? `Text contrast: ${textContrast}:1`
        : "";

    const title: string | undefined =
        backgroundContrastMessage.length > 0 && textContrastMessage.length > 0
            ? backgroundContrastMessage.concat("\n", textContrastMessage)
            : backgroundContrastMessage.length > 0
                ? backgroundContrastMessage
                : textContrastMessage.length > 0
                    ? textContrastMessage
                    : undefined;

    const color: string = props.color.toUpperCase();
    const text: string =
        typeof props.state === "string"
            ? props.state.toUpperCase().concat(": ", color)
            : color;

    const stylesOverrides: any = {
        backgroundColor: props.color,
        color: props.textColor,
    };

    return (
        <div
            className={classNames}
            aria-describedby={id}
            style={!props.component ? stylesOverrides : null}
            title={title}
        >
            <span>{text}</span>
        </div>
    );
}

/* tslint:disable-next-line */
const Swatch = manageJss(styles)(SwatchBase);
type Swatch = InstanceType<typeof Swatch>;

export { Swatch };

export enum SwatchTwoTypes {
    fill = "fill",
    foreground = "foreground",
    outline = "outline",
}

export interface SwatchTwoClassNameContract {
    swatch: string;
    swatch_icon: string;
    swatch_recipeName: string;
    swatch_hexCode: string;
    swatch__foreground: string;
    swatch__fill: string;
    swatch__outline: string;
}

export interface SwatchTwoManagedClasses {
    managedClasses: SwatchTwoClassNameContract;
}

interface SwatchTwoBaseProps extends SwatchTwoManagedClasses {
    /**
     * The type of recipe the swatch represents
     */
    type: SwatchTwoTypes;

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
    SwatchTwoClassNameContract,
    ColorsDesignSystem
> = {
    swatch: {
        display: "grid",
        gridTemplateColumns: "auto auto 1fr auto",
        gridTemplateRows: "auto",
        alignItems: "center",
        width: "100%",
        padding: "4px 0",
        boxSizing: "border-box",
        color: neutralForegroundHint,
        fontSize: "12px",
    },
    swatch_icon: {
        width: "20px",
        height: "20px",
        marginRight: "16px",
        borderRadius: "2px",
        boxSizing: "border-box",
        ...applyElevation(4),
    },
    swatch_recipeName: {
        gridColumn: "2",
        gridRow: "1",
    },
    swatch_hexCode: {
        gridColumn: "4",
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
    type: SwatchTwoTypes
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
        return type === SwatchTwoTypes.outline
            ? {
                  border: `4px solid ${
                      typeof outlineRecipe === "function"
                          ? outlineRecipe(designSystem)
                          : fillRecipe(designSystem)
                  }`,
                  backgroundColor: "transparent",
              }
            : type === SwatchTwoTypes.foreground
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
            return format(
                message,
                (formatDesignSystem: ColorsDesignSystem): string => {
                    return contrast(a(formatDesignSystem), b(formatDesignSystem)).toFixed(
                        2
                    );
                }
            )(designSystem);
        };
    };
}

const formatBackgroundContrast: ReturnType<typeof formatContrast> = formatContrast(
    "BG contrast: {0} : 1\n"
);
const formatTextContrast: ReturnType<typeof formatContrast> = formatContrast(
    "Text contrast: {0} : 1\n"
);

function iconFactoryByType(type: SwatchTwoTypes): SwatchIconFactory {
    return (
        className: string,
        fillRecipe: ColorRecipe<string>,
        foregroundRecipe: ColorRecipe<string>,
        outlineRecipe?: ColorRecipe<string>
    ): DesignSystemResolver<JSX.Element> => {
        return (designSystem: ColorsDesignSystem): JSX.Element => {
            const backgroundContrastMessage: string = formatBackgroundContrast(
                type === SwatchTwoTypes.foreground
                    ? foregroundRecipe
                    : type === SwatchTwoTypes.outline &&
                      typeof outlineRecipe === "function"
                        ? outlineRecipe
                        : fillRecipe,
                backgroundColor
            )(designSystem);
            const tooltip: string =
                type === SwatchTwoTypes.fill && typeof foregroundRecipe === "function"
                    ? backgroundContrastMessage.concat(
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
    type: SwatchTwoTypes
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
        return type === SwatchTwoTypes.outline && typeof outlineRecipe === "function"
            ? outlineRecipe
            : type === SwatchTwoTypes.foreground
                ? foregroundRecipe
                : fillRecipe;
    };
}

function SwatchTwoBase(props: SwatchTwoBaseProps): JSX.Element {
    const className: string = classnames(props.managedClasses.swatch, {
        [props.managedClasses.swatch__fill]: props.type === SwatchTwoTypes.fill,
        [props.managedClasses.swatch__foreground]:
            props.type === SwatchTwoTypes.foreground,
        [props.managedClasses.swatch__outline]: props.type === SwatchTwoTypes.outline,
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

/* tslint:disable-next-line */
const SwatchTwo = manageJss(swatchTwoStyles)(SwatchTwoBase);
type SwatchTwo = InstanceType<typeof SwatchTwo>;
export type SwatchTwoProps = Omit<SwatchTwoBaseProps, "managedClasses">;

export { SwatchTwo };
