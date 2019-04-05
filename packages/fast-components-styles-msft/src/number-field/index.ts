import { DesignSystem, withDesignSystemDefaults } from "../design-system";
import { ComponentStyles, ComponentStyleSheet } from "@microsoft/fast-jss-manager";
import { NumberFieldClassNameContract } from "@microsoft/fast-components-class-name-contracts-base";
import { Direction, localizeSpacing } from "@microsoft/fast-jss-utilities";
import { height, horizontalSpacing } from "../utilities/density";
import { inputFieldStyles } from "../patterns/input-field";
import { format } from "../utilities/format";

/* tslint:disable-next-line */
const styles: ComponentStyles<NumberFieldClassNameContract, DesignSystem> = (
    config: DesignSystem
): ComponentStyleSheet<NumberFieldClassNameContract, DesignSystem> => {
    const designSystem: DesignSystem = withDesignSystemDefaults(config);
    const direction: Direction = designSystem.direction;

    return {
        numberField: {
            ...inputFieldStyles(designSystem),
            height: height(),
            padding: localizeSpacing(direction)(
                format("0 6px 0 {0}", horizontalSpacing())(designSystem)
            ),
        },
    };
};

export default styles;
