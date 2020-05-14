import { attr, FASTElement, repeat } from "@microsoft/fast-element";
import {
    CommunityContentPlacementData,
    communityContentPlacementData,
} from "../../data/community.data";
import {
    FrameworkContentPlacementData,
    frameworkContentPlacementData,
} from "../../data/framework.data";

export class ContentPlacementContainer extends FASTElement {
    @attr section: string;

    communityContentPlacementData: CommunityContentPlacementData[] = communityContentPlacementData;
    frameworkContentPlacementData: FrameworkContentPlacementData[] = frameworkContentPlacementData;
}