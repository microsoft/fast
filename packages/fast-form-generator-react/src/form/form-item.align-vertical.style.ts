import { Direction, ellipsis, localizeSpacing, toPx } from "@microsoft/fast-jss-utilities";
import { applyInputBackplateStyle, applyInputStyle, applyLabelStyle, applyWrapperStyle } from "../utilities/form-input.style";
import { ComponentStyles, ICSSRules } from "@microsoft/fast-jss-manager";
import { IFormItemAlignVerticalClassNameContract } from "../class-name-contracts/";

const styles: ComponentStyles<IFormItemAlignVerticalClassNameContract, {}> = {
    formItemAlignVertical: {
        ...applyWrapperStyle()
    },
    formItemAlignVertical_label: {
        ...applyLabelStyle()
    },
    formItemAlignVertical_input__top: {
        ...applyInputBackplateStyle(),
        /* tslint:disable-next-line */
        background: "url(data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0idXRmLTgiPz48c3ZnIHZlcnNpb249IjEuMSIgaWQ9IkxheWVyXzEiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgeG1sbnM6eGxpbms9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsiIHg9IjBweCIgeT0iMHB4IiB2aWV3Qm94PSIwIDAgMTYgMTYiIHN0eWxlPSJlbmFibGUtYmFja2dyb3VuZDpuZXcgMCAwIDE2IDE2OyIgeG1sOnNwYWNlPSJwcmVzZXJ2ZSI+PHBhdGggZD0iTTE1LjgsMC42djFIMC4ydi0xSDE1Ljh6IE0zLjEsMi42SDd2MTIuOEgzLjFWMi42eiBNNC4xLDE0LjRoMlYzLjZoLTJWMTQuNHogTTksMi42aDMuOXY4LjhIOVYyLjZ6IE0xMCwxMC41aDJWMy42aC0yVjEwLjV6Ii8+PC9zdmc+) center no-repeat",
        "&:checked": {
            /* tslint:disable-next-line */
            background: "url(data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0idXRmLTgiPz48c3ZnIHZlcnNpb249IjEuMSIgaWQ9IkxheWVyXzEiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgeG1sbnM6eGxpbms9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsiIHg9IjBweCIgeT0iMHB4IiB2aWV3Qm94PSIwIDAgMTYgMTYiIHN0eWxlPSJlbmFibGUtYmFja2dyb3VuZDpuZXcgMCAwIDE2IDE2OyIgeG1sOnNwYWNlPSJwcmVzZXJ2ZSI+PHN0eWxlIHR5cGU9InRleHQvY3NzIj4uc3Qwe2ZpbGw6I0ZGRkZGRjt9PC9zdHlsZT48cGF0aCBjbGFzcz0ic3QwIiBkPSJNMTUuOCwwLjZ2MUgwLjJ2LTFIMTUuOHogTTMuMSwyLjZIN3YxMi44SDMuMVYyLjZ6IE00LjEsMTQuNGgyVjMuNmgtMlYxNC40eiBNOSwyLjZoMy45djguOEg5VjIuNnogTTEwLDEwLjVoMlYzLjZoLTJWMTAuNXoiLz48L3N2Zz4=) center no-repeat",
            backgroundColor: "#FB356D"
        }
    },
    formItemAlignVertical_input__center: {
        ...applyInputBackplateStyle(),
        /* tslint:disable-next-line */
        background: "url(data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0idXRmLTgiPz48c3ZnIHZlcnNpb249IjEuMSIgaWQ9IkxheWVyXzEiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgeG1sbnM6eGxpbms9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsiIHg9IjBweCIgeT0iMHB4IiB2aWV3Qm94PSIwIDAgMTYgMTYiIHN0eWxlPSJlbmFibGUtYmFja2dyb3VuZDpuZXcgMCAwIDE2IDE2OyIgeG1sOnNwYWNlPSJwcmVzZXJ2ZSI+PHBhdGggZD0iTTE1LjgsOC41aC0yLjl2My45SDlWOC41SDd2NS45SDMuMVY4LjVIMC4ydi0xaDIuOVYxLjZIN3Y1LjloMlYzLjZoMy45djMuOWgyLjlWOC41eiBNNiwyLjZoLTJ2MTAuOGgyVjIuNnogTTExLjksNC42aC0ydjYuOWgyVjQuNnoiLz48L3N2Zz4=) center no-repeat",
        "&:checked": {
            /* tslint:disable-next-line */
            background: "url(data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0idXRmLTgiPz48c3ZnIHZlcnNpb249IjEuMSIgaWQ9IkxheWVyXzEiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgeG1sbnM6eGxpbms9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsiIHg9IjBweCIgeT0iMHB4IiB2aWV3Qm94PSIwIDAgMTYgMTYiIHN0eWxlPSJlbmFibGUtYmFja2dyb3VuZDpuZXcgMCAwIDE2IDE2OyIgeG1sOnNwYWNlPSJwcmVzZXJ2ZSI+PHN0eWxlIHR5cGU9InRleHQvY3NzIj4uc3Qwe2ZpbGw6I0ZGRkZGRjt9PC9zdHlsZT48cGF0aCBjbGFzcz0ic3QwIiBkPSJNMTUuOCw4LjVoLTIuOXYzLjlIOVY4LjVIN3Y1LjlIMy4xVjguNUgwLjJ2LTFoMi45VjEuNkg3djUuOWgyVjMuNmgzLjl2My45aDIuOUMxNS44LDcuNSwxNS44LDguNSwxNS44LDguNXogTTYsMi42SDR2MTAuOGgyVjIuNnogTTExLjksNC42aC0ydjYuOWgyVjQuNnoiLz48L3N2Zz4=) center no-repeat",
            backgroundColor: "#FB356D"
        }
    },
    formItemAlignVertical_input__bottom: {
        ...applyInputBackplateStyle(),
        /* tslint:disable-next-line */
        background: "url(data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0idXRmLTgiPz48c3ZnIHZlcnNpb249IjEuMSIgaWQ9IkxheWVyXzEiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgeG1sbnM6eGxpbms9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsiIHg9IjBweCIgeT0iMHB4IiB2aWV3Qm94PSIwIDAgMTYgMTYiIHN0eWxlPSJlbmFibGUtYmFja2dyb3VuZDpuZXcgMCAwIDE2IDE2OyIgeG1sOnNwYWNlPSJwcmVzZXJ2ZSI+PHBhdGggZD0iTTE1LjgsMTQuNHYxSDAuMnYtMUgxNS44eiBNNywxMy40SDMuMVYwLjZIN1YxMy40eiBNNiwxLjZoLTJ2MTAuOGgyVjEuNnogTTEyLjksMTMuNEg5VjQuNmgzLjlWMTMuNHogTTExLjksNS41aC0ydjYuOWgyVjUuNXoiLz48L3N2Zz4=) center no-repeat",
        "&:checked": {
            /* tslint:disable-next-line */
            background: "url(data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0idXRmLTgiPz48c3ZnIHZlcnNpb249IjEuMSIgaWQ9IkxheWVyXzEiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgeG1sbnM6eGxpbms9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsiIHg9IjBweCIgeT0iMHB4IiB2aWV3Qm94PSIwIDAgMTYgMTYiIHN0eWxlPSJlbmFibGUtYmFja2dyb3VuZDpuZXcgMCAwIDE2IDE2OyIgeG1sOnNwYWNlPSJwcmVzZXJ2ZSI+PHN0eWxlIHR5cGU9InRleHQvY3NzIj4uc3Qwe2ZpbGw6I0ZGRkZGRjt9PC9zdHlsZT48cGF0aCBjbGFzcz0ic3QwIiBkPSJNMTUuOCwxNC40djFIMC4ydi0xSDE1Ljh6IE03LDEzLjRIMy4xVjAuNkg3VjEzLjR6IE02LDEuNkg0djEwLjhoMlYxLjZ6IE0xMi45LDEzLjRIOVY0LjZoMy45VjEzLjR6IE0xMS45LDUuNWgtMnY2LjloMlY1LjV6Ii8+PC9zdmc+) center no-repeat",
            backgroundColor: "#FB356D"
        }
    }
};

export default styles;
