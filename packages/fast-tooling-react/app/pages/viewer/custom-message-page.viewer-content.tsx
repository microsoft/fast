import React from "react";

interface CustomMessagePageViewerContentState {
    message: any;
}

class CustomMessagePageViewerContent extends React.Component<
    {},
    CustomMessagePageViewerContentState
> {
    constructor(props: {}) {
        super(props);

        this.state = {
            message: true,
        };
    }

    public render(): JSX.Element {
        return <pre>{JSON.stringify(this.state.message)}</pre>;
    }

    public componentDidMount(): void {
        window.addEventListener("message", this.handleMessage);
    }

    private handleMessage = (e: any): void => {
        const messageData: boolean | void =
            e.data === "true" ? true : e.data === "false" ? false : undefined;

        if (typeof messageData === "boolean") {
            this.setState({
                message: messageData,
            });
        }
    };
}

export default CustomMessagePageViewerContent;
