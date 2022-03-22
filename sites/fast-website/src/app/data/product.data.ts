import ASPNetIcon from "svg/icon-aspnet-temp.svg";
import EdgeIcon from "svg/icon-edge.svg";
import FluentUIIcon from "svg/icon-fluentui.svg";
import FASTIcon from "svg/icon-brand.svg";
import MSNIcon from "svg/icon-msn.svg";
import VSCodeIcon from "svg/icon-vscode.svg";
import Windows11Icon from "svg/icon-windows11.svg";

export interface ProductData {
    icon: string;
    url: string;
    anchorText: string;
}

export const productData = [
    {
        url: "https://dotnet.microsoft.com/en-us/apps/aspnet",
        anchorText: "ASP.NET",
        icon: ASPNetIcon,
    },
    {
        url: "https://www.microsoft.com/en-us/edge",
        anchorText: "Edge",
        icon: EdgeIcon,
    },
    {
        url: "https://developer.microsoft.com/en-us/fluentui#/",
        anchorText: "Fluent UI",
        icon: FluentUIIcon,
    },
    {
        url: "https://www.msn.com/en-us",
        anchorText: "MSN",
        icon: MSNIcon,
    },
    {
        url: "https://code.visualstudio.com/",
        anchorText: "VS Code",
        icon: VSCodeIcon,
    },
    {
        url: "https://www.microsoft.com/en-us/windows/windows-11?r=1",
        anchorText: "Windows 11",
        icon: Windows11Icon,
    },
];
