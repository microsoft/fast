/**
 * @alpha
 */
export interface TitleBuilder {
    joinTitles(parentTitle: string, childTitle: string): string;
    buildTitle(rootTitle: string, routeTitles: string[][]): string;
}
/**
 * @alpha
 */
export declare class DefaultTitleBuilder implements TitleBuilder {
    private segmentSeparator;
    private fragmentSeparator;
    constructor(segmentSeparator?: string, fragmentSeparator?: string);
    joinTitles(parentTitle: string, childTitle: string): string;
    buildTitle(rootTitle: string, routeTitles: string[][]): string;
}
