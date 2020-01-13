import { storiesOf } from "@storybook/react";
import React from "react";
import StackPanel, { StackPanelProps } from "./";
import { isNil } from "lodash-es";
import Foundation from "@microsoft/fast-components-foundation-react";
import { ItemSpanOverride, stackPanelOrientation } from "./stack-panel.props";
import Button from "../button";

const itemSpans: ItemSpanOverride = {
    0: 120,
    1: 180,
    2: 240,
    3: 120,
    4: 640,
    5: 200,
    6: 220,
    7: 170,
    8: 160,
    9: 240,
    10: 110,
    11: 270,
};

const horizontalImages: JSX.Element[] = [
    "https://placehold.it/120x100/414141/?text=1",
    "https://placehold.it/180x100?text=2",
    "https://placehold.it/240x100/414141/?text=3",
    "https://placehold.it/120x100?text=4",
    "https://placehold.it/640x100/414141/?text=5",
    "https://placehold.it/200x100?text=6",
    "https://placehold.it/220x100/414141/?text=7",
    "https://placehold.it/170x100?text=8",
    "https://placehold.it/160x100/414141/?text=9",
    "https://placehold.it/240x100?text=10",
    "https://placehold.it/110x100/414141/?text=11",
    "https://placehold.it/270x100?text=12",
].map(
    (src: string, index: number): JSX.Element => {
        return (
            <Button
                key={index}
                style={{
                    padding: "0px",
                    height: "100px",
                }}
            >
                <img
                    src={src}
                    alt="Placeholder image"
                    style={{
                        height: "100px",
                    }}
                />
                ;
            </Button>
        );
    }
);

const verticalImages: JSX.Element[] = [
    "https://placehold.it/100x120/414141/?text=1",
    "https://placehold.it/100x180?text=2",
    "https://placehold.it/100x240/414141/?text=3",
    "https://placehold.it/100x120?text=4",
    "https://placehold.it/100x640/414141/?text=5",
    "https://placehold.it/100x200?text=6",
    "https://placehold.it/100x220/414141/?text=7",
    "https://placehold.it/100x170?text=8",
    "https://placehold.it/100x160/414141/?text=9",
    "https://placehold.it/100x240?text=10",
    "https://placehold.it/100x110/414141/?text=11",
    "https://placehold.it/100x270?text=12",
].map(
    (src: string, index: number): JSX.Element => {
        return (
            <Button
                key={index}
                style={{
                    padding: "0px",
                    width: "100px",
                }}
            >
                <img
                    src={src}
                    alt="Placeholder image"
                    style={{
                        width: "100px",
                    }}
                />
                ;
            </Button>
        );
    }
);

const uniformImages: JSX.Element[] = [
    "https://placehold.it/100x100/414141/?text=1",
    "https://placehold.it/100x100?text=2",
    "https://placehold.it/100x100/414141/?text=3",
    "https://placehold.it/100x100?text=4",
    "https://placehold.it/100x100/414141/?text=5",
    "https://placehold.it/100x100?text=6",
    "https://placehold.it/100x100/414141/?text=7",
    "https://placehold.it/100x100?text=8",
    "https://placehold.it/100x100/414141/?text=9",
    "https://placehold.it/100x100?text=10",
    "https://placehold.it/100x100/414141/?text=11",
    "https://placehold.it/100x100?text=12",
].map(
    (src: string, index: number): JSX.Element => {
        return (
            <Button
                key={index}
                style={{
                    padding: "0px",
                    width: "100px",
                    height: "100px",
                }}
            >
                <img
                    src={src}
                    alt="Placeholder image"
                    style={{
                        width: "100px",
                        height: "100px",
                    }}
                />
                ;
            </Button>
        );
    }
);

interface TestStackPanelProps {
    stackPanelProps?: StackPanelProps;
    itemCount: number;
}

class TestStackPanel extends React.Component<TestStackPanelProps, {}> {
    constructor(props: TestStackPanelProps) {
        super(props);

        this.state = {};
    }

    public render(): JSX.Element {
        return (
            <StackPanel
                style={{
                    width: "117px",
                    height: "400px",
                    overflowY: "scroll",
                }}
                {...this.props.stackPanelProps}
            >
                {this.generateItems()}
            </StackPanel>
        );
    }

