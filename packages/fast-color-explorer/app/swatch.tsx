import React from "react";
import manageJss, { ComponentStyleSheet } from "@microsoft/fast-jss-manager-react";
import { ComponentTypes } from "./state";
import classnames from "classnames";
import { elevation, ElevationMultiplier } from "@microsoft/fast-components-styles-msft";
import { ColorsDesignSystem } from "./design-system";
import { contrastRatio, parseColorHexRGB } from "@microsoft/fast-colors";

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
