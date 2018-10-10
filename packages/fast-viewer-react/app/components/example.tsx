import * as React from "react";
import Foundation from "@microsoft/fast-components-foundation-react";
import { ComponentStyles } from "@microsoft/fast-jss-manager";
import manageJss, { ManagedClasses } from "@microsoft/fast-jss-manager-react";

const styles: ComponentStyles<ExampleClassNameContract, {}> = {
    example_input: {
        backgroundColor: "pink",
    },
    "@media only screen and (min-width: 320px)": {
        example: {
            backgroundColor: "orange",
        },
    },
    "@media only screen and (min-width: 540px)": {
        example: {
            backgroundColor: "red",
        },
    },
    "@media only screen and (min-width: 800px)": {
        example: {
            backgroundColor: "purple",
        },
    },
};

export interface ExampleProps {
    textValue?: string;
    onChange?: any;
}

export interface ExampleClassNameContract {
    example?: string;
    example_input?: string;
}

class Example extends Foundation<
    ExampleProps & ManagedClasses<ExampleClassNameContract>,
    {},
    {}
> {
    public handleLabelUpdate = ({ target: { value } }: any): void => {
        this.props.onChange(value);
    };

    public render(): JSX.Element {
        return (
            <div className={this.props.managedClasses.example}>
                <input
                    className={this.props.managedClasses.example_input}
                    type="text"
                    value={this.props.textValue}
                    onChange={this.handleLabelUpdate}
                />
                <img src="https://placehold.it/300x300" />
            </div>
        );
    }
}

export default manageJss(styles)(Example);
