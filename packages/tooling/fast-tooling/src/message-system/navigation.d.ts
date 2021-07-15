import { NavigationConfig, NavigationConfigDictionary } from "./navigation.props";
import { SchemaDictionary } from "./schema.props";
import { DataDictionary, Parent } from "./data.props";
export declare function getNavigation(
    schema: any,
    data?: any,
    parent?: Parent,
    displayTextDataLocation?: string
): NavigationConfig;
export declare function getNavigationDictionary(
    schemaDictionary: SchemaDictionary,
    data: DataDictionary<unknown>,
    displayTextDataLocation?: string
): NavigationConfigDictionary;
