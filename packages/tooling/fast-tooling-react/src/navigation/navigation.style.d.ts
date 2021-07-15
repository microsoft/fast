import { ComponentStyles } from "@microsoft/fast-jss-manager-react";
export interface NavigationClassNameContract {
    navigation?: string;
    navigation_itemRegion?: string;
    navigation_item?: string;
    navigation_item__active?: string;
    navigation_item__draggable?: string;
    navigation_item__droppable?: string;
    navigation_item__expandable?: string;
    navigation_item__hover?: string;
    navigation_item__hoverBefore?: string;
    navigation_item__hoverAfter?: string;
    navigation_itemExpandTrigger?: string;
    navigation_itemContent?: string;
    navigation_itemList?: string;
    navigation_itemDisplayTextInput?: string;
}
declare const styles: ComponentStyles<NavigationClassNameContract, {}>;
export default styles;
