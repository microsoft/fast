import React from "react";
import {
    RenderControlConfig,
    renderAutoSuggest,
    renderSelect,
    resolveControl,
} from "./control.css.utilities";
import { Syntax } from "@microsoft/fast-tooling/dist/css-data.syntax";
import { syntaxes } from "@microsoft/fast-tooling/dist/css-data";
import { CombinatorType } from "@microsoft/fast-tooling/dist/data-utilities/mapping.mdn-data";

function renderSyntaxAlphaValue(config: RenderControlConfig): React.ReactNode {
    return null;
}

function renderSyntaxAngularColorHint(config: RenderControlConfig): React.ReactNode {
    return null;
}

function renderSyntaxAngularColorStopList(config: RenderControlConfig): React.ReactNode {
    return null;
}

function renderSyntaxAngularColorStop(config: RenderControlConfig): React.ReactNode {
    return null;
}

function renderSyntaxAnimateableFeature(config: RenderControlConfig): React.ReactNode {
    return null;
}

function renderSyntaxAttrFunction(config: RenderControlConfig): React.ReactNode {
    return null;
}

function renderSyntaxAttrMatcher(config: RenderControlConfig): React.ReactNode {
    return null;
}

function renderSyntaxAttrModifier(config: RenderControlConfig): React.ReactNode {
    return null;
}

function renderSyntaxAttributeSelector(config: RenderControlConfig): React.ReactNode {
    return null;
}

function renderSyntaxAutoRepeat(config: RenderControlConfig): React.ReactNode {
    return null;
}

function renderSyntaxAutoTrackList(config: RenderControlConfig): React.ReactNode {
    return null;
}

function renderSyntaxBaselinePosition(config: RenderControlConfig): React.ReactNode {
    const values: string[] = [, "baseline"];

    const handler = changeHandlerFactory((value: string, index: number) => {
        values[index] = value;

        config.changeHandler(values[0] ? `${values[0]} ${values[1]}` : values[1]);
    }, values);

    return renderSelect({
        ...config,
        onChangeHandler: handler(0),
        values: ["", "first", "last"],
    });
}

function renderSyntaxBasicShape(config: RenderControlConfig): React.ReactNode {
    return null;
}

function renderSyntaxBgImage(config: RenderControlConfig): React.ReactNode {
    return null;
}

function renderSyntaxBgLayer(config: RenderControlConfig): React.ReactNode {
    return null;
}

function renderSyntaxBgPosition(config: RenderControlConfig): React.ReactNode {
    return null;
}

function renderSyntaxBgSize(config: RenderControlConfig): React.ReactNode {
    return null;
}

function renderSyntaxBlendMode(config: RenderControlConfig): React.ReactNode {
    return null;
}

function renderSyntaxBlurFunction(config: RenderControlConfig): React.ReactNode {
    return null;
}

function renderSyntaxBrightnessFunction(config: RenderControlConfig): React.ReactNode {
    return null;
}

function renderSyntaxCalcFunction(config: RenderControlConfig): React.ReactNode {
    return null;
}

function renderSyntaxCalcProduct(config: RenderControlConfig): React.ReactNode {
    return null;
}

function renderSyntaxCalcSum(config: RenderControlConfig): React.ReactNode {
    return null;
}

function renderSyntaxCalcValue(config: RenderControlConfig): React.ReactNode {
    return null;
}

function renderSyntaxCfFinalImage(config: RenderControlConfig): React.ReactNode {
    return null;
}

function renderSyntaxCfMixingImage(config: RenderControlConfig): React.ReactNode {
    return null;
}

function renderSyntaxCircleFunction(config: RenderControlConfig): React.ReactNode {
    return null;
}

function renderSyntaxClampFunction(config: RenderControlConfig): React.ReactNode {
    return null;
}

function renderSyntaxClassSelector(config: RenderControlConfig): React.ReactNode {
    return null;
}

function renderSyntaxClipSource(config: RenderControlConfig): React.ReactNode {
    return null;
}

function renderSyntaxColorStopAngle(config: RenderControlConfig): React.ReactNode {
    return null;
}

function renderSyntaxColorStopLength(config: RenderControlConfig): React.ReactNode {
    return null;
}

function renderSyntaxColorStopList(config: RenderControlConfig): React.ReactNode {
    return null;
}

function renderSyntaxColorStop(config: RenderControlConfig): React.ReactNode {
    return null;
}

function renderSyntaxColor(config: RenderControlConfig): React.ReactNode {
    return (
        <span key={config.index}>
            <input type={"color"} onChange={config.onChangeHandler} />
        </span>
    );
}

function renderSyntaxCombinator(config: RenderControlConfig): React.ReactNode {
    return null;
}

function renderSyntaxCommonLigValues(config: RenderControlConfig): React.ReactNode {
    return null;
}

function renderSyntaxComplexSelectorList(config: RenderControlConfig): React.ReactNode {
    return null;
}

function renderSyntaxComplexSelector(config: RenderControlConfig): React.ReactNode {
    return null;
}

function renderSyntaxCompoundSelectorList(config: RenderControlConfig): React.ReactNode {
    return null;
}

function renderSyntaxCompoundSelector(config: RenderControlConfig): React.ReactNode {
    return null;
}

function renderSyntaxConicGradientFunction(config: RenderControlConfig): React.ReactNode {
    return null;
}

function renderSyntaxContentReplacement(config: RenderControlConfig): React.ReactNode {
    return null;
}

function renderSyntaxContextualAltValues(config: RenderControlConfig): React.ReactNode {
    return null;
}

function renderSyntaxContrastFunction(config: RenderControlConfig): React.ReactNode {
    return null;
}

function renderSyntaxCounterFunction(config: RenderControlConfig): React.ReactNode {
    return null;
}

