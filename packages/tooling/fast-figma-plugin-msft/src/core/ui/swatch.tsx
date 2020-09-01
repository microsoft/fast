import {
    applyCornerRadius,
    applyElevation,
} from "@microsoft/fast-components-styles-msft";
import manageJss from "@microsoft/fast-jss-manager-react";
import React from "react";

interface SwatchManagedClasses {
    swatch: string;
}
interface SwatchProps extends React.HTMLAttributes<HTMLSpanElement> {
    color: string;
    managedClasses: SwatchManagedClasses;
}

function Swatch(props: SwatchProps): JSX.Element {
    const { managedClasses, color, ...rest } = props;
    return (
        <span
            title={color}
            className={managedClasses.swatch}
            style={{ background: color }}
            {...(rest as any)}
        />
    );
}

export default manageJss<SwatchManagedClasses, SwatchProps>({
    swatch: {
        display: "inline-block",
        width: "16px",
        height: "16px",
        margin: "0 8px 0 0",
        ...applyCornerRadius(),
        ...applyElevation(2),
    },
})(Swatch);
