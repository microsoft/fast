import { BadgeClassNameContract as BaseBadgeClassNameContract } from "@microsoft/fast-components-class-name-contracts-base";

/**
 * The class name contract for the badge component
 */
export interface BadgeClassNameContract extends BaseBadgeClassNameContract {
    /**
     * The small size
     */
    badge__small?: string;

    /**
     * The large size
     */
    badge__large?: string;

    /**
     * The filled backplate appearance style
     */
    badge__filled: string;
}
