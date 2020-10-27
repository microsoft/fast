/**
 * Referenced from: https://github.com/mdn/data/blob/master/index.js
 * This should be added to DefinitivelyTyped in future:
 * https://github.com/DefinitelyTyped/DefinitelyTyped
 */

type animationType =
    | "angleBasicShapeOrPath"
    | "angleOrBasicShapeOrPath"
    | "basicShapeOtherwiseNo"
    | "byComputedValueType"
    | "color"
    | "discrete"
    | "eachOfShorthandPropertiesExceptUnicodeBiDiAndDirection"
    | "filterList"
    | "fontStretch"
    | "fontWeight"
    | "integer"
    | "length"
    | "lpc"
    | "notAnimatable"
    | "numberOrLength"
    | "number"
    | "position"
    | "rectangle"
    | "repeatableListOfSimpleListOfLpc"
    | "shadowList"
    | "simpleListOfLpc"
    | "simpleListOfLpcDifferenceLpc"
    | "transform"
    | "visibility";

type computed =
    | "absoluteLength"
    | "absoluteLength0ForNone"
    | "absoluteLength0IfColumnRuleStyleNoneOrHidden"
    | "absoluteLengthOr0IfBorderBottomStyleNoneOrHidden"
    | "absoluteLengthOr0IfBorderLeftStyleNoneOrHidden"
    | "absoluteLengthOr0IfBorderRightStyleNoneOrHidden"
    | "absoluteLengthOr0IfBorderTopStyleNoneOrHidden"
    | "absoluteLengthOrAsSpecified"
    | "absoluteLengthOrKeyword"
    | "absoluteLengthOrNone"
    | "absoluteLengthOrNormal"
    | "absoluteLengthOrPercentage"
    | "absoluteLengthsSpecifiedColorAsSpecified"
    | "absoluteLengthZeroIfBorderStyleNoneOrHidden"
    | "absoluteLengthZeroOrLarger"
    | "absoluteURIOrNone"
    | "angleRoundedToNextQuarter"
    | "asAutoOrColor"
    | "asDefinedForBasicShapeWithAbsoluteURIOtherwiseAsSpecified"
    | "asLength"
    | "asSpecified"
    | "asSpecifiedAppliesToEachProperty"
    | "asSpecifiedButVisibleOrClipReplacedToAutoOrHiddenIfOtherValueDifferent"
    | "asSpecifiedExceptMatchParent"
    | "asSpecifiedExceptPositionedFloatingAndRootElementsKeywordMaybeDifferent"
    | "asSpecifiedRelativeToAbsoluteLengths"
    | "asSpecifiedURLsAbsolute"
    | "asSpecifiedWithExceptionOfResolution"
    | "asSpecifiedWithLengthsAbsoluteAndNormalComputingToZeroExceptMultiColumn"
    | "asSpecifiedWithVarsSubstituted"
    | "autoOnAbsolutelyPositionedElementsValueOfAlignItemsOnParent"
    | "autoOrRectangle"
    | "colorPlusThreeAbsoluteLengths"
    | "computedColor"
    | "consistsOfTwoDimensionKeywords"
    | "consistsOfTwoKeywordsForOriginAndOffsets"
    | "forLengthAbsoluteValueOtherwisePercentage"
    | "invertForTranslucentColorRGBAOtherwiseRGB"
    | "keywordOrNumericalValueBolderLighterTransformedToRealValue"
    | "keywordPlusIntegerIfDigits"
    | "lengthAbsolutePercentageAsSpecifiedOtherwiseAuto"
    | "listEachItemConsistingOfAbsoluteLengthPercentageAndOrigin"
    | "listEachItemHasTwoKeywordsOnePerDimension"
    | "listEachItemTwoKeywordsOriginOffsets"
    | "noneOrImageWithAbsoluteURI"
    | "normalizedAngle"
    | "normalOnElementsForPseudosNoneAbsoluteURIStringOrAsSpecified"
    | "oneToFourPercentagesOrAbsoluteLengthsPlusFill"
    | "optimumMinAndMaxValueOfAbsoluteLengthPercentageOrNormal"
    | "optimumValueOfAbsoluteLengthOrNormal"
    | "percentageAsSpecifiedAbsoluteLengthOrNone"
    | "percentageAsSpecifiedOrAbsoluteLength"
    | "percentageAutoOrAbsoluteLength"
    | "percentageOrAbsoluteLengthPlusKeywords"
    | "sameAsBoxOffsets"
    | "sameAsMaxWidthAndMaxHeight"
    | "sameAsMinWidthAndMinHeight"
    | "sameAsWidthAndHeight"
    | "specifiedIntegerOrAbsoluteLength"
    | "specifiedValueClipped0To1"
    | "specifiedValueNumberClipped0To1"
    | "translucentValuesRGBAOtherwiseRGB"
    | "twoAbsoluteLengthOrPercentages"
    | "twoAbsoluteLengths";

