import * as React from "react";

class Button extends React.Component<{}, {}> {

    public render(): JSX.Element {
        return (
            <button>
                {this.props.children}
            </button>
        );
    }
}

export default Button;
