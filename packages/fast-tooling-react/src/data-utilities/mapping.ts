import React from "react";
import { cloneDeep, get, isObject, set, uniqueId } from "lodash-es";
import { Plugin, PluginProps } from "./plugin";
import {
    ChildOptionItem,
    DataResolverType,
    DataType,
    idKeyword,
    MappedDataLocation,
    pluginIdKeyword,
    PluginLocation,
    PluginResolverDataMap,
    PluginResolverDataMapConfig,
    propsKeyword,
} from "./types";
import {
    getChildOptionBySchemaId,
    getDataLocationsOfChildren,
    getDataLocationsOfPlugins,
    mapSchemaLocationFromDataLocation,
    pluginFindIndexCallback,
    squareBracketsRegex,
} from "./location";

/**
 * This file contains all functionality for mapping data
 */
export interface CodePreview {
    componentName: string;
    childOptions: CodePreviewChildOption[];
    data: any;
}

export interface CodePreviewChildOption {
    name: string;
    schema: any;
}

export interface ReactChildren {
    id: string;
    propertyName: string;
    location: string;
    data: any;
    component?: any;
}

export interface ReactComponentConfig {
    hasChildren: boolean;
    componentName: string;
    componentData: any;
    tab: string;
    newTab: string;
    location: string;
}

let variables: string;

/**
 * Maps data returned from the form generator to the React components
 */
export function mapDataToComponent(
    schema: any,
    data: any,
    childOptions: ChildOptionItem[] = [],
    plugins: Array<Plugin<PluginProps>> = []
): MappedDataLocation[] {
    const mappedData: any = cloneDeep(data);

    // find locations of all items of data that are react children
    let reactChildrenDataLocations: string[] = getDataLocationsOfChildren(
        schema,
        mappedData,
        childOptions
    );

    // find locations of all items of data that are overridden by mappings
    const pluginModifiedDataLocations: PluginLocation[] = getDataLocationsOfPlugins(
        schema,
        mappedData,
        childOptions
    );

    // remove any children data locations from plugin modified locations
    reactChildrenDataLocations = reactChildrenDataLocations.filter(
        (reactChildrenDataLocation: string): string | undefined => {
            if (
                pluginModifiedDataLocations.findIndex(
                    pluginFindIndexCallback(reactChildrenDataLocation)
                ) === -1
            ) {
                return reactChildrenDataLocation;
            }
        }
    );

    // merge the plugin modified data locations with the children option data locations and categorize them
    return reactChildrenDataLocations
        .map(
            (childDataLocation: string): MappedDataLocation => {
                return {
                    mappingType: DataResolverType.component,
                    dataLocation: childDataLocation,
                };
            }
        )
        .concat(pluginModifiedDataLocations)
        .sort(orderMappedDataByDataLocation)
        .reduce((mappedDataReduced: any, mappedDataLocation: MappedDataLocation): any => {
            return resolveData(
                mappedDataLocation,
                mappedDataReduced,
                plugins,
                childOptions
            );
        }, mappedData);
}

/**
 * Maps data returned from the form generator to the code Preview
 */
export function mapDataToCodePreview(codePreview: CodePreview): string {
    let cp: string = "TBD";
    variables = "";

    cp = generateReactCodePreview(
        codePreview.componentName,
        codePreview.data,
        "",
        "",
        codePreview
    );

    return variables + cp;
}

/**
 * Gets resolved children back from the plugin
 */
function getPluginResolvedChildren(
    pluginData: any,
    pluginResolver: Plugin<PluginProps>,
    childOptions: ChildOptionItem[]
): any {
    return pluginResolver.resolver(
        get(pluginData, propsKeyword),
        getChildOptionBySchemaId(pluginData.id, childOptions)
    );
}

/**
 * Get the resolved data from a plugin and the data location to map to
 */
function getPluginResolverDataMap(
    pluginResolverDataMapConfig: PluginResolverDataMapConfig
): PluginResolverDataMap[] {
    const pluginResolverMapping: PluginResolverDataMap[] = [];

    if (pluginResolverDataMapConfig.isReactChildren) {
        if (Array.isArray(pluginResolverDataMapConfig.pluginData)) {
            pluginResolverDataMapConfig.pluginData.forEach(
                (pluginDataItem: any, index: number): void => {
                    const pluginResolverMappingItem: PluginResolverDataMap = {
                        data: getPluginResolvedChildren(
                            pluginDataItem,
                            pluginResolverDataMapConfig.pluginResolver,
                            pluginResolverDataMapConfig.childOptions
                        ),
                        dataLocation: `${
                            pluginResolverDataMapConfig.dataLocation
                        }.${index}`,
                    };

                    pluginResolverMapping.push(pluginResolverMappingItem);
                }
            );
        } else {
            const pluginResolverMappingItem: PluginResolverDataMap = {
                data: getPluginResolvedChildren(
                    pluginResolverDataMapConfig.pluginData,
                    pluginResolverDataMapConfig.pluginResolver,
                    pluginResolverDataMapConfig.childOptions
                ),
                dataLocation: pluginResolverDataMapConfig.dataLocation,
            };

            pluginResolverMapping.push(pluginResolverMappingItem);
        }
    } else {
        const pluginResolverMappingItem: PluginResolverDataMap = {
            dataLocation: pluginResolverDataMapConfig.dataLocation,
            data: pluginResolverDataMapConfig.pluginResolver.resolver(
                pluginResolverDataMapConfig.pluginData
            ),
        };

        pluginResolverMapping.push(pluginResolverMappingItem);
    }

    return pluginResolverMapping;
}

