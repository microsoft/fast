// custom-elements.d.ts
declare namespace JSX {
    interface IntrinsicElements {
        "fast-badge": React.DetailedHTMLProps<
            React.HTMLAttributes<HTMLElement>,
            HTMLElement
        > & {
            fill?: string;
            color?: string;
        };
    }
}

/**
 * Satisfy TypeScript importing modules without typings
 */
declare module "@skatejs/val";
