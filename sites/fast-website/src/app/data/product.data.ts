import ASPNetIcon from "svg/icon-aspnet-temp.svg";
import EdgeIcon from "svg/icon-edge.svg";
import FluentUIIcon from "svg/icon-fluentui-temp.svg";
import MSNIcon from "svg/icon-msn.svg";
import VSCodeIcon from "svg/icon-vscode.svg";
import Windows11Icon from "svg/icon-windows11.svg";

export interface ProductData {
    icon: string;
    url: string;
}

export const productData = [
    {
        url: "https://dotnet.microsoft.com/en-us/apps/aspnet",
        icon: ASPNetIcon,
    },
    {
        url: "https://www.microsoft.com/en-us/edge",
        icon: EdgeIcon,
    },
    {
        url: "https://developer.microsoft.com/en-us/fluentui#/",
        icon: FluentUIIcon,
    },
    {
        url: "https://www.msn.com/en-us",
        icon: MSNIcon,
    },
    {
        url: "https://code.visualstudio.com/",
        icon: VSCodeIcon,
    },
    {
        url: "https://www.microsoft.com/en-us/windows/windows-11?r=1",
        icon: Windows11Icon,
    },
];
