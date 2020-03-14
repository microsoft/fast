declare namespace JSX {
    interface IntrinsicElements {
        "td-drawer": { expanded?: boolean; name: string; children?: React.ReactNode };
        "td-swatch": {
            type?: string;
            circular?: boolean;
            value: string | "none";
            orientation?: "horizontal" | "vertical";
            label?: string;
            children?: React.ReactNode;
            title?: string;
            onClick?: any;
        };
    }
}
