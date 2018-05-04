import * as React from "react";

export interface IParagraphProps {
    text: string;
}

class Paragraph extends React.Component<IParagraphProps, {}> {

    public render(): JSX.Element {
        return (
            <p>
                {this.props.text}
            </p>
        );
    }
}

export default Paragraph;
