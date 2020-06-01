import React, { ReactText } from "react";
import { DataGridClassNameContract } from "@microsoft/fast-components-class-name-contracts-base";
import { get, isNil } from "lodash-es";
import Foundation, { HandledProps } from "@microsoft/fast-components-foundation-react";
import { classNames, Direction, KeyCodes } from "@microsoft/fast-web-utilities";
import throttle from "raf-throttle";
import StackPanel from "../stack-panel";
import {
    DataGridColumnDefinition,
    DataGridHandledProps,
    DataGridHeaderRenderConfig,
    DataGridProps,
    DataGridRowHeightCallbackParams,
    DataGridUnhandledProps,
} from "./data-grid.props";
import DataGridRow from "./data-grid-row";
import { DataGridCellProps } from "./data-grid-cell.props";
import { DataGridContext, DataGridContextType } from "./data-grid-context";

export interface DataGridState {
    focusRowIndex: number;
    focusRowKey: ReactText | null;
    focusColumnKey: ReactText | null;
    currentDataPageStartIndex: number;
    currentDataPageEndIndex: number;
    rowPositions: RowPosition[];
    estimatedTotalHeight: number;
    desiredVisibleRowIndex: number | null;
    desiredFocusRowKey: ReactText | null;
    desiredFocusColumnKey: ReactText | null;
}

/**
 * Used to store the pixel coordinates and span of items
 */
