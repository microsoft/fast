/** @jsx h */ /* Note: Set the JSX pragma to the wrapped version of createElement */

import React from "react";
import { fastButton } from "@microsoft/fast-components";
import { downChevron, upChevron } from "@microsoft/site-utilities";
import h from "@microsoft/site-utilities/dist/web-components/pragma";
import { ProjectFileTransferProps } from "./project-file-transfer.props";

fastButton;

export const ProjectFileTransfer: React.FC<ProjectFileTransferProps> = ({
    projectFile,
    onUpdateProjectFile,
}: React.PropsWithChildren<ProjectFileTransferProps>): React.ReactElement => {
    const downloadElementId: string = "hiddenProjectFileDownloadElement";
    const uploadElementId: string = "hiddenProjectFileUploadElement";

    function handleDownloadOnClick(e: React.MouseEvent<HTMLButtonElement>): void {
        e.preventDefault();
        (document.getElementById(downloadElementId) as HTMLAnchorElement).click();
    }

    function handleUploadOnChange(e: React.ChangeEvent<HTMLInputElement>): void {
        const reader: FileReader = new FileReader();

        reader.onload = (event: any): void => {
            if (event.target && event.target.result && reader.result) {
                onUpdateProjectFile(JSON.parse((reader as any).result));
            }
        };

        if (e.target.files) {
            reader.readAsText(e.target.files[0]);
        }
    }

    return (
        <div style={{ position: "absolute", bottom: "0", padding: "10px" }}>
            <div style={{ position: "relative", display: "inline-block" }}>
                <input
                    id={uploadElementId}
                    type={"file"}
                    accept={"text/json"}
                    style={{
                        opacity: "0",
                        width: "32px",
                        height: "24px",
                        position: "absolute",
                        left: "0",
                        border: "none",
                        padding: "0",
                        zIndex: 1,
                        cursor: "pointer",
                    }}
                    onChange={handleUploadOnChange}
                />
                <fast-button tabIndex="-1" title="upload a project file">
                    {upChevron()}
                </fast-button>
            </div>
            <div
                style={{
                    position: "relative",
                    display: "inline-block",
                    marginLeft: "4px",
                }}
            >
                <fast-button
                    title="download a project file"
                    events={{
                        click: (e: React.MouseEvent<HTMLButtonElement>) => {
                            handleDownloadOnClick(e);
                        },
                    }}
                >
                    {downChevron()}
                </fast-button>
                <a
                    id={downloadElementId}
                    style={{ display: "none" }}
                    href={
                        "data:text/json;charset=utf-8," +
                        encodeURIComponent(JSON.stringify(projectFile))
                    }
                    download={`project-file-${Date.now()}.json`}
                />
            </div>
        </div>
    );
};

export * from "./project-file-transfer.props";
