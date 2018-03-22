import jss from "jss";
import preset from "jss-preset-default";
import * as React from "react";
import * as ReactDOM from "react-dom";
import * as ReactDOMServer from "react-dom/server";
import { windowControls, addressBarControls } from "./browserControls";

export interface IViewerHeightConfig {
    min?: number;
    max?: number;
    auto?: number;
}

export interface IViewerConfig {
    browser?: boolean;
    height?: IViewerHeightConfig;
}

export interface IViewerProps {
    component: any;
    styles: string;
    data: any;
    config?: IViewerConfig;
}

export interface IViewerState {
    iframeHeight: string;
}

export default class Viewer extends React.Component<IViewerProps, IViewerState> {

    private rootElement: HTMLElement;

    private rootStyleElement: HTMLElement;

    private iframe: HTMLIFrameElement;

    private styles: any;

    private stylesheet: any;

    constructor(props: IViewerProps) {
        super(props);

        this.state = {
            iframeHeight: "0px"
        };

        this.styles = {
            browser: {
                boxShadow: "0 0 30px rgba(0,0,0,.1)"
            },
            iframe: {
                border: "none",
                display: "block",
                width: "100%"
            },
            tabBar: {
                backgroundColor: "#d2d2d2",
                display: "flex",
                fontFamily: "Segoe UI, Arial, Helvetica"
            },
            windowControls: {
                flexGrow: 1,
                padding: "10px 20px",
                textAlign: "right"
            },
            tab: {
                backgroundColor: "#f4f4f4",
                minWidth: "100px",
                padding: "10px 20px"
            },
            addressBar: {
                backgroundColor: "#f4f4f4",
                display: "flex",
                fontFamily: "Segoe UI, arial, helvetica",
                padding: "10px 0"
            },
            addressControls: {
                padding: "10px 20px 5px 20px"
            },
            addressText: {
                backgroundColor: "#ffffff",
                flexGrow: 1,
                marginRight: "15px",
                overflow: "hidden",
                padding: "10px 20px 5px 20px",
                textOverflow: "ellipsis"
            }
        };

        jss.setup(preset());

        this.stylesheet = jss.createStyleSheet(this.styles, {link: true}).attach();
    }

    public shouldComponentUpdate(nextProps: IViewerProps, nextState: IViewerState): boolean {
        if (
            nextProps.styles !== this.props.styles
            || nextProps.data !== this.props.data
            || nextProps.component !== this.props.component
            || nextProps.config !== this.props.config
            || nextState.iframeHeight !== this.state.iframeHeight
        ) {
            return true;
        }

        return false;
    }

    public componentDidMount(): void {
        const rootElement: HTMLElement = document.createElement("div");
        rootElement.setAttribute("style", "height: 100%");
        const rootStyleElement: HTMLElement = document.createElement("style");
        rootStyleElement.setAttribute("type", "text/css");

        if (this.iframe) {
            const frameBody: HTMLElement = this.iframe.contentDocument.body;
            const frameHead: HTMLElement = this.iframe.contentDocument.head;
            frameHead.appendChild(rootStyleElement);
            frameBody.appendChild(rootElement);
        }

        this.rootElement = rootElement;
        this.rootStyleElement = rootStyleElement;

        this.updateIFrameContents();
    }

    public componentWillUnmount(): void {
        this.stylesheet.detach();
    }

    public componentDidUpdate(): void {
        this.updateIFrameContents();
    }

    public getStyleElement(): string {
        return ReactDOMServer.renderToStaticMarkup(<style type="text/css">{this.props.styles}</style>);
    }

    public getContentElement(): string {
        return ReactDOMServer.renderToStaticMarkup(<this.props.component {...this.props.data} />);
    }

    public updateIFrameContents = (): void => {
        if (this.rootElement && this.rootStyleElement) {
            ReactDOM.render(
                <this.props.component {...this.props.data} />,
                this.rootElement,
                () => {
                    this.checkIFrameAssetsLoaded();
                }
            );
            ReactDOM.render(
                <React.Fragment>
                    {this.props.styles + "html { overflow: hidden } body { overflow: auto }"}
                </React.Fragment>,
                this.rootStyleElement,
                () => {
                    this.checkIFrameAssetsLoaded();
                }
            );
        }
    }

    public resetHeight = (): void => {
        this.setState({
            iframeHeight: `${this.getHeight(this.iframe.contentWindow.document.body.scrollHeight)}px`
        });
    }

    public checkIFrameAssetsLoaded(): void {
        if (this.iframe) {
            const iframeImages: HTMLCollection = this.iframe.contentDocument.images;
            const iframeLinks: NodeListOf<HTMLLinkElement> = this.iframe.contentDocument.getElementsByTagName("link");

            for (let i: number = 0, iframeImageLength: number = iframeImages.length; i < iframeImageLength; i++) {
                iframeImages[i].addEventListener("load", this.resetHeight);
            }

            for (let i: number = 0, iframeLinkLength: number = iframeLinks.length; i < iframeLinkLength; i++) {
                iframeLinks[i].addEventListener("load", this.resetHeight);
            }

            this.resetHeight();
        }
    }

    public getHeight(totalHeight: number): number {
        const autoHeight: number = this.props.config && this.props.config.height && this.props.config.height.auto
            ? this.props.config.height.auto
            : void(0);
        const minHeight: number = this.props.config && this.props.config.height && this.props.config.height.min
            ? this.props.config.height.min
            : 0;
        const maxHeight: number = this.props.config && this.props.config.height && this.props.config.height.max
            ? this.props.config.height.max
            : Infinity;

        if (typeof autoHeight === "number") {
            return autoHeight;
        }

        if (autoHeight > maxHeight) {
            return maxHeight;
        }

        if (autoHeight < minHeight) {
            return minHeight;
        }

        return totalHeight;
    }

    public renderBrowser(): JSX.Element {
        return (
            <div className={this.stylesheet.classes.browser}>
                <div className={this.stylesheet.classes.tabBar}>
                    <div className={this.stylesheet.classes.tab} />
                    <div className={this.stylesheet.classes.windowControls}>
                        {windowControls}
                    </div>
                </div>
                <div className={this.stylesheet.classes.addressBar}>
                    <div className={this.stylesheet.classes.addressControls}>
                        {addressBarControls}
                    </div>
                    <div className={this.stylesheet.classes.addressText} />
                </div>
                {this.renderIFrame()}
            </div>
        );
    }

    public renderIFrame(): JSX.Element {
        return (
            <div key={"viewer-main"}>
                <base target="_blank" />
                <iframe
                    ref={(iframe: HTMLIFrameElement): void => { this.iframe = iframe; }}
                    className={this.stylesheet.classes.iframe}
                    style={{height: this.state.iframeHeight}}
                >
                    Your browser does not support iframes.
                </iframe>
            </div>
        );
    }

    public render(): JSX.Element {
        if (this.props.config && this.props.config.browser) {
            return this.renderBrowser();
        } else {
            return this.renderIFrame();
        }
    }
}
