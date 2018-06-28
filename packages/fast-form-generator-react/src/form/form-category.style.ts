import { toPx } from "@microsoft/fast-jss-utilities";
import { applyHeaderStyle } from "../utilities/form-input.style";
import { ComponentStyles, ICSSRules } from "@microsoft/fast-jss-manager";
import { IFormCategoryClassNameContract } from "../class-name-contracts/";
import formCategory from "./form-category";

// tslint:disable-next-line
const dropdownArrow: string = "PHN2ZyBpZD0iTGF5ZXJfMSIgZGF0YS1uYW1lPSJMYXllciAxIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAzMiAzMiI+PHRpdGxlPmNoZXZyb24tZG93bjwvdGl0bGU+PHBhdGggZD0iTTMwLjUsNy4yOSwzMS45LDguNywxNi4yLDI0LjQuNSw4LjcsMS45LDcuMjlsMTQuMywxNC4zWiIvPjwvc3ZnPg==";

const styles: ComponentStyles<IFormCategoryClassNameContract, {}> = {
    formCategory_button: {
        margin: `${toPx(20)} 0 0 0`,
        minHeight: toPx(40),
        fontWeight: "bold",
        background: "none",
        outline: "0",
        border: "none",
        position: "relative",
        width: "100%",
        fontFamily: "inherit",
        fontSize: toPx(14),
        padding: `${toPx(10)} 0`,
        textAlign: "left",
        "&[aria-expanded='true']": {
            "&::after": {
                content: `url('data:image/svg+xml;base64,${dropdownArrow}')`,
                transform: "rotate(180deg)",
            }
        },
        "&:hover": {
            cursor: "pointer"
        },
        "&::after": {
            content: `url('data:image/svg+xml;base64,${dropdownArrow}')`,
            fill: "white",
            position: "absolute",
            right: toPx(11),
            top: toPx(11),
            verticalAlign: "middle",
            display: "inline-block",
            width: toPx(11),
            height: toPx(11)
        }
    },
    formCategory_header: {
        ...applyHeaderStyle(),
        fontSize: toPx(14),
    },
    formCategory: {
    },
    formCategory__collapsed: {
        display: "none"
    }
};

export default styles;
