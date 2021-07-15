declare type ClassNamesArg = string | (() => string) | [string | (() => string), boolean];
export declare function classNames(...args: ClassNamesArg[]): string;
export {};
