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
    unhandledProps: object
): React.ReactNode {
    return (
        <div
            {...unhandledProps}
            data-cellid={cellId}
            className={className}
            style={{
                gridColumn: props.columnIndex,
            }}
        >
            <img
                src={props.rowData[props.columnDefinition.columnDataKey]}
                alt="Placeholder image"
                style={{
                    width: "100px",
                    height: "60px",
                }}
            />
        </div>
    );
}

const columnDefinitions: DataGridColumnDefinition[] = [
    {
        columnDataKey: "image",
        title: "Image",
        columnWidth: "70%",
        cell: imageCellFn,
    },
    {
        columnDataKey: "recordId",
        title: "RecordId",
        columnWidth: "30%",
    },
];

function getDataSet(length: number): object[] {
    const dataSet: object[] = [];

    for (let i: number = 0; i < length; i++) {
        dataSet.push({
            recordId: `id-${i + 1}`,
            image: `https://placehold.it/200x200/414141/?text=${i + 1}`,
        });
    }

    return dataSet;
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
    public static getItemHeight(
        rowData: object,
        rowIndex: number,
        defaultItemHeight: number
    ): number {
        if (rowIndex % 2) {
            return defaultItemHeight;
        }
        return defaultItemHeight * 2;
    }

    private anchor: React.RefObject<any>;

    private rootElement: React.RefObject<HTMLDivElement> = React.createRef<
        HTMLDivElement
    >();

    constructor(props: DataGridTestProps) {
        super(props);

        this.anchor = React.createRef();

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
            columnDefinitions={columnDefinitions}
        />
    ))
    .add("Empty grid", () => (
        <DataGrid
            style={{
                height: "300px",
            }}
            dataRowKey="recordId"
            gridData={[]}
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
            columnDefinitions={columnDefinitions}
        />
    ))
    .add("Variable height rows", () => (
        <DataGridTest
            style={{
                height: "300px",
                width: "500px",
            }}
            dataRowKey="recordId"
            primaryDataSet={getDataSet(100)}
            secondaryDataSet={getDataSet(100)}
            columnDefinitions={columnDefinitions}
            // itemHeightCallback={DataGridTest.getItemHeight}
        />
    ));
