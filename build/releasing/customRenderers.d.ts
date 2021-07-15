import { PackageChangelogRenderInfo, ChangelogEntry } from "beachball";
export declare function renderHeader(
    renderInfo: PackageChangelogRenderInfo
): Promise<string>;
export declare function renderEntry(entry: ChangelogEntry): Promise<string>;
