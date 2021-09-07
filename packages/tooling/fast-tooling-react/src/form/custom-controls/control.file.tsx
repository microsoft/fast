/** @jsx h */ /* Note: Set the JSX pragma to the wrapped version of createElement */
import h from "../../utilities/web-components/pragma"; /* Note: Import wrapped createElement. */
import React from "react";
import manageJss from "@microsoft/fast-jss-manager-react";
import { ManagedClasses } from "@microsoft/fast-components-class-name-contracts-base";
import styles, { FileControlClassNameContract } from "./control.file.style";
import { FileControlProps } from "./control.file.props";
import { classNames } from "@microsoft/fast-web-utilities";
import { fastToolingFile } from "@microsoft/fast-tooling/dist/esm/web-components";

/**
 * @alpha
 * Custom form control definition
 */
class FileControl extends React.Component<
    FileControlProps & ManagedClasses<FileControlClassNameContract>
> {
    public static displayName: string = "FileControl";

    public static defaultProps: Partial<
        FileControlProps & ManagedClasses<FileControlClassNameContract>
    > = {
        managedClasses: {},
    };

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
                    accept={this.props.accept}
                    events={{
                        change: this.onChange,
                    }}
                    disabled={this.props.disabled}
                >
                    {this.props.children}
                    <fast-tooling-file-action-objecturl
                        role="fileaction"
                        slot="action"
                    ></fast-tooling-file-action-objecturl>
                </fast-tooling-file>
            </div>
        );
    }

    /**
     * Callback for input change
     */
    public onChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
        const newValue: string = (e.target as fastToolingFile).fileReferences[0];
        this.props.onChange({ value: newValue });
    };
}

export { FileControl };
export default manageJss(styles)(FileControl);
