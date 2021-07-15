export var CSSControlType;
(function (CSSControlType) {
    CSSControlType[(CSSControlType["number"] = 0)] = "number";
    CSSControlType[(CSSControlType["text"] = 1)] = "text";
    CSSControlType[(CSSControlType["multiple"] = 2)] = "multiple";
    CSSControlType[(CSSControlType["function"] = 3)] = "function";
})(CSSControlType || (CSSControlType = {}));
export const numberFieldTypes = {
    "<angle>": {
        type: CSSControlType.number,
        append: {
            unit: ["deg", "grad", "rad", "turn"],
        },
    },
    "<dimension>": {
        type: CSSControlType.number,
        append: {
            unit: ["px", "rem", "pt", "ms", "s", "hz", "Hz"],
        },
    },
    "<flex>": {
        type: CSSControlType.number,
        append: {
            unit: ["fr"],
        },
    },
    "<integer>": {
        type: CSSControlType.number,
    },
    "<length>": {
        type: CSSControlType.number,
        append: {
            unit: ["ch", "em", "ex", "rem", "vh", "vw", "vmin", "vmax"],
        },
    },
    "<number>": {
        type: CSSControlType.number,
    },
    "<percentage>": {
        type: CSSControlType.number,
        append: {
            unit: ["%"],
        },
    },
    "<resolution>": {
        type: CSSControlType.number,
        append: {
            unit: ["dpi", "dpcm", "dppx", "x"],
        },
    },
    "<time>": {
        type: CSSControlType.number,
        append: {
            unit: ["ms", "s"],
        },
    },
    "<x>": {
        type: CSSControlType.number,
    },
    "<y>": {
        type: CSSControlType.number,
    },
};
export const textFieldTypes = {
    "<custom-ident>": {
        type: CSSControlType.text,
    },
    "<ident>": {
        type: CSSControlType.text,
    },
    "<string>": {
        type: CSSControlType.text,
    },
};
export const multipleTypes = {
    "<ratio>": {
        type: CSSControlType.multiple,
        separator: "/",
        controls: [
            {
                type: CSSControlType.number,
            },
            {
                type: CSSControlType.number,
            },
        ],
    },
};
export const functionTypes = {
    "<url>": {
        type: CSSControlType.function,
        name: "url",
        controls: [
            {
                type: CSSControlType.text,
            },
        ],
    },
    "<name-repeat>": {
        type: CSSControlType.function,
        name: "repeat",
        controls: [
            {
                type: CSSControlType.text,
            },
        ],
    },
};
export const allTypes = Object.assign(
    Object.assign(
        Object.assign(Object.assign({}, numberFieldTypes), textFieldTypes),
        multipleTypes
    ),
    functionTypes
);
