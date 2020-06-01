import { storiesOf } from "@storybook/react";
import React from "react";
import { isEqual, omit } from "lodash-es";
import { Omit } from "utility-types";
import DataGrid, {
    DataGridCellRenderConfig,
    DataGridColumnDefinition,
    DataGridProps,
    DataGridRowHeightCallbackParams,
} from "./index";

function imageCellFn(config: DataGridCellRenderConfig): React.ReactNode {
    return (
        <div
            {...config.unhandledProps}
            data-cellid={config.columnDataKey}
            className={config.classNames}
            ref={config.rootElement}
            style={{
                gridColumn: config.columnIndex,
                borderWidth: "1",
                borderColor: "black",
                background: "white",
                borderStyle: "solid",
            }}
        >
            <img
                src={config.rowData[config.columnDataKey]}
                alt="Placeholder image"
                style={{
                    width: "auto",
                    height: "auto",
                }}
            />
        </div>
    );
}

function recordIdCellFn(config: DataGridCellRenderConfig): React.ReactNode {
    return (
        <div
            {...config.unhandledProps}
            data-cellid={config.columnDataKey}
            className={config.classNames}
            ref={config.rootElement}
            style={{
                gridColumn: config.columnIndex,
                borderWidth: "1",
                borderColor: "black",
                background: "grey",
                borderStyle: "solid",
            }}
        >
            <img
                src={`https://placehold.it/120x100/414141/?text=${
                    config.rowData[config.columnDataKey]
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

function getRowHeight(row: DataGridRowHeightCallbackParams): number {
    if (row.rowIndex % 2) {
        return row.defaultRowHeight;
    }
    return row.defaultRowHeight * 2;
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
        const { ...props }: Partial<DataGridProps> = omit(this.props, [
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
                    rowHeight={this.props.rowHeight}
                    {...props}
                />
            </div>
        );
    }

    private toggleDataSetButtonClick = (): void => {
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
            rowHeight={100}
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
            rowHeight={100}
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
            rowHeight={100}
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
            rowHeight={100}
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
            rowHeight={100}
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
            rowHeight={100}
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
            rowHeight={100}
            columnDefinitions={columnDefinitions}
            rowHeightCallback={getRowHeight}
        />
    ))
    .add("No virtualization", () => (
        <DataGrid
            style={{
                height: "300px",
            }}
            virtualizeItems={false}
            dataRowKey="recordId"
            gridData={getDataSet(100)}
            defaultFocusRowKey="id-50"
            rowHeight={100}
            columnDefinitions={columnDefinitions}
        />
    ));
