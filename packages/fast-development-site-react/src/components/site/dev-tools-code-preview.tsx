import * as React from "react";
import { frameworkEnum } from "./dev-tools";
import { IFormChildOption } from "./";
import { get, isEmpty, isObject, set, uniqueId } from "lodash-es";

export interface ICodePreviewProps {
    componentName: string;
    childOptions: IFormChildOption[];
    framework: frameworkEnum;
    data: any;
}

export default class CodePreview extends React.Component<ICodePreviewProps, {}> {

    private variables: string;

    public render(): JSX.Element {
        return (
            <pre>
                <code>
                    {this.getCodePreview()}
                </code>
            </pre>
        );
    }

    private getCodePreview(): string {
        let codePreview: string = "TBD";

        switch (this.props.framework) {
            case frameworkEnum.react:
                codePreview = this.generateReactCodePreview(this.props.componentName, this.props.data, "", "");
                break;
        }

        return codePreview;
    }

    private generateReactCodePreview(componentName: string, componentData: any, tab: string, location: string): string {
        let renderedComponent: string = "";
        const newTab: string = `    ${tab}`;
        const hasChildren: boolean = componentData && componentData.children;

        renderedComponent += `\n${tab}<${componentName}`;
        renderedComponent += this.generateReactAttributes(componentData, newTab, location);

        if (hasChildren) {
            renderedComponent += `${tab}>`;
            const componentChildren: any[] = Array.isArray(componentData.children) ? componentData.children : [componentData.children];

            for (let i: number = 0, childrenLength: number = componentChildren.length; i < childrenLength; i++) {
                renderedComponent += this.generateReactCodePreview(
                    this.getComponentName(componentChildren[i]),
                    componentChildren[i].props,
                    newTab,
                    location === ""
                        ? componentName.charAt(0).toLowerCase() + componentName.slice(1) + i
                        : location + componentName + i
                );
            }

            renderedComponent += `\n${tab}</${componentName}>`;
        } else {
            renderedComponent += `${isEmpty(componentData) ? "" : tab}/>`;
        }

        return renderedComponent;
    }

    /**
     * Generates the React attributes for the implementation
     * based on example data
     */
    private generateReactAttributes(data: any, tab: string, location: string): string {
        let attributes: string = "";

        if (data) {
            const propertyKeys: string[] = Object.keys(data);

            for (const property of propertyKeys) {
                if (property !== "children") {
                    if (isObject(data[property])) {
                        attributes += this.getReactAttributeObject(location, property, data, tab);
                    } else if (typeof data[property] === "string") {
                        attributes += `\n${tab}${property}="${data[property]}"`;
                    } else if (typeof data[property] !== "undefined") {
                        attributes += `\n${tab}${property}={${data[property]}}`;
                    }
                }
            }

            if (Object.keys(data).length !== 0) {
                attributes += `\n`;
            } else {
                attributes += ` `;
            }
        }

        return attributes;
    }

    /**
     * Gets the attributes as a string
     */
    private getReactAttributeObject(location: string, property: string, data: any, tab: string): string {
        const propertyName: string = location === ""
            ? property
            : location + property.charAt(0).toUpperCase() + property.slice(1);
        const childrenLocations: string[] = this.findChildren(data[property], "", []);
        const propertyChildren: any[] = [];
        let attributes: string = "";

        attributes += `\n${tab}${property}={${propertyName}}`;

        if (childrenLocations.length > 0) {
            for (let i: number = childrenLocations.length - 1; i >= 0; i--) {
                propertyChildren.push({
                    id: uniqueId(),
                    propertyName,
                    location: childrenLocations[i],
                    data: get(data, `${property}.${childrenLocations[i]}.children`)
                });
            }
        }

        this.variables += `var ${propertyName} = `;
        this.variables += `${this.replaceReactPropertyChildren(data[property], propertyChildren)};\n\n`;

        if (childrenLocations.length > 0) {
            for (let i: number = childrenLocations.length - 1; i >= 0; i--) {
                let stringDataWithReactComponentNames: string = JSON.stringify(propertyChildren[i].data.props, null, 2);

                for (let j: number = childrenLocations.length - 1; j >= 0; j--) {
                    stringDataWithReactComponentNames = stringDataWithReactComponentNames.replace(
                        `"${propertyChildren[j].id}"`,
                        propertyChildren[j].component
                    );
                }

                this.variables += `var ${propertyName}${propertyChildren[i].location.replace(/children|props|\./g, "")} = `;
                this.variables += `${stringDataWithReactComponentNames};\n\n`;
            }
        }

        return attributes;
    }

    /**
     * Replaces the React properties which accept children with a formatted React component
     */
    private replaceReactPropertyChildren(propertyData: any, children: any): string {
        let JSONStringWithReactChildComponents: string = "";
        const propertyDataWithIds: any = propertyData;

        for (const child of children) {
            const componentName: string = this.getComponentName(get(propertyData, child.location).children);
            child.component = `<${componentName} {...${child.propertyName}${child.location.replace(/children|props|\./g, "")}} />`;
            set(propertyDataWithIds, `${child.location}.children`, child.id);
        }

        JSONStringWithReactChildComponents = JSON.stringify(propertyDataWithIds, null, 2);

        for (const child of children) {
            JSONStringWithReactChildComponents = JSONStringWithReactChildComponents.replace(`"${child.id}"`, child.component);
        }

        return JSONStringWithReactChildComponents;
    }

    /**
     * Derive camel cased class name from hyphenated name
     */
    private convertToCamelCase: (itemName: string) => string = (itemName: string): string => {
       itemName = `${itemName.charAt(0).toUpperCase()}${itemName.slice(1)}`;

       return itemName.replace(/-[a-z]/g, (a: string): string => {
           return a.charAt(1).toUpperCase();
       });
    }

    /**
     * Gets the component name form the component in data
     */
    private getComponentName(component: any): string {
        let name: string = "Undefined";

        this.props.childOptions.forEach((item: any): void => {
            if (item.component === component.type) {
                name = item.name;
            }
        });

        return name;
    }

    /**
     * Find children in an object
     */
    private findChildren(data: any, location: string, childLocations: string[]): string[] {
        const locations: string[] = childLocations;

        if (Array.isArray(data)) {
            for (let i: number = 0, dataLength: number = data.length; i < dataLength; i++) {
                if (typeof data[i] === "object" && typeof data[i] !== null) {
                    locations.concat(this.findChildren(data[i], `${location === "" ? "" : `${location}.`}${i}`, childLocations));
                }
            }
        } else if (typeof data === "object" && data !== null) {
            Object.keys(data).forEach((item: string) => {
                if (item === "children") {
                    locations.push(location);
                }

                if (typeof data[item] === "object") {
                    locations.concat(this.findChildren(data[item], `${location === "" ? "" : `${location}.`}${item}`, childLocations));
                }
            });
        }

        return locations;
    }
}
