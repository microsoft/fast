import { DesignSystem, withDesignSystemDefaults } from "../design-system";
import { ComponentStyles, ComponentStyleSheet } from "@microsoft/fast-jss-manager";
import { NumberFieldClassNameContract } from "@microsoft/fast-components-class-name-contracts-base";
import { applyLocalizedProperty, Direction, toPx } from "@microsoft/fast-jss-utilities";
import { density } from "../utilities/density";
import { defaultHeight, maxHeight, minHeight } from "../utilities/height";
import { inputFieldStyles } from "../patterns/input-field";

/* tslint:disable-next-line */
const styles: ComponentStyles<NumberFieldClassNameContract, DesignSystem> = (
    config: DesignSystem
): ComponentStyleSheet<NumberFieldClassNameContract, DesignSystem> => {
    const designSystem: DesignSystem = withDesignSystemDefaults(config);
    const direction: Direction = designSystem.direction;

    return {
        numberField: {
            ...inputFieldStyles(designSystem),
            height: density(defaultHeight)(designSystem),
            minHeight: toPx(minHeight),
            maxHeight: toPx(maxHeight),
            padding: applyLocalizedProperty(
                "6px 6px 6px 12px",
                "6px 12px 6px 6px",
                direction
            ),
        },
    };
};

export default styles;