function renderSyntaxCounterStyleName(config: RenderControlConfig): React.ReactNode {
    return null;
}

function renderSyntaxCounterStyle(config: RenderControlConfig): React.ReactNode {
    return null;
}

function renderSyntaxCountersFunction(config: RenderControlConfig): React.ReactNode {
    return null;
}

function renderSyntaxCrossFadeFunction(config: RenderControlConfig): React.ReactNode {
    return null;
}

function renderSyntaxCubicBezierTimingFunction(
    config: RenderControlConfig
): React.ReactNode {
    return null;
}

function renderSyntaxDiscretionaryLigValues(
    config: RenderControlConfig
): React.ReactNode {
    return null;
}

function renderSyntaxDisplayListitem(config: RenderControlConfig): React.ReactNode {
    return null;
}

function renderSyntaxDropShadowFunction(config: RenderControlConfig): React.ReactNode {
    return null;
}

function renderSyntaxEastAsianVariantValues(
    config: RenderControlConfig
): React.ReactNode {
    return null;
}

function renderSyntaxEastAsianWidthValues(config: RenderControlConfig): React.ReactNode {
    return null;
}

function renderSyntaxElementFunction(config: RenderControlConfig): React.ReactNode {
    return null;
}

function renderSyntaxEllipseFunction(config: RenderControlConfig): React.ReactNode {
    return null;
}

function renderSyntaxEnvFunction(config: RenderControlConfig): React.ReactNode {
    return null;
}

function renderSyntaxExplicitTrackList(config: RenderControlConfig): React.ReactNode {
    return null;
}

function renderSyntaxFamilyName(config: RenderControlConfig): React.ReactNode {
    return null;
}

function renderSyntaxFeatureTagValue(config: RenderControlConfig): React.ReactNode {
    return null;
}

function renderSyntaxFeatureType(config: RenderControlConfig): React.ReactNode {
    return null;
}

function renderSyntaxFeatureValueBlockList(config: RenderControlConfig): React.ReactNode {
    return null;
}

function renderSyntaxFeatureValueBlock(config: RenderControlConfig): React.ReactNode {
    return null;
}

function renderSyntaxFeatureValueDeclarationList(
    config: RenderControlConfig
): React.ReactNode {
    return null;
}

function renderSyntaxFeatureValueDeclaration(
    config: RenderControlConfig
): React.ReactNode {
    return null;
}

function renderSyntaxFeatureValueName(config: RenderControlConfig): React.ReactNode {
    return null;
}

function renderSyntaxFilterFunctionList(config: RenderControlConfig): React.ReactNode {
    return null;
}

function renderSyntaxFilterFunction(config: RenderControlConfig): React.ReactNode {
    return null;
}

function renderSyntaxFinalBgLayer(config: RenderControlConfig): React.ReactNode {
    return null;
}

function renderSyntaxFitContentFunction(config: RenderControlConfig): React.ReactNode {
    return null;
}

function renderSyntaxFixedBreadth(config: RenderControlConfig): React.ReactNode {
    return null;
}

function renderSyntaxFixedRepeat(config: RenderControlConfig): React.ReactNode {
    return null;
}

function renderSyntaxFixedSize(config: RenderControlConfig): React.ReactNode {
    return null;
}

function renderSyntaxFontStretchAbsolute(config: RenderControlConfig): React.ReactNode {
    return null;
}

function renderSyntaxFontVariantCss21(config: RenderControlConfig): React.ReactNode {
    return null;
}

function renderSyntaxFontWeightAbsolute(config: RenderControlConfig): React.ReactNode {
    return null;
}

function renderSyntaxFrequencyPercentage(config: RenderControlConfig): React.ReactNode {
    return null;
}

function renderSyntaxGeneralEnclosed(config: RenderControlConfig): React.ReactNode {
    return null;
}

function renderSyntaxGeometryBox(config: RenderControlConfig): React.ReactNode {
    return null;
}

function renderSyntaxGradient(config: RenderControlConfig): React.ReactNode {
    return null;
}

function renderSyntaxGrayscaleFunction(config: RenderControlConfig): React.ReactNode {
    return null;
}

function renderSyntaxGridLine(config: RenderControlConfig): React.ReactNode {
    return null;
}

function renderSyntaxHistoricalLigValues(config: RenderControlConfig): React.ReactNode {
    return null;
}

function renderSyntaxHslFunction(config: RenderControlConfig): React.ReactNode {
    return null;
}

function renderSyntaxHslaFunction(config: RenderControlConfig): React.ReactNode {
    return null;
}

function renderSyntaxHueRotateFunction(config: RenderControlConfig): React.ReactNode {
    return null;
}

function renderSyntaxHue(config: RenderControlConfig): React.ReactNode {
    return null;
}

function renderSyntaxIdSelector(config: RenderControlConfig): React.ReactNode {
    return null;
}

function renderSyntaxImageFunction(config: RenderControlConfig): React.ReactNode {
    return null;
}

function renderSyntaxImageSetFunction(config: RenderControlConfig): React.ReactNode {
    return null;
}

function renderSyntaxImageSetOption(config: RenderControlConfig): React.ReactNode {
    return null;
}

function renderSyntaxImageSrc(config: RenderControlConfig): React.ReactNode {
    return null;
}

function renderSyntaxImage(config: RenderControlConfig): React.ReactNode {
    return null;
}

function renderSyntaxInflexibleBreadth(config: RenderControlConfig): React.ReactNode {
    return null;
}

function renderSyntaxInsetFunction(config: RenderControlConfig): React.ReactNode {
    return null;
}

function renderSyntaxInvertFunction(config: RenderControlConfig): React.ReactNode {
    return null;
}

