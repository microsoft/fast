# Deep Merge Test Fixture

A comprehensive test fixture for validating the `deepMerge` utility function with FAST's observable system.

## Overview

This fixture combines multiple FAST features to thoroughly test `deepMerge` behavior:

- **Observable Arrays** - Tests array mutation tracking via splice operations
- **Nested Objects** - Deep property access with dot syntax (e.g., `user.profile.location.city`)
- **Conditional Rendering** - `f-when` directives with boolean expressions and comparisons
- **Nested Repeats** - Multiple levels: users → orders → items → tags
- **Observer Map** - Full observable tracking across all nested structures

## Data Structure

The fixture uses a realistic e-commerce data model:

```
DeepMergeTestElement
├── users[] (observable array)
│   ├── User
│   │   ├── id, name, email
│   │   ├── profile
│   │   │   ├── age
│   │   │   ├── location { city, country }
│   │   │   └── preferences { theme, notifications }
│   │   └── orders[] (nested observable array)
│   │       └── Order
│   │           ├── id, date, total
│   │           └── items[] (deeply nested array)
│   │               └── Product
│   │                   ├── id, name, price, inStock
│   │                   ├── tags[] (4th level array)
│   │                   └── metadata { views, rating }
├── showDetails (boolean for conditionals)
└── stats { totalOrders, totalRevenue, activeUsers }
```

## Test Scenarios

### 1. **Nested Object Updates** (`updateUserProfile`)
- Updates deeply nested properties
- Verifies partial merging (some properties unchanged)
- Tests: `profile.age`, `profile.location.city`, `profile.preferences.theme`

### 2. **Array Replacement** (`updateUserOrders`)
- Completely replaces an array with new data
- Tests observable array splice operations
- Verifies UI updates correctly

### 3. **Array Item Removal** (`removeOrderItems`)
- Reduces array length (2 items → 1 item)
- Tests that removed items disappear from UI
- Validates splice handles item deletion

### 4. **Nested Array Updates** (`updateProductTags`)
- Updates deeply nested arrays (tags within items within orders)
- Modifies multiple properties simultaneously
- Tests 4-level deep array structures

### 5. **Array Addition** (`addNewUser`)
- Adds new items to observable arrays
- Tests array expansion
- Verifies new items render correctly

### 6. **Conditional Rendering** (`toggleDetails`)
- Shows/hides content based on boolean flag
- Tests `f-when` integration
- Verifies conditional updates propagate

### 7. **Direct Property Mutation** (`incrementAge`)
- Updates properties without using deepMerge
- Provides baseline comparison
- Tests standard observable behavior

### 8. **Stats Object Update** (`updateStats`)
- Partial object updates
- Verifies unchanged properties remain untouched
- Tests shallow object merging

### 9. **Undefined Value Handling** (`testUndefinedMerge`)
- Validates undefined values are skipped
- Tests selective property updates
- Ensures undefined doesn't overwrite existing values

## Key Test Assertions

The spec file validates:

1. **Splice-based Updates** - Arrays maintain identity and use splice
2. **Partial Merges** - Only specified properties change
3. **Nested Updates** - Deep property paths update correctly
4. **Array Length Changes** - Items added/removed appropriately
5. **Conditional Re-evaluation** - UI responds to boolean changes
6. **Multiple Update Cycles** - Repeated operations work consistently
7. **Empty Array Handling** - Zero-length arrays render correctly
8. **Cross-cutting Updates** - Changes propagate through nested structures
