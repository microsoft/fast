import React from "react";
import ReactDOM from "react-dom";
import rafThrottle from "raf-throttle";
import { SelectedComponentIndicator } from "./selected-component-indicator";

export interface WrapperProps {
    dictionaryId: string;
    activeDictionaryId: string | null;
    onUpdateDictionaryId: (dictionaryId: string) => void;
}

export interface WrapperState {
    mouseOver: boolean;
    x: number | null;
    y: number | null;
    width: number | null;
    height: number | null;
}

export class Wrapper extends React.Component<WrapperProps, WrapperState> {
    /**
     * The reference to the wrapped component
     */
    private wrappedComponentRef: HTMLElement;

    /**
     * The reference to the indicator
     */
    private selectedIndicatorRef: React.RefObject<any>;

    private updatePropertyName: RegExp = /margin|padding|^(?:top|bottom|left|right)$|width|height/;

    private handleMouseOver: () => void = this.createMouseOverCallback(true);
    private handleMouseOut: () => void = this.createMouseOverCallback(false);

    constructor(props: any) {
        super(props);

        this.selectedIndicatorRef = React.createRef();

        this.state = {
            mouseOver: false,
            x: 0,
            y: 0,
            width: 0,
            height: 0,
        };
    }

    public render(): React.ReactNode {
        return (
            <React.Fragment>
                {this.props.children}
                {this.selectionIndicator(
                    this.props.dictionaryId === this.props.activeDictionaryId
                )}
            </React.Fragment>
        );
    }

    public componentDidMount(): void {
        if (this.selectedIndicatorRef.current !== null) {
            this.wrappedComponentRef = this.selectedIndicatorRef.current.previousSibling;
        }
        this.validatePosition();
        /* eslint-disable-next-line react/no-find-dom-node */
        const node: Element | Text | null = ReactDOM.findDOMNode(
            this.wrappedComponentRef
        );

        if (node instanceof HTMLElement) {
            node.addEventListener("transitionstart", this.validatePosition);
            node.addEventListener("mouseover", this.handleMouseOver);
            node.addEventListener("mouseout", this.handleMouseOut);
            node.addEventListener("mousedown", this.handleClick);
        }

        window.addEventListener("resize", this.validatePosition);
        window.addEventListener("scroll", this.validatePosition);
        window.addEventListener("transitionend", this.handleTransition);
        document.body.addEventListener("load", this.handleImageLoad, { capture: true });
    }

    public componentWillUnmount(): void {
        /* eslint-disable-next-line react/no-find-dom-node */
        const node: Element | Text | null = ReactDOM.findDOMNode(
            this.wrappedComponentRef
        );

        if (node instanceof HTMLElement) {
            node.removeEventListener("transitionstart", this.validatePosition);
            node.removeEventListener("mouseover", this.handleMouseOver);
            node.removeEventListener("mouseout", this.handleMouseOut);
            node.removeEventListener("mousedown", this.handleClick);
        }
        window.removeEventListener("resize", this.validatePosition);
        window.removeEventListener("scroll", this.validatePosition);
        window.removeEventListener("transitionend", this.handleTransition);
        document.body.removeEventListener("load", this.handleImageLoad, {
            capture: true,
        });
    }

    public componentDidUpdate(): void {
        // React seems to stutter and we end up with CSS transitions
        // unless we fire this async. Repro is putting two typography components in the viewer
        // and then clicking between them. Not sure why, but setting this to fire async seems to
        // fix the issue
        window.setTimeout(this.validatePosition, 0);
    }

    private selectionIndicator(isActive: boolean): React.ReactNode {
        const {
            x,
            y,
            width,
            height,
        }: Pick<WrapperState, "x" | "y" | "width" | "height"> = this.state;

        if (x === null || y === null || width === null || height === null) {
            return null;
        }

        return (
            <SelectedComponentIndicator
                x={x}
                y={y}
                active={isActive}
                width={width}
                height={height}
                preselect={this.state.mouseOver}
                ref={this.selectedIndicatorRef}
            />
        );
    }

    private handleClick = (e: MouseEvent): void => {
        e.stopPropagation();

        this.props.onUpdateDictionaryId(this.props.dictionaryId);
    };

    private handleImageLoad = (e: UIEvent): void => {
        if (e.target && e.target instanceof HTMLElement && e.target.tagName === "IMG") {
            this.validatePosition();
        }
    };

    private handleTransition = (e: TransitionEvent): void => {
        if (e.propertyName.match(this.updatePropertyName)) {
            this.validatePosition();
        }
    };

    private createMouseOverCallback(value: boolean): () => void {
        return (): void => {
            if (this.state.mouseOver !== value) {
                this.setState({ mouseOver: value });
            }
        };
    }

    private validatePosition: () => void = rafThrottle((): void => {
        /* eslint-disable-next-line react/no-find-dom-node */
        const element: Element | Text | null = ReactDOM.findDOMNode(
            this.wrappedComponentRef
        );

        if (!(element instanceof Element)) {
            return;
        }

        const {
            x,
            y,
            width,
            height,
        }: DOMRect = element.getBoundingClientRect() as DOMRect;

        if (Math.round(x) !== this.state.x) {
            this.setState({ x: Math.round(x) });
        }

        if (Math.round(y) !== this.state.y) {
            this.setState({ y: Math.round(y) });
        }

        if (Math.round(width) !== this.state.width) {
            this.setState({ width: Math.round(width) });
        }

        if (Math.round(height) !== this.state.height) {
            this.setState({ height: Math.round(height) });
        }
    });
}
