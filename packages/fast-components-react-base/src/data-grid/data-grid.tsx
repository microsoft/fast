import React, { ReactText } from "react";
import ReactDOM from "react-dom";
import { DataGridClassNameContract } from "@microsoft/fast-components-class-name-contracts-base";
import { get, isNil } from "lodash-es";
import Foundation, { HandledProps } from "@microsoft/fast-components-foundation-react";
import {
    DataGridColumnDefinition,
    DataGridHandledProps,
    DataGridProps,
    DataGridUnhandledProps,
} from "./data-grid.props";
import DataGridRow from "./data-grid-row";
import { classNames, Direction, KeyCodes } from "@microsoft/fast-web-utilities";
import { DataGridCellProps } from "./data-grid-cell.props";
import { DataGridContext, DataGridContextType } from "./data-grid-context";
import StackPanel, { ItemSpanOverride } from "../stack-panel";
import { RowPosition } from "./data-grid-row.props";
import throttle from "raf-throttle";

export interface DataGridState {
    focusRowKey: React.ReactText;
    focusColumnKey: React.ReactText;
    scrollBarWidth: number;
    currentDataPageStartIndex: number;
    currentDataPageEndIndex: number;
    rowPositions: rowPosition[];
    estimatedTotalHeight: number;
}

/**
 * Used to store the pixel coordinates and span of items
 */
interface rowPosition {
    start: number;
    span: number;
    end: number;
}

class DataGrid extends Foundation<
    DataGridHandledProps,
    DataGridUnhandledProps,
    DataGridState
