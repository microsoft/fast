import * as React from "react";
import {
    Radio
} from "@microsoft/fast-components-react-base";
import manageJss, { IJSSManagerProps } from "@microsoft/fast-jss-manager-react";
import { IDesignSystem, RadioStyles } from "@microsoft/fast-components-styles-msft";

export default manageJss(RadioStyles)(Radio);
