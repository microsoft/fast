import FastIcon from "svg/icon-brand-fast.svg";
import FluentUIIcon from "svg/icon-fluentui-temp.svg";
// import FuriousIcon from "svg/icon-furious.svg";
import VSCodeIcon from "svg/icon-vscode.svg";

export interface DesignSystemData {
    icon: string;
    url: string;
}

export const designSystemData = [
    {
        url: "https://www.fast.design/docs/design-systems/fast-frame",
        icon: FastIcon,
    },
    {
        url: "https://developer.microsoft.com/en-us/fluentui#/",
        icon: FluentUIIcon,
    },
    {
        url: "https://backlight.dev/blog/introducing-furious-a-fast-design-system/",
        icon: FastIcon, // update to FuriousIcon
    },
    {
        url: "https://code.visualstudio.com/",
        icon: VSCodeIcon,
    },
];
