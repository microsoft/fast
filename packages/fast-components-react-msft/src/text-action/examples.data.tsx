import * as React from "react";
import { TextAction, TextActionProps } from "./index";
import schema from "./text-action.schema.json";
import Documentation from "./.tmp/documentation";
import { ComponentFactoryExample } from "@microsoft/fast-development-site-react";
import { Button } from "../button";
import { ButtonAppearance } from "../button/button.props";
import { TextActionButtonPosition } from "./text-action.props";

const svgProperties: any = {
    width: "16",
    height: "16",
    viewBox: "0 0 16 16",
    xmlns: "http://www.w3.org/2000/svg",
};

const userGlyph: React.ReactNode = (classname?: string): React.ReactNode => {
    return (
        <svg {...svgProperties} className={classname}>
            <path d="M10.3906 9.39844C11.099 9.64323 11.737 9.98698 12.3047 10.4297C12.8776 10.8672 13.362 11.375 13.7578 11.9531C14.1589 12.5312 14.4661 13.1641 14.6797 13.8516C14.8932 14.5391 15 15.2552 15 16H14C14 15.1458 13.8464 14.3542 13.5391 13.625C13.237 12.8906 12.8177 12.2552 12.2812 11.7188C11.7448 11.1823 11.1094 10.763 10.375 10.4609C9.64583 10.1536 8.85417 10 8 10C7.44271 10 6.90625 10.0703 6.39062 10.2109C5.875 10.3516 5.39323 10.5521 4.94531 10.8125C4.5026 11.0677 4.09896 11.3776 3.73438 11.7422C3.375 12.1016 3.0651 12.5052 2.80469 12.9531C2.54948 13.3958 2.35156 13.875 2.21094 14.3906C2.07031 14.9062 2 15.4427 2 16H1C1 15.25 1.10938 14.5339 1.32812 13.8516C1.54688 13.1641 1.85677 12.5339 2.25781 11.9609C2.65885 11.388 3.14323 10.8828 3.71094 10.4453C4.28385 10.0078 4.92188 9.66146 5.625 9.40625C5.21875 9.1875 4.85417 8.92188 4.53125 8.60938C4.20833 8.29688 3.93229 7.95052 3.70312 7.57031C3.47917 7.1849 3.30469 6.77604 3.17969 6.34375C3.0599 5.90625 3 5.45833 3 5C3 4.30729 3.13021 3.65885 3.39062 3.05469C3.65104 2.44531 4.00781 1.91406 4.46094 1.46094C4.91406 1.00781 5.44271 0.651042 6.04688 0.390625C6.65625 0.130208 7.30729 0 8 0C8.69271 0 9.34115 0.130208 9.94531 0.390625C10.5547 0.651042 11.0859 1.00781 11.5391 1.46094C11.9922 1.91406 12.349 2.44531 12.6094 3.05469C12.8698 3.65885 13 4.30729 13 5C13 5.45833 12.9375 5.90365 12.8125 6.33594C12.6927 6.76823 12.5182 7.17448 12.2891 7.55469C12.0651 7.9349 11.7917 8.28385 11.4688 8.60156C11.151 8.91406 10.7917 9.17969 10.3906 9.39844ZM4 5C4 5.55208 4.10417 6.07031 4.3125 6.55469C4.52604 7.03906 4.8125 7.46354 5.17188 7.82812C5.53646 8.1875 5.96094 8.47396 6.44531 8.6875C6.92969 8.89583 7.44792 9 8 9C8.55208 9 9.07031 8.89583 9.55469 8.6875C10.0391 8.47396 10.4609 8.1875 10.8203 7.82812C11.1849 7.46354 11.4714 7.03906 11.6797 6.55469C11.8932 6.07031 12 5.55208 12 5C12 4.44792 11.8932 3.92969 11.6797 3.44531C11.4714 2.96094 11.1849 2.53906 10.8203 2.17969C10.4609 1.8151 10.0391 1.52865 9.55469 1.32031C9.07031 1.10677 8.55208 1 8 1C7.44792 1 6.92969 1.10677 6.44531 1.32031C5.96094 1.52865 5.53646 1.8151 5.17188 2.17969C4.8125 2.53906 4.52604 2.96094 4.3125 3.44531C4.10417 3.92969 4 4.44792 4 5Z" />
        </svg>
    );
};

const downLoadGlyph: React.ReactNode = (classname?: string): React.ReactNode => {
    return (
        <svg {...svgProperties} className={classname}>
            <path d="M3 16V15H12V16H3ZM12.3516 8.35156L7.5 13.2422L2.64844 8.35156L3.35156 7.64844L7 11.3203V0H8V11.3203L11.6484 7.64844L12.3516 8.35156Z" />
        </svg>
    );
};

const arrowDark: React.ReactNode = (
    classname?: string,
    disabled?: boolean
): React.ReactNode => {
    return (
        <Button className={classname} disabled={disabled}>
            <svg {...svgProperties}>
                <path d="M5.85547 13.8535L5.14648 13.1445L10.291 8L5.14648 2.85547L5.85547 2.14648L11.709 8L5.85547 13.8535Z" />
            </svg>
        </Button>
    );
};

const arrowLight: React.ReactNode = (
    <svg {...svgProperties}>
        <path d="M5.85547 13.8535L5.14648 13.1445L10.291 8L5.14648 2.85547L5.85547 2.14648L11.709 8L5.85547 13.8535Z" />
    </svg>
);

