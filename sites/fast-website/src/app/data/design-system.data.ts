import FastIcon from "svg/icon-brand.svg";
import FluentUIIcon from "svg/icon-fluentui.svg";
// import FuriousIcon from "svg/icon-furious.svg";
import VSCodeIcon from "svg/icon-vscode.svg";

export interface DesignSystemData {
    icon: string;
    url: string;
    anchorText: string;
}

export const designSystemData = [
    {
        url: "https://www.fast.design/docs/design-systems/fast-frame",
        anchorText: "FAST Frame",
        icon: FastIcon,
    },
    {
        url: "https://developer.microsoft.com/en-us/fluentui#/",
        anchorText: "Fluent UI",
        icon: FluentUIIcon,
    },
    {
        url: "https://backlight.dev/blog/introducing-furious-a-fast-design-system/",
        anchorText: "Furious",
        icon: FastIcon,
    },
    {
        url: "https://code.visualstudio.com/",
        anchorText: "VS Code",
        icon: VSCodeIcon,
    },
];
