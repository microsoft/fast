import * as React from "react";
import {
    Radio
} from "@microsoft/fast-components-react-base";
import manageJss, { ManagedJSSProps } from "@microsoft/fast-jss-manager-react";
import { DesignSystem, RadioStyles } from "@microsoft/fast-components-styles-msft";

export default manageJss(RadioStyles)(Radio);
