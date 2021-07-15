import { commonHTMLAttributes } from "./native/common.definition";
import * as nativeElementDefinitions from "./native";
export function extendElementDefinitions(definitions) {
    return Object.entries(definitions)
        .map(([definitionKey, definitionValue]) => {
            var _a;
            return [
                definitionKey,
                Object.assign(Object.assign({}, definitionValue), {
                    tags:
                        (_a = definitionValue.tags) === null || _a === void 0
                            ? void 0
                            : _a.map(tag => {
                                  return Object.assign(Object.assign({}, tag), {
                                      attributes: (tag.attributes || []).concat(
                                          commonHTMLAttributes
                                      ),
                                  });
                              }),
                }),
            ];
        })
        .reduce((previousValue, currentValue) => {
            return Object.assign(Object.assign({}, previousValue), {
                [currentValue[0]]: currentValue[1],
            });
        }, {});
}
const nativeElementExtendedDefinitions = extendElementDefinitions(
    nativeElementDefinitions
);
export { nativeElementDefinitions, nativeElementExtendedDefinitions };
