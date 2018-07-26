import * as React from "react";
import { ISnapshotTestSuite } from "@microsoft/fast-jest-snapshots-react";
import { IManagedClasses } from "@microsoft/fast-components-class-name-contracts-base";
import Dialog, { IDialogHandledProps, IDialogManagedClasses, IDialogUnhandledProps } from "./dialog";
import schema from "./dialog.schema.json";
import Documentation from "./.tmp/documentation";

const examples: ISnapshotTestSuite<IDialogHandledProps & IDialogManagedClasses> = {
    name: "Dialog",
    component: Dialog,
    schema: schema as any,
    documentation: <Documentation />,
    detailData: {
        modal: true,
        managedClasses: {
            dialog: "dialog",
            dialog_modalOverlay: "dialog-modal-overlay",
            dialog_contentRegion: "dialog-content-region"
        }
    },
    data: [
        {
            contentHeight: "300px",
            contentWidth: "500px",
            managedClasses: {
                dialog: "dialog",
                dialog_modalOverlay: "dialog-modal-overlay",
                dialog_contentRegion: "dialog-content-region"

            }
        },
        {
            contentHeight: "350px",
            contentWidth: "500px",
            modal: true,
            managedClasses: {
                dialog: "dialog",
                dialog_modalOverlay: "dialog-modal-overlay",
                dialog_contentRegion: "dialog-content-region"

            }
        }
    ]
};

export default examples;
