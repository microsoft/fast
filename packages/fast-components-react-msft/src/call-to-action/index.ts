import * as React from "react";
import { ICallToActionClassNameContract } from "@microsoft/fast-components-class-name-contracts-msft";
import manageJss, { IJSSManagerProps } from "@microsoft/fast-jss-manager-react";
import { CallToActionStyles, IDesignSystem } from "@microsoft/fast-components-styles-msft";
import CallToAction, { ICallToActionHandledProps } from "./call-to-action";

export default manageJss(CallToActionStyles)(CallToAction);