function resolveData(
    mappedDataLocation: MappedDataLocation,
    data: any,
    plugins: Array<Plugin<PluginProps>>,
    childOptions: ChildOptionItem[]
): any {
    switch (mappedDataLocation.mappingType) {
        case DataResolverType.plugin:
            return mapPluginToData(
                mappedDataLocation as PluginLocation,
                data,
                plugins,
                childOptions
            );
        case DataResolverType.component:
        default:
            return mapDataToChildren(data, mappedDataLocation.dataLocation, childOptions);
    }
}

function mapPluginToData(
    pluginModifiedDataLocation: PluginLocation,
    data: any,
    plugins: Array<Plugin<PluginProps>>,
    childOptions: ChildOptionItem[]
): any {
    const mappedData: any = cloneDeep(data);
    const pluginModifiedSchemaLocation: string = mapSchemaLocationFromDataLocation(
        pluginModifiedDataLocation.relativeDataLocation.replace(squareBracketsRegex, ""),
        pluginModifiedDataLocation.schema,
        data
    );
    const pluginId: string = get(
        pluginModifiedDataLocation.schema,
        `${pluginModifiedSchemaLocation}.${pluginIdKeyword}`
    );
    const pluginResolver: Plugin<PluginProps> = plugins.find(
        (plugin: Plugin<PluginProps>): boolean => {
            return plugin.matches(pluginId);
        }
    );
    const pluginData: any = get(data, pluginModifiedDataLocation.dataLocation);

    if (pluginResolver !== undefined) {
        getPluginResolverDataMap({
            isReactChildren: pluginModifiedDataLocation.type === DataType.children,
            pluginData,
            pluginResolver,
            childOptions,
            dataLocation: pluginModifiedDataLocation.dataLocation,
        }).forEach(
            (pluginResolverMappingItem: PluginResolverDataMap): void => {
                set(
                    mappedData,
                    pluginResolverMappingItem.dataLocation,
                    pluginResolverMappingItem.data
                );
            }
        );
    }

    return mappedData;
}

function mapDataToChildren(
    data: any,
    reactChildrenDataLocation: string,
    childOptions: ChildOptionItem[]
): any {
    const mappedData: any = cloneDeep(data);
    const subSchemaId: string = get(
        mappedData,
        `${reactChildrenDataLocation}.${idKeyword}`
    );
    const subData: any = get(mappedData, reactChildrenDataLocation);
    const isChildString: boolean = typeof subData === "string";
    const subDataNormalized: any = isChildString ? subData : get(subData, propsKeyword);
    const childOption: ChildOptionItem = getChildOptionBySchemaId(
        subSchemaId,
        childOptions
    );

    if (!isChildString) {
        let value: any;

        if (typeof childOption === "undefined") {
            value = Object.assign(
                { id: subSchemaId },
                React.createElement(
                    React.Fragment,
                    { key: uniqueId(subSchemaId) },
                    subDataNormalized
                )
            );
        } else {
            value = Object.assign(
                { id: subSchemaId },
                React.createElement(childOption.component, {
                    key: uniqueId(subSchemaId),
                    ...subDataNormalized,
                })
            );
        }

        set(mappedData, reactChildrenDataLocation, value);
    }

    return mappedData;
}

/**
 * Used as a sort compare function
 * see: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/sort
 */
function orderMappedDataByDataLocation(
    firstMapping: MappedDataLocation,
    secondMapping: MappedDataLocation
): number {
    const firstLocationLength: number = firstMapping.dataLocation.split(".").length;
    const secondLocationLength: number = secondMapping.dataLocation.split(".").length;

    if (firstLocationLength > secondLocationLength) {
        return -1;
    } else if (firstLocationLength < secondLocationLength) {
        return 1;
    }

    return 0;
}

/**
 * Generates the react code preview as a string
 */
