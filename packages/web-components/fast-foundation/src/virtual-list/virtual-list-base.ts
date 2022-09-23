import {
    attr,
    Constructable,
    DOM,
    Notifier,
    nullableNumberConverter,
    Observable,
    observable,
    RepeatOptions,
    Splice,
} from "@microsoft/fast-element";
import { eventResize, eventScroll, Orientation } from "@microsoft/fast-web-utilities";

import { IntersectionService } from "../utilities/intersection-service.js";
import type {
    ResizeObserverClassDefinition,
    ResizeObserverEntry,
} from "../utilities/resize-observer.js";
import type { FASTDataList, ItemLoadMode } from "../data-list/index.js";
import type { FASTVirtualListItem } from "./virtual-list-item.js";
import type { SizeMap, VirtualListAutoUpdateMode } from "./virtual-list.options.js";

/**
 * Base class for providing Custom Element Virtualizing.
 *
 * @beta
 */
export interface VirtualListBase {
    virtualizationDisabled: boolean;
    viewport: string;
    itemSize: number;
    viewportBuffer: number;
    orientation: Orientation;
    autoUpdateMode: VirtualListAutoUpdateMode;
    sizemap: SizeMap[];
    autoResizeItems: boolean;
    viewportElement: HTMLElement;
    renderedItemMap: SizeMap[];
    totalListSize: number;
    startSpacerSize: number;
    endSpacerSize: number;
    firstRenderedIndex: number;
    lastRenderedIndex: number;
    containerElement: HTMLElement;
    renderItems: object[];
    sourceItems: object[];
    itemLoadMode: ItemLoadMode;

    getItemSizeMap(itemIndex: number): SizeMap | null;
}

/**
 * Combined type to describe a Constructable Virtualizing type.
 *
 * @beta
 */
export type ConstructableVirtualListBase = Constructable<HTMLElement & FASTDataList>;

/**
 * Base function for providing Custom Element Virtualization
 *
 * @beta
 */
