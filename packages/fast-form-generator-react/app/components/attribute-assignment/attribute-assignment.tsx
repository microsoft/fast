import * as React from "react";

export interface IAttributeAssignmentProps {
    text: string;
}

export default class AttributeAssignment extends React.Component<IAttributeAssignmentProps, {}> {
    public render(): JSX.Element {
        return (
            <span>
                {this.props.text}
            </span>
        );
    }
}
