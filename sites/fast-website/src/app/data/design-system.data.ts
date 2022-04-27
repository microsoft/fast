import FastIcon from "svg/icon-brand.svg";
import FluentUIIcon from "svg/icon-fluentui.svg";
import FuriousIcon from "svg/icon-furious.svg";
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
        url: "https://docs.microsoft.com/en-us/fluent-ui/web-components/",
        anchorText: "Fluent UI",
        icon: FluentUIIcon,
    },
    {
        url: "https://backlight.dev/blog/introducing-furious-a-fast-design-system/",
        anchorText: "Furious",
        icon: FuriousIcon,
    },
    {
        url: "https://github.com/microsoft/vscode-webview-ui-toolkit",
        anchorText: "VS Code",
        icon: VSCodeIcon,
    },
];
