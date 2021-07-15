import React from "react";
interface ExampleState {
    data: string;
}
declare class Example extends React.Component<{}, ExampleState> {
    constructor(props: any);
    render(): JSX.Element;
    private handleMessageSystem;
}
export default Example;