function renderSyntaxKeyframeBlockList(config: RenderControlConfig): React.ReactNode {
    return null;
}

function renderSyntaxKeyframeBlock(config: RenderControlConfig): React.ReactNode {
    return null;
}

function renderSyntaxKeyframeSelector(config: RenderControlConfig): React.ReactNode {
    return null;
}

function renderSyntaxKeyframesName(config: RenderControlConfig): React.ReactNode {
    return null;
}

function renderSyntaxLeaderFunction(config: RenderControlConfig): React.ReactNode {
    return null;
}

function renderSyntaxLeaderType(config: RenderControlConfig): React.ReactNode {
    return null;
}

function renderSyntaxLengthPercentage(config: RenderControlConfig): React.ReactNode {
    return null;
}

function renderSyntaxLineNameList(config: RenderControlConfig): React.ReactNode {
    return null;
}

function renderSyntaxLineNames(config: RenderControlConfig): React.ReactNode {
    return null;
}

function changeHandlerFactory(
    handler: (value: string, index: number) => void,
    initialValues: string[]
): (
    index: number
) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void {
    return (index: number) => {
        return (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
            handler(e.currentTarget.value, index);
        };
    };
}

function renderSyntaxLineWidth(config: RenderControlConfig): React.ReactNode {
    const values: string[] = ["0", "px"];

    const handler = changeHandlerFactory((value: string, index: number) => {
        values[index] = value;

        config.changeHandler(
            isNaN(parseInt(values[0], 10)) ? values[0] : `${values[0]}${values[1]}`
        );
    }, values);

    return (
        <span key={config.index}>
            {renderAutoSuggest({
                ...config,
                index: 1,
                onChangeHandler: handler(0),
                values: syntaxes[config.refKey].value.ref.map((ref): string => {
                    if (ref.type === "value") {
                        return ref.ref;
                    }
                }),
            })}
            {renderSelect({
                ...config,
                index: 2,
                onChangeHandler: handler(1),
                values: ["px", "em", "rem"],
            })}
        </span>
    );
}

function renderSyntaxLinearColorHint(config: RenderControlConfig): React.ReactNode {
    return null;
}

function renderSyntaxLinearColorStop(config: RenderControlConfig): React.ReactNode {
    return null;
}

function renderSyntaxLinearGradientFunction(
    config: RenderControlConfig
): React.ReactNode {
    return null;
}

function renderSyntaxMaskLayer(config: RenderControlConfig): React.ReactNode {
    return null;
}

function renderSyntaxMaskPosition(config: RenderControlConfig): React.ReactNode {
    return null;
}

function renderSyntaxMaskReference(config: RenderControlConfig): React.ReactNode {
    return null;
}

function renderSyntaxMaskSource(config: RenderControlConfig): React.ReactNode {
    return null;
}

function renderSyntaxMaskingMode(config: RenderControlConfig): React.ReactNode {
    return null;
}

function renderSyntaxMatrixFunction(config: RenderControlConfig): React.ReactNode {
    return null;
}

function renderSyntaxMatrix3dFunction(config: RenderControlConfig): React.ReactNode {
    return null;
}

function renderSyntaxMaxFunction(config: RenderControlConfig): React.ReactNode {
    return null;
}

function renderSyntaxMediaAnd(config: RenderControlConfig): React.ReactNode {
    return null;
}

function renderSyntaxMediaConditionWithoutOr(
    config: RenderControlConfig
): React.ReactNode {
    return null;
}

function renderSyntaxMediaCondition(config: RenderControlConfig): React.ReactNode {
    return null;
}

function renderSyntaxMediaFeature(config: RenderControlConfig): React.ReactNode {
    return null;
}

function renderSyntaxMediaInParens(config: RenderControlConfig): React.ReactNode {
    return null;
}

function renderSyntaxMediaNot(config: RenderControlConfig): React.ReactNode {
    return null;
}

function renderSyntaxMediaOr(config: RenderControlConfig): React.ReactNode {
    return null;
}

function renderSyntaxMediaQueryList(config: RenderControlConfig): React.ReactNode {
    return null;
}

function renderSyntaxMediaQuery(config: RenderControlConfig): React.ReactNode {
    return null;
}

function renderSyntaxMediaType(config: RenderControlConfig): React.ReactNode {
    return null;
}

function renderSyntaxMfBoolean(config: RenderControlConfig): React.ReactNode {
    return null;
}

function renderSyntaxMfName(config: RenderControlConfig): React.ReactNode {
    return null;
}

function renderSyntaxMfPlain(config: RenderControlConfig): React.ReactNode {
    return null;
}

function renderSyntaxMfRange(config: RenderControlConfig): React.ReactNode {
    return null;
}

function renderSyntaxMfValue(config: RenderControlConfig): React.ReactNode {
    return null;
}

function renderSyntaxMinFunction(config: RenderControlConfig): React.ReactNode {
    return null;
}

function renderSyntaxMinmaxFunction(config: RenderControlConfig): React.ReactNode {
    return null;
}

function renderSyntaxNamedColor(config: RenderControlConfig): React.ReactNode {
    return null;
}

function renderSyntaxNamespacePrefix(config: RenderControlConfig): React.ReactNode {
    return null;
}

function renderSyntaxNsPrefix(config: RenderControlConfig): React.ReactNode {
    return null;
}

function renderSyntaxNth(config: RenderControlConfig): React.ReactNode {
    return null;
}

function renderSyntaxNumberPercentage(config: RenderControlConfig): React.ReactNode {
    return null;
}

function renderSyntaxNumericFigureValues(config: RenderControlConfig): React.ReactNode {
    return null;
}

function renderSyntaxNumericFractionValues(config: RenderControlConfig): React.ReactNode {
    return null;
}