interface RowPosition {
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
        rowHeight: 60,
        stableRangeEndIndex: 0,
        pageSize: 1000,
        rowHeightCallback: (
            row: DataGridRowHeightCallbackParams
        ) => {
            return row.defaultRowHeight;
        },
        virtualizeItems: true,
        managedClasses: {},
    };

    public static displayName: string = "DataGrid";

    /**
     *  default column render function
     */
    public static renderColumnHeader = (
        config: DataGridHeaderRenderConfig
    ): React.ReactNode => {
        return (
            <div
                className={config.classNames}
                role="columnheader"
                key={config.key}
                style={{
                    gridColumn: config.columnIndex + 1,
                }}
            >
                {config.title}
            </div>
        );
    };

    protected handledProps: HandledProps<DataGridHandledProps> = {
        dataRowKey: void 0,
        gridData: void 0,
        columnDefinitions: void 0,
        rowHeight: void 0,
        rowHeightCallback: void 0,
        managedClasses: void 0,
        defaultFocusColumnKey: void 0,
        defaultFocusRowKey: void 0,
        stableRangeEndIndex: void 0,
        pageSize: void 0,
        virtualizeItems: void 0,
    };

    private currentTemplateColumns: string = "";
    private rootElement: React.RefObject<HTMLDivElement> = React.createRef<
        HTMLDivElement
    >();

    private nonVirtualizedScrollContainer: React.RefObject<HTMLDivElement> = React.createRef<
        HTMLDivElement
    >();

    private direction: Direction = Direction.ltr;
    private isFocused: boolean = false;
    private throttledScroll: throttle;
    private lastReportedScrollPosition: number = 0;
    private lastReportedViewportSpan: number = 0;

    /**
     * constructor
     */
    constructor(props: DataGridProps) {
        super(props);
        this.throttledScroll = throttle(this.handleStackPanelScrollChange);

        this.state = this.applyInitialState();
    }

    /**
     * Renders the component
     */
    public render(): React.ReactElement<HTMLDivElement> {
        this.currentTemplateColumns = this.getGridTemplateColumns();

        return (
            <DataGridContext.Provider
                value={{
                    onCellFocused: this.handleCellFocus,
                    onCellKeyDown: this.handleCellKeyDown,
                    focusRowKey: this.state.focusRowKey,
                    focusColumnKey: this.state.focusColumnKey,
                    desiredFocusColumnKey: this.state.desiredFocusColumnKey,
                    desiredFocusRowKey: this.state.desiredFocusRowKey,
                    desiredVisibleRowIndex: this.state.desiredVisibleRowIndex,
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
                    {this.renderPanel()}
                </div>
            </DataGridContext.Provider>
        );
    }

    /**
     * React life-cycle method
     */
    public componentDidMount(): void {
        if (
            this.state.desiredVisibleRowIndex !== null
        ){
            this.scrollNonVirtualizedRowToTop(this.state.desiredVisibleRowIndex);
        }
        this.setState({
            desiredVisibleRowIndex: null,
        });
    }

    /**
     * componentDidUpdate when in non-virtualized mode
     */
    public nonVirtualizedComponentUpdateHandler(prevProps: DataGridProps): void {
        if (this.props.virtualizeItems) {
            // virtualization mode changed, reset
            this.setState(this.applyInitialState());
            return;
        }

        let shouldUpdateState: boolean = false;

        const newState: DataGridState = Object.assign({}, this.state);

        shouldUpdateState = this.applyUpdatedFocusProps(newState, prevProps);

        if (this.state.desiredVisibleRowIndex !== null) {
            // move desired row into view and note that a state update is required
            this.scrollNonVirtualizedRowToTop(this.state.desiredVisibleRowIndex);
            newState.desiredVisibleRowIndex = null;
            shouldUpdateState = true;
        }

        // revalidate when there is new data
        if (this.props.gridData !== prevProps.gridData) {
            shouldUpdateState = true;

            if (this.props.gridData.length === 0) {
                this.getInitialStateObject();
            } else {
                // ensure focus is still valid
                this.validateFocusRowState(newState);

                // ensure data page conforms to new data length
                // (not virtualizing, so cover the whole range)
                newState.currentDataPageStartIndex = 0;
                newState.currentDataPageEndIndex = this.props.gridData.length - 1;

                // move focus to the new element if necessary
                if (
                    (this.isFocused && this.state.focusRowKey !== newState.focusRowKey) ||
                    this.state.focusColumnKey !== newState.focusColumnKey
                ) {
                    const rowElement: Element = this.getRowElementByKey(newState.focusRowKey);
                    if (rowElement !== null) {
                        (rowElement as HTMLElement).focus();
                    }
                }
            }
        }

        if (shouldUpdateState) {
            this.setState(newState);
        }
    }

    /**
     * componentDidUpdate when in virtualized mode
     */
    public virtualizedComponentUpdateHandler(prevProps: DataGridProps): void {
        if (!this.props.virtualizeItems) {
            // virtualization mode changed, reset
            this.setState(this.applyInitialState());
            return;
        }

        let shouldUpdateState: boolean = false;

        let newState: DataGridState = Object.assign({}, this.state);
        newState.desiredVisibleRowIndex = null;

        if (this.state.desiredVisibleRowIndex !== null) {
            // note that a state update is required
            shouldUpdateState = true;
        }

        shouldUpdateState = this.applyUpdatedFocusProps(newState, prevProps);

        // revalidate when there is new data
        if (this.props.gridData !== prevProps.gridData) {
            shouldUpdateState = true;

            if (this.props.gridData.length === 0) {
                newState = this.getInitialStateObject();
            } else {
                // if an author tells us nothing has changed before a certain point we keep position data
                // up to that point.
                newState.rowPositions = newState.rowPositions.slice(0, this.props.stableRangeEndIndex);

                // ensure focus is still valid
                this.validateFocusRowState(newState);

                // ensure data page conforms to new data length
                newState.currentDataPageStartIndex =
                    newState.focusRowIndex - Math.floor(this.props.pageSize / 2);

                newState.currentDataPageStartIndex =
                    newState.currentDataPageStartIndex < 0 ? 0 : newState.currentDataPageStartIndex;

                newState.currentDataPageEndIndex = newState.currentDataPageStartIndex + this.props.pageSize;

                newState.currentDataPageEndIndex =
                    newState.currentDataPageEndIndex > this.props.gridData.length - 1
                        ? this.props.gridData.length - 1
                        : newState.currentDataPageEndIndex;

                this.sizeRowsToIndex(newState.currentDataPageEndIndex, newState.rowPositions);
                newState.estimatedTotalHeight = this.getEstimatedTotalHeight(newState.rowPositions);

                // move focus to the new element if necessary
                if (
                    (this.isFocused && this.state.focusRowKey !== newState.focusRowKey) ||
                    this.state.focusColumnKey !== newState.focusColumnKey
                ) {
                    const rowElement: Element = this.getRowElementByKey(newState.focusRowKey);
                    if (rowElement !== null) {
                        // next focus element already exists, focus on it
                        (rowElement as HTMLElement).focus();
                        newState.desiredFocusRowKey = null;
                        newState.desiredFocusColumnKey = null;
                    } else {
                        // next focus element not in the dom,
                        // focus on it after when it mounts
                        newState.desiredFocusRowKey = newState.focusRowKey;
                        newState.desiredFocusColumnKey = newState.focusColumnKey;

                        // let the default behavior scroll into view on focus
                        newState.desiredVisibleRowIndex = null;
                    }
                }
            }
        }

        if (shouldUpdateState) {
            this.setState(newState);
        }
    }

    /**
     * Generates class names
     */
    protected generateClassNames(): string {
        const { dataGrid }: DataGridClassNameContract = this.props.managedClasses;

        return super.generateClassNames(classNames(dataGrid));
    }
    
    /**
     * Updates focus row related state after an update
     */
    private validateFocusRowState = (newState: DataGridState): DataGridState => {
        const newFocusRowIndex: number = this.getRowIndexByKey(newState.focusRowKey);
        if (newFocusRowIndex === -1) {
            // our focus row no longer exists, assign a new one based on previous focus row index
            newState.focusRowIndex = Math.min(
                Math.max(newState.focusRowIndex, 0),
                this.props.gridData.length - 1
            );
            newState.focusRowKey = this.props.gridData[newState.focusRowIndex][
                this.props.dataRowKey
            ];
        } else {
            newState.focusRowIndex = newFocusRowIndex;
        }

        return newState;
    }

    /**
     * Applies changes to focus row and focus column props to the provided state object
     */
    private applyUpdatedFocusProps = (newState: DataGridState, prevProps: DataGridProps): boolean => {

        let shouldUpdateState: boolean = false;

        // apply a new focus columnkey if one is provided and it exists
        if (
            this.props.defaultFocusColumnKey !== prevProps.defaultFocusColumnKey &&
            !isNil(this.props.defaultFocusColumnKey) &&
            this.getColumnIndexByKey(this.props.defaultFocusColumnKey) !== -1
        ) {
            newState.focusColumnKey = this.props.defaultFocusColumnKey;
            shouldUpdateState = true;
        }

        // apply a new focus rowkey if one is provided and it exists
        if (
            this.props.defaultFocusRowKey !== prevProps.defaultFocusRowKey &&
            !isNil(this.props.defaultFocusRowKey)
        ) {
            const newFocusRowIndex: number = this.getRowIndexByKey(
                this.props.defaultFocusRowKey
            );

            if (newFocusRowIndex !== -1) {
                newState.focusRowKey = this.props.defaultFocusRowKey;
                newState.desiredVisibleRowIndex = newFocusRowIndex;
                newState.focusRowIndex = newFocusRowIndex;
                newState.currentDataPageStartIndex =
                    newFocusRowIndex - Math.floor(this.props.pageSize / 2);
                if (newState.currentDataPageStartIndex < 0) {
                    newState.currentDataPageStartIndex = 0;
                }
                newState.currentDataPageEndIndex = Math.min(
                    newState.currentDataPageStartIndex + this.props.pageSize,
                    this.props.gridData.length - 1
                );

                shouldUpdateState = true;
            }
        }
        return shouldUpdateState;
    }

    /**
     * Gets the initial state of the component based on virtualizion prop
     * also used when prop is changed during component lifetime
     */
    private applyInitialState = (): DataGridState => {
        const newState: DataGridState = this.applyInitialFocusState(this.getInitialStateObject());
        return this.props.virtualizeItems 
            ? this.applyVirtualizedInitialState(newState)
            : this.applyNonVirtualizedInitialState(newState);
    }

    /**
     * Gets the virtualized mode initial state
     * also used when prop is changed during component lifetime
     */
    private applyVirtualizedInitialState = (newState: DataGridState): DataGridState => {

        this.componentDidUpdate = this.virtualizedComponentUpdateHandler;
        this.renderPanel = this.renderVirtualizingPanel;

        if (this.props.gridData.length > 0) {
            if (!isNil(this.props.defaultFocusRowKey)) {
                newState.focusRowKey = this.props.defaultFocusRowKey;
                newState.focusRowIndex = this.getRowIndexByKey(newState.focusRowKey);
            }

            if (newState.focusRowIndex === -1) {
                newState.focusRowIndex = 0;
                newState.focusRowKey = this.props.gridData[0][this.props.dataRowKey];
            }

            newState.currentDataPageStartIndex =
                newState.focusRowIndex - Math.floor(this.props.pageSize / 2);

            newState.currentDataPageStartIndex =
                newState.currentDataPageStartIndex < 0 ? 0 : newState.currentDataPageStartIndex;

            newState.currentDataPageEndIndex = newState.currentDataPageStartIndex + this.props.pageSize;

            newState.currentDataPageEndIndex =
                newState.currentDataPageEndIndex > this.props.gridData.length - 1
                    ? this.props.gridData.length - 1
                    : newState. currentDataPageEndIndex;

            this.sizeRowsToIndex(newState.currentDataPageEndIndex, newState.rowPositions);

            newState.estimatedTotalHeight = this.getEstimatedTotalHeight(newState.rowPositions);
        }

        return newState;
    }

    /**
     * Gets the non-virtualized mode initial state
     * also used when prop is changed during component lifetime
     */
    private applyNonVirtualizedInitialState = (newState: DataGridState): DataGridState => {

        this.componentDidUpdate = this.nonVirtualizedComponentUpdateHandler;
        this.renderPanel = this.renderNonVirtualizingPanel;

        newState.currentDataPageStartIndex = this.props.gridData.length > 0 ? 0 : -1;
        newState.currentDataPageEndIndex = this.props.gridData.length > 0 ? this.props.gridData.length - 1: -1;
        newState.rowPositions = [];
        newState.estimatedTotalHeight = 0;

        return newState;
    }

    /**
     * sets initial/reset focus rows
     */
    private applyInitialFocusState = (newState: DataGridState): DataGridState => {
        if (!isNil(this.props.defaultFocusRowKey)) {
            newState.focusRowKey = this.props.defaultFocusRowKey;
            newState.focusRowIndex = this.getRowIndexByKey(newState.focusRowKey);
        }
        if (
            newState.focusRowIndex === -1 &&
            this.props.gridData.length > 0
        ) {
            newState.focusRowIndex = 0;
            newState.focusRowKey = this.props.gridData[0][this.props.dataRowKey];
        }

        if (this.props.columnDefinitions.length > 0) {
            newState.focusColumnKey =
                !isNil(this.props.defaultFocusColumnKey) &&
                    this.getColumnIndexByKey(this.props.defaultFocusColumnKey) !== -1
                    ? this.props.defaultFocusColumnKey
                    : this.props.columnDefinitions[0].columnDataKey;
        }

        newState.desiredVisibleRowIndex = newState.focusRowIndex;

        return newState;
    }

    /**
     *  render the header
     */
    private renderGridHeader = (): React.ReactElement<HTMLDivElement> => {
        return (
            <div
                className={classNames(this.props.managedClasses.dataGrid_header)}
                role="row"
                style={{
                    display: "grid",
                    gridTemplateColumns: this.currentTemplateColumns,
                }}
            >
                {this.props.columnDefinitions.map(this.renderColumnHeader)}
            </div>
        );
    }

    /**
     *  placeholder function until assignement based on virtualization mode
     */
    private renderPanel = (): React.ReactElement<HTMLDivElement> => {
        return null;
    }

    /**
     *  render a non-virtualizing panel
     */
    private renderNonVirtualizingPanel = (): React.ReactElement<HTMLDivElement> => {
        return (
            <div
                ref={this.nonVirtualizedScrollContainer}
                style={{
                    height: "100%",
                    overflowY: "scroll",
                    position: "relative",
                }}
            >
                {this.renderNonVirtualizedRows()}
            </div>
        );
    }

    /**
     *  render non virtualized data rows
     */
    private renderNonVirtualizedRows = (): React.ReactChild[] => {
        const rowsToRender: React.ReactChild[] = [];
        this.props.gridData.forEach((row: object, index: number) => {
            rowsToRender.push(this.renderRow(row, index));
        });
        return rowsToRender;
    };

    /**
     *  render a virtualizing panel
     */
    private renderVirtualizingPanel = (): React.ReactElement<HTMLDivElement> => {

        const itemSpans: number[] = [];

        if (this.state.rowPositions.length > 0) {
            itemSpans.push(
                this.state.rowPositions[this.state.currentDataPageStartIndex].start
            );

            if (typeof this.props.rowHeightCallback === "function") {
                for (
                    let i: number = this.state.currentDataPageStartIndex;
                    i <= this.state.currentDataPageEndIndex;
                    i++
                ) {
                    itemSpans.push(this.state.rowPositions[i].span);
                }
            }
            itemSpans.push(
                this.state.estimatedTotalHeight -
                this.state.rowPositions[this.state.currentDataPageEndIndex].end
            );
        }

        const stackPanelVisibleItemIndex: number | null =
            this.state.desiredVisibleRowIndex !== null
                ? this.convertGridDataIndexToStackPanelIndex(
                    this.state.desiredVisibleRowIndex,
                    this.state.currentDataPageStartIndex,
                    this.state.currentDataPageEndIndex
                )
                : null;

        return (
            <StackPanel
                initiallyVisibleItemIndex={stackPanelVisibleItemIndex}
                onScrollChange={this.throttledScroll}
                itemSpan={itemSpans}
                virtualize={this.props.virtualizeItems}
                style={{
                    height: "100%",
                    overflowY: "scroll" 
                }}
                managedClasses={{
                    stackPanel: get(
                        this.props.managedClasses,
                        "dataGrid_scrollingPanel",
                        ""
                    ),
                    stackPanel_items: get(
                        this.props.managedClasses,
                        "dataGrid_scrollingPanelItems",
                        ""
                    ),
                    stackPanel__scrollable: get(
                        this.props.managedClasses,
                        "dataGrid_scrollingPanel__scrollable",
                        ""
                    ),
                }}
            >
                {this.renderVirtualizedRows()}
            </StackPanel>
        );
    }

    /**
     *  render the data rows
     */
    private renderVirtualizedRows = (): React.ReactChild[] => {
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
        const config: DataGridHeaderRenderConfig = {
            title: column.title,
            key: column.columnDataKey,
            columnIndex: index,
            classNames: get(this.props.managedClasses, "dataGrid_columnHeader", ""),
        };

        if (!isNil(column.header)) {
            return column.header(config);
        } else {
            return DataGrid.renderColumnHeader(config);
        }
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
            dataGrid_row__focusedWithin,
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
                    dataGridRow__focusWithin: dataGrid_row__focusedWithin,
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
     *  Handle grid focus
     */
    private handleGridFocus = (): void => {
        this.isFocused = true;
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

            case KeyCodes.pageDown:
                this.incrementFocusPage(1);
                e.preventDefault();
                break;

            case KeyCodes.pageUp:
                this.incrementFocusPage(-1);
                e.preventDefault();
                break;

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
     * get the estimated total height of the datagrid based on row heights calculated so far
     */
    private getEstimatedTotalHeight = (rowPositions: RowPosition[]): number => {
        if (rowPositions.length === 0) {
            return 0;
        }
        const estimatedTotalHeight: number =
            rowPositions[rowPositions.length - 1].end +
            (this.props.gridData.length - rowPositions.length) * this.props.rowHeight;

        return estimatedTotalHeight;
    };

    /**
     * calculate total height of rows to target index
     * note: this modifies the provided rowposition array directly
     */
    private sizeRowsToIndex = (
        targetIndex: number,
        rowPositions: RowPosition[]
    ): void => {
        if (rowPositions.length - 1 < targetIndex) {
            const startIndex: number = rowPositions.length;
            const endIndex: number =
                targetIndex > this.props.gridData.length - 1
                    ? this.props.gridData.length - 1
                    : targetIndex;
            for (let i: number = startIndex; i <= endIndex; i++) {
                const thisRowStart: number = i === 0 ? 0 : rowPositions[i - 1].end;
                const thisRowHeight: number = this.props.rowHeightCallback({
                    rowData: this.props.gridData[i],
                    rowIndex: i,
                    defaultRowHeight: this.props.rowHeight
                });
                rowPositions.push({
                    start: thisRowStart,
                    span: thisRowHeight,
                    end: thisRowStart + thisRowHeight,
                });
            }
        }
    };

    /**
     * size rows to target scroll value
     * appends rowposition data until the bottom of the last item
     * is greater than target scroll value.
     * note: this modifies the provided rowposition array directly
     */
    private sizeRowsToScrollValue = (
        targetScrollValue: number,
        rowPositions: RowPosition[]
    ): void => {
        if (rowPositions[rowPositions.length - 1].end < targetScrollValue) {
            const startIndex: number = rowPositions.length;
            const endIndex: number = this.props.gridData.length - 1;
            for (let i: number = startIndex; i <= endIndex; i++) {
                const thisRowStart: number = i === 0 ? 0 : rowPositions[i - 1].end;
                const thisRowHeight: number = this.props.rowHeightCallback({
                    rowData: this.props.gridData[i],
                    rowIndex: i,
                    defaultRowHeight: this.props.rowHeight
                });
                const thisRowEnd: number = thisRowStart + thisRowHeight;
                rowPositions.push({
                    start: thisRowStart,
                    span: thisRowHeight,
                    end: thisRowEnd,
                });
                if (thisRowEnd >= targetScrollValue) {
                    break;
                }
            }
        }
    };

    /**
     * handle scroll events from the stackpanel
     */
    private handleStackPanelScrollChange = (
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

        this.lastReportedScrollPosition = newScrollValue;
        this.lastReportedViewportSpan = viewportSpan;

        if (
            this.state.rowPositions[this.state.focusRowIndex].start >
            currentViewportBottom ||
            this.state.rowPositions[this.state.focusRowIndex].end < newScrollValue
        ) {
            const topVisibleElementIndex: number = this.getIndexOfRowAtScrollPosition(
                newScrollValue,
                this.state.rowPositions
            );
            if (topVisibleElementIndex === -1) {
                this.setState({
                    focusRowKey: "",
                });
            } else {
                this.setState({
                    focusRowKey: this.props.gridData[topVisibleElementIndex][
                        this.props.dataRowKey
                    ],
                });
            }
        }

        if (
            newScrollValue < currentPageTop ||
            currentViewportBottom > currentPageBottom
        ) {
            const newRowPositions: RowPosition[] = this.state.rowPositions.slice(0);

            const middleViewportPosition: number = Math.floor(
                newScrollValue + viewportSpan / 2
            );
            const middleItemIndex: number = this.getIndexOfRowAtScrollPosition(
                middleViewportPosition,
                newRowPositions
            );

            let newDataPageStartIndex: number =
                middleItemIndex - Math.floor(this.props.pageSize / 2);
            if (newDataPageStartIndex < 0) {
                newDataPageStartIndex = 0;
            }

            let newDataPageEndIndex: number =
                newDataPageStartIndex + this.props.pageSize - 1;
            if (newDataPageEndIndex > this.props.gridData.length - 1) {
                newDataPageEndIndex = this.props.gridData.length - 1;
            }

            this.sizeRowsToIndex(newDataPageEndIndex, newRowPositions);

            this.setState({
                currentDataPageStartIndex: newDataPageStartIndex,
                currentDataPageEndIndex: newDataPageEndIndex,
                rowPositions: newRowPositions,
                estimatedTotalHeight: this.getEstimatedTotalHeight(newRowPositions),
            });
        }
    };

    /**
     * returns the index of row item at a particular scroll position
     */
    private getIndexOfRowAtScrollPosition = (
        scrollPosition: number,
        rowPositions: RowPosition[]
    ): number => {
        // handle virtualizing display
        if (this.props.virtualizeItems) {
            if (rowPositions.length === 0) {
                return -1;
            }
    
            scrollPosition = Math.max(0, scrollPosition);
    
            this.sizeRowsToScrollValue(scrollPosition, rowPositions);
            const maxIndex = Math.min(rowPositions.length - 1);
    
            const estimatedItemIndex: number = Math.min(
                maxIndex,
                Math.floor(scrollPosition / this.props.rowHeight)
            );
    
            if (scrollPosition < rowPositions[estimatedItemIndex].start) {
                for (let i: number = estimatedItemIndex; i >= 0; i--) {
                    if (rowPositions[i].start < scrollPosition) {
                        return i;
                    }
                }
                return 0;
            } else if (scrollPosition > rowPositions[estimatedItemIndex].end) {
                let maxRowpositionSizedIndex: number = rowPositions.length - 1;
                for (let i: number = estimatedItemIndex; i <= maxIndex; i++) {
                    if (i > maxRowpositionSizedIndex) {
                        this.sizeRowsToIndex(i, rowPositions);
                        maxRowpositionSizedIndex++;
                    }
                    if (rowPositions[i].end > scrollPosition) {
                        return i;
                    }
                }
                return maxIndex;
            }
    
            return estimatedItemIndex;
        }

        // handle non-virtualizing display
        if (this.nonVirtualizedScrollContainer.current === null) {
            return;
        }

        const rows: HTMLElement[] = this.getRenderedRows();
        const rowCount = rows.length;
        for (let i: number = 0; i < rowCount; i++) {
            if (rows[i].offsetTop >= scrollPosition) {
                return i;
            }
        }

        return rowCount - 1;
    };

    /**
     * move focus up/down one viewport's worth of items
     */
    private incrementFocusPage = (direction: number): void => {
        const newRowPositions = this.state.rowPositions.slice(0);
        let nextItemIndex: number = -1;

        if (this.props.virtualizeItems) {
            const nextItemScrollPosition: number =
                direction > 0
                    ? this.lastReportedScrollPosition + this.lastReportedViewportSpan + 1
                    : this.lastReportedScrollPosition - this.lastReportedViewportSpan + 1;

            nextItemIndex = this.getIndexOfRowAtScrollPosition(
                nextItemScrollPosition,
                newRowPositions
            );
        } else  if (this.nonVirtualizedScrollContainer.current !== null){
            const newScrollPosition: number = Math.min(
                direction > 0 
                    ? this.nonVirtualizedScrollContainer.current.scrollTop + this.nonVirtualizedScrollContainer.current.clientHeight + 1
                    : this.nonVirtualizedScrollContainer.current.scrollTop - this.nonVirtualizedScrollContainer.current.clientHeight + 1,
                this.nonVirtualizedScrollContainer.current.scrollHeight
            );
            nextItemIndex = this.getIndexOfRowAtScrollPosition(newScrollPosition, this.state.rowPositions);
            this.scrollNonVirtualizedRowToTop(nextItemIndex);
        }

        // don't get stuck on items that span the viewport
        if (nextItemIndex === this.state.focusRowIndex) {
            if (direction > 0 && nextItemIndex < this.props.gridData.length - 1) {
                nextItemIndex++;
            } else if (direction < 0 && nextItemIndex > 0) {
                nextItemIndex;
            }
        }

        this.focusOnCell(
            this.props.gridData[nextItemIndex][this.props.dataRowKey],
            this.state.focusColumnKey,
            newRowPositions,
            true
        );
    };

    /**
     * move focus to another row
     */
    private incrementFocusRow = (direction: number): void => {
        let currentFocusRowIndex: number = this.getRowIndexByKey(this.state.focusRowKey);

        if (currentFocusRowIndex === -1) {
            currentFocusRowIndex =
                this.state.focusRowIndex < this.props.gridData.length
                    ? this.state.focusRowIndex
                    : this.props.gridData.length - 1;
        }

        let newFocusRowIndex: number = currentFocusRowIndex + direction;
        if (newFocusRowIndex < 0) {
            newFocusRowIndex = 0;
        } else if (newFocusRowIndex >= this.props.gridData.length) {
            newFocusRowIndex = this.props.gridData.length - 1;
        }
        const newFocusRowKey: React.ReactText = this.props.gridData[newFocusRowIndex][
            this.props.dataRowKey
        ];

        const focusRowElement: Element = this.getRowElementByKey(newFocusRowKey);
        const focusCell: Element = this.getCellElementByKey(
            this.state.focusColumnKey,
            focusRowElement
        );

        if (isNil(focusCell)) {
            return;
        }
        (focusCell as HTMLElement).focus();
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
            cellElement.focus();
        }
    };

    /**
     *  Get all rendered rows
     */
    private getRenderedRows = (): HTMLElement[] => {
        if (isNil(this.rootElement.current)) {
            return null;
        }
        let rows: HTMLElement[] = Array.from(
            this.rootElement.current.querySelectorAll(
                "[role='row']"
            )
        );
        // remove the header row
        if (rows.length > 0) {
            rows = rows.slice(1);
        }
        return rows;
    };

    /**
     *  Get row element by key
     */
    private getRowElementByKey = (rowId: React.ReactText): Element => {
        if (isNil(this.rootElement.current)) {
            return null;
        }
        return this.rootElement.current.querySelector(`[data-rowid=${rowId}]`);
    };

    /**
     *  Get cell element by key
     */
    private getCellElementByKey = (
        columnKey: React.ReactText,
        rowElement: Element
    ): Element => {
        if (isNil(rowElement)) {
            return null;
        }

        return rowElement.querySelector(`[data-cellid=${columnKey}]`);
    };

    /**
     *  Move focus to a cell in the whole dataset based on row and cell id
     */
    private focusOnCell = (
        rowId: React.ReactText,
        cellId: React.ReactText,
        rowPositions: RowPosition[],
        forceScrollRowToTop: boolean
    ): void => {
        const rowIndex: number = this.getRowIndexByKey(rowId);

        if (rowIndex === -1) {
            //no such row id
            return;
        }

        if (
            rowIndex >= this.state.currentDataPageStartIndex &&
            rowIndex <= this.state.currentDataPageEndIndex
        ) {
            // see if the element is in the dom and focus it, otherwise falls back to setting desired focus
            const rowElement: Element = this.getRowElementByKey(rowId);
            if (rowElement !== null) {
                const cellElement: Element = this.getCellElementByKey(cellId, rowElement);
                this.setState({
                    desiredVisibleRowIndex: forceScrollRowToTop ? rowIndex : null,
                });
                if (cellElement !== null) {
                    (cellElement as HTMLElement).focus();
                    return;
                }
            }
        } else {
            // shift the items passed to the stack panel to include the desired row indexes
            let newDataPageStartIndex: number =
                rowIndex - Math.floor(this.props.pageSize / 2);
            if (newDataPageStartIndex < 0) {
                newDataPageStartIndex = 0;
            }

            let newDataPageEndIndex: number =
                newDataPageStartIndex + this.props.pageSize - 1;
            if (newDataPageEndIndex > this.props.gridData.length - 1) {
                newDataPageEndIndex = this.props.gridData.length - 1;
            }

            this.sizeRowsToIndex(newDataPageEndIndex, rowPositions);

            this.setState({
                currentDataPageStartIndex: newDataPageStartIndex,
                currentDataPageEndIndex: newDataPageEndIndex,
                rowPositions: rowPositions,
                estimatedTotalHeight: this.getEstimatedTotalHeight(rowPositions),
            });
        }

        this.setState({
            desiredVisibleRowIndex: forceScrollRowToTop ? rowIndex : null,
            desiredFocusRowKey: rowId,
            desiredFocusColumnKey: cellId,
        });
    };

    /**
     *  Get column index by key
     */
    private getColumnIndexByKey = (columnKey: React.ReactText): number => {
        return this.props.columnDefinitions.findIndex(
            (columnDefinition: DataGridColumnDefinition) => {
                return columnDefinition.columnDataKey === columnKey;
            }
        );
    };

    /**
     * Get row index by key
     */
    private getRowIndexByKey = (rowKey: ReactText): number => {
        const rowIndex: number = this.props.gridData.findIndex((dataRow: object) => {
            return dataRow[this.props.dataRowKey] === rowKey;
        });
        return rowIndex;
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

        const focusRowKey: ReactText = cell.rowData[this.props.dataRowKey];

        this.setState({
            focusRowKey,
            focusColumnKey: cell.columnDefinition.columnDataKey,
            focusRowIndex: this.getRowIndexByKey(focusRowKey),
            desiredFocusRowKey: null,
            desiredFocusColumnKey: null,
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

    /**
     * Converts a row index in the base dataset to an index in the current data page
     * passed to the stack panel.  Returns -1 if outside that range.
     */
    private convertGridDataIndexToStackPanelIndex = (
        gridDataIndex: number,
        dataPageStartIndex: number,
        dataPageEndIndex: number
    ): number => {
        if (gridDataIndex < dataPageStartIndex || gridDataIndex > dataPageEndIndex) {
            return -1;
        }

        return gridDataIndex - dataPageStartIndex + 1;
    };

    /**
     * Scrolls the desired row into view in non-virtualized mode
     */
    private scrollNonVirtualizedRowToTop = (rowIndex: number): void => {
        if (
            !this.props.virtualizeItems &&
            !isNil(this.nonVirtualizedScrollContainer.current) &&
            this.props.gridData.length > rowIndex
        ){
            const rows: HTMLElement[]  = this.getRenderedRows();
            if (rows.length <= rowIndex) {
                return;
            }
            this.nonVirtualizedScrollContainer.current.scrollTop = rows[rowIndex].offsetTop;
        }
    }

    /**
     *  gets a state object with initial values
     */
    private getInitialStateObject = (): DataGridState => {
        return (
            {
                focusRowIndex: -1,
                focusRowKey: null,
                focusColumnKey: null,
                currentDataPageStartIndex: -1,
                currentDataPageEndIndex: -1,
                rowPositions: [],
                estimatedTotalHeight: 0,
                desiredVisibleRowIndex: null,
                desiredFocusRowKey: null,
                desiredFocusColumnKey: null,
            }
        );
    }
}

export default DataGrid;
export * from "./data-grid.props";
export { DataGridContext, DataGridContextType, DataGridClassNameContract };
