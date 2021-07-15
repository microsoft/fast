import React from "react";
import FASTMessageSystemWorker from "@microsoft/fast-tooling/dist/message-system.min.js";
import { MessageSystem } from "@microsoft/fast-tooling";
import { ModularForm } from "@microsoft/fast-tooling-react";
const fastMessageSystemWorker = new FASTMessageSystemWorker();
let fastMessageSystem;
class Example extends React.Component {
    constructor(props) {
        super(props);
        this.handleMessageSystem = e => {
            if (
                e.data &&
                typeof e.data.data === "string" &&
                e.data.data !== this.state.data
            ) {
                this.setState({
                    data: e.data.data,
                });
            }
        };
        if (window.Worker) {
            fastMessageSystem = new MessageSystem({
                webWorker: fastMessageSystemWorker,
                dataDictionary: [
                    {
                        root: {
                            schemaId: "text",
                            data: "Hello world",
                        },
                    },
                    "root",
                ],
                schemaDictionary: {
                    text: {
                        title: "Text",
                        id: "text",
                        type: "string",
                    },
                },
            });
            fastMessageSystem.add({
                onMessage: this.handleMessageSystem,
            });
        }
        this.state = {
            data: "Hello world",
        };
    }
    render() {
        return (
            <div>
                <ModularForm messageSystem={fastMessageSystem} />
                <pre>{this.state.data}</pre>
            </div>
        );
    }
}
export default Example;