function renderSyntaxNumericSpacingValues(config: RenderControlConfig): React.ReactNode {
    return null;
}

function renderSyntaxOpacityFunction(config: RenderControlConfig): React.ReactNode {
    return null;
}

function renderSyntaxOutlineRadius(config: RenderControlConfig): React.ReactNode {
    return (
        <span key={config.index}>
            <input type={"number"} onChange={config.onChangeHandler} />
            px
        </span>
    );
}

function renderSyntaxOverflowPosition(config: RenderControlConfig): React.ReactNode {
    const values: string[] = ["safe", "center"];

    const handler = changeHandlerFactory((value: string, index: number) => {
        values[index] = value;

        config.changeHandler(`${values[0]} ${values[1]}`);
    }, values);

    return renderSelect({
        ...config,
        onChangeHandler: handler(0),
        values: ["safe", "unsafe"],
    });
}

function renderSyntaxPageBody(config: RenderControlConfig): React.ReactNode {
    return null;
}

function renderSyntaxPageMarginBoxType(config: RenderControlConfig): React.ReactNode {
    return null;
}

function renderSyntaxPageMarginBox(config: RenderControlConfig): React.ReactNode {
    return null;
}

function renderSyntaxPageSelectorList(config: RenderControlConfig): React.ReactNode {
    return null;
}

function renderSyntaxPageSelector(config: RenderControlConfig): React.ReactNode {
    return null;
}

function renderSyntaxPaintFunction(config: RenderControlConfig): React.ReactNode {
    return null;
}

function renderSyntaxPathFunction(config: RenderControlConfig): React.ReactNode {
    return null;
}

function renderSyntaxPerspectiveFunction(config: RenderControlConfig): React.ReactNode {
    return null;
}

function renderSyntaxPolygonFunction(config: RenderControlConfig): React.ReactNode {
    return null;
}

function renderSyntaxPosition(config: RenderControlConfig): React.ReactNode {
    return (
        <span key={config.index}>
            <input type={"number"} onChange={config.onChangeHandler} />
            px
        </span>
    );
}

function renderSyntaxPseudoClassSelector(config: RenderControlConfig): React.ReactNode {
    return null;
}

function renderSyntaxPseudoElementSelector(config: RenderControlConfig): React.ReactNode {
    return null;
}

function renderSyntaxPseudoPage(config: RenderControlConfig): React.ReactNode {
    return null;
}

function renderSyntaxRadialGradientFunction(
    config: RenderControlConfig
): React.ReactNode {
    return null;
}

function renderSyntaxRelativeSelectorList(config: RenderControlConfig): React.ReactNode {
    return null;
}

function renderSyntaxRelativeSelector(config: RenderControlConfig): React.ReactNode {
    return null;
}

function renderSyntaxRepeatStyle(config: RenderControlConfig): React.ReactNode {
    return null;
}

function renderSyntaxRepeatingLinearGradientFunction(
    config: RenderControlConfig
): React.ReactNode {
    return null;
}

function renderSyntaxRepeatingRadialGradientFunction(
    config: RenderControlConfig
): React.ReactNode {
    return null;
}

function renderSyntaxRgbFunction(config: RenderControlConfig): React.ReactNode {
    return null;
}

function renderSyntaxRgbaFunction(config: RenderControlConfig): React.ReactNode {
    return null;
}

function renderSyntaxRotateFunction(config: RenderControlConfig): React.ReactNode {
    return null;
}

function renderSyntaxRotate3dFunction(config: RenderControlConfig): React.ReactNode {
    return null;
}

function renderSyntaxRotateXFunction(config: RenderControlConfig): React.ReactNode {
    return null;
}

function renderSyntaxRotateYFunction(config: RenderControlConfig): React.ReactNode {
    return null;
}

function renderSyntaxRotateZFunction(config: RenderControlConfig): React.ReactNode {
    return null;
}

function renderSyntaxSaturateFunction(config: RenderControlConfig): React.ReactNode {
    return null;
}

function renderSyntaxScaleFunction(config: RenderControlConfig): React.ReactNode {
    return null;
}

function renderSyntaxScale3dFunction(config: RenderControlConfig): React.ReactNode {
    return null;
}

function renderSyntaxScaleXFunction(config: RenderControlConfig): React.ReactNode {
    return null;
}

function renderSyntaxScaleYFunction(config: RenderControlConfig): React.ReactNode {
    return null;
}

function renderSyntaxScaleZFunction(config: RenderControlConfig): React.ReactNode {
    return null;
}

function renderSyntaxSepiaFunction(config: RenderControlConfig): React.ReactNode {
    return null;
}

function renderSyntaxShadowT(config: RenderControlConfig): React.ReactNode {
    return null;
}

function renderSyntaxShadow(config: RenderControlConfig): React.ReactNode {
    return null;
}

function renderSyntaxShapeBox(config: RenderControlConfig): React.ReactNode {
    return null;
}

function renderSyntaxShapeRadius(config: RenderControlConfig): React.ReactNode {
    return null;
}

function renderSyntaxShape(config: RenderControlConfig): React.ReactNode {
    return null;
}

function renderSyntaxSideOrCorner(config: RenderControlConfig): React.ReactNode {
    return null;
}

function renderSyntaxSingleAnimationIterationCount(
    config: RenderControlConfig
): React.ReactNode {
    return null;
}

function renderSyntaxSingleAnimation(config: RenderControlConfig): React.ReactNode {
    return null;
}

function renderSyntaxSingleTransitionProperty(
    config: RenderControlConfig
): React.ReactNode {
    return null;
}

function renderSyntaxSingleTransition(config: RenderControlConfig): React.ReactNode {
    return null;
}

