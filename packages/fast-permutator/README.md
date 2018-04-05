# FAST permutator (Beta)
The FAST permutator creates all possible data permutations from a given JSON Schema, allowing for deep testing or display of complex data sets.

## Use
### Including the permutator
Add the permutator as a required variable:
```javascript
const permutator = require('@microsoft/fast-permutator');
```

### Permutating data sets
The main export of the permutator is to recieve a schema and any schema references. For example, take this simple schema:

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

This main export permutator will generate the following data:

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
Use the export `getExample` to retrieve an example piece of data.

```javascript
permutator.getExample(schema);
```

### Simplifying schemas
Use the export `simplifySchemas` to show all schema permutations. This can be useful for extrapolating out all possible schema combinations.

```javascript
permutator.simplifySchemas(schema, references);
```

### Finding properties
Use the export `getDeepPropLocations` to find properties within the schema.

```javascript
permutator.getDeepPropLocations(schema, propertyName);
```

### Resolve references
Use the export `resolveReferences` to resolve the references of a schema by consolidating them with their referenced schema.

```javascript
permutator.resolveReferences(schema, references);
```

### Resolving properties
Use the export `resolveSchemaProps` to resolve the given props for a schema.

```javascript
permutator.resolveSchemaProps(schema, ['$ref', 'allOf']);
```

## Developing
Contribute to the ES6 source files in the lib folder.

## Testing
Run `npm run test` to test the exposed utilities and schemas

## Building
Run `npm run build` to build before `npm publish` to convert files to ES5 from ES6.

## Special properties
- `whitelisted` ignores a property
- `example` is a piece of supplied example data