import React from "react";
import { ColorsDesignSystem } from "./design-system";
import { ComponentTypes } from "./state";
interface ColorBlocksClassNameContract {
    colorBlocks: string;
    colorBlocks_title: string;
    colorBlocks_content: string;
    colorBlocks_example: string;
}
interface ColorBlocksManagedClasses {
    managedClasses: ColorBlocksClassNameContract;
}
interface ColorBlocksProps extends ColorBlocksManagedClasses {
    index: number;
    component: ComponentTypes;
    designSystem: ColorsDesignSystem;
    backgroundColor: string;
    title?: string;
}
declare const _default: React.ComponentClass<
    import("@microsoft/fast-jss-manager-react").ManagedJSSProps<
        Pick<ColorBlocksProps, "title" | "backgroundColor" | "managedClasses" | "index">,
        ColorBlocksClassNameContract,
        ColorsDesignSystem
    >,
    any
>;
export default _default;
