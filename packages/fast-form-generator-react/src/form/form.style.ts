import { accent } from "./form.constants.style";
import { applyCleanListStyle } from "./form.utilities.style";
import { ComponentStyles } from "@microsoft/fast-jss-manager";
import { FormClassNameContract } from "../class-name-contracts/";

const styles: ComponentStyles<FormClassNameContract, {}> = {
    form_breadcrumbs: {
        display: "flex",
        flexWrap: "wrap",
        marginTop: "4px",
        fontSize: "11px",
        lineHeight: "15px",
        paddingBottom: "12px",
        ...applyCleanListStyle(),
        "& li": {
            display: "inline-block",
            paddingRight: "8px",
            "&::after": {
                content: "'/'",
                paddingLeft: "8px",
            },
            "&:last-child::after": {
                content: "''",
                paddingLeft: "0",
            },
            "& a": {
                color: accent,
            },
        },
    },
};

export default styles;
