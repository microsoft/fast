# Schema and Observer Map Architecture

This document provides a technical explainer for how the `Schema` and `ObserverMap` classes work together to describe data objects and automatically observe them in FAST HTML templates using the f-template system.

## Table of Contents

1. [Overview](#overview)
2. [The Schema Class](#the-schema-class)
3. [The Observer Map Class](#the-observer-map-class)
4. [Integration with f-template](#integration-with-f-template)
5. [Initial Path Processing Flow](#initial-path-processing-flow)
6. [Dynamic Path Processing Updates](#dynamic-path-processing-updates)
7. [Observable Proxy System](#observable-proxy-system)
8. [Examples](#examples)
9. [Technical Details](#technical-details)

## Overview

The Schema and Observer Map architecture enables automatic observation of complex nested data objects in FAST HTML templates. This system solves the problem of manually tracking all the binding paths used in declarative HTML templates, automatically creating observables for nested properties that are referenced in the template bindings.

**Important**: This system is designed specifically for observable data objects (objects, arrays, and primitives). It explicitly does not handle binding paths that are assumed to be functions, methods, or other non-data constructs like event handlers.

### Key Components

- **Schema Class**: Generates JSON schemas that describe the structure and binding paths of data objects based on template analysis
- **Observer Map Class**: Uses the schema information to automatically define observable properties and create proxies for nested object observation
- **f-template Integration**: Template processing automatically populates schemas and configures observer maps during template compilation

### Supported Data Types

The system automatically handles:
- **Objects**: Nested object structures with observable properties
- **Arrays**: Arrays with observable mutations and nested object elements  
- **Primitives**: String, number, boolean values as object properties

### Explicitly Not Handled

The system does not process:
- **Function bindings**: Event handlers and method calls like `@click="{handleClick()}"`
- **Computed expressions**: Complex expressions that evaluate to non-data values
- **Non-observable constructs**: Any binding assumed to reference functions or non-data objects

## The Schema Class

The `Schema` class is responsible for building JSON Schema definitions that map the structure of data objects used in template bindings. It analyzes binding paths from template processing and constructs schemas that describe:

- Root properties and their nested structures
- Array contexts for repeat operations
- Object property relationships
- Cross-references to child components

**Important**: Each schema created corresponds to a property that will belong to the custom element's class. The schema describes the expected structure and relationships of data that will be assigned to that property, enabling automatic observation of nested objects and arrays within that property's data structure.

### Core Methods

#### Constructor
```typescript
constructor(name: string)
```
Creates a new schema instance for a specific custom element name and initializes an entry in the static `jsonSchemaMap`.

#### addPath
```typescript
public addPath(config: RegisterPathConfig)
```
Registers a binding path discovered during template processing. The configuration includes:
- `pathConfig`: Describes the path type (`access`, `default`, `repeat`, `event`)
- `rootPropertyName`: The root property this path belongs to
- `childrenMap`: Information about child components referenced in this path

**Note**: Only `access`, `default`, and `repeat` path types result in schema entries. Event paths are identified but not processed since they represent function calls rather than observable data.

#### getSchema
```typescript
public getSchema(rootPropertyName: string): JSONSchema | null
```
Retrieves the JSON schema for a specific root property.

### Path Types

The schema handles different types of binding paths:

- **`access`/`default`**: Direct property access like `{{user.name}}`
- **`repeat`**: Array iteration contexts like `{{item}}` within `<f-repeat>`
- **`event`**: Event handler bindings like `@click="{handleClick()}"` - **Note: These are explicitly not processed by the schema system as they are assumed to be functions rather than observable data objects**

### Schema Structure

Generated schemas follow JSON Schema format with FAST-specific extensions:

```typescript
{
  "$schema": "https://json-schema.org/draft/2019-09/schema",
  "$id": "https://fast.design/schemas/my-element/users.json",
  "type": "array",
  "$ref": "#/$defs/user",
  "$defs": {
    "user": {
      "$fast_context": "users",
      "$fast_parent_contexts": [null],
      "type": "object",
      "properties": {
        "name": {},
        "details": {
          "type": "object", 
          "properties": {
            "age": {}
          }
        }
      }
    }
  }
}
```

**Note on Property Types**: Properties accessed through binding paths (like `name` and `age` above) are defined with empty objects `{}` rather than specific JSON Schema types. This is because it's not possible to determine the exact primitive type (string, number, boolean, etc.) from the path syntax alone. The system focuses on structural relationships rather than specific data types for leaf properties.

## The Observer Map Class

The `ObserverMap` class uses schema information to automatically configure observable properties on custom element prototypes. It creates the infrastructure needed to observe nested object changes without manual setup.

### Constructor
```typescript
constructor(classPrototype: any, schema: Schema)
```
Creates an observer map instance that will configure the provided class prototype using the schema information.

### defineProperties
```typescript
public defineProperties(): void
```
The main method that:
1. Iterates through all root properties defined in the schema (each custom element in the jsonSchemaMap contains multiple schemas, one for each root property)
2. Defines observable properties using FAST Element's `Observable.defineProperty` (an alternative to the `@observable` decorator syntax used in custom element classes)
3. Sets up property change handlers that create proxies for nested objects

### Property Change Handling

When a root property transitions from `undefined` to a defined value, the observer map:
1. Analyzes the schema to understand the expected object structure
2. Creates proxies using the `assignObservables` utility function
3. Establishes deep observation of nested properties based on the schema of that root property

## Integration with f-template

The Schema and Observer Map classes integrate seamlessly with the f-template system:

### Template Processing Flow

1. **Template Parsing**: When an `f-template` element is processed, it creates a `Schema` instance
2. **Binding Discovery**: As template bindings are processed, paths are registered with `schema.addPath()`
3. **Observer Map Creation**: If enabled, an `ObserverMap` is instantiated with the populated schema
4. **Property Definition**: The observer map defines observable properties on the custom element prototype

### Configuration

Observer Map functionality is enabled through template element options:

```typescript
TemplateElement.options({
  "my-custom-element": {
    observerMap: "all"
  }
});
```

**Note**: Currently, `"all"` is the only available option, which enables Observer Map observation for all root properties discovered in the template. This API design allows for future updates that could specify which specific properties to allow the Observer Map to apply observation to, providing more granular control over the observation behavior.

## Initial Path Processing Flow

Here's how binding paths flow through the system during initial template processing:

1. **Template Binding**: `{{user.details.personal.name}}`
2. **Path Analysis**: Utilities identify root property (`user`) and nested path (`details.personal.name`)
3. **Type Check**: Confirms this is a data binding (not an event handler like `@click="{handleClick()}"`)
4. **Schema Registration**: 
   ```typescript
   schema.addPath({
     pathConfig: {
       type: "access",
       currentContext: null,
       parentContext: null,
       path: "user.details.personal.name"
     },
     rootPropertyName: "user",
     childrenMap: null
   });
   ```
5. **Schema Building**: Creates nested object structure in JSON schema
6. **Observable Definition**: Observer map makes `user` property observable
7. **Proxy Creation**: When `user` is assigned, proxies are created for deep observation

### Event Handler Exclusion

Event handlers are identified but explicitly excluded from schema processing:
- **Template Binding**: `@click="{handleClick()}"`
- **Path Analysis**: Utilities identify this as an event handler
- **Type Check**: Confirms this is type `"event"`
- **Schema Registration**: **Skipped** - Event handlers are not added to schemas since they represent function calls

## Dynamic Path Processing Updates

After initial schema creation and observer map setup, the system continues to dynamically update observation as data structures evolve:

### Runtime Object Assignment

When nested objects or array items become defined after initial setup:

1. **Property Assignment**: A previously undefined nested property gets assigned a value
   ```typescript
   // Initially: user.details was undefined
   user.details = { age: 30, location: { city: "Seattle" } };
   ```

2. **Schema Consultation**: The system consults the existing schema for this root property to understand expected nested structure

3. **Proxy Creation**: New proxies are automatically created for the newly assigned nested objects based on the schema definition

4. **Deep Observation Extension**: Observation is extended to all nested properties defined in the schema

### Array Item Addition

When new items are added to observed arrays:

1. **Array Mutation**: Items are added via push, splice, or direct assignment
   ```typescript
   users.push({ name: "John", details: { age: 25 } });
   ```

2. **Array Observer Trigger**: The array proxy detects the mutation and triggers observation setup

3. **Item Processing**: Each new array item is processed according to the array's context schema definition

4. **Nested Object Proxying**: New nested objects within array items are automatically proxied based on the schema structure

## Observable Proxy System

The proxy system in `utilities.ts` provides the deep observation capabilities:

### assignObservables Function

```typescript
export function assignObservables(
    schema: JSONSchema | JSONSchemaDefinition,
    rootSchema: JSONSchema,
    data: any,
    target: any,
    rootProperty: string
): typeof Proxy
```

This function:
- Analyzes the data type (object, array, primitive)
- Creates proxies for objects and arrays
- Establishes property observation for nested structures
- Handles array mutations and object property changes

### Proxy Behavior

Proxied objects:
- Trigger Observable notifications when properties change
- Automatically proxy newly assigned nested objects
- Track array mutations and splice operations
- Maintain references to root properties for change notifications

## Examples

### Basic Object Observation

**Template:**
```html
<f-template name="user-profile">
  <template>
    <div>{{user.name}} - {{user.details.age}} years old</div>
    <div>Location: {{user.details.location.city}}</div>
  </template>
</f-template>
```

**Generated Schema Structure:**
```typescript
// Root property: "user"
{
  "$schema": "https://json-schema.org/draft/2019-09/schema",
  "$id": "https://fast.design/schemas/user-profile/user.json",
  "type": "object",
  "properties": {
    "name": {},
    "details": {
      "type": "object",
      "properties": {
        "age": {},
        "location": {
          "type": "object",
          "properties": {
            "city": {}
          }
        }
      }
    }
  }
}
```

### Array with Repeat Context

**Template:**
```html
<f-template name="user-list">
  <template>
    <f-repeat>
      <template value="{{users}}" context="user">
        <div>{{user.name}} has {{user.posts.length}} posts</div>
      </template>
    </f-repeat>
  </template>
</f-template>
```

**Generated Schema Structure:**
```typescript
// Root property: "users"
{
  "$schema": "https://json-schema.org/draft/2019-09/schema",
  "$id": "https://fast.design/schemas/user-list/users.json",
  "type": "array",
  "$ref": "#/$defs/user",
  "$defs": {
    "user": {
      "$fast_context": "users",
      "$fast_parent_contexts": [null],
      "type": "object",
      "properties": {
        "name": {},
        "posts": {
          "type": "array"
        }
      }
    }
  }
}
```

### Nested Repeat Contexts

**Template:**
```html
<f-template name="complex-data">
  <template>
    <f-repeat>
      <template value="{{users}}" context="user">
        <div>{{user.name}}</div>
        <f-repeat>
          <template value="{{user.posts}}" context="post">
            <div>{{post.title}} - {{post.metadata.views}} views</div>
          </template>
        </f-repeat>
      </template>
    </f-repeat>
  </template>
</f-template>
```

This creates nested context definitions where the `post` context understands its relationship to the parent `user` context.

## Technical Details

### Static Schema Map

The `Schema` class maintains a static `CachedPathMap`:
```typescript
public static jsonSchemaMap: CachedPathMap = new Map();
```

This map structure is: `Map<customElementName, Map<rootPropertyName, JSONSchema>>`

**Rationale for Static Property**: The static nature of this map is essential for handling nested components inside f-templates. When an object or array is passed to another custom element within an f-template, that nested component needs to observe the entire root property's structure based on the binding paths within that nested component. The static map allows all components to access and contribute to the same schema definitions, ensuring consistent observation behavior across component boundaries.

### Context Tracking

The schema system tracks binding contexts using special metadata:
- `$fast_context`: The array property name that created this context
- `$fast_parent_contexts`: Chain of parent contexts leading to the root

### Performance Considerations

- **Lazy Proxy Creation**: Proxies are only created when objects are assigned to observable properties
- **Weak Map Caching**: The system uses WeakMaps to avoid memory leaks when tracking proxied objects
- **Schema Reuse**: Schemas are generated once per custom element and reused across instances

### Memory Management

- **WeakMap Usage**: `objectTargetsMap` and `observedArraysMap` use WeakMaps to automatically clean up references
- **Proxy Identification**: Proxies are marked with `$isProxy` to prevent double-proxying
- **Reference Tracking**: Target elements and root properties are tracked for proper change notification

## Debugging and Troubleshooting

### Schema Inspection

You can inspect generated schemas from any f-template custom element in the browser using the console:

```typescript
// First, select an f-template element in the browser's developer tools
// Then access the static jsonSchemaMap from the console:
$0.schema.__proto__.constructor.jsonSchemaMap

// To get a specific schema for an element and property:
const elementSchemas = $0.schema.__proto__.constructor.jsonSchemaMap.get('my-element');
const userSchema = elementSchemas?.get('users');
console.log(JSON.stringify(userSchema, null, 2));
```

### Observer Map Status

Check if observer map is enabled from the browser console by selecting an f-template element:

```typescript
// First, select an f-template element in the browser's developer tools
// Then check the element options from the console:
$0.__proto__.constructor.elementOptions

// To check a specific element's observer map setting:
const options = $0.__proto__.constructor.elementOptions['my-element'];
console.log('Observer Map enabled:', options?.observerMap === 'all');
```

### Proxy Detection

Objects processed by the system will have a `$isProxy` property:
```typescript
console.log('Is proxied:', myObject.$isProxy === true);
```