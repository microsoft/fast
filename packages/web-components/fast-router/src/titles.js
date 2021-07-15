/**
 * @alpha
 */
export class DefaultTitleBuilder {
    constructor(segmentSeparator = " - ", fragmentSeparator = ":") {
        this.segmentSeparator = segmentSeparator;
        this.fragmentSeparator = fragmentSeparator;
    }
    joinTitles(parentTitle, childTitle) {
        return parentTitle === ""
            ? childTitle
            : childTitle === ""
            ? parentTitle
            : `${parentTitle}${this.segmentSeparator}${childTitle}`;
    }
    buildTitle(rootTitle, routeTitles) {
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
