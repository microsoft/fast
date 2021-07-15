import { applyElevation } from "@microsoft/fast-components-styles-msft";
import manageJss, { DesignSystemConsumer } from "@microsoft/fast-jss-manager-react";
import { format } from "@microsoft/fast-jss-utilities";
import classnames from "classnames";
import React from "react";
import {
    backgroundColor,
    contrast,
    neutralForegroundHint,
    neutralStrokeRest,
} from "./recipes";
export var SwatchTypes;
(function (SwatchTypes) {
    SwatchTypes["fill"] = "fill";
    SwatchTypes["foreground"] = "foreground";
    SwatchTypes["outline"] = "outline";
})(SwatchTypes || (SwatchTypes = {}));
const swatchTwoStyles = {
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
    swatch_icon: Object.assign(
        { width: "20px", height: "20px", borderRadius: "2px", boxSizing: "border-box" },
        applyElevation(4)
    ),
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
            border: format("1px solid {0}", neutralStrokeRest),
            "&::before": {
                fontSize: "13px",
                content: "'A'",
                fontWeight: "400",
            },
        },
    },
    swatch__fill: {},
    swatch__outline: {},
};
function iconStyleOverrides(type) {
    return (designSystem, fillRecipe, foregroundRecipe, outlineRecipe) => {
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
function formatContrast(message) {
    return (a, b) => {
        return designSystem => {
            return format(message, formatDesignSystem => {
                return contrast(a(formatDesignSystem), b(formatDesignSystem)).toFixed(2);
            })(designSystem);
        };
    };
}
const formatBackgroundContrast = formatContrast("BG contrast: {0} : 1");
const formatTextContrast = formatContrast("Text contrast: {0} : 1");
function iconFactoryByType(type) {
    return (className, fillRecipe, foregroundRecipe, outlineRecipe) => {
        return designSystem => {
            const backgroundContrastMessage = formatBackgroundContrast(
                type === SwatchTypes.foreground
                    ? foregroundRecipe
                    : type === SwatchTypes.outline && typeof outlineRecipe === "function"
                    ? outlineRecipe
                    : fillRecipe,
                type === SwatchTypes.foreground || type === SwatchTypes.outline
                    ? fillRecipe
                    : backgroundColor
            )(designSystem);
            const tooltip =
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
function colorByType(type) {
    return (fillRecipe, foregroundRecipe, outlineRecipe) => {
        return type === SwatchTypes.outline && typeof outlineRecipe === "function"
            ? outlineRecipe
            : type === SwatchTypes.foreground
            ? foregroundRecipe
            : fillRecipe;
    };
}
function SwatchBase(props) {
    const className = classnames(props.managedClasses.swatch, {
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
export { Swatch };
