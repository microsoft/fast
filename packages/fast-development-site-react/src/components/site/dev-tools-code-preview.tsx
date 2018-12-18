import React from "react";
import { Framework } from "./dev-tools";
import { FormChildOption } from "./";
import { get, isEmpty, isObject, set, uniqueId } from "lodash-es";
import SyntaxHighlighter, {
    registerLanguage,
} from "react-syntax-highlighter/prism-light";
import jsx from "react-syntax-highlighter/languages/prism/jsx";
import vs from "./dev-tools-code-preview-style";

registerLanguage("jsx", jsx);

export interface CodePreviewProps {
    componentName: string;
    childOptions: FormChildOption[];
    framework: Framework;
    data: any;
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

export default class CodePreview extends React.Component<CodePreviewProps, {}> {
    private variables: string;

    public render(): JSX.Element {
        return (
            <SyntaxHighlighter language="jsx" style={vs}>
                {this.getCodePreview()}
            </SyntaxHighlighter>
        );
    }

    private getCodePreview(): string {
        let codePreview: string = "TBD";
        this.variables = "";

        switch (this.props.framework) {
            case Framework.react:
                codePreview = this.generateReactCodePreview(
                    this.props.componentName,
                    this.props.data,
                    "",
                    ""
                );
                break;
        }

        return this.variables + codePreview;
    }

    /**
     * Generates the react code preview as a string
     */
    private generateReactCodePreview(
        componentName: string,
        componentData: any,
        tab: string,
        location: string
    ): string {
        let renderedComponent: string = "";
        const currentTab: string = `${tab === "" ? "" : "\n"}${tab}`;
        const newTab: string = `    ${tab}`;
        const hasChildren: boolean = componentData && componentData.children;

        renderedComponent += `${currentTab}<${componentName}`;
        renderedComponent += this.generateReactAttributes(
            componentData,
            newTab,
            location
        );
        renderedComponent += this.generateReactComponent({
            hasChildren,
            componentName,
            componentData,
            tab,
            newTab,
            location,
        });

        return renderedComponent;
    }

    /**
     * Generate the syntax for the react component code preview
     */
    private generateReactComponent(componentConfig: ReactComponentConfig): string {
        if (componentConfig.hasChildren) {
            return this.generateReactChildren(
                componentConfig.componentName,
                componentConfig.componentData,
                componentConfig.tab,
                componentConfig.newTab,
                componentConfig.location
            );
        }

        return isObject(componentConfig.componentData)
            ? `${
                  this.hasOnlyChildrenOrNoProps(
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
    private generateReactChildren(
        componentName: string,
        componentData: any,
        tab: string,
        newTab: string,
        location: string
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
            renderedComponentWithChild += this.getReactChildAsComponentOrString(
                componentChildren,
                i,
                componentName,
                location,
                newTab
            );
        }

        renderedComponentWithChild += `\n${tab}</${componentName}>`;

        return renderedComponentWithChild;
    }

    private getReactChildAsComponentOrString(
        componentChildren: any[],
        index: number,
        componentName: string,
        location: string,
        newTab: string
    ): string {
        if (typeof componentChildren[index] === "object") {
            return this.generateReactCodePreview(
                this.getComponentName(componentChildren[index]),
                componentChildren[index].props,
                newTab,
                location === ""
                    ? componentName.charAt(0).toLowerCase() +
                      componentName.slice(1) +
                      index
                    : location + componentName + index
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
    private generateReactAttributes(data: any, tab: string, location: string): string {
        let attributes: string = "";

        if (data) {
            const propertyKeys: string[] = Object.keys(data);

            for (const property of propertyKeys) {
                attributes += this.getReactAttributesFromProperties(
                    property,
                    data,
                    tab,
                    location
                );
            }

            attributes += this.hasOnlyChildrenOrNoProps(propertyKeys, data) ? `` : `\n`;
        }

        return attributes;
    }

    private hasOnlyChildrenOrNoProps(propertyKeys: string[], data: any): boolean {
        return (propertyKeys.length === 1 && data.children) || propertyKeys.length === 0;
    }

    private getReactAttributesFromProperties(
        property: string,
        data: any,
        tab: string,
        location: string
    ): string {
        if (property !== "children") {
            if (isObject(data[property])) {
                return this.getReactAttributeObject(location, property, data, tab);
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
    private getReactAttributeObject(
        location: string,
        property: string,
        data: any,
        tab: string
    ): string {
        const propertyName: string =
            location === ""
                ? property
                : location + property.charAt(0).toUpperCase() + property.slice(1);
        const childrenLocations: string[] = this.findChildren(data[property], "", []);
        const propertyChildren: ReactChildren[] = this.getReactChildrenFromProperties(
            data,
            property,
            propertyName,
            childrenLocations
        );
        const attributes: string = `\n${tab}${property}={${propertyName}}`;

        this.variables += `const ${propertyName} = `;
        this.variables += `${this.replaceReactPropertyChildren(
            data[property],
            propertyChildren
        )};\n\n`;
        this.setReactChildrenVariables(childrenLocations, propertyChildren, propertyName);

        return attributes;
    }

    private getReactChildrenFromProperties(
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
    private setReactChildrenVariables(
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

                stringDataWithReactComponentNames = this.replaceReactChildrenVariableIdsWithComponent(
                    childrenLocations,
                    propertyChildren,
                    stringDataWithReactComponentNames
                );

                this.variables += `const ${propertyName}${propertyChildren[
                    i
                ].location.replace(/children|props|\./g, "")} = `;
                this.variables += `${stringDataWithReactComponentNames};\n\n`;
            }
        }
    }

    private replaceReactChildrenVariableIdsWithComponent(
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
    private replaceReactPropertyChildren(propertyData: any, children: any): string {
        let JSONStringWithReactChildComponents: string = "";
        const propertyDataWithIds: any = propertyData;

        for (const child of children) {
            const componentName: string = this.getComponentName(
                get(propertyData, child.location).children
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
    private getComponentName(component: any): string {
        let name: string = "Undefined";

        this.props.childOptions.forEach(
            (item: any): void => {
                if (item.component === component.type) {
                    name = item.name;
                }
            }
        );

        return name;
    }

    /**
     * Find children in data
     */
    private findChildren(
        data: any,
        location: string,
        childLocations: string[]
    ): string[] {
        const locations: string[] = childLocations;

        if (Array.isArray(data)) {
            locations.concat(this.findChildrenFromArray(data, location, childLocations));
        } else if (typeof data === "object" && data !== null) {
            locations.concat(this.findChildrenFromObject(data, location, childLocations));
        }

        return locations;
    }

    /**
     * Find children in an array
     */
    private findChildrenFromArray(
        data: any,
        location: string,
        childLocations: string[]
    ): string[] {
        for (let i: number = 0, dataLength: number = data.length; i < dataLength; i++) {
            return this.findChildren(
                data[i],
                `${location === "" ? "" : `${location}.`}${i}`,
                childLocations
            );
        }
    }

    /**
     * Find children in an object
     */
    private findChildrenFromObject(
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
                    this.findChildren(
                        data[item],
                        `${location === "" ? "" : `${location}.`}${item}`,
                        childLocations
                    )
                );
            }
        });

        return locations;
    }
}
