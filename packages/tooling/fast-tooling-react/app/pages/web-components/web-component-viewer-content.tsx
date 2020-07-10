import React from "react";
import {
    DataDictionary,
    htmlMapper,
    htmlResolver,
    mapDataDictionary,
    MessageSystemType,
    SchemaDictionary,
} from "@microsoft/fast-tooling";
import FancyButton from "./fancy-button";

interface WebComponentViewerContentState {
    message: string;
    dataDictionary: DataDictionary<unknown>;
    schemaDictionary: SchemaDictionary;
    activeDictionaryId: string;
}

class WebComponentViewerContent extends React.Component<
    {},
    WebComponentViewerContentState
> {
    private ref: React.RefObject<HTMLDivElement>;

    constructor(props: {}) {
        super(props);

        this.ref = React.createRef();

        this.state = {
            message: "Hello world",
            dataDictionary: null,
            schemaDictionary: {},
            activeDictionaryId: null,
        };

        customElements.define("fancy-button", FancyButton);

        window.addEventListener("message", this.handlePostMessage);
    }

    public render(): React.ReactNode {
        return (
            <React.Fragment>
                <div ref={this.ref} />
                <pre>{this.state.message}</pre>
            </React.Fragment>
        );
    }

    private handlePostMessage = (e: MessageEvent): void => {
        if (e.origin === location.origin && typeof e.data === "string") {
            try {
                const parsedJSON = JSON.parse(e.data);

                if (parsedJSON.type === MessageSystemType.initialize) {
                    this.setState({
                        message: JSON.stringify(parsedJSON, null, 2),
                        dataDictionary: parsedJSON.dataDictionary,
                        schemaDictionary: parsedJSON.schemaDictionary,
                        activeDictionaryId: parsedJSON.activeDictionaryId,
                    });
                } else if (parsedJSON.type === MessageSystemType.data) {
                    const mappedData: HTMLElement = mapDataDictionary({
                        dataDictionary: parsedJSON.dataDictionary as DataDictionary<any>,
                        schemaDictionary: this.state.schemaDictionary,
                        mapper: htmlMapper({
                            version: 1,
                            tags: [
                                {
                                    name: "fancy-button",
                                    description: "A fancier button",
                                    attributes: [],
                                    slots: [
                                        {
                                            name: "",
                                            description: "The default slot",
                                        },
                                    ],
                                },
                            ],
                        }),
                        resolver: htmlResolver,
                    });

                    this.ref.current.innerHTML = "";
                    this.ref.current.append(mappedData);

                    this.setState({
                        message: JSON.stringify(parsedJSON, null, 2),
                        dataDictionary: parsedJSON.dataDictionary,
                    });
                }
            } catch (e) {}
        }
    };
}

export default WebComponentViewerContent;
