// custom-elements.d.ts
declare namespace JSX {
    interface IntrinsicElements {
        "fast-design-system-provider": React.DetailedHTMLProps<
            React.HTMLAttributes<HTMLElement>,
            HTMLElement
        > & {
            "use-defaults"?: boolean;
        };
        "fast-checkbox": React.DetailedHTMLProps<
            React.HTMLAttributes<HTMLElement>,
            HTMLElement
        > & {
            events?: {
                change?: (e: React.ChangeEvent<HTMLElement>) => void;
            };
        };
        "fast-number-field": React.DetailedHTMLProps<
            React.HTMLAttributes<HTMLElement>,
            HTMLElement
        > & {
            events?: {
                input?: (e: React.ChangeEvent<HTMLElement>) => void;
            };
            step?: number;
        };
        "fast-text-field": React.DetailedHTMLProps<
            React.HTMLAttributes<HTMLElement>,
            HTMLElement
        > & {
            name?: string;
            events?: {
                input?: (e: React.ChangeEvent<HTMLElement>) => void;
            };
        };
        "fast-select": React.DetailedHTMLProps<
            React.HTMLAttributes<HTMLElement>,
            HTMLElement
        > & {
            events?: {
                change?: (e: React.ChangeEvent<HTMLElement>) => void;
            };
            props?: {
                value: string;
            };
        };
        "fast-option": React.DetailedHTMLProps<
            React.HTMLAttributes<HTMLElement>,
            HTMLElement
        > & {
            value?: string;
            selected?: string;
        };
        "fast-tooling-color-picker": React.DetailedHTMLProps<
            React.HTMLAttributes<HTMLElement>,
            HTMLElement
        > & {
            name?: string;
            value?: string;
            events?: {
                change?: (e: React.ChangeEvent<HTMLElement>) => void;
            };
        };
        "fast-tooling-file": React.DetailedHTMLProps<
            React.HTMLAttributes<HTMLElement>,
            HTMLElement
        > & {
            accept?: string;
            multiple?: boolean;
            disabled?: boolean;
            events?: {
                change?: (e: React.ChangeEvent<HTMLElement>) => void;
            };
            progressCallback?: (progress: number) => Promise<void>;
        };
        "fast-tooling-file-action-objecturl": React.DetailedHTMLProps<
            React.HTMLAttributes<HTMLElement>,
            HTMLElement
        > & {};
    }
}

/**
 * Satisfy TypeScript importing modules without typings
 */
declare module "@skatejs/val";
