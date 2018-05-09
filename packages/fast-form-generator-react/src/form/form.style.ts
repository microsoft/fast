import { ellipsis, toPx } from "@microsoft/fast-jss-utilities";
import {  applyCleanListStyle, applyInputStyle, applyLabelStyle, applyWrapperStyle } from "../utilities/form-input.shared-style.style";
import { ComponentStyles, ICSSRules } from "@microsoft/fast-jss-manager";
import { IFormClassNameContract } from "../class-name-contracts/";

const styles: ComponentStyles<IFormClassNameContract, {}> = {
    form_breadcrumbs: {
        display: "flex",
        flexWrap: "wrap",
        marginTop: toPx(4),
        paddingBottom: toPx(24),
        ...applyCleanListStyle(),
        "& li": {
            display: "inline-block",
            paddingRight: toPx(8),
            "&:after": {
                content: "'/'",
                paddingLeft: toPx(8)
            },
            "&:last-child:after": {
                content: "''",
                paddingLeft: "0"
            },
            "& a": {
                color: "#0078D7"
            }
        }
    }
};

export default styles;