function generateReactCodePreview(
    componentName: string,
    componentData: any,
    tab: string,
    location: string,
    codePreview: CodePreview
): string {
    let renderedComponent: string = "";
    const currentTab: string = `${tab === "" ? "" : "\n"}${tab}`;
    const newTab: string = `    ${tab}`;
    const hasChildren: boolean = componentData && componentData.children;

    renderedComponent += `${currentTab}<${componentName}`;
    renderedComponent += generateReactAttributes(
        componentData,
        newTab,
        location,
        codePreview
    );
    renderedComponent += generateReactComponent(
        {
            hasChildren,
            componentName,
            componentData,
            tab,
            newTab,
            location,
        },
        codePreview
    );

    return renderedComponent;
}

/**
 * Generate the syntax for the react component code preview
 */
function generateReactComponent(
    componentConfig: ReactComponentConfig,
    codePreview: CodePreview
): string {
    if (componentConfig.hasChildren) {
        return generateReactChildren(
            componentConfig.componentName,
            componentConfig.componentData,
            componentConfig.tab,
            componentConfig.newTab,
            componentConfig.location,
            codePreview
        );
    }

    return isObject(componentConfig.componentData)
        ? `${
              hasOnlyChildrenOrNoProps(
                  Object.keys(componentConfig.componentData),
                  componentConfig.componentData
              )
                  ? " "
                  : componentConfig.tab
          }/>`
        : ` />`;
}

/**
 * Generates the string if the component contains children
 */
function generateReactChildren(
    componentName: string,
    componentData: any,
    tab: string,
    newTab: string,
    location: string,
    codePreview: CodePreview
): string {
    let renderedComponentWithChild: string = `${
        Object.keys(componentData).length < 2 ? "" : tab
    }>`;
    const componentChildren: any[] = Array.isArray(componentData.children)
        ? componentData.children
        : [componentData.children];

    for (
        let i: number = 0, childrenLength: number = componentChildren.length;
        i < childrenLength;
        i++
    ) {
        renderedComponentWithChild += getReactChildAsComponentOrString(
            componentChildren,
            i,
            componentName,
            location,
            newTab,
            codePreview
        );
    }

    renderedComponentWithChild += `\n${tab}</${componentName}>`;

    return renderedComponentWithChild;
}

function getReactChildAsComponentOrString(
    componentChildren: any[],
    index: number,
    componentName: string,
    location: string,
    newTab: string,
    codePreview: CodePreview
): string {
    if (typeof componentChildren[index] === "object") {
        return generateReactCodePreview(
            getComponentName(componentChildren[index], codePreview),
            componentChildren[index].props,
            newTab,
            location === ""
                ? componentName.charAt(0).toLowerCase() + componentName.slice(1) + index
                : location + componentName + index,
            codePreview
        );
    } else if (typeof componentChildren[index] === "string") {
        return `\n${newTab}${componentChildren[index]}`;
    }

    return "";
}

/**
 * Generates the React attributes for the implementation
 * based on example data
 */
function generateReactAttributes(
    data: any,
    tab: string,
    location: string,
    codePreview: CodePreview
): string {
    let attributes: string = "";

    if (data) {
        const propertyKeys: string[] = Object.keys(data);

        for (const property of propertyKeys) {
            attributes += getReactAttributesFromProperties(
                property,
                data,
                tab,
                location,
                codePreview
            );
        }

        attributes += hasOnlyChildrenOrNoProps(propertyKeys, data) ? `` : `\n`;
    }

    return attributes;
}

function hasOnlyChildrenOrNoProps(propertyKeys: string[], data: any): boolean {
    return (propertyKeys.length === 1 && data.children) || propertyKeys.length === 0;
}

function getReactAttributesFromProperties(
    property: string,
    data: any,
    tab: string,
    location: string,
    codePreview: CodePreview
): string {
    if (property !== "children") {
        if (isObject(data[property])) {
            return getReactAttributeObject(location, property, data, tab, codePreview);
        } else if (typeof data[property] === "string") {
            return `\n${tab}${property}="${data[property]}"`;
        } else if (typeof data[property] !== "undefined") {
            return `\n${tab}${property}={${data[property]}}`;
        }
    }

    return "";
}

/**
 * Gets the attributes as a string
 */
function getReactAttributeObject(
    location: string,
    property: string,
    data: any,
    tab: string,
    codePreview: CodePreview
): string {
    const propertyName: string =
        location === ""
            ? property
            : location + property.charAt(0).toUpperCase() + property.slice(1);
    const childrenLocations: string[] = findChildren(data[property], "", []);
    const propertyChildren: ReactChildren[] = getReactChildrenFromProperties(
        data,
        property,
        propertyName,
        childrenLocations
    );
    const attributes: string = `\n${tab}${property}={${propertyName}}`;

    variables += `const ${propertyName} = `;
    variables += `${replaceReactPropertyChildren(
        data[property],
        propertyChildren,
        codePreview
    )};\n\n`;
    setReactChildrenVariables(childrenLocations, propertyChildren, propertyName);

    return attributes;
}

