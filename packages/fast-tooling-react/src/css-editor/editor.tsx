import React from "react";
import Foundation, { HandledProps } from "@microsoft/fast-components-foundation-react";
import {
    CSSEditorHandledProps,
    CSSEditorProps,
    CSSEditorUnhandledProps,
} from "./editor.props";
import cssEditorSchema from "./editor.schema.json";
import { CSSColor } from "./color";
import { getDataFromSchema } from "../../src/data-utilities";
import { ControlConfig, Form, StandardControlPlugin } from "../../src/form";

export interface CSSEditorState {
    data: any;
}

export default class CSSEditor extends Foundation<
    CSSEditorHandledProps,
    CSSEditorUnhandledProps,
    CSSEditorState
> {
    public static displayName: string = "CSSEditor";

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

        const exampleData: any = getDataFromSchema(cssEditorSchema);

        this.state = {
            data: exampleData,
        };

        this.controlPlugins = [
            new StandardControlPlugin({
                id: "color",
                control: (config: ControlConfig): React.ReactNode => {
                    return <CSSColor data={this.props.data} onChange={config.onChange} />;
                },
            }),
        ];
    }

    public render(): React.ReactNode {
        return (
            <div className={this.props.managedClasses.cssEditor}>
                <Form
                    className={this.props.managedClasses.cssEditor_form}
                    schema={cssEditorSchema}
                    data={this.state.data}
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
            this.props.onChange(Object.assign({}, this.props.data, data));
        }
    };
}

export * from "./editor.props";
