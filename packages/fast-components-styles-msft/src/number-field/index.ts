import { DesignSystem, withDesignSystemDefaults } from "../design-system";
import { ComponentStyles, ComponentStyleSheet } from "@microsoft/fast-jss-manager";
import { NumberFieldClassNameContract } from "@microsoft/fast-components-class-name-contracts-base";
import { applyLocalizedProperty, Direction, toPx } from "@microsoft/fast-jss-utilities";
import { height, maxHeight, minHeight, padding } from "../utilities/density";
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
            height: height()(designSystem),
            minHeight: minHeight()(designSystem),
            maxHeight: maxHeight()(designSystem),
            padding: applyLocalizedProperty(
                `0 6px 0 ${padding()(designSystem)}`,
                `0 ${padding(2)(designSystem)} 0 6px`,
                direction
            ),
        },
    };
};

export default styles;
