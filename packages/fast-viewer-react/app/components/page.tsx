import * as React from "react";
import jss from "jss";
import preset from "jss-preset-default";
import Viewer, {IViewerConfig, IViewerProps} from "../../src/components/viewer";
import manager, {theme} from "../utilities/style-manager";
import Example from "./example";

jss.setup(preset());

const styles: any = {
    wrapper: {
        width: (themeStyle: any): string => themeStyle.width,
    },
};

const stylesheet: any = jss.createStyleSheet(styles, {link: true}).update(theme);

export interface IPageState {
    width: number;
    data: any;
    exampleStyles: string;
    viewerConfig: IViewerConfig;
}

class Page extends React.Component<{}, IPageState> {

    constructor(props: {}) {
        super(props);

        this.state = {
            data: {
                getStyles: this.onGetStyles,
                onChange: this.handleTextUpdate,
                textValue: "",
            },
            exampleStyles: "",
            viewerConfig: {
                browser: true,
                height: {
                    min: 200
                }
            },
            width: 100
        };
    }

    public componentWillMount(): void {
        manager.add("wrapper", stylesheet);
        manager.manage("wrapper");
    }

    public componentWilUnmount(): void {
        manager.unmanage("wrapper");
    }

    public handleRangeUpdate = ({ target: { value }}: any): void => {
        theme.width = `${value}%`;
        this.setState({ width: value });
    }

    public handleTextUpdate = (value: any): void => {
        if (typeof value === "object" && value.target) {
            this.setState(
                {
                    data: {
                        getStyles: this.onGetStyles,
                        onChange: this.handleTextUpdate,
                        textValue: value.target.value,
                    },
                },
            );
        } else {
            this.setState(
                {
                    data: {
                        getStyles: this.onGetStyles,
                        onChange: this.handleTextUpdate,
                        textValue: value,
                    },
                },
            );
        }
    }

    public onUpdate = (value: any): void => {
        this.setState(
            {
                data: {
                    getStyles: this.onGetStyles,
                    onChange: this.handleTextUpdate,
                    textValue: value,
                },
            },
        );
    }

    public onGetStyles = (style: string): void => {
        this.setState({exampleStyles: style});
    }

    public render(): JSX.Element {
        return (
            <div className={stylesheet.classes.wrapper}>
                {this.state.data.textValue}
                <div>
                    {`width: ${this.state.width}%`}
                    <input type="range" min={0} max={100} value={this.state.width} onChange={this.handleRangeUpdate} />
                    <input type="text" onChange={this.handleTextUpdate} value={this.state.data.textValue} />
                </div>
                <Viewer
                    component={Example}
                    config={this.state.viewerConfig}
                    data={this.state.data}
                    styles={this.state.exampleStyles}
                />
            </div>
        );
    }
}

export default Page;
