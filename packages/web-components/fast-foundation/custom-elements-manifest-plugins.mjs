import { getClassMemberDoc } from "@custom-elements-manifest/analyzer/src/utils/manifest-helpers.js";
import { parse } from "comment-parser";

/**
 * Code for this plugin was mostly copied from: https://github.com/bennypowers/cem-plugins/tree/main/plugins/cem-plugin-jsdoc-example
 */

/**
 * Does the AST node have JSDoc tags?
 * @template {import('typescript').Node} N
 * @param  {N}  node
 * @return {node is N & { jsDoc: import('typescript').JSDoc[] }}
 */
function hasJsDocComments(node) {
    return "jsDoc" in node;
}

/**
 * Given a manifest and a declaration name, get the declaration doc
 * @param  {Partial<import("custom-elements-manifest/schema").Module>} moduleDoc
 * @param  {string} name
 * @return {import("custom-elements-manifest/schema").Declaration}
 */
function getDeclarationDoc(moduleDoc, name) {
    return moduleDoc.declarations.find(x => x.name === name);
}

/**
 * Fix a Node's JSDoc link comments
 * @param {import('typescript').Node & { jsDoc: import('typescript').JSDoc[] }} node
 * @param {import("custom-elements-manifest/schema").Declaration} doc
 * @param {*} context
 * @param {number} [offset=0]
 */
function fixLinks(node, doc, context, offset = 0) {
    node?.jsDoc?.forEach(jsDoc => {
        const parsed = parse(jsDoc?.getFullText());
        parsed?.forEach(parsedJsDoc => {
            if (
                parsedJsDoc.description &&
                parsedJsDoc.description.indexOf("{@link") >= 0
            ) {
                doc.description = parsedJsDoc.description.trim();
            }
        });
    });
}

/**
 * @return {import('@custom-elements-manifest/analyzer').Plugin}
 */
export function jsdocLinkFix() {
    return {
        name: "jsdoc-example",
        analyzePhase({ ts, node, moduleDoc, context }) {
            if (!hasJsDocComments(node)) return;
            if (ts.isClassDeclaration(node)) {
                const className = node.name.getText();
                const classDoc = getDeclarationDoc(moduleDoc, className);
                if (!classDoc)
                    return (
                        context.dev &&
                        console.warn(
                            `[jsdoc-example]: Could not find class ${className} in module doc for path ${moduleDoc.path}`
                        )
                    );
                fixLinks(node, classDoc, context);
            } else if (ts.isPropertyDeclaration(node)) {
                const propertyName = node.name.getText();
                const className = node.parent?.name?.getText?.();
                const classDoc = getDeclarationDoc(moduleDoc, className);
                if (!classDoc) return;
                const isStatic = node.modifiers?.some?.(
                    x => x.kind === ts.SyntaxKind.StaticKeyword
                );
                const propertyDoc = getClassMemberDoc(
                    moduleDoc,
                    className,
                    propertyName,
                    isStatic
                );
                if (!propertyDoc)
                    return (
                        context.dev &&
                        console.warn(
                            `[jsdoc-example]: Could not find property ${propertyName} of ${className} in module doc for path ${moduleDoc.path}`
                        )
                    );
                fixLinks(node, propertyDoc, context, 1);
            } else if (ts.isMethodDeclaration(node)) {
                if (!ts.isClassDeclaration(node.parent)) return;
                const methodName = node.name.getText();
                const className = node.parent.name.getText();
                const classDoc = getDeclarationDoc(moduleDoc, className);
                if (!classDoc) return;
                const isStatic = node.modifiers?.some?.(
                    x => x.kind === ts.SyntaxKind.StaticKeyword
                );
                const methodDoc = getClassMemberDoc(
                    moduleDoc,
                    className,
                    methodName,
                    isStatic
                );
                if (!methodDoc)
                    return (
                        context.dev &&
                        console.warn(
                            `[jsdoc-example]: Could not find method ${methodName} of ${className} in module doc for path ${moduleDoc.path}`
                        )
                    );
                fixLinks(node, methodDoc, context, 1);
            } else if (ts.isFunctionDeclaration(node)) {
                const functionName = node.name.getText();
                const functionDoc = getDeclarationDoc(moduleDoc, functionName);
                if (!functionDoc)
                    return (
                        context.dev &&
                        console.warn(
                            `[jsdoc-example]: Could not find function ${functionName} in module doc for path ${moduleDoc.path}`
                        )
                    );
                fixLinks(node, functionDoc, context);
            } else if (ts.isVariableStatement(node)) {
                node.declarationList?.declarations.forEach(dec => {
                    const name = dec.name.getText();
                    const doc = getDeclarationDoc(moduleDoc, name);
                    if (!doc)
                        return (
                            context.dev &&
                            console.warn(
                                `[jsdoc-example]: Could not find variable ${name} in module doc for path ${moduleDoc.path}`
                            )
                        );
                    fixLinks(node, doc, context);
                });
            }
        },
    };
}
