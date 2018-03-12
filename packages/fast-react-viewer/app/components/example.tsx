
import * as React from "react";
import jss from "jss";
import preset from "jss-preset-default";
import manager, { theme } from "../utilities/style-manager";

jss.setup(preset());

const styles: any = {
    "@media only screen and (min-width: 100px)": {
        div: {
            backgroundColor: "orange",
        },
    },
    "@media only screen and (min-width: 200px)": {
        div: {
            backgroundColor: "red",
        },
    },
    "@media only screen and (min-width: 300px)": {
        div: {
            backgroundColor: "purple",
        },
    },
};

const stylesheet: any = jss.createStyleSheet(styles, {link: true}).update(theme);

export type update = (data: any) => void;

export type styles = (style: string) => void;

export interface IExampleProps {
    textValue: string;
    onChange: any;
    getStyles: styles;
}

class Example extends React.Component<IExampleProps, {}> {

    public componentWillMount(): void {
        manager.add("div", stylesheet);
        manager.manage("div");
    }

    public componentDidMount(): void {
        this.props.getStyles(stylesheet.toString());
    }

    public componentWillUnmount(): void {
        manager.unmanage("div");
    }

    public componentWillReceiveProps(nextProps: IExampleProps): void {
        nextProps.getStyles(stylesheet.toString());
    }

    public handleLabelUpdate = ({ target: { value } }: any): void => {
        this.props.onChange(value);
    }

    public render(): JSX.Element {
        return (
            <div className={ stylesheet.classes.div } key={2}>
                <input type="text" value={this.props.textValue} onChange={this.handleLabelUpdate} />
                <img src="https://placehold.it/300x300" />
                <link href="https://fluentweb.com/fw-d192a11b84ce02288037ba0722f3ee33.min.css" rel="stylesheet" />
            </div>
        );
    }
}

export default Example;
