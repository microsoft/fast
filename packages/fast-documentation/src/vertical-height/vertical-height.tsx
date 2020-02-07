import React, { HTMLAttributes } from "react";
import manageJss, { ComponentStyles, ManagedClasses } from "@microsoft/fast-jss-manager-react";
import { Column, ColumnClassNamesContract, Grid, Page } from "@microsoft/fast-layouts-react";
import { breakpoints } from "../../app/data/default-vars";

const dividerColumn: ComponentStyles<ColumnClassNamesContract, undefined> = {
    column: {}
};

interface IDividerStyles {
    height1: string;
    height2: string;
    height3: string;
    height4: string;
    height5: string;
    height6: string;
    height7: string;
    height8: string;
    height9: string;
    height10: string;
    height125: string;
}

const dividerStyles: ComponentStyles<IDividerStyles, undefined> = {
    height1: {
        height: "10px"
    },
    height2: {
        height: "20px"
    },
    height3: {
        height: "30px"
    },
    height4: {
        height: "40px"
    },
    height5: {
        height: "50px"
    },
    height6: {
        height: "60px"
    },
    height7: {
        height: "70px"
    },
    height8: {
        height: "80px"
    },
    height9: {
        height: "90px"
    },
    height10: {
        height: "100px"
    },
    height125: {
        height: "125px"
    }
};

const BaseDivider: React.FC<{
    managedClasses: IDividerStyles;
    height?: number;
    row?: number | number[];
    span?: number[];
}> = props => {
    return (
        <Column span={props.span} row={props.row}>
            <div className={props.managedClasses[`height${props.height}`]} />
        </Column>
    );
};

export const VerticalHeight = manageJss(dividerStyles)(BaseDivider);
