import React from "react";
interface ViewerContentState {
    message: string;
}
declare class ViewerContent extends React.Component<{}, ViewerContentState> {
    constructor(props: {});
    render(): React.ReactNode;
    private handleReset;
    private handlePostMessage;
}
export default ViewerContent;
