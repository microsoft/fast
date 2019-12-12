export default {
    validBooleanRequired: true,
    invalidBooleanWrongType: "foo",
    invalidNullWrongType: "bar",
    invalidStringWrongType: false,
    invalidNumberWrongType: "bar",
    invalidEnumWrongType: "hello",
    invalidObjectWrongType: true,
    invalidObjectMissingProperty: {
        foo: "bar",
    },
    invalidArrayWrongType: "world",
    objectExample: {
        invalidBooleanWrongType: "bat",
    },
    arrayExample: [true, "foo", false, "bar", 3],
};