function renderSyntaxSize(config: RenderControlConfig): React.ReactNode {
    return null;
}

function renderSyntaxSkewFunction(config: RenderControlConfig): React.ReactNode {
    return null;
}

function renderSyntaxSkewXFunction(config: RenderControlConfig): React.ReactNode {
    return null;
}

function renderSyntaxSkewYFunction(config: RenderControlConfig): React.ReactNode {
    return null;
}

function renderSyntaxStepTimingFunction(config: RenderControlConfig): React.ReactNode {
    return null;
}

function renderSyntaxSubclassSelector(config: RenderControlConfig): React.ReactNode {
    return null;
}

function renderSyntaxSupportsCondition(config: RenderControlConfig): React.ReactNode {
    return null;
}

function renderSyntaxSupportsDecl(config: RenderControlConfig): React.ReactNode {
    return null;
}

function renderSyntaxSupportsFeature(config: RenderControlConfig): React.ReactNode {
    return null;
}

function renderSyntaxSupportsInParens(config: RenderControlConfig): React.ReactNode {
    return null;
}

function renderSyntaxSupportsSelectorFn(config: RenderControlConfig): React.ReactNode {
    return null;
}

function renderSyntaxSymbol(config: RenderControlConfig): React.ReactNode {
    return null;
}

function renderSyntaxTargetCounterFunction(config: RenderControlConfig): React.ReactNode {
    return null;
}

function renderSyntaxTargetCountersFunction(
    config: RenderControlConfig
): React.ReactNode {
    return null;
}

function renderSyntaxTargetTextFunction(config: RenderControlConfig): React.ReactNode {
    return null;
}

function renderSyntaxTarget(config: RenderControlConfig): React.ReactNode {
    return null;
}

function renderSyntaxTimePercentage(config: RenderControlConfig): React.ReactNode {
    return null;
}

function renderSyntaxTimingFunction(config: RenderControlConfig): React.ReactNode {
    return null;
}

function renderSyntaxTrackBreadth(config: RenderControlConfig): React.ReactNode {
    return null;
}

function renderSyntaxTrackList(config: RenderControlConfig): React.ReactNode {
    return null;
}

function renderSyntaxTrackRepeat(config: RenderControlConfig): React.ReactNode {
    return null;
}

function renderSyntaxTrackSize(config: RenderControlConfig): React.ReactNode {
    return null;
}

function renderSyntaxTransformFunction(config: RenderControlConfig): React.ReactNode {
    return null;
}

function renderSyntaxTransformList(config: RenderControlConfig): React.ReactNode {
    return null;
}

function renderSyntaxTranslateFunction(config: RenderControlConfig): React.ReactNode {
    return null;
}

function renderSyntaxTranslate3dFunction(config: RenderControlConfig): React.ReactNode {
    return null;
}

function renderSyntaxTranslateXFunction(config: RenderControlConfig): React.ReactNode {
    return null;
}

function renderSyntaxTranslateYFunction(config: RenderControlConfig): React.ReactNode {
    return null;
}

function renderSyntaxTranslateZFunction(config: RenderControlConfig): React.ReactNode {
    return null;
}

function renderSyntaxTypeSelector(config: RenderControlConfig): React.ReactNode {
    return null;
}

function renderSyntaxVarFunction(config: RenderControlConfig): React.ReactNode {
    return null;
}

function renderSyntaxViewportLength(config: RenderControlConfig): React.ReactNode {
    return null;
}

function renderWqName(config: RenderControlConfig): React.ReactNode {
    return null;
}

