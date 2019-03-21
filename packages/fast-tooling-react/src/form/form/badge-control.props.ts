import { BadgeType } from "./form-item.props";

export interface BadgeControlProps {
    /**
     * The badge to use
     */
    type: BadgeType;

    /**
     * The HTML class to assign to the badge
     */
    className?: string;

    /**
     * The description which is used as a tooltip
     */
    description?: string;
}
