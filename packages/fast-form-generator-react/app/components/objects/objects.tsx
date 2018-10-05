import * as React from "react";

export interface ObjectNoRequired {
    number?: number;
}

export interface ObjectWithRequired {
    boolean: boolean;
}

export interface OptionalObjectWithRequired {
    string: string;
}

export interface OptionalObjectNoRequired {
    boolean?: boolean;
}

export interface ObjectsProps {
    objectNoRequired: ObjectNoRequired;
    objectWithRequired: ObjectWithRequired;
    optionalObjectWithRequired: OptionalObjectWithRequired;
    optionalObjectNoRequired: OptionalObjectNoRequired;
}

/**
 * This test components API should have:
 * - a required object containing a required attribute which should have an example generated
 * - a required object containing an optional attribute which should not be generated
 * - an optional object containing a required attribute which should have an example generated
 * - an optional object containing an optional attribute which should not be generated
 */
export default class Objects extends React.Component<ObjectsProps, {}> {

    public render(): JSX.Element {
        return (
            <div>
                {this.props.objectNoRequired.number ? this.props.objectNoRequired.number.toString() : null}
                {this.props.objectWithRequired.boolean ? this.props.objectWithRequired.boolean.toString() : null}
                {this.renderOptionalObjectNoRequired()}
                {this.renderOptionalObjectWithRequired()}
            </div>
        );
    }

    private renderOptionalObjectNoRequired(): string {
        if (this.props.optionalObjectNoRequired && this.props.optionalObjectNoRequired.boolean) {
            return this.props.optionalObjectNoRequired.boolean.toString();
        }
    }

    private renderOptionalObjectWithRequired(): string {
        if (this.props.optionalObjectWithRequired && this.props.optionalObjectWithRequired.string) {
            return this.props.optionalObjectWithRequired.string;
        }
    }
}