function getReactChildrenFromProperties(
    data: any,
    property: string,
    propertyName: string,
    childrenLocations: string[]
): ReactChildren[] {
    const propertyChildren: ReactChildren[] = [];

    if (childrenLocations.length > 0) {
        for (let i: number = childrenLocations.length - 1; i >= 0; i--) {
            propertyChildren.push({
                id: uniqueId(),
                propertyName,
                location: childrenLocations[i],
                data: get(data, `${property}.${childrenLocations[i]}.children`),
            });
        }
    }

    return propertyChildren;
}

/**
 * Sets the private variables to children objects
 */
function setReactChildrenVariables(
    childrenLocations: string[],
    propertyChildren: ReactChildren[],
    propertyName: string
): void {
    if (childrenLocations.length > 0) {
        for (let i: number = childrenLocations.length - 1; i >= 0; i--) {
            let stringDataWithReactComponentNames: string = JSON.stringify(
                propertyChildren[i].data.props,
                null,
                2
            );

            stringDataWithReactComponentNames = replaceReactChildrenVariableIdsWithComponent(
                childrenLocations,
                propertyChildren,
                stringDataWithReactComponentNames
            );

            variables += `const ${propertyName}${propertyChildren[i].location.replace(
                /children|props|\./g,
                ""
            )} = `;
            variables += `${stringDataWithReactComponentNames};\n\n`;
        }
    }
}

function replaceReactChildrenVariableIdsWithComponent(
    childrenLocations: string[],
    propertyChildren: ReactChildren[],
    stringDataWithReactComponentNames: string
): string {
    let updatedStringDataWithReactComponentNames: string = stringDataWithReactComponentNames;

    for (let j: number = childrenLocations.length - 1; j >= 0; j--) {
        updatedStringDataWithReactComponentNames = updatedStringDataWithReactComponentNames.replace(
            `"${propertyChildren[j].id}"`,
            propertyChildren[j].component
        );
    }

    return updatedStringDataWithReactComponentNames;
}

/**
 * Replaces the React properties which accept children with a formatted React component
 */
function replaceReactPropertyChildren(
    propertyData: any,
    children: any,
    codePreview: CodePreview
): string {
    let JSONStringWithReactChildComponents: string = "";
    const propertyDataWithIds: any = propertyData;

    for (const child of children) {
        const componentName: string = getComponentName(
            get(propertyData, child.location).children,
            codePreview
        );
        child.component = `<${componentName} {...${
            child.propertyName
        }${child.location.replace(/children|props|\./g, "")}} />`;
        set(propertyDataWithIds, `${child.location}.children`, child.id);
    }

    JSONStringWithReactChildComponents = JSON.stringify(propertyDataWithIds, null, 2);

    for (const child of children) {
        JSONStringWithReactChildComponents = JSONStringWithReactChildComponents.replace(
            `"${child.id}"`,
            child.component
        );
    }

    return JSONStringWithReactChildComponents;
}

/**
 * Gets the component name form the component in data
 */
function getComponentName(component: any, codePreview: CodePreview): string {
    let name: string = "Undefined";

    codePreview.childOptions.forEach(
        (item: any): void => {
            if (item.schema.id === component.id) {
                name = item.name;
            }
        }
    );

    return name;
}

/**
 * Find children in data
 */
// TODO: replace with getDataLocationsOfChildren from location
function findChildren(data: any, location: string, childLocations: string[]): string[] {
    const locations: string[] = childLocations;

    if (Array.isArray(data)) {
        locations.concat(findChildrenFromArray(data, location, childLocations));
    } else if (typeof data === "object" && data !== null) {
        locations.concat(findChildrenFromObject(data, location, childLocations));
    }

    return locations;
}

/**
 * Find children in an array
 */
function findChildrenFromArray(
    data: any,
    location: string,
    childLocations: string[]
): string[] {
    for (let i: number = 0, dataLength: number = data.length; i < dataLength; i++) {
        return findChildren(
            data[i],
            `${location === "" ? "" : `${location}.`}${i}`,
            childLocations
        );
    }
}

/**
 * Find children in an object
 */
function findChildrenFromObject(
    data: any,
    location: string,
    childLocations: string[]
): string[] {
    const locations: string[] = [];

    Object.keys(data).forEach((item: string) => {
        if (item === "children") {
            locations.push(location);
        }

        if (typeof data[item] === "object") {
            locations.concat(
                findChildren(
                    data[item],
                    `${location === "" ? "" : `${location}.`}${item}`,
                    childLocations
                )
            );
        }
    });

    return locations;
}
