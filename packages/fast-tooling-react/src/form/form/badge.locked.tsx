import React from "react";
import BaseBadge from "./badge.base";
import { BadgeProps } from "./badge.props";

export default class LockedBadge extends BaseBadge<BadgeProps, {}> {
    public static displayName: string = "LockedBadge";

    public render(): React.ReactNode {
        return (
            <svg
                className={this.props.className}
                width="12"
                height="16"
                viewBox="0 0 12 16"
                xmlns="http://www.w3.org/2000/svg"
            >
                {this.renderTitle()}
                <path d="M12 7V16H0V7H2V4.07812C2 3.51562 2.10156 2.98698 2.30469 2.49219C2.50781 1.9974 2.78906 1.5651 3.14844 1.19531C3.50781 0.825521 3.92969 0.533854 4.41406 0.320312C4.90365 0.106771 5.43229 0 6 0C6.56771 0 7.09375 0.106771 7.57812 0.320312C8.06771 0.533854 8.49219 0.825521 8.85156 1.19531C9.21094 1.5651 9.49219 1.9974 9.69531 2.49219C9.89844 2.98698 10 3.51562 10 4.07812V7H12ZM3 7H9V4.07812C9 3.65625 8.92448 3.26042 8.77344 2.89062C8.6224 2.51562 8.41146 2.1875 8.14062 1.90625C7.875 1.625 7.55729 1.40365 7.1875 1.24219C6.82292 1.08073 6.42708 1 6 1C5.57292 1 5.17448 1.08073 4.80469 1.24219C4.4401 1.40365 4.1224 1.625 3.85156 1.90625C3.58594 2.1875 3.3776 2.51562 3.22656 2.89062C3.07552 3.26042 3 3.65625 3 4.07812V7ZM11 8H1V15H11V8Z" />
            </svg>
        );
    }
}
