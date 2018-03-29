# FAST permutator (Beta)
Creates all possible data permutations from a JSON Schema.

## Use
### Permutating data sets
The main export of the permutator is to recieve a schema and any schema references.

```javascript
let schema = {
    type: "object",
    properties: {
        stringItem: {
            type: "string",
            example: "Hello World"
        },
        booleanItem: {
            type: "boolean"
        }
    },
    required: [
        "stringItem"
    ]
};

permutator(schema);
```

This will generate the following data:

```javascript
[
    {
        stringItem: "Hello World"
    },
    {
        stringItem: "Hello World"
        booleanItem: true        
    },
    {
        stringItem: "Hello World"
        booleanItem: false        
    }
]
```

If an example or a default is not provided, fake data will be generated.

### Exporting an example
An export `getExample` to retrieve an example piece of data.

```javascript
permutator.getExample(schema);
```

### Simplifying schemas
An export `simplifySchemas` is available to show all schema permutations. This can be useful for extrapolating out all possible schema combinations.

```javascript
permutator.simplifySchemas(schema, references);
```

### Finding properties
An export `getDeepPropLocations` is available to find properties within the schema.

```javascript
permutator.getDeepPropLocations(schema, propertyName);
```

### Resolve references
An export `resolveReferences` can be used to resolve the references of a schema by consolidating them with their referenced schema.

```javascript
permutator.resolveReferences(schema, references);
```

### Resolving properties
An export `resolveSchemaProps` can be used to resolve the given props for a schema.

```javascript
permutator.resolveSchemaProps(schema, ['$ref', 'allOf']);
```

## Developing
Contribute to files in the lib folder, these are the ES6 source files.

## Testing
Run `npm run test` to test the exposed utilities and schemas

## Building
Run `npm run build` to build before `npm publish` to convert files to ES5 from ES6.

## Special properties
- `whitelisted` ignores a property
- `example` is a piece of supplied example data