export function renderSyntaxControl(
    index: number,
    syntax: Syntax,
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
        refKey: syntax.slice(1, -1),
        refType: "syntax",
    };

    switch (syntax) {
        case "<absolute-size>":
            return resolveControl(config);
        case "<alpha-value>":
            return renderSyntaxAlphaValue(config);
        case "<angular-color-hint>":
            return renderSyntaxAngularColorHint(config);
        case "<angular-color-stop-list>":
            return renderSyntaxAngularColorStopList(config);
        case "<angular-color-stop>":
            return renderSyntaxAngularColorStop(config);
        case "<animateable-feature>":
            return renderSyntaxAnimateableFeature(config);
        case "<attachment>":
            return resolveControl(config);
        case "<attr()>":
            return renderSyntaxAttrFunction(config);
        case "<attr-matcher>":
            return renderSyntaxAttrMatcher(config);
        case "<attr-modifier>":
            return renderSyntaxAttrModifier(config);
        case "<attribute-selector>":
            return renderSyntaxAttributeSelector(config);
        case "<auto-repeat>":
            return renderSyntaxAutoRepeat(config);
        case "<auto-track-list>":
            return renderSyntaxAutoTrackList(config);
        case "<baseline-position>":
            return renderSyntaxBaselinePosition(config);
        case "<basic-shape>":
            return renderSyntaxBasicShape(config);
        case "<bg-image>":
            return renderSyntaxBgImage(config);
        case "<bg-layer>":
            return renderSyntaxBgLayer(config);
        case "<bg-position>":
            return renderSyntaxBgPosition(config);
        case "<bg-size>":
            return renderSyntaxBgSize(config);
        case "<blend-mode>":
            return resolveControl(config);
        case "<blur()>":
            return renderSyntaxBlurFunction(config);
        case "<box>":
            return resolveControl(config);
        case "<brightness()>":
            return renderSyntaxBrightnessFunction(config);
        case "<calc()>":
            return renderSyntaxCalcFunction(config);
        case "<calc-product>":
            return renderSyntaxCalcProduct(config);
        case "<calc-sum>":
            return renderSyntaxCalcSum(config);
        case "<calc-value>":
            return renderSyntaxCalcValue(config);
        case "<cf-final-image>":
            return renderSyntaxCfFinalImage(config);
        case "<cf-mixing-image>":
            return renderSyntaxCfMixingImage(config);
        case "<circle()>":
            return renderSyntaxCircleFunction(config);
        case "<clamp()>":
            return renderSyntaxClampFunction(config);
        case "<class-selector>":
            return renderSyntaxClassSelector(config);
        case "<clip-source>":
            return renderSyntaxClipSource(config);
        case "<color-stop-angle>":
            return renderSyntaxColorStopAngle(config);
        case "<color-stop-length>":
            return renderSyntaxColorStopLength(config);
        case "<color-stop-list>":
            return renderSyntaxColorStopList(config);
        case "<color-stop>":
            return renderSyntaxColorStop(config);
        case "<color>":
            return renderSyntaxColor(config);
        case "<combinator>":
            return renderSyntaxCombinator(config);
        case "<common-lig-values>":
            return renderSyntaxCommonLigValues(config);
        case "<compat-auto>":
            return resolveControl(config);
        case "<complex-selector-list>":
            return renderSyntaxComplexSelectorList(config);
        case "<complex-selector>":
            return renderSyntaxComplexSelector(config);
        case "<composite-style>":
        case "<compositing-operator>":
            return resolveControl(config);
        case "<compound-selector-list>":
            return renderSyntaxCompoundSelectorList(config);
        case "<compound-selector>":
            return renderSyntaxCompoundSelector(config);
        case "<conic-gradient()>":
            return renderSyntaxConicGradientFunction(config);
        case "<content-distribution>":
        case "<content-list>":
        case "<content-position>":
            return resolveControl(config);
        case "<content-replacement>":
            return renderSyntaxContentReplacement(config);
        case "<contextual-alt-values>":
            return renderSyntaxContextualAltValues(config);
        case "<contrast()>":
            return renderSyntaxContrastFunction(config);
        case "<counter()>":
            return renderSyntaxCounterFunction(config);
        case "<counter-style-name>":
            return renderSyntaxCounterStyleName(config);
        case "<counter-style>":
            return renderSyntaxCounterStyle(config);
        case "<counters()>":
            return renderSyntaxCountersFunction(config);
        case "<cross-fade()>":
            return renderSyntaxCrossFadeFunction(config);
        case "<cubic-bezier-timing-function>":
            return renderSyntaxCubicBezierTimingFunction(config);
        case "<deprecated-system-color>":
            return resolveControl(config);
        case "<discretionary-lig-values>":
            return renderSyntaxDiscretionaryLigValues(config);
        case "<display-box>":
        case "<display-inside>":
        case "<display-internal>":
        case "<display-legacy>":
            return resolveControl(config);
        case "<display-listitem>":
            return renderSyntaxDisplayListitem(config);
        case "<display-outside>":
            return resolveControl(config);
        case "<drop-shadow()>":
            return renderSyntaxDropShadowFunction(config);
        case "<east-asian-variant-values>":
            return renderSyntaxEastAsianVariantValues(config);
        case "<east-asian-width-values>":
            return renderSyntaxEastAsianWidthValues(config);
        case "<element()>":
            return renderSyntaxElementFunction(config);
        case "<ellipse()>":
            return renderSyntaxEllipseFunction(config);
        case "<ending-shape>":
            return resolveControl(config);
        case "<env()>":
            return renderSyntaxEnvFunction(config);
        case "<explicit-track-list>":
            return renderSyntaxExplicitTrackList(config);
        case "<family-name>":
            return renderSyntaxFamilyName(config);
        case "<feature-tag-value>":
            return renderSyntaxFeatureTagValue(config);
        case "<feature-type>":
            return renderSyntaxFeatureType(config);
        case "<feature-value-block-list>":
            return renderSyntaxFeatureValueBlockList(config);
        case "<feature-value-block>":
            return renderSyntaxFeatureValueBlock(config);
        case "<feature-value-declaration-list>":
            return renderSyntaxFeatureValueDeclarationList(config);
        case "<feature-value-declaration>":
            return renderSyntaxFeatureValueDeclaration(config);
        case "<feature-value-name>":
            return renderSyntaxFeatureValueName(config);
        case "<fill-rule>":
            return resolveControl(config);
        case "<filter-function-list>":
            return renderSyntaxFilterFunctionList(config);
        case "<filter-function>":
            return renderSyntaxFilterFunction(config);
        case "<final-bg-layer>":
            return renderSyntaxFinalBgLayer(config);
        case "<fit-content()>":
            return renderSyntaxFitContentFunction(config);
        case "<fixed-breadth>":
            return renderSyntaxFixedBreadth(config);
        case "<fixed-repeat>":
            return renderSyntaxFixedRepeat(config);
        case "<fixed-size>":
            return renderSyntaxFixedSize(config);
        case "<font-stretch-absolute>":
            return renderSyntaxFontStretchAbsolute(config);
        case "<font-variant-css21>":
            return renderSyntaxFontVariantCss21(config);
        case "<font-weight-absolute>":
            return renderSyntaxFontWeightAbsolute(config);
        case "<frequency-percentage>":
            return renderSyntaxFrequencyPercentage(config);
        case "<general-enclosed>":
            return renderSyntaxGeneralEnclosed(config);
        case "<generic-family>":
        case "<generic-name>":
            return resolveControl(config);
        case "<geometry-box>":
            return renderSyntaxGeometryBox(config);
        case "<gradient>":
            return renderSyntaxGradient(config);
        case "<grayscale()>":
            return renderSyntaxGrayscaleFunction(config);
        case "<grid-line>":
            return renderSyntaxGridLine(config);
        case "<historical-lig-values>":
            return renderSyntaxHistoricalLigValues(config);
        case "<hsl()>":
            return renderSyntaxHslFunction(config);
        case "<hsla()>":
            return renderSyntaxHslaFunction(config);
        case "<hue-rotate()>":
            return renderSyntaxHueRotateFunction(config);
        case "<hue>":
            return renderSyntaxHue(config);
        case "<id-selector>":
            return renderSyntaxIdSelector(config);
        case "<image()>":
            return renderSyntaxImageFunction(config);
        case "<image-set()>":
            return renderSyntaxImageSetFunction(config);
        case "<image-set-option>":
            return renderSyntaxImageSetOption(config);
        case "<image-src>":
            return renderSyntaxImageSrc(config);
        case "<image-tags>":
            return resolveControl(config);
        case "<image>":
            return renderSyntaxImage(config);
        case "<inflexible-breadth>":
            return renderSyntaxInflexibleBreadth(config);
        case "<inset()>":
            return renderSyntaxInsetFunction(config);
        case "<invert()>":
            return renderSyntaxInvertFunction(config);
        case "<keyframe-block-list>":
            return renderSyntaxKeyframeBlockList(config);
        case "<keyframe-block>":
            return renderSyntaxKeyframeBlock(config);
        case "<keyframe-selector>":
            return renderSyntaxKeyframeSelector(config);
        case "<keyframes-name>":
            return renderSyntaxKeyframesName(config);
        case "<leader()>":
            return renderSyntaxLeaderFunction(config);
        case "<leader-type>":
            return renderSyntaxLeaderType(config);
        case "<length-percentage>":
            return renderSyntaxLengthPercentage(config);
        case "<line-name-list>":
            return renderSyntaxLineNameList(config);
        case "<line-names>":
            return renderSyntaxLineNames(config);
        case "<line-style>":
            return resolveControl(config);
        case "<line-width>":
            return renderSyntaxLineWidth(config);
        case "<linear-color-hint>":
            return renderSyntaxLinearColorHint(config);
        case "<linear-color-stop>":
            return renderSyntaxLinearColorStop(config);
        case "<linear-gradient()>":
            return renderSyntaxLinearGradientFunction(config);
        case "<mask-layer>":
            return renderSyntaxMaskLayer(config);
        case "<mask-position>":
            return renderSyntaxMaskPosition(config);
        case "<mask-reference>":
            return renderSyntaxMaskReference(config);
        case "<mask-source>":
            return renderSyntaxMaskSource(config);
        case "<masking-mode>":
            return renderSyntaxMaskingMode(config);
        case "<matrix()>":
            return renderSyntaxMatrixFunction(config);
        case "<matrix3d()>":
            return renderSyntaxMatrix3dFunction(config);
        case "<max()>":
            return renderSyntaxMaxFunction(config);
        case "<media-and>":
            return renderSyntaxMediaAnd(config);
        case "<media-condition-without-or>":
            return renderSyntaxMediaConditionWithoutOr(config);
        case "<media-condition>":
            return renderSyntaxMediaCondition(config);
        case "<media-feature>":
            return renderSyntaxMediaFeature(config);
        case "<media-in-parens>":
            return renderSyntaxMediaInParens(config);
        case "<media-not>":
            return renderSyntaxMediaNot(config);
        case "<media-or>":
            return renderSyntaxMediaOr(config);
        case "<media-query-list>":
            return renderSyntaxMediaQueryList(config);
        case "<media-query>":
            return renderSyntaxMediaQuery(config);
        case "<media-type>":
            return renderSyntaxMediaType(config);
        case "<mf-boolean>":
            return renderSyntaxMfBoolean(config);
        case "<mf-name>":
            return renderSyntaxMfName(config);
        case "<mf-plain>":
            return renderSyntaxMfPlain(config);
        case "<mf-range>":
            return renderSyntaxMfRange(config);
        case "<mf-value>":
            return renderSyntaxMfValue(config);
        case "<min()>":
            return renderSyntaxMinFunction(config);
        case "<minmax()>":
            return renderSyntaxMinmaxFunction(config);
        case "<named-color>":
            return resolveControl(config);
        case "<namespace-prefix>":
            return renderSyntaxNamespacePrefix(config);
        case "<ns-prefix>":
            return renderSyntaxNsPrefix(config);
        case "<nth>":
            return renderSyntaxNth(config);
        case "<number-percentage>":
            return renderSyntaxNumberPercentage(config);
        case "<numeric-figure-values>":
            return renderSyntaxNumericFigureValues(config);
        case "<numeric-fraction-values>":
            return renderSyntaxNumericFractionValues(config);
        case "<numeric-spacing-values>":
            return renderSyntaxNumericSpacingValues(config);
        case "<opacity()>":
            return renderSyntaxOpacityFunction(config);
        case "<outline-radius>":
            return renderSyntaxOutlineRadius(config);
        case "<overflow-position>":
            return renderSyntaxOverflowPosition(config);
        case "<page-body>":
            return renderSyntaxPageBody(config);
        case "<page-margin-box-type>":
            return renderSyntaxPageMarginBoxType(config);
        case "<page-margin-box>":
            return renderSyntaxPageMarginBox(config);
        case "<page-selector-list>":
            return renderSyntaxPageSelectorList(config);
        case "<page-selector>":
            return renderSyntaxPageSelector(config);
        case "<paint()>":
            return renderSyntaxPaintFunction(config);
        case "<path()>":
            return renderSyntaxPathFunction(config);
        case "<perspective()>":
            return renderSyntaxPerspectiveFunction(config);
        case "<polygon()>":
            return renderSyntaxPolygonFunction(config);
        case "<position>":
            return renderSyntaxPosition(config);
        case "<pseudo-class-selector>":
            return renderSyntaxPseudoClassSelector(config);
        case "<pseudo-element-selector>":
            return renderSyntaxPseudoElementSelector(config);
        case "<pseudo-page>":
            return renderSyntaxPseudoPage(config);
        case "<quote>":
            return resolveControl(config);
        case "<radial-gradient()>":
            return renderSyntaxRadialGradientFunction(config);
        case "<relative-selector-list>":
            return renderSyntaxRelativeSelectorList(config);
        case "<relative-selector>":
            return renderSyntaxRelativeSelector(config);
        case "<relative-size>":
            return resolveControl(config);
        case "<repeat-style>":
            return renderSyntaxRepeatStyle(config);
        case "<repeating-linear-gradient()>":
            return renderSyntaxRepeatingLinearGradientFunction(config);
        case "<repeating-radial-gradient()>":
            return renderSyntaxRepeatingRadialGradientFunction(config);
        case "<rgb()>":
            return renderSyntaxRgbFunction(config);
        case "<rgba()>":
            return renderSyntaxRgbaFunction(config);
        case "<rotate()>":
            return renderSyntaxRotateFunction(config);
        case "<rotate3d()>":
            return renderSyntaxRotate3dFunction(config);
        case "<rotateX()>":
            return renderSyntaxRotateXFunction(config);
        case "<rotateY()>":
            return renderSyntaxRotateYFunction(config);
        case "<rotateZ()>":
            return renderSyntaxRotateZFunction(config);
        case "<saturate()>":
            return renderSyntaxSaturateFunction(config);
        case "<scale()>":
            return renderSyntaxScaleFunction(config);
        case "<scale3d()>":
            return renderSyntaxScale3dFunction(config);
        case "<scaleX()>":
            return renderSyntaxScaleXFunction(config);
        case "<scaleY()>":
            return renderSyntaxScaleYFunction(config);
        case "<scaleZ()>":
            return renderSyntaxScaleZFunction(config);
        case "<self-position>":
            return resolveControl(config);
        case "<sepia()>":
            return renderSyntaxSepiaFunction(config);
        case "<shadow-t>":
            return renderSyntaxShadowT(config);
        case "<shadow>":
            return renderSyntaxShadow(config);
        case "<shape-box>":
            return renderSyntaxShapeBox(config);
        case "<shape-radius>":
            return renderSyntaxShapeRadius(config);
        case "<shape>":
            return renderSyntaxShape(config);
        case "<side-or-corner>":
            return renderSyntaxSideOrCorner(config);
        case "<single-animation-direction>":
        case "<single-animation-fill-mode>":
            return resolveControl(config);
        case "<single-animation-iteration-count>":
            return renderSyntaxSingleAnimationIterationCount(config);
        case "<single-animation-play-state>":
            return resolveControl(config);
        case "<single-animation>":
            return renderSyntaxSingleAnimation(config);
        case "<single-transition-property>":
            return renderSyntaxSingleTransitionProperty(config);
        case "<single-transition>":
            return renderSyntaxSingleTransition(config);
        case "<size>":
            return renderSyntaxSize(config);
        case "<skew()>":
            return renderSyntaxSkewFunction(config);
        case "<skewX()>":
            return renderSyntaxSkewXFunction(config);
        case "<skewY()>":
            return renderSyntaxSkewYFunction(config);
        case "<step-position>":
            return resolveControl(config);
        case "<step-timing-function>":
            return renderSyntaxStepTimingFunction(config);
        case "<subclass-selector>":
            return renderSyntaxSubclassSelector(config);
        case "<supports-condition>":
            return renderSyntaxSupportsCondition(config);
        case "<supports-decl>":
            return renderSyntaxSupportsDecl(config);
        case "<supports-feature>":
            return renderSyntaxSupportsFeature(config);
        case "<supports-in-parens>":
            return renderSyntaxSupportsInParens(config);
        case "<supports-selector-fn>":
            return renderSyntaxSupportsSelectorFn(config);
        case "<symbol>":
            return renderSyntaxSymbol(config);
        case "<target-counter()>":
            return renderSyntaxTargetCounterFunction(config);
        case "<target-counters()>":
            return renderSyntaxTargetCountersFunction(config);
        case "<target-text()>":
            return renderSyntaxTargetTextFunction(config);
        case "<target>":
            return renderSyntaxTarget(config);
        case "<time-percentage>":
            return renderSyntaxTimePercentage(config);
        case "<timing-function>":
            return renderSyntaxTimingFunction(config);
        case "<track-breadth>":
            return renderSyntaxTrackBreadth(config);
        case "<track-list>":
            return renderSyntaxTrackList(config);
        case "<track-repeat>":
            return renderSyntaxTrackRepeat(config);
        case "<track-size>":
            return renderSyntaxTrackSize(config);
        case "<transform-function>":
            return renderSyntaxTransformFunction(config);
        case "<transform-list>":
            return renderSyntaxTransformList(config);
        case "<translate()>":
            return renderSyntaxTranslateFunction(config);
        case "<translate3d()>":
            return renderSyntaxTranslate3dFunction(config);
        case "<translateX()>":
            return renderSyntaxTranslateXFunction(config);
        case "<translateY()>":
            return renderSyntaxTranslateYFunction(config);
        case "<translateZ()>":
            return renderSyntaxTranslateZFunction(config);
        case "<type-or-unit>":
            return resolveControl(config);
        case "<type-selector>":
            return renderSyntaxTypeSelector(config);
        case "<var()>":
            return renderSyntaxVarFunction(config);
        case "<viewport-length>":
            return renderSyntaxViewportLength(config);
        case "<wq-name>":
            return renderWqName(config);
        default:
            return resolveControl(config);
    }
}