    private generateItems = (): React.ReactFragment[] => {
        const items: React.ReactFragment[] = [];

        const defaultSpan: number = isNil(this.props.stackPanelProps.defaultItemSpan)
            ? 100
            : this.props.stackPanelProps.defaultItemSpan;

        const overrideKeys: string[] = isNil(this.props.stackPanelProps.itemSpanOverrides)
            ? []
            : Object.keys(this.props.stackPanelProps.itemSpanOverrides);

        for (let i: number = 0; i < this.props.itemCount; i++) {
            const thisSpan: number = overrideKeys.includes(`${i}`)
                ? this.props.stackPanelProps.itemSpanOverrides[i]
                : defaultSpan;

            const thisHeight: number =
                this.props.stackPanelProps.orientation ===
                stackPanelOrientation.horizontal
                    ? 100
                    : thisSpan;

            const thisWidth: number =
                this.props.stackPanelProps.orientation ===
                stackPanelOrientation.horizontal
                    ? thisSpan
                    : 100;

            items.push(this.generateItem(i, thisHeight, thisWidth));
        }

        return items;
    };

    private generateItem = (
        index: number,
        height: number,
        width: number
    ): React.ReactChild => {
        return (
            <Button
                tabIndex={index + 1}
                key={index}
                style={{
                    padding: "0px",
                    width: `${width}px`,
                    height: `${height}px`,
                }}
            >
                <img
                    src={`https://placehold.it/${width}x${height}?text=${index + 1}`}
                    alt="Placeholder image"
                    style={{
                        width: `${width}px`,
                        height: `${height}px`,
                    }}
                />
            </Button>
        );
    };
}

storiesOf("Stack Panel", module)
    .add("Disable virtualization", () => (
        <StackPanel
            defaultItemSpan={100}
            enableVirtualization={false}
            style={{
                width: "117px",
                height: "400px",
                overflowY: "scroll",
            }}
        >
            {uniformImages}
        </StackPanel>
    ))
    .add("Vertical uniform", () => (
        <StackPanel
            defaultItemSpan={100}
            style={{
                width: "117px",
                height: "400px",
                overflowY: "scroll",
            }}
        >
            {uniformImages}
        </StackPanel>
    ))
    .add("Horizontal uniform", () => (
        <StackPanel
            defaultItemSpan={100}
            orientation={stackPanelOrientation.horizontal}
            style={{
                width: "400px",
                height: "117px",
                overflowX: "scroll",
            }}
        >
            {uniformImages}
        </StackPanel>
    ))
    .add("Vertical variable height", () => (
        <StackPanel
            defaultItemSpan={100}
            itemSpanOverrides={itemSpans}
            style={{
                width: "117px",
                height: "400px",
                overflowY: "scroll",
            }}
        >
            {verticalImages}
        </StackPanel>
    ))
    .add("Horizontal variable width", () => (
        <StackPanel
            defaultItemSpan={100}
            itemSpanOverrides={itemSpans}
            orientation={stackPanelOrientation.horizontal}
            style={{
                width: "400px",
                height: "117px",
                overflowX: "scroll",
            }}
        >
            {horizontalImages}
        </StackPanel>
    ))
    .add("Never virtualize first and last", () => (
        <StackPanel
            defaultItemSpan={100}
            itemSpanOverrides={itemSpans}
            neverVirtualizeIndexes={[0, 11]}
            style={{
                width: "117px",
                height: "400px",
                overflowY: "scroll",
            }}
        >
            {verticalImages}
        </StackPanel>
    ))
    .add("Disable smooth scrolling", () => (
        <StackPanel
            enableSmoothScrolling={false}
            defaultItemSpan={100}
            itemSpanOverrides={itemSpans}
            neverVirtualizeIndexes={[0, 11]}
            style={{
                width: "117px",
                height: "400px",
                overflowY: "scroll",
            }}
        >
            {verticalImages}
        </StackPanel>
    ))
    .add("Initially visible item set", () => (
        <StackPanel
            defaultItemSpan={100}
            initiallyVisibleItemIndex={6}
            style={{
                width: "117px",
                height: "400px",
                overflowY: "scroll",
            }}
        >
            {uniformImages}
        </StackPanel>
    ))
    .add("Many items", () => (
        <TestStackPanel
            stackPanelProps={{
                itemSpanOverrides: itemSpans,
                enableVirtualization: true,
                preloadBufferLength: 6,
                neverVirtualizeIndexes: [0, 9999],
            }}
            itemCount={10000}
        />
    ));
