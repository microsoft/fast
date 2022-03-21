import FastIcon from "svg/icon-brand.svg";
// import FluentUIIcon from "svg/icon-fluentui-temp.svg";
// import FuriousIcon from "svg/icon-furious.svg";
import VSCodeIcon from "svg/icon-vscode.svg";

export interface DesignSystemData {
    icon: string;
    url: string;
    label: string;
}

export const designSystemData = [
    {
        url: "https://www.fast.design/docs/design-systems/fast-frame",
        icon: FastIcon,
        label: "FAST Frame",
    },
    {
        url: "https://developer.microsoft.com/en-us/fluentui#/",
        icon: FastIcon,
        label: "Fluent UI",
    },
    {
        url: "https://backlight.dev/blog/introducing-furious-a-fast-design-system/",
        icon: FastIcon, // update to FuriousIcon
        label: "Furious",
    },
    {
        url: "https://code.visualstudio.com/",
        icon: VSCodeIcon,
        label: "VS Code",
    },
];
