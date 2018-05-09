import * as React from "react";

export interface IButtonProps {
    text: string;
}

class Button extends React.Component<IButtonProps, {}> {

    public render(): JSX.Element {
        return (
            <button>
                {this.props.text}
                {this.props.children}
            </button>
        );
    }
}

export default Button;