> {
    public static defaultProps: Partial<DataGridProps> = {
        itemHeight: 60,
        stableRangeEndIndex: 0,
        pageSize: 1000,
        itemHeightCallback: (
            rowData: object,
            rowIndex: number,
            defaultItemHeight: number
        ) => {
            return defaultItemHeight;
        },
        managedClasses: {},
    };

    public static displayName: string = "DataGrid";

    protected handledProps: HandledProps<DataGridHandledProps> = {
        dataRowKey: void 0,
        gridData: void 0,
        columnDefinitions: void 0,
        itemHeight: void 0,
        itemHeightCallback: void 0,
        managedClasses: void 0,
        defaultFocusColumnKey: void 0,
        defaultFocusRowIndex: void 0,
        stableRangeEndIndex: void 0,
        pageSize: void 0,
    };

    private currentTemplateColumns: string = "";
    private rootElement: React.RefObject<HTMLDivElement> = React.createRef<
        HTMLDivElement
    >();

    private direction: Direction = Direction.ltr;
    private defaultRowIndex: number = 0;
    private isFocused: boolean = false;
    private throttledScroll: throttle;

    /**
     * constructor
     */
    constructor(props: DataGridProps) {
        super(props);

        const rowPositions: rowPosition[] = [];
        this.throttledScroll = throttle(this.handleScrollChange);
        this.sizeNextPage(rowPositions);

        let currentDataPageStartIndex: number = 0;
        let currentDataPageEndIndex = this.props.pageSize - 1;
        if (currentDataPageEndIndex > this.props.gridData.length - 1) {
            currentDataPageEndIndex = this.props.gridData.length - 1;
        }

        if (!isNil(this.props.defaultFocusRowIndex)) {
            const halfPage: number = Math.floor(this.props.pageSize / 2);

            currentDataPageStartIndex = this.defaultRowIndex - halfPage;
            if (currentDataPageStartIndex < 0) {
                currentDataPageStartIndex = 0;
            }

            currentDataPageEndIndex = currentDataPageStartIndex + this.props.pageSize;
            if (currentDataPageEndIndex > this.props.gridData.length - 1) {
                currentDataPageEndIndex = this.props.gridData.length - 1;
            }

            this.sizePagesToIndex(currentDataPageEndIndex, rowPositions);
        }

        let focusRowKey: React.ReactText = "";
        // if (this.props.gridData.length > 0) {
        //     focusRowKey =
        //         !isNil(this.props.defaultFocusRowKey) &&
        //         this.getRowIndexByKey(this.props.defaultFocusRowKey) !== -1
        //             ? this.props.defaultFocusRowKey
        //             : this.props.gridData[0][this.props.dataRowKey];
        // }

        let focusColumnKey: React.ReactText = "";
        // if (this.props.columnDefinitions.length > 0) {
        //     focusColumnKey =
        //         !isNil(this.props.defaultFocusColumnKey) &&
        //         this.getColumnIndexByKey(this.props.defaultFocusColumnKey) !== -1
        //             ? this.props.defaultFocusColumnKey
        //             : this.props.columnDefinitions[0].columnDataKey;
        // }

        this.state = {
            scrollBarWidth: 0,
            currentDataPageStartIndex: currentDataPageStartIndex,
            currentDataPageEndIndex: currentDataPageEndIndex,
            focusColumnKey,
            focusRowKey,
            rowPositions,
            estimatedTotalHeight: this.getEstimatedTotalHeight(rowPositions),
        };
    }

    /**
     * Renders the component
     */
    public render(): React.ReactElement<HTMLDivElement> {
        this.currentTemplateColumns = this.getGridTemplateColumns();

        const itemSpanOverrides: ItemSpanOverride = {};

        if (this.state.rowPositions.length > 0) {
            const startFillerItemSpan: number = this.state.rowPositions[
                this.state.currentDataPageStartIndex
            ].start;
            const endFillerItemSpan: number =
                this.state.estimatedTotalHeight -
                this.state.rowPositions[this.state.currentDataPageEndIndex].end;
            itemSpanOverrides[0] = startFillerItemSpan;
            itemSpanOverrides[
                this.state.currentDataPageEndIndex -
                    this.state.currentDataPageStartIndex +
                    1
            ] = endFillerItemSpan;
        }

        return (
            <DataGridContext.Provider
                value={{
                    onCellFocused: this.handleCellFocus,
                    onCellKeyDown: this.handleCellKeyDown,
                    dataGridState: this.state,
                    dataGridProps: this.props,
                }}
            >
                <div
                    {...this.unhandledProps()}
                    className={this.generateClassNames()}
                    role="grid"
                    tabIndex={-1}
                    onFocus={this.handleGridFocus}
                    onBlur={this.handleGridBlur}
                    ref={this.rootElement}
                >
                    {this.renderGridHeader()}
                    <StackPanel
                        initiallyVisibleItemIndex={
                            isNil(this.props.defaultFocusRowIndex)
                                ? null
                                : this.props.defaultFocusRowIndex
                        }
                        onScrollChange={this.throttledScroll}
                        defaultItemSpan={this.props.itemHeight}
                        itemSpanOverrides={itemSpanOverrides}
                        style={{
                            height: "100%",
                            overflowY: "scroll",
                        }}
                    >
                        {this.renderRows()}
                    </StackPanel>
                </div>
            </DataGridContext.Provider>
        );
    }

    /**
     * React life-cycle method
     */
    public componentDidMount(): void {}

    /**
     * React life-cycle method
     */
    public componentWillUnmount(): void {}

    /**
     * React life-cycle method
     */
    public componentDidUpdate(prevProps: DataGridProps): void {
        if (this.props.gridData !== prevProps.gridData) {
            const newRowPositions: rowPosition[] = this.state.rowPositions.slice(
                0,
                this.props.stableRangeEndIndex
            );

            let newDataPageEndIndex: number = this.state.currentDataPageEndIndex;

            if (newDataPageEndIndex < this.props.pageSize - 1) {
                newDataPageEndIndex = this.props.pageSize - 1;
            }

            if (newDataPageEndIndex > this.props.gridData.length - 1) {
                newDataPageEndIndex = this.props.gridData.length - 1;
            }

            const newDataPageStartIndex: number =
                newDataPageEndIndex - this.props.pageSize < 0
                    ? 0
                    : newDataPageEndIndex - this.props.pageSize;

            this.sizePagesToIndex(newDataPageEndIndex, newRowPositions);

            this.setState({
                rowPositions: newRowPositions,
                currentDataPageStartIndex: newDataPageStartIndex,
                currentDataPageEndIndex: newDataPageEndIndex,
                estimatedTotalHeight: this.getEstimatedTotalHeight(newRowPositions),
            });
        }
    }

    /**
     * Allows refs to the component to call focus on the grid
     */
    public focus = (): void => {
        // this.focusOnCell(this.state.focusRowKey, this.state.focusColumnKey);
    };

    /**
     * Generates class names
     */
    protected generateClassNames(): string {
        const { dataGrid }: DataGridClassNameContract = this.props.managedClasses;

        return super.generateClassNames(classNames(dataGrid));
    }

    /**
     *  render the header
     */
    private renderGridHeader(): React.ReactElement<HTMLDivElement> {
        return (
            <div
                className={classNames(this.props.managedClasses.dataGrid_header)}
                role="row"
                style={{
                    marginRight: this.state.scrollBarWidth,
                    display: "grid",
                    gridTemplateColumns: this.currentTemplateColumns,
                }}
            >
                {this.props.columnDefinitions.map(this.renderColumnHeader)}
            </div>
        );
    }

    /**
     *  render the data rows
     */
    private renderRows = (): React.ReactChild[] => {
        const rowsToRender: React.ReactChild[] = [];
        rowsToRender.push(<div key="frontSpacer" />);
        for (
            let i: number = this.state.currentDataPageStartIndex;
            i <= this.state.currentDataPageEndIndex;
            i++
        ) {
            rowsToRender.push(this.renderRow(this.props.gridData[i], i));
        }
        rowsToRender.push(<div key="backSpacer" />);
        return rowsToRender;
    };

    /**
     *  render each column header
     */
    private renderColumnHeader = (
        column: DataGridColumnDefinition,
        index: number
    ): React.ReactNode => {
        if (!isNil(column.header)) {
            return column.header(
                column.title,
                column.columnDataKey,
                index,
                get(this.props.managedClasses, "dataGrid_columnHeader", "")
            );
        } else {
            return this.renderDefaultColumnHeader(
                column.title,
                column.columnDataKey,
                index,
                get(this.props.managedClasses, "dataGrid_columnHeader", "")
            );
        }
    };

    /**
     *  default column render function
     */
    private renderDefaultColumnHeader = (
        columnTitle: React.ReactFragment,
        key: React.ReactText,
        columnIndex: number,
        className: string
    ): React.ReactNode => {
        return (
            <div
                className={className}
                role="columnheader"
                key={key}
                style={{
                    gridColumn: columnIndex + 1,
                }}
            >
                {columnTitle}
            </div>
        );
    };

    /**
     * Render a single data row
     */
    private renderRow = (rowData: object, index: number): React.ReactChild => {
        if (isNil(rowData)) {
            return;
        }
        const rowKey: React.ReactText = !isNil(rowData[this.props.dataRowKey])
            ? rowData[this.props.dataRowKey]
            : index;
        const {
            dataGrid_row,
            dataGrid_row__focusWithin,
            dataGrid_cell,
        }: DataGridClassNameContract = this.props.managedClasses;

        return (
            <DataGridRow
                key={rowKey}
                rowIndex={index}
                rowData={rowData}
                gridTemplateColumns={this.currentTemplateColumns}
                managedClasses={{
                    dataGridRow: dataGrid_row,
                    dataGridRow__focusWithin: dataGrid_row__focusWithin,
                    dataGridRow_cell: dataGrid_cell,
                }}
            />
        );
    };

    /**
     *  Generates the grid template column css string
     */
    private getGridTemplateColumns = (): string => {
        let templateColumns: string = "";

        this.props.columnDefinitions.forEach(
            (columnDefinition: DataGridColumnDefinition) => {
                templateColumns = `${templateColumns} ${columnDefinition.columnWidth}`;
            }
        );

        return templateColumns;
    };

    /**
     * When the cell with focus scrolls out of the viewport we may need to blur it
     */
    private blurCurrentFocusCell = (): void => {
        if (isNil(this.rootElement.current)) {
            return;
        }

        if (this.rootElement.current.contains(document.activeElement)) {
            (document.activeElement as HTMLElement).blur();
        }
    };

    /**
     *  Handle grid focus by enusuring we only focus on gridcells
     */
    private handleGridFocus = (e: React.FocusEvent<HTMLElement>): void => {
        if (!e.defaultPrevented && e.target.getAttribute("role") !== "gridcell") {
            this.focusOnCell(this.state.focusRowKey, this.state.focusColumnKey);
        }
        if (!this.isFocused) {
            this.isFocused = true;
        }
    };

    /**
     *  Handle grid blur by setting focused state
     */
    private handleGridBlur = (e: React.FocusEvent<HTMLElement>): void => {
        const root: HTMLDivElement = this.rootElement.current;
        // If we focus outside of the data grid
        if (!!root && !root.contains(e.relatedTarget as HTMLElement)) {
            this.isFocused = false;
        }
    };

    /**
     * Handle the keydown event of the item
     */
    private handleCellKeyDown = (
        cell: DataGridCellProps,
        e: React.KeyboardEvent<HTMLElement>
    ): void => {
        if (e.defaultPrevented) {
            return;
        }

        switch (e.keyCode) {
            case KeyCodes.arrowDown:
                e.preventDefault();
                this.incrementFocusRow(1);
                break;

            case KeyCodes.arrowRight:
                this.incrementFocusColumn(1);
                e.preventDefault();
                break;

            case KeyCodes.arrowUp:
                this.incrementFocusRow(-1);
                e.preventDefault();
                break;

            case KeyCodes.arrowLeft:
                this.incrementFocusColumn(-1);
                e.preventDefault();
                break;

            // case KeyCodes.pageDown:
            //     this.incrementFocusRow(this.getPageHeightInRows());
            //     e.preventDefault();
            //     break;

            // case KeyCodes.pageUp:
            //     this.incrementFocusRow(-this.getPageHeightInRows());
            //     e.preventDefault();
            //     break;

            case KeyCodes.home:
                if (e.ctrlKey) {
                    this.incrementFocusRow(-this.props.gridData.length);
                } else {
                    this.incrementFocusColumn(-this.props.columnDefinitions.length);
                }
                e.preventDefault();
                break;

            case KeyCodes.end:
                if (e.ctrlKey) {
                    this.incrementFocusRow(this.props.gridData.length);
                } else {
                    this.incrementFocusColumn(this.props.columnDefinitions.length);
                }
                e.preventDefault();
                break;
        }
    };

    /**
     * load next page of data
     */
    private sizeNextPage = (rowPositions: rowPosition[]): void => {
        const pageStartIndex: number = rowPositions.length;
        const maxEndIndex: number = this.props.gridData.length - 1;

        let pageEndIndex: number = pageStartIndex + this.props.pageSize - 1;

        if (pageEndIndex > maxEndIndex) {
            pageEndIndex = maxEndIndex;
        }

        for (let i: number = pageStartIndex; i <= pageEndIndex; i++) {
            const thisRowStart: number = i === 0 ? 0 : rowPositions[i - 1].end;
            const thisRowHeight: number = this.props.itemHeightCallback(
                this.props.gridData[i],
                i,
                this.props.itemHeight
            );
            rowPositions.push({
                start: thisRowStart,
                span: thisRowHeight,
                end: thisRowStart + thisRowHeight,
            });
        }
    };

    /**
     * get the estimated total height of the datagrid based on row heights calculated so far
     */
    private getEstimatedTotalHeight = (rowPositions: rowPosition[]): number => {
        if (rowPositions.length === 0) {
            return 0;
        }
        const estimatedTotalHeight: number =
            rowPositions[rowPositions.length - 1].end +
            (this.props.gridData.length - rowPositions.length) * this.props.itemHeight;

        return estimatedTotalHeight;
    };

    /**
     * recursive function to load pages to target index
     */
    private sizePagesToIndex = (
        targetIndex: number,
        rowPositions: rowPosition[]
    ): void => {
        let actualTargetIndex =
            targetIndex <= this.props.gridData.length - 1
                ? targetIndex
                : this.props.gridData.length - 1;
        const currentMaxCalculatedIndex = rowPositions.length - 1;
        if (currentMaxCalculatedIndex < actualTargetIndex) {
            this.sizeNextPage(rowPositions);
            this.sizePagesToIndex(actualTargetIndex, rowPositions);
        }
    };

    /**
     * recursive function to load pages to target scroll value
     */
    private sizePagesToScrollPosition = (
        targetScrollValue: number,
        rowPositions: rowPosition[]
    ): void => {
        const currentMaxCalculatedScroll = rowPositions[rowPositions.length - 1].end;
        if (
            currentMaxCalculatedScroll < targetScrollValue &&
            rowPositions.length < this.props.gridData.length
        ) {
            this.sizeNextPage(rowPositions);
            this.sizePagesToScrollPosition(targetScrollValue, rowPositions);
        }
    };

    /**
     * handle scroll events from the stackpanel
     */
    private handleScrollChange = (
        newScrollValue: number,
        scrollMaxValue: number,
        viewportSpan: number
    ): void => {
        const currentPageTop: number = this.state.rowPositions[
            this.state.currentDataPageStartIndex
        ].start;
        const currentPageBottom: number = this.state.rowPositions[
            this.state.currentDataPageEndIndex
        ].end;
        const currentViewportBottom: number = newScrollValue + viewportSpan;

        if (
            newScrollValue < currentPageTop ||
            currentViewportBottom > currentPageBottom
        ) {
            const newRowPositions: rowPosition[] = this.state.rowPositions.slice(0);
            const highestCalculatedScrollPosition: number = this.state.rowPositions[
                this.state.rowPositions.length - 1
            ].end;
            if (currentViewportBottom > highestCalculatedScrollPosition) {
                this.sizePagesToScrollPosition(currentViewportBottom, newRowPositions);
            }

            const middleViewportPosition: number = Math.floor(
                newScrollValue + viewportSpan / 2
            );
            const middleItemIndex: number = this.getIndexOfItemAtScrollPosition(
                middleViewportPosition,
                newRowPositions
            );

            let newDataPageStartIndex: number =
                middleItemIndex - Math.floor(this.props.pageSize) / 2;
            if (newDataPageStartIndex < 0) {
                newDataPageStartIndex = 0;
            }

            let newDataPageEndIndex: number =
                newDataPageStartIndex + this.props.pageSize - 1;
            if (newDataPageEndIndex > this.props.gridData.length - 1) {
                newDataPageEndIndex = this.props.gridData.length - 1;
            }

            this.sizePagesToIndex(newDataPageEndIndex, newRowPositions);

            this.setState({
                currentDataPageStartIndex: newDataPageStartIndex,
                currentDataPageEndIndex: newDataPageEndIndex,
                rowPositions: newRowPositions,
                estimatedTotalHeight: this.getEstimatedTotalHeight(newRowPositions),
            });
        }
    };

    /**
     *
     */
    private getIndexOfItemAtScrollPosition = (
        scrollPosition: number,
        rowPositions: rowPosition[]
    ): number => {
        let estimatedItemIndex: number = Math.floor(
            scrollPosition / this.props.itemHeight
        );

        if (estimatedItemIndex > this.props.gridData.length - 1) {
            estimatedItemIndex = this.props.gridData.length - 1;
        }
        this.sizePagesToIndex(estimatedItemIndex, rowPositions);

        if (scrollPosition < rowPositions[estimatedItemIndex].start) {
            for (let i: number = estimatedItemIndex; i === 0; i--) {
                if (rowPositions[i].end > scrollPosition) {
                    return i;
                }
            }
            return 0;
        } else if (scrollPosition > rowPositions[estimatedItemIndex].end) {
            const maxIndex = rowPositions.length - 1;
            for (let i: number = estimatedItemIndex; i === maxIndex; i++) {
                if (rowPositions[i].start < scrollPosition) {
                    return i;
                }
            }
            return maxIndex;
        }

        return estimatedItemIndex;
    };

    /**
     * move focus to another row
     */
    private incrementFocusRow = (direction: number): void => {
        // let currentFocusRowIndex: number = this.getRowIndexByKey(this.state.focusRowKey);
        // if (currentFocusRowIndex === -1) {
        //     currentFocusRowIndex = 0;
        // }
        // let newFocusRowIndex: number = currentFocusRowIndex + direction;
        // if (newFocusRowIndex < 0) {
        //     newFocusRowIndex = 0;
        // } else if (newFocusRowIndex >= this.props.gridData.length) {
        //     newFocusRowIndex = this.props.gridData.length - 1;
        // }
        // const newFocusRowKey: React.ReactText = this.props.gridData[newFocusRowIndex][
        //     this.props.dataRowKey
        // ];
        // const rows: Element[] = this.domChildren(this.gridContainerElement.current);
        // let rowElement: Element = rows.find((element: HTMLElement) => {
        //     return element.getAttribute(RowIdKey) === newFocusRowKey;
        // });
        // // if we try to move focus outside the range of instanciated elements
        // // focus on an element at the end/beginning of the range instead
        // if (isNil(rowElement)) {
        //     rowElement = direction > 0 ? rows[rows.length - 1] : rows[0];
        // }
        // const cellElement: Element = this.domChildren(rowElement as HTMLElement).find(
        //     (element: HTMLElement) => {
        //         return element.getAttribute(CellIdKey) === this.state.focusColumnKey;
        //     }
        // );
        // if (isNil(cellElement)) {
        //     return;
        // }
        // (cellElement as HTMLElement).focus();
    };

    /**
     *  move focus to another column
     */
    private incrementFocusColumn = (direction: number): void => {
        this.updateDirection();

        const directionMod: number = this.direction === Direction.ltr ? 1 : -1;

        let currentFocusColumnIndex: number = this.getColumnIndexByKey(
            this.state.focusColumnKey
        );

        if (currentFocusColumnIndex === -1) {
            currentFocusColumnIndex = 0;
        }

        let newFocusColumnIndex: number =
            currentFocusColumnIndex + direction * directionMod;

        if (newFocusColumnIndex < 0) {
            newFocusColumnIndex = 0;
        } else if (newFocusColumnIndex >= this.props.columnDefinitions.length) {
            newFocusColumnIndex = this.props.columnDefinitions.length - 1;
        }

        const newFocusColumnKey: React.ReactText = this.props.columnDefinitions[
            newFocusColumnIndex
        ].columnDataKey;

        const rowElement: Element = this.getRowElementByKey(this.state.focusRowKey);

        if (isNil(rowElement)) {
            return;
        }

        const cellElement: Element = this.getCellElementByKey(
            newFocusColumnKey,
            rowElement
        );

        if (cellElement instanceof HTMLElement) {
            // cellElement.focus();
        }
    };

    /**
     *  Get row element by key
     */
    private getRowElementByKey = (rowId: React.ReactText): Element => {
        // if (
        //     isNil(this.gridContainerElement) ||
        //     isNil(this.gridContainerElement.current)
        // ) {
        //     return null;
        // }
        // const rowElement: Element = this.domChildren(
        //     this.gridContainerElement.current
        // ).find((element: Element) => {
        //     return element.getAttribute(RowIdKey) === rowId;
        // });
        return null;
    };

    /**
     *  Get cell element by key
     */
    private getCellElementByKey = (
        columnKey: React.ReactText,
        rowElement: Element
    ): Element => {
        // if (isNil(rowElement)) {
        //     return null;
        // }
        // const cellElement: Element = this.domChildren(rowElement as HTMLElement).find(
        //     (element: Element) => {
        //         return element.getAttribute(CellIdKey) === columnKey;
        //     }
        // );
        return null;
    };

    /**
     *  Move focus to a cell based on row and cell id
     *  note: only works with rows that are currently instanciated
     */
    private focusOnCell = (rowId: React.ReactText, cellId: React.ReactText): void => {
        const rowElement: Element = this.getRowElementByKey(rowId);

        if (isNil(rowElement)) {
            return;
        }

        const cellElement: Element = this.getCellElementByKey(cellId, rowElement);

        if (cellElement instanceof HTMLElement) {
            // cellElement.focus();
        }
    };

    /**
     * Return an array of all elements that are children
     * of the data container
     */
    // private domChildren = (element: HTMLElement): Element[] => {
    //     return canUseDOM() && this.gridContainerElement.current instanceof HTMLElement
    //         ? Array.from(element.children)
    //         : [];
    // };

    /**
     *  Get column index by key
     */
    private getColumnIndexByKey = (columnKey: React.ReactText): number => {
        const currentColumnIndex: number = this.props.columnDefinitions.findIndex(
            (columnDefinition: DataGridColumnDefinition) => {
                return columnDefinition.columnDataKey === columnKey;
            }
        );
        return currentColumnIndex;
    };

    /**
     * Get row index by key
     */
    private getRowIndexByKey = (rowKey: ReactText): number => {
        const currentFocusRowIndex: number = this.props.gridData.findIndex(
            (dataRow: object) => {
                return dataRow[this.props.dataRowKey] === rowKey;
            }
        );
        return currentFocusRowIndex === -1 ? this.defaultRowIndex : currentFocusRowIndex;
    };

    /**
     * Get rowKey
     */
    private getFocusRowKey = (rowKey: ReactText): ReactText => {
        const currentFocusRowIndex: number = this.props.gridData.findIndex(
            (dataRow: object) => {
                return dataRow[this.props.dataRowKey] === rowKey;
            }
        );
        if (currentFocusRowIndex === -1 && this.props.gridData.length > 0) {
            return this.props.gridData[this.defaultRowIndex][this.props.dataRowKey];
        } else {
            return rowKey;
        }
    };

    /**
     * Handle focus event
     */
    private handleCellFocus = (
        cell: DataGridCellProps,
        e: React.FocusEvent<HTMLElement>
    ): void => {
        if (e.defaultPrevented) {
            return;
        }
        this.setState({
            focusRowKey: cell.rowData[this.props.dataRowKey],
            focusColumnKey: cell.columnDefinition.columnDataKey,
        });
    };

    /**
     *  Updates the direction
     */
    private updateDirection = (): void => {
        if (this.rootElement.current === null) {
            return;
        }

        const closest: Element = this.rootElement.current.closest(`[dir]`);

        if (closest === null) {
            this.direction = Direction.ltr;
            return;
        }

        this.direction =
            closest.getAttribute("dir").toLowerCase() === "rtl"
                ? Direction.rtl
                : Direction.ltr;
    };
}

export default DataGrid;
export * from "./data-grid.props";
export { DataGridContext, DataGridContextType, DataGridClassNameContract };
