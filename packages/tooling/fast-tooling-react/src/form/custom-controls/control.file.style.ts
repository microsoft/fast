import { ComponentStyles } from "@microsoft/fast-jss-manager-react";

export interface FileControlClassNameContract {
    fileControl?: string;
    fileControl__disabled?: string;
    fileControl_input?: string;
}

const styles: ComponentStyles<FileControlClassNameContract, {}> = {
    fileControl: {},
    fileControl__disabled: {},
    fileControl_input: {},
};

export default styles;
