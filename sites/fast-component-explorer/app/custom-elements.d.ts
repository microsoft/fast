// custom-elements.d.ts
declare namespace JSX {
    interface IntrinsicElements {
        "fast-tab": React.DetailedHTMLProps<
            React.HTMLAttributes<HTMLElement>,
            HTMLElement
        > & {
            events?: {
                click?: (e: React.MouseEvent<HTMLElement>) => void;
            };
        };
        "fast-tabs": React.DetailedHTMLProps<
            React.HTMLAttributes<HTMLElement>,
            HTMLElement
        > & {
            events?: {
                change?: (e: React.ChangeEvent<HTMLElement>) => void;
            };
        };
        "fast-tab-panel": React.DetailedHTMLProps<
            React.HTMLAttributes<HTMLElement>,
            HTMLElement
        > & {};
    }
}

/**
 * Satisfy TypeScript importing modules without typings
 */
declare module "@skatejs/val";
