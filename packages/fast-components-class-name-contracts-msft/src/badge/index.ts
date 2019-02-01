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
     * The lowlight appearance style
     */
    badge__lowlight: string;

    /**
     * The highlight appearance style
     */
    badge__highlight: string;

    /**
     * The accent appearance style
     */
    badge__accent: string;
}