export function Virtualizing<T extends ConstructableVirtualListBase>(BaseCtor: T): T {
    const C = class extends BaseCtor {
        /**
         * Item size to use if one is not specified
         */
        protected defaultItemSize = 50;

        /**
         * Viewport buffer to use if one is not specified
         */
        protected defaultViewportBuffer = 100;

        /**
         *  Whether or not the display should virtualize
         *
         * @public
         * @remarks
         * HTML Attribute: virtualization-disabled
         */
        public virtualizationDisabled: boolean;
        protected virtualizationEnabledChanged(): void {
            if (this.$fastController.isConnected) {
                this.reset();
            }
        }

        /**
         * The HTML ID of the viewport element.
         * If no viewport is set the default viewport is the element itself.
         * Note that viewportElement can be set directly as well.
         *
         * @public
         * @remarks
         * HTML Attribute: anchor
         */
        public viewport: string = "";
        protected viewportChanged(): void {
            if (this.$fastController.isConnected) {
                this.viewportElement = this.getViewport();
                this.updateDimensions();
            }
        }

        /**
         * The size in pixels of each item along the virtualization axis.
         * When auto-resizing this is the amount of space reserved for elements until
         * they actually render and report size.  The default value is 50.
         *
         * @public
         * @remarks
         * HTML Attribute: item-size
         */
        public itemSize: number = this.defaultItemSize;
        private itemSizeChanged(): void {
            if (this.$fastController.isConnected) {
                this.updateDimensions();
            }
        }

        /**
         * Defines an area in pixels on either end of the viewport where items outside the viewport
         * will still be rendered.  The default value is 100.
         *
         * @public
         * @remarks
         * HTML Attribute: viewport-buffer
         */
        public viewportBuffer: number = this.defaultViewportBuffer;
        private viewportBufferChanged(): void {
            if (this.$fastController.isConnected) {
                this.updateDimensions();
            }
        }

        /**
         * Auto update mode defines what prompts the component to check the dimensions of elements
         * in the DOM and reset the visible items accordingly.  Calling update() always provokes an update.
         *
         * @public
         * @remarks
         * HTML Attribute: auto-update-mode
         */
        public autoUpdateMode: VirtualListAutoUpdateMode = "viewport";
        private autoUpdateModeChanged(
            prevMode: VirtualListAutoUpdateMode,
            newMode: VirtualListAutoUpdateMode
        ): void {
            if (this.$fastController.isConnected) {
                this.resetAutoUpdateMode(prevMode, newMode);
            }
        }

        public displayItems: object[] | null = [];

        /**
         * The sizemap for the items
         * Authors need to provide a sizemap for arrays of irregular size items,
         * when the items have a uniform size use the 'item-size' attribute instead.
         *
         * @public
         */
        public sizemap: SizeMap[];
        private sizemapChanged(previous: SizeMap[]): void {
            if (this.$fastController.isConnected) {
                this.observeSizeMap();
                this.updateDimensions();
            }
        }

        /**
         * When true the virtual list component will track the size of child virtual-list-items and automatically
         * update the size of the item in the size map.
         *
         * @public
         * @remarks
         * HTML Attribute: auto-resize-items
         */
        public autoResizeItems: boolean;
        //  private autoResizeItemsChanged(prev: boolean): void {
        //      if (this.$fastController.isConnected) {
        //      }
        //  }

        /**
         * The HTML element being used as the viewport
         *
         * @public
         */
        public viewportElement: HTMLElement;
        private viewportElementChanged(): void {
            if (this.$fastController.isConnected) {
                this.resetAutoUpdateMode(this.autoUpdateMode, this.autoUpdateMode);
            }
        }

        /**
         * Controls the idle load queue behavior.
         *
         * @public
         * @remarks
         * HTML Attribute: item-load-mode
         */
        public itemLoadMode: ItemLoadMode = "immediate";

        /**
         * Suspends idle loading
         *
         *
         * @public
         */
        public idleLoadingSuspended: boolean;
        protected idleLoadingSuspendedChanged(): void {
            if (this.$fastController.isConnected) {
                if (!this.idleLoadingSuspended && this.itemLoadMode === "idle") {
                    this.nextCallback();
                }
            }
        }

        protected sourceItemsChanged(): void {
            super.sourceItemsChanged();
            if (this.$fastController.isConnected) {
                this.reset();
            }
        }

        /**
         * Defines the idle callback timeout value.
         * Defaults to 1000
         *
         * @public
         * @remarks
         * HTML Attribute: idle-callback-timeout
         */
        public idleCallbackTimeout: number = 1000;

        /**
         * The positions of the currently rendered items in the list
         *
         * @internal
         */
        public renderedItemMap: SizeMap[] = [];

        /**
         * The calculated size of the total stack.
         * (ie. all items + start/end regions)
         *
         * @internal
         */
        public totalListSize: number = 0;

        /**
         * The size in pixels of the start "spacer"
         * (ie. the grid region that holds space for non-rendered elements at the start of the stack)
         *
         * @internal
         */
        public startSpacerSize: number = 0;

        /**
         * The size in pixels of the end "spacer"
         * (ie. the grid region that holds space for non-rendered elements at the end of the stack)
         *
         * @internal
         */
        public endSpacerSize: number = 0;

        /**
         * The index of the first item in the array to be rendered
         *
         * @internal
         */
        public firstRenderedIndex: number = -1;

        /**
         * The index of the last item in the array to be rendered
         *
         * @internal
         */
        public lastRenderedIndex: number = -1;

        /**
         * reference to the container element
         *
         * @internal
         */
        public containerElement: HTMLElement;

        // reference to the intersection service to request position updates
        private intersectionService: IntersectionService = new IntersectionService();

        // reference to the resize observer used to detect viewport resize events
        private resizeDetector: ResizeObserverClassDefinition | null = null;

        // whether there is a pending position update
        // (ie. an intersection service is in progress)
        private pendingPositioningUpdate: boolean = false;

        // whether a reset is already queued
        private pendingReset: boolean = false;

        // stored geometry for the viewport and internal container elements
        private viewportRect: DOMRect | undefined;
        private containerRect: DOMRect | undefined;

        // notifier used to trigger updates after changes to items array
        private itemsObserver: Notifier | null = null;

        // notifier used to trigger updates after changes to sizemap array
        private sizemapObserver: Notifier | null = null;

        // A sizemap[] that is being recalculated but has not yet been applied
        private pendingSizemap: SizeMap[] | null = null;

        /**
         * The lowest index that has changed in the pending sizemap.
         * ie. lower indexes are still correct.
         */
        private pendingSizemapChangeIndex: number = -1;

        /**
         * Flag that indicates whether an additional position update should be requested
         * after the current one resolves (ie. possible geometry changes after the last request)
         */
        private finalUpdateNeeded: boolean = false;

        private idleCallbackInterval: number = 20;
        private callbackQueue: Map<Element, () => void> = new Map<Element, () => void>();
        private currentCallbackId: number | undefined;
        private currentCallbackElement: Element | undefined;
        private currentCallback: (() => void) | undefined;

        /**
         * @internal
         */
        connectedCallback() {
            super.connectedCallback();
            this.viewportElement = this.viewportElement ?? this.getViewport();
            this.resetAutoUpdateMode("manual", this.autoUpdateMode);
            this.initializeResizeDetector();

            this.addEventListener("listitemconnected", this.handleListItemConnected);
            this.addEventListener(
                "listitemdisconnected",
                this.handleListItemDisconnected
            );

            this.doReset();
        }

        /**
         * @internal
         */
        public disconnectedCallback(): void {
            super.disconnectedCallback();
            if (this.autoUpdateMode === "auto") {
                this.stopViewportResizeDetector();
            }
            this.cancelPendingPositionUpdates();
            this.unobserveItems();
            this.unobserveSizeMap();
            this.renderedItemMap = [];

            this.disconnectResizeDetector();

            this.removeEventListener("listitemconnected", this.handleListItemConnected);
            this.removeEventListener(
                "listitemdisconnected",
                this.handleListItemDisconnected
            );
            this.callbackQueue.clear();
            if (this.currentCallbackElement) {
                this.currentCallbackElement;
            }
        }

        protected getRepeatOptions(): RepeatOptions {
            //positioning is always true for virtual lists
            const options = super.getRepeatOptions();
            options.positioning = true;
            return options;
        }

        /**
         * Request a layout update
         *
         * @public
         */
        public update(): void {
            this.requestPositionUpdates();
        }

        /**
         * the position in the stack (in pixels) of the a particular item index in the
         * base source data.  Note that this does not necessarily mean the item is currently
         * being rendered.
         *
         * @public
         */
        public getItemSizeMap = (itemIndex: number): SizeMap | null => {
            if (itemIndex < 0 || itemIndex >= this.sourceItems.length) {
                // out of range
                return null;
            }

            if (this.sizemap !== undefined) {
                return this.sizemap[itemIndex];
            }

            return {
                start: itemIndex * this.itemSize,
                end: itemIndex * this.itemSize + this.itemSize,
                size: this.itemSize,
            };
        };

        /**
         * @internal
         */
        public handleListItemConnected(e: Event): void {
            if (e.defaultPrevented) {
                return;
            }
            if (this.autoResizeItems) {
                this.resizeDetector?.observe(e.target as Element);
            }
            this.requestIdleCallback(
                e.target as FASTVirtualListItem,
                (e.target as FASTVirtualListItem).handleIdleCallback
            );
        }

        /**
         * @internal
         */
        public handleListItemDisconnected(e: Event): void {
            if (e.defaultPrevented) {
                return;
            }
            if (this.autoResizeItems) {
                this.resizeDetector?.unobserve(e.target as Element);
            }
            this.cancelIdleCallback(e.target as Element);
        }

        /**
         * starts observing the items array
         */
        private observeItems(): void {
            this.unobserveItems();

            if (!this.sourceItems) {
                return;
            }

            const newObserver = (this.itemsObserver = Observable.getNotifier(
                this.sourceItems
            ));
            newObserver.subscribe(this);
        }

        /**
         * stops observing the items array
         */
        private unobserveItems(): void {
            this.itemsObserver?.unsubscribe(this);
            this.itemsObserver = null;
        }

        /**
         * starts observing the items array
         */
        private observeSizeMap(): void {
            this.unobserveSizeMap();

            if (!this.sizemap) {
                return;
            }

            const newObserver = (this.sizemapObserver = Observable.getNotifier(
                this.sizemap
            ));
            newObserver.subscribe(this);
        }

        /**
         * generates a default sizemap
         */
        private generateSizeMap(): SizeMap[] {
            const sizemap: SizeMap[] = [];
            const itemsCount: number = this.sourceItems.length;
            let currentPosition: number = 0;
            for (let i = 0; i < itemsCount; i++) {
                const mapEnd = this.itemSize + currentPosition;
                sizemap.push({
                    start: currentPosition,
                    size: this.itemSize,
                    end: mapEnd,
                });
                currentPosition = mapEnd;
            }
            return sizemap;
        }

        /**
         * stops observing the items array
         */
        private unobserveSizeMap(): void {
            this.sizemapObserver?.unsubscribe(this);
            this.sizemapObserver = null;
        }

        /**
         * The items list has mutated
         *
         * @internal
         */
        public handleChange(source: any, splices: Splice[]): void {
            if (source === this.sourceItems) {
                const itemsLength = this.sourceItems.length;
                const firstRenderedIndex = Math.min(
                    this.firstRenderedIndex,
                    itemsLength - 1
                );
                const lastRenderedIndex = Math.min(
                    this.lastRenderedIndex,
                    itemsLength - 1
                );

                const newVisibleItems = this.sourceItems.slice(
                    firstRenderedIndex,
                    lastRenderedIndex + 1
                );

                // this.renderItems.splice(0, this.renderItems.length, ...newVisibleItems);
                this.displayItems = newVisibleItems;

                this.updateDimensions();
                this.requestPositionUpdates();
            } else if (source === this.sizemap) {
                this.updateDimensions();
            }
        }

        /**
         * get position updates
         */
        protected requestPositionUpdates(): void {
            if (this.virtualizationDisabled) {
                if (this.pendingPositioningUpdate) {
                    return;
                }
                DOM.queueUpdate(() => {
                    this.pendingPositioningUpdate = false;
                    this.updateVisibleItems();
                });
                return;
            }
            if (this.pendingPositioningUpdate) {
                this.finalUpdateNeeded = true;
                return;
            }
            this.finalUpdateNeeded = false;
            this.pendingPositioningUpdate = true;
            if (this.itemLoadMode === "idle") {
                this.idleLoadingSuspended = true;
            }

            this.intersectionService.requestPosition(
                this.containerElement,
                this.handleIntersection
            );
            this.intersectionService.requestPosition(
                this.viewportElement,
                this.handleIntersection
            );
        }

        /**
         * request reset
         */
        protected reset(): void {
            if (this.pendingReset) {
                return;
            }

            this.pendingReset = true;

            DOM.queueUpdate(() => {
                this.doReset();
            });
        }

        /**
         * execute reset
         */
        private doReset(): void {
            this.pendingReset = false;
            this.cancelPendingPositionUpdates();
            if (this.autoResizeItems) {
                this.sizemap = this.generateSizeMap();
            }
            this.observeItems();
            this.observeSizeMap();
            this.updateDimensions();
        }

        /**
         * cancel any pending position update requests
         */
        private cancelPendingPositionUpdates(): void {
            if (this.pendingPositioningUpdate) {
                this.pendingPositioningUpdate = false;
                this.intersectionService.cancelRequestPosition(
                    this.containerElement,
                    this.handleIntersection
                );
                if (this.viewportElement !== null) {
                    this.intersectionService.cancelRequestPosition(
                        this.viewportElement,
                        this.handleIntersection
                    );
                }
            }
        }

        /**
         * Handles changes to auto-update-mode
         */
        private resetAutoUpdateMode(
            prevMode: VirtualListAutoUpdateMode,
            newMode: VirtualListAutoUpdateMode
        ): void {
            switch (prevMode) {
                case "auto":
                    this.stopViewportResizeDetector();
                    this.stopWindowEventListeners();
                    break;

                case "self":
                    this.stopViewportResizeDetector();
                    this.removeEventListener(eventScroll, this.handleScrollEvent);
                    break;

                case "viewport":
                    this.stopViewportResizeDetector();
                    this.viewportElement.removeEventListener(
                        eventScroll,
                        this.handleScrollEvent
                    );
                    break;
            }

            switch (newMode) {
                case "auto":
                    this.startViewportResizeDetector();
                    this.startWindowUpdateEventListeners();
                    break;

                case "self":
                    this.startViewportResizeDetector();
                    this.addEventListener(eventScroll, this.handleScrollEvent, {
                        passive: true,
                        capture: true,
                    });
                    break;

                case "viewport":
                    this.startViewportResizeDetector();
                    this.viewportElement.addEventListener(
                        eventScroll,
                        this.handleScrollEvent,
                        {
                            passive: true,
                            capture: true,
                        }
                    );
                    break;
            }
        }

        /**
         * initializes the instance's resize observer
         */
        private initializeResizeDetector(): void {
            if (this.resizeDetector !== null) {
                return;
            }
            this.resizeDetector = new ((window as unknown) as WindowWithResizeObserver).ResizeObserver(
                this.resizeDetected.bind(this)
            );
            this.resizeDetector.observe(this);
        }

        /**
         * destroys the instance's resize observer
         */
        private disconnectResizeDetector(): void {
            if (this.resizeDetector !== null) {
                this.resizeDetector.unobserve(this);
                this.resizeDetector.disconnect();
                this.resizeDetector = null;
            }
        }

        /**
         * Handles resize events.  These could come from either the component itself,
         * the viewport element, or child list items when auto resize is enabled.
         */
        private resizeDetected(entries: ResizeObserverEntry[]): void {
            let recalculateNeeded: boolean = false;
            entries.forEach((entry: ResizeObserverEntry) => {
                if (entry.target === this.viewportElement || entry.target === this) {
                    this.requestPositionUpdates();
                } else {
                    if (
                        (entry.target as FASTVirtualListItem).$fastController
                            .isConnected &&
                        (!this.autoResizeItems ||
                            (entry.target as FASTVirtualListItem).loadContent)
                    ) {
                        const index: number = (entry.target as FASTVirtualListItem)
                            .itemIndex;
                        if (
                            this.pendingSizemapChangeIndex === -1 ||
                            index < this.pendingSizemapChangeIndex
                        ) {
                            this.pendingSizemapChangeIndex = index;
                        }
                        if (this.pendingSizemap === null) {
                            this.pendingSizemap = this.sizemap.slice();
                            recalculateNeeded = true;
                        }
                        this.pendingSizemap[index].size =
                            this.orientation === Orientation.vertical
                                ? entry.contentRect.height
                                : entry.contentRect.width;
                    }
                }
                if (recalculateNeeded) {
                    DOM.queueUpdate(() => {
                        this.recalculateSizeMap();
                    });
                }
            });
        }

        /**
         *  Updates the positions in the pending sizemap and applies it
         */
        private recalculateSizeMap(): void {
            if (this.pendingSizemap === null) {
                return;
            }

            const mapLength: number = this.pendingSizemap.length;

            let currentPosition: number = this.pendingSizemap[
                this.pendingSizemapChangeIndex
            ].start;
            let currentSizeMap: SizeMap;
            for (let i: number = this.pendingSizemapChangeIndex; i < mapLength; i++) {
                currentSizeMap = this.pendingSizemap[i];
                currentSizeMap.start = currentPosition;
                currentSizeMap.end = currentPosition + currentSizeMap.size;

                currentPosition = currentSizeMap.end;
            }

            this.sizemap = this.pendingSizemap;
            this.pendingSizemap = null;
            this.pendingSizemapChangeIndex = -1;
        }

        /**
         * starts the viewport resize detector
         */
        private startViewportResizeDetector(): void {
            if (this.resizeDetector !== null && this.viewportElement !== null) {
                this.resizeDetector.observe(this.viewportElement);
            }
        }

        /**
         * stops the viewport resize detector
         */
        private stopViewportResizeDetector(): void {
            if (this.resizeDetector !== null && this.viewportElement !== null) {
                this.resizeDetector.unobserve(this.viewportElement);
            }
        }

        /**
         * starts window level event listeners that can trigger auto updating
         * (scroll and resize)
         */
        private startWindowUpdateEventListeners(): void {
            window.addEventListener(eventResize, this.handleResizeEvent, {
                passive: true,
            });
            window.addEventListener(eventScroll, this.handleScrollEvent, {
                passive: true,
                capture: true,
            });
        }

        /**
         * stops event listeners that can trigger auto updating
         */
        private stopWindowEventListeners(): void {
            window.removeEventListener(eventResize, this.requestPositionUpdates);
            window.removeEventListener(eventScroll, this.requestPositionUpdates);
        }

        /**
         * handle scroll events
         */
        private handleScrollEvent = (e: Event): void => {
            this.requestPositionUpdates();
        };

        /**
         * handle resize events
         */
        private handleResizeEvent = (e: Event): void => {
            this.requestPositionUpdates();
        };

        /**
         * Gets the viewport element by id, or defaults to element
         */
        private getViewport(): HTMLElement {
            let viewport: HTMLElement | null = null;
            const rootNode = this.getRootNode();

            if (rootNode instanceof ShadowRoot) {
                viewport = rootNode.getElementById(this.viewport);
            } else {
                viewport = document.getElementById(this.viewport);
            }

            return viewport ?? this;
        }

        /**
         * updates the dimensions of the list
         */
        private updateDimensions = (): void => {
            if (this.sourceItems === undefined) {
                this.totalListSize = 0;
                return;
            }
            if (this.sizemap !== undefined) {
                this.totalListSize =
                    this.sizemap.length > 0
                        ? this.sizemap[this.sizemap.length - 1].end
                        : 0;
            } else {
                this.totalListSize = this.itemSize * this.sourceItems.length;
            }

            this.requestPositionUpdates();
        };

        /**
         *  Updates the visible items
         */
        private updateVisibleItems(): void {
            if (!this.sourceItems) {
                return;
            }

            if (this.virtualizationDisabled) {
                //this.renderItems.splice(0, this.renderItems.length, ...this.sourceItems);
                this.displayItems = this.sourceItems;
                this.updateVisibleItemSizes(0, this.displayItems.length - 1);
                return;
            }

            if (!this.containerRect || !this.viewportRect) {
                return;
            }

            let { top: viewportStart, bottom: viewportEnd } = this.viewportRect;

            let {
                top: containerStart,
                bottom: containerEnd,
                height: containerSize,
            } = this.containerRect;

            if (this.orientation === Orientation.horizontal) {
                ({ left: viewportStart, right: viewportEnd } = this.viewportRect);
                ({
                    left: containerStart,
                    right: containerEnd,
                    width: containerSize,
                } = this.containerRect);
            }

            let renderedRangeStart = this.firstRenderedIndex;
            let renderedRangeEnd = this.lastRenderedIndex;

            if (viewportStart >= containerEnd) {
                renderedRangeStart = containerSize;
                renderedRangeEnd = containerSize;
            } else if (viewportEnd <= containerStart) {
                renderedRangeStart = 0;
                renderedRangeEnd = 0;
            } else {
                renderedRangeStart = viewportStart - containerStart - this.viewportBuffer;
                renderedRangeEnd =
                    containerSize - (containerEnd - (viewportEnd + this.viewportBuffer));

                renderedRangeStart = renderedRangeStart < 0 ? 0 : renderedRangeStart;
                renderedRangeEnd =
                    renderedRangeEnd > containerSize ? containerSize : renderedRangeEnd;
            }

            const visibleRangeLength = renderedRangeEnd - renderedRangeStart;
            let newFirstRenderedIndex: number = 0;
            let newLastRenderedIndex: number = 0;

            if (this.sizemap === undefined) {
                newFirstRenderedIndex = Math.floor(renderedRangeStart / this.itemSize);
                newLastRenderedIndex =
                    newFirstRenderedIndex + Math.ceil(visibleRangeLength / this.itemSize);

                newFirstRenderedIndex = Math.max(0, newFirstRenderedIndex);
                newLastRenderedIndex = Math.min(
                    newLastRenderedIndex,
                    this.sourceItems.length - 1
                );

                this.startSpacerSize = newFirstRenderedIndex * this.itemSize;
                this.endSpacerSize =
                    (this.sourceItems.length - newLastRenderedIndex - 1) * this.itemSize;
            } else {
                const firstVisibleItem: SizeMap | undefined = this.sizemap.find(
                    x => x.end >= renderedRangeStart
                );
                if (firstVisibleItem !== undefined) {
                    newFirstRenderedIndex = this.sizemap.indexOf(firstVisibleItem);
                    const lastVisibleItem: SizeMap | undefined = this.sizemap.find(
                        x => x.start >= renderedRangeEnd
                    );
                    newLastRenderedIndex =
                        lastVisibleItem === undefined
                            ? this.sizemap.length - 1
                            : this.sizemap.indexOf(lastVisibleItem);
                }

                newFirstRenderedIndex = Math.max(0, newFirstRenderedIndex);
                newLastRenderedIndex = Math.min(
                    newLastRenderedIndex,
                    this.sourceItems.length - 1
                );

                this.startSpacerSize = this.sizemap[newFirstRenderedIndex].start;
                this.endSpacerSize =
                    this.sizemap[this.sizemap.length - 1].end -
                    this.sizemap[newLastRenderedIndex].end;
            }

            const newVisibleItems = this.sourceItems.slice(
                newFirstRenderedIndex,
                newLastRenderedIndex + 1
            );

            this.updateVisibleItemSizes(newFirstRenderedIndex, newLastRenderedIndex);
            // this.renderItems.splice(0, this.renderItems.length, ...newVisibleItems);
            this.displayItems = newVisibleItems;
        }

        /**
         *  Updates the visible items size map
         */
        private updateVisibleItemSizes(
            newFirstRenderedIndex: number,
            newLastRenderedIndex: number
        ): void {
            const newVisibleItemSizes: SizeMap[] = [];

            let top: number = this.startSpacerSize;

            if (this.sizemap === undefined) {
                for (
                    let i: number = newFirstRenderedIndex;
                    i <= newLastRenderedIndex;
                    i++
                ) {
                    const thisSizeMap: SizeMap = {
                        start: top,
                        end: top + this.itemSize,
                        size: this.itemSize,
                    };
                    top = thisSizeMap.end;
                    newVisibleItemSizes.push(thisSizeMap);
                }
            } else {
                for (
                    let i: number = newFirstRenderedIndex;
                    i <= newLastRenderedIndex;
                    i++
                ) {
                    const thisSizeMap: SizeMap = {
                        start: this.sizemap[i].start,
                        end: this.sizemap[i].end,
                        size: this.sizemap[i].size,
                    };
                    top = thisSizeMap.end;
                    newVisibleItemSizes.push(thisSizeMap);
                }
            }

            this.renderedItemMap = newVisibleItemSizes;

            this.updateRenderedRange(newFirstRenderedIndex, newLastRenderedIndex);
        }

        /**
         *  Updates the range of rendered items
         */
        private updateRenderedRange(
            newFirstRenderedIndex: number,
            newLastRenderedIndex: number
        ): void {
            if (
                newFirstRenderedIndex === this.firstRenderedIndex &&
                newLastRenderedIndex === this.lastRenderedIndex
            ) {
                return;
            }

            this.firstRenderedIndex = newFirstRenderedIndex;
            this.lastRenderedIndex = newLastRenderedIndex;

            this.$emit("renderedrangechange", this, { bubbles: false });
        }

        /**
         *  Handle intersections
         */
        private handleIntersection = (entries: IntersectionObserverEntry[]): void => {
            if (!this.pendingPositioningUpdate) {
                if (this.itemLoadMode === "idle") {
                    this.idleLoadingSuspended = false;
                }
                return;
            }

            this.pendingPositioningUpdate = false;

            if (this.finalUpdateNeeded) {
                this.requestPositionUpdates();
            } else {
                if (this.itemLoadMode === "idle") {
                    this.idleLoadingSuspended = false;
                }
            }

            const containerEntry = entries.find(x => x.target === this.containerElement);
            const viewportEntry = entries.find(x => x.target === this.viewportElement);

            if (!containerEntry || !viewportEntry) {
                return;
            }

            this.viewportRect =
                this.viewportElement !== document.documentElement
                    ? viewportEntry.boundingClientRect
                    : new DOMRectReadOnly(
                          viewportEntry.boundingClientRect.x +
                              document.documentElement.scrollLeft,
                          viewportEntry.boundingClientRect.y +
                              document.documentElement.scrollTop,
                          viewportEntry.boundingClientRect.width,
                          viewportEntry.boundingClientRect.height
                      );
            this.containerRect = containerEntry.boundingClientRect;

            this.updateVisibleItems();
        };

        /**
         * Request an idle callback
         *
         * @internal
         */
        public requestIdleCallback(target: Element, callback: () => void): void {
            if (this.callbackQueue.has(target)) {
                return;
            }
            this.callbackQueue.set(target, callback);
            this.nextCallback();
        }

        /**
         * Cancel an idle callback request
         *
         * @internal
         */
        public cancelIdleCallback(target: Element): void {
            if (this.callbackQueue.has(target)) {
                this.callbackQueue.delete(target);
                return;
            }

            if (this.currentCallbackElement === target && this.currentCallbackId) {
                ((window as unknown) as WindowWithIdleCallback).cancelIdleCallback(
                    this.currentCallbackId
                );
                this.currentCallbackId = undefined;
                this.currentCallbackElement = undefined;
                this.currentCallback = undefined;
                this.nextCallback();
            }
        }

        /**
         * Queue up the next item
         */
        private nextCallback = (): void => {
            if (
                this.itemLoadMode !== "idle" ||
                this.idleLoadingSuspended ||
                this.currentCallbackId ||
                this.callbackQueue.size === 0
            ) {
                return;
            }

            const [nextCallbackElement] = this.callbackQueue.keys();
            this.currentCallback = this.callbackQueue.get(nextCallbackElement);
            this.callbackQueue.delete(nextCallbackElement);
            this.currentCallbackElement = nextCallbackElement;

            this.currentCallbackId = ((window as unknown) as WindowWithIdleCallback).requestIdleCallback(
                this.handleIdleCallback,
                { timeout: this.idleCallbackTimeout }
            );
        };

        /**
         *  Handle callback
         */
        private handleIdleCallback = (): void => {
            if (this.currentCallback) {
                this.currentCallback();
            }
            this.currentCallbackId = undefined;
            this.currentCallbackElement = undefined;
            this.currentCallback = undefined;
            window.setTimeout(() => {
                this.nextCallback();
            }, this.idleCallbackInterval);
        };
    };

    attr({ attribute: "virtualization-disabled", mode: "boolean" })(
        C.prototype,
        "virtualizationEnabled"
    );
    attr(C.prototype, "viewport");
    attr({ attribute: "item-size", converter: nullableNumberConverter })(
        C.prototype,
        "itemSize"
    );
    attr({ attribute: "viewport-buffer", converter: nullableNumberConverter })(
        C.prototype,
        "viewportBuffer"
    );
    attr(C.prototype, "orientation");
    attr({ attribute: "auto-update-mode" })(C.prototype, "autoUpdateMode");
    attr({ attribute: "auto-resize-items" })(C.prototype, "autoResizeItems");
    attr({ attribute: "item-load-mode" })(C.prototype, "itemLoadMode");
    attr({ attribute: "idle-callback-timeout" })(C.prototype, "idleCallbackTimeout");
    attr({ attribute: "idle-loading-suspended" })(C.prototype, "idleLoadingSuspended");

    observable(C.prototype, "sizemap");
    observable(C.prototype, "viewportElement");
    observable(C.prototype, "renderedItemMap");
    observable(C.prototype, "totalListSize");
    observable(C.prototype, "startSpacerSize");
    observable(C.prototype, "endSpacerSize");
    observable(C.prototype, "firstRenderedIndex");
    observable(C.prototype, "lastRenderedIndex");
    observable(C.prototype, "containerElement");
    observable(C.prototype, "renderItems");

    return C;
}
