import { Type } from "@microsoft/fast-tooling/dist/css-data.types";
import {
    renderDefault,
    RenderControlConfig,
    renderNumberInput,
} from "./control.css.utilities";
import React from "react";
import { CombinatorType } from "@microsoft/fast-tooling/dist/data-utilities/mapping.mdn-data";

export function renderTypeAnPlusB(config: RenderControlConfig): React.ReactNode {
    return null;
}

export function renderTypeAnglePercentage(config: RenderControlConfig): React.ReactNode {
    return null;
}

export function renderTypeAngle(config: RenderControlConfig): React.ReactNode {
    return null;
}

export function renderTypeBasicShape(config: RenderControlConfig): React.ReactNode {
    return null;
}

export function renderTypeBlendMode(config: RenderControlConfig): React.ReactNode {
    return null;
}

export function renderTypeColor(config: RenderControlConfig): React.ReactNode {
    return null;
}

/**
 * https://developer.mozilla.org/en-US/docs/Web/CSS/custom-ident
 */
export function renderTypeCustomIndent(config: RenderControlConfig): React.ReactNode {
    return renderDefault(config);
}

export function renderTypeDimension(config: RenderControlConfig): React.ReactNode {
    return null;
}

export function renderTypeDisplayBox(config: RenderControlConfig): React.ReactNode {
    return null;
}

export function renderTypeDisplayInside(config: RenderControlConfig): React.ReactNode {
    return null;
}

export function renderTypeDisplayInternal(config: RenderControlConfig): React.ReactNode {
    return null;
}

export function renderTypeDisplayLegacy(config: RenderControlConfig): React.ReactNode {
    return null;
}

export function renderTypeDisplayListitem(config: RenderControlConfig): React.ReactNode {
    return null;
}

export function renderTypeDisplayOutside(config: RenderControlConfig): React.ReactNode {
    return null;
}

export function renderTypeFilterFunction(config: RenderControlConfig): React.ReactNode {
    return null;
}

export function renderTypeFlex(config: RenderControlConfig): React.ReactNode {
    return null;
}

export function renderTypeFrequencyPercentage(
    config: RenderControlConfig
): React.ReactNode {
    return null;
}

export function renderTypeFrequency(config: RenderControlConfig): React.ReactNode {
    return null;
}

export function renderTypeGradient(config: RenderControlConfig): React.ReactNode {
    return null;
}

export function renderTypeIdent(config: RenderControlConfig): React.ReactNode {
    return null;
}

export function renderTypeImage(config: RenderControlConfig): React.ReactNode {
    return null;
}

export function renderTypeInteger(config: RenderControlConfig): React.ReactNode {
    return renderNumberInput(config);
}

export function renderTypeLengthPercentage(config: RenderControlConfig): React.ReactNode {
    return null;
}

export function renderTypeLength(config: RenderControlConfig): React.ReactNode {
    return (
        <span key={config.index}>
            <input type={"number"} onChange={config.onChangeHandler} />
            px
        </span>
    );
}
export function renderTypeNumber(config: RenderControlConfig): React.ReactNode {
    return null;
}

export function renderTypePercentage(config: RenderControlConfig): React.ReactNode {
    return (
        <span key={config.index}>
            <input type={"number"} onChange={config.onChangeHandler} />%
        </span>
    );
}
export function renderTypePosition(config: RenderControlConfig): React.ReactNode {
    return null;
}

export function renderTypeRatio(config: RenderControlConfig): React.ReactNode {
    return null;
}

export function renderTypeResolution(config: RenderControlConfig): React.ReactNode {
    return null;
}

export function renderTypeShape(config: RenderControlConfig): React.ReactNode {
    return null;
}

export function renderTypeString(config: RenderControlConfig): React.ReactNode {
    return null;
}

export function renderTypeTimePercentage(config: RenderControlConfig): React.ReactNode {
    return null;
}

export function renderTypeTime(config: RenderControlConfig): React.ReactNode {
    return null;
}

export function renderTypeTimingFunction(config: RenderControlConfig): React.ReactNode {
    return null;
}

export function renderTypeTransformFunction(
    config: RenderControlConfig
): React.ReactNode {
    return null;
}

export function renderTypeUrl(config: RenderControlConfig): React.ReactNode {
    return null;
}

export function renderTypeControl(
    index: number,
    type: Type,
    onChangeHandler: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void,
    changeHandler: (value: string) => void,
    combinatorType: CombinatorType,
    mapsToProperty: string
): React.ReactNode {
    const config: RenderControlConfig = {
        onChangeHandler,
        changeHandler,
        index,
        combinatorType,
        mapsToProperty,
        refKey: type.slice(1, -1),
        refType: "type",
    };

    switch (type) {
        case "<an-plus-b>":
            return renderTypeAnPlusB(config);
        case "<angle-percentage>":
            return renderTypeAnglePercentage(config);
        case "<angle>":
            return renderTypeAngle(config);
        case "<basic-shape>":
            return renderTypeBasicShape(config);
        case "<blend-mode>":
            return renderTypeBlendMode(config);
        case "<color>":
            return renderTypeColor(config);
        case "<custom-ident>":
            return renderTypeCustomIndent(config);
        case "<dimension>":
            return renderTypeDimension(config);
        case "<display-box>":
            return renderTypeDisplayBox(config);
        case "<display-inside>":
            return renderTypeDisplayInside(config);
        case "<display-internal>":
            return renderTypeDisplayInternal(config);
        case "<display-legacy>":
            return renderTypeDisplayLegacy(config);
        case "<display-listitem>":
            return renderTypeDisplayListitem(config);
        case "<display-outside>":
            return renderTypeDisplayOutside(config);
        case "<filter-function>":
            return renderTypeFilterFunction(config);
        case "<flex>":
            return renderTypeFlex(config);
        case "<frequency-percentage>":
            return renderTypeFrequencyPercentage(config);
        case "<frequency>":
            return renderTypeFrequency(config);
        case "<gradient>":
            return renderTypeGradient(config);
        case "<ident>":
            return renderTypeIdent(config);
        case "<image>":
            return renderTypeImage(config);
        case "<integer>":
            return renderTypeInteger(config);
        case "<length-percentage>":
            return renderTypeLengthPercentage(config);
        case "<length>":
            return renderTypeLength(config);
        case "<number>":
            return renderTypeNumber(config);
        case "<percentage>":
            return renderTypePercentage(config);
        case "<position>":
            return renderTypePosition(config);
        case "<ratio>":
            return renderTypeRatio(config);
        case "<resolution>":
            return renderTypeResolution(config);
        case "<shape>":
            return renderTypeShape(config);
        case "<string>":
            return renderTypeString(config);
        case "<time-percentage>":
            return renderTypeTimePercentage(config);
        case "<time>":
            return renderTypeTime(config);
        case "<timing-function>":
            return renderTypeTimingFunction(config);
        case "<transform-function>":
            return renderTypeTransformFunction(config);
        case "<url>":
            return renderTypeUrl(config);
        default:
            return renderDefault(config);
    }
}