export type appliesto =
    | "absolutelyPositionedElements"
    | "allElements"
    | "allElementsAcceptingWidthOrHeight"
    | "allElementsAndPseudos"
    | "allElementsButNonReplacedAndTableColumns"
    | "allElementsButNonReplacedAndTableRows"
    | "allElementsCreatingNativeWindows"
    | "allElementsExceptGeneratedContentOrPseudoElements"
    | "allElementsExceptInlineBoxesAndInternalRubyOrTableBoxes"
    | "allElementsExceptInternalTableDisplayTypes"
    | "allElementsExceptNonReplacedInlineElementsTableRowsColumnsRowColumnGroups"
    | "allElementsExceptTableDisplayTypes"
    | "allElementsExceptTableElementsWhenCollapse"
    | "allElementsExceptTableRowColumnGroupsTableRowsColumns"
    | "allElementsExceptTableRowGroupsRowsColumnGroupsAndColumns"
    | "allElementsNoEffectIfDisplayNone"
    | "allElementsSomeValuesNoEffectOnNonInlineElements"
    | "allElementsSVGContainerElements"
    | "allElementsSVGContainerGraphicsAndGraphicsReferencingElements"
    | "allElementsThatCanReferenceImages"
    | "allElementsUAsNotRequiredWhenCollapse"
    | "anyElementEffectOnProgressAndMeter"
    | "beforeAndAfterPseudos"
    | "blockContainerElements"
    | "blockContainers"
    | "blockContainersAndMultiColumnContainers"
    | "blockContainersExceptMultiColumnContainers"
    | "blockContainersExceptTableWrappers"
    | "blockContainersFlexContainersGridContainers"
    | "blockElementsInNormalFlow"
    | "blockLevelElements"
    | "blockLevelBoxesAndAbsolutelyPositionedBoxesAndGridItems"
    | "boxElements"
    | "childrenOfBoxElements"
    | "directChildrenOfElementsWithDisplayMozBoxMozInlineBox"
    | "elementsWithDisplayBoxOrInlineBox"
    | "elementsWithDisplayMarker"
    | "elementsWithDisplayMozBoxMozInlineBox"
    | "elementsWithOverflowNotVisibleAndReplacedElements"
    | "exclusionElements"
    | "firstLetterPseudoElementsAndInlineLevelFirstChildren"
    | "flexContainers"
    | "flexItemsAndAbsolutelyPositionedFlexContainerChildren"
    | "flexItemsAndInFlowPseudos"
    | "flexItemsGridItemsAbsolutelyPositionedContainerChildren"
    | "flexItemsGridItemsAndAbsolutelyPositionedBoxes"
    | "floats"
    | "gridContainers"
    | "gridItemsAndBoxesWithinGridContainer"
    | "iframeElements"
    | "images"
    | "inFlowBlockLevelElements"
    | "inFlowChildrenOfBoxElements"
    | "inlineLevelAndTableCellElements"
    | "listItems"
    | "maskElements"
    | "multicolElements"
    | "multiColumnElementsFlexContainersGridContainers"
    | "multilineFlexContainers"
    | "nonReplacedBlockAndInlineBlockElements"
    | "nonReplacedBlockElements"
    | "nonReplacedElements"
    | "nonReplacedInlineElements"
    | "positionedElements"
    | "replacedElements"
    | "rubyAnnotationsContainers"
    | "rubyBasesAnnotationsBaseAnnotationContainers"
    | "sameAsMargin"
    | "sameAsWidthAndHeight"
    | "scrollContainers"
    | "scrollingBoxes"
    | "tableCaptionElements"
    | "tableCellElements"
    | "tableElements"
    | "textElements"
    | "textFields"
    | "transformableElements"
    | "xulImageElements";

type order =
    | "canonicalOrder"
    | "lengthOrPercentageBeforeKeywordIfBothPresent"
    | "lengthOrPercentageBeforeKeywords"
    | "oneOrTwoValuesLengthAbsoluteKeywordsPercentages"
    | "orderOfAppearance"
    | "percentagesOrLengthsFollowedByFill"
    | "perGrammar"
    | "uniqueOrder";

type status = "standard" | "nonstandard" | "experimental" | "obsolete";

type mediaSingle =
    | "all"
    | "aural"
    | "continuous"
    | "interactive"
    | "none"
    | "noPracticalMedia"
    | "paged"
    | "visual"
    | "visualInContinuousMediaNoEffectInOverflowColumns";

type mediaItem = "interactive" | "paged" | "visual";

type media = mediaSingle | mediaItem[];