const testButton: React.ReactNode = (
    classname?: string,
    disabled?: boolean
): React.ReactNode => {
    return (
        <Button className={classname} disabled={disabled}>
            {"Text action"}
        </Button>
    );
};

export default {
    name: "Text action",
    component: TextAction,
    schema: schema as any,
    documentation: <Documentation />,
    detailData: {
        placeholder: "Placeholder",
        button: (classname?: string, disabled?: boolean): React.ReactNode => {
            return (
                <Button type={"submit"} className={classname} disabled={disabled}>
                    {"Text action"}
                </Button>
            );
        },
        beforeGlyph: userGlyph,
    },
    data: [
        {
            title: "Search",
            button: testButton,
            beforeGlyph: (classname?: string): React.ReactNode => {
                return (
                    <svg {...svgProperties} className={classname}>
                        <path d="M10.5 0C11.0052 0 11.4922 0.0651042 11.9609 0.195312C12.4297 0.325521 12.8672 0.510417 13.2734 0.75C13.6797 0.989583 14.0495 1.27865 14.3828 1.61719C14.7214 1.95052 15.0104 2.32031 15.25 2.72656C15.4896 3.13281 15.6745 3.57031 15.8047 4.03906C15.9349 4.50781 16 4.99479 16 5.5C16 6.00521 15.9349 6.49219 15.8047 6.96094C15.6745 7.42969 15.4896 7.86719 15.25 8.27344C15.0104 8.67969 14.7214 9.05208 14.3828 9.39062C14.0495 9.72396 13.6797 10.0104 13.2734 10.25C12.8672 10.4896 12.4297 10.6745 11.9609 10.8047C11.4922 10.9349 11.0052 11 10.5 11C9.84896 11 9.22396 10.8906 8.625 10.6719C8.03125 10.4531 7.48438 10.138 6.98438 9.72656L0.851562 15.8516C0.752604 15.9505 0.635417 16 0.5 16C0.364583 16 0.247396 15.9505 0.148438 15.8516C0.0494792 15.7526 0 15.6354 0 15.5C0 15.3646 0.0494792 15.2474 0.148438 15.1484L6.27344 9.01562C5.86198 8.51562 5.54688 7.96875 5.32812 7.375C5.10938 6.77604 5 6.15104 5 5.5C5 4.99479 5.0651 4.50781 5.19531 4.03906C5.32552 3.57031 5.51042 3.13281 5.75 2.72656C5.98958 2.32031 6.27604 1.95052 6.60938 1.61719C6.94792 1.27865 7.32031 0.989583 7.72656 0.75C8.13281 0.510417 8.57031 0.325521 9.03906 0.195312C9.50781 0.0651042 9.99479 0 10.5 0ZM10.5 10C11.1198 10 11.7031 9.88281 12.25 9.64844C12.7969 9.40885 13.2734 9.08594 13.6797 8.67969C14.0859 8.27344 14.4062 7.79688 14.6406 7.25C14.8802 6.70312 15 6.11979 15 5.5C15 4.88021 14.8802 4.29688 14.6406 3.75C14.4062 3.20312 14.0859 2.72656 13.6797 2.32031C13.2734 1.91406 12.7969 1.59375 12.25 1.35938C11.7031 1.11979 11.1198 1 10.5 1C9.88021 1 9.29688 1.11979 8.75 1.35938C8.20312 1.59375 7.72656 1.91406 7.32031 2.32031C6.91406 2.72656 6.59115 3.20312 6.35156 3.75C6.11719 4.29688 6 4.88021 6 5.5C6 6.11979 6.11719 6.70312 6.35156 7.25C6.59115 7.79688 6.91406 8.27344 7.32031 8.67969C7.72656 9.08594 8.20312 9.40885 8.75 9.64844C9.29688 9.88281 9.88021 10 10.5 10Z" />
                    </svg>
                );
            },
        },
        {
            disabled: true,
            button: testButton,
            beforeGlyph: (classname?: string): React.ReactNode => {
                return (
                    <svg {...svgProperties} className={classname}>
                        <path d="M5.85547 13.8535L5.14648 13.1445L10.291 8L5.14648 2.85547L5.85547 2.14648L11.709 8L5.85547 13.8535Z" />
                    </svg>
                );
            },
        },
        {
            defaultValue: "foo",
            button: testButton,
        },
        {
            button: arrowDark,
            beforeGlyph: userGlyph,
        },
        {
            buttonPosition: TextActionButtonPosition.before,
            button: arrowDark,
            afterGlyph: downLoadGlyph,
        },
        {
            button: (
                classname?: string,
                disabled?: boolean,
                appearance?: ButtonAppearance
            ): React.ReactNode => {
                return (
                    <Button
                        className={classname}
                        disabled={disabled}
                        appearance={ButtonAppearance.primary}
                    >
                        {arrowLight}
                    </Button>
                );
            },
        },
        {
            afterGlyph: downLoadGlyph,
        },
        {
            buttonPosition: TextActionButtonPosition.before,
            button: (
                classname?: string,
                disabled?: boolean,
                appearance?: ButtonAppearance
            ): React.ReactNode => {
                return (
                    <Button
                        className={classname}
                        disabled={disabled}
                        appearance={ButtonAppearance.primary}
                    >
                        {arrowLight}
                    </Button>
                );
            },
            beforeGlyph: userGlyph,
        },
    ],
} as ComponentFactoryExample<TextActionProps>;
