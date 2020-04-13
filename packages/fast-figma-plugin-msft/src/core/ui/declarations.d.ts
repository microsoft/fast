declare namespace JSX {
    interface IntrinsicElements {
        "td-drawer": {
            key?: string;
            expanded?: boolean;
            name: string;
            children?: React.ReactNode;
        };
        "td-swatch": {
            key?: string;
            type?: string;
            circular?: boolean;
            value: string | "none";
            orientation?: "horizontal" | "vertical";
            label?: string;
            children?: React.ReactNode;
            title?: string;
            onClick?: any;
            interactive?: boolean;
            selected?: boolean;
        };
        "td-corner-radius": {
            key?: string;
            value: string;
            children?: React.ReactNode;
            orientation?: "horizontal" | "vertical";
            onClick?: any;
            interactive?: boolean;
            selected?: boolean;
        };
    }
}
