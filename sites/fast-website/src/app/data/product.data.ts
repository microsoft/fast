import ASPNetIcon from "svg/icon-aspnet-temp.svg";
import EdgeIcon from "svg/icon-edge.svg";
// import FluentUIIcon from "svg/icon-fluentui-temp.svg";
import FASTIcon from "svg/icon-brand.svg";
import MSNIcon from "svg/icon-msn.svg";
import VSCodeIcon from "svg/icon-vscode.svg";
import Windows11Icon from "svg/icon-windows11.svg";

export interface ProductData {
    icon: string;
    url: string;
    label: string;
}

export const productData = [
    {
        url: "https://dotnet.microsoft.com/en-us/apps/aspnet",
        icon: ASPNetIcon,
        label: "ASP.NET",
    },
    {
        url: "https://developer.microsoft.com/en-us/fluentui#/",
        icon: FASTIcon, // replace with Fluent UI logo
        label: "FluentUI",
    },
    {
        url: "https://www.microsoft.com/en-us/edge",
        icon: EdgeIcon,
        label: "Microsoft Edge",
    },
    {
        url: "https://www.msn.com/en-us",
        icon: MSNIcon,
        label: "MSN",
    },
    {
        url: "https://code.visualstudio.com/",
        icon: VSCodeIcon,
        label: "VS Code",
    },
    {
        url: "https://www.microsoft.com/en-us/windows/windows-11?r=1",
        icon: Windows11Icon,
        label: "Windows 11",
    },
];
