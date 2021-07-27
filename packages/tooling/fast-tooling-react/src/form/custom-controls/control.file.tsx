/** @jsx h */ /* Note: Set the JSX pragma to the wrapped version of createElement */
import h from "../../utilities/web-components/pragma"; /* Note: Import wrapped createElement. */
import React from "react";
import manageJss, { ManagedJSSProps } from "@microsoft/fast-jss-manager-react";
import { ManagedClasses } from "@microsoft/fast-components-class-name-contracts-base";
import styles, { FileControlClassNameContract } from "./control.file.style";
import { uniqueId } from "lodash-es";
import {
    FileControlProps,
    FileControlState,
} from "./control.file.props";
import { classNames } from "@microsoft/fast-web-utilities";
import { fastToolingFile } from "@microsoft/fast-tooling/dist/esm/web-components";

/**
 * Custom form control definition
 */
class FileControl extends React.Component<
    FileControlProps & ManagedClasses<FileControlClassNameContract>,
    FileControlState
> {
    public static displayName: string = "FileControl";

    public static defaultProps: Partial<
        FileControlProps & ManagedClasses<FileControlClassNameContract>
    > = {
        managedClasses: {},
    };

    constructor(props: FileControlProps) {
        super(props);
    }

    /**
     * Render the component
     */
    public render(): React.ReactNode {
        return (
            <div
                className={classNames(this.props.managedClasses.fileControl, [
                    this.props.managedClasses.fileControl__disabled,
                    this.props.disabled,
                ])}
            >
                <fast-tooling-file 
                    accept=".jpg,.jpeg,.png,.gif"
                    events={{
                        change: this.onChange,
                    }}
                >
                    Add Image
                    <fast-tooling-file-action-objecturl role="fileaction" slot="action"></fast-tooling-file-action-objecturl>
                </fast-tooling-file>
            </div>
        );
    }

    /**
     * React lifecycle hook
     */
    public componentDidMount(): void {
    }

    /**
     * React lifecycle hook
     */
    public componentWillUnMount(): void {
    }

    /**
     * Callback for input change
     */
    public onChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
        console.log("change");
        const value:string = (e.target as fastToolingFile).fileReferences[0];
        console.log(value);
        this.props.onChange({ value });
    };

}

export { FileControl };
export default manageJss(styles)(FileControl);
