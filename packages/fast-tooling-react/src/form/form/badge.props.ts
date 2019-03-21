import { BadgeType } from "./form-item.props";

export interface BadgeProps {
    /**
     * The HTML class to assign to the badge
     */
    className?: string;

    /**
     * The description which is used as a tooltip
     */
    description?: string;
}

export interface BadgeControlProps extends BadgeProps {
    /**
     * The badge to use
     */
    type: BadgeType;
}
