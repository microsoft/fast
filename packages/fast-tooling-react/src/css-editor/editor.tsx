import React from "react";
import Foundation, { HandledProps } from "@microsoft/fast-components-foundation-react";
import {
    CSSEditorHandledProps,
    CSSEditorProps,
    CSSEditorUnhandledProps,
} from "./editor.props";
import cssEditorDataSchema from "./editor-data.schema";
import { CSSColor } from "./color";
import { ControlConfig, Form, StandardControlPlugin } from "../form/";
import { colorPlugInId } from "./editor.constants";

export default class CSSEditor extends Foundation<
    CSSEditorHandledProps,
    CSSEditorUnhandledProps,
    {}
> {
    public static displayName: string = "CSSEditor";

    public static defaultProps: Partial<CSSEditorProps> = {
        managedClasses: {},
    };

    protected handledProps: HandledProps<CSSEditorHandledProps> = {
        data: void 0,
        onChange: void 0,
        managedClasses: void 0,
    };

    /**
     * The custom control plugins used in the form
     */
    private controlPlugins: StandardControlPlugin[];

    constructor(props: CSSEditorProps) {
        super(props);

        this.controlPlugins = [
            new StandardControlPlugin({
                id: colorPlugInId,
                control: (config: ControlConfig): React.ReactNode => {
                    return <CSSColor value={this.props.data} {...config} />;
                },
            }),
        ];
    }

    public render(): React.ReactNode {
        return (
            <div className={this.props.managedClasses.cssEditor}>
                <Form
                    schema={cssEditorDataSchema}
                    data={this.props.data}
                    onChange={this.handleUpdateData}
                    controlPlugins={this.controlPlugins}
                />
            </div>
        );
    }

    private handleUpdateData = (data: any): void => {
        this.setState({
            data,
        });

        if (typeof this.props.onChange === "function") {
            this.props.onChange(data);
        }
    };
}

export * from "./editor.props";
