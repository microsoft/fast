import React from "react";
import { ConstValueProps } from "./const-value.props";

class ConstValue extends React.Component<ConstValueProps, {}> {
    public render(): React.ReactNode {
        return (
            <button
                className={this.props.className}
                onClick={this.props.onChange}
                disabled={this.props.disabled}
            >
                <svg
                    width={"13"}
                    height={"13"}
                    viewBox={"0 0 13 13"}
                    fill={"none"}
                    xmlns={"http://www.w3.org/2000/svg"}
                >
                    <title>{this.props.strings.constValueLabel}</title>
                    <path d="M11.4375 0C11.651 0 11.8516 0.0416667 12.0391 0.125C12.2266 0.208333 12.3906 0.320312 12.5312 0.460938C12.6719 0.601562 12.7839 0.768229 12.8672 0.960938C12.9505 1.14844 12.9922 1.34896 12.9922 1.5625C12.9922 1.75521 12.9635 1.92708 12.9062 2.07812C12.8542 2.22396 12.7812 2.35938 12.6875 2.48438C12.5938 2.60938 12.487 2.72917 12.3672 2.84375C12.2474 2.95833 12.125 3.07812 12 3.20312V13H0V1H9.79688C9.92188 0.875 10.0417 0.752604 10.1562 0.632812C10.276 0.513021 10.3984 0.40625 10.5234 0.3125C10.6484 0.21875 10.7839 0.143229 10.9297 0.0859375C11.0755 0.0286458 11.2448 0 11.4375 0ZM11.4375 1C11.2865 1 11.1562 1.05469 11.0469 1.16406L3.64062 8.57031L3.375 9.625L4.42969 9.35938L11.8359 1.95312C11.9453 1.84375 12 1.71354 12 1.5625C12 1.40625 11.9427 1.27344 11.8281 1.16406C11.7188 1.05469 11.5885 1 11.4375 1ZM11 4.20312L4.94531 10.2656L2 11L2.73438 8.05469L8.79688 2H1V12H11V4.20312Z" />
                </svg>
            </button>
        );
    }
}

export default ConstValue;
