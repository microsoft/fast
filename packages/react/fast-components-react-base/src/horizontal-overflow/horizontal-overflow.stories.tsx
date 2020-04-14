import { storiesOf } from "@storybook/react";
import React from "react";
import { action } from "@storybook/addon-actions";
import Button from "../button";
import Image from "../image";
import HorizontalOverflow, { OverflowChange } from "./";

const images: JSX.Element[] = [
    "https://placehold.it/120x100/414141/?text=1",
    "https://placehold.it/180x100?text=2",
    "https://placehold.it/240x100/414141/?text=3",
    "https://placehold.it/120x100?text=4",
    "https://placehold.it/840x100/414141/?text=5",
    "https://placehold.it/200x100?text=6",
    "https://placehold.it/220x100/414141/?text=7",
    "https://placehold.it/170x100?text=8",
    "https://placehold.it/160x100/414141/?text=9",
    "https://placehold.it/240x100?text=10",
    "https://placehold.it/110x100/414141/?text=11",
    "https://placehold.it/270x100?text=12",
].map(
    (src: string): JSX.Element => {
        return <Image src={src} key={src} alt="Placeholder image" />;
    }
);

interface TestOverflowState {
    overflowStart: boolean;
    overflowEnd: boolean;
}

class TestOverflow extends React.Component<{}, TestOverflowState> {
    private rootElement: React.RefObject<HTMLDivElement> = React.createRef<
        HTMLDivElement
    >();

    constructor(props: {}) {
        super(props);

        this.state = {
            overflowStart: false,
            overflowEnd: false,
        };
    }

    public render(): JSX.Element {
        return (
            <HorizontalOverflow onOverflowChange={this.setOverflowState}>
                {this.props.children}
                {this.state.overflowStart && <Button slot="previous">Previous</Button>}
                {this.state.overflowEnd && <Button slot="next">Next</Button>}
            </HorizontalOverflow>
        );
    }

    private setOverflowState = (overflow: OverflowChange): void => {
        this.setState({
            overflowStart: overflow.overflowStart,
            overflowEnd: overflow.overflowEnd,
        });
    };
}

storiesOf("Horizontal overflow", module)
    .add("Default", () => (
        <HorizontalOverflow
            onScrollChange={action("onScrollChange")}
            onOverflowChange={action("onOverflowChange")}
        >
            <Button slot="previous">Previous</Button>
            <Button slot="next">Next</Button>
            {images}
        </HorizontalOverflow>
    ))
    .add("Custom scroll duration", () => (
        <div>
            <HorizontalOverflow
                onScrollChange={action("onScrollChange")}
                onOverflowChange={action("onOverflowChange")}
                scrollDuration={5000}
            >
                <Button slot="previous">Previous</Button>
                <Button slot="next">Next</Button>
                {images}
            </HorizontalOverflow>
        </div>
    ))
    .add("RTL ", () => (
        <div dir="rtl">
            <TestOverflow>{images}</TestOverflow>
        </div>
    ))
    .add("With buttons", () => (
        <HorizontalOverflow>
            <Button slot="previous">Previous</Button>
            <Button slot="next">Next</Button>
            <Button>
                <img src="https://placehold.it/220x100/414141/?text=1" />
            </Button>
            <Button>
                <img src="https://placehold.it/220x100/414141/?text=2" />
            </Button>
            <Button>
                <img src="https://placehold.it/220x100/414141/?text=3" />
            </Button>
            <Button>
                <img src="https://placehold.it/220x100/414141/?text=4" />
            </Button>
            <Button>
                <img src="https://placehold.it/220x100/414141/?text=5" />
            </Button>
            <Button>
                <img src="https://placehold.it/220x100/414141/?text=6" />
            </Button>
            <Button>
                <img src="https://placehold.it/220x100/414141/?text=7" />
            </Button>
            <Button>
                <img src="https://placehold.it/420x100/414141/?text=8" />
            </Button>
            <Button>
                <img src="https://placehold.it/120x100/414141/?text=9" />
            </Button>
            <Button>
                <img src="https://placehold.it/220x100/414141/?text=10" />
            </Button>
        </HorizontalOverflow>
    ));
