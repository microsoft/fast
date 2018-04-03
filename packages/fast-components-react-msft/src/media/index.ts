import * as React from "react";
import {
    IFoundationProps,
    IMediaClassNameContract,
    IMediaHandledProps,
    IMediaUnhandledProps,
    Media
} from "@microsoft/fast-components-react-base";
import manageJss from "@microsoft/fast-jss-manager-react";
import {MediaStyles} from "@microsoft/fast-components-styles-msft";

export default manageJss(MediaStyles)(Media);
