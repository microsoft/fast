import React from "react";

interface ViewerContentState {
    message: string;
}

class ViewerContent extends React.Component<{}, ViewerContentState> {
    constructor(props: {}) {
        super(props);

        this.state = {
            message: "Hello world",
        };

        window.addEventListener("message", this.handlePostMessage);
    }

    public render(): React.ReactNode {
        return <pre>{this.state.message}</pre>;
    }

    private handlePostMessage = (e: MessageEvent): void => {
        if (typeof e.data === "string") {
            try {
                this.setState({
                    message: JSON.stringify(JSON.parse(e.data), null, 2),
                });

                window.postMessage(e.data, "");
            } catch (e) {}
        }
    };
}

export default ViewerContent;
