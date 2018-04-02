import * as React from "react";
import { Button, IButtonClassNameContract, IButtonProps, IFoundationProps } from "@microsoft/fast-components-react-base";
import manageJss from "@microsoft/fast-jss-manager-react";
import {ButtonStyles} from "@microsoft/fast-components-styles-msft";

export default manageJss(ButtonStyles)(Button);
