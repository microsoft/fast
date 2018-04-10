import * as React from "react";
import {
    ContextMenuItem,
    IContextMenuItemClassNameContract,
    IContextMenuItemHandledProps,
    IContextMenuItemUnhandledProps,
    IFoundationProps
} from "@microsoft/fast-components-react-base";
import manageJss from "@microsoft/fast-jss-manager-react";
import {ContextMenuItemStyles} from "@microsoft/fast-components-styles-msft";

export default manageJss(ContextMenuItemStyles)(ContextMenuItem);
