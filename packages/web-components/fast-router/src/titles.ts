export interface TitleBuilder {
    joinTitles(parentTitle: string, childTitle: string): string;
    buildTitle(rootTitle: string, routeTitles: string[][]): string;
}

export class DefaultTitleBuilder implements TitleBuilder {
    public constructor(
        private segmentSeparator = " - ",
        private fragmentSeparator = ":"
    ) {}

    public joinTitles(parentTitle: string, childTitle: string): string {
        return parentTitle === ""
            ? childTitle
            : childTitle === ""
            ? parentTitle
            : `${parentTitle}${this.segmentSeparator}${childTitle}`;
    }

    public buildTitle(rootTitle: string, routeTitles: string[][]) {
        let title = rootTitle;

        for (const level of routeTitles) {
            if (title) {
                title = title + this.segmentSeparator;
            }

            let segment = "";

            for (const fragment of level) {
                if (segment) {
                    segment = segment + this.fragmentSeparator;
                }

                segment = segment + fragment;
            }

            title = title + segment;
        }

        return title;
    }
}
