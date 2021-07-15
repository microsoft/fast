import React from "react";
import Foundation from "@microsoft/fast-components-foundation-react";
import {
    htmlMapper,
    htmlResolver,
    mapDataDictionary,
    MessageSystemType,
} from "@microsoft/fast-tooling";
import { ViewerCustomAction } from "@microsoft/fast-tooling-react";
import { classNames, Direction } from "@microsoft/fast-web-utilities";
import {
    allComponents,
    baseLayerLuminance,
    direction,
    fillColor,
    SwatchRGB,
} from "@microsoft/fast-components";
import {
    fastComponentDefinitions,
    nativeElementDefinitions,
    previewBackgroundTransparency,
    previewDirection,
    previewTheme,
} from "@microsoft/site-utilities";
import { DesignSystem } from "@microsoft/fast-foundation";
import { StandardLuminance } from "./preview.props";
import style from "./preview.style";
DesignSystem.getOrCreate().register(
    Object.values(allComponents).map(component => {
        return component();
    })
);
export const previewReady = "PREVIEW::READY";
/**
 * The preview component exists on a route inside an iframe
 * This allows for an isolated view of any component or components.
 */
class Preview extends Foundation {
    constructor(props) {
        super(props);
        this.handleMessage = message => {
            if (message.origin === location.origin) {
                let messageData;
                try {
                    messageData = JSON.parse(message.data);
                    /* eslint-disable-next-line no-empty */
                } catch (e) {}
                if (messageData !== undefined) {
                    switch (messageData.type) {
                        case MessageSystemType.initialize:
                            this.setState(
                                {
                                    dataDictionary: messageData.dataDictionary,
                                    schemaDictionary: messageData.schemaDictionary,
                                },
                                this.attachMappedComponents
                            );
                            break;
                        case MessageSystemType.data:
                            this.setState(
                                {
                                    dataDictionary: messageData.dataDictionary,
                                },
                                this.attachMappedComponents
                            );
                            break;
                        case MessageSystemType.custom:
                            if (messageData.id === previewBackgroundTransparency) {
                                this.setState(
                                    {
                                        transparentBackground: messageData.value,
                                    },
                                    this.attachMappedComponents
                                );
                            } else if (messageData.id === previewDirection) {
                                this.setState(
                                    {
                                        direction: messageData.value,
                                    },
                                    this.attachMappedComponents
                                );
                            } else if (messageData.id === previewTheme) {
                                this.setState(
                                    {
                                        theme: messageData.value,
                                    },
                                    this.attachMappedComponents
                                );
                            }
                            break;
                    }
                }
            }
        };
        this.ref = React.createRef();
        this.state = {
            dataDictionary: void 0,
            schemaDictionary: {},
            transparentBackground: false,
            direction: Direction.ltr,
            theme: StandardLuminance.DarkMode,
        };
        document.body.setAttribute(
            "style",
            `background-color: var(${fillColor.cssCustomProperty})`
        );
        window.addEventListener("message", this.handleMessage);
    }
    render() {
        if (this.state.dataDictionary !== undefined) {
            return (
                <div>
                    <style>{style}</style>
                    <div
                        className={classNames("preview", [
                            "preview__transparent",
                            this.state.transparentBackground,
                        ])}
                        dir={this.state.direction}
                    >
                        <div ref={this.ref} />
                    </div>
                </div>
            );
        }
        return null;
    }
    componentDidMount() {
        window.postMessage(
            {
                type: MessageSystemType.custom,
                action: ViewerCustomAction.call,
                value: previewReady,
            },
            "*"
        );
    }
    attachMappedComponents() {
        if (this.state.dataDictionary !== undefined && this.ref.current !== null) {
            const root = document.createElement("div");
            const innerDiv = document.createElement("div");
            this.ref.current.innerHTML = "";
            innerDiv.setAttribute("style", "padding: 20px;");
            root.setAttribute("style", "min-height: 100vh; min-width: 100vw;");
            direction.withDefault(this.state.direction);
            baseLayerLuminance.withDefault(this.state.theme);
            fillColor.withDefault(
                SwatchRGB.create(this.state.theme, this.state.theme, this.state.theme)
            );
            root.appendChild(innerDiv);
            innerDiv.appendChild(
                mapDataDictionary({
                    dataDictionary: this.state.dataDictionary,
                    schemaDictionary: this.state.schemaDictionary,
                    mapper: htmlMapper({
                        version: 1,
                        tags: Object.entries(
                            Object.assign(
                                Object.assign({}, fastComponentDefinitions),
                                nativeElementDefinitions
                            )
                        ).reduce((previousValue, currentValue) => {
                            if (Array.isArray(currentValue[1].tags)) {
                                return previousValue.concat(currentValue[1].tags);
                            }
                            return previousValue;
                        }, []),
                    }),
                    resolver: htmlResolver,
                })
            );
            this.ref.current.append(root);
        }
    }
}
export default Preview;
