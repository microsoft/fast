import { expect, test } from "@playwright/test";
import {
    type AttributeDataBindingBehaviorConfig,
    type ContentDataBindingBehaviorConfig,
    type TemplateDirectiveBehaviorConfig,
    getNextBehavior,
    type AttributeDirectiveBindingBehaviorConfig,
    getAllPartials,
    getIndexOfNextMatchingTag,
    pathResolver,
    transformInnerHTML,
    getExpressionChain,
    extractPathsFromChainedExpression,
    // traverseCachedPaths,
    type CachedPathMap,
} from "./utilities.js";

test.describe.only("utilities", async () => {
    test.describe("content", async () => {
        test("get the next content binding", async () => {
            const innerHTML = "{{text}}";
            const templateResult = getNextBehavior(innerHTML);

            expect(templateResult?.type).toEqual("dataBinding");
            expect((templateResult as ContentDataBindingBehaviorConfig)?.subtype).toEqual("content");
            expect((templateResult as ContentDataBindingBehaviorConfig)?.bindingType).toEqual("default");
            expect((templateResult as ContentDataBindingBehaviorConfig)?.openingStartIndex).toEqual(0);
            expect((templateResult as ContentDataBindingBehaviorConfig)?.openingEndIndex).toEqual(2);
            expect((templateResult as ContentDataBindingBehaviorConfig)?.closingStartIndex).toEqual(6);
            expect((templateResult as ContentDataBindingBehaviorConfig)?.closingEndIndex).toEqual(8);
        });
    });

    test.describe("attributes", async () => {
        test("get the next attribute binding", async () => {
            const innerHTML = "<input type=\"{{type}}\" disabled>";
            const templateResult = getNextBehavior(innerHTML);

            expect(templateResult?.type).toEqual("dataBinding");
            expect((templateResult as AttributeDataBindingBehaviorConfig)?.subtype).toEqual("attribute");
            expect((templateResult as AttributeDataBindingBehaviorConfig)?.aspect).toEqual(null);
            expect((templateResult as AttributeDataBindingBehaviorConfig)?.bindingType).toEqual("default");
            expect((templateResult as AttributeDataBindingBehaviorConfig)?.openingStartIndex).toEqual(13);
            expect((templateResult as AttributeDataBindingBehaviorConfig)?.openingEndIndex).toEqual(15);
            expect((templateResult as AttributeDataBindingBehaviorConfig)?.closingStartIndex).toEqual(19);
            expect((templateResult as AttributeDataBindingBehaviorConfig)?.closingEndIndex).toEqual(21);
        });

        test("get the next attribute event binding", async () => {
            const innerHTML = "<input @click=\"{handleClick()}\">";
            const templateResult = getNextBehavior(innerHTML);

            expect(templateResult?.type).toEqual("dataBinding");
            expect((templateResult as AttributeDataBindingBehaviorConfig)?.subtype).toEqual("attribute");
            expect((templateResult as AttributeDataBindingBehaviorConfig)?.aspect).toEqual("@");
            expect((templateResult as AttributeDirectiveBindingBehaviorConfig)?.bindingType).toEqual("client");
            expect((templateResult as AttributeDataBindingBehaviorConfig)?.openingStartIndex).toEqual(15);
            expect((templateResult as AttributeDataBindingBehaviorConfig)?.openingEndIndex).toEqual(16);
            expect((templateResult as AttributeDataBindingBehaviorConfig)?.closingStartIndex).toEqual(29);
            expect((templateResult as AttributeDataBindingBehaviorConfig)?.closingEndIndex).toEqual(30);
        });
    });

    test.describe("templates", async () => {
        test("when directive", async () => {
            const innerHTML = "<f-when value=\"{{show}}\">Hello world</f-when>";
            const templateResult = getNextBehavior(innerHTML);

            expect(templateResult?.type).toEqual("templateDirective");
            expect((templateResult as TemplateDirectiveBehaviorConfig)?.openingTagStartIndex).toEqual(0);
            expect((templateResult as TemplateDirectiveBehaviorConfig)?.openingTagEndIndex).toEqual(25);
            expect((templateResult as TemplateDirectiveBehaviorConfig)?.closingTagStartIndex).toEqual(36);
            expect((templateResult as TemplateDirectiveBehaviorConfig)?.closingTagEndIndex).toEqual(45);
        });
        test("when directive with content", async () => {
            const innerHTML = "Hello pluto<f-when value=\"{{show}}\">Hello world</f-when>";
            const templateResult = getNextBehavior(innerHTML);

            expect(templateResult?.type).toEqual("templateDirective");
            expect((templateResult as TemplateDirectiveBehaviorConfig)?.openingTagStartIndex).toEqual(11);
            expect((templateResult as TemplateDirectiveBehaviorConfig)?.openingTagEndIndex).toEqual(36);
            expect((templateResult as TemplateDirectiveBehaviorConfig)?.closingTagStartIndex).toEqual(47);
            expect((templateResult as TemplateDirectiveBehaviorConfig)?.closingTagEndIndex).toEqual(56);
        });
        test("when directive with binding", async () => {
            const innerHTML = "<f-when value=\"{{show}}\">{{text}}</f-when>";
            const templateResult = getNextBehavior(innerHTML);

            expect(templateResult?.type).toEqual("templateDirective");
            expect((templateResult as TemplateDirectiveBehaviorConfig)?.openingTagStartIndex).toEqual(0);
            expect((templateResult as TemplateDirectiveBehaviorConfig)?.openingTagEndIndex).toEqual(25);
            expect((templateResult as TemplateDirectiveBehaviorConfig)?.closingTagStartIndex).toEqual(33);
            expect((templateResult as TemplateDirectiveBehaviorConfig)?.closingTagEndIndex).toEqual(42);
        });
    });

    test.describe("attributes", async () => {
        test("children directive", async () => {
            const innerHTML = "<ul f-children=\"{list}\"></ul>";
            const result = getNextBehavior(innerHTML);

            expect(result?.type).toEqual("dataBinding");
            expect((result as AttributeDirectiveBindingBehaviorConfig)?.subtype).toEqual("attributeDirective")
            expect((result as AttributeDirectiveBindingBehaviorConfig)?.name).toEqual("children");
            expect((result as AttributeDirectiveBindingBehaviorConfig)?.bindingType).toEqual("client");
            expect((result as AttributeDirectiveBindingBehaviorConfig)?.openingStartIndex).toEqual(16);
            expect((result as AttributeDirectiveBindingBehaviorConfig)?.openingEndIndex).toEqual(17);
            expect((result as AttributeDirectiveBindingBehaviorConfig)?.closingStartIndex).toEqual(21);
            expect((result as AttributeDirectiveBindingBehaviorConfig)?.closingEndIndex).toEqual(22);
        });
        test("slotted directive", async () => {
            const innerHTML = "<slot f-slotted=\"{slottedNodes}\"></slot>";
            const result = getNextBehavior(innerHTML);

            expect(result?.type).toEqual("dataBinding");
            expect((result as AttributeDirectiveBindingBehaviorConfig)?.subtype).toEqual("attributeDirective")
            expect((result as AttributeDirectiveBindingBehaviorConfig)?.name).toEqual("slotted");
            expect((result as AttributeDirectiveBindingBehaviorConfig)?.bindingType).toEqual("client");
            expect((result as AttributeDirectiveBindingBehaviorConfig)?.openingStartIndex).toEqual(17);
            expect((result as AttributeDirectiveBindingBehaviorConfig)?.openingEndIndex).toEqual(18);
            expect((result as AttributeDirectiveBindingBehaviorConfig)?.closingStartIndex).toEqual(30);
            expect((result as AttributeDirectiveBindingBehaviorConfig)?.closingEndIndex).toEqual(31);
        });
        test("ref directive", async () => {
            const innerHTML = "<video f-ref=\"{video}\"></video>";
            const result = getNextBehavior(innerHTML);

            expect(result?.type).toEqual("dataBinding");
            expect((result as AttributeDirectiveBindingBehaviorConfig)?.subtype).toEqual("attributeDirective")
            expect((result as AttributeDirectiveBindingBehaviorConfig)?.name).toEqual("ref");
            expect((result as AttributeDirectiveBindingBehaviorConfig)?.bindingType).toEqual("client");
            expect((result as AttributeDirectiveBindingBehaviorConfig)?.openingStartIndex).toEqual(14);
            expect((result as AttributeDirectiveBindingBehaviorConfig)?.openingEndIndex).toEqual(15);
            expect((result as AttributeDirectiveBindingBehaviorConfig)?.closingStartIndex).toEqual(20);
            expect((result as AttributeDirectiveBindingBehaviorConfig)?.closingEndIndex).toEqual(21);
        });
    });

    test.describe("partials", async () => {
        test("get a single partial", async () => {
            const partialContent = "{{text}}";
            const partial = `<f-partial id="foo">${partialContent}</f-partial>`;
            const allPartials = getAllPartials(partial);

            expect(allPartials.foo.innerHTML).toEqual(partialContent);
            expect(allPartials.foo.startIndex).toEqual(20);
            expect(allPartials.foo.endIndex).toEqual(28);
        });
        test("get multiple partials", async () => {
            const partial1Content = "{{text}}";
            const partial2Content = "{{othertext}}";
            const partial1 = `<f-partial id="foo">${partial1Content}</f-partial>`;
            const partial2 = `<f-partial id="foobar">${partial2Content}</f-partial>`;
            const allPartials = getAllPartials(`${partial1}${partial2}`);

            expect(allPartials.foo.innerHTML).toEqual(partial1Content);
            expect(allPartials.foo.startIndex).toEqual(20);
            expect(allPartials.foo.endIndex).toEqual(28);

            expect(allPartials.foobar.innerHTML).toEqual(partial2Content);
            expect(allPartials.foobar.startIndex).toEqual(63);
            expect(allPartials.foobar.endIndex).toEqual(76);
        });
    });

    test.describe("getIndexOfNextMatchingTag", async () => {
        test("should resolve a single tag", async () => {
            const index = getIndexOfNextMatchingTag(
                `<div>Hello world</div>`,
                `<div`,
                `</div>`,
                0
            );

            expect(index).toEqual(16);
        });
        test("should resolve when there is a nested tag", async () => {
            const index = getIndexOfNextMatchingTag(
                `<div><div>Hello world</div></div>`,
                `<div`,
                `</div>`,
                0
            );

            expect(index).toEqual(27);
        });
        test("should get adjacent tags", async () => {
            const index = getIndexOfNextMatchingTag(
                `<div>Hello world</div><div>Hello pluto</div>`,
                `<div`,
                `</div>`,
                0
            );

            expect(index).toEqual(16);
        });
        test("should add an offset for content before the tag", async () => {
            const index = getIndexOfNextMatchingTag(
                `<div>Hello world</div>`,
                `<div`,
                `</div>`,
                23
            );

            expect(index).toEqual(39);
        });
    });

    test.describe("pathResolver", async () => {
        test("should resolve a path with no nesting", async () => {
            expect(pathResolver("foo")({ foo: "bar" }, {})).toEqual("bar");
        });
        test("should resolve a path with nesting", async () => {
            expect(pathResolver("foo.bar.bat")({ foo: { bar: { bat: "baz" }} }, {})).toEqual("baz");
        });
        test("should resolve a path with no nesting and self reference", async () => {
            expect(pathResolver("foo", true)("bar", {})).toEqual("bar");
        });
        test("should resolve a path with nesting and self reference", async () => {
            expect(pathResolver("foo.bar.bat", true)({ bar: { bat: "baz" }}, {})).toEqual("baz");
        });
        test("should resolve a path with context", async () => {
            expect(pathResolver("../foo")({}, {parent: {foo: "bar"}})).toEqual("bar");
        });
    });

    test.describe("transformInnerHTML", async () => {
        test("should resolve a single unescaped data binding", async () => {
            expect(transformInnerHTML(`{{{html}}}`)).toEqual(`<div :innerHTML="{{html}}"></div>`);
        });
        test("should resolve multiple unescaped data bindings", async () => {
            expect(transformInnerHTML(`{{{foo}}}{{{bar}}}`)).toEqual(`<div :innerHTML="{{foo}}"></div><div :innerHTML="{{bar}}"></div>`);
        });
        test("should resolve an unescaped data bindings in a mix of other data content bindings", async () => {
            expect(transformInnerHTML(`{{text1}}{{{foo}}}{{text2}}{{{bar}}}{{text3}}`)).toEqual(`{{text1}}<div :innerHTML="{{foo}}"></div>{{text2}}<div :innerHTML="{{bar}}"></div>{{text3}}`);
        });
        test("should resolve default data bindings in sequence", async () => {
            expect(transformInnerHTML(`{{text1}}{{text2}}`)).toEqual(`{{text1}}{{text2}}`);
        });
        test("should resolve an unescaped data bindings in a mix of other data attribute bindings and nesting", async () => {
            expect(
                transformInnerHTML(
                    `<div data-foo="{{text1}}">{{{foo}}}</div><div data-bar="{{text2}}"></div>{{{bar}}}<div data-bat="{{text3}}"></div>`
                )).toEqual(
                    `<div data-foo="{{text1}}"><div :innerHTML="{{foo}}"></div></div><div data-bar="{{text2}}"></div><div :innerHTML="{{bar}}"></div><div data-bat="{{text3}}"></div>`
                );
        });
        test("should resolve a non-data and non-attribute bindings", async () => {
            expect(
                transformInnerHTML(
                    `<button @click="{handleNoArgsClick()}">No arguments</button>`
                )).toEqual(
                    `<button @click="{handleNoArgsClick()}">No arguments</button>`
                );
        });
    });

    test.describe("getExpressionChain", async () => {
        test("should resolve a truthy value", async () => {
            expect(getExpressionChain("foo")).toEqual({
                expression: {
                    operator: "access",
                    left: "foo",
                    leftIsValue: false,
                    right: null,
                    rightIsValue: null,
                }
            });
        });
        test("should resolve a falsy value", async () => {
            expect(getExpressionChain("!foo")).toEqual({
                expression: {
                    operator: "!",
                    left: "foo",
                    leftIsValue: false,
                    right: null,
                    rightIsValue: null,
                }
            });
        });
        test("should resolve a path not equal to string value", async () => {
            expect(getExpressionChain("foo != 'test'")).toEqual({
                expression: {
                    operator: "!=",
                    left: "foo",
                    leftIsValue: false,
                    right: "test",
                    rightIsValue: true,
                }
            });
        });
        test("should resolve a path not equal to boolean value", async () => {
            expect(getExpressionChain("foo != false")).toEqual({
                expression: {
                    operator: "!=",
                    left: "foo",
                    leftIsValue: false,
                    right: false,
                    rightIsValue: true,
                }
            });
        });
        test("should resolve a path not equal to numerical value", async () => {
            expect(getExpressionChain("foo != 5")).toEqual({
                expression: {
                    operator: "!=",
                    left: "foo",
                    leftIsValue: false,
                    right: 5,
                    rightIsValue: true,
                }
            });
        });
        test("should resolve chained expressions", async () => {
            expect(getExpressionChain("foo != 'bat' && bar == 'baz'")).toEqual({
                expression: {
                    operator: "!=",
                    left: "foo",
                    leftIsValue: false,
                    right: "bat",
                    rightIsValue: true,
                },
                next: {
                    operator: "&&",
                    expression: {
                        operator: "==",
                        left: "bar",
                        leftIsValue: false,
                        right: "baz",
                        rightIsValue: true,
                    }
                }
            });

            expect(getExpressionChain("foo && bar")).toEqual({
                expression: {
                    operator: "access",
                    left: "foo",
                    leftIsValue: false,
                    right: null,
                    rightIsValue: null,
                },
                next: {
                    operator: "&&",
                    expression: {
                        operator: "access",
                        left: "bar",
                        leftIsValue: false,
                        right: null,
                        rightIsValue: null,
                    }
                }
            });
        });
    });

    test.describe("extractPathsFromChainedExpression", async () => {
        test("should extract paths from simple access expression", async () => {
            const expressionChain = getExpressionChain("user");
            expect(expressionChain).toBeDefined();

            const paths = extractPathsFromChainedExpression(expressionChain!);

            expect(paths.size).toEqual(1);
            expect(paths.has("user")).toBe(true);
        });

        test("should extract paths from dot notation expression", async () => {
            const expressionChain = getExpressionChain("user.name");
            expect(expressionChain).toBeDefined();

            const paths = extractPathsFromChainedExpression(expressionChain!);

            expect(paths.size).toEqual(1);
            expect(paths.has("user.name")).toBe(true);
        });

        test("should extract paths from comparison with literal values", async () => {
            const expressionChain = getExpressionChain("user.age > 18");
            expect(expressionChain).toBeDefined();

            const paths = extractPathsFromChainedExpression(expressionChain!);

            expect(paths.size).toEqual(1);
            expect(paths.has("user.age")).toBe(true);
        });

        test("should extract paths from comparison between two properties", async () => {
            const expressionChain = getExpressionChain("user.age >= admin.minAge");
            expect(expressionChain).toBeDefined();

            const paths = extractPathsFromChainedExpression(expressionChain!);

            expect(paths.size).toEqual(2);
            expect(paths.has("user.age")).toBe(true);
            expect(paths.has("admin.minAge")).toBe(true);
        });

        test("should extract paths from chained AND expressions", async () => {
            const expressionChain = getExpressionChain("isActive && user.name");
            expect(expressionChain).toBeDefined();

            const paths = extractPathsFromChainedExpression(expressionChain!);

            expect(paths.size).toEqual(2);
            expect(paths.has("isActive")).toBe(true);
            expect(paths.has("user.name")).toBe(true);
        });

        test("should extract paths from chained OR expressions", async () => {
            const expressionChain = getExpressionChain("user.isAdmin || permissions.canEdit");
            expect(expressionChain).toBeDefined();

            const paths = extractPathsFromChainedExpression(expressionChain!);

            expect(paths.size).toEqual(2);
            expect(paths.has("user.isAdmin")).toBe(true);
            expect(paths.has("permissions.canEdit")).toBe(true);
        });

        test("should extract paths from complex chained expressions", async () => {
            const expressionChain = getExpressionChain("user.age > 18 && user.status == 'active' || admin.override");
            expect(expressionChain).toBeDefined();

            const paths = extractPathsFromChainedExpression(expressionChain!);

            expect(paths.size).toEqual(3);
            expect(paths.has("user.age")).toBe(true);
            expect(paths.has("user.status")).toBe(true);
            expect(paths.has("admin.override")).toBe(true);
        });

        test("should extract paths from NOT expressions", async () => {
            const expressionChain = getExpressionChain("!user.isDisabled");
            expect(expressionChain).toBeDefined();

            const paths = extractPathsFromChainedExpression(expressionChain!);

            expect(paths.size).toEqual(1);
            expect(paths.has("user.isDisabled")).toBe(true);
        });

        test("should handle expressions with only literal values", async () => {
            const expressionChain = getExpressionChain("5 > 3");
            expect(expressionChain).toBeDefined();

            const paths = extractPathsFromChainedExpression(expressionChain!);

            expect(paths.size).toEqual(0);
        });

        test("should handle mixed literal and property expressions", async () => {
            const expressionChain = getExpressionChain("count > 0 && status == 'ready'");
            expect(expressionChain).toBeDefined();

            const paths = extractPathsFromChainedExpression(expressionChain!);

            expect(paths.size).toEqual(2);
            expect(paths.has("count")).toBe(true);
            expect(paths.has("status")).toBe(true);
        });

        test("should deduplicate identical paths", async () => {
            const expressionChain = getExpressionChain("user.name && user.name != 'anonymous'");
            expect(expressionChain).toBeDefined();

            const paths = extractPathsFromChainedExpression(expressionChain!);

            expect(paths.size).toEqual(1);
            expect(paths.has("user.name")).toBe(true);
        });

        test("should handle HTML entity operators", async () => {
            const expressionChain = getExpressionChain("isValid &amp;&amp; data.ready");
            expect(expressionChain).toBeDefined();

            const paths = extractPathsFromChainedExpression(expressionChain!);

            expect(paths.size).toEqual(2);
            expect(paths.has("isValid")).toBe(true);
            expect(paths.has("data.ready")).toBe(true);
        });

        test("should handle deeply nested property paths", async () => {
            const expressionChain = getExpressionChain("app.user.profile.settings.theme");
            expect(expressionChain).toBeDefined();

            const paths = extractPathsFromChainedExpression(expressionChain!);

            expect(paths.size).toEqual(1);
            expect(paths.has("app.user.profile.settings.theme")).toBe(true);
        });
    });

    // test.describe("should traverse and get a resolver from cached paths", async () => {
    //     test("should traverse a CachePathMap and return no resolvers when the given property has no paths and is undefined", async () => {
    //         const cachedPaths: CachedPathMap = {};

    //         const resolvers = traverseCachedPaths("a", {}, cachedPaths);

    //         expect(resolvers).toEqual([]);
    //     });
    //     test("should traverse a CachePathMap and return no resolvers when the given property does not have the path", async () => {
    //         const cachedPaths: CachedPathMap = {
    //             "a": {
    //                 type: "default",
    //                 paths: {}
    //             }
    //         };

    //         const resolvers = traverseCachedPaths("a", {}, cachedPaths);

    //         expect(resolvers).toEqual([]);
    //     });
    //     test("should traverse a CachePathMap and return no resolver when the given property does have a path but there is no data", async () => {
    //         const cachedPaths: CachedPathMap = {
    //             "a": {
    //                 type: "default",
    //                 paths: {
    //                     b: {
    //                         type: "access",
    //                         relativePath: "a.b",
    //                         absolutePath: "a.b",
    //                     }
    //                 }
    //             }
    //         };

    //         const resolvers = traverseCachedPaths("a", {}, cachedPaths);

    //         expect(resolvers).toEqual([]);
    //     });
    //     test("should traverse a CachePathMap and return a resolver when the given property does have a path and there is data", async () => {
    //         const cachedPaths: CachedPathMap = {
    //             "a": {
    //                 type: "default",
    //                 paths: {
    //                     "a.b": {
    //                         type: "access",
    //                         relativePath: "a.b",
    //                         absolutePath: "a.b",
    //                     }
    //                 }
    //             }
    //         };

    //         const resolvers = traverseCachedPaths(
    //             "a",
    //             {
    //                 a: {
    //                     b: {}
    //                 }
    //             },
    //             cachedPaths
    //         );

    //         expect(resolvers.length).toEqual(1);
    //         expect(resolvers[0].type).toEqual("object");
    //         expect(resolvers[0].propertyName).toEqual("b");
    //         expect(resolvers[0].paths.length).toEqual(0);
    //     });
    //     test("should traverse a CachePathMap and return multiple resolvers when the given property has multiple paths and there is data", async () => {
    //         const cachedPaths: CachedPathMap = {
    //             "a": {
    //                 type: "default",
    //                 paths: {
    //                     "a.b": {
    //                         type: "access",
    //                         relativePath: "a.b",
    //                         absolutePath: "a.b",
    //                     },
    //                     "a.c": {
    //                         type: "access",
    //                         relativePath: "a.c",
    //                         absolutePath: "a.c",
    //                     },
    //                     "a.d": {
    //                         type: "access",
    //                         relativePath: "a.d",
    //                         absolutePath: "a.d",
    //                     }
    //                 }
    //             }
    //         };

    //         const resolvers = traverseCachedPaths(
    //             "a",
    //             {
    //                 a: {
    //                     b: { value: "test1" },
    //                     c: { value: "test2" },
    //                     d: { value: "test3" }
    //                 }
    //             },
    //             cachedPaths
    //         );

    //         expect(resolvers.length).toEqual(3);
    //         expect(resolvers[0].type).toEqual("object");
    //         expect(resolvers[0].propertyName).toEqual("b");
    //         expect(resolvers[1].type).toEqual("object");
    //         expect(resolvers[1].propertyName).toEqual("c");
    //         expect(resolvers[2].type).toEqual("object");
    //         expect(resolvers[2].propertyName).toEqual("d");
    //     });
    //     test("should traverse a CachePathMap and return nested resolvers when the given property has nested paths and there is data", async () => {
    //         const cachedPaths: CachedPathMap = {
    //             "a": {
    //                 type: "default",
    //                 paths: {
    //                     "a.b.c": {
    //                         type: "access",
    //                         relativePath: "a.b.c",
    //                         absolutePath: "a.b.c",
    //                     },
    //                 }
    //             }
    //         };

    //         const resolvers = traverseCachedPaths(
    //             "a",
    //             {
    //                 a: {
    //                     b: {
    //                         c: { value: "test1" },
    //                     }
    //                 }
    //             },
    //             cachedPaths
    //         );

    //         expect(resolvers.length).toEqual(1);
    //         expect(resolvers[0].type).toEqual("object");
    //         expect(resolvers[0].propertyName).toEqual("b");
    //         expect(resolvers[0].paths.length).toEqual(1);
    //         expect(resolvers[0].paths[0].type).toEqual("object");
    //         expect(resolvers[0].paths[0].propertyName).toEqual("c");
    //         expect(resolvers[0].paths[0].paths.length).toEqual(0);
    //     });
    //     test("should traverse a CachePathMap and return deeply nested resolvers when the given property has nested paths and there is data", async () => {
    //         const cachedPaths: CachedPathMap = {
    //             "a": {
    //                 type: "default",
    //                 paths: {
    //                     "a.b.c.d": {
    //                         type: "access",
    //                         relativePath: "a.b.c.d",
    //                         absolutePath: "a.b.c.d",
    //                     },
    //                 }
    //             }
    //         };

    //         const resolvers = traverseCachedPaths(
    //             "a",
    //             {
    //                 a: {
    //                     b: {
    //                         c: {
    //                             d: { value: "test1" },
    //                         }
    //                     }
    //                 }
    //             },
    //             cachedPaths
    //         );

    //         expect(resolvers.length).toEqual(1);
    //         expect(resolvers[0].type).toEqual("object");
    //         expect(resolvers[0].propertyName).toEqual("b");
    //         expect(resolvers[0].paths.length).toEqual(1);
    //         expect(resolvers[0].paths[0].type).toEqual("object");
    //         expect(resolvers[0].paths[0].propertyName).toEqual("c");
    //         expect(resolvers[0].paths[0].paths.length).toEqual(1);
    //         expect(resolvers[0].paths[0].paths[0].type).toEqual("object");
    //         expect(resolvers[0].paths[0].paths[0].propertyName).toEqual("d");
    //         expect(resolvers[0].paths[0].paths[0].paths.length).toEqual(0);
    //     });
    //     test("should traverse a CachePathMap and return resolvers when the given property is an array", async () => {
    //         const cachedPaths: CachedPathMap = {
    //             "items": {
    //                 type: "repeat",
    //                 context: "item",
    //                 paths: {
    //                     "item.a": {
    //                         type: "access",
    //                         relativePath: "item.a",
    //                         absolutePath: "items.__index__.a",
    //                     },
    //                 }
    //             }
    //         };

    //         const resolvers = traverseCachedPaths(
    //             "items",
    //             {
    //                 items: [
    //                     {
    //                         a: "foo"
    //                     },
    //                     {
    //                         a: "bar"
    //                     }
    //                 ]
    //             },
    //             cachedPaths
    //         );

    //         expect(resolvers.length).toEqual(2);
    //         expect(resolvers[0].type).toEqual("object");
    //         expect(resolvers[0].propertyName).toEqual(0);
    //         expect(resolvers[0].paths.length).toEqual(0);
    //         expect(resolvers[1].type).toEqual("object");
    //         expect(resolvers[1].propertyName).toEqual(1);
    //         expect(resolvers[1].paths.length).toEqual(0);
    //     });
    //     test("should traverse a CachePathMap and return resolvers when the given property is an array with nested objects", async () => {
    //         const cachedPaths: CachedPathMap = {
    //             "items": {
    //                 type: "repeat",
    //                 context: "item",
    //                 paths: {
    //                     "item.a.b": {
    //                         type: "access",
    //                         relativePath: "item.a.b",
    //                         absolutePath: "items.__index__.a.b",
    //                     },
    //                 }
    //             }
    //         };

    //         const resolvers = traverseCachedPaths(
    //             "items",
    //             {
    //                 items: [
    //                     {
    //                         a: {
    //                             b: {
    //                                 c: "foo"
    //                             }
    //                         }
    //                     },
    //                     {
    //                         a: {
    //                             b: {
    //                                 c: "bar"
    //                             }
    //                         }
    //                     }
    //                 ]
    //             },
    //             cachedPaths
    //         );

    //         expect(resolvers.length).toEqual(2);
    //         expect(resolvers[0].type).toEqual("object");
    //         expect(resolvers[0].propertyName).toEqual(0);
    //         expect(resolvers[0].paths.length).toEqual(1);
    //         expect(resolvers[0].paths[0].type).toEqual("object");
    //         expect(resolvers[0].paths[0].propertyName).toEqual("a");
    //         expect(resolvers[0].paths[0].paths.length).toEqual(0);
    //         expect(resolvers[1].type).toEqual("object");
    //         expect(resolvers[1].propertyName).toEqual(1);
    //         expect(resolvers[1].paths.length).toEqual(1);
    //         expect(resolvers[1].paths[0].type).toEqual("object");
    //         expect(resolvers[1].paths[0].propertyName).toEqual("a");
    //         expect(resolvers[1].paths[0].paths.length).toEqual(0);
    //     });
    //     test("should traverse a CachePathMap and return resolvers when the given property is an array with deeply nested objects", async () => {
    //         const cachedPaths: CachedPathMap = {
    //             "items": {
    //                 type: "repeat",
    //                 context: "item",
    //                 paths: {
    //                     "item.a.b.c": {
    //                         type: "access",
    //                         relativePath: "item.a.b.c",
    //                         absolutePath: "items.__index__.a.b.c",
    //                     },
    //                 }
    //             }
    //         };

    //         const resolvers = traverseCachedPaths(
    //             "items",
    //             {
    //                 items: [
    //                     {
    //                         a: {
    //                             b: {
    //                                 c: "foo"
    //                             }
    //                         }
    //                     },
    //                     {
    //                         a: {
    //                             b: {
    //                                 c: "bar"
    //                             }
    //                         }
    //                     }
    //                 ]
    //             },
    //             cachedPaths
    //         );

    //         expect(resolvers.length).toEqual(2);
    //         expect(resolvers[0].type).toEqual("object");
    //         expect(resolvers[0].propertyName).toEqual(0);
    //         expect(resolvers[0].paths.length).toEqual(1);
    //         expect(resolvers[0].paths[0].type).toEqual("object");
    //         expect(resolvers[0].paths[0].propertyName).toEqual("a");
    //         expect(resolvers[0].paths[0].paths.length).toEqual(1);
    //         expect(resolvers[0].paths[0].paths[0].type).toEqual("object");
    //         expect(resolvers[0].paths[0].paths[0].propertyName).toEqual("b");
    //         expect(resolvers[0].paths[0].paths[0].paths.length).toEqual(0);
    //         expect(resolvers[1].type).toEqual("object");
    //         expect(resolvers[1].propertyName).toEqual(1);
    //         expect(resolvers[1].paths.length).toEqual(1);
    //         expect(resolvers[1].paths[0].type).toEqual("object");
    //         expect(resolvers[1].paths[0].propertyName).toEqual("a");
    //         expect(resolvers[1].paths[0].paths.length).toEqual(1);
    //         expect(resolvers[1].paths[0].paths[0].type).toEqual("object");
    //         expect(resolvers[1].paths[0].paths[0].propertyName).toEqual("b");
    //         expect(resolvers[1].paths[0].paths[0].paths.length).toEqual(0);
    //     });
    //     test.only("should traverse a CachePathMap and return resolvers when the given property is an object containing an array", async () => {
    //         const cachedPaths: CachedPathMap = {
    //             "obj": {
    //                 type: "default",
    //                 paths: {
    //                     "items": {
    //                         type: "repeat",
    //                         context: "item",
    //                         paths: {
    //                             "item.a": {
    //                                 type: "access",
    //                                 relativePath: "item.a",
    //                                 absolutePath: "items.__index__.a",
    //                             },
    //                         }
    //                     }
    //                 }
    //             }
    //         };

    //         const resolvers = traverseCachedPaths(
    //             "obj",
    //             {
    //                 obj: {
    //                     items: [
    //                         {
    //                             a: "foo"
    //                         },
    //                     ]
    //                 }
    //             },
    //             cachedPaths
    //         );

    //         expect(resolvers.length).toEqual(1);
    //         expect(resolvers[0].type).toEqual("array");
    //         expect(resolvers[0].propertyName).toEqual("items");
    //         expect(resolvers[0].paths.length).toEqual(1);
    //         expect(resolvers[0].paths[0].type).toEqual("object");
    //         expect(resolvers[0].paths[0].propertyName).toEqual(0);
    //         expect(resolvers[0].paths[0].paths.length).toEqual(0);
    //     });
    // });
});
