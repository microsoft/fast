import {
    VirtualizingStack,
    virtualizingStackTemplate as template,
} from "@microsoft/fast-foundation";
import { virtualizingStackStyles as styles } from "./virtualizing-stack.styles";

/**
 * A function that returns a {@link @microsoft/fast-foundation#VirtualizingStack} registration for configuring the component with a DesignSystem.
 * Implements {@link @microsoft/fast-foundation#virtualizingStackTemplate}
 *
 *
 * @beta
 * @remarks
 * Generates HTML Element: \<fast-virtualizing-stack\>
 */
export const fastVirtualizingStack = VirtualizingStack.compose({
    baseName: "virtualizing-stack",
    template,
    styles,
});

/**
 * Styles for VirtualizingStack
 * @public
 */
export const virtualizingStackStyles = styles;

/**
 * Base class for VirtualizingStack
 * @public
 */
export { VirtualizingStack };
