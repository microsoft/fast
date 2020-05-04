import { storiesOf } from "@storybook/react";
import React from "react";
import DataGrid, {
    DataGridCellProps,
    DataGridColumnDefinition,
    DataGridProps,
} from "./index";
import { isEqual, omit } from "lodash-es";
import { Omit } from "utility-types";

function imageCellFn(
    props: DataGridCellProps,
    className: string,
    cellId: React.ReactText,
    rootElement: React.RefObject<any>,
    focusTarget: React.RefObject<any>,
    unhandledProps: object
): React.ReactNode {
    return (
        <div
            {...unhandledProps}
            data-cellid={cellId}
            className={className}
            ref={rootElement}
            style={{
                gridColumn: props.columnIndex,
                borderWidth: "1",
                borderColor: "black",
                background: "white",
                borderStyle: "solid",
            }}
        >
            <img
                src={props.rowData[props.columnDefinition.columnDataKey]}
                alt="Placeholder image"
                style={{
                    width: "auto",
                    height: "auto",
                }}
            />
        </div>
    );
}

function recordIdCellFn(
    props: DataGridCellProps,
    className: string,
    cellId: React.ReactText,
    rootElement: React.RefObject<any>,
    focusTarget: React.RefObject<any>,
    unhandledProps: object
): React.ReactNode {
    return (
        <div
            {...unhandledProps}
            data-cellid={cellId}
            className={className}
            ref={rootElement}
            style={{
                gridColumn: props.columnIndex,
                borderWidth: "1",
                borderColor: "black",
                background: "grey",
                borderStyle: "solid",
            }}
        >
            <img
                src={`https://placehold.it/120x100/414141/?text=${
                    props.rowData[props.columnDefinition.columnDataKey]
                }`}
                alt="Placeholder image"
                style={{
                    width: "auto",
                    height: "auto",
                }}
            />
        </div>
    );
}

const columnDefinitions: DataGridColumnDefinition[] = [
    {
        columnDataKey: "recordId",
        title: "RecordId",
        columnWidth: "120px",
        cell: recordIdCellFn,
    },
    {
        columnDataKey: "image",
        title: "Image",
        columnWidth: "auto",
        cell: imageCellFn,
    },
];

function getDataSet(length: number): object[] {
    const dataSet: object[] = [];

    for (let i: number = 0; i < length; i++) {
        const heightString: string = i % 2 ? "/150/100" : "/300/200";
        dataSet.push({
            recordId: `id-${i + 1}`,
            image: `https://picsum.photos/id/${Math.floor(
                Math.random() * 1000
            )}${heightString}`,
        });
    }

    return dataSet;
}

function getItemHeight(itemData: object, rowIndex, defaultItemHeight) {
    if (rowIndex % 2) {
        return defaultItemHeight;
    }
    return defaultItemHeight * 2;
}

interface DataGridTestState {
    /**
     * The dataset to show
     */
    currentDataSet: object[];
}

interface DataGridTestProps extends Omit<DataGridProps, "gridData"> {
    /**
     * Primary data set
     */
    primaryDataSet: object[];

    /**
     * Secondary data set
     */
    secondaryDataSet: object[];
}

class DataGridTest extends React.Component<DataGridTestProps, DataGridTestState> {
    constructor(props: DataGridTestProps) {
        super(props);

        this.state = {
            currentDataSet: this.props.primaryDataSet,
        };
    }

    public render(): JSX.Element {
        const { children, ...props }: Partial<DataGridProps> = omit(this.props, [
            "primaryDataSet",
            "secondaryDataSet",
        ]);

        return (
            <div>
                <button
                    style={{
                        margin: "20px",
                    }}
                    onClick={this.toggleDataSetButtonClick}
                >
                    Toggle data
                </button>
                <DataGrid
                    columnDefinitions={this.props.columnDefinitions}
                    dataRowKey={this.props.dataRowKey}
                    gridData={this.state.currentDataSet}
                    itemHeight={this.props.itemHeight}
                    {...props}
                />
            </div>
        );
    }

    private toggleDataSetButtonClick = (e: React.MouseEvent<any>): void => {
        if (isEqual(this.state.currentDataSet, this.props.primaryDataSet)) {
            this.setState({
                currentDataSet: this.props.secondaryDataSet,
            });
        } else {
            this.setState({
                currentDataSet: this.props.primaryDataSet,
            });
        }
    };
}

storiesOf("Data Grid", module)
    .add("Detail View", () => (
        <DataGrid
            style={{
                height: "300px",
            }}
            dataRowKey="recordId"
            gridData={getDataSet(100)}
            itemHeight={100}
            columnDefinitions={columnDefinitions}
        />
    ))
    .add("Initially visible row", () => (
        <DataGrid
            style={{
                height: "300px",
            }}
            dataRowKey="recordId"
            gridData={getDataSet(100)}
            itemHeight={100}
            columnDefinitions={columnDefinitions}
            defaultFocusRowKey="id-50"
            defaultFocusColumnKey="image"
        />
    ))
    .add("Empty grid", () => (
        <DataGrid
            style={{
                height: "300px",
            }}
            dataRowKey="recordId"
            gridData={[]}
            itemHeight={100}
            columnDefinitions={columnDefinitions}
        />
    ))
    .add("Controlled Height and Width", () => (
        <DataGrid
            style={{
                height: "300px",
                width: "500px",
            }}
            dataRowKey="recordId"
            gridData={getDataSet(100)}
            itemHeight={100}
            columnDefinitions={columnDefinitions}
        />
    ))
    .add("Toggle smaller data set", () => (
        <DataGridTest
            style={{
                height: "300px",
                width: "500px",
            }}
            dataRowKey="recordId"
            primaryDataSet={getDataSet(10000)}
            secondaryDataSet={getDataSet(2000)}
            itemHeight={100}
            columnDefinitions={columnDefinitions}
        />
    ))
    .add("Toggle empty data set", () => (
        <DataGridTest
            style={{
                height: "300px",
                width: "500px",
            }}
            dataRowKey="recordId"
            primaryDataSet={getDataSet(100)}
            secondaryDataSet={getDataSet(0)}
            itemHeight={100}
            columnDefinitions={columnDefinitions}
        />
    ))
    .add("Variable height rows", () => (
        <DataGrid
            style={{
                height: "400px",
                width: "800px",
            }}
            dataRowKey="recordId"
            gridData={getDataSet(10000)}
            itemHeight={100}
            columnDefinitions={columnDefinitions}
            itemHeightCallback={getItemHeight}
        />
    ));