type groupList =
    | "Basic Selectors"
    | "Combinators"
    | "Compositing and Blending"
    | "CSS Angles"
    | "CSS Animations"
    | "CSS Backgrounds and Borders"
    | "CSS Box Model"
    | "CSS Box Alignment"
    | "CSS Break"
    | "CSS Charsets"
    | "CSS Color"
    | "CSS Columns"
    | "CSS Conditional Rules"
    | "CSS Containment"
    | "CSS Counter Styles"
    | "CSS Device Adaptation"
    | "CSS Display"
    | "CSS Flexible Box Layout"
    | "CSS Flexible Lengths"
    | "CSS Fonts"
    | "CSS Fragmentation"
    | "CSS Frequencies"
    | "CSS Generated Content"
    | "CSS Grid Layout"
    | "CSS Images"
    | "CSS Inline"
    | "CSS Lengths"
    | "CSS Lists and Counters"
    | "CSS Logical Properties"
    | "CSS Masking"
    | "CSS Miscellaneous"
    | "CSS Motion Path"
    | "CSS Namespaces"
    | "CSS Overflow"
    | "CSS Pages"
    | "CSS Positioning"
    | "CSS Regions"
    | "CSS Resolutions"
    | "CSS Ruby"
    | "CSS Scroll Anchoring"
    | "CSS Scrollbars"
    | "CSS Scroll Snap"
    | "CSS Shadow Parts"
    | "CSS Shapes"
    | "CSS Speech"
    | "CSS Table"
    | "CSS Text"
    | "CSS Text Decoration"
    | "CSS Times"
    | "CSS Transforms"
    | "CSS Transitions"
    | "CSS Types"
    | "CSS Units"
    | "CSS Basic User Interface"
    | "CSS Variables"
    | "CSS Will Change"
    | "CSS Writing Modes"
    | "CSSOM View"
    | "Filter Effects"
    | "Grouping Selectors"
    | "Media Queries"
    | "Microsoft Extensions"
    | "Mozilla Extensions"
    | "Pointer Events"
    | "Pseudo-classes"
    | "Pseudo-elements"
    | "Selectors"
    | "WebKit Extensions";

export type percentages =
    | "blockSizeOfContainingBlock"
    | "dependsOnLayoutModel"
    | "inlineSizeOfContainingBlock"
    | "lengthsAsPercentages"
    | "logicalHeightOfContainingBlock"
    | "logicalWidthOfContainingBlock"
    | "maxZoomFactor"
    | "minZoomFactor"
    | "no"
    | "referToBorderBox"
    | "referToContainingBlockHeight"
    | "referToDimensionOfBorderBox"
    | "referToDimensionOfContentArea"
    | "referToElementFontSize"
    | "referToFlexContainersInnerMainSize"
    | "referToHeightOfBackgroundPositioningAreaMinusBackgroundImageHeight"
    | "referToLineBoxWidth"
    | "referToLineHeight"
    | "referToParentElementsFontSize"
    | "referToSizeOfBackgroundPositioningAreaMinusBackgroundImageSize"
    | "referToSizeOfBorderImage"
    | "referToSizeOfBoundingBox"
    | "referToSizeOfContainingBlock"
    | "referToSizeOfElement"
    | "referToSizeOfFont"
    | "referToSizeOfMaskBorderImage"
    | "referToSizeOfMaskPaintingArea"
    | "referToTotalPathLength"
    | "referToWidthAndHeightOfElement"
    | "referToWidthOfAffectedGlyph"
    | "referToWidthOfBackgroundPositioningAreaMinusBackgroundImageHeight"
    | "referToWidthOfContainingBlock"
    | "referToWidthOrHeightOfBorderImageArea"
    | "referToReferenceBoxWhenSpecifiedOtherwiseBorderBox"
    | "regardingHeightOfGeneratedBoxContainingBlockPercentages0"
    | "regardingHeightOfGeneratedBoxContainingBlockPercentagesNone"
    | "regardingHeightOfGeneratedBoxContainingBlockPercentagesRelativeToContainingBlock"
    | "relativeToBackgroundPositioningArea"
    | "relativeToMaskBorderImageArea"
    | "relativeToScrollContainerPaddingBoxAxis"
    | "relativeToTheScrollContainersScrollport"
    | "relativeToWidthAndHeight";

export interface MDNData {
    api: any;
    css: MDNCSS;
    l10n: any;
}

export interface MDNCSS {
    atRules: any;
    selectors: any;
    types: any;
    properties: MDNCSSProperty;
    syntaxes: MDNCSSSyntax;
    units: any;
}

export interface MDNCSSSyntaxConfig {
    syntax: string;
}

export interface MDNCSSSyntax {
    [key: string]: MDNCSSSyntaxConfig;
}

export interface MDNCSSPropertyConfig {
    syntax: string;
    media: media;
    inherited: boolean;
    animationType: animationType | animationType[];
    percentages: percentages;
    groups: groupList[];
    initial: string | string[];
    appliesto: appliesto;
    computed: computed;
    order: order;
    status: status;
    mdn_url: string;
    alsoAppliesTo: string[];
}

export interface MDNCSSProperty {
    [key: string]: MDNCSSPropertyConfig;
}
